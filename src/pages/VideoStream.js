import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';
import CallEnd from '../StreamComponent/CallEnd';
import CallAnswere from '../StreamComponent/CallAnswer';
import CameraSwitch from '../StreamComponent/CamaraSwitch';
import Leave from '../StreamComponent/Leave';
import MicOff from '../StreamComponent/MicOff';
import MicOn from '../StreamComponent/MicOn';
import VideoOff from '../StreamComponent/VideoOff';
import VideoOn from '../StreamComponent/VideoOn';
import {useRecoilState, useRecoilStateLoadable, useRecoilValue} from 'recoil';
import {useSocket} from '../context/SocketContext';
import {MqttMessage, UIDSTORING} from '../Recoil/recoilState';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IconContainer from '../StreamComponent/IconContainer';
import useMQTT from '../hooks/useMqtt';
import useStyle from '../hooks/useStyle';
import {Modal, Portal, Button, PaperProvider} from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import apiInstance from '../api/apiInstance';
import useGeolocation from '../hooks/useLocation';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import mqtt from 'sp-react-native-mqtt';
import useMqttClient from '../hooks/useMqtt';

export default function VideoCallScreen({}) {
  const {client, data} = useMqttClient();
  const navigation = useNavigation();
  const [localStream, setlocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [type, setType] = useState('JOIN');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('Hello World');
  const [Data, setData] = useState([]);
  const [Dataname, setDataname] = useState([]);
  const [allData, setAllData] = useState();
  const [Scroll, setScroll] = useState(false);
  const [callData, setCallData] = useState('');
  const [mqMe, setMqme] = useState(null);
  const uid = useRecoilValue(UIDSTORING);
  const mqttData = useRecoilValue(MqttMessage);
  const [confName, setConfName] = useState('');
  const [random, setRandom] = useState('');
  const [checking , setChecking] = useState(null)
  const [connectionVisible , setConnectionVisible] = useState(false)

  const {
    data: {
      robot: {status, uuid},
    },
  } = uid;

  const {location, placeName, getCurrentLocation} = useGeolocation();

  useEffect(() => {
    console.log('+++++++++++++++++MQTT', mqttData);

    if (data !== null) {
      console.log('Mqtt data' + JSON.stringify(data));
      console.log('Mqtt data', data);
      peerConnection.current.close();
      setlocalStream(null);
      setType('JOIN');
      if(data == 'call ended'){
        navigation.replace('Checking');
      }
    
    }
  }, []);

  const host = 'sonic.domainenroll.com';
  const port = '1883';
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const topic = `Devlacus/Tebo/${uuid}/instructions`;
  const userData = `Devlacus/Tebo/${uuid}/instructions`;

  useEffect(() => {
    console.log('This is mqttdata))))))))))))))))))))))))))))', mqttData);

    if (mqttData !== null) {
      const {data, qos, retain, topic} = mqttData;

      setMqme(data);
    }
  }, [mqttData]);

  useEffect(() => {
    if (mqMe === 'call end') {
      peerConnection.current.close();
      setlocalStream(null);
      setType('JOIN');
      navigation.replace('Checking');
    }
    setMqme(null);
  }, [mqMe]);

  const connectUrl = `mqtt://${host}:${port}`;

  useEffect(() => {
    mqtt
      .createClient({
        uri: connectUrl,
        clean: true,
        auth: true,
        user: 'domainenroll',
        pass: 'de120467',
        clientId: clientId,
      })
      .then(function (client) {
        client.on('closed', function () {
          console.log('mqtt.event.closed');
        });

        client.on('error', function (msg) {
          console.log('mqtt.event.error', msg);
        });

        client.on('message', function (msg) {
          console.log('mqtt.event.message', msg);

          setVisible(true);
          setData(msg);
        });

        client.on('connect', function () {
          console.log('connected');
          client.subscribe(topic, 0);
          client.subscribe(userData, 0);
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log('Mqtt message', Data);
    const {data, qos, retain, topic} = Data;

    console.log('}}}}}}}}}}}}}', data);

    if (data) {
      setAllData(JSON.parse(data));
      setDataname(data);
    }

    //    const { subject, robot_uuid, name, email, owner_random_id } = data;

    // console.log(subject);
    // console.log(robot_uuid);
    // console.log(name);
    // console.log(email);
    // console.log(owner_random_id);

    // Now you can use these variables
    console.log('data:', data);

    console.log('qos:', qos);
    console.log('retain:', retain);
    console.log('topic:', topic);
  }, [Data]);

  useEffect(() => {
    if (allData) {
      console.log('____________+++++', allData);
      console.log('+++))))))))))))))))))))))))', typeof allData);
      const {subject, robot_uuid, name, email, owner_random_id} = allData;

      console.log('subject:', subject);
      console.log('robot_uuid:', robot_uuid);
      console.log('name:', name);
      setConfName(name);
      console.log('email:', email);
      console.log('owner_random_id:', owner_random_id);
      setRandom(owner_random_id);
    }
  }, [allData]);




  useEffect(() => {
    if (checking !== null) {
      try {
        const requestData = {
          robot_uuid: uuid,
          owner_random_id: random,
          accept_reject: checking,
        };
  
        console.log("U: "+  uuid +  "I" +   random +   "  A" +   checking);
  
        apiInstance
          .post('http://tebo.domainenroll.com/api/v1/accept-reject', requestData)
          .then((response) => {
            // Handle the successful response here
            console.log('POST response:', response.data);
            setVisible(false);
            setTimeout(()=>{

              setConnectionVisible(true)

            },2500)

            setConnectionVisible(false)

          })
          .catch((error) => {
            console.error('POST error:', error);
          });
      } catch (error) {
        console.error('Try-catch error:', error);
      }
    } else {
      console.log('Checking API failed');
    }
  }, [checking]);




  useEffect(() => {
    console.log('Mqtt subject', Dataname);
  }, []);

  const {BottomPage} = useStyle();

  const sty = BottomPage;

  // const CheckingConditionfalse = async () => {
  //   try {
  //     const requestData = {
  //       robot_uuid: `${uuid}`,
  //       owner_random_id: random,
  //       accept_reject: false,
  //     };
  //     const response = await apiInstance.post(
  //       'http://tebo.domainenroll.com/api/v1/accept-reject',
  //       requestData,
  //     );
  //     // Handle the response here
  //     console.log('POST response:', response.data);
  //     setVisible(false);
  //   } catch (error) {
  //     console.error('POST error:', error);
  //   }
  // };

  // const CheckingCondition = async () => {
  //   try {
  //     const requestData = {
  //       robot_uuid: `${uuid}`,
  //       owner_random_id: random,
  //       accept_reject: true,
  //     };

  //     const response = await apiInstance.post(
  //       '/api/v1/accept-reject',
  //       requestData,
  //     );

  //     // Handle the response here
  //     console.log('POST response:', response.data);
  //     setVisible(true);
  //   } catch (error) {
  //     console.error('POST error:', error);
  //   }
  // };

  useEffect(() => {
    console.log('ROBOTUUID', uuid);
    console.log('Loacation data', placeName, location);
    const fetchRobotUUID = async () => {
      if (location && placeName && uuid) {
        const postData = {
          robot_uuid: uuid,
          latitude: location.latitude,
          longitude: location.longitude,
          location: placeName,
          map_accuracy: location.accuracy,
        };
        console.log(postData, 'postData');
        setLoading(true);

        try {
          const response = await apiInstance.post(
            '/api/v1/robot-location',
            postData,
          );
          console.log('Success:', response.data);
          setTimeout(() => {
            console.log('Sent Location');
          }, 2500);
        } catch (error) {
          console.error('Network error:', error);
          if (error.isAxiosError && !error.response) {
            console.error('Network connection issue');
          } else if (error.response) {
            console.error('Response data:', error.response.data);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    // setTimeout(()=>{

    fetchRobotUUID();

    // },1500)
  }, [uuid, location, placeName]);

  console.log(uuid);
  const otherUserId = useRef(null);

  const {socket} = useSocket();

  const [localMicOn, setlocalMicOn] = useState(true);

  const [localWebcamOn, setlocalWebcamOn] = useState(true);

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

  let remoteRTCMessage = useRef(null);

  useEffect(() => {
    socket.on('newCall', data => {
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      // setType('INCOMING_CALL');
      processAccept();
      setType('WEBRTC_ROOM');
    });

    socket.on('callAnswered', data => {
      console.log('callAnswered', data);
      remoteRTCMessage.current = data.rtcMessage;
      console.log(remoteRTCMessage.current, 'remoteRTCMessage.current');
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      setType('WEBRTC_ROOM');
    });

    socket.on('ICEcandidate', data => {
      let message = data.rtcMessage;

      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(data => {
            console.log('SUCCESS');
          })
          .catch(err => {
            console.log('Error', err);
          });
      }
    });

    let isFront = false;

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
            facingMode: 'user',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          // Got stream!

          setlocalStream(stream);

          // setup stream listening
          stream.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, stream);
          });
        })
        .catch(error => {
          // Log error
          console.log('Error: ' + error);
        });
    });

    peerConnection.current.onaddstream = event => {
      console.log(event.stream, 'event.stream');
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    // peerConnection.current.onicecandidate = event => {
    //   console.log(event.candidate,"event.candidate");
    //   if (event.candidate) {
    //     sendICEcandidate({
    //       calleeId: otherUserId.current,
    //       rtcMessage: {
    //         label: event.candidate.sdpMLineIndex,
    //         id: event.candidate.sdpMid,
    //         candidate: event.candidate.candidate,
    //       },
    //     });
    //   } else {
    //     console.log('End of candidates.');
    //   }
    // };
    peerConnection.current.addEventListener('icecandidate', event => {
      console.log(event, 'icecandidate');
      if (event.candidate) {
        sendICEcandidate({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log('End of candidates.');
      }
    });
    peerConnection.current.ontrack = e => {
      setRemoteStream(e.streams[0]);
    };

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
      peerConnection.current.removeEventListener('icecandidate');
    };
  }, [socket]);

  // useEffect(() => {
  //   InCallManager.start();
  //   InCallManager.setKeepScreenOn(true);
  //   InCallManager.setForceSpeakerphoneOn(true);

  //   return () => {
  //     InCallManager.stop();
  //   };
  // }, []);

  function sendICEcandidate(data) {
    socket?.emit('ICEcandidate', data);
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
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  function answerCall(data) {
    socket?.emit('answerCall', data);
  }

  function sendCall(data) {
    socket?.emit('call', data);
  }

  const JoinScreen = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          justifyContent: 'center',
          paddingHorizontal: 42,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View
              style={{
                padding: 35,
                backgroundColor: '#1A1C22',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Your Caller ID
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    color: '#ffff',
                    letterSpacing: 6,
                  }}>
                  {uid?.data?.robot?.uuid}
                </Text>
              </View>
              <Modal visible={visible} transparent>
                <View style={sty.UIDModal}>
                  <View style={sty.centerBoxText}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: '300',
                          fontStyle: 'italic',
                          marginTop: 30,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}>
                        {confName}
                      </Text>

                      <Text
                        style={{
                          color: '#000',
                          fontWeight: '300',
                          fontStyle: 'italic',
                          marginTop: 30,
                          fontSize: 14,
                          left: 4,
                        }}>
                        wants to connect to Robot Black Heart!
                      </Text>
                    </View>
                  </View>

                  <View style={sty.ModalButtonView}>
                    <Ripple
                      onPress={() => setChecking(true)}
                      style={sty.ModalButton}>
                      <Text>ACCEPT</Text>
                    </Ripple>

                    <Ripple
                      onPress={() => setChecking(false)}
                      style={sty.ModalButtonRed}>
                      <Text>REJECT</Text>
                    </Ripple>
                  </View>
                </View>
              </Modal>


                        <Modal visible={connectionVisible} transparent>
                <View style={sty.UIDModal}>
                  <View style={sty.centerBoxText}>
                    <View style={{flexDirection: 'row' , alignItems:'center' , justifyContent:'center'}}>

                      <Text
                        style={{
                          color: '#000',
                          fontWeight: '300',
                          fontStyle: 'italic',
                          marginTop: 66,
                          fontSize: 20,
                          left: 4,
                        }}>
                       Connection successfull!
                      </Text>
                    </View>
                  </View>

                  
                </View>
              </Modal>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  const OutgoingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#D0D4DD',
            }}>
            Calling to...
          </Text>

          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
              letterSpacing: 6,
            }}>
            {otherUserId.current}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setType('JOIN');
              otherUserId.current = null;
            }}
            style={{
              backgroundColor: '#FF5D5D',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallEnd width={50} height={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const IncomingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
            }}>
            {otherUserId.current} is calling..
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              processAccept();
              setType('WEBRTC_ROOM');
            }}
            style={{
              backgroundColor: 'green',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallAnswere height={28} fill={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  function switchCamera() {
    localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  }

  function toggleCamera() {
    localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.getVideoTracks().forEach(track => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave() {
    peerConnection.current.close();
    setlocalStream(null);
    setType('JOIN');
    navigation.replace('Checking');
  }

  const WebrtcRoomScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}>
        {/* {localStream ? (
          <RTCView
            objectFit={'cover'}
            style={{flex: 1, backgroundColor: '#050A0E'}}
            streamURL={localStream.toURL()}
          />
        ) : null} */}
        {remoteStream ? (
          <RTCView
            objectFit={'cover'}
            style={{
              flex: 1,
              backgroundColor: '#050A0E',
              marginTop: 8,
            }}
            streamURL={remoteStream.toURL()}
          />
        ) : null}

        {/* <View
          style={{
            marginVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <IconContainer
            backgroundColor={'red'}
            onPress={() => {
              leave();
            }}
            Icon={() => {
              return <CallEnd height={26} width={26} fill="#FFF" />;
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localMicOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleMic();
            }}
            Icon={() => {
              return localMicOn ? (
                <MicOn height={24} width={24} fill="#FFF" />
              ) : (
                <MicOff height={28} width={28} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleCamera();
            }}
            Icon={() => {
              return localWebcamOn ? (
                <VideoOn height={24} width={24} fill="#FFF" />
              ) : (
                <VideoOff height={36} width={36} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={'transparent'}
            onPress={() => {
              switchCamera();
            }}
            Icon={() => {
              return <CameraSwitch height={24} width={24} fill="#FFF" />;
            }}
          />
        </View> */}
      </View>
    );
  };

  switch (type) {
    case 'JOIN':
      return JoinScreen();
    case 'INCOMING_CALL':
      return IncomingCallScreen();
    case 'OUTGOING_CALL':
      return OutgoingCallScreen();
    case 'WEBRTC_ROOM':
      return WebrtcRoomScreen();
    default:
      return null;
  }
}

// import React, {useEffect, useState, useRef} from 'react';
// import {
//   Platform,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   View,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import {
//   mediaDevices,
//   RTCPeerConnection,
//   RTCView,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   MediaStream,
// } from 'react-native-webrtc';
// import CallEnd from '../StreamComponent/CallEnd'
// import CallAnswere from '../StreamComponent/CallAnswer'
// import CameraSwitch from '../StreamComponent/CamaraSwitch';
// import Leave from '../StreamComponent/Leave';
// import MicOff from '../StreamComponent/MicOff';
// import MicOn from '../StreamComponent/MicOn';
// import VideoOff from '../StreamComponent/VideoOff';
// import VideoOn from '../StreamComponent/VideoOn';
// import InCallManager from 'react-native-incall-manager';
// import { UIDSTORING } from '../Recoil/recoilState';
// import { useSocket } from '../context/SocketContext';
// import { useRecoilValue } from 'recoil';

// export default function VideoCallScreen() {

//   const { socket } = useSocket()

//   const [localStream, setlocalStream] = useState(null);

//   const [remoteStream, setRemoteStream] = useState(null);

//   const [type, setType] = useState('JOIN');

//   const uid = useRecoilValue(UIDSTORING)
//   const { data: { robot: { status, uuid } } } = uid;

//   const otherUserId = useRef(null);

//   const [localMicOn, setlocalMicOn] = useState(true);

//   const [localWebcamOn, setlocalWebcamOn] = useState(true);

//   const peerConnection = useRef(
//     new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: 'stun:stun.l.google.com:19302',
//         },
//         {
//           urls: 'stun:stun1.l.google.com:19302',
//         },
//         {
//           urls: 'stun:stun2.l.google.com:19302',
//         },
//       ],
//     }),
//   );

//   let remoteRTCMessage = useRef(null);

//   useEffect(() => {
//     socket.on('newCall', data => {
//       remoteRTCMessage.current = data.rtcMessage;
//       otherUserId.current = data.callerId;
//       processAccept()
//       setType('WEBRTC_ROOM');
//     });

//     socket.on('callAnswered', data => {
//       console.log('callAnswered', data);
//       remoteRTCMessage.current = data.rtcMessage;
//       console.log(remoteRTCMessage.current,"remoteRTCMessage.current");
//       peerConnection.current.setRemoteDescription(
//         new RTCSessionDescription(remoteRTCMessage.current),
//       );
//       setType('WEBRTC_ROOM');
//     });

//     socket.on('ICEcandidate', data => {
//       let message = data.rtcMessage;

//       if (peerConnection.current) {
//         peerConnection?.current
//           .addIceCandidate(
//             new RTCIceCandidate({
//               candidate: message.candidate,
//               sdpMid: message.id,
//               sdpMLineIndex: message.label,
//             }),
//           )
//           .then(data => {
//             console.log('SUCCESS');
//           })
//           .catch(err => {
//             console.log('Error', err);
//           });
//       }
//     });

//     let isFront = false;

//     mediaDevices.enumerateDevices().then(sourceInfos => {
//       let videoSourceId;
//       for (let i = 0; i < sourceInfos.length; i++) {
//         const sourceInfo = sourceInfos[i];
//         if (
//           sourceInfo.kind == 'videoinput' &&
//           sourceInfo.facing == (isFront ? 'user' : 'environment')
//         ) {
//           videoSourceId = sourceInfo.deviceId;
//         }
//       }

//       mediaDevices
//         .getUserMedia({
//           audio: true,
//           video: {
//             mandatory: {
//               minWidth: 500, // Provide your own width, height and frame rate here
//               minHeight: 300,
//               minFrameRate: 30,
//             },
//             facingMode: isFront ? 'user' : 'environment',
//             optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//           },
//         })
//         .then(stream => {
//           // Got stream!

//           setlocalStream(stream);

//           // setup stream listening
//           stream.getTracks().forEach((track) => {
//             peerConnection.current.addTrack(track, stream);
//           });
//         })
//         .catch(error => {
//           // Log error
//         });
//     });

//     peerConnection.current.onaddstream = event => {
//       console.log(event.stream,"event.stream");
//       setRemoteStream(event.stream);
//     };

//     // Setup ice handling
//     // peerConnection.current.onicecandidate = event => {
//     //   console.log(event.candidate,"event.candidate");
//     //   if (event.candidate) {
//     //     sendICEcandidate({
//     //       calleeId: otherUserId.current,
//     //       rtcMessage: {
//     //         label: event.candidate.sdpMLineIndex,
//     //         id: event.candidate.sdpMid,
//     //         candidate: event.candidate.candidate,
//     //       },
//     //     });
//     //   } else {
//     //     console.log('End of candidates.');
//     //   }
//     // };
//     peerConnection.current.addEventListener('icecandidate', event => {
//       console.log(event,"icecandidate");
//       if (event.candidate) {
//         sendICEcandidate({
//           calleeId: otherUserId.current,
//           rtcMessage: {
//             label: event.candidate.sdpMLineIndex,
//             id: event.candidate.sdpMid,
//             candidate: event.candidate.candidate,
//           },
//         });
//       } else {
//         console.log('End of candidates.');
//       }
//     });
//     peerConnection.current.ontrack = (e) => {
//       setRemoteStream(e.streams[0])
//     };

//     return () => {
//       socket.off('newCall');
//       socket.off('callAnswered');
//       socket.off('ICEcandidate');
//       peerConnection.current.removeEventListener('icecandidate');
//     };
//   }, []);

//   useEffect(() => {
//     InCallManager.start();
//     InCallManager.setKeepScreenOn(true);
//     InCallManager.setForceSpeakerphoneOn(true);

//     return () => {
//       InCallManager.stop();
//     };
//   }, []);

//   function sendICEcandidate(data) {
//     socket.emit('ICEcandidate', data);
//   }

//   async function processCall() {
//     const sessionDescription = await peerConnection.current.createOffer();
//     console.log(sessionDescription);
//     await peerConnection.current.setLocalDescription(sessionDescription);
//     sendCall({
//       calleeId: otherUserId.current,
//       rtcMessage: sessionDescription,
//     });
//   }

//   async function processAccept() {
//     peerConnection.current.setRemoteDescription(
//       new RTCSessionDescription(remoteRTCMessage.current),
//     );
//     const sessionDescription = await peerConnection.current.createAnswer();
//     await peerConnection.current.setLocalDescription(sessionDescription);
//     console.log({
//       callerId: otherUserId.current,
//       rtcMessage: sessionDescription,
//     });
//     answerCall({
//       callerId: otherUserId.current,
//       rtcMessage: sessionDescription,
//     });
//   }

//   function answerCall(data) {
//     socket.emit('answerCall', data);
//   }

//   function sendCall(data) {
//     socket.emit('call', data);
//   }

//   const JoinScreen = () => {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{
//           flex: 1,
//           backgroundColor: '#050A0E',
//           justifyContent: 'center',
//           paddingHorizontal: 42,
//         }}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <>
//             <View
//               style={{
//                 padding: 35,
//                 backgroundColor: '#1A1C22',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: 14,
//               }}>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   color: '#D0D4DD',
//                 }}>
//                 Your Caller ID
//               </Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   marginTop: 12,
//                   alignItems: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 32,
//                     color: '#ffff',
//                     letterSpacing: 6,
//                   }}>
//                   {callerId}
//                 </Text>
//               </View>
//             </View>

//             <View
//               style={{
//                 backgroundColor: '#1A1C22',
//                 padding: 40,
//                 marginTop: 25,
//                 justifyContent: 'center',
//                 borderRadius: 14,
//               }}>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   color: '#D0D4DD',
//                 }}>
//                 Enter call id of another user
//               </Text>
//               <TextInputContainer
//                 placeholder={'Enter Caller ID'}
//                 value={otherUserId.current}
//                 setValue={text => {
//                   otherUserId.current = text;
//                   console.log('TEST', otherUserId.current);
//                 }}
//                 keyboardType={'number-pad'}
//               />
//               <TouchableOpacity
//                 onPress={() => {
//                   setType('OUTGOING_CALL');
//                   processCall();
//                 }}
//                 style={{
//                   height: 50,
//                   backgroundColor: '#5568FE',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderRadius: 12,
//                   marginTop: 16,
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     color: '#FFFFFF',
//                   }}>
//                   Call Now
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     );
//   };

