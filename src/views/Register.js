import React, { useState, useEffect } from 'react'
import { Form, Item, Input, Text, Content, Button, Toast, View, H1, Icon } from 'native-base'
import withAuth from '../redux/hoc/withAuth'
import { ERROR_LABELS } from '../constants/errors'
import isEmpty from 'lodash/isEmpty'
import isEmail from 'validator/lib/isEmail'
import layoutStyles from '../styles/layout'
import { useTranslation } from 'react-i18next'
import { I18nManager } from 'react-native'
import AppWrapper from '../components/AppWrapper'

function Register({ auth, authActions }) {
    const I18n = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setError] = useState([])
    const [isPasswordVisible, setPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const { errorMessage } = auth

    useEffect(() => {
        if (errorMessage) {
            Toast.show({
                text: ERROR_LABELS[errorMessage],
                buttonText: 'ok',
                type: 'danger',
                duration: 3000
            })
        }
    }, [errorMessage])

    const togglePasswordVisible = () => {
        setPasswordVisible(prevState => !prevState)
    }

    const toggleConfirmPasswordVisible = () => {
        setConfirmPasswordVisible(prevState => !prevState)
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

    const handleConfirmPasswordChange = value => {
        if (value) {
            value = value.trim()
        }
        setConfirmPassword(value)
    }

    const handleSubmit = () => {
        const errors = []

        if (!email || !isEmail(email)) {
            errors.push('email')
        }

        if (!password) {
            errors.push('password')
        }

        if (!confirmPassword || password !== confirmPassword) {
            errors.push('confirmPassword')
        }

        if (password.length < 5) {
            errors.push('password')
        }

        if (isEmpty(errors)) {
            authActions.register({ email, password })
        } else {
            setError(errors)
        }
    }

    const isEmailError = errors.includes('email')
    const isPasswordError = errors.includes('password')
    const isConfirmPasswordError = errors.includes('confirmPassword')

    return (
        <AppWrapper>
            <Content contentContainerStyle={[layoutStyles.center, layoutStyles.paddingHorizontal]}>
                <View style={layoutStyles.container}>
                    <View >
                    </View>
                    <Form>
                        <H1>
                            {I18n.t('Welcome')}
                        </H1>
                        <Text style={[layoutStyles.mb24, layoutStyles.colorGrey]}>
                            {I18n.t('register to continue')}
                        </Text>
                        <Item
                            last
                            style={layoutStyles.mb12}
                            error={isEmailError}
                            rounded
                        >
                            <Icon
                                active
                                name='mail-outline'
                            />
                            <Input
                                placeholder={I18n.t('Email')}
                                onFocus={clearErrors}
                                value={email}
                                onChangeText={handleEmailChange}
                            />
                            {isEmailError && (
                                <Icon name='close-circle' />
                            )}
                        </Item>
                        <Item
                            last
                            style={layoutStyles.mb12}
                            error={isPasswordError}
                            rounded
                        >
                            <Icon active name='lock-closed-outline' />
                            <Input
                                secureTextEntry={!isPasswordVisible}
                                onFocus={clearErrors}
                                // native-base bug fix
                                style={{ textAlign: I18nManager.isRTL ? 'right' : 'auto' }}
                                value={password}
                                placeholder={I18n.t('Password')}
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
                        <Item
                            last
                            style={layoutStyles.mb12}
                            error={isConfirmPasswordError}
                            rounded
                        >
                            <Icon active name='lock-closed-outline' />
                            <Input
                                secureTextEntry={!isConfirmPasswordVisible}
                                value={confirmPassword}
                                placeholder={I18n.t('Confirm Password')}
                                // native-base bug fix
                                style={{ textAlign: I18nManager.isRTL ? 'right' : 'auto' }}
                                onFocus={clearErrors}
                                onChangeText={handleConfirmPasswordChange}
                            />
                            {isConfirmPasswordError ? (
                                <Icon name='close-circle' />
                            ) : (
                                <Button
                                    onPress={toggleConfirmPasswordVisible}
                                    transparent>
                                    <Icon name='eye-outline' style={layoutStyles.colorGrey} />
                                </Button>
                            )}
                        </Item>
                    </Form>
                    <View style={layoutStyles.paddingBottom}>
                        <Button
                            block
                            onPress={handleSubmit}
                            style={{ marginTop: 25 }}>
                            <Text>
                                {I18n.t('Create Account')}
                            </Text>
                        </Button>
                    </View>
                </View>
            </Content>
        </AppWrapper>
    )
}



export default withAuth(Register)