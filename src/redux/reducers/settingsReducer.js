import { SETTINGS } from '../types'

const initialState = {
    isFetching: false,
    initialized: false,
    data: {
        isNotificationsEnabled: null,
        isEmailWeeklySummaryEnabled: null,
        isBackgroundScanEnabled: null,
        backgroundScanTime: null,
        lastBackgroundScan: null,
        scanMaxRank: null,
    }
}

export default (state = initialState, action) => {
    const { payload } = action

    switch (action.type) {
        case SETTINGS.SET_SETTINGS:
            return {
                ...state,
                initialized: true,
                data: {
                    ...state.data,
                    ...payload
                }
            }
        case SETTINGS.UPDATE_SETTINGS:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...payload
                }
            }
        default:
            return state
    }
}