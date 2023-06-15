import React, { useState, useEffect } from 'react'
import { Form, Item, Label, Input, Text, Content, Button, Toast, View, Icon, Textarea } from 'native-base'
import withRanks from '../redux/hoc/withRanks'
import isURL from 'validator/lib/isURL'
import layoutStyles from '../styles/layout'
import isEmpty from 'lodash/isEmpty'
import { getHostname } from '../utils/global'
import { useTranslation } from 'react-i18next'
import get from 'lodash/get'
import AppWrapper from '../components/AppWrapper'
import moment from 'moment'

function AddRank(props) {
    const [url, setUrl] = useState('')
    const [keywords, setKeywords] = useState('')
    const [errors, setError] = useState({})
    const { rankActions, navigation, route } = props
    const addUrl = get(route, 'params.addUrl')
    const I18n = useTranslation()

    useEffect(() => {
        if (addUrl) {
            setUrl(addUrl)
        }
    }, [addUrl, setUrl])

    const clearErrors = () => {
        if (!isEmpty(errors)) {
            setError({})
        }
    }

    const handleUrlChange = value => {
        if (value) {
            value = value.trim()
        }

        setUrl(value)
    }

    const handleSubmit = () => {
        const errors = {}

        if (!isURL(url)) {
            errors.url = I18n.t('Invalid Url')
        }

        if (!keywords || !keywords.trim()) {
            errors.keywords = I18n.t('Invalid Keyword')
        }

        if (isEmpty(errors)) {
            navigation.navigate('Ranks')
            const hostname = getHostname(url)
            const keywordsArray = getKeywords()
            const payload = keywordsArray.map((keyword, index) => ({
                url: hostname,
                keyword,
                _id: `temp_${index}`,
                createdAt: new Date()
            }))
            rankActions.addRanks(payload)
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

    const getKeywords = () => {
        if (!keywords) return []
        return keywords
            .split('\n')
            .map(item => item.trim())
            .filter(item => item)
    }

    const isUrlError = Boolean(errors.url)
    const isKeywordsError = Boolean(errors.keywords)
    const splittedkeywords = getKeywords()
    const keywordsLength = splittedkeywords.length

    return (
        <AppWrapper>
            <Content contentContainerStyle={[layoutStyles.container, layoutStyles.paddingHorizontal]}>
                <View style={[layoutStyles.w100, layoutStyles.alignCenter]}>
                    <Form>
                        <Label style={layoutStyles.mb12}>
                            <Text>{I18n.t('Website URL')}</Text>
                        </Label>
                        <Item
                            last
                            rounded
                            error={isUrlError}
                            style={layoutStyles.mb12}>
                            <Input
                                onChangeText={handleUrlChange}
                                value={url}
                                onFocus={clearErrors}
                                placeholder='example.com'
                            />
                            {isUrlError && (
                                <Icon name='close-circle' />
                            )}
                        </Item>
                        <Label style={layoutStyles.mb12}>
                            <Text>
                                {`${I18n.t('Keywords')} ${keywordsLength > 0 ? `(${keywordsLength})` : ''}`}
                            </Text>
                        </Label>
                        <Item
                            last
                            rounded
                            error={isKeywordsError} >
                            <Textarea
                                rowSpan={5}
                                value={keywords}
                                onFocus={clearErrors}
                                placeholder={I18n.t('Please separate keywords with enter')}
                                onChangeText={setKeywords} />
                        </Item>
                    </Form>
                </View>
                <View style={layoutStyles.paddingBottom}>
                    <Button
                        block
                        onPress={handleSubmit}
                        style={{ marginTop: 25 }}>
                        <Text>
                            {I18n.t('Add')}
                        </Text>
                    </Button>
                </View>
            </Content>
        </AppWrapper>
    )
}

export default withRanks(AddRank)