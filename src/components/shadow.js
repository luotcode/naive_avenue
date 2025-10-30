import * as THREE from "three";

export function Shadow(scene, room, WALL_Z, camera, domEl, navigate, gui) {
  const texLoader = new THREE.TextureLoader();
  const posters = [];
  const animated = [];
  const clock = new THREE.Clock();
  let raf = 0;

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

  // ================================
  // 1. CAROUSEL ROOT
  // ================================
  const shadowCarousel = new THREE.Group();
  scene.add(shadowCarousel);

  const PANEL_COUNT = 4;
  const PANEL_RADIUS = room.ROOM_D ? room.ROOM_D * 0.45 : 14;
  const panels = [];

  for (let i = 0; i < PANEL_COUNT; i++) {
    const g = new THREE.Group();
    const ang = (i / PANEL_COUNT) * Math.PI * 2;

    const x = Math.sin(ang) * PANEL_RADIUS;
    const z = -Math.cos(ang) * PANEL_RADIUS;
    g.position.set(x, 0, z);

    // ban đầu hướng vào tâm
    g.lookAt(0, 0, 0);

    shadowCarousel.add(g);
    panels.push(g);
  }

  // ================================
  // 2. 15 POSTERS
  // ================================
  const postersConfig = [
    {
      id: "P1",
      name: "you are so exotic looking!",
      href: "/you-are-so-exotic-looking",
      url: "/assets/you are so exotic looking! - Hân Đào.png",
      width: 2.63,
      opacity: 0.6,
      blurPx: 3,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.254, v: 0.389 },
      float: { ampX: 0.01, ampY: 0.22, ampRotDeg: 3, speed: 1.3, phase: 0.3 },
    },
    {
      id: "P2",
      name: "Dan ong - Han Dao",
      href: "/dan-ong-han-dao",
      url: "/assets/Đàn ông - Hân Đào.png",
      width: 5.01,
      opacity: 0.3,
      blurPx: 3.53,
      rotationDeg: 2,
      pos: { mode: "uv", u: 0.2, v: 0.44 },
      float: { ampX: 0, ampY: 0.17, ampRotDeg: 2, speed: 0.9, phase: 1.1 },
    },
    {
      id: "P3",
      name: "Kinh chieu AI - Nguyen Hoang Gia Bao",
      href: "/human-learning",
      url: "/assets/Nguyễn Hoàng Gia Bảo_.png",
      width: 3,
      opacity: 0.7,
      blurPx: 2.4,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.267, v: 0.646 },
      float: { ampX: 0.03, ampY: 0.12, ampRotDeg: 3.5, speed: 1.25, phase: 0.6 },
    },
    {
      id: "P4",
      name: "Nighscape – Sismann 2",
      href: "/nightscape-sismann",
      url: "/assets/Nighscape - Sismann 2.png",
      width: 1.5,
      opacity: 0.5,
      blurPx: 3.1,
      rotationDeg: 3.9,
      pos: { mode: "uv", u: 0.13, v: 0.6 },
      float: { ampX: 0.02, ampY: 0.13, ampRotDeg: 3, speed: 1.1, phase: 0.4 },
    },
    {
      id: "P5",
      name: "G9 – Ivy Vo",
      href: "/g9-ivy-vo",
      url: "/assets/G9 - Ivy Vo.png",
      width: 6,
      opacity: 0.15,
      blurPx: 4.86,
      rotationDeg: -10,
      pos: { mode: "uv", u: 0.578, v: 0.605 },
      float: { ampX: 0.01, ampY: 0.16, ampRotDeg: 2, speed: 0.95, phase: 0.9 },
    },
    {
      id: "P6",
      name: "Art & Leisure (Crying) – Emily Sarten",
      href: "/emily-sarten",
      url: "/assets/Art & Leisure (Crying) - Emily Sarten.png",
      width: 5.5,
      opacity: 0.51,
      blurPx: 2.4,
      rotationDeg: -1,
      pos: { mode: "uv", u: 0.43, v: 0.632 },
      float: { ampX: 0, ampY: 0.1, ampRotDeg: 0.5, speed: 1, phase: 0.1 },
    },
    {
      id: "P7",
      name: "LHPG",
      href: "/lhpg",
      url: "/assets/LHPG.png",
      width: 4.61,
      opacity: 0.35,
      blurPx: 3,
      rotationDeg: -5.9,
      pos: { mode: "uv", u: 0.403, v: 0.389 },
      float: { ampX: 0.02, ampY: 0.14, ampRotDeg: 2.5, speed: 1.05, phase: 1.7 },
    },
    {
      id: "P8",
      name: "Giac mo Chapiti – Lê Thanh Thảo",
      href: "/giac-mo-chapiti",
      url: "/assets/Giac mo Chapiti - Le Thanh Thao.png",
      width: 5.01,
      opacity: 0.3,
      blurPx: 2.8,
      rotationDeg: -10.7,
      pos: { mode: "uv", u: 0.592, v: 0.376 },
      float: { ampX: 0.02, ampY: 0.15, ampRotDeg: 3, speed: 1, phase: 1.2 },
    },
    {
      id: "P9",
      name: "Eden AI – Dang Khang Ninh",
      href: "/eden-ai",
      url: "/assets/Eden AI - Dang Khang Ninh.png",
      width: 3.8,
      opacity: 0.4,
      blurPx: 3.02,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.808, v: 0.403 },
      float: { ampX: 0, ampY: 0.08, ampRotDeg: 0.2, speed: 0.7, phase: 0 },
    },
    {
      id: "P10",
      name: "Trust In AI",
      href: "/derivative-of-trio-a",
      url: "/assets/trustin_AI.png",
      width: 4.51,
      opacity: 0.2,
      blurPx: 3,
      rotationDeg: -2,
      pos: { mode: "uv", u: 0.754, v: 0.578 },
      float: { ampX: 0, ampY: 0.1, ampRotDeg: 1.3, speed: 0.7, phase: 0.4 },
    },
    {
      id: "P11",
      name: "Water lilies",
      href: "/the-ai-dance-with-us",
      url: "/assets/Water lilies.png",
      width: 2.8,
      opacity: 0.33,
      blurPx: 3,
      rotationDeg: 0,
      pos: { mode: "uv", u: 0.889, v: 0.619 },
      float: { ampX: 0.0, ampY: 0.11, ampRotDeg: 1, speed: 0.8, phase: 1.7 },
    },
    {
      id: "P12",
      name: "THE CHRONICLE OF ARTIFICIAL DIVINITY",
      href: "/the-chronicle-of-artificial-divinity",
      url: "/assets/THE CHRONICLE OF ARTIFICIAL DIVINITY - Thảo Hà.png",
      width: 2.93,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.727, v: 0.389 },
      float: { ampX: 0.0, ampY: 0.09, ampRotDeg: 2, speed: 0.7, phase: 0.3 },
    },
    {
      id: "P13",
      name: "Derivative of Trio A - Lyon Nguyen",
      href: "/derivative-of-trio-a-lyon-nguyen",
      url: "/assets/Derivative of Trio A - Lyon Nguyễn.png",
      width: 2.93,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.21, v: 0.32 },
      float: { ampX: 0.0, ampY: 0.09, ampRotDeg: 2, speed: 0.7, phase: 0.3 },
    },
    {
      id: "P14",
      name: "Picklespong - Valentin Sismann",
      href: "/picklespong-valentin-sismann",
      url: "/assets/Valentin Sismann - Picklesong (2025)_.png",
      width: 2.93,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.33, v: 0.52 },
      float: { ampX: 0.0, ampY: 0.09, ampRotDeg: 2, speed: 0.7, phase: 0.3 },
    },
    {
      id: "P15",
      name: "Human Learning - Giang IT",
      href: "/human-learning-giang-it",
      url: "/assets/Human Learning - Giang IT.png",
      width: 2.93,
      opacity: 0.5,
      blurPx: 3.2,
      rotationDeg: -4,
      pos: { mode: "uv", u: 0.6, v: 0.22 },
      float: { ampX: 0.0, ampY: 0.09, ampRotDeg: 2, speed: 0.7, phase: 0.3 },
    },
  ];

  // ================================
  // 3. SHADER MAT
  // ================================
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

  function placeOnPanel(mesh, cfg) {
    let u = 0.5;
    let v = 0.5;
    if (cfg.pos && cfg.pos.mode === "uv") {
      u = THREE.MathUtils.clamp(cfg.pos.u ?? 0.5, 0, 1);
      v = THREE.MathUtils.clamp(cfg.pos.v ?? 0.5, 0, 1);
    }
    const x = (u - 0.5) * room.ROOM_W;
    const y = (v - 0.5) * room.ROOM_H;
    mesh.position.set(x, y, 0);
  }

  function buildPosterMesh(tex, cfg, targetPanel) {
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

    // alpha sampler
    try {
      const img = tex.image || tex.source?.data;
      if (img && img.width && img.height) {
        const sCanvas = document.createElement("canvas");
        sCanvas.width = img.width;
        sCanvas.height = img.height;
        const sCtx = sCanvas.getContext("2d");
        sCtx.drawImage(img, 0, 0, img.width, img.height);
        poster.userData.sampler = { canvas: sCanvas, ctx: sCtx, width: img.width, height: img.height };
      }
    } catch (err) {}

    placeOnPanel(poster, cfg);
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

  // 4-4-4-3 phân panel
  postersConfig.forEach((cfg, index) => {
    const panelIndex =
      index < 4 ? 0 :
      index < 8 ? 1 :
      index < 12 ? 2 : 3;
    const targetPanel = panels[panelIndex];

    texLoader.load(encodeURI(cfg.url), (tex) => {
      const poster = buildPosterMesh(tex, cfg, targetPanel);

      if (gui) {
        const folder = gui.addFolder(`Shadow – ${cfg.id}`);
        const state = {
          visible: true,
          opacity: cfg.opacity ?? 1.0,
          blur: cfg.blurPx ?? 2.0,
          width: cfg.width ?? 3.0,
          rotationDeg: cfg.rotationDeg ?? 0,
          u: cfg.pos?.u ?? 0.5,
          v: cfg.pos?.v ?? 0.5,
          ampX: cfg.float?.ampX ?? 0,
          ampY: cfg.float?.ampY ?? 0.2,
          ampRotDeg: cfg.float?.ampRotDeg ?? 2,
          speed: cfg.float?.speed ?? 0.8,
          phase: cfg.float?.phase ?? 0,
        };

        folder.add(state, "visible").onChange((v) => (poster.visible = v));
        folder.add(state, "opacity", 0, 1, 0.01).onChange((v) => (poster.material.uniforms.uOpacity.value = v));
        folder.add(state, "blur", 0.0, 5, 0.01).onChange((v) => (poster.material.uniforms.uBlurPx.value = v));
        folder.add(state, "width", 0.2, 8, 0.01).onChange((v) => {
          const curW = poster.geometry.parameters.width;
          const curH = poster.geometry.parameters.height;
          const aspect2 = curW / curH;
          const hNew = v / aspect2;
          poster.geometry.dispose();
          poster.geometry = new THREE.PlaneGeometry(v, hNew);
          applyPosition();
        });

        const uvF = folder.addFolder("UV Position (u, v)");
        uvF.add(state, "u", 0, 1, 0.001).onChange(applyPosition);
        uvF.add(state, "v", 0, 1, 0.001).onChange(applyPosition);

        const rotF = folder.addFolder("Rotation");
        rotF.add(state, "rotationDeg", -180, 180, 0.1).onChange((val) => {
          poster.rotation.set(0, 0, THREE.MathUtils.degToRad(val));
          const entry = animated.find((a) => a.mesh === poster);
          if (entry) entry.base.rotZ = poster.rotation.z;
        });

        const floatF = folder.addFolder("Float");
        floatF.add(state, "ampX", 0, 1, 0.001).onChange((v) => {
          const e = animated.find((a) => a.mesh === poster);
          if (e) (e.float = e.float || {}, e.float.ampX = v);
        });
        floatF.add(state, "ampY", 0, 1, 0.001).onChange((v) => {
          const e = animated.find((a) => a.mesh === poster);
          if (e) (e.float = e.float || {}, e.float.ampY = v);
        });
        floatF.add(state, "ampRotDeg", 0, 30, 0.1).onChange((v) => {
          const e = animated.find((a) => a.mesh === poster);
          if (e) (e.float = e.float || {}, e.float.ampRotDeg = v);
        });
        floatF.add(state, "speed", 0, 3, 0.01).onChange((v) => {
          const e = animated.find((a) => a.mesh === poster);
          if (e) (e.float = e.float || {}, e.float.speed = v);
        });
        floatF.add(state, "phase", 0, Math.PI * 2, 0.01).onChange((v) => {
          const e = animated.find((a) => a.mesh === poster);
          if (e) (e.float = e.float || {}, e.float.phase = v);
        });

        function applyPosition() {
          const localCfg = { ...cfg, pos: { mode: "uv", u: state.u, v: state.v } };
          placeOnPanel(poster, localCfg);
          const entry = animated.find((a) => a.mesh === poster);
          if (entry) entry.base = {
            x: poster.position.x,
            y: poster.position.y,
            z: poster.position.z,
            rotZ: poster.rotation.z,
          };
        }
      }
    });
  });

  // ===== raycast / hover / click giữ nguyên như trước =====
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
            const r = data[0], g = data[1], b = data[2], a = data[3];
            const brightness = (r + g + b) / 3;
            if (a < 10 || brightness > 60) isShadowPixel = false;
          } catch (err) {
            isShadowPixel = true;
          }
        }
      }
      if (isShadowPixel) { effectiveHit = h; break; }
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
      tooltip && tooltip.parentNode && tooltip.style.display !== "none" && parseFloat(tooltip.style.opacity || "0") > 0
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

  // ================================
  // 8. FLOAT + PANEL FACE CAMERA
  // ================================
  function tick() {
    const t = clock.getElapsedTime();

    // 1) float posters
    for (const entry of animated) {
      const { mesh, base, float } = entry;
      if (!float) continue;
      const s = float.speed ?? 0.8;
      const ph = float.phase ?? 0.0;
      const dx = (float.ampX ?? 0) * Math.sin(t * s + ph);
      const dy = (float.ampY ?? 0) * Math.cos(t * s + ph);
      const dRot = THREE.MathUtils.degToRad(float.ampRotDeg ?? 0) * Math.sin(t * s * 0.8 + ph * 1.3);
      mesh.rotation.z = base.rotZ + dRot;
      mesh.position.set(base.x + dx, base.y + dy, base.z);
    }

    // 2) make panels always face camera -> so side panels stay visible
    for (const p of panels) {
      p.lookAt(camera.position.x, 0, camera.position.z);
    }

    raf = requestAnimationFrame(tick);
  }
  tick();

  // ================================
  // 9. ROTATE CAROUSEL
  // ================================
  let dragActive = false;
  let lastX = 0;
  let rotateEnabled = false;
  let onDownRef, onMoveRef, onUpRef;

  function enablePointerRotate(targetEl = domEl || window, opts = {}) {
    if (rotateEnabled) return;
    rotateEnabled = true;
    const SENS_X = opts.yawSens ?? 0.005;

    onDownRef = (e) => {
      dragActive = true;
      lastX = e.clientX;
    };

    onMoveRef = (e) => {
      if (!dragActive) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      shadowCarousel.rotation.y += dx * SENS_X * -1;
    };

    onUpRef = () => { dragActive = false; };

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

  // scroll to change panel
  let currentPanel = 0;
  function goToPanel(idx) {
    const n = ((idx % PANEL_COUNT) + PANEL_COUNT) % PANEL_COUNT;
    const targetAngle = -(n / PANEL_COUNT) * Math.PI * 2;
    const start = shadowCarousel.rotation.y;
    const dur = 0.4;
    const t0 = performance.now();
    function anim(now) {
      const t = Math.min(1, (now - t0) / (dur * 1000));
      shadowCarousel.rotation.y = THREE.MathUtils.lerp(start, targetAngle, t);
      if (t < 1) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
    currentPanel = n;
  }

  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) goToPanel(currentPanel + 1);
    else goToPanel(currentPanel - 1);
  });

  // enable by default
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
