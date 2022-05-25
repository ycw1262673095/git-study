const app = getApp()
const VALIDATE = require('../../utils/validate')
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '何文杰',
    password: 'Ycw123456'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  // 注册
  toregister(){
    wx.navigateTo({
      url: '/pages/register/index',
    })
  },
 

  /**
 * 登陆
 */
  login() {
    const that = this
    let apidata = {
      name: that.data.name,
      password: that.data.password,
    };
   
  
    let checkdata = [{
      type: 'required',
      value: apidata.name,
      info: '请输入账号'
    }, {
      type: 'password',
      value: apidata.password,
      info: '同时小写字母、大写字母、数字8位-10位'
    },]
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }

    wx.showLoading({
      title: '验证中',
    })
    console.log(apidata)
    // 登录
    WXAPI.login(apidata).then(res => {
      console.log('用户信息',res)
      if (res.code == 1) {
        wx.showToast({
          title: '登录成功',
        })
        wx.showToast({
          title: '登录成功',
          duration: 1000,
          success: (r) => {
            app.globalData.authorize = true
            // 本地缓存 token 和 userlist
            wx.setStorageSync('token', res.data.id)
            wx.setStorageSync('userlist', res.data)
            // 关闭所有页面  打开index页面
            wx.reLaunch({
              url: '/pages/index/index',
            })
          },
        })
       
      } else {
        wx.showToast({
          title: '账号密码不对',
          icon: 'none'
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