import MQTT from 'sp-react-native-mqtt';
import { useState, useEffect } from 'react';

const useMQTT = (uri, clientId, topic, message) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const createClient = async () => {
      const mqttClient = await MQTT.createClient({ uri, clientId });

      mqttClient.on('closed', () => {
        console.log('mqtt.event.closed');
        setIsConnected(false);
      });

      mqttClient.on('error', (msg) => {
        console.log('mqtt.event.error', msg);
      });

      mqttClient.on('message', (msg) => {
        console.log('mqtt.event.message', msg);
        
      
      });

      mqttClient.on('connect', () => {
        console.log('connected');
        setIsConnected(true);
        mqttClient.subscribe(topic, 0);
        mqttClient.publish(topic, message, 0, false);
      });

      await mqttClient.connect();
      setClient(mqttClient);
    };

    createClient();
  }, [uri, clientId, topic, message]);

  const publishMessage = (newMessage) => {
    if (client && isConnected) {
      client.publish(topic, newMessage, 0, false);
    }
  };

  return [client, publishMessage];
};

export default useMQTT;