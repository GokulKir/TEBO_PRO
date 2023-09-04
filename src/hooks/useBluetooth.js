import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { useRecoilState } from 'recoil';
import { ConnectionAlready, scanningCondition } from '../Recoil/recoilState';
import { Alert } from 'react-native';




const useBleManager = () => {
  const navigation = useNavigation()
  const [bleManager, setBleManager] = useState(new BleManager());
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [loadign , setLoading] = useState(false) ; 
  const [allDevices , setAllDevices] = useState([])
  const [scanningif , setScanningIf] = useRecoilState(scanningCondition)
  const [alreadyConnection , setAllReadyConnection] = useRecoilState(ConnectionAlready)

  const startScanning = () => {
    const scannedDevices = [];
  
  
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning:', error);
        return;
      }
  
      if (device) {
        console.log(
          'Scanning devices: ' +
            'Device serviceUUID ' +
            device.serviceUUIDs +
            'Device name: ' +
            device.name +
            'Device ID: ' +
            device.id
        );
  
        // Check if the device has a name and is not already in the scannedDevices array
        if (device.name && !scannedDevices.some((d) => d.id === device.id)) {
          scannedDevices.push({ id: device.id, name: device.name , serviceUUID : device.serviceUUIDs , characteristicUUID : device.serviceData});
          setAllDevices(scannedDevices);  
          setScanningIf(true)
          // You can map or use the scanned device data here
          console.log('Mapped Device:', device.name);

  
          // Optionally, stop scanning if you have found the desired device
          if (device.name === 'YourDeviceName') {
            bleManager.stopDeviceScan();
            console.log('Stopped scanning.');
          }
        }
      }
    });

  };
  
  const connectToDevice = async (deviceId) => {
    try {
      console.log("Connecting to device:", deviceId);
  
      // Attempt to connect to the Bluetooth device
      const device = await bleManager.connectToDevice(deviceId);
  
      // Check if the device is not already in the connectedDevices list
      if (!connectedDevices.some(dev => dev.id === deviceId)) {
        // Add the connected device to the list of connected devices
        setConnectedDevices([...connectedDevices, device]);
        console.log('Device connected:', device.name);
      } else {
        console.log('Device is already connected:', device.name);
        setAllReadyConnection(true)
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const listConnectedDevices = () => {
    console.log('Connected devices:', connectedDevices);
  };

  useEffect(() => {
    return () => {
      // Clean up resources when the component unmounts
      bleManager.destroy();
    };
  }, []);



  const sendDataToDevice = async (deviceId, serviceUUID, characteristicUUID, data) => {
    const device = connectedDevices.find(dev => dev.id === deviceId);
    console.log(device);

    if (device) {
      const service = await device.discoverAllServicesAndCharacteristics();
      const characteristic = service.characteristics.find(
        char => char.uuid === characteristicUUID
      );

      if (characteristic) {
        await characteristic.writeWithResponse(data);
        navigation.navigate('Checking')
        console.log('Data sent successfully:', data);

      } else {
        console.error('Characteristic not found.');
      }
    } else {
      console.error('Device not found.');
    }
  };

  return {
    startScanning,
    connectToDevice,
    listConnectedDevices,
    sendDataToDevice,
    connectedDevices,
    allDevices
    
  };
};

export default useBleManager;
