import './index.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.js'
import { SocketManager } from './Components/SocketManager'
import { Environment } from '@react-three/drei'
import AgoraSetup from './Components/AgoraSetup'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(<>
  <SocketManager/>
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [- 4, 10, 9]
    }}
  >
    {/* <Environment preset='sunset' /> */}
    <Experience />
    <AgoraSetup/>
  </Canvas>
</>
)