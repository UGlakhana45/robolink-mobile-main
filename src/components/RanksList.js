import React, { useEffect, useRef, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Alert, RefreshControl } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { useTranslation } from 'react-i18next'
import findIndex from 'lodash/findIndex'
import RanksListItem from './RanksListItem'
import RankListHiddenItem from './RankListHiddenItem'
import RanksListSectionHeader from './RanksListSectionHeader'
import { mapDispatchToProps } from '../redux/hoc/withRanks'
import isEmpty from 'lodash/isEmpty'
import { clone } from '../utils/global'


let isScrolling = false
let viewableItems = []

function RanksList(props) {
    const {
        aggregatedData,
        isRefreshing,
        rankActions,
        navigation,
        scrapingId,
    } = props

    const I18n = useTranslation()
    const listViewRef = useRef(null)

    useEffect(() => {
        if (scrapingId) {
            scrollToIndex(scrapingId)
        }
    }, [scrapingId])

    const scrollToIndex = id => {
        if (id && !isScrolling && viewableItems.length) {
            const viewableItem = viewableItems.find(item => item.key === id)

            if (isEmpty(viewableItem)) {
                const items = aggregatedData.reduce((acc, item) => acc.concat(item.data), [])
                const itemIndex = findIndex(items, item => item.key === id)
                if (itemIndex > -1) {
                    listViewRef.current.scrollToLocation({ itemIndex })
                }
            }
        }
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow()
        }
    }

    const updateRank = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey)
        const { _id, url, keyword, faviconSrc } = rowMap[rowKey].props.item
        rankActions.updateRank({ _id, url, keyword, faviconSrc })
    }

    const deleteRow = (rowMap, rowKey) => {
        const rowData = rowMap[rowKey].props.item
        const { keyword } = rowData

        Alert.alert(
            `${I18n.t('Are you sure you want to delete')} ${I18n.t('keyword')}: ${keyword} ?`,
            I18n.t('This will delete the entire history of a keyword.'),
            [
                {
                    text: I18n.t('Cancel'),
                    style: 'cancel',
                    onPress: () => closeRow(rowMap, rowKey)
                },
                {
                    text: I18n.t('Yes'),
                    onPress: () => {
                        closeRow(rowMap, rowKey)
                        rankActions.deleteRank(rowData)
                    }
                }
            ]
        )
    }

    const onScrollBeginDrag = useCallback(() => {
        if (!isScrolling) {
            isScrolling = true
        }
    }, [])

    const onScrollEndDrag = useCallback(() => {
        if (isScrolling) {
            isScrolling = false
        }
    }, [])

    const onScrollToIndexFailed = useCallback(() => { }, [])

    const renderItem = props => (
        <RanksListItem
            {...props}
            navigation={navigation}
            I18n={I18n}
        />
    )

    const renderHiddenItem = (data, rowMap) => (
        <RankListHiddenItem
            rowMap={rowMap}
            data={data}
            deleteRow={deleteRow}
            updateRank={updateRank}
        />
    )

    const renderSectionHeader = props => (
        <RanksListSectionHeader
            {...props}
            navigation={navigation}
        />
    )

    const onViewableItemsChanged = useCallback((props) => {
        viewableItems = props.viewableItems
    }, [])

    return (
        <SwipeListView
            useSectionList
            removeClippedSubviews
            sections={aggregatedData}
            listViewRef={listViewRef}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            renderItem={renderItem}
            onScrollToIndexFailed={onScrollToIndexFailed}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
            renderHiddenItem={renderHiddenItem}
            renderSectionHeader={renderSectionHeader}
            leftOpenValue={75}
            rightOpenValue={-75}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            refreshControl={
                !scrapingId && (
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => rankActions.refreshRanks()}
                    />
                )
            }
        />
    )
}

const mapStateToProps = state => {
    const { ranks } = state
    let { status, isRefreshing, aggregatedData, collapsed } = ranks

    if (collapsed.length) {
        aggregatedData = clone(aggregatedData).map(item => {
            if (collapsed.includes(item.url)) {
                item.data = []
            }

            return item
        })
    }

    return {
        aggregatedData,
        isRefreshing,
        scrapingId: status.payloadId,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RanksList)