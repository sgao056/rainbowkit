import moment from 'moment'

export const filterTime = (time) => {
    const date = new Date(time)
    return date
}

export const timeDiff = (time) => {
  const date = moment(new Date(time))
  const endDate = moment(new Date())
  const workDayCount = endDate.diff(date,'days')
  if(workDayCount === 1){
    return `${workDayCount} day ago`
  }
  if(workDayCount > 0){
    return `${workDayCount} days ago`
  }
  const workHourCount = endDate.diff(date,'hours')
  if(workHourCount === 1){
    return `${workHourCount} hour ago`
  }
  if(workHourCount > 0){
    return `${workHourCount} hours ago`
  }
  const workMinuteCount = endDate.diff(date,'minutes')
  if(workMinuteCount === 1){
    return `${workMinuteCount} minute ago`
  }
  if(workMinuteCount > 0){
    return `${workMinuteCount} minutes ago`
  }
  return 'just now'
}

export const timeSequence = (array) => {
  array.forEach(item => {
    const date = item.edited ? moment(new Date(item.edited)) : moment(new Date(item.created)) 
    const endDate = moment(new Date())
    item.secDiff = endDate.diff(date,'second')
  })
  function compare(property){
    return function(obj1,obj2){
        const value1 = obj1[property];
        const value2 = obj2[property];
        return value1 - value2;
    }
  }
  array = array.sort(compare("secDiff"));
  return array
} 