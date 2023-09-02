import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import useStyle from '../hooks/useStyle';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/Octicons';
import Ripple from 'react-native-material-ripple';
import {Backid} from '../data/Recoil/atom';
import {useRecoilValue} from 'recoil';

export default function Header() {
  const {HeaderStyle} = useStyle();
  const backID = useRecoilValue(Backid);
  const BackValue = 'ROBO_DE%V*L(+E$C@US';

  useEffect(() => {
    if (backID === BackValue) {
      console.log('ID IS CORRECTED');
    }
  });

  const styles = HeaderStyle;

  return (
    <View style={styles.container}>
      <View style={styles.Fullspace}>
        <Image style={styles.LogoSize} source={require('../asset/Robo.png')} />
      </View>
    </View>
  );
}
