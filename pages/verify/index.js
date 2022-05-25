const VALIDATE = require('../../utils/validate');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  bindSave(e) {
    const that = this
    let stu = e.detail.value.stu
    let checkdata = [{
      type: 'require',
      value: stu,
      info: '请填写学号'
    }]
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    that.setData({
      i_load: true,
    })
    let apidata={
      stu
    }
    WXAPI.stutopic(apidata).then(res => {
      console.log(res)
      that.setData({
        i_load: false
      })
      wx.showModal({
        title: '提示',
        content: '操作成功',
        showCancel: false,
        success(r) {
          // 清除本地userlist
            wx.removeStorageSync('userlist')
            wx.navigateBack({})
        }
      })
    })
   
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})