import * as THREE from "three";

export function Shadow(scene, room, WALL_Z, camera, domEl, navigate, gui) {
  const texLoader = new THREE.TextureLoader();
  const posters = [];
  const animated = [];
  const clock = new THREE.Clock();
  let raf = 0;

  const BASE_AUTO_SPEED = 0.0005;
  let autoRotateSpeed = BASE_AUTO_SPEED;
  let userInteracting = false;
  let lastUserAction = 0;
  const AUTO_RESUME_DELAY = 2000;
  // -1 = left, 1 = right
  let lastUserRotateDir = 1;

  // ===== tooltip =====
  const tooltip = document.createElement("div");
  tooltip.className = "shadow-tooltip";
  tooltip.style.position = "fixed";
  tooltip.style.pointerEvents = "none";
  tooltip.style.padding = "6px 8px";
  tooltip.style.background = "rgba(0,0,0,0.75)";
  tooltip.style.color = "#f7fcc5";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "13px";
  tooltip.style.fontFamily = "Schroffer Mono, monospace";
  tooltip.style.zIndex = "1999";
  tooltip.style.opacity = "0";
  tooltip.style.transition = "opacity 0.08s ease, transform 0.08s ease";
  tooltip.style.whiteSpace = "nowrap";
  document.body.appendChild(tooltip);

  function hideTooltip() {
    try {
      hoveredPoster = null;
      (domEl || document.body).style.cursor = "default";
      tooltip.style.opacity = "0";
      tooltip.style.display = "none";
    } catch (err) {}
  }

  // ===== floor text notification =====
  const floorWrap = document.createElement("div");
  floorWrap.className = "shadow-floor-wrap";
  document.body.appendChild(floorWrap);

  const floorText = document.createElement("div");
  floorText.className = "shadow-floor-text";
  floorWrap.appendChild(floorText);

  let lastShownGroup = null;
  const FLOOR_LOCK_MS = 9000;
  let floorLockUntil = 0;
  let floorTextEnabled = false;

  const FLOOR_ANIM_NAME = "shadow-floor-text-fade";
  (function ensureFloorAnim() {
    if (document.getElementById("shadow-floor-text-style")) return;
    try {
      const style = document.createElement("style");
      style.id = "shadow-floor-text-style";

      style.textContent = `@keyframes ${FLOOR_ANIM_NAME} {
        0% { opacity: 0; }
        25.00% { opacity: 1; }
        75.00% { opacity: 1; }
        100% { opacity: 0; }
      }

      .shadow-floor-wrap {
        position: fixed;
        left: 48%;
        bottom: 50px;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 1999;
      }

      .shadow-floor-text {
        position: relative;       
        font-size: 36px;    
        transform-origin: 50% 100%;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        animation-fill-mode: forwards;
        display: inline-block;
        text-align: center;
        max-width: 500px;
        line-height: 1.3;
        color: #f7fcc5;
        opacity: 0.7;
        font-family: "Charmonman", "Schroffer Mono", monospace;
        animation: ${FLOOR_ANIM_NAME} 7s linear forwards;
        transform: perspective(850px)
            translateX(-50%)
            translateZ(55px)   
            rotateX(52deg);     

        .shadow-floor-text::before {
          content: "";
          position: absolute;
          inset: -12px -28px  -18px -28px; 
          background: rgba(0,0,0,0.65);
          z-index: -1;                      
          clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
          animation: inherit;
          transform-origin: 50% 100%;
        }
      `;
      document.head.appendChild(style);
    } catch (err) {}
  })();

  const FLOOR_TEXT_BY_GROUP = {
      1: `Act II: Seeing

    Data dreams of light, or it seems.
    Through it, 
    whose eyes do we see?`,
      2: `Act III: Dreaming

    How much is enough?
    Desire, hope, and fear 
    - reflected endlessly through our encounters. `,
      3: `Act IV: Believing

    And yet, I still choose to believe.
    But in what? 
    And where will they lead me to?
    `,
      4: `Act I: Becoming

    What is it to learn?
    And what must be forgotten
    to begin again?`,
    }

  function showFloorText(groupId) {
    if (!floorTextEnabled) return; 
    try {
      lastShownGroup = groupId;
      floorLockUntil = performance.now() + FLOOR_LOCK_MS;
      floorText.style.left = "50%";
      const raw = FLOOR_TEXT_BY_GROUP[groupId] || `group ${groupId} enters.
      Lorem ipsum dolor sit amet,
      consectetur adipiscing elit.`;

      floorText.innerHTML = raw.replace(/\n/g, "<br>");

      try {
        floorText.style.animation = "none";
        floorText.offsetWidth;
      } catch (e) {}
      floorText.style.animation = `${FLOOR_ANIM_NAME} ${FLOOR_LOCK_MS / 1000}s linear forwards`;
    } catch (err) {}
  }

  function hideFloorText() {
    try {
      lastShownGroup = null;
      try {
        floorText.style.animation = "none";
      } catch (e) {}
      floorText.style.opacity = "0";
  floorText.style.transform = "perspective(800px) translateX(-50%) translateY(6px) translateZ(12px) rotateX(55deg)";
    } catch (err) {}
  }

  function showTooltip(obj, clientX, clientY) {
    try {
      hoveredPoster = obj;
      (domEl || document.body).style.cursor = "pointer";
      const name = obj.userData?.name || "";
      if (!name) return;
      tooltip.textContent = name;
      const pad = 15;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      requestAnimationFrame(() => {
        const tw = tooltip.getBoundingClientRect().width;
        const th = tooltip.getBoundingClientRect().height;
        let tx = clientX + pad;
        let ty = clientY + pad;
        if (tx + tw + 8 > vw) tx = clientX - tw - pad;
        if (ty + th + 8 > vh) ty = clientY - th - pad;
        tooltip.style.left = tx + "px";
        tooltip.style.top = ty + "px";
        tooltip.style.transform = "none";
        tooltip.style.opacity = "1";
        tooltip.style.display = "block";
      });
    } catch (err) {}
  }

  // ===== carousel root + 8 panels (45 deg) =====
  const shadowCarousel = new THREE.Group();
  scene.add(shadowCarousel);

  const panels = [];
  const PANEL_COUNT = 10;
  const R = room.ROOM_D ? room.ROOM_D * 0.45 : 14;
  const ANG_OFFSET = 0;

  for (let i = 0; i < PANEL_COUNT; i++) {
    const g = new THREE.Group();
    const ang = (i / PANEL_COUNT) * Math.PI * 2 + ANG_OFFSET;

    const x = Math.sin(ang) * R;
    const z = -Math.cos(ang) * R;
    g.position.set(x, 0, z);
    g.lookAt(0, 0, 0);

    shadowCarousel.add(g);
    panels.push(g);
  }

  const postersConfig = [
    // group 1
    {
      id: "P1",
      group: 1,
      name: "YOU ARE SO EXOTIC LOOKING – HAN DAO",
      href: "/han-dao-you-are-so-exotic-looking",
      url: "/assets/you are so exotic looking! - Hân Đào.png",
      width: 3.0,
      opacity: 0.6,
      blurPx: 5,
      rotationDeg: 10,
      pos: { mode: "uv", u: 0.204, v: 0.40 },
      float: { ampX: 0.01, ampY: 0.22, ampRotDeg: 5.9, speed: 2.3, phase: 0.3 },
    },
    {
      id: "P2",
      group: 1,
      name: "DAN ONG – HAN DAO",
      href: "/han-dao-dan-ong",
      url: "/assets/Đàn ông - Hân Đào.png",
      width: 5.2,
      opacity: 0.3,
      blurPx: 3.53,
      rotationDeg: 10,
      pos: { mode: "uv", u: 0.1, v: 0.45 },
      float: { ampX: 0.2, ampY: 0.37, ampRotDeg: 2, speed: 0.9, phase: 1.1 },
    },
    {
      id: "P3",
      group: 1,
      name: "KINH CHIEU AI – NGUYEN HOANG GIA BAO",
      href: "/nguyen-hoang-gia-bao",
      url: "/assets/Nguyễn Hoàng Gia Bảo_.png",
      width: 3.7,
      opacity: 0.7,
      blurPx: 2.4,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.15, v: 0.686 },
      float: { ampX: 0.03, ampY: 0.12, ampRotDeg: 3.5, speed: 1.25, phase: 0.6 },
    },
    {
      id: "P4",
      group: 1,
      name: "NIGHTSCAPE – VALENTIN SISMAN",
      href: "/valentin-sismann-nightscape",
      url: "/assets/Nighscape - Sismann 2.png",
      width: 1.5,
      opacity: 0.5,
      blurPx: 3.1,
      rotationDeg: 18.9,
      pos: { mode: "uv", u: 0.00, v: 0.62 },
      float: { ampX: 0.02, ampY: 0.13, ampRotDeg: 3, speed: 1.1, phase: 0.4 },
    },

    // group 2
    {
      id: "P5",
      group: 2,
      name: "G9 – IVY VO",
      href: "/ivy-vo",
      url: "/assets/G9 - Ivy Vo.png",
      width: 6.5,
      opacity: 0.15,
      blurPx: 4.86,
      rotationDeg: -10,
      pos: { mode: "uv", u: 0.23, v: 0.51 },
      float: { ampX: 0.01, ampY: 0.16, ampRotDeg: 2, speed: 0.95, phase: 0.9 },
    },
    {
      id: "P6",
      group: 2,
      name: "ART & LEISURE (CRYING) – EMILY SARTEN",
      href: "/emily-sarten",
      url: "/assets/Art & Leisure (Crying) - Emily Sarten.png",
      width: 5.5,
      opacity: 0.51,
      blurPx: 3.6,
      rotationDeg: -10,
      pos: { mode: "uv", u: 0.15, v: 0.592 },
      float: { ampX: 0.3, ampY: 0.1, ampRotDeg: 6.5, speed: 1, phase: 0.1 },
    },
    {
      id: "P7",
      group: 2,
      name: "DIARY OF A SELF PROCLAIMED SCHIZO – LHPG",
      href: "/lhpg",
      url: "/assets/LHPG.png",
      width: 3.31,
      opacity: 0.35,
      blurPx: 3,
      rotationDeg: -3,
      pos: { mode: "uv", u: 0.15, v: 0.389 },
      float: { ampX: 0.02, ampY: 0.14, ampRotDeg: 2.5, speed: 1.05, phase: 1.7 },
    },
    {
      id: "P8",
      group: 2,
      name: "GIAC MO CHAPITI – LE THANH THAO",
      href: "/le-thanh-thao",
      url: "/assets/Giac mo Chapiti - Le Thanh Thao.png",
      width: 4.651,
      opacity: 0.3,
      blurPx: 2.8,
      rotationDeg: -10.7,
      pos: { mode: "uv", u: 0.27, v: 0.41 },
      float: { ampX: 0.2, ampY: 0.19, ampRotDeg: 3, speed: 1, phase: 1.2 },
    },

    // group 3
    {
      id: "P9",
      group: 3,
      name: "A WALK WITH AI INTO THE EDEN OF AMBIGUITY – DANG KHANG NINH",
      href: "/dang-khang-ninh",
      url: "/assets/Eden AI - Dang Khang Ninh.png",
      width: 6.48,
      opacity: 0.25,
      blurPx: 3.02,
      rotationDeg: 2,
      pos: { mode: "uv", u: 0.222, v: 0.303 },
      float: { ampX: 0.3, ampY: 0.08, ampRotDeg: 8, speed: 0.7, phase: 0 },
    },
    {
      id: "P10",
      group: 3,
      name: "TROTTIN AI – LUONG CAM ANH",
      href: "/luong-cam-anh",
      url: "/assets/trustin_AI.png",
      width: 6.21,
      opacity: 0.22,
      blurPx: 3,
      rotationDeg: -2,
      pos: { mode: "uv", u: 0.17, v: 0.618 },
      float: { ampX: 0.1, ampY: 0.1, ampRotDeg: 5.3, speed: 0.7, phase: 0.4 },
    },
    {
      id: "P11",
      group: 3,
      name: "RE IMPRESSION WATER LILIES – NGUYEN THAI BAO",
      href: "/nguyen-thai-bao",
      url: "/assets/Water lilies.png",
      width: 3.1,
      opacity: 0.53,
      blurPx: 3,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.252, v: 0.639 },
      float: { ampX: 0.4, ampY: 0.11, ampRotDeg: 2.9, speed: 0.8, phase: 1.7 },
    },
    {
      id: "P12",
      group: 3,
      name: "ARTIFICIAL DIVINITIES – HA THAO",
      href: "/ha-thao",
      url: "/assets/THE CHRONICLE OF ARTIFICIAL DIVINITY - Thảo Hà.png",
      width: 3.03,
      opacity: 0.5,
      blurPx: 3.8,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.11, v: 0.349 },
      float: { ampX: 0.2, ampY: 0.5, ampRotDeg: 4.5, speed: 1.2, phase: 0.3 },
    },

    // group 4
    {
      id: "P13",
      group: 4,
      name: "DERIVATIVE OF TRIO A – LYON NGUYEN",
      href: "/lyon-nguyen",
      url: "/assets/Derivative of Trio A - Lyon Nguyễn.png",
      width: 4.4,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.12, v: 0.47 },
      float: { ampX: 0.1, ampY: 0.29, ampRotDeg: 5, speed: 0.7, phase: 0.2 },
    },
    {
      id: "P14",
      group: 4,
      name: "PICKLESONG – VALENTIN SISMAN",
      href: "/valentin-sismann-pickle-song",
      url: "/assets/Valentin Sismann - Picklesong (2025)_.png",
      width: 1.73,
      opacity: 0.5,
      blurPx: 5.2,
      rotationDeg: -20,
      pos: { mode: "uv", u: 0.23, v: 0.68 },
      float: { ampX: 0.1, ampY: 0.25, ampRotDeg: 3, speed: 0.7, phase: 0.6 },
    },
    {
      id: "P15",
      group: 4,
      name: "HUMAN LEARNING – NGUYEN HOANG GIANG",
      href: "/nguyen-hoang-giang",
      url: "/assets/Human Learning - Giang IT.png",
      width: 3.83,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.21, v: 0.37 },
      float: { ampX: 0.0, ampY: 0.6, ampRotDeg: 1, speed: 0.9, phase: 0.3 },
    },
  ];

  function getPanelGroups(panelIndex) {
    const mod = panelIndex % 2;
    if (mod === 0) return [2, 3];
    if (mod === 1) return [4, 1];
    // if (mod === 2) return [3, 4, 1];
    // return [2, 3, 4];
  }

  // ===== shader material =====
  function makeBlurPosterMat(tex, blurPx = 2.0, opacity = 1.0) {
    const img = tex.image || tex.source?.data;
    const tw = img && img.width ? img.width : 1024;
    const th = img && img.height ? img.height : 1024;

    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        map: { value: tex },
        uOpacity: { value: opacity },
        uTexel: { value: new THREE.Vector2(1 / tw, 1 / th) },
        uBlurPx: { value: blurPx },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec2  uTexel;
        uniform float uBlurPx;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec4 acc = vec4(0.0);
          float wSum = 0.0;
          float w[5];
          w[0] = 0.24477;
          w[1] = 0.24477;
          w[2] = 0.24477;
          w[3] = 0.24477;
          w[4] = 0.24477;
          for (int ix = -3; ix <= 3; ix++) {
            for (int iy = -3; iy <= 3; iy++) {
              float wx = w[abs(ix)];
              float wy = w[abs(iy)];
              float ww = wx * wy;
              vec2 offs = vec2(float(ix), float(iy)) * uTexel * uBlurPx;
              acc += texture2D(map, vUv + offs) * ww;
              wSum += ww;
            }
          }
          vec4 blurred = acc / wSum;
          gl_FragColor = vec4(blurred.rgb, blurred.a * uOpacity);
        }`,
    });
  }

  // helper place by uv (wrap u)
  function placeByUV(mesh, u, v) {
    const uu = ((u % 1) + 1) % 1;
    const x = (uu - 0.5) * room.ROOM_W;
    const y = (v - 0.5) * room.ROOM_H;
    mesh.position.set(x, y, 0);
  }

  function buildPosterMesh(tex, cfg, targetPanel, uOffset = 0, panelIndex = 0, slotIdx = 0) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.premultiplyAlpha = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;

    const imgW = tex.source?.data?.width || tex.image?.width || 1024;
    const imgH = tex.source?.data?.height || tex.image?.height || 1024;
    const aspect = imgW / imgH;
    const w = cfg.width ?? 3.0;
    const h = w / aspect;

    const mat = makeBlurPosterMat(tex, cfg.blurPx ?? 2.0, cfg.opacity ?? 1.0);
    const poster = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    poster.frustumCulled = false;
    poster.renderOrder = 10;
    poster.userData.href = cfg.href;
    poster.userData.name = cfg.name;
    poster.userData.group = cfg.group;
    poster.userData.panelIndex = panelIndex;
    poster.userData.slotIdx = slotIdx;

    // sampler
    try {
      const img = tex.image || tex.source?.data;
      if (img && img.width && img.height) {
        const sCanvas = document.createElement("canvas");
        sCanvas.width = img.width;
        sCanvas.height = img.height;
        const sCtx = sCanvas.getContext("2d");
        sCtx.drawImage(img, 0, 0, img.width, img.height);
        poster.userData.sampler = {
          canvas: sCanvas,
          ctx: sCtx,
          width: img.width,
          height: img.height,
        };
      }
    } catch (err) {}

    const u0 = cfg.pos?.u ?? 0.5;
    const v0 = cfg.pos?.v ?? 0.5;
    const uFinal = u0 + uOffset;

    placeByUV(poster, uFinal, v0);
    poster.userData.pos = { u: uFinal, v: v0 };

    poster.rotation.set(0, 0, THREE.MathUtils.degToRad(cfg.rotationDeg ?? 0));

    const base = {
      x: poster.position.x,
      y: poster.position.y,
      z: poster.position.z,
      rotZ: poster.rotation.z,
    };
    animated.push({ mesh: poster, base, float: cfg.float || null });

    posters.push(poster);
    targetPanel.add(poster);
    return poster;
  }

  // ===== build posters to 8 panels =====
  panels.forEach((panel, panelIndex) => {
    const acceptedGroups = getPanelGroups(panelIndex); // length = 3

    acceptedGroups.forEach((g, idxInPanel) => {
      // 0 -> +0; 1 -> +1/3; 2 -> +2/3
      const uOffset = idxInPanel === 0 ? 0.0 : idxInPanel === 1 ? 0.333 : 0.667;

      postersConfig.forEach((cfg) => {
        if (cfg.group !== g) return;
        texLoader.load(encodeURI(cfg.url), (tex) => {
          buildPosterMesh(tex, cfg, panel, uOffset, panelIndex, idxInPanel);
        });
      });
    });
  });

  // public helper: recompute layout when room dimensions or config change
  function refreshLayout() {
    try {
      const newR = room.ROOM_D ? room.ROOM_D * 0.45 : 14;
      // reposition panels around circle
      panels.forEach((g, i) => {
        const ang = (i / PANEL_COUNT) * Math.PI * 2 + ANG_OFFSET;
        const x = Math.sin(ang) * newR;
        const z = -Math.cos(ang) * newR;
        g.position.set(x, 0, z);
        g.lookAt(0, 0, 0);
      });

      // reposition posters by UV and update animated base positions
      for (const poster of posters) {
        try {
          const pos = poster.userData?.pos;
          if (pos) placeByUV(poster, pos.u, pos.v);
          // update base in animated array
          for (const entry of animated) {
            if (entry.mesh === poster) {
              entry.base.x = poster.position.x;
              entry.base.y = poster.position.y;
              entry.base.z = poster.position.z;
              break;
            }
          }
        } catch (e) {}
      }
    } catch (err) {}
  }

  // ===== raycast / hover / click =====
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredPoster = null;
  let didDrag = false;
  let lastMousePos = { x: 0, y: 0 };

  function onPointerMove(e) {
    const rect = (domEl || document.body).getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true;
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(posters, false);
    let effectiveHit = null;

    for (const h of hits) {
      const sampler = h.object.userData?.sampler;
      let isShadowPixel = true;
      if (sampler) {
        const uv = h.uv || h.uv2 || null;
        if (uv) {
          const px = Math.floor(uv.x * (sampler.width - 1));
          const py = Math.floor((1 - uv.y) * (sampler.height - 1));
          try {
            const data = sampler.ctx.getImageData(px, py, 1, 1).data;
            const r = data[0],
              g = data[1],
              b = data[2],
              a = data[3];
            const brightness = (r + g + b) / 3;
            if (a < 10 || brightness > 60) isShadowPixel = false;
          } catch (err) {
            isShadowPixel = true;
          }
        }
      }
      if (isShadowPixel) {
        effectiveHit = h;
        break;
      }
    }

    if (effectiveHit) {
      const obj = effectiveHit.object;
      showTooltip(obj, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  }

  function onPointerDown(e) {
    didDrag = false;
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;
  }

  function onClick() {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(posters, false);
    const tipVisible = Boolean(
      tooltip &&
        tooltip.parentNode &&
        tooltip.style.display !== "none" &&
        parseFloat(tooltip.style.opacity || "0") > 0
    );
    if (!tipVisible) return;

    if (!didDrag && typeof navigate === "function") {
      let destHref = null;
      try {
        const tipName = tooltip?.textContent?.trim();
        if (tipName) {
          const cfg = postersConfig.find((c) => c.name === tipName);
          if (cfg && cfg.href) destHref = cfg.href;
        }
      } catch (err) {}

      if (!destHref && hoveredPoster?.userData?.href) destHref = hoveredPoster.userData.href;
      if (!destHref && hits[0]?.object?.userData?.href) destHref = hits[0].object.userData.href;

      if (destHref) {
        try {
          (domEl || document.body).style.cursor = "default";
          hoveredPoster = null;
          tooltip.style.opacity = "0";
          tooltip.style.display = "none";
          if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
        } catch (err) {}
        try {
          try { hideFloorText(); } catch (e) {}
          try {
            if (floorText && floorText.parentNode) floorText.parentNode.removeChild(floorText);
          } catch (e) {}
          try {
            const s = document.getElementById('shadow-floor-text-style');
            if (s && s.parentNode) s.parentNode.removeChild(s);
          } catch (e) {}
        } catch (e) {}
        navigate(destHref);
      }
    }
  }

  (domEl || window).addEventListener("pointerdown", onPointerDown);
  (domEl || window).addEventListener("pointermove", onPointerMove, { passive: true });
  (domEl || window).addEventListener("click", onClick);
  (domEl || window).addEventListener("pointerleave", hideTooltip);
  (domEl || window).addEventListener("pointerout", hideTooltip);

  // ===== animation tick =====
  function tick() {
    const t = clock.getElapsedTime();

    for (const entry of animated) {
      const { mesh, base, float } = entry;
      if (!float) continue;
      const s = float.speed ?? 0.8;
      const ph = float.phase ?? 0.0;
      const dx = (float.ampX ?? 0) * Math.sin(t * s + ph);
      const dy = (float.ampY ?? 0) * Math.cos(t * s + ph);
      const dRot =
        THREE.MathUtils.degToRad(float.ampRotDeg ?? 0) *
        Math.sin(t * s * 0.8 + ph * 1.3);

      let baseLift = 9.5;
      try {
        const grp = entry.mesh?.userData?.group;
        if (Number(grp) === 2) {
          baseLift = 12.5; 
        }
      } catch (e) {}
      const finalZ = base.z + baseLift;

      mesh.rotation.z = base.rotZ + dRot;
      mesh.position.set(base.x + dx, base.y + dy, finalZ);
    }

    for (const p of panels) {
      p.lookAt(camera.position.x, 0, camera.position.z);
    }

   if (hoveredPoster) {
      try {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(posters, false);
        let stillHit = false;
        for (const h of hits) {
          if (h.object !== hoveredPoster) continue;
          const sampler = h.object.userData?.sampler;
          let isShadowPixel = true;
          if (sampler) {
            const uv = h.uv || h.uv2 || null;
            if (uv) {
              const px = Math.floor(uv.x * (sampler.width - 1));
              const py = Math.floor((1 - uv.y) * (sampler.height - 1));
              try {
                const data = sampler.ctx.getImageData(px, py, 1, 1).data;
                const r = data[0], g = data[1], b = data[2], a = data[3];
                const brightness = (r + g + b) / 3;
                if (a < 10 || brightness > 60) isShadowPixel = false;
              } catch (err) {
                isShadowPixel = true;
              }
            }
          }
          if (isShadowPixel) {
            stillHit = true;
            break;
          }
        }
        if (!stillHit) hideTooltip();
      } catch (err) {}
    }

    // If there's no hoveredPoster currently, but a poster has moved under the
    // pointer (due to rotation/float), detect it and show the tooltip.
    if (!hoveredPoster) {
      try {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(posters, false);
        let effectiveHit = null;
        for (const h of hits) {
          const sampler = h.object.userData?.sampler;
          let isShadowPixel = true;
          if (sampler) {
            const uv = h.uv || h.uv2 || null;
            if (uv) {
              const px = Math.floor(uv.x * (sampler.width - 1));
              const py = Math.floor((1 - uv.y) * (sampler.height - 1));
              try {
                const data = sampler.ctx.getImageData(px, py, 1, 1).data;
                const r = data[0], g = data[1], b = data[2], a = data[3];
                const brightness = (r + g + b) / 3;
                if (a < 10 || brightness > 60) isShadowPixel = false;
              } catch (err) {
                isShadowPixel = true;
              }
            }
          }
          if (isShadowPixel) {
            effectiveHit = h;
            break;
          }
        }
        if (effectiveHit) {
          // use lastMousePos for screen coords
          showTooltip(effectiveHit.object, lastMousePos.x || 0, lastMousePos.y || 0);
        }
      } catch (err) {}
    }

    // periodically sample the center-third area to compute group dominance
    // (u between ~0.333 and ~0.667 corresponds to center column). We'll run
    // a coarse grid of rays and count shadow hits per group.
    try {
      // throttle sampling frequency (every N frames)
      tick._sampleCounter = (tick._sampleCounter || 0) + 1;
      const SAMPLE_EVERY = 6;
      if (tick._sampleCounter % SAMPLE_EVERY === 0) {
        const rect = (domEl || document.body).getBoundingClientRect();
        const startX = rect.left + rect.width * 0.40;
        const endX = rect.left + rect.width * 0.667;
        const startY = rect.top + rect.height * 0.10;
        const endY = rect.top + rect.height * 0.90;

        const sx = 9; // grid samples horizontally
        const sy = 7; // grid samples vertically
        const counts = Object.create(null);
        let totalHits = 0;

        for (let iy = 0; iy < sy; iy++) {
          for (let ix = 0; ix < sx; ix++) {
            const fx = ix / (sx - 1);
            const fy = iy / (sy - 1);
            const clientX = startX + (endX - startX) * fx;
            const clientY = startY + (endY - startY) * fy;

            const mx = ((clientX - rect.left) / rect.width) * 2 - 1;
            const my = -((clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera({ x: mx, y: my }, camera);
            const hits = raycaster.intersectObjects(posters, false);
            if (!hits || hits.length === 0) continue;
            const h = hits[0];
            const sampler = h.object.userData?.sampler;
            let isShadowPixel = true;
            if (sampler) {
              const uv = h.uv || h.uv2 || null;
              if (uv) {
                const px = Math.floor(uv.x * (sampler.width - 1));
                const py = Math.floor((1 - uv.y) * (sampler.height - 1));
                try {
                  const data = sampler.ctx.getImageData(px, py, 1, 1).data;
                  const r = data[0], g = data[1], b = data[2], a = data[3];
                  const brightness = (r + g + b) / 3;
                  if (a < 10 || brightness > 60) isShadowPixel = false;
                } catch (err) {
                  isShadowPixel = true;
                }
              }
            }
            if (!isShadowPixel) continue;

            const grp = h.object.userData?.group ?? "unknown";
            counts[grp] = (counts[grp] || 0) + 1;
            totalHits++;
          }
        }

        if (totalHits > 0) {
          // find top group
          let bestGrp = null;
          let bestCount = 0;
          for (const k in counts) {
            if (counts[k] > bestCount) {
              bestCount = counts[k];
              bestGrp = k;
            }
          }
          const share = bestCount / totalHits;
          const now = performance.now();
          if (share >= 0.8) {
            if (lastShownGroup !== null && now < floorLockUntil) {
            } else {
              if (String(lastShownGroup) !== String(bestGrp)) {
                showFloorText(bestGrp);
              }
            }
          } else {
            if (lastShownGroup !== null && now >= floorLockUntil) hideFloorText();
          }
        } else {
          const now = performance.now();
          if (lastShownGroup !== null && now >= floorLockUntil) hideFloorText();
        }
      }
    } catch (err) {}

    // ===== auto rotate carousel =====
    const now = performance.now();
    if (!userInteracting && now - lastUserAction > AUTO_RESUME_DELAY) {
      shadowCarousel.rotation.y += BASE_AUTO_SPEED * lastUserRotateDir;
    }

    raf = requestAnimationFrame(tick);
  }
  tick();

  // ===== rotate carousel (drag + wheel) =====
  let dragActive = false;
  let lastX = 0;
  let rotateEnabled = false;
  let onDownRef, onMoveRef, onUpRef;
  let currentPanel = 0;

  function enablePointerRotate(targetEl = domEl || window, opts = {}) {
    if (rotateEnabled) return;
    rotateEnabled = true;
    const SENS_X = opts.yawSens ?? 0.005;

    onDownRef = (e) => {
      dragActive = true;
      lastX = e.clientX;
      userInteracting = true;
    };

    onMoveRef = (e) => {
      if (!dragActive) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      shadowCarousel.rotation.y += dx * SENS_X * -1;
      const dir = -Math.sign(dx) || lastUserRotateDir;
      if (dir !== 0) lastUserRotateDir = dir;
      lastUserAction = performance.now();
      try {
        floorLockUntil = 0;
        lastShownGroup = null;
        try { hideFloorText(); } catch (e) {}
      } catch (err) {}
    };

    onUpRef = () => {
      dragActive = false;
      userInteracting = false;
      lastUserAction = performance.now();
    };

    targetEl.addEventListener("pointerdown", onDownRef);
    window.addEventListener("pointermove", onMoveRef, { passive: true });
    window.addEventListener("pointerup", onUpRef);
  }

  function disablePointerRotate(targetEl = domEl || window) {
    if (!rotateEnabled) return;
    rotateEnabled = false;
    targetEl.removeEventListener("pointerdown", onDownRef);
    window.removeEventListener("pointermove", onMoveRef);
    window.removeEventListener("pointerup", onUpRef);
  }

  function goToPanel(idx) {
    const n = ((idx % PANEL_COUNT) + PANEL_COUNT) % PANEL_COUNT;
    const targetAngle = -(n / PANEL_COUNT) * Math.PI * 2;
    const start = shadowCarousel.rotation.y;
    const dur = 0.4;
    const t0 = performance.now();
    function anim(now) {
      const tt = Math.min(1, (now - t0) / (dur * 1000));
      shadowCarousel.rotation.y = THREE.MathUtils.lerp(start, targetAngle, tt);
      if (tt < 1) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
    currentPanel = n;
  }

  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) goToPanel(currentPanel + 1);
    else goToPanel(currentPanel - 1);
  });

  enablePointerRotate();

  return {
    enablePointerRotate,
    disablePointerRotate,
    setRotation: (r) => {
      shadowCarousel.rotation.set(r.x ?? 0, r.y ?? 0, r.z ?? 0);
    },
    // recompute layout (panels/posters) if room dimensions or config changed
    refresh() {
      try {
        refreshLayout();
      } catch (e) {}
    },
    //-1 = left, 1 = right
    setAutoDirection(dir = 1) {
      try {
        const d = dir >= 0 ? 1 : -1;
        lastUserRotateDir = d;
        lastUserAction = performance.now() - AUTO_RESUME_DELAY - 1;
        userInteracting = false;
      } catch (err) {}
    },
    enableFloorText() {
      try { floorTextEnabled = true; } catch (err) {}
    },
    dispose() {
      cancelAnimationFrame(raf);
      (domEl || window).removeEventListener("pointermove", onPointerMove);
      (domEl || window).removeEventListener("click", onClick);
      try {
        (domEl || window).removeEventListener("pointerleave", hideTooltip);
        (domEl || window).removeEventListener("pointerout", hideTooltip);
      } catch (err) {}
      disablePointerRotate();
      if (tooltip && tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
      try {
        if (floorText && floorText.parentNode) floorText.parentNode.removeChild(floorText);
      } catch (e) {}
      try {
        const s = document.getElementById('shadow-floor-text-style');
        if (s && s.parentNode) s.parentNode.removeChild(s);
      } catch (e) {}
    },
  };
}
