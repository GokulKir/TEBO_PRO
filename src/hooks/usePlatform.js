import { Platform, useWindowDimensions } from 'react-native'


const usePlatform = () => {
    const { height, width } = useWindowDimensions()

    const isTablet = width >= 600 && height >= 600; // Customize this threshold based on your requirements



    return {
        isTablet
    }

}

export default usePlatform