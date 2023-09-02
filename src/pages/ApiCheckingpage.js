import React, { useEffect, useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { BallIndicator } from 'react-native-indicators';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../api/apiInstance'; // Assuming you have an API instance set up
import { useRecoilState } from 'recoil';
import { UIDSTORING } from '../Recoil/recoilState';

export default function ApiCheckingpage() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(true);
  const [uid, setUid] = useRecoilState(UIDSTORING);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    DeviceInfo.getUniqueId().then((uniqueId) => {
      setUid(uniqueId);
    });
  }, []);

  useEffect(() => {
    if (uid) {
      const postData = {
        device_id: uid,
      };

      const fetchRobotUUID = async () => {
        setLoading(true);
        try {
          const response = await apiInstance.post('/api/v1/robot-uuid', postData);
          console.log('Success:', response.data);
          setTimeout(() => {
            setUid(response.data); // Update the uid with the response data
            setVisible(false); // Hide the loading modal
            navigation.replace('Stream'); // Navigate to the UIDTyping screen
          }, 2500);
        } catch (error) {
          console.error('Network error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRobotUUID();
    }
  }, [uid]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Modal visible={visible} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <BallIndicator color="red" size={50} /> 
          <Text>Loading...</Text>
        </View>
      </Modal>
    </View>
  );
}
