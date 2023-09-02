import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  PermissionsAndroid,
  ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import useStyle from '../hooks/useStyle';
import usePlatform from '../hooks/usePlatform';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  Backid,
  SSidconnectionEstablished,
  SsidValue,
  WifiConnectionEstablished,
} from '../data/Recoil/atom';
import useWifiManager from '../hooks/useWifi';
import WifiManager from 'react-native-wifi-reborn';
import {
  Modal,
  Portal,
  Button,
  PaperProvider,
  Snackbar,
} from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import DeviceInfo from 'react-native-device-info';
// import BleManager from 'react-native-ble-plx';
import { check, PERMISSIONS, request , requestMultiple } from 'react-native-permissions';
import useApi from '../hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useBleManager from '../hooks/useBluetooth';
import useBle from '../hooks/useBle';
import { BleManager } from 'react-native-ble-plx';
import { DeviceIDCoil, PasswordStoring, scanningCondition } from '../Recoil/recoilState';
import { BallIndicator } from 'react-native-indicators';

export default function PasswordTyping() {




  //Navigation veriable//
  const navigation = useNavigation();
  //Navigation veriable//

  //Recoil states//
  const backId = useRecoilValue(Backid);
  const [WIFI, SETWIFI] = useRecoilState(WifiConnectionEstablished);
  const [SSIDVALUE, SETSSIDVALUE] = useRecoilState(SSidconnectionEstablished);
  const ssid = useRecoilValue(SsidValue);
  const [pass , setPass] = useRecoilState(PasswordStoring)
  //Recoil states//

  //Platform states//
  const { isTablet } = usePlatform();
  //Platform states//

  //Wifi state//
  const [connectionWifi, SetconnectToWifi] = useState(ssid, password);
  const [password, setPassword] = useState(null);
  const [connecting, setConnecting] = useState(false);
  //Wifi state//

  //Style veriable//
  const { BottomPage } = useStyle();
  const styles = BottomPage;
  const { width, height } = Dimensions.get('window');
  //Style veriable//

  // const { wifiList, connectedWifi, scanWifi, connectToWifi, disconnectFromWifi } = useWifiManager();

  const [visible, setVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [secure, setSecure] = useState(false);
  const [show, setShow] = useState(false);
  const [connectionTrue, setConnectionTrue] = useState(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [manager, setManager] = useState(null);
  const [loading , setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [BleList , setBleList] = useState(false)
  const [Bleset , setBleset] = useRecoilState(DeviceIDCoil)
  const { startScanning, connectToDevice, listConnectedDevices , connectedDevices , allDevices } = useBleManager();
  const ScanningIf = useRecoilValue(scanningCondition)

  
  const [uniqueDeviceNames, setUniqueDeviceNames] = useState(new Set());
    const [scannedDevices, setScannedDevices] = useState([]);
const bleManager = new BleManager();

  // useEffect(() => {
  
  //         // Fetch the connected peripherals (devices)
  //         bleManager.connectedDevices([]).then((connectedDevices) => {
  //           connectedDevices.forEach((device) => {
  //             console.log('Connected Device Name:', device.name || 'Unknown');
    
  //           });
  //         });
      
  //         // Clean up the BleManager instance
  //         return () => {
  //           bleManager.destroy();
  //         };
  //       }, []);
    
      
    
    


  const requestPermissionsAndStartScanning = async () => {
  
      try {
        const locationPermission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        const bluetoothScanPermission = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
        const bluetoothConnectPermission = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    
        if (
          locationPermission === 'granted' &&
          bluetoothScanPermission === 'granted'
        ) {
          console.log('All required permissions granted');
          startScanning();
        } else {
          console.log('Some permissions are denied');
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    
    
  };
    // requestPermissionsAndStartScanning()




  // Rest of your component code
  



  // useEffect(() => {
 
  //   BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
  //     // Success code
  //     console.log("Connected peripherals: " + peripheralsArray.length);
  //   });
  // }, []);



useEffect(()=>{

  console.log("Connected peripherals:++++++++++ " + allDevices);

},[])


  const {
    wifiList,
    selectedWifi,
    scanWifiNetworks,
    setSelectedWifi,
    connectToWifi,
    // connectionStatus
  } = useWifiManager();

  const BackValue = 'ROBO_DE%V*L(+E$C@US';

  useEffect(() => {
    let version = DeviceInfo.getVersion();
    let deviceId = DeviceInfo.getDeviceId();
    console.log('Version: ' + version);
    console.log('DeviceId: ' + deviceId);
    DeviceInfo.getBatteryLevel().then(batteryLevel => {
      console.log('Battery Level: ' + batteryLevel);
    });

  }, []);

  const showSnackbar = () => {
    setShow(true);
  };

  const hideSnackbar = () => {
    setShow(false);
  };







  const connectWifi = async () => {
    console.log('SSSSSSIIIDDD', ssid, 'PPPPAAAAASS', password);


    if (password === null) {
      console.log('No password');
      showSnackbar();

    }
    if (ssid && password) {
      setPass(password)
      try {
        setConnecting(true);
        const isConnected = await WifiManager.connectToProtectedSSID(
          ssid,
          password,
          true,
          false,
        );
        if (isConnected) {
          console.log(`Connected to WiFi network: ${ssid}`);
          await AsyncStorage.setItem('userToken', ssid);
          requestPermissionsAndStartScanning()
          setConnectionTrue(true);
          setBleList(true)
        } else {
          console.log(`Failed to connect to WiFi network: ${ssid}`);
          setConnectionTrue(false);
        }
      } catch (error) {
        console.error('Error connecting to WiFi:', error);
        setConnectionTrue(false);
      } finally {
        setConnecting(false);
      }
    }
  };

  const Show = () => {
    setSecure(!secure);
  };

  const route = useRoute();

  const { passing } = route;

  useEffect(() => {
    console.log('SSID : ', ssid);
  }, []);

  useEffect(() => {
    console.log(isTablet);
    console.log(Platform);

    console.log('This is a backId' + backId);

    if (backId === BackValue) {
      console.log('ID IS CORRECTED');
    }
  }, []);




  const ConnectEnter = () => {
    console.log('Password+++++++SSID' + ssid + ':  ' + password);
    SETWIFI(password);
    SETSSIDVALUE(ssid);

    setSelectedWifi(ssid);
    connectToWifi(password);
    setVisible(true);
    // connectedWifi(SSID , password )
    console.log('PASSSWORD', password);
    // connectToWifi(ssid, password);
  };


  const BlePick = (data) => {
        console.log("Devices", data);
        setBleset(data);
        navigation.navigate("BLELIST")
  }



  return (
    <View style={styles.MainPage}>
      <View style={styles.centerBox}>
        <View style={styles.centerBoxout}>
          <Text style={styles.Textstyle}>PASSWORD</Text>
        </View>

        <View style={styles.CenterInput}>
          {secure === true ? (
            <View style={styles.InputStyle}>
              <TextInput
                secureTextEntry={false}
                placeholder="Enter password"
                placeholderTextColor={'grey'}
                style={styles.OrgInput}
              />

              <View style={styles.IconSt}>
                <TouchableOpacity onPress={Show}>
                  <Icon1 name="eye" color="grey" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.InputStyle}>
              <TextInput
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                placeholder="Enter password"
                placeholderTextColor={'grey'}
                style={styles.OrgInput}
              />

              <View style={styles.IconSt}>
                <TouchableOpacity onPress={Show}>
                  <Icon1 name="eye-off" color="grey" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity
            onPress={() => connectWifi()}
            // onPress={() => setVisible(true)}
            style={styles.ButtonStyle}>
            <Text style={styles.ButtonTextstyle}>ENTER</Text>
          </TouchableOpacity>
        </View>
      </View>


      <Modal visible={visible} transparent>


        

        <View

          style={{
            width: '50%',
            height: 250,
            backgroundColor: '#fff',
            elevation: 5,
            alignSelf: 'center',
            borderRadius: 5
          }}>

<View style={{left:3 , justifyContent:"flex-end"}}>

<Icon3 name="remove" size={15} color="red"/>
</View>
<View>
      {connectedDevices.map((obj, i) => (
        <TouchableOpacity
          key={i}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={{ color: '#000' }}>{obj.id}</Text>
        </TouchableOpacity>
      ))}
    </View>


         



        



        </View>

      </Modal>



      <Modal visible={BleList} transparent>
        <View style={styles.ModalStyle}>
          {ScanningIf === true  ?     
          <ScrollView>
            {allDevices.map((obj, i) => {
              return (
                <View key={i} style={styles.SsidListStyle}>
                  <Ripple onPress={()=> BlePick(obj)}
                    rippleDuration={1200}
                    rippleOpacity={0.2}
                    rippleColor="#000"
                    style={styles.RippleStyle}>
                    <View style={styles.StyleComponent}>
                      <View style={styles.PositionStyle}>
                        <Text style={styles.SSidText}>{obj.name}</Text>
                      </View>

                      <View style={styles.WifiIcon}>
                        <Icon2 name="bluetooth" size={30} color="blue"/>
                      </View>
                    </View>
                  </Ripple>
                </View>
              );
            })}
          </ScrollView>  

          : 


          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <BallIndicator color="red" size={50} /> 
           <Text style={{top:-90 , fontStyle:'italic' , fontWeight:'400'}}>Scanning devices..</Text>
         </View>


   

          }



        </View>
      </Modal>


      <Snackbar
        style={{ backgroundColor: 'red', color: '#fff' }}
        visible={show}
        onDismiss={hideSnackbar}
        action={{
          label: 'Ok',
          onPress: () => {
            setShow(false); // Do something
          },
        }}>
        please enter your wifi password
      </Snackbar>
    </View>
  );
}
