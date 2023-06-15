import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { View, Icon } from 'native-base'
import layoutStyles from '../styles/layout'

function RankListHiddenItem(props) {
    const { updateRank, deleteRow, data, rowMap } = props

    const onUpdate = () => {
        updateRank(rowMap, data.item.key)
    }

    const onDelete = () => {
        deleteRow(rowMap, data.item.key)
    }

    return (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[layoutStyles.backgroundPrimary, styles.backRightBtn]}
                onPress={onUpdate}
            >
                <Icon style={[layoutStyles.colorWhite]} name='refresh-outline' />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={onDelete}
            >
                <Icon style={[layoutStyles.colorWhite]} name='trash-outline' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#ff3333',
        right: 0,
    },
})

export default RankListHiddenItem
