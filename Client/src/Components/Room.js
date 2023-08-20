import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = 'b8e931b8510943c2a3f94e7f379a7bc9';
const TOKEN = '007eJxTYJi+9J2+yY49NlNbHY6nXvY23CrQNm9bTH+IOYvwrdJdv5QVGJIsUi2NDZMsTA0NLE2Mk40SjdMsTVLN04zNLRPNk5ItN3x8mNIQyMigYbCfmZEBAkF8VoaMzNzEPAYGAG5xIAI=';
const CHANNEL = 'himan';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const Room = () => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [myId, setmyId] = useState(null);
    const [left, setLeft] = useState(false);

    const handleUserPublished = async (user, mediaType) => {
        console.log("published");
        setmyId(user.uid);
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
        setLeft(true); // Indicate that the user has left
        try {
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
                if (user.uid !== myId) {
                    // Unsubscribe only if the user is not the current user
                    await client.unsubscribe(user);
                }
            }

            // Leave the channel
            await client.leave();
            console.log('You left the channel');

            // Call handleUserLeft for the current user when leaving the channel
            handleUserLeft({ uid: myId });

            // Clear the localTracks and users states
            setLocalTracks([]);
            setUsers([]);
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
                setmyId(uid);
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
                    if (user.uid === myId) {
                        console.log("uid matched and left is");
                        console.log(left);
                        if (left) {
                            return null;
                        } else {
                            return <VideoPlayer key={user.uid} player={i} user={user} />
                        }
                    } else {
                        console.log("uid didn't match and left is");
                        console.log(user.uid);
                        console.log(myId);
                        console.log(left);
                        return (<VideoPlayer key={user.uid} player={i} user={user} />)
                    }
                })}
            </div>
        </div>
    );
};

export default Room;
