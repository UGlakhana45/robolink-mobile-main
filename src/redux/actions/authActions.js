import axios from 'axios'
import { AUTH } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PushNotification from 'react-native-push-notification'
import { setRanks } from './rankActions'
import { setSettings } from './settingsActions'
import STORAGE_KEYS from '../../constants/storage'
import { REGISTRATION_METHODS } from '../../constants/auth'
import { networkError } from '../../utils/error'
import { isAndroid } from '../../utils/global'
import { ignoreBatteryOptimizationRequest } from '../../job'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const setLoading = payload => dispatch => {
    dispatch({
        type: AUTH.SET_AUTH_LOADING,
        payload
    })
}

const setUser = data => dispatch => {
    const { id, token, email, username, isVerified, registrationMethod } = data

    const payload = {
        id,
        email,
        username,
        isVerified,
        registrationMethod
    }

    if (token) {
        axios.defaults.headers.common['Authorization'] = token
        payload.token = token
    }

    dispatch(setRanks())
    dispatch(setSettings())

    dispatch({
        type: AUTH.SET_USER,
        payload
    })

    if (isAndroid) {
        ignoreBatteryOptimizationRequest()
        PushNotification.subscribeToTopic(id)
    }
}

export const setError = payload => dispatch => {
    dispatch({
        type: AUTH.SET_ERROR,
        payload
    })
}

export const authorize = () => async dispatch => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)

    try {
        if (token) {
            dispatch(setLoading(true))
            const { data } = await axios({
                url: '/users/authorize',
                headers: {
                    Authorization: token
                }
            })

            dispatch(setUser(data))

        }
    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN)
        }
    } finally {
        if (token) {
            dispatch(setLoading(false))
        }
    }
}

export const login = payload => async dispatch => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.post('/users/login', payload)
        const { token } = data

        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token)

        dispatch(setUser(data))
    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const googleLogin = payload => async dispatch => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.post('/users/login/google', payload)
        const { token } = data

        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token)

        dispatch(setUser(data))
    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const logout = () => async (dispatch, getState) => {

    try {
        const { auth } = getState()
        const { registrationMethod } = auth

        if (registrationMethod === REGISTRATION_METHODS.GOOGLE) {
            await GoogleSignin.signOut()
        }

        PushNotification.unsubscribeFromTopic(auth.id)

        dispatch(setLoading(true))

        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN)

        dispatch({ type: AUTH.LOGOUT })

    } catch (error) {
        dispatch(setError(error.message))
    } finally {
        dispatch(setLoading(false))
    }
}

export const register = payload => async dispatch => {
    try {
        dispatch(setLoading(true))

        const { data } = await axios.post('/users/register', payload)
        const { token } = data

        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token)

        dispatch(setUser(data))
    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const verify = payload => async dispatch => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.post('/users/verification', { verificationCode: payload })

        dispatch(setUser(data))
    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const sendEmailVerification = payload => async dispatch => {
    try {
        dispatch(setLoading(true))
        await axios.get('/users/verification')

    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}


export const resetPasswordRequest = ({ email }) => async dispatch => {
    try {
        dispatch(setLoading(true))

        await axios.get(`/users/reset-password/${email}`)

        dispatch({
            type: AUTH.SET_PASSWORD_RESET,
            payload: {
                email,
                isPasswordReset: true
            }
        })

    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const resetPassword = (payload) => async dispatch => {
    try {
        dispatch(setLoading(true))

        await axios.post(`/users/reset-password`, payload)

        dispatch({
            type: AUTH.SET_PASSWORD_RESET,
            payload: {
                email: payload.email,
                isPasswordReset: false
            }
        })

    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}

export const deleteAccount = () => async dispatch => {
    try {
        dispatch(setLoading(true))

        await axios.delete(`/users`)

        dispatch(logout())
    } catch (error) {
        if (error.message === 'Network Error') {
            networkError()
        } else {
            dispatch(setError(error.response.data))
        }
    } finally {
        dispatch(setLoading(false))
    }
}