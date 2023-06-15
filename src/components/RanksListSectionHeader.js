import React from 'react'
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Text, Icon, ListItem, Left, Right, Body, Thumbnail, CheckBox } from 'native-base'
import layoutStyles from '../styles/layout'
import colors from '../styles/colors'
import { useTranslation } from 'react-i18next'
import { checkMulti, addCollapsed, removeCollapsed } from '../redux/actions/rankActions'

function RanksListSectionHeader(props) {
    const I18n = useTranslation()
    const { section, isEditMode, isChecked, navigation, checkMulti, isCollapsed, addCollapsed, removeCollapsed } = props
    const { url, faviconSrc, data, numOfKeywords, diffIndicator } = section


    const onNavigate = () => {
        navigation.navigate('AddRank', { addUrl: url })
    }

    const onCheck = () => {
        checkMulti(data, isChecked)
    }

    const onCollapse = () => {
        const action = isCollapsed ? removeCollapsed : addCollapsed
        action(url)
    }

    return (
        <ListItem
            itemDivider
            key={url}
            style={{ height: 68.5 }}
            last
            icon
        >
            {isEditMode && (
                <CheckBox
                    checked={isChecked}
                    onPress={onCheck}
                    style={{ marginRight: 20 }}
                    color={isChecked ? colors.primary : '#cecece'}
                />
            )}
            <Left>
                {faviconSrc ? (
                    <Thumbnail style={{ width: 21, height: 21 }} source={{ uri: faviconSrc }} />
                ) : (
                    <Icon style={[layoutStyles.colorGrey, { fontSize: 21 }]} name='globe-outline' />
                )}
            </Left>
            <Body>
                <Text style={[layoutStyles.bold700, { textAlign: 'left' }]}>
                    {url}
                </Text>
                <Text note style={{ textAlign: 'left', fontSize: 12 }}>
                    {`${numOfKeywords.toLocaleString()} ${I18n.t('Keywords')}`}
                </Text>
            </Body>
            {Boolean(diffIndicator) && (
                <Right style={{ height: '100%' }}>
                    <Text style={{ color: diffIndicator < 0 ? '#d9534f' : '#5cb85c' }}>
                        {`${diffIndicator < 0 ? '-' : '+'}`}
                        {Math.abs(diffIndicator)}
                    </Text>
                </Right>
            )}
            {!isEditMode && (
                <TouchableOpacity onPress={onCollapse} >
                    <Right>
                        <Icon
                            style={[layoutStyles.colorGrey]}
                            name={`chevron-${isCollapsed ? 'up' : 'down'}-outline`} />
                    </Right>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onNavigate} >
                <Right style={{ marginRight: -11 }}>
                    <Icon
                        style={[layoutStyles.colorGrey, { fontSize: 25 }]}
                        active
                        name='add-outline' />
                </Right>
            </TouchableOpacity>
        </ListItem>
    )
}

const mapStateToProps = (state, props) => {
    const { ranks } = state
    const { isEditMode, checkList, collapsed } = ranks
    const { section } = props
    const { data, url } = section

    return {
        isEditMode,
        isChecked: data.every(item => checkList.includes(item.key)),
        isCollapsed: collapsed.includes(url)
    }
}

const mapDispatchToProps = dispatch => ({
    checkMulti: (data, isChecked) => dispatch(checkMulti(data, isChecked)),
    addCollapsed: payload => dispatch(addCollapsed(payload)),
    removeCollapsed: payload => dispatch(removeCollapsed(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RanksListSectionHeader)
