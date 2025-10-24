import * as THREE from "three";

export function Shadow(scene, room, WALL_Z, gui, camera, domEl, navigate) {
  const texLoader = new THREE.TextureLoader();
  const posters = [];
  const animated = [];
  const clock = new THREE.Clock();
  let raf = 0;

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

  const shadowRoot = new THREE.Group();
  shadowRoot.position.z = 0;         
  scene.add(shadowRoot);

  const postersConfig = [
  {
    id: "P1",
    name: "Emily Sarten",
    href: "/emily-sarten",
    url: "/assets/Art & Leisure (Crying) - Emily Sarten.png",
    width: 4.31,
    opacity: 0.4,
    blurPx: 3,
    rotationDeg: 0,
    margin: 5,
    pos: { mode: "cornerOffset", corner: "tl", dx: 1.25, dy: 1.5 },
    float: { ampX: 0.0, ampY: 0.538, ampRotDeg: 8.9, speed: 1.5, phase: 0.51 },
  },

  {
    id: "P2",
    name: "Ivy Vo",
    href: "/ivy-vo",
    url: "/assets/G9 - Ivy Vo.png",
    width: 5.01,
    opacity: 0.3,
    blurPx: 3,
    rotationDeg: 0,
    pos: { mode: "uv", u: 0.607, v: 0.578 },
    x: 2.8,
    y: 1.01,
    z: -29.99,
    float: { ampX: 0.12, ampY: 0.294, ampRotDeg: 8, speed: 0.9, phase: 1.1 },
  },

  {
    id: "P3",
    name: "LHPG",
    href: "/lhpg",
    url: "/assets/LHPG.png",
    width: 3.82,
    opacity: 0.3,
    blurPx: 3,
    rotationDeg: 0,
    margin: 3.5,
    pos: { mode: "cornerOffset", corner: "bl", dx: 2.56, dy: 1.05 },
    float: { ampX: 0.08, ampY: 0.22, ampRotDeg: 1.8, speed: 1.0, phase: 2.2 },
  },

  {
    id: "P4",
    name: "Le Thanh Thao",
    href: "/le-thanh-thao",
    url: "/assets/Giac mo Chapiti - Le Thanh Thao.png",
    width: 5.3,
    opacity: 0.3,
    blurPx: 3,
    rotationDeg: -20.5,
    pos: { mode: "uv", u: 0.578, v: 0.405 },
    x: 2.43,
    y: -1.91,
    z: -29.98,
    float: { ampX: 0.15, ampY: 0.15, ampRotDeg: 3.5, speed: 1.1, phase: 0.6 },
  },];

  function makeBlurPosterMat(tex, blurPx = 2.0, opacity = 1.0) {
    const img = tex.image || tex.source?.data;
    const tw = (img && img.width) ? img.width : 1024;
    const th = (img && img.height) ? img.height : 1024;

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

  function placeByConfig(mesh, cfg) {
    const zLift = 5.5;
    const zBack = (typeof cfg.z === "number") ? cfg.z : (WALL_Z + zLift);

    const mode = cfg.pos?.mode || (
      (typeof cfg.x === "number" && typeof cfg.y === "number") ? "world" : "cornerOffset"
    );

    if (mode === "world") {
      const x = (typeof cfg.x === "number") ? cfg.x : 0;
      const y = (typeof cfg.y === "number") ? cfg.y : 0;
      const z = (typeof cfg.z === "number") ? cfg.z : zBack;
      mesh.position.set(x, y, z);
      return;
    }

    if (mode === "uv") {
      const u = THREE.MathUtils.clamp(cfg.pos?.u ?? 0.5, 0, 1);
      const v = THREE.MathUtils.clamp(cfg.pos?.v ?? 0.5, 0, 1);
      const x = (u - 0.5) * room.ROOM_W;
      const y = (v - 0.5) * room.ROOM_H;
      mesh.position.set(x, y, zBack);
      return;
    }

    if (mode === "cornerOffset") {
      const corner = cfg.pos?.corner || cfg.corner || "tl"; // tl/tr/bl/br
      const dx = cfg.pos?.dx ?? 0;
      const dy = cfg.pos?.dy ?? 0;
      const margin = cfg.margin ?? 0;

      const w = mesh.geometry.parameters.width;
      const h = mesh.geometry.parameters.height;

      const xSign = corner.includes("l") ? -1 : 1;
      const ySign = corner.includes("t") ? 1 : -1;

      const baseX = xSign * (room.ROOM_W * 0.5 - w * 0.5 - margin);
      const baseY = ySign * (room.ROOM_H * 0.5 - h * 0.5 - margin);

      mesh.position.set(baseX + dx, baseY + dy, zBack);
      return;
    }

    mesh.position.set(0, 0, zBack);
  }

  function buildPosterMesh(tex, cfg) {
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

    // prepare an offscreen canvas to sample pixels from the source image
    try {
      const img = tex.image || tex.source?.data;
      if (img && img.width && img.height) {
        const sCanvas = document.createElement('canvas');
        sCanvas.width = img.width;
        sCanvas.height = img.height;
        const sCtx = sCanvas.getContext('2d');
        // draw the image into the canvas for pixel sampling
        sCtx.drawImage(img, 0, 0, img.width, img.height);
        poster.userData.sampler = { canvas: sCanvas, ctx: sCtx, width: img.width, height: img.height };
      }
    } catch (err) {
      // sampling is optional; fail silently if cross-origin or other issues
    }

    placeByConfig(poster, cfg);
    poster.rotation.set(0, 0, THREE.MathUtils.degToRad(cfg.rotationDeg ?? 0));

    const base = {
      x: poster.position.x,
      y: poster.position.y,
      z: poster.position.z,
      rotZ: poster.rotation.z
    };
    animated.push({ mesh: poster, base, float: cfg.float || null });

    posters.push(poster);
    shadowRoot.add(poster); // <=== ADD TO SHADOW ROOT (only this group rotates)
    return poster;
  }

  postersConfig.forEach((cfg) => {
    texLoader.load(encodeURI(cfg.url), (tex) => {
      const poster = buildPosterMesh(tex, cfg);

      if (gui) {
        const folder = gui.addFolder(`Shadow – ${cfg.id}`);
        const state = {
          visible: true,
          opacity: cfg.opacity ?? 1.0,
          blur: cfg.blurPx ?? 2.0,
          width: cfg.width ?? 3.0,
          rotationDeg: cfg.rotationDeg ?? 0,

          mode: cfg.pos?.mode || ((typeof cfg.x === "number" && typeof cfg.y === "number") ? "world" : "cornerOffset"),
          x: poster.position.x,
          y: poster.position.y,
          z: poster.position.z,
          u: cfg.pos?.u ?? 0.5,
          v: cfg.pos?.v ?? 0.5,
          corner: cfg.pos?.corner || cfg.corner || "tl",
          dx: cfg.pos?.dx ?? 0,
          dy: cfg.pos?.dy ?? 0,
          margin: cfg.margin ?? 0,

          ampX: cfg.float?.ampX ?? 0,
          ampY: cfg.float?.ampY ?? 0.2,
          ampRotDeg: cfg.float?.ampRotDeg ?? 2,
          speed: cfg.float?.speed ?? 0.8,
          phase: cfg.float?.phase ?? 0
        };

        folder.add(state, "visible").onChange((v) => (poster.visible = v));
        folder.add(state, "opacity", 0, 1, 0.01).onChange((v) => (poster.material.uniforms.uOpacity.value = v));
        folder.add(state, "blur", 0.0, 5, 0.01).onChange((v) => (poster.material.uniforms.uBlurPx.value = v));
        folder.add(state, "width", 0.2, 8, 0.01).onChange((v) => {
          const curW = poster.geometry.parameters.width;
          const curH = poster.geometry.parameters.height;
          const aspect = curW / curH;
          const hNew = v / aspect;
          poster.geometry.dispose();
          poster.geometry = new THREE.PlaneGeometry(v, hNew);
          applyPosition();
        });

        const posRoot = folder.addFolder("Positioning");
        posRoot.add(state, "mode", ["world", "uv", "cornerOffset"]).onChange(applyPosition);

        const worldF = posRoot.addFolder("World (x,y,z)");
        worldF.add(state, "x", -room.ROOM_W, room.ROOM_W, 0.01).onChange((v) => { if (state.mode === "world") { poster.position.x = v; syncBase(); } });
        worldF.add(state, "y", -room.ROOM_H/2, room.ROOM_H/2, 0.01).onChange((v) => { if (state.mode === "world") { poster.position.y = v; syncBase(); } });
        worldF.add(state, "z", WALL_Z - 1, WALL_Z + 1, 0.001).onChange((v) => { if (state.mode === "world") { poster.position.z = v; syncBase(); } });

        const uvF = posRoot.addFolder("UV (u,v on back wall)");
        uvF.add(state, "u", 0, 1, 0.001).onChange(applyPosition);
        uvF.add(state, "v", 0, 1, 0.001).onChange(applyPosition);

        const cornerF = posRoot.addFolder("Corner Offset");
        cornerF.add(state, "corner", ["tl", "tr", "bl", "br"]).onChange(applyPosition);
        cornerF.add(state, "dx", -room.ROOM_W, room.ROOM_W, 0.01).onChange(applyPosition);
        cornerF.add(state, "dy", -room.ROOM_H, room.ROOM_H, 0.01).onChange(applyPosition);
        cornerF.add(state, "margin", 0, Math.max(room.ROOM_W, room.ROOM_H) * 0.25, 0.01).onChange(applyPosition);

        const rotF = folder.addFolder("Rotation");
        rotF.add(state, "rotationDeg", -180, 180, 0.1).onChange((v) => {
          poster.rotation.set(0, 0, THREE.MathUtils.degToRad(v));
          const entry = animated.find(a => a.mesh === poster);
          if (entry) entry.base.rotZ = poster.rotation.z;
        });

        const floatF = folder.addFolder("Float");
        floatF.add(state, "ampX", 0, 1, 0.001).onChange(v => { const e = animated.find(a => a.mesh === poster); if (e) (e.float = e.float || {}, e.float.ampX = v); });
        floatF.add(state, "ampY", 0, 1, 0.001).onChange(v => { const e = animated.find(a => a.mesh === poster); if (e) (e.float = e.float || {}, e.float.ampY = v); });
        floatF.add(state, "ampRotDeg", 0, 30, 0.1).onChange(v => { const e = animated.find(a => a.mesh === poster); if (e) (e.float = e.float || {}, e.float.ampRotDeg = v); });
        floatF.add(state, "speed", 0, 3, 0.01).onChange(v => { const e = animated.find(a => a.mesh === poster); if (e) (e.float = e.float || {}, e.float.speed = v); });
        floatF.add(state, "phase", 0, Math.PI * 2, 0.01).onChange(v => { const e = animated.find(a => a.mesh === poster); if (e) (e.float = e.float || {}, e.float.phase = v); });

        function applyPosition() {
          const localCfg = {
            ...cfg,
            x: state.x, y: state.y, z: state.z,
            margin: state.margin,
            zLift: cfg.zLift,
            pos: { mode: state.mode, u: state.u, v: state.v, corner: state.corner, dx: state.dx, dy: state.dy }
          };
          placeByConfig(poster, localCfg);
          syncBase();
        }

        function syncBase() {
          const entry = animated.find(a => a.mesh === poster);
          if (entry) entry.base = { x: poster.position.x, y: poster.position.y, z: poster.position.z, rotZ: poster.rotation.z };
        }
      }
    });
  });

  // ===== Interaction (hover + click) =====
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
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      didDrag = true;
    }
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
            if (a < 10) {
              isShadowPixel = false;
            } else if (brightness > 60) {
              isShadowPixel = false;
            } else {
              isShadowPixel = true;
            }
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
        const pad = 12;
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

  function onClick(e) {
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
          const cfg = postersConfig.find(c => c.name === tipName);
          if (cfg && cfg.href) destHref = cfg.href;
        }
      } catch (err) {
        // ignore
      }

      if (!destHref && hoveredPoster?.userData?.href) destHref = hoveredPoster.userData.href;
      if (!destHref && hits[0]?.object?.userData?.href) destHref = hits[0].object.userData.href;

      if (destHref) {
        try {
          (domEl || document.body).style.cursor = "default";
          hoveredPoster = null;
          if (tooltip) {
            tooltip.style.opacity = "0";
            tooltip.style.display = "none";
            if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
          }
        } catch (err) {
          // ignore
        }

        navigate(destHref);
      }
    }
  }

  (domEl || window).addEventListener("pointerdown", onPointerDown);
  (domEl || window).addEventListener("pointermove", onPointerMove, { passive: true });
  (domEl || window).addEventListener("click", onClick);

  // ===== Float animation =====
  function tick() {
    const t = clock.getElapsedTime();
    for (const entry of animated) {
      const { mesh, base, float } = entry;
      if (!float) continue;
      const s = float.speed ?? 0.8;
      const ph = float.phase ?? 0.0;
      const dx = (float.ampX ?? 0) * Math.sin(t * s + ph);
      const dy = (float.ampY ?? 0) * Math.cos(t * s + ph);
      const dRot = THREE.MathUtils.degToRad(float.ampRotDeg ?? 0) * Math.sin(t * s * 0.8 + ph * 1.3);

      const distX = Math.abs(base.x + dx);
      const zLift = Math.min(10, distX * 2); 
      mesh.rotation.z = base.rotZ + dRot;
      mesh.position.set(base.x + dx, base.y + dy, base.z + zLift);
    }
    raf = requestAnimationFrame(tick);
  }
  tick();

  // ===== Pointer rotate ONLY shadowRoot (camera/room stay) =====
  let dragActive = false;
  let lastX = 0, lastY = 0;
  const rot = { x: 0, y: 0 };
  let rotateEnabled = false;
  let onDownRef, onMoveRef, onUpRef;

  function setRotation({ x = rot.x, y = rot.y, z = 0 } = {}) {
    rot.x = x; rot.y = y;
    shadowRoot.rotation.set(rot.x, rot.y, z);
  }

  function enablePointerRotate(targetEl = domEl || window, opts = {}) {
    if (rotateEnabled) return;
    rotateEnabled = true;

    const SENS_X = opts.yawSens ?? 0.005;
    const SENS_Y = opts.pitchSens ?? 0.004;
    const PITCH_MIN = opts.pitchMin ?? -Math.PI / 6;
    const PITCH_MAX = opts.pitchMax ??  Math.PI / 6;

    onDownRef = (e) => {
      dragActive = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    onMoveRef = (e) => {
      if (!dragActive) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      rot.y += dx * SENS_X;
      rot.x = THREE.MathUtils.clamp(rot.x + dy * SENS_Y, PITCH_MIN, PITCH_MAX);
      shadowRoot.rotation.set(rot.x, rot.y, 0);

      const parallaxScale = 2.5;
      const MAX_X = room.ROOM_W * 0.35;
      const MAX_Z = room.ROOM_D * 0.35;
      shadowRoot.position.x += ((THREE.MathUtils.clamp(rot.y * parallaxScale, -MAX_X, MAX_X)) - shadowRoot.position.x) * 0.1;
      shadowRoot.position.z += ((THREE.MathUtils.clamp(rot.x * parallaxScale, -MAX_Z, MAX_Z)) - shadowRoot.position.z) * 0.1;
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

  return {
    enablePointerRotate,
    disablePointerRotate,
    setRotation,
    dispose() {
      cancelAnimationFrame(raf);
      (domEl || window).removeEventListener("pointermove", onPointerMove);
      (domEl || window).removeEventListener("click", onClick);
      disablePointerRotate();
      if (tooltip && tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
    }
  };
}
