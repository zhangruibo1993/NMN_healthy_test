// pages/clock/clock.js
//打卡日历页面
import { getClockData } from '../../utils/api'
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
      otherDrugs_display:'none',
      detail_display:'none',
      days:[],
      signUp:[],
      cur_year:0,
      cur_month:0,
      cur_day:0,
      choose_items : [
        {name:'1',value:'是'},
        {name:'0',value:'否',checked:true}
       ],
      cur_isSignUp:'',
      cur_select_color:'rgb(236, 104, 104)'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      //获取当前年月 
      const date = new Date();
      
      const cur_year = date.getFullYear(); 
      const cur_month = date.getMonth() + 1;
      const cur_day = date.getDate();
      const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
      //this.calculateEmptyGrids(cur_year, cur_month);
      //this.calculateDays(cur_year, cur_month);
      //获取当前用户当前任务的签到状态
      // this.onGetSignUp();
      this.setData({
        cur_year,
        cur_month,
        cur_day,
        weeks_ch
      })
    },

 /**
 * 生命周期函数--监听页面初次渲染完成
 */
 onReady: function () {

 },

 /**
 * 生命周期函数--监听页面显示
 */
 onShow: function () {
  this.calculateEmptyGrids(this.data.cur_year, this.data.cur_month);
  this.calculateDays(this.data.cur_year, this.data.cur_month);
 },

 /**
 * 生命周期函数--监听页面隐藏
 */
 onHide: function () {

 },

 /**
 * 生命周期函数--监听页面卸载
 */
 onUnload: function () {

 },

 /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
 onPullDownRefresh: function () {

 },

 /**
 * 页面上拉触底事件的处理函数
 */
 onReachBottom: function () {

 },

 /**
 * 页面上拉触底事件的处理函数
 */
showData: function (e) {
  // console.log("今天星期:" + e.currentTarget.dataset.obj.date,this.data.cur_year,this.data.cur_month);
  let isSign = '0';
  if(e.currentTarget.dataset.obj.isSign == 1){
     isSign = '1';
  }

  this.setData({
    cur_isSignUp: isSign,
    cur_select_color:'white',
    cur_day:e.currentTarget.dataset.obj.date
  });
},
radio_drugsChange: function (e) {
  if(e.detail.value == 1){
    this.setData({
      otherDrugs_display:'flex'
     })
  }else{
    this.setData({
      otherDrugs_display:'none'
     })
  }

},
radio_detailChange: function (e) {
  if(e.detail.value == 1){
    this.setData({
      detail_display:'inline-block'
     })
  }else{
    this.setData({
      detail_display:'none'
     })
  }

},
// 签到详情  按钮
handleHealthyDetail: function (e) {
  if(this.data.cur_day == undefined){
    console("请先选定日期")
  } 
  const nowDate =  this.data.cur_year + "-" + this.data.cur_month + "-" + this.data.cur_day;
  wx.navigateTo({
    url: "/pages/healthy/healthy?nowDate="+nowDate
  })
},

 /**
 * 用户点击右上角分享
 */
 onShareAppMessage: function () {

 },
 // 获取当月共多少天
 getThisMonthDays:function(year, month){
  return new Date(year, month, 0).getDate()
 },

 // 获取当月第一天星期几
 getFirstDayOfWeek:function(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
 },

 // 计算当月1号前空了几个格子，把它填充在days数组的前面
 calculateEmptyGrids:function(year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({days:[]});
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month); 
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date:null,
          isSign:false
        }
        that.data.days.push(obj);
      }
      this.setData({
        days:that.data.days
      });
    //清空
    } else {
        this.setData({
        days: []
      });
    }
 },

 // 绘制当月天数占的格子，并把它放到days数组中
 calculateDays:function(year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);

    if(month < 10){
      month = '0' + month;  
    }
    const cur_month_time = year + "-" + month; 
 
    //获取当月打卡数据
    getClockData(  {month: cur_month_time,memberId:1}).then(res => {
      const resp = res.data;
      for (let i = 1; i <= thisMonthDays; i++) {
        var day = i;
        if( i < 10 ){
          day = '0' + i ; 
        }
        const targetTime = cur_month_time + "-" + day;
        var obj = {
          date: i,
          isSign: 0
        };
        
        //判断是否 > 今天
        var d = new Date;
        var today = new Date(d.getFullYear (), d.getMonth (), d.getDate ());
        var reg = /\d+/g;
        var temp = targetTime.match (reg);
        var foday = new Date (temp[0], parseInt (temp[1]) - 1, temp[2]);

        if (foday > today){
          obj = {
            date: i,
            isSign: null
          };
        }else{
          for (let j = 0; j < resp.length; j++) {
            if(targetTime == resp[j].date){
              obj = {
                  date: i,
                  isSign: resp[j].isSign
                }
                break;
            }
            var nowDate = '';
            if(this.data.cur_month < 10){
              nowDate = this.data.cur_year +"-0"+ this.data.cur_month +"-"+ this.data.cur_day;
            } else {
              nowDate = this.data.cur_year +"-"+ this.data.cur_month +"-"+ this.data.cur_day;
            }
            if(nowDate == resp[j].date){
              this.setData({
                cur_isSignUp: resp[j].isSign,
              });            
            }
          }
        }
        that.data.days.push(obj);
      }
      this.setData({
        days:that.data.days
      }); 
    }).catch(err => {
      console.log(err)
    })  
 },

 //匹配判断当月与当月哪些日子签到打卡
 onJudgeSign:function(){
  var that = this;
  var signs = that.data.signUp;
  var daysArr = that.data.days;
  for (var i=0; i < signs.length;i++){
    var current = new Date(signs[i].date.replace(/-/g, "/"));
    var year = current.getFullYear();
    var month = current.getMonth()+1;
    var day = current.getDate();
    day = parseInt(day);
    for (var j = 0; j < daysArr.length;j++){
    //年月日相同并且已打卡
      if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day 
        && signs[i].isSign == "今日已打卡"){
        daysArr[j].isSign = true;
      }
    }
  }
    that.setData({days:daysArr});
 },

 // 切换控制年月，上一个月，下一个月
 handleCalendar:function(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      // this.onGetSignUp();  
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      // this.onGetSignUp();  
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
 },

 //获取当前用户该任务的签到数组
 onGetSignUp:function(){
    var that = this;
    var Task_User = Bmob.Object.extend("task_user");
    var q = new Bmob.Query(Task_User);
    q.get(that.data.objectId, {
      success: function (result) {
        that.setData({
        signUp : result.get("signUp"),
        count : result.get("score")
        });
        //获取后就判断签到情况
        that.onJudgeSign();
      },
      error: function (object, error) {
      }
    }); 
    }
})