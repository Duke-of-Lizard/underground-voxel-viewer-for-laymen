import { useRef } from 'react'

// TilesRenderer, controls and attribution imports
import {
  TilesPlugin,
  TilesRenderer,
  TilesAttributionOverlay,
  GlobeControls,
  EastNorthUpFrame,
  CompassGizmo,
} from '3d-tiles-renderer/r3f'

// Plugins
import {
  CesiumIonAuthPlugin,
  UpdateOnChangePlugin,
  TileCompressionPlugin,
  TilesFadePlugin,
  GLTFExtensionsPlugin,
} from '3d-tiles-renderer/plugins'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// R3F, DREI and LEVA imports
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useControls } from 'leva'
import { MathUtils, Vector3 } from 'three'
import { CameraViewTransition } from './camera'
// import { TilesLoadingBar } from './components/TilesLoadingBar.jsx';

// const tilesetUrl = 'https://s3.eu-west-2.wasabisys.com/filesharekenchitarueu/teststile4/tileset.json'
// const tilesetUrl = 'https://s3.eu-west-2.wasabisys.com/filesharekenchitarueu/outputfinal1-0/tileset.json'
const tilesetUrl = 'https://s3.eu-west-2.wasabisys.com/filesharekenchitarueu/outputfinal1-0-8bit/tileset.json'

const dracoLoader = new DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
const vec1 = new Vector3()
const vec2 = new Vector3()

function Pointer() {
  const ref = useRef()
  useFrame(({ camera }) => {
    const pointer = ref.current
    vec1.setFromMatrixPosition(camera.matrixWorld)

    pointer.position.set(0, 0, 0)
    pointer.updateMatrixWorld()
    vec2.setFromMatrixPosition(pointer.matrixWorld)

    let scale
    if (camera.isPerspectiveCamera) {
      const distance = vec1.distanceTo(vec2)
      scale = Math.max(0.05 * distance * Math.atan(camera.fov * MathUtils.DEG2RAD), 25)
    } else {
      scale = Math.max(((camera.top - camera.bottom) * 0.05) / camera.zoom, 25)
    }

    pointer.scale.setScalar(scale)
    pointer.position.z = scale * 0.5
  })

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} raycast={() => {}}>
      <coneGeometry args={[0.3]} />
      <meshStandardMaterial color={0xec407a} emissive={0xec407a} emissiveIntensity={0.25} />
    </mesh>
  )
}

export function ThreePage() {
  const levaParams = {
    ortho: false,
  }

  // TODO: the renderer is rerendering due to floating point issues
  // - see if we should trigger an invalidate on tiles plugin add and params change
  // - see if we need to trigger a force update on plugin add for the UpdateOnChange plugin

  const { ortho } = useControls(levaParams)
  return (
    <Canvas
      frameloop='demand'
      camera={{
        position: [0, 0.5 * 1e7, 1.5 * 1e7],
      }}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        margin: 0,
        left: 0,
        top: 0,
      }}
      flat
    >
      <color attach='background' args={[0x111111]} />

      <TilesRenderer group={{ rotation: [-Math.PI / 2, 0, 0], opacity: 0.5 }} opacity={0.5}>
        <TilesPlugin
          plugin={CesiumIonAuthPlugin}
          args={{
            apiToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MjQwOTYyNy05MzE3LTQ3YTItYmUyMS0zMzAzYmYxMmVjNTYiLCJpZCI6OTkzMDMsImlhdCI6MTY1NjQwMjE0Nn0._OPJ0wC0au7WDxg4-oImIJkn3hpbPBHvHYjQJqO8vjY',
            assetId: '2275207',
            autoRefreshToken: true,
          }}
        />
        <TilesPlugin plugin={GLTFExtensionsPlugin} dracoLoader={dracoLoader} />
        <TilesPlugin plugin={TileCompressionPlugin} />
        <TilesPlugin plugin={UpdateOnChangePlugin} />
        <TilesPlugin plugin={TilesFadePlugin} fadeDuration={500000} />

        <GlobeControls enableDamping={true} />
        <CameraViewTransition mode={ortho ? 'orthographic' : 'perspective'} />

        <TilesAttributionOverlay />

        <CompassGizmo />
      </TilesRenderer>

      <TilesRenderer group={{ rotation: [-Math.PI / 2, 0, 0] }} url={tilesetUrl}>
        <TilesPlugin plugin={TilesFadePlugin}  />

        <EastNorthUpFrame lat={60.101188 * MathUtils.DEG2RAD} lon={10.253721 * MathUtils.DEG2RAD} height={350}>
          <Pointer />
        </EastNorthUpFrame>
      </TilesRenderer>

      {/* other r3f staging */}
      <Environment preset='sunset' backgroundBlurriness={0.9} environmentIntensity={1} />
    </Canvas>
  )
}
