import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { Shadow } from "../components/shadow.js";
import { Arrows } from "../components/arrows.js";

export function mountLandingPage(canvas, navigate) {
  // detect mobile / low-power devices
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // turn off antialiasing for mobile or low-end
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile, // false on mobile
    powerPreference: "high-performance",
  });

  // clamp pixel ratio to avoid over-rendering
  const maxPR = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(maxPR);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0c0d);

  // use a tighter FOV for a cleaner top-down overview
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
  // position camera high above the center to view the whole hexagon
  camera.position.set(0, 25.0, 0.1);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  const room = { ROOM_W: 20, ROOM_H: 10, ROOM_D: 20 };
  const SIDE_LEN = room.ROOM_D;
  const FLOOR_Y = -room.ROOM_H / 2 + 0.01;
  const WALL_Z = -room.ROOM_D / 2;

  const wallMat = new THREE.MeshPhysicalMaterial({
    color: 0x444444,
    roughness: 0.8,
    metalness: 0.0,
    transparent: true,
    side: THREE.DoubleSide
  });

  const floorMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  });

  // back wall removed: we'll construct a closed hexagonal room below

  const ctl = Shadow(scene, room, WALL_Z, camera, renderer.domElement, navigate, null);

  // initialize orbit controls and view target (center of room for top-down view)
  const viewTarget = new THREE.Vector3(0, 0, 0);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.target.copy(viewTarget);
  const AZI = THREE.MathUtils.degToRad(22);
  controls.minAzimuthAngle = -AZI;
  controls.maxAzimuthAngle = AZI;
  // allow looking straight down if needed (but rotation is disabled by default)
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;
  controls.minDistance = 5.5;
  controls.maxDistance = 14.0;
  controls.enableRotate = false;

  // create a closed octagonal room by building 8 wall panels from the polygon sides
    const walls = [];
    // apothem (distance from center to wall center) - keep previous back wall distance
    const apothem = room.ROOM_D / 2;
    // circumradius for the regular polygon (distance to vertices)
    const POLY_R = apothem / Math.cos(Math.PI / 8); // for octagon use pi/8
    const VERT_COUNT = 8;

    // compute hexagon vertices (using same coordinate convention as earlier)
    const verts = [];
    for (let i = 0; i < VERT_COUNT; i++) {
      const ang = (i / VERT_COUNT) * Math.PI * 2; // 0, 60, 120, ...
      const vx = Math.sin(ang) * POLY_R;
      const vz = -Math.cos(ang) * POLY_R;
      verts.push(new THREE.Vector3(vx, 0, vz));
    }

    // build walls from side midpoints between consecutive vertices
    for (let i = 0; i < VERT_COUNT; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % VERT_COUNT];
      const sideCenter = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      const sideLen = a.distanceTo(b);
      const wallMesh = new THREE.Mesh(new THREE.PlaneGeometry(sideLen, room.ROOM_H), wallMat);
      wallMesh.position.copy(sideCenter);
      // orient the wall so its normal faces the center
      wallMesh.lookAt(0, 0, 0);
      scene.add(wallMesh);
      walls.push(wallMesh);
    }
  controls.maxAzimuthAngle = AZI;
  controls.minPolarAngle = THREE.MathUtils.degToRad(25);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(95);
  controls.minDistance = 5.5;
  controls.maxDistance = 14.0;

  controls.enableRotate = false;

  let isInteracting = false;

  // mark as interacting when pointer down or touch
  renderer.domElement.addEventListener("pointerdown", () => {
    isInteracting = true;
  });
  renderer.domElement.addEventListener("pointerup", () => {
    isInteracting = false;
  });
  renderer.domElement.addEventListener("touchstart", () => {
    isInteracting = true;
  });
  renderer.domElement.addEventListener("touchend", () => {
    isInteracting = false;
  });

  // individual left/right walls removed — using hexagon walls instead

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(room.ROOM_W, SIDE_LEN), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR_Y, WALL_Z + SIDE_LEN / 2);
  floor.receiveShadow = false;
  floor.castShadow = false;
  scene.add(floor);

  const ambient = new THREE.AmbientLight(0xffffff, 0.0);
  scene.add(ambient);

  const backSpot = new THREE.SpotLight(0xffffff, 9.5, room.ROOM_D * 1.8, 1.0, 0.9, 2.0);
  const backHalo = new THREE.SpotLight(0xffffff, 2.2, room.ROOM_D * 2.4, 1.0, 1.0, 2.0);
  scene.add(backSpot, backSpot.target, backHalo);

  function makeSpot(color = 0xffffff) {
    const s = new THREE.SpotLight(color, 10, room.ROOM_D * 2.5, Math.PI / 6, 0.8, 2.0);
    scene.add(s, s.target);
    return s;
  }

  const frontLeft = makeSpot(0xffffff);
  const frontRight = makeSpot(0xffffff);

  const params = {
    ambient: 100,
    back: {
      posX: 0,
      y: 0,
      d: 8,
      aimX: 0,
      aimY: 0,
      angleDeg: 43.2,
      margin: 0.04,
      color: "#ffffff",
      intensity: 300,
      minIntensity: 100,
      pulseSpeed: 90.0,
      penumbra: 1,
      decay: 0.9,
      haloMul: 5,
      haloIntensity: 200
    },
    frontLeft: {
      color: "#ffffff",
      intensity: 5,
      penumbra: 0.07,
      decay: 0.1,
      angleDeg: 31.8,
      posX: -6.34,
      y: -1.35,
      z: -18.6,
      aimX: -18,
      aimY: -2.17
    },
    frontRight: {
      color: "#ffffff",
      intensity: 5,
      penumbra: 0.07,
      decay: 0.1,
      angleDeg: 30,
      posX: 6.34,
      y: -1.35,
      z: -18.6,
      aimX: 18,
      aimY: -2.17
    }
  };

  function updateBack() {
    const angle = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(params.back.angleDeg ?? 28, 1, 89));

    backSpot.color.set(params.back.color);
    backSpot.intensity = params.back.intensity;
    backSpot.penumbra = params.back.penumbra;
    backSpot.decay = params.back.decay;
    backSpot.angle = angle;

    backSpot.position.set(params.back.posX, params.back.y, WALL_Z + params.back.d);
    backSpot.target.position.set(params.back.aimX, params.back.aimY, WALL_Z);

    const haloAngle = Math.min(Math.PI / 2 - 0.001, angle * params.back.haloMul);
    backHalo.color.set(params.back.color);
    backHalo.intensity = params.back.haloIntensity;
    backHalo.angle = haloAngle;
    backHalo.position.copy(backSpot.position);
    backHalo.target = backSpot.target;
  }

  function updateFrontLeft() {
    const p = params.frontLeft;
    frontLeft.color.set(p.color);
    frontLeft.intensity = p.intensity;
    frontLeft.penumbra = p.penumbra;
    frontLeft.decay = p.decay;
    frontLeft.angle = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(p.angleDeg, 1, 89));

    frontLeft.position.set(p.posX, p.y, p.z);

    frontLeft.target.position.set(p.aimX, p.aimY, WALL_Z);
    frontLeft.target.updateMatrixWorld();
  }

  function updateFrontRight() {
    const p = params.frontRight;
    frontRight.color.set(p.color);
    frontRight.intensity = p.intensity;
    frontRight.penumbra = p.penumbra;
    frontRight.decay = p.decay;
    frontRight.angle = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(p.angleDeg, 1, 89));

    frontRight.position.set(p.posX, p.y, p.z);
    frontRight.target.position.set(p.aimX, p.aimY, WALL_Z);
    frontRight.target.updateMatrixWorld();
  }

  function updateLights() {
    updateBack();
    updateFrontLeft();
    updateFrontRight();
    ambient.intensity = params.ambient;
  }
  updateLights();
  backSpot.intensity = params.back.minIntensity ?? 100;

  const clock = new THREE.Clock();
  let backAnimDir = 1;
  const backAnimMin = params.back.minIntensity ?? 100;
  const backAnimMax = params.back.intensity;

    setTimeout(() => {
      try { hideOverlay(); } catch (e) { }
    }, 3000);

    let floorEnabledScheduled = false;
    function enableFloorTextNow() {
      if (floorEnabledScheduled) return;
      floorEnabledScheduled = true;
      try {
        if (ctl && typeof ctl.enableFloorText === "function") ctl.enableFloorText();
      } catch (err) { }
    }

  /*
  const gui = new GUI({ title: "Light Controls" });
  gui.add(params, "ambient", 0, 1, 0.01).onChange(updateLights);

  const backF = gui.addFolder("Back Wall");
  backF.add(params.back, "posX", -room.ROOM_W, room.ROOM_W, 0.01).onChange(updateLights);
  backF.add(params.back, "y", -2, 2, 0.01).onChange(updateLights);
  backF.add(params.back, "d", 0.5, 20, 0.1).onChange(updateLights);
  backF.add(params.back, "aimX", -room.ROOM_W * 3, room.ROOM_W * 3, 0.01).name("aimX (wall)").onChange(updateLights);
  backF.add(params.back, "aimY", -room.ROOM_H/2, room.ROOM_H/2, 0.01).name("aimY (wall)").onChange(updateLights);
  backF.add(params.back, "angleDeg", 1, 89, 0.1).name("angle°").onChange(updateLights);
  backF.add(params.back, "margin", 0, 0.5, 0.005).onChange(updateLights);
  backF.addColor(params.back, "color").onChange(updateLights);
  backF.add(params.back, "intensity", 0, 1000, 0.1).onChange(updateLights);
  backF.add(params.back, "pulseSpeed", 0.01, 50, 0.01).name("pulse speed").onChange((v) => {
  });
  backF.add(params.back, "penumbra", 0, 1, 0.01).onChange(updateLights);
  backF.add(params.back, "decay", 0.1, 3, 0.1).onChange(updateLights);
  backF.add(params.back, "haloMul", 1.0, 5.0, 0.01).onChange(updateLights);
  backF.add(params.back, "haloIntensity", 0, 200, 0.1).onChange(updateLights);

  const flF = gui.addFolder("Front Left (elliptical)");
  flF.add(params.frontLeft, "posX", -room.ROOM_W, room.ROOM_W, 0.01).onChange(updateLights);
  flF.add(params.frontLeft, "y", -room.ROOM_H/2, room.ROOM_H/2, 0.01).onChange(updateLights);
  flF.add(params.frontLeft, "z", -room.ROOM_D, room.ROOM_D, 0.01).onChange(updateLights);
  flF.add(params.frontLeft, "aimX", -room.ROOM_W * 5, room.ROOM_W * 5, 0.01).name("aimX (wall)").onChange(updateLights);
  flF.add(params.frontLeft, "aimY", -room.ROOM_H * 2, room.ROOM_H * 2, 0.01).name("aimY (wall)").onChange(updateLights);
  flF.add(params.frontLeft, "angleDeg", 1, 89, 0.1).name("angle°").onChange(updateLights);
  flF.add(params.frontLeft, "intensity", 0, 1000, 0.1).onChange(updateLights);
  flF.add(params.frontLeft, "penumbra", 0, 1, 0.01).onChange(updateLights);
  flF.add(params.frontLeft, "decay", 0.1, 3, 0.1).onChange(updateLights);
  flF.addColor(params.frontLeft, "color").onChange(updateLights);

  const frF = gui.addFolder("Front Right (elliptical)");
  frF.add(params.frontRight, "posX", -room.ROOM_W, room.ROOM_W, 0.01).onChange(updateLights);
  frF.add(params.frontRight, "y", -room.ROOM_H/2, room.ROOM_H/2, 0.01).onChange(updateLights);
  frF.add(params.frontRight, "z", -room.ROOM_D, room.ROOM_D, 0.01).onChange(updateLights);
  frF.add(params.frontRight, "aimX", -room.ROOM_W * 5, room.ROOM_W * 5, 0.01).name("aimX (wall)").onChange(updateLights);
  frF.add(params.frontRight, "aimY", -room.ROOM_H * 2, room.ROOM_H * 2, 0.01).name("aimY (wall)").onChange(updateLights);
  frF.add(params.frontRight, "angleDeg", 1, 89, 0.1).name("angle°").onChange(updateLights);
  frF.add(params.frontRight, "intensity", 0, 1000, 0.1).onChange(updateLights);
  frF.add(params.frontRight, "penumbra", 0, 1, 0.01).onChange(updateLights);
  frF.add(params.frontRight, "decay", 0.1, 3, 0.1).onChange(updateLights);
  frF.addColor(params.frontRight, "color").onChange(updateLights);
  */

  let raf = 0;
  function render() {
    // --- render loop with FPS cap ---
    let raf = 0;
    let lastRenderTime = 0;
    const TARGET_FPS = 30;
    const FRAME_DURATION = 1000 / TARGET_FPS;

    function render(now) {
      raf = requestAnimationFrame(render);

      // skip frames to cap FPS
      if (!lastRenderTime) lastRenderTime = now;
      const elapsed = now - lastRenderTime;
      if (elapsed < FRAME_DURATION) return;
      lastRenderTime = now - (elapsed % FRAME_DURATION);

      // update controls if you still want damping / rotation
      if (isInteracting || controls.enableDamping) {
        controls.update();
      }

      const dt = clock.getDelta();
      const speed = params.back.pulseSpeed ?? 2.0;
      backSpot.intensity += backAnimDir * speed * dt;

      if (backAnimDir > 0 && backSpot.intensity >= backAnimMax) {
        backSpot.intensity = backAnimMax;
        backAnimDir = -1;
      } else if (backAnimDir < 0 && backSpot.intensity <= backAnimMin) {
        backSpot.intensity = backAnimMin;
        backAnimDir = 1;
      }

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(render);

  }
  render();

  function onResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener("resize", onResize);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      // gui.destroy();
      try {
        // if (arrows && typeof arrows.dispose === "function") arrows.dispose();
      } catch (err) { }
      try {
        if (ctl && typeof ctl.dispose === "function") ctl.dispose();
      } catch (err) { }
      try {
        renderer.dispose();
      } catch (err) { }
    }
  };
}
