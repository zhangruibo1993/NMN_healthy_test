// components/notice/notice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '我是滚动信息'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animation: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail() {
      console.log('点击滚动新闻')
    }
  }
})
