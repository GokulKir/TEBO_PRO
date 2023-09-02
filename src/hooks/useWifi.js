import {useEffect, useState} from 'react';
import WifiManager from 'react-native-wifi-reborn';
import {useRecoilValue} from 'recoil';
import {
  SSidconnectionEstablished,
  WifiConnectionEstablished,
} from '../data/Recoil/atom';

const useWifiManager = () => {
  const [wifiList, setWifiList] = useState([]);
  const [connectedWifi, setConnectedWifi] = useState(null);
  const password = useRecoilValue(WifiConnectionEstablished);
  const ssid = useRecoilValue(SSidconnectionEstablished);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const scanWifiNetworks = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();
      setWifiList(wifiArray);
    } catch (error) {
      console.error('Failed to scan WiFi networks:', error);
    }
  };

  const connectToWifi = async password => {
    console.log('))))))))))' + selectedWifi + password);
    try {
      if (!selectedWifi) {
        console.error('Please select a WiFi network.');
        return;
      }

      const isConnected = await WifiManager.connectToProtectedSSID(
        selectedWifi,
        password,
      );
      if (isConnected) {
        console.log('Connected to WiFi successfully.');
        setConnectionStatus('Connected to WiFi successfully.');
      } else {
        console.error('Failed to connect to WiFi.');
        setConnectionStatus('Failed to connect to WiFi.');
      }
    } catch (error) {
      console.error('Failed to connect to WiFi:', error);
      setConnectionStatus('Failed to connect to WiFi.');
    }
  };

  useEffect(() => {
    scanWifiNetworks();
  }, []);

  return {
    wifiList,
    selectedWifi,
    scanWifiNetworks,
    setSelectedWifi,
    connectToWifi,
    connectionStatus,
  };
};

export default useWifiManager;
