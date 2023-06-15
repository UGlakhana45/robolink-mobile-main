import random from 'lodash/random'
import { Platform } from 'react-native'

export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'

export const getHostname = url => {
    if (!url) {
        return url
    }

    let hostname
    url = url.trim()
    url = url.toLowerCase()

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2]
    } else {
        hostname = url.split('/')[0]
    }

    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]
    hostname = hostname.replace('www.', '')

    return hostname
}

export const sleep = ms => new Promise((resolve) => {
    setTimeout(() => resolve(), (ms))
})

export const randomSleep = async (start, end) => {
    await sleep(random(start, end))
}

export const clone = data => {
    if (!data) return data
    return JSON.parse(JSON.stringify(data))
}