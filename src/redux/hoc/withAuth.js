import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions/authActions'

export const mapStateToProps = ({ auth }) => ({ auth })

export const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(actions, dispatch)
})

const hoc = (WrappedComponent) => {
    const hocComponent = ({ ...props }) => <WrappedComponent {...props} />

    return hocComponent
}

export default WrapperComponent => connect(mapStateToProps, mapDispatchToProps)(hoc(WrapperComponent))
