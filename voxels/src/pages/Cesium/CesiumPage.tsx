import {
  Cartesian3,
  Cesium3DTileStyle,
  Viewer as CesiumViewer,
  createWorldTerrainAsync,
  IonImageryProvider,
  IonResource,
  OpenStreetMapImageryProvider,
  ScreenSpaceEventHandler,
  defined,
  Color,
  ScreenSpaceEventType,
} from "cesium";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CameraFlyTo,
  Cesium3DTileset,
  CesiumComponentRef,
  ImageryLayer,
  Scene,
  Viewer,
} from "resium";

const position = Cartesian3.fromDegrees(10.253721, 60.101188, 2500);
const terrainProvider = createWorldTerrainAsync();

const osmImagerery = new OpenStreetMapImageryProvider({
  url: "https://tile.openstreetmap.org/",
});

const tileStyle = new Cesium3DTileStyle({
  color: {
    conditions: [
      // ["true", "rgba(255, 255, 255, 0.1)"],
      ["true", "color('white')"],
    ],
  },
});

const sentinelImagery = IonImageryProvider.fromAssetId(3954);

export function CesiumPage() {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [alpha, setAlpha] = useState(1);

  const handleReady = (tileset: unknown) => {
    // document.querySelector(".cesium-viewer-toolbar")?.remove();
    if (viewerRef.current) {
      viewerRef.current.zoomTo(tileset);
    }
  };

  return (
    <>
      <div
        style={{
          zIndex: 50,
          background: "white",
          display: "block",
          padding: 4,
          position: "absolute",
        }}
      >
        <input
          type="range"
          onChange={(e) => {
            if (!viewerRef.current) return;
            const value = e.target.valueAsNumber;
            setAlpha(value);
          }}
          min={0}
          max={1}
          step={0.05}
        />
      </div>

      <Viewer
        full
        ref={viewerRef}
        timeline={false}
        animation={false}
        sceneModePicker={false}
        // baseLayerPicker={false}
        baseLayer={false}
        navigationHelpButton={false}
        terrainProvider={terrainProvider}
      >
        <Scene verticalExaggeration={2} />

        <Cesium3DTileset
          url={IonResource.fromAssetId(3062614, {
            accessToken:
              "",
          })}
        />

        {/* <ImageryLayer alpha={1 - alpha} imageryProvider={osmImagerery} /> */}
        <ImageryLayer alpha={alpha} imageryProvider={sentinelImagery} />

        {/* Prevent camera resetting when state changes */}
        {useMemo(
          () => (
            <>
              <Camera />
              <CameraFlyTo duration={0} destination={position} />
            </>
          ),
          []
        )}
        <Cesium3DTileset
          url={
            "https://tile.googleapis.com/v1/3dtiles/root.json?key="
          }
          onReady={handleReady}
          showCreditsOnScreen
          style={tileStyle}
        />
      </Viewer>
    </>
  );
}
