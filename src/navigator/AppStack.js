import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../redux/hoc/withAuth'
import { createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import colors from '../styles/colors'

// views
import Ranks from '../views/Ranks'
import Login from '../views/Login'
import Register from '../views/Register'
import RegisterVerification from '../views/RegisterVerification'
import Loading from '../views/Loading'
import ResetPasswordValidation from '../views/ResetPasswordValidation'
import ResetPassword from '../views/ResetPassword'
import AddRank from '../views/AddRank'
import RankHistory from '../views/RankHistory'
import Settings from '../views/Settings'
import Contact from '../views/Contact'


const Stack = createStackNavigator()

function AppStack({ auth }) {
    const I18n = useTranslation()
    const { isAuthenticated, isVerified, isPasswordReset } = auth
    const isPrivateRoute = isAuthenticated && isVerified

    const headerStyles = {
        headerStyle: {
            backgroundColor: colors.primary,
        },
        headerTitleStyle: {
            fontSize: 16
        },
        headerTintColor: colors.white,
    }

    return (
        <Stack.Navigator
            screenOptions={{ headerBackTitleVisible: false }}
        >
            {isPasswordReset && (
                <Stack.Screen
                    name='ResetPassword'
                    options={{
                        title: I18n.t('Reset Password'),
                        ...headerStyles
                    }}
                    component={ResetPassword} />
            )}

            {!isAuthenticated && (
                <>
                    <Stack.Screen
                        name='Login'
                        component={Login}
                        options={{
                            headerShown: false,
                            title: I18n.t('Login')
                        }}
                    />
                    <Stack.Screen
                        name='Register'
                        options={{
                            title: I18n.t('Create Account'),
                            ...headerStyles
                        }}
                        component={Register} />
                </>
            )}

            {isAuthenticated && !isVerified && (
                <Stack.Screen
                    name='RegisterVerification'
                    options={{
                        title: I18n.t('Email Verification'),
                        headerLeft: null,
                        ...headerStyles
                    }}
                    component={RegisterVerification} />
            )}

            {isPrivateRoute && (
                <>
                    <Stack.Screen
                        name='Ranks'
                        options={{
                            title: I18n.t('My Ranks'),
                            ...headerStyles
                        }}
                        component={Ranks} />
                    <Stack.Screen
                        name='AddRank'
                        options={{
                            title: I18n.t('Add New URL'),
                            ...headerStyles
                        }}
                        component={AddRank} />
                    <Stack.Screen
                        name='RankHistory'
                        options={headerStyles}
                        component={RankHistory} />
                    <Stack.Screen
                        name='Settings'
                        options={{
                            title: I18n.t('Settings'),
                            ...headerStyles
                        }}
                        component={Settings} />
                    <Stack.Screen
                        name='Contact'
                        options={{
                            title: I18n.t('Contact us'),
                            ...headerStyles
                        }}
                        component={Contact} />
                </>
            )}

            <Stack.Screen
                name='Loading'
                options={{ headerShown: false }}
                component={Loading} />
            <Stack.Screen
                name='ResetPasswordValidation'
                options={{
                    title: I18n.t('Reset Password'),
                    ...headerStyles
                }}
                component={ResetPasswordValidation} />
        </Stack.Navigator>
    )
}

export default connect(mapStateToProps)(AppStack)
