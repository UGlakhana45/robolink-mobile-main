import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'react-native-localize'
import { I18nManager } from 'react-native'
import RNRestart from 'react-native-restart'
import AsyncStorage from '@react-native-async-storage/async-storage'
import STORAGE_KEYS from '../constants/storage'
import he from './he.json'
import en from './en.json'
import languages from './index'

const restartApp = async () => {
    RNRestart.Restart()
}

const languageDetector = {
    type: 'languageDetector',
    async: true,
    init: () => { },
    cacheUserLanguage: () => { },
    detect: async callback => {
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.APP_LANGUAGE)
        const locales = getLocales()
        const locale = locales[0]
        let language = locale.languageCode

        if (storedLanguage) {
            language = storedLanguage
        } else {
            const isSupported = languages.some(item => item.code === language)

            if (!isSupported) {
                language = 'en'
            }
        }

        const supportedLanguage = languages.find(item => item.code === language)

        if (I18nManager.isRTL !== supportedLanguage.isRTL) {
            I18nManager.allowRTL(supportedLanguage.isRTL)
            I18nManager.forceRTL(supportedLanguage.isRTL)
            restartApp()
        }

        return callback(language)
    }
}

i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            he,
            en
        },
        react: {
            useSuspense: false
        },
        interpolation: {
            escapeValue: false
        },
        debug: __DEV__,
    })

export default i18next