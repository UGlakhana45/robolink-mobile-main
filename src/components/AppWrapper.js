import React from 'react'
import { StatusBar } from 'react-native'
import color from 'color'
import colors from '../styles/colors'
import { isAndroid } from '../utils/global'

function AppWrapper({ children }) {
    return (
        <>
            <StatusBar
                backgroundColor={isAndroid ? color(colors.primary).darken(0.2).hex() : colors.primary}
                barStyle='light-content' />
            {children}
        </>
    )
}

export default AppWrapper