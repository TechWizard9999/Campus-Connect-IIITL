import React, { useEffect,useState } from 'react'
import VideoPlayer from './VideoPlayer';
import AgoraRTC from 'agora-rtc-sdk-ng'
const APP_ID = 'b8e931b8510943c2a3f94e7f379a7bc9';
const TOKEN = '007eJxTYDhjWT7nucUmD5393cKp0zSNL6/Psy+ZyePp23Z0Z+6rST8VGJIsUi2NDZMsTA0NLE2Mk40SjdMsTVLN04zNLRPNk5ItAzbfTmkIZGS4OS+PlZEBAkF8VoaMzNzEPAYGAH1pIJ8='
const CHANNEL = 'himan'
var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const Room = () => {
    const [users,setusers]= useState([]);
    const [localTracks,setlocalTracks]= useState([]);
     const handleUserPublished = async (user,mediaType)=>{
        await client.subscribe(user,mediaType);
        if(mediaType === "video"){
setusers((prevusers)=>[...prevusers, user])
        }
        if(mediaType === "audio"){
  user.audioTrack.play()
        }
     };
    const handleUserLeft = (user) => {
        setusers((prevUsers) =>
            prevUsers.filter((u) => u.uid !== user.uid)
        );
    };
    useEffect(()=>{
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserLeft);
        client.join(APP_ID, CHANNEL, TOKEN, null).then((uid) =>
            Promise.all([
                AgoraRTC.createMicrophoneAndCameraTracks(),
                uid,
            ])
        ).then(([tracks,uid])=>{
            const [audioTrack,videoTrack]= tracks;
            setlocalTracks(tracks);
            setusers((previousUsers)=>[...previousUsers,{
                uid,
                videoTrack,
                audioTrack
            }])
             console.log(users);
            client.publish(tracks);
        })  
//  return ()=>{

//     for(let localtrack of localTracks){
//         localtrack.stop();
//         localtrack.close();
//     }

//      client.on("user-published", handleUserPublished);
//      client.on("user-unpublished", handleUserLeft);
//     client.unpublish(tracks).then(()=>client.leave())};
        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            client.off("user-published", handleUserPublished);
     client.off("user-unpublished", handleUserLeft);
            // client.unpublish(tracks).then(() => client.leave());
        };
    },[])
    useEffect(() => {
        console.log(users);
    }, [users])
  return (
      <div style={{ display: 'flex', justifyContent: 'center' }}  >

      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
      }} >Room hihi
        {users.map((user)=>{  return  <VideoPlayer key={user.uid} user= {user} / > })}
    </div>
      </div>
  )
}

export default Room