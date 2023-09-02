import SocketIOClient from 'socket.io-client'; // import socket io
// import WebRTC 
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';

export default function App({}) {

// Stream of local user
const [localStream, setlocalStream] = useState(null);

/* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
const [remoteStream, setRemoteStream] = useState(null);

// This establishes your WebSocket connection
const socket = SocketIOClient('https://tebo.devlacus.com', {
    transports: ['websocket'],
    query: {
        callerId, 
    /* We have generated this `callerId` in `JoinScreen` implementation */
    },
  });

 /* This creates an WebRTC Peer Connection, which will be used to set local/remote descriptions and offers. */
 const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

    useEffect(() => {
    socket.on('newCall', data => {
     /* This event occurs whenever any peer wishes to establish a call with you. */
    });

    socket.on('callAnswered', data => {
      /* This event occurs whenever remote peer accept the call. */
    });

    socket.on('ICEcandidate', data => {
      /* This event is for exchangin Candidates. */

    });

    let isFront = false;

/*The MediaDevices interface allows you to access connected media inputs such as cameras and microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }


      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          // Get local stream!
          setlocalStream(stream);

          // setup stream listening
          peerConnection.current.addStream(stream);
        })
        .catch(error => {
          // Log error
        });
    });

    peerConnection.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    peerConnection.current.onicecandidate = event => {

    };

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

}