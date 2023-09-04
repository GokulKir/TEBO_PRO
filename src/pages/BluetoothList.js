import { StyleSheet, Text, View, ScrollView, TouchableOpacity, PermissionsAndroid , FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BleManager } from 'react-native-ble-plx';
import useBleManager from '../hooks/useBluetooth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Connected, DeviceIDCoil, PasswordStoring, scanningCondition } from '../Recoil/recoilState';
import Ripple from 'react-native-material-ripple';
import { SsidValue } from '../data/Recoil/atom';

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
  const { startScanning, connectToDevice, listConnectedDevices  , connectedDevices , sendDataToDevice } = useBleManager();
  const [deviceName , setDeviceName] = useState('')
  const [deviceId  , setDeviceId] = useState('')
  const [serviceUUID , setServiceUUID] = useState('')
  const [characteristicUUID , setCharacteristicUUID] = useState('')
  const BleDevice = useRecoilValue(DeviceIDCoil)
  const password = useRecoilValue(PasswordStoring)
  const ssid = useRecoilValue(SsidValue)
  const [data , setData] = useState({password, ssid})
  const ScanningIf = useRecoilValue(scanningCondition)
  

  useEffect(()=>{

startScanning()

    console.log("Scanning+++++++++",BleDevice);


    const {
      characteristicUUID,
      id,
      name,
      serviceUUID,
    } = BleDevice;



    if(id) {
console.log("ConnectionManager++++++++++++++++++++++++++++++++++++++++++++++++++++++++", id);
      connectToDevice(id)

    }
    
    console.log('Characteristics UUID:', characteristicUUID);
    setCharacteristicUUID(characteristicUUID)
    console.log('Device ID:', id);
    const deviceID = String(id)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!11",deviceID);
    setDeviceId(deviceID)
    console.log('Device Name:', name);
    setDeviceName(name)
    console.log('Service UUID:', serviceUUID); 
    setServiceUUID(serviceUUID)
    
    

    console.log("+++++++++_____________________________",connectedDevices);



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

    


<View style={{alignItems:'center' , justifyContent:'center' , marginTop:80 , }}>

  <Text style={{color:'grey' , fontStyle:'italic' , fontWeight:'400' , fontSize:30 }}>{deviceName}</Text>

  </View>



  <View style={{alignItems:'center' ,  marginTop:50 }}>
    <Ripple onPress={()=> connectToDevice(deviceId)} style={{width:120 , height:42 , elevation :5 , backgroundColor:'#fff' , alignItems:'center' , justifyContent:'center'}} >

      <Text style={{color:'#000' , fontStyle:'italic' , fontSize:18 ,}}>Connect</Text>

    </Ripple>
  </View>

  





  

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: responsiveHeight(3)
  },
  SecContainer: {
    width: responsiveWidth(15),
    height: responsiveWidth(13),
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center'

  },
  ConnectioStyle: {
    width: responsiveWidth(96),
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 3,
    elevation: 10,
    marginTop: 10,
  }
})

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Button, PermissionsAndroid } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';

// export c
//st manager = new BleManager();

// const requestPermission = async () => {
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
//     title: "Request for Location Permission",
//     message: "Bluetooth Scanner requires access to Fine Location Permission",
//     buttonNeutral: "Ask Me Later",
//     buttonNegative: "Cancel",
//     buttonPositive: "OK"
//   }
//   );
//   return (granted === PermissionsAndroid.RESULTS.GRANTED);
// }

// // BlueetoothScanner does:
// // - access/enable bluetooth module
// // - scan bluetooth devices in the area
// // - list the scanned devices
// const BluetoothScanner = () => {
//   const [logData, setLogData] = useState([]);
//   const [logCount, setLogCount] = useState(0);
//   const [scannedDevices, setScannedDevices] = useState({});
//   const [deviceCount, setDeviceCount] = useState(0);

//   useEffect(() => {
//     manager.onStateChange((state) => {
//       const subscription = manager.onStateChange(async (state) => {
//         console.log(state);
//         const newLogData = logData;
//         newLogData.push(state);
//         await setLogCount(newLogData.length);
//         await setLogData(newLogData);
//         subscription.remove();
//       }, true);
//       return () => subscription.remove();
//     });
//   }, [manager]);

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <View style={{ flex: 1, padding: 10 }}>
//         <Text style={{ fontWeight: "bold" }}>Bluetooth Log ({logCount})</Text>
//         <FlatList
//           data={logData}
//           renderItem={({ item }) => {
//             return (<Text>{item}</Text>)
//           }}
//         />
//         <Button
//           title="Turn On Bluetooth"
//           onPress={async () => {
//             const btState = await manager.state()
//             // test is bluetooth is supported
//             if (btState === "Unsupported") {
//               alert("Bluetooth is not supported");
//               return (false);
//             }
//             // enable if it is not powered on
//             if (btState !== "PoweredOn") {
//               await manager.enable();
//             } else {
//               await manager.disable();
//             }
//             return (true);
//           }}
//         />
//       </View>

