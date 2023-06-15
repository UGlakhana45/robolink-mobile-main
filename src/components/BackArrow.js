import React from 'react'
import { I18nManager } from 'react-native'
import { Button, Icon } from 'native-base'

function BackArrow(props) {
    return (
        <Button {...props}>
            <Icon name={I18nManager.isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'} />
        </Button>
    )
}

export default BackArrow
