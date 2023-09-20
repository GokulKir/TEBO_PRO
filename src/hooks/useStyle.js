import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import usePlatform from './usePlatform';
import Ripple from 'react-native-material-ripple';
import { create } from 'react-test-renderer';

const useStyle = () => {
  const {isTablet} = usePlatform();

  useEffect(() => {
    if (isTablet) {
      console.log('This is a tablet');
    } else {
      console.log('This is a mobile device');
    }
  });

  const HeaderStyle = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-around',
    },
    Fullspace: {
      flexDirection: 'row',
      flex: 1,
    },
    LogoSize: {
      width: responsiveWidth(19),
      height: responsiveHeight(5),
      top: 0,
      left: 5,
    },

    backButtonStyle: {
      width: 50,
      height: 50,
      top: 3,
    },
  });

  const BottomPage = StyleSheet.create({
    MainPage: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerBox: {
      width: isTablet ? responsiveWidth(25) : responsiveWidth(30),
      height: isTablet ? responsiveHeight(24) : responsiveHeight(35),
      elevation: 10,
      backgroundColor: '#fff',
      borderRadius: 20,
    },

    CetnerIdBoxout : {
      alignItems:'center' ,
      marginTop:20
      
    },

    centerBoxout: {
      width: responsiveWidth(20),
      height: responsiveHeight(5),
      marginLeft: isTablet ? responsiveWidth(2.5) : responsiveHeight(4.5),
      marginTop: responsiveHeight(3),
    },
    Textstyle: {
      color: '#000',
      fontStyle: 'italic',
    },
    CenterInput: {
      alignItems: 'center',
    },

    CenterCode : {

      alignItems:'center' ,
      marginTop:30

    },
    UIDStyle : {

      color:'grey' ,
      fontStyle:'italic',
      fontFamily:'Helvetica'



    },

    rowcomplete: {
      flexDirection: 'row',
    },

    InputStyle: {
      width: isTablet ? responsiveWidth(20) : responsiveWidth(25),
      height: isTablet ? responsiveHeight(5) : responsiveHeight(8),
      backgroundColor: '#fff',
      elevation: 5,
      borderRadius: 5,
      flexDirection: 'row',
      marginTop: isTablet ? null : responsiveHeight(2.5),
    },
    OrgInput: {
      width: '80%',
      height: '100%',
      borderRadius: 5,
      color: '#000',
      fontSize: 10,
      left: 10,
    },
    IconStyle: {
      left: 10,
    },
    ButtonStyle: {
      width: isTablet ? responsiveWidth(8) : responsiveWidth(12),
      height: isTablet ? responsiveHeight(5.4) : responsiveHeight(8),
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginLeft: isTablet ? 29 : 20,
      marginTop: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ButtonTextstyle: {
      color: '#000',
      fontSize: 13,
    },
    IconSt: {
      top: 5,
      left: 15,
    },
    InputPlaceholder: {
      color: 'grey',
      fontSize: 11,
      top: 6,
      left: 6,
    },
    ModalStyle: {
      width: responsiveWidth(40),
      height: responsiveHeight(50),
      backgroundColor: '#fff',
      alignSelf: 'center',
      elevation: 5,
      borderRadius: 5,
    },
    SsidListStyle: {
      width: '100%',
      height: responsiveWidth(5),
      padding: 3,
    },
    RippleStyle: {
      width: ' 100%',
      height: '100%',
    },
    StyleComponent: {
      flexDirection: 'row',
    },
    PositionStyle: {
      width: '70%',
      height: 60,
      backgroundColor: '#fff',
    },
    SSidText: {
      marginTop: 20,
      marginLeft: 5,
      color: '#000',
      fontStyle: 'italic',
    },
    WifiIcon: {
      marginTop: 15,
      marginLeft: 65,
    },
    UIDModal: {
      width: isTablet ? responsiveWidth(35) : responsiveWidth(45),
      height: isTablet ? responsiveHeight(35) : responsiveHeight(45),
      elevation: 5,
      backgroundColor: '#fff',
      alignSelf: 'center',
      borderRadius: 5,
    },

    centerBoxText: {
      alignItems: 'center',
      marginTop: 30,
    },
    PopUpText: {
      color: '#000',
      marginTop: 40,
      fontStyle: 'italic',
    },
    ModalButtonView: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 60,
    },
    ModalButton: {
      width: isTablet ? responsiveWidth(12) : responsiveWidth(12),
      height: isTablet ? responsiveHeight(8) : responsiveHeight(8),
      backgroundColor: 'green',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },

    ModalButtonRed: {
      width: isTablet ? responsiveWidth(12) : responsiveWidth(12),
      height: isTablet ? responsiveHeight(8) : responsiveHeight(8),
      backgroundColor: 'red',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const ModalComponent = StyleSheet.create({
    cotainer: {
      flex: 1,
    },
  });

  const ApiStyle = StyleSheet.create({
    container : {
      flex : 1 ,
      alignItems:'center' ,
      justifyContent:'center'
   


    } ,
    ModalStyle :{
      width : 250 ,
      height : 200 ,
      backgroundColor:'#fff' ,
      elevation : 5 ,
      alignSelf:'center' ,
      borderRadius:5
    } ,
    Textdetail : {
      color : "#000" ,
      alignSelf:'center' ,
      top:-30 ,
      left:5
      
    } ,




    
  })


  const VideoStyle = StyleSheet.create({

    container : {
      flex : 1 ,
      backgroundColor:'#000'
    }


      
  })

  return {
    HeaderStyle,
    BottomPage,
    ModalComponent,
    ApiStyle,
    VideoStyle
  };
};

export default useStyle;
