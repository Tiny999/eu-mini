import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Dashboard from "../layouts/Dashboard";
import styles from "../styles/three.module.scss";

const faceLandmarksDetection = require("@tensorflow-models/face-landmarks-detection");
// require("@tensorflow/tfjs-backend-webgl");

const Deep = () => {
  const containerRef: React.LegacyRef<HTMLDivElement> = useRef(null);
  const videoRef: React.LegacyRef<HTMLVideoElement> = useRef(null);
  const outputCanvasRef: React.LegacyRef<HTMLCanvasElement> | null =
    useRef(null);
  const overlayCanvasRef: React.LegacyRef<HTMLCanvasElement> | null =
    useRef(null);
  const [loadingText, setLoadingText] = useState("Loading...");

  const drawLine = (
    context: any,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };

  const setupWebcam = async () => {
    return new Promise((resolve, reject) => {
      let newNavigator: any;
      newNavigator = window.navigator;

      const webcamElement = videoRef?.current;
      newNavigator.getUserMedia =
        newNavigator.getUserMedia ||
        newNavigator.webkitGetUserMedia ||
        newNavigator.mozGetUserMedia ||
        newNavigator.msGetUserMedia;

      if (newNavigator.getUserMedia) {
        newNavigator.getUserMedia(
          { video: true },
          (stream: any) => {
            webcamElement.srcObject = stream;
            webcamElement?.addEventListener("loadeddata", resolve, false);
          },
          () => {
            reject();
          }
        );
      }
    });
  };

  let output = null,
    model = null,
    renderer = null,
    scene = null,
    camera = null,
    glasses = null;

  const loadModel = (filePath: string) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        filePath,
        (gltf: any) => {
          resolve(gltf.scene);
        },
        undefined,
        (err: any) => {
          reject(err);
        }
      );
    });
  };

  const trackFace = async () => {
    const video = videoRef?.current;
    output.drawImage(
      video,
      0,
      0,
      video?.width,
      video?.height,
      0,
      0,
      video?.width,
      video?.height
    );
    renderer.render(scene, camera);

    let faces = [];

    faces = await model.estimateFaces({
      input: video,
      returnTensors: false,
      flipHorizontal: false,
    });

    faces.forEach((face) => {
      // Draw the bounding box
      const x1 = face.boundingBox.topLeft[0];
      const y1 = face.boundingBox.topLeft[1];
      const x2 = face.boundingBox.bottomRight[0];
      const y2 = face.boundingBox.bottomRight[1];
      const bWidth = x2 - x1;
      const bHeight = y2 - y1;
      drawLine(output, x1, y1, x2, y2);
      drawLine(output, x2, y1, x2, y2);
      drawLine(output, x1, y2, x2, y2);
      drawLine(output, x1, y1, x1, y2);

      glasses.position.x = face.annotations.midwayBetweenEyes[0][0];
      glasses.position.y = -face.annotations.midwayBetweenEyes[0][1];
      glasses.position.z =
        -camera.position.z + face.annotations.midwayBetweenEyes[0][2];

      // Calculate an Up-Vector using the eyes position and the bottom of the nose
      glasses.up.x =
        face.annotations.midwayBetweenEyes[0][0] -
        face.annotations.noseBottom[0][0];
      glasses.up.y = -(
        face.annotations.midwayBetweenEyes[0][1] -
        face.annotations.noseBottom[0][1]
      );
      glasses.up.z =
        face.annotations.midwayBetweenEyes[0][2] -
        face.annotations.noseBottom[0][2];

      const length = Math.sqrt(
        glasses.up.x ** 2 + glasses.up.y ** 2 + glasses.up.z ** 2
      );

      glasses.up.x /= length;
      glasses.up.y /= length;
      glasses.up.z /= length;

      // Scale to size of head
      const eyeDistance = Math.sqrt(
        (face.annotations.leftEyeUpper1[3][0] -
          face.annotations.rightEyeUpper1[3][0]) **
          2 +
          (face.annotations.leftEyeUpper1[3][1] -
            face.annotations.rightEyeUpper1[3][1]) **
            2 +
          (face.annotations.leftEyeUpper1[3][2] -
            face.annotations.rightEyeUpper1[3][2]) **
            2
      );

      glasses.scale.x = eyeDistance / 6;
      glasses.scale.y = eyeDistance / 6;
      glasses.scale.z = eyeDistance / 6;

      glasses.rotation.y = Math.PI;
      glasses.rotation.z = Math.PI / 2 - Math.acos(glasses.up.x);
    });

    requestAnimationFrame(trackFace);
  };

  const init = async () => {
    await setupWebcam();
    const video = videoRef?.current;
    video?.play();
    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    let canvas = outputCanvasRef?.current;
    canvas.width = video.width;
    canvas.height = video.height;

    let overlay = overlayCanvasRef?.current;
    overlay.width = video.width;
    overlay.height = video.height;

    output = canvas.getContext("2d");
    output.translate(canvas.width, 0);
    output.scale(-1, 1); // Mirror camera stream
    output.fillStyle = "#fdffb6";
    output.strokeStyle = "#fdffb6";
    output.lineWidth = 2;

    // Load Face Detection Model
    model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );

    renderer = new THREE.WebGLRenderer({
      canvas: overlayCanvasRef?.current,
      alpha: true,
    });

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.x = videoWidth / 2;
    camera.position.y = -videoHeight / 2;
    camera.position.z = -(videoHeight / 2) / Math.tan(45 / 2);

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xcccccc, 0.4));
    camera.add(new THREE.PointLight(0xffffff, 0.8));
    scene.add(camera);

    camera.lookAt({
      x: videoWidth / 2,
      y: -videoHeight / 2,
      z: 0,
      isVector3: true,
    });

    glasses = await loadModel("./lib/heart_glasses.gltf");
    scene.add(glasses);

    setLoadingText("Loaded!");

    trackFace();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Dashboard title="AR Tryon" description={"Face tryon page"}>
      <div className={styles.three}>
        <div className={styles.experience} ref={containerRef}>
          <canvas id="output" ref={outputCanvasRef}></canvas>
          <canvas id="overlay" ref={overlayCanvasRef}></canvas>
        </div>

        <video
          id="webcam"
          playsInline={true}
          className={styles.video}
          ref={videoRef}
        ></video>
        <h1 id="status">{loadingText}</h1>
      </div>
    </Dashboard>
  );
};

export default Deep;
