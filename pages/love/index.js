const WXAPI = require('../../wxapi/main')
const TIME = require('../../utils/util')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [],
    base_image_url:WXAPI.IMAGE_BASE_URL,
    list: [], 
    page: 1,
    pagesize:8,
    islast: false,
    title:'',
    next: false,
    size: 2,
    currentData: 0
  },
  // 搜索框输入
   inputChange: function(e) {
    this.setData({
      title: e.detail.value
    });
  },
   //点击关键词快捷搜索
   btnsearch: function(e) {
    this.reloadlist();
  },
  //发布表白墙
  toadd(){
    wx.navigateTo({
      url: '/pages/love/add',
    })
  },
//  表白详情
  todetail(e){
    if (!app.globalData.authorize) {
      this.setData({
        showlogin: true
      })
      return;
    }
    let index=e.currentTarget.dataset.index
    let list=this.data.list
    wx.navigateTo({
      url: '/pages/love/detail?id='+list[index].id,
    })
  },
  //获取数据
  reloadlist() {
    this.setData({
      islast: false,
      next: false,
      page: 1,
      list: []
    })
    this.getlovedata(1);
  },
  //获取数据
  getlovedata() {
    const that = this
    let page=this.data.page
    let apidata = {
      page: page,
      title:this.data.title,
      isall:0,
      pagesize: this.data.pagesize
    }
    console.log(apidata)
    // 获取表白数据
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
    this.reloadlist()
  },






})