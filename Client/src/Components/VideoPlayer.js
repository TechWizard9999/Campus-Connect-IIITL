import React,{useRef,useEffect,useState} from 'react'

const VideoPlayer = ({user}) => {

    const ref = useRef();
useEffect(()=>{
        user.videoTrack.play(ref.current)

},[])
    return (
   <div>
      Uid: {user.uid}
      <div
        ref={ref}
        style={{ width: '200px', height: '200px' }}
      ></div>
    </div>
  )
}

export default VideoPlayer