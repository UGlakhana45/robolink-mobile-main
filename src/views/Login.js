import React, { useState, useEffect } from 'react'
import { View, Form, Item, Input, Text, Content, Toast, Button, Icon, H1 } from 'native-base'
import withAuth from '../redux/hoc/withAuth'
import { ERROR_LABELS } from '../constants/errors'
import layoutStyles from '../styles/layout'
import isEmpty from 'lodash/isEmpty'
import isEmail from 'validator/lib/isEmail'
import { I18nManager } from 'react-native'
import AppLogoSlogan from '../components/AppLogoSlogan'
import { useTranslation } from 'react-i18next'
import AuthGoogle from '../components/AuthGoogle'




function Login({ authActions, auth, navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setError] = useState([])
    const [isPasswordVisible, setPasswordVisible] = useState(false)
    const { t } = useTranslation()
    const { errorMessage } = auth

    useEffect(() => {
        if (errorMessage) {
            Toast.show({
                text: ERROR_LABELS[errorMessage],
                buttonText: t('Ok'),
                type: 'danger',
                duration: 3000
            })
        }
    }, [errorMessage])

    const togglePasswordVisible = () => {
        setPasswordVisible(prevState => !prevState)
    }

    const clearErrors = () => {
        if (!isEmpty(errors)) {
            setError([])
        }
    }

    const handleEmailChange = value => {
        if (value) {
            value = value.trim().toLowerCase()
        }
        setEmail(value)
    }

    const handlePasswordChange = value => {
        if (value) {
            value = value.trim()
        }
        setPassword(value)
    }

    const handleSubmit = () => {
        const errors = []

        if (!email || !isEmail(email)) {
            errors.push('email')
        }

        if (!password) {
            errors.push('password')
        }

        if (isEmpty(errors)) {
            authActions.login({ email, password })
        } else {
            setError(errors)
        }
    }

    const handleRegister = () => {
        navigation.navigate('Register')
    }

    const isEmailError = errors.includes('email')
    const isPasswordError = errors.includes('password')

    return (
        <Content contentContainerStyle={[layoutStyles.center, layoutStyles.paddingHorizontal]}>
            <View style={layoutStyles.container}>
                <View style={[layoutStyles.centeredView, { marginTop: '10%' }]}>
                    <AppLogoSlogan width={260} />
                </View>
                <Form>
                    <H1>
                        {t('Welcome')}
                    </H1>
                    <Text style={[layoutStyles.mb24, layoutStyles.colorGrey]}>
                        {t('login to continue')}
                    </Text>
                    <Item
                        last
                        rounded
                        style={layoutStyles.mb12}
                        error={isEmailError}
                    >
                        <Icon
                            active
                            name='mail-outline'
                        />
                        <Input
                            placeholder={t('Email')}
                            value={email}
                            style={{ textAlign: I18nManager.isRTL ? 'right' : 'auto' }}
                            onFocus={clearErrors}
                            onChangeText={handleEmailChange}
                        />
                        {isEmailError && (
                            <Icon name='close-circle' />
                        )}
                    </Item>
                    <Item
                        last
                        rounded
                        style={layoutStyles.mb12}
                        error={isPasswordError}
                    >
                        <Icon active name='lock-closed-outline' />
                        <Input
                            placeholder={t('Password')}
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            // native-base bug fix
                            style={{ textAlign: I18nManager.isRTL ? 'right' : 'auto' }}
                            onFocus={clearErrors}
                            onChangeText={handlePasswordChange}
                        />
                        {isPasswordError ? (
                            <Icon name='close-circle' />
                        ) : (
                            <Button
                                onPress={togglePasswordVisible}
                                transparent>
                                <Icon name='eye-outline' style={layoutStyles.colorGrey} />
                            </Button>
                        )}
                    </Item>
                    <Button
                        onPress={() => navigation.navigate('ResetPasswordValidation')}
                        transparent>
                        <Text style={layoutStyles.capitalize}>
                            {t('Forgot Password?')}
                        </Text>
                    </Button>
                </Form>
                <View style={layoutStyles.paddingBottom}>
                    <Button
                        block
                        style={layoutStyles.mb12}
                        onPress={handleSubmit}
                    >
                        <Text>
                            {t('Login')}
                        </Text>
                    </Button>
                    <AuthGoogle
                        authActions={authActions}
                        style={layoutStyles.mb12} />
                    <Button
                        block
                        bordered
                        onPress={handleRegister} >
                        <Text>
                            {t('Create Account')}
                        </Text>
                    </Button>
                </View>
            </View>
        </Content>
    )
}

export default withAuth(Login)