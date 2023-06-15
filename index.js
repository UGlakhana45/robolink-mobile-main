import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { initNotifications } from './src/notifications'
import './src/languages/i18n'

initNotifications()
AppRegistry.registerComponent(appName, () => App)
