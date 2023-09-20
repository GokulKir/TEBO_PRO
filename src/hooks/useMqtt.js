// import { useEffect, useState } from 'react';
// import mqtt from 'sp-react-native-mqtt';
// import { UIDSTORING } from '../Recoil/recoilState';
// import { useRecoilValue } from 'recoil';


// function useMqttClient() {
//   const [client, setClient] = useState(null);
//   const [data, setData] = useState(null);
//   const [visible, setVisible] = useState(false);

//   const uid = useRecoilValue(UIDSTORING);
//   const {
//     data: {
//       robot: {status, uuid},
//     },
//   } = uid;

//   const host = 'sonic.domainenroll.com';
//   const port = '1883';
//   const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
//   const topic = `/Devlacus/Tebo/${uuid}/instructions`;
//   const userData = `/Devlacus/Tebo/${uuid}/instructions`;
//   const connectUrl = `mqtt://${host}:${port}`;

//   useEffect(() => {
//     const mqttClient = mqtt.createClient({
//       uri: connectUrl,
//       clean: true,
//       auth: true,
//       user: 'domainenroll',
//       pass: 'de120467',
//       clientId: clientId,
//     });

//     mqttClient.on('closed', function () {
//       console.log('mqtt.event.closed');
//     });

//     mqttClient.on('error', function (msg) {
//       console.log('mqtt.event.error', msg);
//     });

//     mqttClient.on('message', function (msg) {
//       console.log('mqtt.event.message', msg);
//       setVisible(true);
//       setData(msg);
//     });

//     mqttClient.on('connect', function () {
//       console.log('connected');
//       mqttClient.subscribe(topic, 0);
//       mqttClient.subscribe(userData, 0);
//     });

//     mqttClient.connect();

//     setClient(mqttClient);

//     return () => {
//       if (mqttClient) {
//         mqttClient.end();
//       }
//     };
//   }, []);

//   return { client, data, visible };
// }

// export default useMqttClient;



import { useEffect, useState } from 'react';
import mqtt from 'sp-react-native-mqtt';
import { MqttMessage, UIDSTORING } from '../Recoil/recoilState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigation} from '@react-navigation/native';

function useMqttClient() {
  const [client, setClient] = useState(null);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [mqttData, setMqttData] = useRecoilState(MqttMessage)
  const navigation = useNavigation();



    const uid = useRecoilValue(UIDSTORING);
  const {
    data: {
      robot: {status, uuid},
    },
  } = uid;


  const host = 'sonic.domainenroll.com';
  const port = '1883';
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const topic = `Devlacus/Tebo/${uuid}/info/callState`;
  const userData = `Devlacus/Tebo/${uuid}/info/callState`;
  const connectUrl = `mqtt://${host}:${port}`;

  
  useEffect(()=>{
    mqtt.createClient({
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
        console.log('mqtt Messages');
        setMqttData(msg)
        setData(msg)
        const {data} = msg;
        if(data == 'call ended'){
          navigation.replace('Checking');
        }
        });

        client.on('connect', function () {
          console.log('connected');
          client.subscribe(topic,0);
          client.subscribe(userData,0);
        });

        client.connect();

        setClient(client);
      })
      .catch(function (err) {
        console.log(err);
      });

},[])

  return { client, data, visible };
}

export default useMqttClient;
