import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions/rankActions'

export const mapStateToProps = ({ ranks }) => ({ ranks })

export const mapDispatchToProps = dispatch => ({
    rankActions: bindActionCreators(actions, dispatch)
})

const hoc = (WrappedComponent) => {
    const hocComponent = ({ ...props }) => <WrappedComponent {...props} />

    return hocComponent
}

export default WrapperComponent => connect(mapStateToProps, mapDispatchToProps)(hoc(WrapperComponent))
