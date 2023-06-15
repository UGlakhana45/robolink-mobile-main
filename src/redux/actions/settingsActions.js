import { SETTINGS } from '../types'
import axios from 'axios'
import I18n from '../../languages/i18n'

const setLoading = payload => dispatch => {
    dispatch({
        type: SETTINGS.SET_SETTINGS_LOADING,
        payload
    })
}


export const setSettings = () => async dispatch => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.get('/users/settings')

        const { language } = I18n

        if (data.language !== language) {
            dispatch(updateSettings({ language }))
        }

        dispatch({
            type: SETTINGS.SET_SETTINGS,
            payload: data
        })
    } catch (error) {
        console.error(error.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const updateSettings = payload => async dispatch => {
    try {
        const { data } = await axios.put('/users/settings', payload)

        dispatch({
            type: SETTINGS.UPDATE_SETTINGS,
            payload: data
        })
    } catch (error) {
        console.error(error.message)
    }
}

