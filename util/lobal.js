export function pad (num, n, flag) {
  return Array(n > num.toString().length ? (n - ('' + num).length + 1) : 0).join(flag) + num
}

/**
 * date format
 * @param {*} date   Date 对象
 * @param {*} str 时间格式字符串
 */
export function dateFormat(date, str = "yyyy-MM-dd"){
 if ("" === date || null === date || undefined === date) {
    return null;
 }
 let o = {
  "M+": date.getMonth() + 1, // month
  "d+": date.getDate(), // day
  "h+": date.getHours(), // hour
  "m+": date.getMinutes(), // minute
  "s+": date.getSeconds(), // second
  "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
      S: date.getMilliseconds() // millisecond
  };
  let format = str;
  if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
  }

  Object.keys(o).forEach(k => {
      if (new RegExp(`(${k})`).test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length))
      }
  })
  return format
}

export function dataFormat2(date) {
 if ("" === date || null === date || undefined === date) {
  return null;
 }
 return dateFormat(new Date(date), "yyyy-MM-dd");
}

/**
 * 将中国标准时间转化为星期
 * @param date
 * @returns {string}
 */
export function dataFormatWeek(date) {
 if ("" === date || null === date || undefined === date) {
  return null;
 }
  let dateTime = new Date(dateFormat(date, "yyyy-MM-dd"));
 let weeks = ["周日","周一","周二","周三","周四","周五","周六"];
 return weeks[dateTime.getDay()];
}
