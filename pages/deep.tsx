import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Dashboard from "../layouts/Dashboard";
import styles from "../styles/deep.module.scss";
import aviatorThumb from "../assets/effects/aviators/thumb.png";

declare global {
  interface Window {
    DeepAR?: any;
  }
}

const Deep = () => {
  const containerRef: React.LegacyRef<HTMLCanvasElement> | null = useRef(null);
  const [assetPath, setAssetPath] = useState("../lib/effects/aviators");

  useEffect(() => {
    /**
     * DeepAR package isn't a module as of time of writing. So the library file was imported via a script tag in App.js and can be accessed via the window object.
     * Source code for the library is located in public/libs
     */

    if (window.DeepAR) {
      const deep = window.DeepAR;
      // Initialize DeepAR
      const deepAR = deep({
        licenseKey:
          "3c0601c6e819b65821ed92ba3d9c8fa0b1a47ad32a026c5a383d7fa5e055d336d35d72a64c866a6d",
        canvasWidth: containerRef.current?.width,
        canvasHeight: containerRef.current?.height,
        canvas: containerRef.current,
        numberOfFaces: 1,
        onInitialize: () => {
          // Start video
          deepAR.startVideo(true);

          deepAR.switchEffect(0, "slot", assetPath, function () {
            console.log("effect loaded");
          });
        },
      });

      // download the face tracking model
      deepAR.downloadFaceTrackingModel("../lib/models-68-extreme.bin");
    }
  }, [assetPath]);

  return (
    <Dashboard title="AR Tryon" description={"Face tryon page"}>
      <div className={styles.deepExp}>
        <canvas ref={containerRef}></canvas>

        <div className={styles.buttons}>
          <button onClick={() => setAssetPath("../lib/effects/aviators")}>
            <Image src={aviatorThumb} alt="aviator thumbnail" />
          </button>
          <button
            onClick={() => setAssetPath("../lib/effects/tiny_sunglasses")}
          >
            Glasses2
          </button>
        </div>
      </div>
    </Dashboard>
  );
};

export default Deep;
