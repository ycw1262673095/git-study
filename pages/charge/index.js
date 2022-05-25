const VALIDATE = require('../../utils/validate');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },
  // 充值
  bindSave(e) {
    const that = this
    let price = e.detail.value.price
    let checkdata = [{
      type: 'price',
      value: price,
      info: '请填写金额'
    }]
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    // 数据存入页面缓存
    that.setData({
      i_load: true,
    })
    let apidata={
      price
    }
    // 接口将充值的金额存入数据库
    WXAPI.usercharge(apidata).then(res => {
      console.log('充值信息',res)
      // 数据存入页面缓存
      that.setData({
        i_load: false
      })
      // 弹窗
      wx.showModal({
        // 提示的标题
        title: '提示',
        // 提示的内容
        content: '操作成功',
        // 不显示取消按钮
        showCancel: false,
        success(r) {
          // 同步存储到user表
            wx.removeStorageSync('userlist')
            // 返回上一级页面
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