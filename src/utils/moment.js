import moment from 'moment'

export const getLocalMoment = (date, format) => {
    return moment.utc(date, format).local().format(format)
}

export const getUTCMoment = (date, format) => {
    const utc = moment(date, format).utc()
    return moment(utc).format(format)
}