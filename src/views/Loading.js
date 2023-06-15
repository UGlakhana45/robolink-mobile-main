import React from 'react'
import { Content } from 'native-base'
import AppLogoSlogan from '../components/AppLogoSlogan'

function Loading() {
    return (
        <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: '100%', with: '100%' }}>
            <AppLogoSlogan fadeDuration={500} width={300} />
        </Content>
    )
}

export default Loading
