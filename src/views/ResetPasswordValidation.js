import React, { useState, useEffect } from 'react'
import { View, Form, Item, Input, Text, Content, Toast, Button, Icon } from 'native-base'
import withAuth from '../redux/hoc/withAuth'
import { ERROR_LABELS } from '../constants/errors'
import layoutStyles from '../styles/layout'
import isEmpty from 'lodash/isEmpty'
import isEmail from 'validator/lib/isEmail'
import { useTranslation } from 'react-i18next'
import AppWrapper from '../components/AppWrapper'

function ResetPasswordValidation({ authActions, auth, navigation }) {
    const I18n = useTranslation()
    const [email, setEmail] = useState('')
    const [errors, setError] = useState([])
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

    const clearErrors = () => {
        if (!isEmpty(errors)) {
            setError([])
        }
    }

    const handleEmailChange = value => {
        if (value) {
            value = value.toLowerCase().trim()
        }
        setEmail(value)
    }

    const handleSubmit = () => {
        const errors = []

        if (!email || !isEmail(email)) {
            errors.push('email')
        }

        if (isEmpty(errors)) {
            authActions.resetPasswordRequest({ email })
            navigation.navigate('ResetPassword')
        } else {
            setError(errors)
        }
    }

    const isEmailError = errors.includes('email')

    return (
        <AppWrapper>
            <Content contentContainerStyle={[layoutStyles.container, layoutStyles.paddingHorizontal]}>
                <View style={[layoutStyles.w100, layoutStyles.alignCenter]}>
                    <View style={layoutStyles.mb24}>
                        <Text>
                            {I18n.t("Enter your email address and we'll send you a verification code to reset your password")}
                        </Text>
                    </View>
                    <Form>
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
                                placeholder={I18n.t('Email')}
                                value={email}
                                onFocus={clearErrors}
                                onChangeText={handleEmailChange}
                            />
                            {isEmailError && (
                                <Icon name='close-circle' />
                            )}
                        </Item>
                    </Form>
                </View>
                <View style={layoutStyles.paddingBottom}>
                    <Button
                        block
                        onPress={handleSubmit}
                    >
                        <Text>
                            {I18n.t('Send verification code')}
                        </Text>
                    </Button>
                </View>
            </Content>
        </AppWrapper>
    )
}


export default withAuth(ResetPasswordValidation)