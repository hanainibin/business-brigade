/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

export const increaseMonth = (date, num) => {
  let value = new Date(date)
  value = new Date(value.setMonth(value.getMonth() + num) - 24 * 60 * 60 * 1000)
  let difference = value.getMonth() - date.getMonth()
  if (difference < 0) {
    difference += 12
  }
  if (difference > num) {
    value = new Date(value.setDate(1) - 24 * 60 * 60 * 1000)
  }
  return value.getTime()
}

export const monthNum = (date1, date2) => {
  let value1 = new Date(date1)
  let value2 = new Date(date2)
  let month = value2.getYear()
  // let year1 = this.value1.getYear()
  // let year2 = this.value2.getYear()
  // let month1 = this.value1.getMonth()
  // let month2 = this.value2.getMonth()
  let difference1 = value2.getMonth() - value1.getMonth()
  let difference2 = value2.getYear() - value1.getYear()
  if (difference2 > 0) {
    month += 12
  }
  if (difference1) {
    month = difference1
  }
  return month
}

export const deleteProp = (obj, ...agrs) => {
  agrs.forEach(element => {
    delete obj[element]
  });
  return obj
}