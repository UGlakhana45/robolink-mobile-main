import React, { useState } from 'react'
import AppWrapper from '../components/AppWrapper'
import layoutStyles from '../styles/layout'
import { Form, Item, Label, Input, Text, Content, Button, View, Textarea, Toast, Icon } from 'native-base'
import { useTranslation } from 'react-i18next'
import isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import Loading from '../components/Loading'
import { networkError } from '../utils/error'
import colors from '../styles/colors'

function Contact() {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setError] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isSent, setSent] = useState(false)
    const I18n = useTranslation()

    const clearErrors = () => {
        if (!isEmpty(errors)) {
            setError({})
        }
    }

    const sendMessage = async () => {
        try {
            setLoading(true)
            const body = {
                message: message.trim(),
                subject: subject.trim()
            }

            const { data } = await axios.post('/users/contact', body)
            if (data.success) {
                setSent(true)
            }
        } catch (error) {
            if (error.message === 'Network Error') {
                networkError()
            } else {
                Toast.show({
                    text: 'Error',
                    buttonText: I18n.t('Ok'),
                    type: 'danger',
                    duration: 3000
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = () => {
        const errors = {}

        if (!message.trim()) {
            errors.message = I18n.t('Required field')
        }

        if (message.length > 1000) {
            errors.message = I18n.t('Too long message')
        }

        if (subject.length > 100) {
            errors.subject = I18n.t('Too long message')
        }

        if (isEmpty(errors)) {
            sendMessage()
        } else {
            setError(errors)
            Toast.show({
                text: Object.values(errors)[0],
                buttonText: I18n.t('Ok'),
                type: 'danger',
                duration: 3000
            })
        }
    }

    if (isSent) {
        return (
            <SuccessSentScreen />
        )
    }

    return (
        <AppWrapper>
            {isLoading ? (
                <Loading />
            ) : (
                <Content contentContainerStyle={[layoutStyles.container, layoutStyles.paddingHorizontal]}>
                    <View style={[layoutStyles.w100, layoutStyles.alignCenter]}>
                        <Form>
                            <Label style={layoutStyles.mb12}>
                                <Text>{I18n.t('Subject')}</Text>
                            </Label>
                            <Item
                                last
                                rounded
                                error={Boolean(errors.subject)}
                                style={layoutStyles.mb12}>
                                <Input
                                    onChangeText={setSubject}
                                    onFocus={clearErrors}
                                    value={subject}
                                />
                            </Item>
                            <Label style={layoutStyles.mb12}>
                                <Text>
                                    {`${I18n.t('Message')}`}
                                </Text>
                            </Label>
                            <Item
                                last
                                rounded
                                error={Boolean(errors.message)} >
                                <Textarea
                                    rowSpan={5}
                                    value={message}
                                    onFocus={clearErrors}
                                    onChangeText={setMessage} />
                            </Item>
                        </Form>
                    </View>
                    <View style={layoutStyles.paddingBottom}>
                        <Button
                            block
                            onPress={handleSubmit}
                            iconRight
                            style={{ marginTop: 25 }}>
                            <Text>
                                {I18n.t('Send')}
                            </Text>
                        </Button>
                    </View>
                </Content>
            )}
        </AppWrapper>
    )
}

function SuccessSentScreen() {
    return (
        <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: '100%', with: '100%' }}>
            <Icon name='checkmark-circle-outline' style={{ fontSize: 90, color: colors.primary }} />
            <Text>The message has been sent successfully</Text>
        </Content>
    )
}

export default Contact
