import { RANK } from '../types'
import { getArggregated } from '../../utils/rank'
import { clone } from '../../utils/global'

const initialState = {
    isLoading: false,
    isRefreshing: false,
    initialized: false,
    status: {
        blockEndTimestamp: null,
        isScraping: false,
        url: null,
        keyword: null,
        pageIndex: null,
        waitSeconds: null,
        payloadLength: null,
        payloadIndex: null,
    },
    data: [],
    aggregatedData: [],
    checkList: [],
    collapsed: [],
    isEditMode: false
}

export default (state = initialState, action) => {
    const { payload } = action
    let temp
    switch (action.type) {
        case RANK.SET_RANKS:
            return {
                ...state,
                initialized: true,
                data: payload,
                aggregatedData: getArggregated(payload)
            }
        case RANK.SET_RANKS_LOADING:
            return {
                ...state,
                isLoading: payload
            }
        case RANK.ADD_RANKS:
            temp = state.data.concat(payload)
            return {
                ...state,
                data: temp,
                aggregatedData: getArggregated(temp)
            }
        case RANK.UPDATE_RANK:
            temp = clone(state.data).map(item => {
                if (item._id === payload._id) {
                    return {
                        ...item,
                        ...payload
                    }
                }

                return item
            })
            return {
                ...state,
                data: temp,
                aggregatedData: [...getArggregated(temp)]
            }
        case RANK.UPDATE_RANKS:
            temp = clone(state.data).map(item => {
                if (payload[item._id]) {
                    return {
                        ...item,
                        ...payload[item._id]
                    }
                }

                return item
            })
            return {
                ...state,
                data: temp,
                aggregatedData: [...getArggregated(temp)]
            }
        case RANK.DELETE_RANK:
            temp = state.data.filter(item => !(item.url === payload.url && item.keyword === payload.keyword))
            return {
                ...state,
                data: temp,
                aggregatedData: getArggregated(temp)
            }
        case RANK.DELETE_RANKS:
            temp = state.data.filter(item => {
                if (payload[item.url]) {
                    return item.keyword !== payload[item.url].keyword
                }

                return true
            })

            return {
                ...state,
                data: temp,
                aggregatedData: getArggregated(temp)
            }
        case RANK.SET_RANKS_REFRESH:
            return {
                ...state,
                isRefreshing: payload
            }
        case RANK.SET_SCRAPING_STATUS:
            return {
                ...state,
                status: {
                    ...state.status,
                    ...payload
                }
            }
        case RANK.SET_RANKS_EDIT_MODE:
            return {
                ...state,
                isEditMode: payload,
                collapsed: payload ? [] : state.collapsed
            }
        case RANK.SET_RANKS_CHECK_LIST:
            return {
                ...state,
                checkList: payload
            }
        case RANK.ADD_RANKS_CHECK_LIST:
            return {
                ...state,
                checkList: state.checkList.concat(payload)
            }
        case RANK.DELETE_RANKS_CHECK_LIST:
            return {
                ...state,
                checkList: state.checkList.filter(item => item !== payload)
            }
        case RANK.SET_RANKS_COLLAPSE:
            return {
                ...state,
                collapsed: payload
            }
        case RANK.ADD_RANKS_COLLAPSE:
            return {
                ...state,
                collapsed: state.collapsed.concat(payload)
            }
        case RANK.DELETE_RANKS_COLLAPSE:
            return {
                ...state,
                collapsed: state.collapsed.filter(item => item !== payload)
            }
        case RANK.RESET_SCRAPING_STATUS:
            return {
                ...state,
                status: {
                    isScraping: false,
                    url: null,
                    keyword: null,
                    pageIndex: null,
                    waitSeconds: null,
                    payloadLength: null,
                    payloadIndex: null,
                }
            }
        default:
            return state
    }
}