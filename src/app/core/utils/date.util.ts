import * as moment from 'moment'

export const getLocaleDate = (timestamp) => {
    const localDate = moment(timestamp).format("YYYY-MM-DD").toString()
    return localDate
}

