import React, { useRef, useEffect, useState } from 'react';

const VideoPlayer = ({ user, player }) => {
  const ref = useRef();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);

  useEffect(() => {
    user.videoTrack.play(ref.current);

   
  }, [user.videoTrack]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    user.audioTrack.setMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoHidden(!isVideoHidden);
    if (isVideoHidden) {
      user.videoTrack.play(ref.current);
    } else {
      user.videoTrack.stop();
    }
  };

  return (
    <div>
      {`Player: ${player}`}
      <div
        ref={ref}
        style={{ width: '150px', height: '150px', border: '2px solid black' }}
      ></div>
      <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
      <button onClick={toggleVideo}>
        {isVideoHidden ? 'Show Video' : 'Hide Video'}
      </button>
    </div>
  );
};

export default VideoPlayer;
