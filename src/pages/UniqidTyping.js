import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  Platform
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import useStyle from '../hooks/useStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import { useRecoilValue } from 'recoil';
import { UIDSTORING } from '../Recoil/recoilState';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import apiInstance from '../api/apiInstance';
import useGeolocation from '../hooks/useLocation';
import MQTT from 'sp-react-native-mqtt';
import useMQTT from '../hooks/useMqtt';
import { SocketContext } from '../context/SocketContext';
import { useNavigation } from '@react-navigation/native';

export default function UniqidTyping() {

  //Navigating veriable//
  const navigation = useNavigation()
  //Navigating veriable//





  const [visible, setVisible] = useState(false);
  const { BottomPage } = useStyle();
  const [uid, setUid] = useState()
  const uniqID = useRecoilValue(UIDSTORING)
  const { location, placeName } = useGeolocation();
  const [loading, setLoading] = useState(null)
  const [text, setText] = useState('Connected mqqtt not fetching received data')
  const [client, publishMessage] = useMQTT('mqtt://sonic.domainenroll.com:1883', 'domainenroll:de120467', '/user_data', text);
  const { sendMessage, addUserId } = useContext(SocketContext)
  const [condition, setCondition] = useState(false)

  // const host = "sonic.domainenroll.com";
  // const port = "1883";
  // const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  // const topic = "/user_data";


  // const connectUrl = `mqtt://${host}:${port}`;


  // const [client, publishMessage] = useMQTT('mqtt://sonic.domainenroll.com:1883', 'domainenroll:de120467', '/user_data', text);

  //Mqqtt state//

  // const uri = ''; 
  // const clientId = '';
  // const topic = '/user_data';

  //  useEffect(()=>{

  //   setTimeout(() => {

  //     publishMessage(text)

  //   }, 2500);

  //  },[])




  // useEffect(()=>{

  //   setTimeout(()=>{

  //     navigation.navigate('Stream')

  //   },2000)

  // },[])




  useEffect(() => {
    addUserId('TEBO-GOKUL-NOKIA-TABLET')
  }, [])


  useEffect(() => {

    setTimeout(() => {

      setVisible(false)


    }, [2500])

  }, [])



  useEffect(() => {

    if (location) {
      console.log("Latitude:", location.latitude, "Longitude:", location.longitude, "Accuracy:", location.accuracy);
    }
  }, [location]);

  useEffect(() => {
    if (placeName) {
      console.log('Place Name:', placeName);
      console.log("Accuracy:", location.accuracy + " latitude " + location.latitude);
    }
  }, [placeName]);








  useEffect(() => {
    const fetchRobotUUID = async () => {
      if (location && placeName && uid) {
        const postData = {
          robot_uuid: uid,
          latitude: location.latitude,
          longitude: location.longitude,
          location: placeName,
          map_accuracy: location.accuracy,

        };

        setLoading(true);

        try {
          const response = await apiInstance.post('/api/v1/robot-location', postData);
          console.log('Success:', response.data);
          setTimeout(() => {
            console.log("Sent Location");
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

    fetchRobotUUID();
  }, [uid, location, placeName]);




  // useEffect(()=>{

  //   apiInstance.post('/api/v1/robot-location')
  //   .then((res)=>{
  //     console.log("Success",res);
  //   })

  // },[])

  // const uri = 'mqtt://sonic.domainenroll.com:1883';
  // const clientId = 'domainenroll';
  // const user = 'domainenroll';
  // const pass = 'de120467';
  // const topic = '/user_data';

  // uri: 'mqtt://sonic.domainenroll.com:1883', // MQTT broker URI
  // clientId: 'domainenroll:de120467',
  // user: 'domainenroll', // MQTT username
  // pass: 'de120467', // MQTT password


  // const receivedMessage = useMQTTReceiver('mqtt://sonic.domainenroll.com:1883', '','/user_data'); // Update with proper MQTT configuration



  //Mqqtt state//


  const UniqId = useRecoilValue(UIDSTORING)





  useEffect(() => {

    console.log("UniqId", UniqId);

    const { data: { robot: { status, uuid } }, message } = UniqId;


    console.log(uuid);

    setUid(uuid);
  }, [])


  const CheckingConditionfalse = async () => {






    try {

      const requestData = {
        robot_uuid: `${uid}`,
        owner_random_id: "OW-RK1KWA6-SKC-PEVDATO",
        accept_reject: false
      }
      const response = await apiInstance.post('http://tebo.domainenroll.com/api/v1/accept-reject', requestData);
      // Handle the response here
      console.log('POST response:', response.data);
    } catch (error) {
      console.error('POST error:', error);
    }


  }



  const CheckingCondition = async () => {


    navigation.navigate('Stream')


    try {


      const requestData = {
        robot_uuid: `${uid}`,
        owner_random_id: "OW-RK1KWA6-SKC-PEVDATO",
        accept_reject: true
      }

      const response = await apiInstance.post('/api/v1/accept-reject', requestData);

      // Handle the response here
      console.log('POST response:', response.data);
    } catch (error) {
      console.error('POST error:', error);
    }


  }




  const styles = BottomPage;

  return (
    <View style={styles.MainPage}>
      <View style={styles.centerBox}>
        <View style={styles.CetnerIdBoxout}>
          <Text style={styles.Textstyle}>UNIQUE ID</Text>
        </View>

        <View style={styles.CenterCode}>
          <Text style={styles.UIDStyle}>{uid}</Text>
        </View>

        <View>
          {/* <TouchableOpacity onPress={() => setVisible(true)}  style={styles.ButtonStyle}>

<Text style={styles.ButtonTextstyle}>SUBMIT</Text>

</TouchableOpacity> */}
        </View>
      </View>

      <Modal visible={visible} transparent>
        <View style={styles.UIDModal}>
          <View style={styles.centerBoxText}>
            <Text style={styles.PopUpText}>
              John Doe wants to connect to Robot Black Heart!
            </Text>
          </View>

          <View style={styles.ModalButtonView}>
            <Ripple onPress={() => CheckingCondition()} style={styles.ModalButton}>
              <Text>ACCEPT</Text>
            </Ripple>

            <Ripple onPress={() => CheckingConditionfalse()} style={styles.ModalButtonRed}>
              <Text>REJECT</Text>
            </Ripple>
          </View>
        </View>
      </Modal>
    </View>
  );
}
