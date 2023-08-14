import React from 'react'
import AgoraRTC from "./AgoraRTC_N-4.18.2"
const AgoraSetup = () => {
    // create Agora client
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const localTracks = {
        audioTrack: null
    };
    const remoteUsers = {};
    // Agora client options
    const options = {
        appid: 'b8e931b8510943c2a3f94e7f379a7bc9',
        channel: 'channel',
        uid: null,
        token: null
    };
    async function subscribe(user, mediaType) {
        // subscribe to a remote user
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    }

    function handleUserPublished(user, mediaType) {
        const id = user.uid;
        remoteUsers[id] = user;
        subscribe(user, mediaType);
    }

    function handleUserUnpublished(user) {
        const id = user.uid;
        delete remoteUsers[id];
    }
 

    async function join() {

        // add event listener to play remote tracks when remote user publishs.
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        // join a channel and create local tracks, we can use Promise.all to run them concurrently
        [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
            // join the channel
            client.join(options.appid, options.channel, options.token || null),
            // create local tracks, using microphone and camera
            AgoraRTC.createMicrophoneAudioTrack(),
          
        ]);

   

        // publish local tracks to channel
        await client.publish(Object.values(localTracks));
        console.log("publish success");
    }
    join();
    return (
    <>
    </>
  )
}

export default AgoraSetup