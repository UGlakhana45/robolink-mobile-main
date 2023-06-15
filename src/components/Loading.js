import React from 'react'
import { Spinner, Content } from 'native-base'

function Loading() {
    return (
        <Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: '100%', with: '100%' }}>
            <Spinner />
        </Content>
    )
}

export default Loading
