//日期转时间戳 (数字)------一般来说后端处理好的时间戳
export function getUnixTime(dateStr){
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime();
    return time_str;
}
//获取当前时间戳（处理过的数字放心使用）
export function getNowTime(){
    var timestamp = Date.parse(new Date());
    var n = timestamp
    var data = new Date(n).getTime()
    return data
}
//时间戳转日期,falg:true表示只要年月日,part: year month date
export function toDate(number,flag,part) {
    var n = number;
    var date = new Date(parseInt(n) * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if(flag){
        if(part == "year"){
            return y;
        }else if(part == "month"){
            return m;
        }else if(part == "date"){
            return n;
        }
        return y + '-' + m + '-' + d;
    }
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute+':' + second;
}
//判断两个日期时间戳相差多少天,参数为时间戳
export function dateCompare(dateTimeStamp1,dateTimeStamp2){
    var dayNum = 0;
    if(dateTimeStamp1 > dateTimeStamp2){
        dayNum = Math.floor((dateTimeStamp1 - dateTimeStamp2) / 86400);
    }else{
        dayNum = Math.floor((dateTimeStamp2 - dateTimeStamp1) / 86400);
    }
    return dayNum;
}

//判断过去某个时间点到当前时间是否达到多少天,可以用来定期清理缓存
export function datePassDays(dateTimeStamp,days){
    var now = getUnixTime(formatDateThis(new Date()));
    var diffValue = now - dateTimeStamp;
    var limitTime = days * 86400;
    if(diffValue >= limitTime){
        return true;
    }
    return false;
}
//当前日期加减天数,falg:true表示只要年月日
export function mathChangeDate(date,method,days,flag){
    //method:'+' || '-'
    //ios不解析带'-'的日期格式，要转成'/'，不然Nan，切记
    var dateVal = date.replace(/-/g, '/');
    var timestamp = Date.parse(dateVal);
    if(method == '+'){
      timestamp = timestamp / 1000 + 24 * 60 * 60 * days;
    } else if (method == '-'){
      timestamp = timestamp / 1000 - 24 * 60 * 60 * days;
    }
    return toDate(timestamp,flag);
  }
  //获取当前年份，月份， 例： getCurrentTime(new Date(),"year")
export function getCurrentTime(date,method) {
    if(method == "year"){
        return date.getFullYear();
    }else if(method == "month"){
        return date.getMonth() + 1;
    }
    return date;
}
// 获取几天几秒分开的（参数是做完减法的时间戳）

export function getAddtime(date){
    var timeIntervalDate=parseInt((date % (1000 * 60 * 60 * 24*365)) / (1000 * 60 * 60*24))+'天';
    var timeIntervalHour = parseInt((date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var timeIntervalMinite = parseInt((date % (1000 * 60 * 60)) / (1000 * 60));
    var timeIntervalSecond = (date % (1000 * 60)) / 1000;
    var s = (timeIntervalHour < 10 ? ('0' + timeIntervalHour) : timeIntervalHour) + '小时' + (timeIntervalMinite < 10 ? ('0' + timeIntervalMinite) : timeIntervalMinite) + '分钟' + (timeIntervalSecond < 10 ? ('0' + timeIntervalSecond) : timeIntervalSecond)+'秒';
    let time={
        timeIntervalDate,
        s,
    }
    return time
}
