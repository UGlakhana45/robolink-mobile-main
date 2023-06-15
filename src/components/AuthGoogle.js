import React from 'react'
import { Button, Text, Thumbnail } from 'native-base'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { useTranslation } from 'react-i18next'

function AuthGoogle({ style = {}, authActions }) {
    const I18n = useTranslation()

    const onPress = () => {
        async function signIn() {
            try {
                await GoogleSignin.hasPlayServices()
                const userInfo = await GoogleSignin.signIn()

                const { user, idToken } = userInfo
                const { email, name, photo } = user

                authActions.googleLogin({
                    email,
                    idToken,
                    username: name,
                    avatarSrc: photo
                })

            } catch (error) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    alert('Google sign In operation is in process')
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    alert('Play Services not available')
                } else {
                    alert('Something unknown went wrong with Google sign in. ' + error.message)
                }
            }
        }

        signIn()
    }


    return (
        <Button
            block
            bordered
            style={style}
            onPress={onPress}>
            <Thumbnail style={{ width: 25, height: 25 }} source={{ uri: 'https://robolink-space.fra1.digitaloceanspaces.com/media/google-logo.png' }} />
            <Text>
                {I18n.t('Login with Google')}
            </Text>
        </Button>
    )
}

export default AuthGoogle
