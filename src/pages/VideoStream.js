import React, { useEffect, useState } from 'react';
import { View , Text } from 'react-native';
import { RTCView, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import SocketIOClient from 'socket.io-client';

const VideoCallScreen = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [type, setType] = useState("JOIN");


  const socket = SocketIOClient("https://tebo.devlacus.com", {
    transports: ["websocket"],
    query: {
      callerId: Math.floor(100000 + Math.random() * 900000).toString(),
    },
  });

  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun1.l.google.com:19302",
      },
      {
        urls: "stun:stun2.l.google.com:19302",
      },
    ],
  });

  useEffect(() => {
    const startMediaCapture = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, 
              minHeight: 300, 
              minFrameRate: 30,
            },
          },
        });

        setLocalStream(mediaStream);

        mediaStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, mediaStream);
        });

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ICEcandidate", {
              calleeId: null, // Replace with the recipient's ID
              rtcMessage: {
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
              },
            });
          } else {
            console.log("End of candidates.");
          }
        };

        socket.on("callAnswered", (data) => {
          peerConnection.setRemoteDescription(new RTCSessionDescription(data.rtcMessage));
          setType("WEBRTC_ROOM");
        });

        socket.on("ICEcandidate", (data) => {
          const message = data.rtcMessage;

          if (peerConnection) {
            peerConnection
              .addIceCandidate(
                new RTCIceCandidate({
                  candidate: message.candidate,
                  sdpMid: message.id,
                  sdpMLineIndex: message.label,
                })
              )
              .then(() => {
                console.log("ICE candidate added successfully");
              })
              .catch((err) => {
                console.log("Error adding ICE candidate", err);
              });
          }
        });

        socket.on("newCall", (data) => {
          setType("INCOMING_CALL");
        });
      } catch (error) {
        console.error('Error starting media capture:', error);
      }
    };

    startMediaCapture();

    return () => {
      socket.off("newCall");
      socket.off("callAnswered");
      socket.off("ICEcandidate");
    };
  }, [socket]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {type === 'WEBRTC_ROOM' ? (
        <>
          <RTCView
            streamURL={localStream.toURL()}
            style={{ width: 200, height: 200, margin: 10 }}
          />
          <RTCView
            streamURL={remoteStream ? remoteStream.toURL() : null}
            style={{ width: 200, height: 200, margin: 10 }}
          />
        </>
      ) : (

        <Text>Waiting for a call</Text>

      )}
    </View>
  );
};

export default VideoCallScreen;
