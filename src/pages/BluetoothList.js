import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BleManager} from 'react-native-ble-plx';
import useBleManager from '../hooks/useBluetooth';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  Connected,
  ConnectedDeviceName,
  DeviceIDCoil,
  PasswordStoring,
  scanningCondition,
} from '../Recoil/recoilState';
import Ripple from 'react-native-material-ripple';
import {SsidValue} from '../data/Recoil/atom';

export const manager = new BleManager();

const requestPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Request for Location Permission',
      message: 'Bluetooth Scanner requires access to Fine Location Permission',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export default function BluetoothList() {
  const [logData, setLogData] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [scannedDevices, setScannedDevices] = useState([]);
  const [deviceCount, setDeviceCount] = useState(0);
  const [devices, setDevices] = useState([]);
  const {
    startScanning,
    connectToDevice,
    listConnectedDevices,
    connectedDevices,
    sendDataToDevice,
  } = useBleManager();
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [serviceUUID, setServiceUUID] = useState('');
  const [characteristicUUID, setCharacteristicUUID] = useState('');
  const BleDevice = useRecoilValue(DeviceIDCoil);
  const password = useRecoilValue(PasswordStoring);
  const ssid = useRecoilValue(SsidValue);
  const [data, setData] = useState({password, ssid});
  const [DeviceS, setDeviceS] = useState([]);
  const ScanningIf = useRecoilValue(scanningCondition);
  const manager = new BleManager();
  const Devicename = useRecoilValue(ConnectedDeviceName);





   









  useEffect(() => {
 
    startScanning();

    console.log("All Devices Started",DeviceS);

    console.log('Scanning+++++++++', BleDevice);

    const {characteristicUUID, id, name, serviceUUID} = BleDevice;

    if (id) {
      console.log(
        'ConnectionManager++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
        id,
      );
      connectToDevice(id);
    }

    console.log('Characteristics UUID:', characteristicUUID);
    setCharacteristicUUID(characteristicUUID);
    console.log('Device ID:', id);
    const deviceID = String(id);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!11', deviceID);
    setDeviceId(deviceID);
    console.log('Device Name:', name);
    setDeviceName(name);
    console.log('Service UUID:', serviceUUID);
    setServiceUUID(serviceUUID);

    console.log('+++++++++_____________________________', connectedDevices);
  }, []);


  useEffect(()=>{

    if(Devicename != null) {
      console.log("Connected device",Devicename);
   
       sendDataToDevice(deviceId, serviceUUID, characteristicUUID, data)

    }
    

  },[])

  //  const SendToDevice = () => {

  //   try {

  //     const data = {
  //       ssid : ssid ,
  //       password : password
  //     }

  //     sendDataToDevice(deviceId, serviceUUID, characteristicUUID, data)

  //   } catch (error) {

  //     console.log("error", error);

  //   }

  //  }

  return (
    <View style={styles.container}>
      <View style={styles.SecContainer}>
        <Icon name="bluetooth" color="blue" size={60} />
      </View>

      <View
        style={{alignItems: 'center', justifyContent: 'center', marginTop: 80}}>
        <Text
          style={{
            color: 'grey',
            fontStyle: 'italic',
            fontWeight: '400',
            fontSize: 30,
          }}>
          {deviceName}
        </Text>
      </View>

      <View style={{alignItems: 'center', marginTop: 50}}>
        <Ripple
          onPress={() => connectToDevice(deviceId)}
          style={{
            width: 120,
            height: 42,
            elevation: 5,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: '#000', fontStyle: 'italic', fontSize: 18}}>
            Connect
          </Text>
        </Ripple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  SecContainer: {
    width: responsiveWidth(15),
    height: responsiveWidth(13),
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ConnectioStyle: {
    width: responsiveWidth(96),
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 3,
    elevation: 10,
    marginTop: 10,
  },
});