//   const OutgoingCallScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'space-around',
//           backgroundColor: '#050A0E',
//         }}>
//         <View
//           style={{
//             padding: 35,
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 14,
//           }}>
//           <Text
//             style={{
//               fontSize: 16,
//               color: '#D0D4DD',
//             }}>
//             Calling to...
//           </Text>

//           <Text
//             style={{
//               fontSize: 36,
//               marginTop: 12,
//               color: '#ffff',
//               letterSpacing: 6,
//             }}>
//             {otherUserId.current}
//           </Text>
//         </View>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => {
//               setType('JOIN');
//               otherUserId.current = null;
//             }}
//             style={{
//               backgroundColor: '#FF5D5D',
//               borderRadius: 30,
//               height: 60,
//               aspectRatio: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <CallEnd width={50} height={12} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const IncomingCallScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'space-around',
//           backgroundColor: '#050A0E',
//         }}>
//         <View
//           style={{
//             padding: 35,
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 14,
//           }}>
//           <Text
//             style={{
//               fontSize: 36,
//               marginTop: 12,
//               color: '#ffff',
//             }}>
//             {otherUserId.current} is calling..
//           </Text>
//         </View>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => {
//               processAccept();
//               setType('WEBRTC_ROOM');
//             }}
//             style={{
//               backgroundColor: 'green',
//               borderRadius: 30,
//               height: 60,
//               aspectRatio: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <CallAnswer height={28} fill={'#fff'} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   function switchCamera() {
//     localStream.getVideoTracks().forEach(track => {
//       track._switchCamera();
//     });
//   }

