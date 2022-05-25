const VALIDATE = require('../../utils/validate');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    createid:-1,
    tid:-1,
  },
  // 第一次加载触发，只加载一次
  onLoad: function(options) {
    console.log('options',options)
    this.setData({
      createid:options.uid,
      tid:options.tid
    })
  },
// 回复信息  前端触发存入数据库
  bindSave(e) {
    const that = this
    let content = e.detail.value.content
    let uploadcom = this.selectComponent("#uploadmore")
    let checkdata = [{
      type: 'required',
      value: content,
      info: '请填写内容'
    }]
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    that.setData({
      i_load: true,
    })
   
    uploadcom.getupload().then(res=> {
        let apidata = {
          imagelist: JSON.stringify(res),
          createid:that.data.createid,
          tid:that.data.tid,
          content: content
        }
        // 添加回复
        WXAPI.addreply(apidata).then(res => {
          that.setData({
            i_load: false
          })
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          let list=prevPage.data.list
          list.replycount=parseInt(list.replycount)+1
          prevPage.setData({
            list
          })
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel: false,
            success(r) {
                wx.navigateBack({})
            }
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