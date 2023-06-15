import React, { useState, useEffect } from 'react'
import { View, Form, Item, Input, Text, Content, Toast, Button, Icon } from 'native-base'
import withAuth from '../redux/hoc/withAuth'
import { ERROR_LABELS } from '../constants/errors'
import layoutStyles from '../styles/layout'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { I18nManager } from 'react-native'
import AppWrapper from '../components/AppWrapper'

function ResetPassword({ authActions, auth }) {
    const I18n = useTranslation()
    const [verificationCode, setVerificationCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setError] = useState([])

    const { errorMessage, email } = auth

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

    const clearErrors = () => {
        if (!isEmpty(errors)) {
            setError([])
        }
    }

    const handleVerificationCodeChange = value => {
        if (value) {
            value = value.trim()
        }
        setVerificationCode(value)
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

    const handleSubmit = (e) => {
        const errors = []

        if (!verificationCode) {
            errors.push('verificationCode')
        }

        if (!password) {
            errors.push('password')
        }

        if (!confirmPassword || confirmPassword !== password) {
            errors.push('confirmPassword')
        }

        if (isEmpty(errors)) {
            authActions.resetPassword({ email, password, verificationCode })
        } else {
            setError(errors)
        }
    }

    const isVerificationCodeError = errors.includes('verificationCode')
    const isPasswordError = errors.includes('password')
    const isConfirmPasswordError = errors.includes('confirmPassword')

    return (
        <AppWrapper>
            <Content contentContainerStyle={[layoutStyles.center, layoutStyles.paddingHorizontal]}>
                <View style={layoutStyles.w100}>
                    <View style={layoutStyles.mb24}>
                        <Text>
                            {I18n.t('Verification code has been sent to')}
                        </Text>
                        <Text style={layoutStyles.bold700}>
                            {email}
                        </Text>
                    </View>
                    <Form>
                        <Item
                            last
                            rounded
                            style={layoutStyles.mb12}
                            error={isVerificationCodeError}
                        >
                            <Icon active name='chatbox-ellipses-outline' />
                            <Input
                                placeholder={I18n.t('Verification Code')}
                                value={verificationCode}
                                onFocus={clearErrors}
                                onChangeText={handleVerificationCodeChange}
                            />

                            {isVerificationCodeError && (
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
                                placeholder={I18n.t('New Password')}
                                style={{ textAlign: I18nManager.isRTL ? 'right' : 'auto' }}
                                secureTextEntry
                                value={password}
                                onFocus={clearErrors}
                                onChangeText={handlePasswordChange}
                            />
                            {isPasswordError && (
                                <Icon name='close-circle' />
                            )}
                        </Item>
                        <Item
                            last
                            rounded
                            style={layoutStyles.mb12}
                            error={isConfirmPasswordError}
                        >
                            <Icon active name='lock-closed-outline' />
                            <Input
                                placeholder={I18n.t('Confirm Password')}
                                style={{ textAlign: I18nManager.isRTL ? 'right' : 'auto' }}
                                secureTextEntry
                                value={confirmPassword}
                                onFocus={clearErrors}
                                onChangeText={handleConfirmPasswordChange}
                            />
                            {isConfirmPasswordError && (
                                <Icon name='close-circle' />
                            )}
                        </Item>
                    </Form>
                    <View style={layoutStyles.paddingBottom}>
                        <Button
                            block
                            onPress={handleSubmit}
                        >
                            <Text>
                                {I18n.t('Reset Password')}
                            </Text>
                        </Button>
                    </View>
                </View>
            </Content>
        </AppWrapper>
    )
}

export default withAuth(ResetPassword)