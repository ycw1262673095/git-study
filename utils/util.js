const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatdate = (date,delimit,timedelimt) => {
  let weekarr=['周日','周一','周二','周三','周四','周五','周六']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay();
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return {
    week:{title:weekarr[week],index:week},
    date:[year, month, day].map(formatNumber).join(delimit) ,
    time:[hour, minute, second].map(formatNumber).join(timedelimt)
  }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


module.exports = {
  formatTime: formatTime,
  formatdate
}
