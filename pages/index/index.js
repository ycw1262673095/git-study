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
    list: [[],[]], 
    page: 1,   //页面数量
    pagesize:8,  //单页面容量
    islast: false, 
    title:'',
    next: false,
    size: 2,
    showmodal: false,
    navlist: [{
      title: '丢失的东西'
    }, {
      title: '捡到的东西'
    }],
    bindtype:[0,1],
    currentData: 0
  },
  // 搜索输入框更改
   inputChange: function(e) {
    this.setData({
      title: e.detail.value
    });
  },
   //点击关键词快捷搜索
   btnsearch: function(e) {
    this.reloadlist();
  },
  // 去添加
  toadd(){
    // 跳转添加页面
    wx.navigateTo({
      url: '/pages/index/add',
    })
  },
  showmodal() {
    this.setData({
      showmodal: true
    })
  },
  // 详情
  todetail(e){
    if (!app.globalData.authorize) {
      this.setData({
        showlogin: true
      })
      return;
    }
    let type=this.data.currentData
    let index=e.currentTarget.dataset.index
    let list=this.data.list
    // 前往详情页面
    wx.navigateTo({
      url: '/pages/index/detail?id='+list[type][index].id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  
  //获取当前滑块的index
  triggerchangetab() {
    let type=this.data.currentData
    let list = this.data.list;
    list[type] = [];
    this.setData({
      list: list
    })
    this.setData({
      page: 1,
      next: false,
      islast: false,
      tip: '下拉更多'
    })
    this.gettopicdata(1)
  },
  //点击切换，滑块index赋值
  checkCurrenttab: function(e) {
    const that = this;
    let type = e.currentTarget.dataset.current;
    if (that.data.currentData === type) {
      return false;
    }
    this.setData({
      currentData: type
    })
    this.triggerchangetab()
  },
  //下拉更新
  reloadlist() {
    let list=this.data.list
    list[this.data.currentData]=[]
    this.setData({
      islast: false,
      next: false,
      page: 1,
      list: list
    })
    this.gettopicdata(1);
  },
  //获取失物数据
  gettopicdata() {
    let page=this.data.page
    let current = this.data.currentData
    let type = this.data.bindtype[current]
    const that = this
    let apidata = {
      page: page,
      type: type,
      title:this.data.title,
      isall:0,
      pagesize: this.data.pagesize
    }
    console.log(apidata)
    // 获取失物信息
    WXAPI.gettopic(apidata).then(function (res) {
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
      list[current] = list[current].concat(res.data);
      that.setData({
        loading: false,
        list: list,
        size: list[current].length == 0 ? 1 : list[current].length ,
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
    this.gettopicdata();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.reloadlist()
  },






})