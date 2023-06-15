import axios from 'axios'
import { RANK } from '../types'
import { sleep } from '../../utils/global'
import { getRank, getArggregated, getIsBlocked } from '../../utils/rank'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PushNotification from 'react-native-push-notification'
import BackgroundService from 'react-native-background-actions'
import { networkError, disableWifiRequestError, tooManyRequestsError, blockError, inProgressError, sendError } from '../../utils/error'
import colors from '../../styles/colors'
import { ERRORS } from '../../constants/errors'
import STORAGE_KEYS from '../../constants/storage'
import { BACKGROUND_SCAN_MODE } from '../../constants/settings'
import keyBy from 'lodash/keyBy'
import isEmpty from 'lodash/isEmpty'
import { updateSettings } from '../actions/settingsActions'
import moment from 'moment'
import I18n from '../../languages/i18n'
import store from '../index'

export const startBackground = async (payload, isJob) => {
    if (BackgroundService.isRunning()) {
        return
    }

    if (!isJob) {
        store.dispatch(setScrapingStatus({ isScraping: true }))
    }

    await BackgroundService.start(scrapeRanks, {
        taskName: `t${moment().format('X')}`,
        taskTitle: I18n.t('Updating Ranks'),
        taskDesc: 'in progress',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        linkingURI: 'robolink://',
        color: colors.primary,
        parameters: {
            payload,
            isJob
        }
    })
}

export const setEditMode = payload => dispatch => {
    dispatch({
        type: RANK.SET_RANKS_EDIT_MODE,
        payload: Boolean(payload)
    })
}

export const setCheckList = payload => dispatch => {
    dispatch({
        type: RANK.SET_RANKS_CHECK_LIST,
        payload
    })
}

export const addCheck = payload => dispatch => {
    dispatch({
        type: RANK.ADD_RANKS_CHECK_LIST,
        payload
    })
}

export const checkMulti = (data, isChecked) => (dispatch, getState) => {
    const { ranks } = getState()
    const { checkList } = ranks

    let newCheckList

    if (isChecked) {
        const checkedKeys = data.map(item => item.key)
        newCheckList = checkList.filter(item => !checkedKeys.includes(item))
    } else {
        const checks = data.reduce((acc, item) => {
            if (!checkList.includes(item.key)) {
                acc.push(item.key)
            }
            return acc
        }, [])

        newCheckList = checkList.concat(checks)
    }

    dispatch(setCheckList(newCheckList))
}

export const removeCheck = payload => dispatch => {
    dispatch({
        type: RANK.DELETE_RANKS_CHECK_LIST,
        payload
    })
}

export const addCollapsed = payload => (dispatch, getState) => {
    const { ranks: { collapsed } } = getState()
    AsyncStorage.setItem(STORAGE_KEYS.COLLAPSED_RANKS, JSON.stringify(collapsed.concat(payload)))
    dispatch({
        type: RANK.ADD_RANKS_COLLAPSE,
        payload
    })
}

export const removeCollapsed = payload => (dispatch, getState) => {
    const { ranks: { collapsed } } = getState()
    AsyncStorage.setItem(STORAGE_KEYS.COLLAPSED_RANKS, JSON.stringify(collapsed.filter(item => item !== payload)))

    dispatch({
        type: RANK.DELETE_RANKS_COLLAPSE,
        payload
    })
}

export const setCollapsed = () => async dispatch => {
    const payload = await AsyncStorage.getItem(STORAGE_KEYS.COLLAPSED_RANKS)

    if (payload) {
        dispatch({
            type: RANK.SET_RANKS_COLLAPSE,
            payload: JSON.parse(payload)
        })
    }
}

const resetCollapsed = () => dispatch => {
    dispatch({
        type: RANK.SET_RANKS_COLLAPSE,
        payload: []
    })
}

export const setScrapingStatus = (payload = '') => dispatch => {
    dispatch({
        type: RANK.SET_SCRAPING_STATUS,
        payload
    })
}

export const resetScrapingStatus = () => dispatch => {
    dispatch({ type: RANK.RESET_SCRAPING_STATUS })
}

const setLoading = payload => dispatch => {
    dispatch({
        type: RANK.SET_RANKS_LOADING,
        payload
    })
}

