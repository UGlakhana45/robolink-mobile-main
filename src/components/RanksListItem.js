import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, Spinner, Icon, ListItem, Right, Body, CheckBox } from 'native-base'
import { mapDispatchToProps } from '../redux/hoc/withRanks'
import { TouchableHighlight } from 'react-native'
import layoutStyles from '../styles/layout'
import colors from '../styles/colors'

class RanksListItem extends Component {

    shouldComponentUpdate(nextProps) {
        const { isEditMode, isChecked, item } = this.props

        return (
            (isEditMode !== nextProps.isEditMode) ||
            (isChecked !== nextProps.isChecked) ||
            (item.isPending !== nextProps.item.isPending) ||
            (item.isLoading !== nextProps.item.isLoading)
        )
    }

    handleCheck = () => {
        const { rankActions, isChecked, isEditMode, item, navigation } = this.props

        if (!isEditMode) {
            navigation.navigate('RankHistory', item)
        } else {
            const { key } = item
            const { addCheck, removeCheck } = rankActions
            const action = isChecked ? removeCheck : addCheck

            action(key)
        }
    }

    handleLongPress = () => {
        const { isEditMode, item, rankActions } = this.props
        if (isEditMode) return
        const { key } = item
        const { addCheck, setEditMode } = rankActions
        addCheck(key)
        setEditMode(true)
    }

    render() {
        const { item, index, section, isChecked, I18n, isEditMode } = this.props
        const { keyword, updatedAt, isLoading, isPending, prevDiffRank, key } = item
        const rank = item.rank > 0 ? item.rank : '-'
        let diff

        if (prevDiffRank && prevDiffRank.rank > 0 && item.rank > 0) {
            diff = prevDiffRank.rank - item.rank
            if (!diff) diff = null
        }

        const rankStyle = {}

        if (isPending) {
            rankStyle.color = 'lightgrey'
        }

        return (
            <TouchableHighlight
                key={key}
                style={layoutStyles.backgroundWhite}>
                <ListItem
                    first={index === 0}
                    onLongPress={this.handleLongPress}
                    onPress={this.handleCheck}
                    delayLongPress={1000}
                    last={index === section.data.length - 1}
                >
                    {isEditMode && (
                        <CheckBox
                            checked={isChecked}
                            onPress={this.handleCheck}
                            color={isChecked ? colors.primary : '#cecece'}
                        />
                    )}
                    <Body>
                        <Text style={{ textAlign: 'left' }}>{keyword}</Text>
                        <Text style={{ fontSize: 12, textAlign: 'left' }} note>
                            {`${I18n.t('Updated')}: ${updatedAt}`}
                        </Text>
                    </Body>
                    <Right style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {diff && (
                            <Icon
                                name={`caret-${diff < 0 ? 'down' : 'up'}-outline`}
                                style={{
                                    fontSize: 14,
                                    color: diff < 0 ? '#d9534f' : '#5cb85c',
                                    marginRight: 5
                                }} />
                        )}
                        <Text style={rankStyle}>
                            {isLoading ? (
                                <Spinner style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], width: 10, height: 10 }} />
                            ) : rank}
                        </Text>
                    </Right>
                </ListItem>
            </TouchableHighlight>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { ranks } = state
    const { item } = props
    const { isEditMode, checkList } = ranks
    const isChecked = checkList.includes(item.key)

    return {
        isEditMode,
        isChecked,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RanksListItem)