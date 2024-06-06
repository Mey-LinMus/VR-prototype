import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

class ThreeClassSceneManager {
  constructor(containerRef, THREEInstance) {
    this.THREE = THREEInstance;
    this.containerRef = containerRef;
    this.mouseX = 0;
    this.mouseY = 0;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.effect = null;
    this.isStereoEnabled = false;

    this.init();
    this.setupEventListeners();
    this.setupDeviceOrientation();
  }

  init() {
    const container = this.containerRef.current;
    this.camera = new this.THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      100000
    );
    this.camera.position.z = 3200;
    this.scene = new this.THREE.Scene();
    this.renderer = new this.THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);
    this.effect = new StereoEffect(this.renderer);
    this.effect.setSize(window.innerWidth, window.innerHeight);
  }

  setupEventListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this));
  }

  setupDeviceOrientation() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        "deviceorientation",
        this.onDeviceOrientation.bind(this)
      );
    } else {
      console.log("Device orientation not supported");
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.effect.setSize(window.innerWidth, window.innerHeight);
  }

  onDocumentMouseMove(event) {
    this.mouseX = (event.clientX - window.innerWidth / 2) * 10;
    this.mouseY = (event.clientY - window.innerHeight / 2) * 10;
  }

  requestPermission() {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("devicemotion", (e) => {
              // Handle 'e' here (e.g., update UI based on motion data)
            });
          }
        })
        .catch(console.error);
    } else {
      console.log("DeviceMotionEvent is not defined");
    }
  }

  onDeviceOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    this.camera.rotation.x = (beta * Math.PI) / -180;
    this.camera.rotation.y = (gamma * Math.PI) / -90;
    this.camera.rotation.z = (alpha * Math.PI) / -90;
  }

  enableStereoEffect() {
    this.isStereoEnabled = true;
    this.effect.setSize(window.innerWidth, window.innerHeight);
  }

  disableStereoEffect() {
    this.isStereoEnabled = false;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    if (this.isStereoEnabled) {
      this.effect.render(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  getCamera() {
    return this.camera;
  }

  getScene() {
    return this.scene;
  }

  getRenderer() {
    return this.renderer;
  }

  getEffect() {
    return this.effect;
  }
}

export default ThreeClassSceneManager;
