import React from 'react'
import { connect } from 'react-redux'
import { Text, Icon, ListItem, Body, Right } from 'native-base'
import { useTranslation } from 'react-i18next'

function RanksStatus({ status }) {
    if (!status.isScraping) return null
    const I18n = useTranslation()

    const {
        url,
        keyword,
        pageIndex,
        waitSeconds,
        payloadLength,
        payloadIndex,
    } = status

    let title = url ? url : I18n.t('Update process begins')
    let noteText = I18n.t('in progress')

    if (waitSeconds) {
        noteText = `${I18n.t('Waiting')} ${waitSeconds} ${I18n.t('seconds')}`
    } else if (pageIndex) {
        noteText = `${keyword}: ${I18n.t('Searching on page')} ${pageIndex}`
    }

    return (
        <ListItem itemDivider>
            <Icon name='hourglass-outline' />
            <Body>
                <Text style={{ textAlign: 'left' }}>{title}</Text>
                <Text style={{ textAlign: 'left' }} note>{noteText}</Text>
            </Body>
            <Right>
                {payloadIndex && payloadLength && (
                    <Text>{`(${payloadIndex}/${payloadLength})`}</Text>
                )}
            </Right>
        </ListItem>
    )
}

const mapStateToProps = state => ({
    status: state.ranks.status
})

export default connect(mapStateToProps)(RanksStatus)
