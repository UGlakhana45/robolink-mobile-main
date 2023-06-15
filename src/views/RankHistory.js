import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Content, Picker, Icon, View, Text, H3 } from 'native-base'
import { TIME_FORMAT, DAY_MONTH, MONTH_YEAR, DAY_MONTH_YEAR } from '../constants/moment'
import uniqBy from 'lodash/uniqBy'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import AppWrapper from '../components/AppWrapper'
import colors from '../styles/colors'
import { Chart, Line, HorizontalAxis, VerticalAxis, Tooltip } from 'react-native-responsive-linechart'
import { Dimensions } from 'react-native'
import { clone } from '../utils/global'

const RANGES_LABELS = {
    ALL_TIME: 'All Time',
    LAST_DAY: 'Last Day',
    LAST_WEEK: 'Last Week',
    LAST_MONTH: 'Last Month',
    LAST_YEAR: 'Last Year'
}

const RANGES = [
    {
        key: 'ALL_TIME',
        dateFormat: DAY_MONTH_YEAR,
        label: ''
    },
    {
        key: 'LAST_DAY',
        dateFormat: TIME_FORMAT,
        label: 'day'
    },
    {
        key: 'LAST_WEEK',
        dateFormat: DAY_MONTH,
        label: 'week'
    },
    {
        key: 'LAST_MONTH',
        dateFormat: DAY_MONTH,
        label: 'month'
    },
]

function RankHistory(props) {
    const { route, navigation } = props
    let { data, url, keyword } = route.params
    const [selected, setValue] = useState(RANGES[0])
    const [ranges, setRange] = useState(RANGES)
    const I18n = useTranslation()
    data = data.filter(item => item.rank).sort((a, b) => {
        const date1 = moment(a.createdAt).format('X')
        const date2 = moment(b.createdAt).format('X')

        return date1 - date2
    })

    useEffect(() => {
        navigation.setOptions({
            title: (
                <View>
                    <Text style={{ color: colors.white }}>{url}</Text>
                    <Text style={{ color: colors.white, fontSize: 12 }}>{keyword}</Text>
                </View>
            )
        })
    }, [url, keyword, navigation])

    useEffect(() => {
        const first = data[0]
        const last = data[data.length - 1]
        if (first && last) {
            const isSameYear = moment(first.createdAt).isSame(last.createdAt, 'year')
            if (!isSameYear) {
                setRange(prevState => prevState.concat({
                    key: 'LAST_YEAR',
                    dateFormat: MONTH_YEAR,
                    label: 'year'
                }))
            }
        }
    }, [])

    const getDataset = () => {
        if (!selected) return []
        let result = []

        const { dateFormat, label } = selected

        result = uniqBy(data, item => {
            const { rank, createdAt } = item
            return rank + moment(createdAt).format(dateFormat)
        })

        if (label) {
            result = result.filter(item => moment(item.createdAt).isSame(moment(), label))
        }

        result = result.map(item => ({
            y: -1 * item.rank,
            x: Number(moment(item.createdAt).format('X'))
        }))

        return result
    }

    let dataset = getDataset()
    let min = dataset.reduce((acc, item) => item.y < acc ? item.y : acc, -5)
    let max = dataset.reduce((acc, item) => item.y > acc ? item.y : acc, min)

    if (min === max) {
        max = -1
    }

    if (max < -1) {
        max += 1
    }

    const verticalTickValues = dataset.reduce((acc, item) => {
        if (!acc.includes(item.y)) {
            acc.push(item.y)
        }

        return acc
    }, [])

    let horizontalTickValue = 6

    if (dataset.length === 1) {
        // TODO: improve
        const [item] = clone(dataset)
        item.x = dataset[0].x - 1
        dataset = dataset.concat(item)

        if (!verticalTickValues.includes(-1)) {
            verticalTickValues.push(-1)
        } else {
            verticalTickValues.push(-2)
        }

        horizontalTickValue = 2
    }

    const horizontalFormatter = (meta) => {
        // TODO: improve the format
        return moment(meta, 'X').format('DD/MM')
    }

    return (
        <AppWrapper>
            <Content>
                <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='arrow-down' />}
                    selectedValue={selected}
                    onValueChange={setValue} >
                    {ranges.map(range => (
                        <Picker.Item
                            key={range.key}
                            label={I18n.t(RANGES_LABELS[range.key])}
                            value={range} />
                    ))}
                </Picker>
                {!isEmpty(dataset) && dataset.length > 1 ? (
                    <Chart
                        style={{ height: Dimensions.get('window').height - 155 }}
                        padding={{ left: 40, bottom: 20, right: 20, top: 10 }}
                        yDomain={{ min, max }}
                        data={dataset}
                    >
                        <HorizontalAxis
                            tickCount={horizontalTickValue}
                            theme={{
                                labels: {
                                    formatter: horizontalFormatter,
                                    label: {
                                        color: '#333',
                                        fontSize: 12,
                                        fontWeight: '400',
                                        dy: -18,
                                    }
                                },
                                grid: {
                                    visible: true,
                                    stroke: {
                                        color: '#ccc',
                                        width: 1,
                                        opacity: 0.3,
                                        dashArray: []
                                    },
                                },
                            }}
                        />
                        <VerticalAxis
                            tickValues={verticalTickValues}
                            theme={{
                                labels: {
                                    formatter: (v) => Math.round(-1 * v),
                                    label: {
                                        color: '#333',
                                        fontSize: 12,
                                        fontWeight: '400',
                                        dx: -10,
                                    }
                                },
                                grid: {
                                    visible: true,
                                    stroke: {
                                        color: '#ccc',
                                        width: 1,
                                        opacity: 0.3,
                                        dashArray: []
                                    },
                                },
                            }}
                        />
                        <Line
                            theme={{
                                stroke: {
                                    color: colors.primary,
                                    width: 2
                                },
                                scatter: {
                                    default: {
                                        width: 6,
                                        height: 6,
                                        rx: 4,
                                        color: colors.primary
                                    },
                                    selected: {
                                        width: 6,
                                        height: 6,
                                        rx: 4,
                                        color: colors.primary
                                    }
                                }
                            }}
                            tooltipComponent={
                                <Tooltip
                                    theme={{
                                        formatter: ({ y }) => -1 * y.toFixed(2)
                                    }}
                                />
                            }
                        />

                    </Chart>
                ) : <NoData />}
            </Content>
        </AppWrapper >
    )
}

function NoData() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', height: '100%', width: '100%', alignItems: 'center', marginTop: '50%' }}>
            <Icon style={{ fontSize: 60, color: 'lightgrey' }} name='file-tray-outline' />
            <H3 style={{ color: 'lightgrey', marginTop: 5 }}>No Data</H3>
        </View>
    )
}

export default RankHistory