//   function toggleCamera() {
//     localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
//     localStream.getVideoTracks().forEach(track => {
//       localWebcamOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   function toggleMic() {
//     localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
//     localStream.getAudioTracks().forEach(track => {
//       localMicOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   function leave() {
//     peerConnection.current.close();
//     setlocalStream(null);
//     setType('JOIN');
//   }

//   const WebrtcRoomScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: '#050A0E',
//           paddingHorizontal: 12,
//           paddingVertical: 12,
//         }}>
//         {localStream ? (
//           <RTCView
//             objectFit={'cover'}
//             style={{flex: 1, backgroundColor: '#050A0E'}}
//             streamURL={localStream.toURL()}
//           />
//         ) : null}
//         {remoteStream ? (
//           <RTCView
//             objectFit={'cover'}
//             style={{
//               flex: 1,
//               backgroundColor: '#050A0E',
//               marginTop: 8,
//             }}
//             streamURL={remoteStream.toURL()}
//           />
//         ) : null}
//         <View
//           style={{
//             marginVertical: 12,
//             flexDirection: 'row',
//             justifyContent: 'space-evenly',
//           }}>
//           <IconContainer
//             backgroundColor={'red'}
//             onPress={() => {
//               leave();
//             }}
//             Icon={() => {
//               return <CallEnd height={26} width={26} fill="#FFF" />;
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={!localMicOn ? '#fff' : 'transparent'}
//             onPress={() => {
//               toggleMic();
//             }}
//             Icon={() => {
//               return localMicOn ? (
//                 <MicOn height={24} width={24} fill="#FFF" />
//               ) : (
//                 <MicOff height={28} width={28} fill="#1D2939" />
//               );
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
//             onPress={() => {
//               toggleCamera();
//             }}
//             Icon={() => {
//               return localWebcamOn ? (
//                 <VideoOn height={24} width={24} fill="#FFF" />
//               ) : (
//                 <VideoOff height={36} width={36} fill="#1D2939" />
//               );
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={'transparent'}
//             onPress={() => {
//               switchCamera();
//             }}
//             Icon={() => {
//               return <CameraSwitch height={24} width={24} fill="#FFF" />;
//             }}
//           />
//         </View>
//       </View>
//     );
//   };

//   switch (type) {
//     case 'JOIN':
//       return JoinScreen();
//     case 'INCOMING_CALL':
//       return IncomingCallScreen();
//     case 'OUTGOING_CALL':
//       return OutgoingCallScreen();
//     case 'WEBRTC_ROOM':
//       return WebrtcRoomScreen();
//     default:
//       return null;
//   }
// }
