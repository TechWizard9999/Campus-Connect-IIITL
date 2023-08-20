import './index.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.js'
import { SocketManager } from './Components/SocketManager'
import { Environment } from '@react-three/drei'
import AgoraSetup from './Components/AgoraSetup'
import Connect from './Components/Connect'
import GlobalChat from './Components/GlobalChat'
import CharacterMenu from './Components/CharacterMenu'
import Transact from './Components/Transact'
import ContractMenu from './Components/ContractMenu'
import Sidebar from './Components/Sidebar'
// import Wallet from './Components/Wallet';

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(<>

  <SocketManager />
  <Connect />
  <GlobalChat />
  <Transact/>
  {/* <CharacterMenu /> */}
  {/* <ContractMenu /> */}
  {/* <Sidebar/> */}
  {/* <Wallet /> */}
  <Canvas shadows shadowMap
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [- 4, 50, 6]
    }}
  >
    <Environment files={"./belvedere_4k.hdr"}  background={true} />
    <Experience />
    {/* <AgoraSetup/> */}

  </Canvas>

</>
)