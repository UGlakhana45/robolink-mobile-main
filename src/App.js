import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Platform } from 'react-native'
import 'react-native-gesture-handler'
import { StyleProvider, Root, Container } from 'native-base'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import IdleTimerManager from 'react-native-idle-timer'
import Firebase from '@react-native-firebase/app'
import axios from 'axios'
import store from './redux'
import Navigator from './navigator'
import getTheme from '../native-base-theme/components'
import theme from '../native-base-theme/variables/platform'
import { isAndroid } from './utils/global'
import packageJson from '../package.json'

axios.defaults.baseURL = __DEV__ && isAndroid ? 'http://10.0.2.2:5000' : 'https://robolink-j5fkx.ondigitalocean.app'
axios.defaults.headers.common['platform'] = Platform.OS
axios.defaults.headers.common['version'] = packageJson.version

const App = () => {
  useEffect(() => {
    IdleTimerManager.setIdleTimerDisabled(true)
    Firebase.initializeApp()
    GoogleSignin.configure({
      androidClientId: '775507999554-mbrlhf41ijjb2npf9ogontdmejp6up6c.apps.googleusercontent.com',
      iosClientId: '775507999554-v8naqfllmsg1dlq1i4ab18o14icsqjmk.apps.googleusercontent.com',
      webClientId: '775507999554-3l59rg77nc32d3gm2ca9sev0hud1nv16.apps.googleusercontent.com'
    })
  })

  return (
    <Provider store={store}>
      <StyleProvider style={getTheme(theme)}>
        <Root>
          <Container>
            <Navigator />
          </Container>
        </Root>
      </StyleProvider>
    </Provider>
  )
}

export default App
