const WXAPI = require('../../wxapi/main');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip:'失物招领小程序',
    authorize:true,
    baseurl:WXAPI.IMAGE_BASE_URL,
    showlogin:false,
    thmemcolor:'#2db7f5'
  },
  //编辑个人信息
  toedit(){
    wx.navigateTo({
      url: '/pages/mine/edit',
    })
  },
  //退出登录
  logout(){
    wx.showModal({
      title: '提示',
      content: '确认要退出登录吗？',
      success(r) {
        if (r.confirm) {
          // 清除本地（单个）token缓存
          wx.removeStorageSync('token')
          // 关闭所有页面， 打开index页面
          wx.reLaunch({
            url: '/pages/login/index',
          })
        }
      }
      })
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 页面加载触发
  onShow (options) {
    const that = this
    // 在本地（异步）获取userlist信息
    let userlist=wx.getStorageSync('userlist')
    if(userlist){
      that.setData({
        userlist:wx.getStorageSync('userlist')
      })
    }else{
      this.getdata()
    }
  },
  getdata(){
    const that = this
    // 获取用户信息
    WXAPI.getuser({}).then(r=>{
      // 在本地存储数据
      wx.setStorageSync('userlist',r.data)
      that.setData({
        userlist:r.data
      })
    })
  },
  /*
  开启页面分享
  */
  onShareAppMessage(){
   
  },
  

})