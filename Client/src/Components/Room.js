import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = 'b8e931b8510943c2a3f94e7f379a7bc9';
const TOKEN = '007eJxTYPjxacvff6xsd+VYyk49fKAg4uT/3cB1l1Cjk15Iqq3CXy4FhiSLVEtjwyQLU0MDSxPjZKNE4zRLk1TzNGNzy0TzpGRLjrB7KQ2BjAy29oLMjAwQCOKzMmRk5ibmMTAAABpNHX0=';
const CHANNEL = 'himan';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const Room = () => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    let myId=null;
const [left,setLeft] = useState(false);
    const handleUserPublished = async (user, mediaType) => {
        myId=user.id;
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
            setUsers((prevUsers) => [...prevUsers, user]);
        }
        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    };

    const handleUserLeft = (user) => {
        setUsers((prevUsers) =>
            prevUsers.filter((u) => u.uid !== user.uid)
        );
    };

    const Leave = async () => {
        setLeft(!left);

        try {
            // Stop and close local tracks
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            // Unsubscribe from remote user tracks
            for (let user of users) {
                if (user.videoTrack) {
                    user.videoTrack.stop();
                }
                if (user.audioTrack) {
                    user.audioTrack.stop();
                }
                await client.unsubscribe(user);
            }

            // Leave the channel
            await client.leave();
            console.log('You left the channel');
        } catch (error) {
            console.error('Error leaving channel:', error);
        }
    };

    useEffect(() => {
        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserLeft);

        client
            .join(APP_ID, CHANNEL, TOKEN, null)
            .then((uid) => Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid]))
            .then(([tracks, uid]) => {
                const [audioTrack, videoTrack] = tracks;
                setLocalTracks(tracks);
                setUsers((previousUsers) => [
                    ...previousUsers,
                    {
                        uid,
                        videoTrack,
                        audioTrack,
                    },
                ]);
                client.publish(tracks);
            });

        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handleUserPublished);
            client.off('user-unpublished', handleUserLeft);
        };
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
                <button onClick={Leave}>Leave</button>
                {users.map((user, i) => {
                if( user.uid ===myId){ 
if(left){
    return null;
}else{
    return <VideoPlayer key={user.uid} player={i} user={user} />
}
                }else{
                    return ( <VideoPlayer key={user.uid} player={i} user={user} /> )
                 }
                   
})}
            </div>
        </div>
    );
};

export default Room;
