import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from "react";
import { RTCView, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, getUserMedia  } from "react-native-webrtc";
import SocketIOClient from "socket.io-client";

const VideoCallScreen = () => {

  const [localStreamURL, setLocalStreamURL] = useState(null);
  const [remoteStreamURL, setRemoteStreamURL] = useState(null );
  const [localStream, setlocalStream] = useState(null);
  const [localMicOn, setLocalMicOn] = useState(true);
  const [localWebcamOn, setLocalWebcamOn] = useState(true);
  const [peerConnections, setPeerConnection] = useState(null);
  
  
  const localRef = useRef();
  const remoteRef = useRef();
  const [remoteStream, setRemoteStream] = useState(null);

  const [type, setType] = useState("JOIN");

  const [callerId] = useState(
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const otherUserId = useRef(null);



  const socket = SocketIOClient("https://tebo.devlacus.com", {
    transports: ["websocket"],
    query: {
      callerId,
    },
  });



  const peerConnection = useRef(
    new RTCPeerConnection({
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
    })
  );


  let remoteRTCMessage = useRef(null);

  useEffect(() => {
    if (localStream && localRef.current) {
      localRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteRef.current) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    socket.on("newCall", (data) => {
      console.log(data, "newCall");
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      setType("INCOMING_CALL");
    });

    socket.on("callAnswered", (data) => {
      console.log("callAnswered", data);
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current)
      );
      setType("WEBRTC_ROOM");
    });

    socket.on("ICEcandidate", (data) => {
      let message = data.rtcMessage;

      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            })
          )
          .then((data) => {
            console.log("SUCCESS");
          })
          .catch((err) => {
            console.log("Error", err);
          });
      }
    });


    let isFront = false;


    const startMediaCapture = async () => {
      try {
        const mediaStream = await RTCMediaStream.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Set your desired video width
              minHeight: 300, // Set your desired video height
              minFrameRate: 30, // Set your desired frame rate
            },
          },
        });

        setLocalStream(mediaStream);
        // Create a new RTCPeerConnection instance
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        setPeerConnection(pc);

        // Add tracks to the peer connection
        mediaStream.getTracks().forEach((track) => {
          pc.addTrack(track, mediaStream);
        });

        // Setup ice handling
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // Send ICE candidate to the remote peer
            sendICEcandidate({
              calleeId: otherUserId,
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

        // Listen for incoming streams
        pc.onaddstream = (event) => {
          console.log("onaddstream", event.stream);
          setRemoteStream(event.stream);
        };

        // Handle remote RTCSessionDescription (offer/answer)
        socket.on("callAnswered", (data) => {
          console.log("callAnswered", data);
          setRemoteRTCMessage(data.rtcMessage);
          setType("WEBRTC_ROOM");

          // Set the remote description
          pc.setRemoteDescription(new RTCSessionDescription(data.rtcMessage));
        });

        // Handle incoming ICE candidates
        socket.on("ICEcandidate", (data) => {
          let message = data.rtcMessage;

          if (pc) {
            pc.addIceCandidate(
              new RTCIceCandidate({
                candidate: message.candidate,
                sdpMid: message.id,
                sdpMLineIndex: message.label,
              })
            )
              .then((data) => {
                console.log("SUCCESS");
              })
              .catch((err) => {
                console.log("Error", err);
              });
          }
        });

        // Handle incoming calls
        socket.on("newCall", (data) => {
          console.log(data, "newCall");
          setRemoteRTCMessage(data.rtcMessage);
          setOtherUserId(data.callerId);
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
  }, [socket, otherUserId]);





  

  function sendICEcandidate(data) {
    socket.emit("ICEcandidate", data);
  }

  async function processCall() {
    const sessionDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    sendCall({
      calleeId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  async function processAccept() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current)
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  function answerCall(data) {
    socket.emit("answerCall", data);
  }

  function sendCall(data) {
    socket.emit("call", data);
  }


  // const { call, userStream, remoteStream, myVideo, setStream } = useContext(SocketContext);
  // const [peer, setPeer] = useState(null)
  // useEffect(() => {
  //   mediaDevices.getUserMedia({
  //     video: {
  //       width: { ideal: 3840 },
  //       height: { ideal: 2160 },
  //       frameRate: { ideal: 60 },
  //       facingMode: "user",
  //     },
  //     audio: true,
  //   }).then(async (currentStream) => {

  //     setStream(currentStream);
  //     const newPeer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  //     setPeer(newPeer)
  //     newPeer.addTrack(currentStream.getTracks()[0], currentStream)
  //     console.log(newPeer, 'peer');
  //     newPeer.onicecandidate = event => {
  //       console.log(event, 'event');
  //       if (event.candidate) {
  //         socket.emit('ice-candidate', { candidate: event.candidate, to: call.from });
  //       }
  //     };

  //     newPeer.ontrack = event => {
  //       console.log(event, "eveveve");
  //       userVideo.current.srcObject = event.streams[0]; // Set srcObject for the video element
  //     };



  //     // connectionRef.current = newPeer;

  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }, [])

  // useEffect(() => {
  //   if (!peer) return
  //   socket.on("callAccepted", async (call) => {
  //     const desc = new RTCSessionDescription(call?.signal);
  //     await peer.setRemoteDescription(desc);

  //     const answer = await peer.createAnswer();
  //     await peer.setLocalDescription(answer);

  //     socket.emit('answerCall', { answer, to: call.from });
  //   })
  //   return () => {
  //     socket.off('callAccepted')
  //   }
  // }, [peer])
  // console.log(remoteStream, "remoteStream");

  useEffect(() => {
    const startLocalStream = async () => {
      const isFront = true; // Set this to choose the camera
      const stream = await getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height, and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: isFront ? "user" : "environment",
        },
      });
  
      // Convert the MediaStream to a URL for RTCView
      setLocalStreamURL(stream.toURL());
  
      // Set up the peer connection and add tracks
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
  
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
  
      // ... Rest of your code for peer connection setup
    };
  
    startLocalStream();
  }, []);
  




  return (
    <View style={styles.container}>
   
   {type === "WEBRTC_ROOM" && (
      <>
        <RTCView
          streamURL={localStreamURL}
          style={{ height: 300, width: 300 }}
          mirror={true} // Set to true if you want to mirror the local video
        />
        <RTCView
          streamURL={remoteStreamURL}
          style={{ height: 300, width: 300 }}
        />
        {/* Rest of your UI */}
      </>
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



