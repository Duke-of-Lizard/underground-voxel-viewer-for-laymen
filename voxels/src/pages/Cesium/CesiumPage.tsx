import {
  Cartesian3,
  Cesium3DTileStyle,
  Viewer as CesiumViewer,
  createWorldTerrainAsync,
  IonImageryProvider,
  OpenStreetMapImageryProvider,
} from 'cesium'
import { useMemo, useRef } from 'react'
import { Camera, CameraFlyTo, Cesium3DTileset, CesiumComponentRef, ImageryLayer, Scene, Viewer } from 'resium'
import voxels from '../../../../backend/pts.json'
import { useControls } from 'leva'

const position = Cartesian3.fromDegrees(10.253721, 60.101188, 2500)
const terrainProvider = createWorldTerrainAsync()

// const osmImagerery = new OpenStreetMapImageryProvider({
//   url: 'https://tile.openstreetmap.org/',
// })

const tileStyle = new Cesium3DTileStyle({
  color: {
    conditions: [
      // ["true", "rgba(255, 255, 255, 0.1)"],
      ['true', "color('white')"],
    ],
  },
})

const sentinelImagery = IonImageryProvider.fromAssetId(3954)

export function CesiumPage() {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null)
  const { baseLayerOpacity, dataSet } = useControls({
    baseLayerOpacity: { name: 'base layer', value: 1, min: 0, max: 1 },
    dataSet: {
      options: ['resistivity', 'probability'],
      value: 'resistivity',
    },
  })

  const handleReady = (tileset: unknown) => {
    // document.querySelector(".cesium-viewer-toolbar")?.remove();
    if (viewerRef.current) {
      viewerRef.current.zoomTo(tileset)
    }
  }

  return (
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

      {/* <Cesium3DTileset
          url={IonResource.fromAssetId(3062614, {
            accessToken:
            '',
            })}
            /> */}

      {/* <ImageryLayer alpha={1 - alpha} imageryProvider={osmImagerery} /> */}
      <ImageryLayer alpha={baseLayerOpacity} imageryProvider={sentinelImagery} />

      {/* Prevent camera resetting when state changes */}
      {useMemo(
        () => (
          <>
            <Camera />
            <CameraFlyTo duration={0} destination={position} />
          </>
        ),
        [],
      )}
      <Cesium3DTileset
        url={'https://tile.googleapis.com/v1/3dtiles/root.json?key='}
        onReady={handleReady}
        showCreditsOnScreen
        style={tileStyle}
      />
      {/* {voxels.slice(0, 100000).map((voxel, index) => (
        <Entity
          key={index}
          position={Cartesian3.fromDegrees(voxel.x, voxel.y, voxel.z)}
          point={{
            pixelSize: 10,
            color: Color.fromHsl(voxel[dataSet], 1, 0.5, 0.8),
          }}
        />
      ))} */}
    </Viewer>
  )
}
