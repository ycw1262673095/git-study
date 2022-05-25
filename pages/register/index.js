const app = getApp()
const WXAPI = require('../../wxapi/main')
const VALIDATE = require('../../utils/validate')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    password: ''
  },

  /**
   * 注册
   */
  register(e) {
    const that = this
    let checkdata = [{
      type: 'required',
      value: that.data.name,
      info: '请输入账户'
    }, {
      type: 'password',
      value: that.data.password,
      info: '同时小写字母、大写字母、数字8位-10位'
    }, ]
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        let apidata = {
          nickname: res.userInfo.nickName,
          avaturl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender,
          country: res.userInfo.country,
          city: res.userInfo.city,
          province: res.userInfo.province,
          name: that.data.name,
          age: 0,
          password: that.data.password,
        };
        WXAPI.register(apidata).then(res => {
          if (res.code == 1) {
            wx.showToast({
              title: '注册成功',
              duration: 1000,
              success: (r) => {
                app.globalData.authorize = true
                // 设置本地 token
                wx.setStorageSync('token', res.data)
                // 清除本地userlist
                wx.removeStorageSync('userlist')
                // 关闭所有页面 打开index页面
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              },
            })
          } else {
            wx.showToast({
              title: '账号已存在',
              icon: 'none'
            })
          }
        })
      },
      // 授权失败
      fail: () => {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法获取您的信息',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    })
  },


  /**
   * 账户输入框更改
   */
  inputname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 账户输入框更改
   */
  inputage(e) {
    this.setData({
      age: e.detail.value
    })
  },
  /**
   * 密码输入框更改
   */
  inputpassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})