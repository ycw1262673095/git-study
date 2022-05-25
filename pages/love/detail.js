const app = getApp();
const UTIL = require('../../utils/util');
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentlist: [],
    list: {},
    base_image_url:WXAPI.IMAGE_BASE_URL,
    loading: true,
    page: 1,
    id: -1,
    next: false,
    pagesize: 12,
    islast: false,
    tip: '下拉更多',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
    })
    this.getdata();
  },
  // 页面加载时候获取评论数据
  onShow: function() {
    this.setData({
      islast: false,
      next: false,
      page: 1,
      commentlist: []
    })
    this.getcommentdata()
  },
   /**
   * 获取页面数据
   */
  getdata() {
    const that = this
    let apidata = {
      id:this.data.id,
    }
    WXAPI.detaillove(apidata).then(function(res) {
      res.data.addtimestr=UTIL.formatTime(new Date( parseInt(res.data.addtime)*1000))
      that.setData({
        list: res.data
      })
    })
  },
   /**
   * 唤起打电话
   */
  tocall() {
    let list=this.data.list
    wx.makePhoneCall({
      phoneNumber: list.phone,
    })
  },
   /**
   * 去评论
   */
  toreply() {
    wx.navigateTo({
      url: '/pages/love/reply?tid=' + this.data.id+'&uid='+this.data.list.uid,
    })
  },

  /**
   * 获取评论数据
   */
  getcommentdata() {
    const that = this
    let pagesize = this.data.pagesize
    let apidata = {
      page: this.data.page,
      tid: this.data.id,
      pagesize: pagesize
    }
    console.log('apidata',apidata)
    // 获取表白回复信息
    WXAPI.getlovereply(apidata).then(function(res) {
      console.log('commentres',res)
      if (res.data.length < pagesize) {
        that.setData({
          tip: '你已经看到我的底线了',
          islast: true,
        })
      }
      for(let obj of res.data){
        obj.addtimestr=UTIL.formatTime(new Date( parseInt(obj.addtime)*1000))
      }
      let commentlist = that.data.commentlist;
      commentlist = commentlist.concat(res.data);
      that.setData({
        loading: false,
        commentlist: commentlist,
        next: false
      })
    })
  },
   /**
   * 下拉加载更多
   */
  onReachBottom: function() {
    if (this.data.islast) return;
    let page = this.data.page + 1;
    this.setData({
      next: true,
      page: page
    })
    this.getcommentdata();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    
  }
})