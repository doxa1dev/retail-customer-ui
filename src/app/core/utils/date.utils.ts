import * as moment from 'moment';

export const getLocalDate = (timestamp) => {
  const localDate = moment(timestamp).format("YYYY-MM-DD").toString();
  return localDate;
  
}

const now = new Date();
// console.log(getLocalDate(now));
