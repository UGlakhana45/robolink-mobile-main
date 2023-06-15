import PushNotification from 'react-native-push-notification'
import { JOB_UPDATE_RANKS } from '../constants/job'
import { sendError } from '../utils/error'
import { startBackground } from '../redux/actions/rankActions'

const onNotification = async (notification) => {
    try {
        const { data = {} } = notification
        const { key } = data

        switch (key) {
            case JOB_UPDATE_RANKS:
                startBackground(null, true)
                break
            default:
                break
        }

    } catch (error) {
        sendError({
            title: 'onNotification',
            message: error.message
        })
    } finally {
        notification.finish()
    }
}

export const initNotifications = () => {
    PushNotification.configure({
        onNotification,
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
    })

    PushNotification.createChannel({
        channelId: 'update_ranks_complete',
        channelName: 'Update Ranks Complete',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: false,
    })
}