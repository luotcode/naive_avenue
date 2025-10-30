import * as THREE from "three";

export function Shadow(scene, room, WALL_Z, camera, domEl, navigate, gui) {
  const texLoader = new THREE.TextureLoader();
  const posters = [];
  const animated = [];
  const clock = new THREE.Clock();
  let raf = 0;

  let autoRotateSpeed = 0.0005; 
  let userInteracting = false;
  let lastUserAction = 0;
  const AUTO_RESUME_DELAY = 2000;

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
  tooltip.style.zIndex = "10000";
  tooltip.style.opacity = "0";
  tooltip.style.transition = "opacity 0.08s ease, transform 0.08s ease";
  tooltip.style.whiteSpace = "nowrap";
  document.body.appendChild(tooltip);

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
      name: "you are so exotic looking!",
      href: "/han-dao-you-are-so-exotic-looking",
      url: "/assets/you are so exotic looking! - Hân Đào.png",
      width: 4.5,
      opacity: 0.6,
      blurPx: 5,
      rotationDeg: 10,
      pos: { mode: "uv", u: 0.204, v: 0.40 },
      float: { ampX: 0.01, ampY: 0.22, ampRotDeg: 5.9, speed: 2.3, phase: 0.3 },
    },
    {
      id: "P2",
      group: 1,
      name: "Dan ong - Han Dao",
      href: "/han-dao-dan-ong",
      url: "/assets/Đàn ông - Hân Đào.png",
      width: 6.8,
      opacity: 0.3,
      blurPx: 3.53,
      rotationDeg: 10,
      pos: { mode: "uv", u: 0.1, v: 0.45 },
      float: { ampX: 0.2, ampY: 0.37, ampRotDeg: 2, speed: 0.9, phase: 1.1 },
    },
    {
      id: "P3",
      group: 1,
      name: "Kinh chieu AI - Nguyen Hoang Gia Bao",
      href: "/nguyen-hoang-gia-bao",
      url: "/assets/Nguyễn Hoàng Gia Bảo_.png",
      width: 3.8,
      opacity: 0.7,
      blurPx: 2.4,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.15, v: 0.686 },
      float: { ampX: 0.03, ampY: 0.12, ampRotDeg: 3.5, speed: 1.25, phase: 0.6 },
    },
    {
      id: "P4",
      group: 1,
      name: "Nighscape – Sismann 2",
      href: "/valentin-sismann-nightscape",
      url: "/assets/Nighscape - Sismann 2.png",
      width: 1.4,
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
      name: "G9 – Ivy Vo",
      href: "/ivy-vo",
      url: "/assets/G9 - Ivy Vo.png",
      width: 7,
      opacity: 0.15,
      blurPx: 4.86,
      rotationDeg: -10,
      pos: { mode: "uv", u: 0.205, v: 0.51 },
      float: { ampX: 0.01, ampY: 0.16, ampRotDeg: 2, speed: 0.95, phase: 0.9 },
    },
    {
      id: "P6",
      group: 2,
      name: "Art & Leisure (Crying) – Emily Sarten",
      href: "/emily-sarten",
      url: "/assets/Art & Leisure (Crying) - Emily Sarten.png",
      width: 4.5,
      opacity: 0.51,
      blurPx: 3.6,
      rotationDeg: -1,
      pos: { mode: "uv", u: 0.097, v: 0.592 },
      float: { ampX: 0.3, ampY: 0.1, ampRotDeg: 6.5, speed: 1, phase: 0.1 },
    },
    {
      id: "P7",
      group: 2,
      name: "LHPG",
      href: "/lhpg",
      url: "/assets/LHPG.png",
      width: 3.61,
      opacity: 0.35,
      blurPx: 3,
      rotationDeg: -5.9,
      pos: { mode: "uv", u: 0.10, v: 0.389 },
      float: { ampX: 0.02, ampY: 0.14, ampRotDeg: 2.5, speed: 1.05, phase: 1.7 },
    },
    {
      id: "P8",
      group: 2,
      name: "Giac mo Chapiti – Lê Thanh Thảo",
      href: "/le-thanh-thao",
      url: "/assets/Giac mo Chapiti - Le Thanh Thao.png",
      width: 5.01,
      opacity: 0.3,
      blurPx: 2.8,
      rotationDeg: -10.7,
      pos: { mode: "uv", u: 0.24, v: 0.41 },
      float: { ampX: 0.2, ampY: 0.19, ampRotDeg: 3, speed: 1, phase: 1.2 },
    },

    // group 3
    {
      id: "P9",
      group: 3,
      name: "Eden AI – Dang Khang Ninh",
      href: "/dang-khang-ninh",
      url: "/assets/Eden AI - Dang Khang Ninh.png",
      width: 7.18,
      opacity: 0.25,
      blurPx: 3.02,
      rotationDeg: 2,
      pos: { mode: "uv", u: 0.271, v: 0.303 },
      float: { ampX: 0.3, ampY: 0.08, ampRotDeg: 8, speed: 0.7, phase: 0 },
    },
    {
      id: "P10",
      group: 3,
      name: "Trust In AI",
      href: "/luong-cam-anh",
      url: "/assets/trustin_AI.png",
      width: 6.51,
      opacity: 0.22,
      blurPx: 3,
      rotationDeg: -2,
      pos: { mode: "uv", u: 0.17, v: 0.618 },
      float: { ampX: 0.1, ampY: 0.1, ampRotDeg: 5.3, speed: 0.7, phase: 0.4 },
    },
    {
      id: "P11",
      group: 3,
      name: "Water lilies",
      href: "/the-ai-dance-with-us",
      url: "/assets/Water lilies.png",
      width: 3.4,
      opacity: 0.53,
      blurPx: 3,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.322, v: 0.639 },
      float: { ampX: 0.4, ampY: 0.11, ampRotDeg: 2.9, speed: 0.8, phase: 1.7 },
    },
    {
      id: "P12",
      group: 3,
      name: "THE CHRONICLE OF ARTIFICIAL DIVINITY",
      href: "/ha-thao",
      url: "/assets/THE CHRONICLE OF ARTIFICIAL DIVINITY - Thảo Hà.png",
      width: 3.23,
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
      name: "Derivative of Trio A - Lyon Nguyen",
      href: "/derivative-of-trio-a-lyon-nguyen",
      url: "/assets/Derivative of Trio A - Lyon Nguyễn.png",
      width: 3.5,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.10, v: 0.47 },
      float: { ampX: 0.1, ampY: 0.29, ampRotDeg: 5, speed: 0.7, phase: 0.2 },
    },
    {
      id: "P14",
      group: 4,
      name: "Picklespong - Valentin Sismann",
      href: "/picklespong-valentin-sismann",
      url: "/assets/Valentin Sismann - Picklesong (2025)_.png",
      width: 1.23,
      opacity: 0.5,
      blurPx: 5.2,
      rotationDeg: -20,
      pos: { mode: "uv", u: 0.19, v: 0.68 },
      float: { ampX: 0.1, ampY: 0.25, ampRotDeg: 3, speed: 0.7, phase: 0.6 },
    },
    {
      id: "P15",
      group: 4,
      name: "Human Learning - Giang IT",
      href: "/human-learning-giang-it",
      url: "/assets/Human Learning - Giang IT.png",
      width: 4.43,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.23, v: 0.37 },
      float: { ampX: 0.0, ampY: 0.6, ampRotDeg: 1, speed: 0.9, phase: 0.3 },
    },
  ];

  // ===== panel -> accepted groups (3 groups each) =====
  // pattern 4 panel lặp lại:
  // 0: [1,2,3]
  // 1: [4,1,2]
  // 2: [3,4,1]
  // 3: [2,3,4]
  // 4: [1,2,3] ...
  function getPanelGroups(panelIndex) {
    const mod = panelIndex % 2;
    if (mod === 0) return [1, 2];
    if (mod === 1) return [3, 4];
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

  function buildPosterMesh(tex, cfg, targetPanel, uOffset = 0) {
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
    console.log("poster placed at uv:", cfg.name, uFinal, v0);

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
          buildPosterMesh(tex, cfg, panel, uOffset);
        });
      });
    });
  });

  // ===== raycast / hover / click (giữ nguyên) =====
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
      hoveredPoster = obj;
      (domEl || document.body).style.cursor = "pointer";
      const name = obj.userData?.name || "";
      if (name) {
        tooltip.textContent = name;
        const pad = 15;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        requestAnimationFrame(() => {
          const tw = tooltip.getBoundingClientRect().width;
          const th = tooltip.getBoundingClientRect().height;
          let tx = e.clientX + pad;
          let ty = e.clientY + pad;
          if (tx + tw + 8 > vw) tx = e.clientX - tw - pad;
          if (ty + th + 8 > vh) ty = e.clientY - th - pad;
          tooltip.style.left = tx + "px";
          tooltip.style.top = ty + "px";
          tooltip.style.transform = "none";
          tooltip.style.opacity = "1";
          tooltip.style.display = "block";
        });
      }
    } else {
      hoveredPoster = null;
      (domEl || document.body).style.cursor = "default";
      tooltip.style.opacity = "0";
      tooltip.style.display = "none";
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
        navigate(destHref);
      }
    }
  }

  (domEl || window).addEventListener("pointerdown", onPointerDown);
  (domEl || window).addEventListener("pointermove", onPointerMove, { passive: true });
  (domEl || window).addEventListener("click", onClick);

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

      const baseLift = 9.5;
      const finalZ = base.z + baseLift;

      mesh.rotation.z = base.rotZ + dRot;
      mesh.position.set(base.x + dx, base.y + dy, finalZ);
    }

    for (const p of panels) {
      p.lookAt(camera.position.x, 0, camera.position.z);
    }

    // ===== auto rotate carousel =====
    const now = performance.now();
    if (!userInteracting && now - lastUserAction > AUTO_RESUME_DELAY) {
      shadowCarousel.rotation.y += autoRotateSpeed;
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
      lastUserAction = performance.now();
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
    dispose() {
      cancelAnimationFrame(raf);
      (domEl || window).removeEventListener("pointermove", onPointerMove);
      (domEl || window).removeEventListener("click", onClick);
      disablePointerRotate();
      if (tooltip && tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
    },
  };
}
