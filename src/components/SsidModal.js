import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import useStyle from '../hooks/useStyle';
import {Modal} from 'react-native-paper';
import {useRecoilState, useRecoilValue} from 'recoil';
import {Visible} from '../data/Recoil/atom';

export default function SsidModal() {
  const visible = useRecoilValue(Visible);
  const {ModalComponent} = useStyle();

  styles = ModalComponent;

  useEffect(() => {
    console.log('Value visible: ', visible);
  }, []);

  return (
    <View style={styles.container}>
      <Modal visible={visible} transparent>
        <View style={{width: 100, height: 100, backgroundColor: 'red'}}></View>
      </Modal>
    </View>
  );
}
