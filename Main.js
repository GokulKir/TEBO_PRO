import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PaperProvider } from 'react-native-paper';
import App from './App'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { SocketProvider } from './src/context/SocketContext';


export default function Main() {
  return (
 
    <PaperProvider>
    <RecoilRoot>
      <SocketProvider>
        <App />
      </SocketProvider>
    </RecoilRoot>
  </PaperProvider>

    
  )
}

