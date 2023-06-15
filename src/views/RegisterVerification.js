import React, { useState } from 'react'
import { Content, Text, Form, Item, Toast, Input, Button, View, Icon } from 'native-base'
import withAuth from '../redux/hoc/withAuth'
import layoutStyles from '../styles/layout'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import AppWrapper from '../components/AppWrapper'

function RegisterVerification({ auth, authActions }) {
    const I18n = useTranslation()
    const [verificationCode, setVerificationCode] = useState()
    const [errors, setError] = useState([])
    const { email } = auth

    const handleSubmit = () => {
        const errors = []

        if (!verificationCode) {
            errors.push('verificationCode')
        }

        if (isEmpty(errors)) {
            authActions.verify(verificationCode.trim())
        } else {
            setError(errors)
        }
    }

    const handleLogout = () => {
        authActions.logout()
    }

    const sendEmailVerification = () => {
        authActions.sendEmailVerification()
        Toast.show({
            text: I18n.t('Verification code has been sent'),
            buttonText: I18n.t('Ok'),
            type: 'success',
            duration: 3000
        })
    }


    const isVerificationCodeError = errors.includes('verificationCode')
    return (
        <AppWrapper>
            <Content contentContainerStyle={[layoutStyles.container, layoutStyles.paddingHorizontal]}>
                <View style={[layoutStyles.w100, layoutStyles.alignCenter]}>
                    <Text>
                        {I18n.t('Verification code has been sent to')}
                    </Text>
                    <Text style={[layoutStyles.bold700, layoutStyles.mb24]}>
                        {email}
                    </Text>
                    <Form>
                        <Item
                            last
                            rounded
                            error={isVerificationCodeError}
                        >
                            <Icon active name='chatbox-ellipses-outline' />
                            <Input
                                value={verificationCode}
                                placeholder={I18n.t('Verification Code')}
                                onChangeText={setVerificationCode} />
                            {isVerificationCodeError && (
                                <Icon name='close-circle' />
                            )}
                        </Item>
                        <View style={[layoutStyles.flexRowSpaceBetween, layoutStyles.mb24]}>
                            <Button
                                transparent
                                onPress={sendEmailVerification}
                            >
                                <Text style={layoutStyles.capitalize}>
                                    {I18n.t('Resend Code')}
                                </Text>
                            </Button>
                            <Button
                                onPress={handleLogout}
                                transparent
                            >
                                <Text style={layoutStyles.capitalize}>
                                    {I18n.t('Logout')}
                                </Text>
                            </Button>
                        </View>
                    </Form>
                </View>
                <View style={[layoutStyles.paddingBottom]}>
                    <Button
                        block
                        onPress={handleSubmit} >
                        <Text> {I18n.t('Continue')} </Text>
                    </Button>
                </View>
            </Content>
        </AppWrapper>
    )
}

export default withAuth(RegisterVerification)
