import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  NativeEventEmitter,
  NativeModules,
  DeviceEventEmitter,
  Platform
} from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import React, { useEffect, useRef, useState, useContext } from 'react';
import useStyle from '../hooks/useStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Backid, SsidValue, Visible } from '../data/Recoil/atom';
import usePermissions from '../hooks/usePermissions';
import {
  Modal,
  Portal,
  Button,
  PaperProvider,
  Snackbar,
} from 'react-native-paper';

import Ripple from 'react-native-material-ripple';
import SsidModal from '../components/SsidModal';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
// import BleManager from 'react-native-ble-manager';
import DeviceInfo from 'react-native-device-info';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
// import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
// import { SocketContext } from '../context/SocketContext';
import { CONFIRMPOPUP } from '../Recoil/recoilState';
import useWifiManager from '../hooks/useWifi';

Geocoder.init('AIzaSyDLg_VU_6t6k3GdnSDUr8_ExrBfKQ3k-2I');


export default function SsidTyping() {
  const [bluetoothDevices, setBluetoothDevices] = useState([]);
  const [Bid, setBid] = useRecoilState(Backid);
  const [visible, setVisible] = useState(false);
  const { BottomPage } = useStyle();
  const styles = BottomPage;
  const { WifiPermission, requestBluetoothPermissions } = usePermissions();
  const [selectedSSID, setSelectedSSID] = useState('');
  const pickerRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [selectedSSIDValue, setSelectedSSISValue] = useRecoilState(SsidValue);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [show, setShow] = useState(false);
  const [logData, setLogData] = useState(false);
  const [deviceName, setDeviceName] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(RESULTS.UNAVAILABLE);
  const [error, setError] = useState(null);
  const eventEmitterRef = useRef(null);
  const confirm = useRecoilValue(CONFIRMPOPUP)




  // const { sendMessage, Confirm } = useContext(SocketContext)


  const deviceInfo = DeviceInfo


  // useEffect(()=>{
  //   console.log("Received++++++++++");
  //   sendMessage("Hello, world!")




  // },[])



  useEffect(() => {

    console.log("Confirmed++++++++", confirm);

  }, [])


  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState('');




useEffect(()=>{

  WifiPermission()

},[])
 


  






  //Bluetooth Turn on//





  //Bluetooth Turn on//




  const showSnackbar = () => {
    setShow(true);
  };

  const hideSnackbar = () => {
    setShow(false);
  };



  const {
    wifiList,
    selectedWifi,
    scanWifiNetworks,
    setSelectedWifi,
    connectToWifi,
  } = useWifiManager();

  //Wifi permission//





  //Wifi permission//

  const onSSIDChange = itemValue => {
    setSelectedSSID(itemValue);
  };



  const open = () => {
    if (pickerRef.current) {
      pickerRef.current.focus();
    }
  };

  function close() {
    if (pickerRef.current) {
      pickerRef.current.blur();
    }
  }

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };



  //Wifi Level //
  const SignalLevel = ({ level }) => {
    if (level >= -30) {
      return <Icon name="signal-wifi-4-bar" size={24} color="green" />;
    } else if (level >= -51) {
      return <Icon name="network-wifi-3-bar" size={24} color="yellow" />;
    } else if (level >= -61) {
      return <Icon name="network-wifi-2-bar" size={24} color="orange" />;
    } else if (level >= -71) {
      return <Icon name="network-wifi-1-bar" size={24} color="red" />;
    } else {
      return <Icon name="signal-wifi-statusbar-null" size={24} color="gray" />;
    }
  };
  //Wifi Level //

  const PickWifi = e => {
    console.log('EEEEEEE' + e);

    setSelected(e.SSID);
    setSelectedSSISValue(e.SSID);
    setSelectedWifi(e.SSID);

    setVisible(false);
    console.log(e);
  };


  // useEffect(() => {
  //   console.log("Before getSerialNumber");
  //   DeviceInfo.getSerialNumber()
  //     .then((serialNumber) => {
  //       console.log("Serial Number:", serialNumber);
  //     })
  //     .catch((error) => {
  //       console.error("Error retrieving serial number:", error);
  //     });
  //   console.log("After getSerialNumber");
  // }, []);




  useEffect(() => {
    console.log('Wifi', wifiList);

    const ssids = wifiList.map(({ SSID }) => SSID);

    console.log('This ssid', ssids);
  }, []);




  const PassingPage = () => {
    if (selected === null) {
      showSnackbar();

      console.log('Not selected');
    } else {
      setSelectedWifi(selected);
      navigation.navigate('Password', { passing });
    }
  };





  useEffect(() => {

    const PermissionWifi = () => {

      WifiPermission().then((permission) => {
        console.log(permission);
      })
    }


  }, [])




  const SelectionPick = async () => {
    try {
      const permissionGranted = await WifiPermission();

      if (permissionGranted) {

      
      
        setVisible(true);
        console.log("Permission granted");
        scanWifiNetworks()
        // Any other logic you want to execute when permission is granted
      } else {
        // Handle if permission is not granted
        console.log('Wi-Fi permission not granted.');
      }
    } catch (error) {
      console.error('Error checking Wi-Fi permission:', error);
    }
  };

  useEffect(() => {

    const ScanList = async () => {

      const permissionGranted = await WifiPermission();

      if (permissionsGranted) {
        scanWifiNetworks();
      }
    }

    ScanList()

  }, [])


  //  useEffect(()=>{

  //   async function requestBluetoothPermissions() {
  //     try {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH,
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
  //         // Add other Bluetooth-related permissions here
  //       ]);

  //       if (granted['android.permission.BLUETOOTH'] === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('BLUETOOTH permission granted');
  //         // Proceed with Bluetooth operations
  //       } else {
  //         console.log('BLUETOOTH permission denied');
  //       }
  //     } catch (error) {
  //       console.warn('Error requesting permissions:', error);
  //     }
  //   }

  //  },[])




  const navigation = useNavigation();

  const passing = 'ROBO_DE%V*L(+E$C@US';

  useEffect(() => {
    setBid(passing);
  }, []);



  const ReloadNetwork = () => {
    setVisible(true);
    scanWifiNetworks();
  };



  return (
    <View style={styles.MainPage}>
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
        please select wifi network
      </Snackbar>

      <View style={styles.centerBox}>
        <View style={styles.centerBoxout}>
          <Text style={styles.Textstyle}>SSID</Text>
        </View>

        <View style={styles.CenterInput}>
          <View style={styles.InputStyle}>
            <Ripple
              onPress={() => SelectionPick()}
              rippleContainerBorderRadius={5}
              style={styles.OrgInput}>
              {selected === null ? (
                <Text style={styles.InputPlaceholder}>Select any</Text>
              ) : (
                <Text style={styles.InputPlaceholder}>{selected}</Text>
              )}
            </Ripple>

            <View style={styles.IconStyle}>
              <TouchableOpacity onPress={() => SelectionPick()}>
                <Icon name="arrow-drop-down" color="grey" size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => PassingPage()}
            style={styles.ButtonStyle}>
            <Text style={styles.ButtonTextstyle}>ENTER</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={visible} transparent>
        <View style={styles.ModalStyle}>
          <ScrollView>
            {wifiList.map((obj, i) => {
              return (
                <View key={i} style={styles.SsidListStyle}>
                  <Ripple
                    onPress={() => PickWifi(obj)}
                    rippleDuration={1200}
                    rippleOpacity={0.2}
                    rippleColor="#000"
                    style={styles.RippleStyle}>
                    <View style={styles.StyleComponent}>
                      <View style={styles.PositionStyle}>
                        <Text style={styles.SSidText}>{obj.SSID}</Text>
                      </View>

                      <View style={styles.WifiIcon}>
                        <SignalLevel level={obj.level} />
                      </View>
                    </View>
                  </Ripple>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
