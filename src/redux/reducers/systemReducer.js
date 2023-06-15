import { SYSTEM } from '../types'

const initialState = {
    appState: null,
    network: {
        type: null,
        isConnected: null
    }
}

export default (state = initialState, action) => {
    const { payload } = action

    switch (action.type) {
        case SYSTEM.SET_APP_STATE:
            return {
                ...state,
                appState: payload
            }
        case SYSTEM.SET_NETWORK:
            return {
                ...state,
                network: {
                    ...state.network,
                    ...payload
                }
            }
        default:
            return state
    }
}