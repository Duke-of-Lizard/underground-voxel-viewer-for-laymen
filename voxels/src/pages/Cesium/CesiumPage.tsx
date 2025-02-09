import {
  Cartesian3,
  // Cesium3DTileStyle,
  Viewer as CesiumViewer,
  // Color,
  createWorldTerrainAsync,
  IonImageryProvider,
} from 'cesium'
// import { scaleLog, scaleSequential } from 'd3-scale'
// import { interpolateCividis } from 'd3-scale-chromatic'
import { useMemo, useRef, useState } from 'react'
import { Camera, CameraFlyTo, Cesium3DTileset, CesiumComponentRef, ImageryLayer, Scene, Viewer } from 'resium'

const position = Cartesian3.fromDegrees(10.253721, 60.101188, 2500)
const terrainProvider = createWorldTerrainAsync()

// const osmImagerery = new OpenStreetMapImageryProvider({
//   url: 'https://tile.openstreetmap.org/',
// })

/* function getRgbValues(rgbString: string) {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) throw new Error('Invalid RGB string')

  return [
    parseInt(match[1]), // r
    parseInt(match[2]), // g
    parseInt(match[3]), // b
  ] as const
}
 */
const sentinelImagery = IonImageryProvider.fromAssetId(3954)

// const logScale = scaleLog().domain([0, 12]).clamp(true)

// Map the log scale output to a color scale
// const colorScale = scaleSequential().domain([1, 0]).interpolator(interpolateCividis)

/* const tileStyle = new Cesium3DTileStyle({
  color: {
    conditions: [
      // ['true', 'rgb(255, 255, 0)'],
      ['${Classification} < 9', 'rgb(255, 0, 255)'],
      ['${Classification} < 10', 'rgb(255, 255, 0)'],
      ['${Classification} < 11', 'rgb(0, 255, 255)'],
      ['${Classification} < 12', 'rgb(255, 124, 0)'],
    ],
    // evaluateColor: function (feature: any) {
    //   console.log('evaluateColor', feature)
    //   const resistivity = feature.getProperty('resistivity')

    //   const normalizedValue = logScale(resistivity)
    //   const color = colorScale(normalizedValue)

    //   const [r, g, b] = getRgbValues(color)

    //   return new Color(r / 255, g / 255, b / 255, 1.0)
    // },
  },
}) */

/* function getColor(resistivity: number) {
  const normalizedValue = logScale(resistivity)
  const color = colorScale(normalizedValue)
  return color
}
 */
export function CesiumPage() {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null)
  const [alpha, setAlpha] = useState(1)

  return (
    <>
      <div
        style={{
          zIndex: 50,
          background: 'white',
          display: 'block',
          padding: 4,
          position: 'absolute',
        }}
      >
        <input
          type='range'
          onChange={(e) => {
            if (!viewerRef.current) return
            const value = e.target.valueAsNumber
            setAlpha(value)
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
        baseLayer={false}
        navigationHelpButton={false}
        infoBox={true}
        terrainProvider={terrainProvider}
      >
        <Scene verticalExaggeration={2} />

        <Cesium3DTileset
          url={`https://s3.eu-west-2.wasabisys.com/filesharekenchitarueu/outputfinal1-1-8bit/tileset.json`}
          // style={tileStyle}
          onError={(error) => {
            console.error(error)
          }}
          // debugShowBoundingVolume={true}
          // debugShowUrl={true}
          // debugWireframe={true}
          onReady={(tileSet) => {
            tileSet.tileFailed.addEventListener((error) => {
              console.log('Tile failed to load:', error)
            })

            tileSet.tileLoad.addEventListener((tile) => {
              console.log('tile loaded')
              const content = tile.content
              console.log(content)
              console.log('batchTable', content.featuresLength)

              //   for (let i = 0; i < content.featuresLength; ++i) {
              //     const feature = content.getFeature(i)
              //     console.log(feature)
              //     const resistivity = feature.getProperty('resistivity')
              //     console.log(resistivity)
              //     const normalizedValue = logScale(resistivity)
              //     const color = colorScale(normalizedValue)
              //     console.log({ color })
              //   }
              // })
            })
          }}
        />

        <ImageryLayer alpha={alpha} imageryProvider={sentinelImagery} />

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
        {/*     <Cesium3DTileset
          url={'https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyALHLXCzgUATF2uwriTKI0Z9YDoLeMq7Xk'}
          onReady={(tileSet) => {
            tileSet.tileLoad.addEventListener((tile) => {
              console.log('tile loaded')
              const content = tile.content
              console.log(content)
              console.log(content.featuresLength)

              for (let i = 0; i < content.featuresLength; ++i) {
                const feature = content.getFeature(i)
                console.log(feature)
              }
            })

            console.log(tileSet)
          }}
          showCreditsOnScreen
        /> */}
      </Viewer>
    </>
  )
}
