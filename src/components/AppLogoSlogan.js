import React from 'react'
import { Image } from 'react-native'
import { useTranslation } from 'react-i18next'

function AppLogoSlogan({ fadeDuration = 0, width = 300 }) {
    const { i18n } = useTranslation()
    let source

    switch (i18n.language) {
        case 'he':
            source = 'https://robolink-space.fra1.digitaloceanspaces.com/media/logo-slogan-he.png'
            break
        default:
            source = 'https://robolink-space.fra1.digitaloceanspaces.com/media/logo-slogan-en.png'
            break
    }

    return (
        <Image
            fadeDuration={fadeDuration}
            source={{ uri: source }}
            style={{ resizeMode: 'contain', width, height: 90 }}
        />
    )
}

export default AppLogoSlogan
