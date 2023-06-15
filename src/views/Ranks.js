import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import RanksList from '../components/RanksList'
import RanksStatus from '../components/RanksStatus'
import RanksBlockStatus from '../components/RanksBlockStatus'
import Loading from './Loading'
import { Button, Icon } from 'native-base'
import { TouchableOpacity } from 'react-native'
import AppWrapper from '../components/AppWrapper'
import layoutStyles from '../styles/layout'
import RanksHeader from '../components/RanksHeader'

function Ranks({ navigation, isLoading, blockEndTimestamp }) {

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button transparent>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon style={layoutStyles.colorWhite} name='menu-outline' />
                    </TouchableOpacity>
                </Button>
            ),
            headerRight: () => <RanksHeader navigation={navigation} />
        })
    }, [navigation])

    return (
        <AppWrapper>
            <RanksStatus />
            {blockEndTimestamp && (
                <RanksBlockStatus />
            )}
            {isLoading ? (
                <Loading />
            ) : (
                <RanksList navigation={navigation} />
            )}
        </AppWrapper>
    )
}

const mapStateToProps = state => ({
    blockEndTimestamp: state.ranks.status.blockEndTimestamp,
    isLoading: state.ranks.isLoading
})

export default connect(mapStateToProps)(Ranks)
