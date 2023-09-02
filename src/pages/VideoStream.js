import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices } from 'react-native-webrtc';
import { SocketContext } from '../context/SocketContext';
import { io } from 'socket.io-client';
const socket = io('http://144.217.91.122:5000')

const VideoCallScreen = () => {
  const { call, userStream, remoteStream, myVideo, setStream } = useContext(SocketContext);
  const [peer, setPeer] = useState(null)
  useEffect(() => {
    mediaDevices.getUserMedia({
      video: {
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        frameRate: { ideal: 60 },
        facingMode: "user",
      },
      audio: true,
    }).then(async (currentStream) => {

      setStream(currentStream);
      const newPeer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      setPeer(newPeer)
      newPeer.addTrack(currentStream.getTracks()[0], currentStream)
      console.log(newPeer, 'peer');
      newPeer.onicecandidate = event => {
        console.log(event, 'event');
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, to: call.from });
        }
      };

      newPeer.ontrack = event => {
        console.log(event, "eveveve");
        userVideo.current.srcObject = event.streams[0]; // Set srcObject for the video element
      };



      // connectionRef.current = newPeer;

    }).catch((err) => {
      console.log(err);
    });
  }, [])

  useEffect(() => {
    if (!peer) return
    socket.on("callAccepted", async (call) => {
      const desc = new RTCSessionDescription(call?.signal);
      await peer.setRemoteDescription(desc);

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit('answerCall', { answer, to: call.from });
    })
    return () => {
      socket.off('callAccepted')
    }
  }, [peer])
  console.log(remoteStream, "remoteStream");
  return (
    <View style={styles.container}>
      {userStream && (
        <RTCView streamURL={userStream.toURL()} style={{ width: 500, height: 150 }} />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.video} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: "100%",
  },
});

export default VideoCallScreen;
