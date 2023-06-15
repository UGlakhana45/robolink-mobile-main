import { Platform, Alert } from 'react-native'
import axios from 'axios'
import moment from 'moment'
import packageJson from '../../package.json'
import I18n from '../languages/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import STORAGE_KEYS from '../constants/storage'
import { TIME_FORMAT } from '../constants/moment'

export const sendError = async (payload) => {
    try {
        if (__DEV__) {
            console.error(`${payload.title} - ${payload.message}`)
            return
        }

        payload.platform = Platform.OS
        payload.version = packageJson.version

        await axios.post('/errors', payload)
    } catch (error) {
        console.error(error.message)
    }
}

export const networkError = () => {
    const title = I18n.t('Network connection problem')
    const message = I18n.t('Please check your network connection')

    Alert.alert(title, message, [{ text: I18n.t('Ok') }])
}

export const disableWifiRequestError = () => {
    const title = I18n.t('Something went wrong')
    const message = I18n.t('Please disconnect from the wireless network and try again')

    Alert.alert(title, message, [{ text: I18n.t('Ok') }])
}


export const tooManyRequestsError = async () => {
    try {
        const blockEndTimestamp = moment().add(6, 'hours').format('X')
        const blockEndTime = moment(blockEndTimestamp, 'X').format(TIME_FORMAT)

        const title = `${I18n.t(`Update ranks will be available after`)} ${blockEndTime}`
        const message = I18n.t('We are updating our servers')

        Alert.alert(title, message, [{ text: I18n.t('Ok') }])
        await AsyncStorage.setItem(STORAGE_KEYS.BLOCK_END_TIMESTAMP, blockEndTimestamp)
    } catch (error) {

    }
}

export const blockError = (blockEndTimestamp) => {
    const blockEndTime = moment(blockEndTimestamp, 'X').format(TIME_FORMAT)
    const title = `${I18n.t(`Update ranks will be available after`)} ${blockEndTime}`
    const message = I18n.t('We are updating our servers')

    Alert.alert(title, message, [{ text: I18n.t('Ok') }])
}

export const inProgressError = () => {
    const title = I18n.t(`The ranks update is in progress`)
    const message = I18n.t('We will notify you when the process is complete')

    Alert.alert(title, message, [{ text: I18n.t('Ok') }])
}