const setRefreshing = payload => dispatch => {
    dispatch({
        type: RANK.SET_RANKS_REFRESH,
        payload
    })
}

export const updateRanks = (list = []) => async (dispatch, getState) => {
    try {
        const { ranks } = getState()
        const { status } = ranks
        const { isScraping, blockEndTimestamp } = status

        if (blockEndTimestamp) {
            blockError(blockEndTimestamp)
            return
        }

        if (isScraping) {
            inProgressError()
            return
        }

        let payload = Array.from(ranks.data)

        if (!isEmpty(list)) {
            payload = payload.filter(item => list.includes(item._id))
        }


        const aggregated = getArggregated(payload)
        const toScan = aggregated.reduce((acc, item) => acc.concat(item.data), [])

        if (toScan.length) {
            startBackground(toScan)
        }

    } catch (error) {
        const { message } = error

        if (message === ERRORS.NETWORK) {
            networkError()
        }
    }
}

export const updateRank = (payload = {}) => async (dispatch, getState) => {
    try {
        const { ranks } = getState()
        const { status } = ranks
        const { isScraping, blockEndTimestamp } = status

        if (blockEndTimestamp) {
            blockError(blockEndTimestamp)
            return
        }

        if (isScraping) {
            inProgressError()
            return
        }

        startBackground([payload])
    } catch (error) {
        const { message } = error

        if (message === ERRORS.NETWORK) {
            networkError()
        }
    }
}

export const addRanks = (payload = []) => async (dispatch, getState) => {
    try {
        const { ranks } = getState()
        const { status } = ranks
        const { isScraping, blockEndTimestamp } = status

        if (blockEndTimestamp) {
            blockError(blockEndTimestamp)
            return
        }

        if (isScraping) {
            inProgressError()
            return
        }

        dispatch(setLoading(true))

        const { data } = await axios.post('/ranks', payload)

        dispatch({
            type: RANK.ADD_RANKS,
            payload: data
        })

        startBackground(data)

    } catch (error) {
        const { message } = error

        if (message === ERRORS.NETWORK) {
            networkError()
        }
    } finally {
        dispatch(setLoading(false))
    }
}

const initRanksStatus = () => async dispatch => {
    const blockEndTimestamp = await AsyncStorage.getItem(STORAGE_KEYS.BLOCK_END_TIMESTAMP)
    const isBlocked = getIsBlocked(blockEndTimestamp)

    if (isBlocked) {
        dispatch(setScrapingStatus({ blockEndTimestamp }))
    } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.BLOCK_END_TIMESTAMP)
    }
}

