import React, { useEffect, useState } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';

const useBle = () => {
  const [devices, setDevices] = useState([]);
  const bleManager = new BleManager();

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const permissions = await requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT
        ]);

        if (
          permissions[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted' &&
          permissions[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === 'granted'
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

    const startScanning = () => {
      const subscription = bleManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
            console.log("Scanning device", scannedDevice);
            if (error) {
              console.error('Scan error:', error);
              return;
            }
            if (!devices.some((device) => device.id === scannedDevice.id)) {
              setDevices((prevDevices) => [...prevDevices, scannedDevice]);
            }
          });
        }
      }, true);

      return () => {
        subscription.remove();
        bleManager.stopDeviceScan();
      };
    };

    requestPermissions();
    return () => {
      bleManager.destroy();
    };
  }, []);

  return devices;
};

export default useBle;
