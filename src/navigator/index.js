import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from 'react-native'
import { mapStateToProps } from '../redux/hoc/withAuth'
import { mapDispatchToProps } from '../redux/hoc/withSystem'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import NetInfo from '@react-native-community/netinfo'
import AppSidebar from '../components/AppSidebar'

// views
import Loading from '../views/Loading'
import AppStack from './AppStack'

const Drawer = createDrawerNavigator()

function Navigator(props) {
    const { auth, systemActions } = props
    const { isLoading } = auth
    const { setAppState, setNetwork } = systemActions

    useEffect(() => {
        AppState.addEventListener('change', setAppState)
        const unsubscribe = NetInfo.addEventListener(state => {
            const { type, isConnected } = state
            setNetwork({ type, isConnected })
        })

        return () => {
            AppState.removeEventListener('change', setAppState)
            unsubscribe()
        }
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={props => <AppSidebar {...props} />} >
                <Drawer.Screen
                    name='AppStack'
                    options={{ swipeEnabled: false }}
                    component={AppStack} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(Navigator)
