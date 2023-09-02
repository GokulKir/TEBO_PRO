import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

const Stack = createStackNavigator();


//Asyncstorage module//
import AsyncStorage from '@react-native-async-storage/async-storage';
//Asyncstorage module//


import { isAuthenticatedState } from './src/Recoil/recoilState';
import { useRecoilState } from 'recoil';
import { AppStack , AuthStack } from './src/Stack/NavigationStack';



export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedState);




  React.useEffect(() => {
    checkAuthStatus();
  }, []);


  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };


  return (
    <NavigationContainer>

{isAuthenticated ? 
    <AppStack/>
     : 
     <AuthStack/>
     }
     
    </NavigationContainer>
  );
}
