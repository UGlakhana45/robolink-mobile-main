import React from 'react'
import { Alert } from 'react-native'
import { Content, List, ListItem, Text, Icon, View, Thumbnail, Body } from 'native-base'
import { useTranslation } from 'react-i18next'
import withAuth from '../redux/hoc/withAuth'
import layoutStyles from '../styles/layout'
import packageJson from '../../package.json'
const { version } = packageJson

function AppSidebar({ auth, authActions, navigation }) {
    const { username, email } = auth
    const I18n = useTranslation()

    const handleLogout = () => {
        Alert.alert(
            I18n.t('Logout'),
            I18n.t('Do you want to logout?'),
            [
                {
                    text: I18n.t('Cancel'),
                    style: 'cancel'
                },
                {
                    text: I18n.t('Yes'),
                    onPress: () => {
                        authActions.logout()
                    }
                }
            ]
        )
    }

    return (
        <Content contentContainerStyle={layoutStyles.container}>
            <View>
                <List>
                    <ListItem>
                        <View style={layoutStyles.center}>
                            <View style={layoutStyles.mb12}>
                                <Thumbnail large source={{ uri: 'https://robolink-space.fra1.digitaloceanspaces.com/media/logo.png' }} />
                            </View>
                            <View>
                                <Text
                                    style={layoutStyles.bold700}
                                    numberOfLines={1}>
                                    {`${I18n.t('Hello')}, ${username}`}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={layoutStyles.colorGrey}
                                    numberOfLines={1}>
                                    {email}
                                </Text>
                            </View>
                        </View>
                    </ListItem>
                    <ListItem onPress={() => navigation.navigate('Ranks')}>
                        <Icon name='cellular-outline' />
                        <Body>
                            <Text>{I18n.t('My Ranks')}</Text>
                        </Body>
                    </ListItem>
                    <ListItem onPress={() => navigation.navigate('Settings')}>
                        <Icon name='settings-outline' />
                        <Body>
                            <Text>{I18n.t('Settings')}</Text>
                        </Body>
                    </ListItem>
                    <ListItem onPress={() => navigation.navigate('Contact')}>
                        <Icon name='mail-outline' />
                        <Body>
                            <Text>{I18n.t('Contact us')}</Text>
                        </Body>
                    </ListItem>
                    <ListItem last onPress={handleLogout}>
                        <Icon name='log-out-outline' />
                        <Body>
                            <Text>{I18n.t('Logout')}</Text>
                        </Body>
                    </ListItem>
                </List>
            </View>
            <View style={[layoutStyles.paddingBottom, { alignItems: 'center' }]}>
                <Text note>{version}</Text>
            </View>
        </Content >
    )
}

export default withAuth(AppSidebar)
