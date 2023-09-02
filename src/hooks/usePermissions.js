import {PermissionsAndroid} from 'react-native';
import useWifiManager from './useWifi';




const usePermissions = () => {


  const {
    wifiList,
    selectedWifi,
    scanWifiNetworks,
    setSelectedWifi,
    connectToWifi,
  } = useWifiManager();
  


  const WifiPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permition granted');
      scanWifiNetworks()
    } else {
      console.log('Permition denied');
    }
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  async function requestBluetoothPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Bluetooth permission is required for WiFi connections',
          message:
            'This app needs bluetooth permission as this is required  ' +
            'to scan for wifi networks.',
          buttonNegative: 'DENY',
          buttonPositive: 'ALLOW',
        },
      ]);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Bluetooth permissions granted');
        // Initialize and use the BLE manager here
      } else {
        console.log('Bluetooth permissions denied');
        // Handle the case where permissions are denied
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return {
    WifiPermission,
    requestBluetoothPermissions,
  };
};

export default usePermissions;