//       <View style={{ flex: 2, padding: 10 }}>
//         <Text style={{ fontWeight: "bold" }}>Scanned Devices ({deviceCount})</Text>
//         <FlatList
//           data={Object.values(scannedDevices)}
//           renderItem={({ item }) => {
//             return (<Text>{`${item.name} (${item.id})`}</Text>)
//           }}
//         />
//         <Button
//           title="Scan Devices"
//           onPress={async () => {
//             const btState = await manager.state()
//             // test if bluetooth is powered on
//             if (btState !== "PoweredOn") {
//               alert("Bluetooth is not powered on");
//               return (false);
//             }
//             // explicitly ask for user's permission
//             const permission = await requestPermission();
//             if (permission) {
//               manager.startDeviceScan(null, null, async (error, device) => {
//                 // error handling
//                 if (error) {
//                   console.log(error);
//                   return
//                 }
//                 // found a bluetooth device
//                 if (device) {
//                   console.log(`${device.name} (${device.id})}`);
//                   const newScannedDevices = scannedDevices;
//                   newScannedDevices[device.id] = device;
//                   await setDeviceCount(Object.keys(newScannedDevices).length);
//                   await setScannedDevices(scannedDevices);
//                 }
//               });
//             }
//             return (true);
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// // export default BluetoothScanner;

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Button, PermissionsAndroid } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// export const manager = new BleManager();

// const requestPermission = async () => {
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     {
//       title: 'Request for Location Permission',
//       message: 'Bluetooth Scanner requires access to Fine Location Permission',
//       buttonNeutral: 'Ask Me Later',
//       buttonNegative: 'Cancel',
//       buttonPositive: 'OK',
//     },
//   );
//   return granted === PermissionsAndroid.RESULTS.GRANTED;
// };

// // BlueetoothScanner does:
// // - access/enable bluetooth module
// // - scan bluetooth devices in the area
// // - list the scanned devices







// const BluetoothScanner = () => {
//   const [logData, setLogData] = useState([]);
//   const [logCount, setLogCount] = useState(0);
//   const [scannedDevices, setScannedDevices] = useState({});
//   const [deviceCount, setDeviceCount] = useState(0);
//   const [devices, setDevices] = useState([]);

//   const startScan = async () => {
//     const bleManager = new BleManager();
//     bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
//       if (error) {
//         console.error('Error scanning:', error);
//         return;
//       }
//       if (scannedDevice) {
//         setDevices(prevDevices => [...prevDevices, scannedDevice]);
//       }
//     });
//   };

//   useEffect(() => {
//     manager.onStateChange(state => {
//       const subscription = manager.onStateChange(async state => {
//         console.log(state);
//         const newLogData = logData;
//         newLogData.push(state);
//         await setLogCount(newLogData.length);
//         await setLogData(newLogData);
//         subscription.remove();
//       }, true);
//       return () => subscription.remove();
//     });
//   }, [manager]);

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <View style={{ flex: 1, padding: 10 }}>
//         <Text style={{ fontWeight: 'bold' }}>Bluetooth Log ({logCount})</Text>
//         <FlatList
//           data={logData}
//           renderItem={({ item }) => {
//             return <Text>{item}</Text>;
//           }}
//         />
//         <Button
//           title="Turn On Bluetooth"
//           onPress={async () => {
//             const btState = await manager.state();
//             // test is bluetooth is supported
//             if (btState === 'Unsupported') {
//               alert('Bluetooth is not supported');
//               return false;
//             }
//             // enable if it is not powered on
//             if (btState !== 'PoweredOn') {
//               await manager.enable();
//             } else {
//               await manager.disable();
//             }
//             return true;
//           }}
//         />
//       </View>

//       <View style={{ flex: 2, padding: 10 }}>
//         <Text style={{ fontWeight: 'bold' }}>
//           Scanned Devices ({deviceCount})
//         </Text>
//         <FlatList
//           data={Object.values(scannedDevices)}
//           renderItem={({ item }) => {
//             return <Text>{`${item.name} (${item.id})`}</Text>;
//           }}
//         />
//         <Button
//           title="Scan Devices"
//           onPress={async () => {
//             const btState = await manager.state();
//             // test if bluetooth is powered on
//             if (btState !== 'PoweredOn') {
//               alert('Bluetooth is not powered on');
//               return false;
//             }
//             // explicitly ask for user's permission
//             const permission = await requestPermission();
//             if (permission) {
//               manager.startDeviceScan(null, null, async (error, device) => {
//                 // error handling
//                 if (error) {
//                   console.log(error);
//                   return;
//                 }
//                 // found a bluetooth device
//                 if (device) {
//                   console.log(`${device.name} (${device.id})}`);
//                   const newScannedDevices = scannedDevices;
//                   newScannedDevices[device.id] = device;
//                   await setDeviceCount(Object.keys(newScannedDevices).length);
//                   await setScannedDevices(scannedDevices);
//                 }
//               });
//             }
//             return true;
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// export default BluetoothScanner;
