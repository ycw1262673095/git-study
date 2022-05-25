const app = getApp();
const UTIL = require('../../utils/util');
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentlist: [],
    mineid:0,
    showoper:false,
    list: {},
    base_image_url:WXAPI.IMAGE_BASE_URL,
    loading: true,
    page: 1,
    id: -1,
    stu:'',
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
      mineid:wx.getStorageSync('token')
    })
    this.getdata();
  },
  // 输入学号时候触发设置学号
  inputstu(e){
    this.setData({
      stu:e.detail.value
    })
  },
  // 显示 是我的 或者 我找到
  showoper(){
    this.setData({
      showoper:true
    })
  },
  // 关闭显示 是我的 或者 我找到
  closeoper(){
    this.setData({
      showoper:false
    })
  },
  // 关闭弹窗
  refuse(){
    return false
  },
  // 已找到
  tofindstatus(){
    const that=this
    let list=this.data.list
    if(this.data.stu==''){
      // 显示消息提示框
      wx.showToast({
        icon:'none',
        title: '请输入学号',
      })
      return
    }
    // 查看失物详情接口 通过id  stu
    WXAPI.findtopic({id:this.data.list.id,stu:this.data.stu}).then(function(res) {
      if(res.code==1){
        list.finduid=1  //找到用户id
        wx.showToast({
          title: '操作成功',
        })
        that.setData({
          list,
          showoper:false
        })
      }else{
        // 提示弹窗
        wx.showModal({
          title: '提示',
          content: res.msg,
        })
      }
    })
  },
  // 页面显示的时候
  onShow: function() {
    this.setData({
      islast: false,
      next: false,
      page: 1,
      commentlist: []
    })
    // 获取数据
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
    //接口获取页面数据
    WXAPI.detailtopic(apidata).then(function(res) {
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
    //拨打电话
    wx.makePhoneCall({
      phoneNumber: list.phone,
    })
  },
   /**
   * 去评论
   */
  toreply() {
    // 跳转到回复页面
    wx.navigateTo({
      url: '/pages/index/reply?tid=' + this.data.id+'&uid='+this.data.list.uid,
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
    // 接口获取回复的评论数据
    WXAPI.getreply(apidata).then(function(res) {
      console.log('commentres',res)
      if (res.data.length < pagesize) { //页面的最大数据条数大于当前页面数据的长度
        that.setData({
          tip: '你已经看到我的底线了',
          islast: true,
        })
      }
      for(let obj of res.data){  //便利查找添加的时间
        obj.addtimestr=UTIL.formatTime(new Date( parseInt(obj.addtime)*1000))
      }
      // 评论数据
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
  onReachBottom: function() {  //触底开始下一页
    if (this.data.islast) return; //判断是否是最后的页面
    let page = this.data.page + 1;  //页面数量加一
    this.setData({
      next: true,
      page: page
    })
    this.getcommentdata();  //获取评论信息
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    
  }
})