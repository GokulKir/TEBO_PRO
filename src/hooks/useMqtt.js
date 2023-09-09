import { useEffect, useState } from 'react';
import MQTT from 'sp-react-native-mqtt';

const useMQTT = (connectUrl, clientId, topic) => {
  const [message, setMessage] = useState(null);
  const client = MQTT.createClient({
    uri: connectUrl,
    clean: true,
    auth: true,
    user: 'domainenroll',
    pass: 'de120467',
    clientId: clientId,
  });

  useEffect(() => {
    const onMessageReceived = (receivedTopic, msg) => {
      if (receivedTopic === topic) {
        setMessage(msg);
      }
    };

    client.on('message', onMessageReceived);

    client.connect();

    client.subscribe(topic);

    return () => {
      client.disconnect();
      client.removeAllListeners();
    };
  }, [connectUrl, clientId, topic]);

  return message;
};

export default useMQTT;
