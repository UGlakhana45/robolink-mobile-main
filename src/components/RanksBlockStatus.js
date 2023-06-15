import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Text, Icon, ListItem, Body, Right } from 'native-base'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { mapDispatchToProps } from '../redux/hoc/withRanks'

function RanksBlockStatus({ blockEndTimestamp, rankActions }) {
    const I18n = useTranslation()
    const [timer, setTimer] = useState()
    const [isStopped, setStop] = useState(false)
    const { setScrapingStatus } = rankActions

    useEffect(() => {
        const blockEnds = moment(blockEndTimestamp, 'X').format('X')
        const interval = setInterval(() => {
            const currentTime = moment().format('X')
            const diff = blockEnds - currentTime
            if (diff && diff < 0) {
                clearInterval(interval)
                setStop(true)
            }

            const duration = moment.duration(diff * 1000, 'milliseconds')
            const blockEndFormatted = duration.hours() + ":" + duration.minutes() + ":" + duration.seconds()

            setTimer(blockEndFormatted)
        }, 1000)

        return () => clearInterval(interval)
    }, [blockEndTimestamp])

    useEffect(() => {
        if (isStopped) {
            setScrapingStatus({ blockEndTimestamp: null })
        }
    }, [isStopped, setScrapingStatus])

    return (
        <ListItem itemDivider>
            <Icon name='time-outline' />
            <Body>
                <Text style={{ textAlign: 'left' }}>{I18n.t('The update will be available in')}</Text>
                <Text style={{ textAlign: 'left' }} note>{I18n.t('We are updating our servers')}</Text>
            </Body>
            <Right>
                <Text>{timer}</Text>
            </Right>
        </ListItem>
    )
}

const mapStateToProps = state => ({
    blockEndTimestamp: state.ranks.status.blockEndTimestamp
})

export default connect(mapStateToProps, mapDispatchToProps)(RanksBlockStatus)
