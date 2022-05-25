const app = getApp();
const WxParse = require('../../wxParse/wxParse');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    baseurl:WXAPI.IMAGE_BASE_URL,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    //获取简介信息
    WXAPI.getabout({}).then(function(res) {  
      console.log('简介信息',res)
      let article = res.data.description
      WxParse.wxParse('article', 'html', article, that, 5)
      res.data.faceimage=that.data.baseurl+res.data.faceimage
      
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