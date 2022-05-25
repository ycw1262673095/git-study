const app = getApp();
const WxParse = require('../../wxParse/wxParse');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    // 获取公告
    WXAPI.getinfo({}).then(function(res) {
     console.log('infores',res)
     let article = res.data.description
      WxParse.wxParse('article', 'html', article, that, 5)
      that.setData({
        list: res.data,
      })
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})