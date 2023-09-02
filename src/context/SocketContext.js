import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import { useRecoilState } from "recoil";
import { CONFIRMPOPUP } from "../Recoil/recoilState";

const SocketContext = createContext();



// const socket = io("http://localhost:5000");




const SocketProvider = ({ children }) => {

  const [userStream, setStream] = useState(null);
  const [call, setCall] = useState(null);
  const [PageTrigger, setPageTrigger] = useState(true);
  const [callAccepted, setCallAccepted] = useState(false);
  const [me, setMe] = useState("");
  const [name, setName] = useState("");
  const [peer, setPeer] = useState();

  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  const myId = useRef(null);



  const socket = useRef(io('https://tebo.devlacus.com'));
  // const socket = useRef(io('http://144.217.91.122:5000'));




  useEffect(() => {
    
    socket.current.on("callUser", ({ from, name: callerName, signal }) => {
      console.log("name++++++ ", { from, name: callerName, signal });

      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    socket.current.on("me", (id) => {
      setMe(id);
    });

    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const newPeer = new RTCPeerConnection(configuration);
    setPeer(newPeer);

  }, []);




  const answerCall = async () => {
    setCallAccepted(true);

    

    userStream.getTracks().forEach(track => peer.addTrack(track, userStream));

    peer.onicecandidate = event => {
      console.log("onicecandidate", event);
      if (event.candidate) {
        socket.current.emit('ice-candidate', { candidate: event.candidate, to: call.from });
      }
    };

    peer.ontrack = event => {
      userVideo.current = event.streams[0];
    };

    const desc = new RTCSessionDescription(call.signal);
    await peer.setRemoteDescription(desc);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.current.emit('answerCall', { answer, to: call.from });

    connectionRef.current = peer;
  };







  const callUser = async (id) => {
    try {
      socket.current.emit("getSocketId", id);

      const userSocketId = await new Promise(resolve => {
        socket.current.on("getSocketId", (socketId) => {
          resolve(socketId);
        });
      });

      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      const peer = new RTCPeerConnection(configuration);

      userStream.getTracks().forEach(track => peer.addTrack(track, userStream));

      peer.onicecandidate = event => {
        if (event.candidate) {
          socket.current.emit('ice-candidate', { candidate: event.candidate });
        }
      };

      peer.ontrack = event => {
        userVideo.current = event.streams[0];
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(new RTCSessionDescription(offer));

      socket.current.emit("callUser", {
        userToCall: userSocketId,
        signalData: peer.localDescription,
        from: me,
        name,
      });

      socket.current.on("callAccepted", signal => {
        setCallAccepted(true);
        peer.setRemoteDescription(new RTCSessionDescription(signal));
      });

      connectionRef.current = peer;
    } catch (error) {
      console.error(error.message);
    }
  };

  const addUserId = (userId) => {
    socket.current.emit("sentUserId", userId);
  };

  const disconnectUser = (userId) => {
    socket.current.emit("disconnect-user", userId);
  };

  const leaveCall = () => {
    setCallEnded(true);

    userStream.getTracks().forEach(track => track.stop());

    if (connectionRef.current) {
      connectionRef.current.close();
    }
  };




  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        remoteStream: userVideo.current,
        userStream,
        name,
        setStream,
        setName,
        me,
        callUser,
        leaveCall,
        answerCall,
        PageTrigger,
        setPageTrigger,
        myId,
        addUserId,
        disconnectUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };