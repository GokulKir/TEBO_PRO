import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { UIDSTORING } from '../Recoil/recoilState'
import DeviceInfo from 'react-native-device-info'
import apiInstance from '../api/apiInstance'
import { io } from 'socket.io-client'

const SocketContext = createContext({ socket: null })
export const useSocket = () => useContext(SocketContext)

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    DeviceInfo.getUniqueId().then(async (uniqueId) => {
      const response = await apiInstance.post('/api/v1/robot-uuid', { device_id: uniqueId, });

      if (response.data) {
        const { data: { robot: { status, uuid } }, message } = response.data;
        setSocket(io('https://tebo.devlacus.com', {
          // transports: ['websocket'],
          query: {
            callerId: uuid
          },
        }))
      }
    });
  }, [])

  return (
    <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
  )
}

export default SocketProvider
