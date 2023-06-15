import { AUTH } from '../types'

const initialState = {
    id: null,
    isAuthenticated: false,
    username: null,
    isVerified: false,
    isPasswordReset: false,
    email: null,
    isLoading: false,
    errorMessage: null,
    token: null
}

export default (state = initialState, action) => {
    const { payload } = action

    switch (action.type) {
        case AUTH.SET_USER:
            return {
                ...state,
                isAuthenticated: true,
                errorMessage: null,
                ...payload
            }
        case AUTH.LOGOUT:
            return {
                ...state,
                ...initialState
            }
        case AUTH.SET_AUTH_LOADING:
            return {
                ...state,
                isLoading: payload
            }
        case AUTH.SET_ERROR:
            return {
                ...state,
                errorMessage: payload
            }
        case AUTH.SET_PASSWORD_RESET:
            return {
                ...state,
                email: payload.email,
                isPasswordReset: payload.isPasswordReset,
                errorMessage: null
            }
        default:
            return state
    }
}