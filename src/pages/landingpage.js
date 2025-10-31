import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { Shadow } from "../components/shadow.js";
import { Arrows } from "../components/arrows.js";

export function mountLandingPage(canvas, navigate) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0c0d);

  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 2.0, 5.0);
  scene.add(camera);

  const room = { ROOM_W: 20, ROOM_H: 15, ROOM_D: 70 };
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

  const back = new THREE.Mesh(new THREE.PlaneGeometry(room.ROOM_W, room.ROOM_H), wallMat);
  back.position.set(0, 0, WALL_Z);
  scene.add(back);

  const ctl = Shadow(scene, room, WALL_Z, camera, renderer.domElement, navigate, null);

  const arrows = Arrows(renderer.domElement, {
    onLeft: () => {
      try {
        if (ctl && typeof ctl.setAutoDirection === "function") ctl.setAutoDirection(1);
      } catch (err) {}
    },
    onRight: () => {
      try {
        if (ctl && typeof ctl.setAutoDirection === "function") ctl.setAutoDirection(-1);
      } catch (err) {}
    },
  });

  const viewTarget = new THREE.Vector3(0, -0.95, WALL_Z * 0.65);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.target.copy(viewTarget);
  const AZI = THREE.MathUtils.degToRad(22);
  controls.minAzimuthAngle = -AZI;
  controls.maxAzimuthAngle = AZI;
  controls.minPolarAngle = THREE.MathUtils.degToRad(25);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(95);
  controls.minDistance = 5.5;
  controls.maxDistance = 14.0;

  controls.enableRotate = false; 

  const angle = Math.PI * 2 / 3; 

  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(SIDE_LEN, room.ROOM_H),
    wallMat
  );
  leftWall.rotation.y = -angle; 
  leftWall.position.set(
    -(room.ROOM_W / 2), 
    0,
    WALL_Z + Math.sin(Math.PI / 6) * (room.ROOM_W / 2)
  );
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(SIDE_LEN, room.ROOM_H),
    wallMat
  );
  rightWall.rotation.y = angle; 
  rightWall.position.set(
    room.ROOM_W / 2,
    0,
    WALL_Z + Math.sin(Math.PI / 6) * (room.ROOM_W / 2)
  );
  scene.add(rightWall);

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
    ambient: 0,
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
    controls.update();

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
        if (arrows && typeof arrows.dispose === "function") arrows.dispose();
      } catch (err) {}
      try {
        if (ctl && typeof ctl.dispose === "function") ctl.dispose();
      } catch (err) {}
      try {
        renderer.dispose();
      } catch (err) {}
    }
  };
}
