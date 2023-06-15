import cheerio from 'cheerio'
import axios from 'axios'
import { getHostname, randomSleep } from './global'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'
import moment from 'moment'
import { setScrapingStatus } from '../redux/actions/rankActions'
import { sendError } from './error'
import { DATE_TIME_FORMAT } from '../constants/moment'
import { ERRORS } from '../constants/errors'

export const getRank = async (item, scanMaxRank = 50, dispatch) => {
    if (!isFunction(dispatch)) {
        dispatch = null
    }

    try {
        const { url, keyword } = item
        const maxPage = (scanMaxRank / 10) + 1
        const targetUrl = getHostname(url)
        const randomUserAgent = await getRandomUserAgent()
        const headers = {
            'User-Agent': randomUserAgent
        }

        let found = false
        let pageIndex = 0
        let rank = 0
        let refererUrl

        if (!url) {
            throw new Error('url is required')
        }

        if (!keyword) {
            throw new Error('keyword is required')
        }

        while (!found && rank <= Number(scanMaxRank) && pageIndex < maxPage) {
            if (dispatch) {
                dispatch(setScrapingStatus({
                    pageIndex: pageIndex + 1,
                    waitSeconds: null
                }))
            }

            const googleUrl = getGoogleURL(keyword, pageIndex)

            const response = await axios({
                url: googleUrl,
                headers,
                timeout: 15000
            })

            const html = response.data

            if (pageIndex) {
                await randomSleep(2000, 4000)
            }

            if (html && response.status === 200) {
                const $ = cheerio.load(html)
                $('body').find('h3').each((i, h3) => {
                    if ($(h3).parent()) {
                        const href = $(h3).parent().attr('href')

                        if (href && !found) {
                            rank++

                            if (href.includes(targetUrl)) {
                                refererUrl = href
                                found = true
                            }
                        }
                    }
                })
            } else {
                break
            }

            if (!found) {
                pageIndex++
            }
        }

        if (!found) {
            rank = 0
        }

        if (__DEV__) {
            console.log(`${url} :: ${keyword} :: ${rank}`)
        }

        return {
            rank,
            pageIndex,
            refererUrl
        }

    } catch (error) {
        const status = get(error, 'response.status')
        let errorType

        if (status === 429) {
            errorType = ERRORS.TOO_MANY_REQUESTS
        } if (error.message === 'Network Error') {
            errorType = ERRORS.NETWORK
        }

        return { error: errorType }
    }
}

const getRandomUserAgent = async () => {
    let ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
    try {
        const response = await axios.get('/agents')

        ua = response.data
    } catch (error) {

    } finally {
        return ua
    }
}

const getGoogleURL = (keyword, pageIndex = 0) => {
    return `https://google.com/search?q=${encodeURI(keyword)}&start=${pageIndex}0`
}

export const getArggregated = (data = []) => {
    try {
        const urls = groupBy(data, 'url')
        if (isEmpty(urls)) return []

        const output = Object.keys(urls).reduce((acc, url) => {
            const grouped = groupBy(urls[url], 'keyword')

            const keywords = Object.keys(grouped).reduce((acc, keyword) => {
                const group = grouped[keyword]
                const sorted = group.sort((a, b) => {
                    const date1 = moment(a.createdAt).format('X')
                    const date2 = moment(b.createdAt).format('X')

                    return date2 - date1
                })

                const latest = sorted[0]
                const prevDiffRank = sorted.find(item => {
                    const { createdAt } = item
                    const isToday = !moment().isSame(createdAt, 'day')

                    return isToday
                })

                acc.push({
                    key: latest._id,
                    ...latest,
                    prevDiffRank,
                    data: sorted,
                    updatedAt: moment(latest.createdAt).format(DATE_TIME_FORMAT)
                })

                return acc
            }, [])

            let faviconSrc
            if (keywords.length) {
                faviconSrc = keywords[0].faviconSrc
            }

            const diffIndicator = keywords.reduce((acc, item) => {
                const { rank, prevDiffRank } = item

                if (rank && prevDiffRank) {
                    acc += prevDiffRank.rank - rank
                }

                return acc
            }, 0)

            acc.push({
                url,
                data: keywords,
                isLoading: false,
                faviconSrc,
                diffIndicator,
                numOfKeywords: keywords.length,
            })

            return acc
        }, [])
            .filter(item => item.data.length)
            .sort((a, b) => a.url.localeCompare(b.url))

        return output
    } catch (error) {
        sendError({
            title: 'getArggregated',
            message: error.message
        })
    }
}

export const getIsBlocked = (timestamp) => {
    if (!timestamp) return false
    const end = moment(timestamp, 'X').add(6, 'hours')

    return moment().isBefore(end)
}