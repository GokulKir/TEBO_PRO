import React from 'react';
import { createStackNavigator , CardStyleInterpolators } from '@react-navigation/stack';

import SsidTyping from '../pages/SsidTyping';
import PasswordTyping from '../pages/PasswordTyping';
import VideoCallScreen from '../pages/VideoStream';
import ApiCheckingpage from '../pages/ApiCheckingpage';
import UniqidTyping from '../pages/UniqidTyping';
import Header from '../components/Header';
import BluetoothList from '../pages/BluetoothList';


const Stack = createStackNavigator();



export const AuthStack = () => (

    <Stack.Navigator>
  <Stack.Screen
          name="Ssid"
          component={SsidTyping}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },

            headerTitle: props => <Header {...props} />,
            headerStyle: {backgroundColor: '#fff'},
          }}
        />

        <Stack.Screen
          name="Password"
          component={PasswordTyping}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },

            headerTitle: props => <Header {...props} />,
            headerStyle: {backgroundColor: '#fff'},
          }}
        />

<Stack.Screen
          name="Checking"
          component={ApiCheckingpage}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },
          headerShown : false
           
          }}
        />



<Stack.Screen
          name="BLELIST"
          component={BluetoothList}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },

            headerTitle: props => <Header {...props} />,
            headerStyle: {backgroundColor: '#fff'},
          }}
        />


<Stack.Screen
          name="UID"
          component={UniqidTyping}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },

        
          }}
        />
        <Stack.Screen
          name="ApiCheck"
          component={ApiCheckingpage}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },
            headerShown: false,
            headerTitle: props => <Header {...props} />,
            headerStyle: {backgroundColor: '#fff'},
          }}
        />

<Stack.Screen
          name="Stream"
          component={VideoCallScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },
            headerShown: false,
          }}
        />
    </Stack.Navigator>



)


export const AppStack = () => (
    

    <Stack.Navigator>

<Stack.Screen
          name="Checking"
          component={ApiCheckingpage}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },
          headerShown : false
           
          }}
        />


<Stack.Screen
          name="UID"
          component={UniqidTyping}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },

            headerTitle: props => <Header {...props} />,
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
        <Stack.Screen
          name="ApiCheck"
          component={ApiCheckingpage}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },
            headerShown: false,
         
          }}
        />

<Stack.Screen
          name="Stream"
          component={VideoCallScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },
            headerShown: false,
          }}
        />


    </Stack.Navigator>
)
