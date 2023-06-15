import { SYSTEM } from '../types'
import { refreshRanks } from './rankActions'

export const setAppState = payload => (dispatch, getState) => {
    const { ranks } = getState()
    if (!ranks.status.isScraping && payload === 'active') {
        dispatch(refreshRanks())
    }

    dispatch({
        type: SYSTEM.SET_APP_STATE,
        payload
    })
}

export const setNetwork = payload => dispatch => {
    const { type, isConnected } = payload
    dispatch({
        type: SYSTEM.SET_NETWORK,
        payload: {
            ...payload,
            isWifi: isConnected && type === 'wifi'
        }
    })
}