import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { authorize } from './actions/authActions'
import { setCollapsed } from './actions/rankActions'

let composeEnhancers = compose

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

const middleWare = composeEnhancers(applyMiddleware(thunk))

const store = createStore(
    combineReducers(reducers),
    middleWare
)

store.dispatch(authorize())
store.dispatch(setCollapsed())

export default store