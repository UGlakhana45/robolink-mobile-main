import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../redux/hoc/withRanks'
import { Button, Icon, View, Text } from 'native-base'
import { Alert, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import layoutStyles from '../styles/layout'
import { inProgressError } from '../utils/error'

function RanksHeader(props) {
    const { isEditMode, checkList, navigation, isScraping, rankActions } = props
    const { updateRanks, deleteRanks, setEditMode, setCheckList } = rankActions
    const isCheckListEmpty = checkList.length == 0
    const I18n = useTranslation()

    const onRefreshClick = () => {
        if (isScraping) {
            inProgressError()
        } else {
            updateRanks(checkList)
            handleCloseEditMode()
        }
    }

    const handleCloseEditMode = () => {
        if (!isCheckListEmpty) {
            setCheckList([])
        }
        setEditMode(false)
    }

    const onEditModeClick = () => {
        if (!isScraping) {
            setEditMode(!isEditMode)

            if (!isCheckListEmpty) {
                setCheckList([])
            }
        } else {
            inProgressError()
        }
    }

    const handleDelete = () => {
        Alert.alert(
            `${I18n.t(`Are you sure you want to delete`)}?`,
            I18n.t('This will delete the entire history of a keyword.'),
            [
                {
                    text: I18n.t('Cancel'),
                    style: 'cancel'
                },
                {
                    text: I18n.t('Yes'),
                    onPress: () => {
                        deleteRanks(checkList)
                        setEditMode(false)
                        setCheckList([])
                    }
                },
            ]
        )
    }

    return (
        <View style={{ flexDirection: 'row' }}>
            <Button transparent>
                <TouchableOpacity onPress={onRefreshClick}>
                    <Icon style={layoutStyles.colorWhite} name='refresh-outline' />
                </TouchableOpacity>
            </Button>
            <Button transparent>
                <TouchableOpacity onPress={onEditModeClick}>
                    <Icon style={layoutStyles.colorWhite} name='create-outline' />
                </TouchableOpacity>
            </Button>
            <Button transparent>
                {isEditMode ? (
                    <TouchableOpacity disabled={isCheckListEmpty} onPress={handleDelete}>
                        {!isCheckListEmpty && (
                            <View style={layoutStyles.checkListBadge}>
                                <Text style={layoutStyles.checkListBadgeText}>
                                    {checkList.length}
                                </Text>
                            </View>
                        )}
                        <Icon style={{ color: isCheckListEmpty ? '#6794d3' : '#fff' }} name='trash-outline' />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.navigate('AddRank')}>
                        <Icon style={layoutStyles.colorWhite} name='add-outline' />
                    </TouchableOpacity>
                )}
            </Button>
        </View>
    )
}

const mapStateToProps = state => ({
    isScraping: state.ranks.status.isScraping,
    isEditMode: state.ranks.isEditMode,
    checkList: state.ranks.checkList,
})

export default connect(mapStateToProps, mapDispatchToProps)(RanksHeader)
