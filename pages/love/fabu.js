const WXAPI = require('../../wxapi/main')
const app = getApp();
const TIME = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], 
    page: 1,
    pagesize:8,
    islast: false,
    base_image_url:WXAPI.IMAGE_BASE_URL,
    next: false
  },
  // 前往详情页面
  todetail(e){
    let index=e.currentTarget.dataset.index
    let list=this.data.list
    wx.navigateTo({
      url: '/pages/love/detail?id='+list[index].id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.reloadlist()
  },
  // 删除
  cancle(e){
    const that=this
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    let apidata={
      id: list[index].id
    }
    // 弹窗
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      showCancel: true,
      cancelText: '再看看',
      confirmText: '确定',
      success: function(rr) {
        if (rr.confirm) {
          // 删除表白墙
          WXAPI.deletelove(apidata).then(res=>{
            if(res.code==1){
              wx.showToast({
                title: '删除成功',
              })
              list.splice(index, 1);
              that.setData({
                list:list
              })
            }else{
              wx.showModal({
                title: '提示',
                content: res.msg,
              })
            }
          })
        }
      },
    })
  },

  //获取
  reloadlist() {
    this.setData({
      islast: false,
      next: false,
      page: 1,
      list: []
    })
    this.getlovedata(1);
  },
  //获取
  getlovedata() {
    let page=this.data.page
    const that = this
    let apidata = {
      page: page,
      isall:1,
      pagesize: this.data.pagesize
    }
    // 获取表白信息 
    WXAPI.getlove(apidata).then(function (res) {
      if (res.data.length < apidata.pagesize) {
        that.setData({
          tip: '你已经看到我的底线了',
          loading: false,
          next: false,
          islast: true,
        })
      }
      for(let obj of res.data){
        obj.addtimestr=TIME.formatTime(new Date( parseInt(obj.addtime)*1000))
      }
      let list = that.data.list;
      list = list.concat(res.data);
      that.setData({
        loading: false,
        list: list,
        next: false
      })
    })
  },
  //下拉加载更多
  onReachBottom: function () {
    if (this.data.islast) return;
    var page = this.data.page + 1;
    this.setData({
      next: true,
      page: page
    })
    this.getlovedata();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },






})