import { StyleSheet } from 'react-native'
import colors from './colors'

export default StyleSheet.create({
    w100: {
        width: '100%'
    },
    mb24: {
        marginBottom: 24
    },
    mb12: {
        marginBottom: 12
    },
    center: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    centeredView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    capitalize: {
        textTransform: 'capitalize'
    },
    alignCenter: {
        flex: 1,
        justifyContent: 'center',
    },
    colorGrey: {
        color: colors.grey
    },
    colorWhite: {
        color: colors.white
    },
    colorBlack: {
        color: colors.black
    },
    colorLightgrey: {
        color: colors.lightgrey
    },
    backgroundPrimary: {
        backgroundColor: colors.primary
    },
    backgroundWhite: {
        backgroundColor: colors.white
    },
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    bold700: {
        fontWeight: '700'
    },
    flexRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    paddingHorizontal: {
        paddingHorizontal: 15
    },
    paddingBottom: {
        paddingBottom: 15
    },
    checkListBadge: {
        position: 'absolute',
        top: -5,
        right: 10,
        backgroundColor: 'red',
        height: 16,
        width: '100%',
        maxWidth: 16,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    checkListBadgeText: {
        padding: 0,
        flex: 1,
        color: colors.white,
        fontSize: 9,
        fontWeight: '700'
    }
})