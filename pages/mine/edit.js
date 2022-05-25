const WXAPI = require('../../wxapi/main');
const VALIDATE = require('../../utils/validate');
const UPLOAD = require('../../utils/upload');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxlength:250,
    sexlist: ["男", "女"],
    imglist: [''],
    sexindex: -1,
    baseurl:WXAPI.IMAGE_BASE_URL,
    list: {}
  },
  //选择图片
  chooseimg: function (e) {
    const that = this;
    // 从本地相册获取图片或者用相机拍照
    wx.chooseImage({
      count: 1,
      // 图片的尺寸  原图   压缩图
      sizeType: ['original', 'compressed'],
      // 选择图片的来源 从本地寻找 从相机拍照
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        // 从逻辑层发送到视图层 。改变数据
        that.setData({
          imglist: tempFilePaths
        })
      }
    })
  },
  /**
   * 选择性别
   */
  sexchange(e) {
    this.setData({
      sexindex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    // wx.getStorageSync('userlist') 从本地缓存中获取userlist
    let userlist=wx.getStorageSync('userlist')
    that.setData({
      list: userlist,
      sexindex: parseInt(userlist.gender)-1,
      imglist: [userlist.avaturl]
    })

  
  },
  /**
   * 个人描述
   */
  descinput(e){
    let list=this.data.list
    list.desc=e.detail.value
    this.setData({
      list
    })
  },

  /**
   * 提交上传
   */
  bindSave(e) {
    const that = this
    let imglist = this.data.imglist
    let list = this.data.list
    let nickname = e.detail.value.nickname
    let content = e.detail.value.content
    let age = e.detail.value.age
    let price = e.detail.value.price
    let password = e.detail.value.password
    let gender = parseInt(this.data.sexindex)+1

    let checkdata = [{
      type: 'required',
      value: nickname,
      info: '请输入你的姓名'
    }, {
      type: 'password',
      value: password,
      info: '同时小写字母、大写字母、数字8位-10位'
    },
    {
      type: 'required',
      value: gender,
      info: '请选择你的性别'
    },{
      type: 'price',
      value: price,
      info: '请输入余额'
    },{
      type: 'age',
      value: age,
      info: '年龄0-130'
    },  {
      type: 'required',
      value: content,
      info: '请输入你的个人描述'
    }]
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    this.setData({
      i_load: true,
    })
    let uploadlist = imglist.filter((item) => {
      if (item.indexOf('http://tmp/') != -1 || item.indexOf('wxfile://tmp_') != -1)
        return item
    })
    UPLOAD.uploadimg(uploadlist).then(res => {
      if (imglist[0].indexOf('http://tmp/') != -1 || imglist[0].indexOf('wxfile://tmp_') != -1) {
        list.avaturl = res[0]
      }

      let apidata = {
        nickname,
        avaturl:list.avaturl,
        gender,
        age,
        price,
        content,
        password
      }
      console.log(apidata)
      // 修改个人信息
      WXAPI.modifyuser(apidata).then(res => {
        //成功
        console.log('@@@',res);
        wx.showModal({
          title: '提示',
          content: '更新成功',
          showCancel: false,
          success(r) {
              //缓存在客户端存在的用户信息
              let userlist=wx.getStorageSync('userlist')
              userlist.nickname=apidata.nickname
              userlist.avaturl=apidata.avaturl
              userlist.gender=apidata.gender
              userlist.content=apidata.content
              userlist.age=apidata.age
              userlist.gender=apidata.gender
              userlist.password=apidata.password
             wx.setStorageSync('userlist', userlist)
          }
        })
        that.setData({
          
          i_load: false
        })
      })
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})