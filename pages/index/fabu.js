const WXAPI = require('../../wxapi/main')
const app = getApp();
const TIME = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [[],[]], 
    page: 1,
    pagesize:8,   //每一页显示的条数
    islast: false,
    base_image_url:WXAPI.IMAGE_BASE_URL,
    next: false,
    size:2,
    height: 396,
    targetheight: 600,
    navlist: [{
      title: '丢失的东西'
    }, {
      title: '捡到的东西'
    }],
    bindtype: [0, 1],
    currentData: 0
  },
  // 查看个人发布的详情
  todetail(e){
    let type=this.data.currentData
    let index=e.currentTarget.dataset.index
    let list=this.data.list
    if (list[type][index].isshow==0) return;
    wx.navigateTo({
      url: '/pages/index/detail?id='+list[type][index].id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.reloadlist()
  },
  /**
   * 删除信息
   */
  cancle(e){
    const that=this
    let type = this.data.currentData
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    let apidata={
      id: list[type][index].id
    }
    // 提示弹窗
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      // 显示取消按钮
      showCancel: true,
      // 取消按钮的文字
      cancelText: '再看看',
      // 确定按钮的提示文字
      confirmText: '确定',
      success: function(rr) {
        if (rr.confirm) {
          // 通过接口删除数据
          WXAPI.deletetopic(apidata).then(res=>{
            if(res.code==1){
              wx.showToast({
                title: '删除成功',
              })
              list[type].splice(index, 1);
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
  /**
   * 编辑信息
   */
  edit(e){
    let type = this.data.currentData
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    // 跳转到编辑页面
    wx.navigateTo({
      url: '/pages/index/add?id='+list[type][index].id,
    })
  },
  /**
   * 已找到
   */
  priceoper(e){
    const that=this
    let type = this.data.currentData
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    let apidata={
      id: list[type][index].id
    }
    wx.showModal({
      title: '提示',
      content: '确定已找到',
      // 显示取消按钮
      showCancel: true,
      // 取消按钮提示文字
      cancelText: '手滑',
      // 确定按钮提示文字
      confirmText: '确定',
      success: function(rr) {
        if (rr.confirm) {
          WXAPI.statustopic(apidata).then(res=>{
            if(res.code==1){
              wx.showToast({
                title: '操作成功',
              })
              list[type][index].status=1;
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
  /**已打赏 */
  chargeoper(e){
    const that=this
    let type = this.data.currentData
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    let apidata={
      id: list[type][index].id, 
      price:list[type][index].price,
      finduid:list[type][index].finduid
    }
    console.log(apidata)
    wx.showModal({
      title: '提示',
      content: '确定打赏'+list[type][index].price+'元',
      showCancel: true,
      cancelText: '手滑',
      confirmText: '确定',
      success: function(rr) {
        if (rr.confirm) {
          // 转账
          WXAPI.chargetopic(apidata).then(res=>{
            if(res.code==1){
              wx.showToast({
                title: '操作成功',
              })
              list[type][index].ischarge=1;
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

  //获取
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
      isall:1,
      type: type,
      pagesize: this.data.pagesize
    }
    //获取失物信息
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
        //获取当前时间
        obj.addtimestr=TIME.formatTime(new Date( parseInt(obj.addtime)*1000))
      }
      let list = that.data.list;
      list[current] = list[current].concat(res.data);
      that.setData({
        loading: false,
        list: list,
        next: false
      })
      let height = 0;
      for (let i = 0; i < list[current].length; i++) {
        if (list[current][i].imagelist.length > 0) {
          height += 446
        } else {
          height += 390;
        }
      }
      that.setData({
        targetheight: height > 600 ? height : 600
      })

    })
  },
  //下拉加载更多
  onReachBottom: function () {
    if (this.data.islast) return;   //判断是否是最后一页
    var that = this;
    var page = this.data.page + 1;  //获取当前页数加一
    this.setData({
      next: true, //下一页
      page: page  //页面数量
    })
    this.gettopicdata();  //重新调用获取下一页数据
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },






})