export const setRanks = () => async dispatch => {
    try {
        dispatch(setLoading(true))
        const { data = [] } = await axios.get('/ranks')

        dispatch({
            type: RANK.SET_RANKS,
            payload: data
        })

        dispatch(initRanksStatus())
    } catch (error) {
        const { message } = error

        if (message === ERRORS.NETWORK) {
            networkError()
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const refreshRanks = () => async (dispatch, getState) => {
    try {
        const { ranks } = getState()
        if (ranks.status.isScraping) return

        dispatch(setRefreshing(true))

        const { data = [] } = await axios.get('/ranks')

        dispatch({
            type: RANK.SET_RANKS,
            payload: data
        })

        dispatch(initRanksStatus())

    } catch (error) {
        const { message } = error

        if (message === ERRORS.NETWORK) {
            networkError()
        }
    } finally {
        dispatch(setRefreshing(false))
    }
}

export const deleteRank = payload => async dispatch => {
    try {
        dispatch({
            type: RANK.DELETE_RANK,
            payload
        })

        await axios.delete('/ranks/keyword', { data: payload })
    } catch (error) {
        const { message } = error

        if (message === ERRORS.NETWORK) {
            networkError()
        }
    } finally {
        dispatch(resetCollapsed())
    }
}

export const deleteRanks = (payload = []) => async (dispatch, getState) => {
    try {
        const { ranks } = getState()
        dispatch(setLoading(true))

        const data = ranks.data.reduce((acc, item) => {
            const { _id, url, keyword } = item

            if (payload.includes(_id)) {
                acc.push({ url, keyword, _id })
            }

            return acc
        }, [])

        await axios.delete('/ranks/keywords', { data })

        dispatch(refreshRanks())

    } catch (error) {
        const { message } = error

        if (message === ERRORS.NETWORK) {
            networkError()
        }
    } finally {
        dispatch(setLoading(false))
        dispatch(resetCollapsed())
    }
}

export const scrapeRanks = async ({ payload, isJob }) => {
    if (isJob) {
        await sleep(2500)
    }

    const { dispatch, getState } = store
    try {
        const { settings, ranks } = getState()
        const { isNotificationsEnabled, scanMaxRank, backgroundLastScanIndex = 0, backgroundScanMode } = settings.data
        const { blockEndTimestamp } = ranks.status
        const initialIndex = isJob ? Number(backgroundLastScanIndex) : 0

        if (blockEndTimestamp) {
            await BackgroundService.stop()
            return
        }

        if (isJob || !payload || !payload.length) {
            dispatch(setScrapingStatus({ isScraping: true }))
            payload = ranks.aggregatedData.reduce((acc, item) => acc.concat(item.data), [])
        }

        const toUpdate = payload.map((item, index) => ({ ...item, isPending: index >= initialIndex }))

        dispatch({
            type: RANK.UPDATE_RANKS,
            payload: keyBy(toUpdate, item => item._id)
        })

        for (let index = initialIndex; index < payload.length; index++) {
            const item = payload[index]
            const { url, keyword, _id, faviconSrc, title, description } = item

            dispatch({
                type: RANK.UPDATE_RANK,
                payload: { ...item, isLoading: true, isPending: false }
            })

            dispatch(setScrapingStatus({
                url,
                keyword,
                payloadIndex: index + 1,
                payloadId: _id,
                payloadLength: payload.length,
                pageIndex: null,
                waitSeconds: null,
            }))

            dispatch(updateSettings({
                backgroundScanTickDate: new Date(),
                backgroundLastScanIndex: index,
            }))

            BackgroundService.updateNotification({
                taskDesc: `${index + 1}/${payload.length}`,
                progressBar: {
                    max: payload.length,
                    value: index + 1,
                    indeterminate: false
                }
            })

            if (index) {
                const waitSeconds = scanMaxRank > 50 ? 10 : 5
                for (let i = waitSeconds; i > 0; i--) {
                    dispatch(setScrapingStatus({ waitSeconds: i }))
                    await sleep(900)
                }
            }

            const { rank, pageIndex, refererUrl, error } = await getRank(item, scanMaxRank, dispatch)

            if (error) {
                throw new Error(error)
            }

            item.rank = rank
            item.isLoading = false
            item.createdAt = new Date()
            item.pageIndex = pageIndex
            item.refererUrl = refererUrl
            item.title = title
            item.description = description
            item.faviconSrc = faviconSrc

            dispatch({
                type: RANK.UPDATE_RANK,
                payload: item
            })

            await axios.post('/ranks', {
                url,
                keyword,
                rank,
                pageIndex,
                refererUrl,
                faviconSrc,
                title,
                description
            })
        }

        const settingsParams = {
            backgroundLastScanIndex: 0,
            backgroundScanMode: BACKGROUND_SCAN_MODE.AUTO
        }

        if (isJob && backgroundScanMode === BACKGROUND_SCAN_MODE.AUTO) {
            settingsParams.backgroundScanDate = new Date()
        }

        dispatch(updateSettings(settingsParams))

        if (isNotificationsEnabled) {
            PushNotification.localNotification({
                channelId: "update_ranks_complete",
                message: "Update Ranks Complete",
            })
        }
    } catch (error) {
        const { message } = error
        const { system } = getState()
        const { isWifi, isConnected } = system.network

        if (message === ERRORS.NETWORK || !isConnected) {
            networkError()
        } else if (message == ERRORS.TOO_MANY_REQUESTS && isWifi && isConnected) {
            disableWifiRequestError()
        } else if (message === ERRORS.TOO_MANY_REQUESTS && !isWifi && isConnected) {
            await tooManyRequestsError()
        } else {
            sendError({
                title: 'scrapeRanks',
                message
            })
        }
    } finally {
        dispatch(resetScrapingStatus())
        dispatch(refreshRanks())

        await sleep(500)
        await BackgroundService.stop()
    }
}