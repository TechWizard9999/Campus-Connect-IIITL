import React from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
const APP_ID = 'b8e931b8510943c2a3f94e7f379a7bc9';
const TOKEN = '007eJxTYNiRnFI1aVPglwUXQlL1/+3qnqvZY3hwzm6PyCuRH+TtTKcrMCRZpFoaGyZZmBoaWJoYJxslGqdZmqSapxmbWyaaJyVbeirdSmkIZGS44fiRiZEBAkF8VoaMzNzEPAYGAMe9IPI=';
const CHANNEL = 'himan'
const client = AgoraRTC.createClient=({
    mode:'rtc',
    codec:'vp8'
})
const Room = () => {
  return (
    <div>Room</div>
  )
}

export default Room