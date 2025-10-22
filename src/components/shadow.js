import * as THREE from "three";

export function Shadow(scene, room, WALL_Z, gui) {
  const texLoader = new THREE.TextureLoader();

  const postersConfig = [
  {
    id: "P1",
    name: "Emily Sarten",
    url: "/assets/Art & Leisure (Crying) - Emily Sarten.png",
    width: 8,
    opacity: 0.4,
    blurPx: 3,
    rotationDeg: 0,
    corner: "tl",
    margin: 1.2,
    zLift: 0.01
  },
  {
    id: "P2",
    name: "Ivy Vo",
    url: "/assets/G9 - Ivy Vo.png",
    width: 8,
    opacity: 0.3,
    blurPx: 3,
    rotationDeg: 0,
    x: 2.8,
    y: 1.01,
    z: -29.99
  },
  {
    id: "P3",
    name: "LHPG",
    url: "/assets/LHPG.png",
    width: 5.58,
    opacity: 0.3,
    blurPx: 3,
    rotationDeg: -2.5,
    corner: "bl",
    margin: 1.2,
    zLift: 0.012
  },
  {
    id: "P4",
    name: "Le Thanh Thao",
    url: "/assets/Giac mo Chapiti - Le Thanh Thao.png",
    width: 8,
    opacity: 0.3,
    blurPx: 3,
    rotationDeg: -30.5,
    x: 2.43,
    y: -1.91,
    z: -29.98
  }];

  function placeAtCorner(mesh, corner = "tl", margin = 1.2, zLift = 0.01) {
    const w = mesh.geometry.parameters.width;
    const h = mesh.geometry.parameters.height;
    const xSign = corner.includes("l") ? -1 : 1;
    const ySign = corner.includes("t") ? 1 : -1;
    const x = xSign * (room.ROOM_W * 0.5 - margin - w * 0.5);
    const y = ySign * (room.ROOM_H * 0.5 - margin - h * 0.5);
    const z = WALL_Z + zLift;
    mesh.position.set(x, y, z);
  }

  function makeBlurPosterMat(tex, blurPx = 2.0, opacity = 1.0) {
    const img = tex.image || tex.source?.data;
    const tw = (img && img.width)  ? img.width  : 1024;
    const th = (img && img.height) ? img.height : 1024;

    return new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
        map:      { value: tex },
        uOpacity: { value: opacity },
        uTexel:   { value: new THREE.Vector2(1/tw, 1/th) },
        uBlurPx:  { value: blurPx }                         
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
                w[0] = 0.06136;
                w[1] = 0.34477;
                w[2] = 0.45774;
                w[3] = 0.34477;
                w[4] = 0.06136;

                for (int ix = -2; ix <= 2; ix++) {
                    for (int iy = -2; iy <= 2; iy++) {
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
        }`
    });
}

  function buildPosterMesh(tex, cfg) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.premultiplyAlpha = true;
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;

    const imgW = tex.source.data?.width || 1024;
    const imgH = tex.source.data?.height || 1024;
    const aspect = imgW / imgH;

    const w = cfg.width ?? 3.0;
    const h = w / aspect;

    const mat = makeBlurPosterMat(tex, cfg.blurPx ?? 2.0, cfg.opacity ?? 1.0);
    const poster = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    poster.renderOrder = 10;

    if (typeof cfg.x === "number" && typeof cfg.y === "number") {
      poster.position.set(cfg.x, cfg.y, cfg.z ?? (WALL_Z + (cfg.zLift ?? 0.01)));
    } else {
      placeAtCorner(poster, cfg.corner ?? "tl", cfg.margin ?? 1.2, cfg.zLift ?? 0.01);
    }

    const rotDeg = cfg.rotationDeg ?? 0;
    poster.rotation.set(0, 0, THREE.MathUtils.degToRad(rotDeg));

    return { poster, aspect };
  }

  postersConfig.forEach((cfg) => {
    texLoader.load(encodeURI(cfg.url), (tex) => {
      const { poster, aspect } = buildPosterMesh(tex, cfg);
      poster.userData.aspect = aspect;
      scene.add(poster);

      if (gui) {
        const folder = gui.addFolder?.(`Shadow – ${cfg.id}`) ?? null;
        if (!folder) return;

        const state = {
          visible: true,
          opacity: cfg.opacity ?? 1.0,
          blur: cfg.blur ?? 0.002,
          width: cfg.width ?? 3.0,
          rotationDeg: cfg.rotationDeg ?? 0,
          x: poster.position.x,
          y: poster.position.y,
          z: poster.position.z
        };

        folder.add(state, "visible").onChange(v => (poster.visible = v));
        folder.add(state, "opacity", 0, 1, 0.01).onChange(v => (poster.material.uniforms.uOpacity.value = v));
        folder.add(state, "blur", 0.0, 3, 0.0001).onChange(v => (poster.material.uniforms.uBlur.value = v));
        folder.add(state, "width", 0.2, 8, 0.01).onChange(v => {
          const hNew = v / poster.userData.aspect;
          poster.geometry.dispose();
          poster.geometry = new THREE.PlaneGeometry(v, hNew);
        });

        const posF = folder.addFolder("Position");
        posF.add(state, "x", -room.ROOM_W, room.ROOM_W, 0.01).onChange(v => (poster.position.x = v));
        posF.add(state, "y", -room.ROOM_H/2, room.ROOM_H/2, 0.01).onChange(v => (poster.position.y = v));
        posF.add(state, "z", WALL_Z - 1, WALL_Z + 1, 0.001).onChange(v => (poster.position.z = v));

        const rotF = folder.addFolder("Rotation");
        rotF.add(state, "rotationDeg", -180, 180, 0.1).onChange(v => {
          poster.rotation.set(0, 0, THREE.MathUtils.degToRad(v));
        });
      }
    });
  });
}
