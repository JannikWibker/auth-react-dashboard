const time_ago = (time, already_relative=false, precise=false) => {

  const rtf = new Intl.RelativeTimeFormat('en')

  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }

  const is_future = time > Date.now()
  const relative_time = already_relative ? time / 1000 : Math.abs(Date.now() - time) / 1000

  const HOUR = 60*60
  const DAY = 24*HOUR

  const unprecise_time_formats = [
    {max: 45,       value: 'now' },
    {max: 55*60,    value: 'minute' },
    {max: 22*HOUR,  value: 'hour' },
    {max: 160*HOUR, value: 'day' },
    {max: 25*DAY,   value: 'week' },
    {max: 360*DAY,  value: 'month' },
    {max: Infinity, value: 'year' },
  ]

  const precise_time_formats = [
    { max: 60,       value: 'now' },
    { max: HOUR,     value: 'minute' },
    { max: DAY,      value: 'hour' },
    { max: 7*DAY,    value: 'day' },
    { max: 28*DAY,   value: 'week' },
    { max: 365.24*DAY,  value: 'month' },
    { max: Infinity, value: 'year' },
  ]

  let found = null
  let found_idx = -1

  for(let i = precise_time_formats.length-1; i >= 0; i--) {
    if(relative_time < (precise ? precise_time_formats[i].max : unprecise_time_formats[i].max)) {
      found = precise_time_formats[i].value
      found_idx = i
    }
  }
  
  if(found === 'now')
    return 'now'
  else
    return rtf.format((is_future ? 1 : -1) * Math.floor(relative_time / precise_time_formats[found_idx-1].max), found)
}

const format_date = (date=new Date(), at_sign=true) => {
  return '' + 
    (date.getFullYear()).toString().padStart(4, '0') + '-' + 
    (date.getMonth()+1).toString().padStart(2, '0') + '-' +
    (date.getDate()).toString().padStart(2, '0') + (at_sign ? '@' : ' ') +
    (date.getHours()).toString().padStart(2, '0') + ':' +
    (date.getMinutes()).toString().padStart(2, '0') + ':' +
    (date.getSeconds()).toString().padStart(2, '0')
}

export default { time_ago, format_date }

export {
  time_ago,
  format_date
}