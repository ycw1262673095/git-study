const VALIDATE = require('../../utils/validate');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
  },

  // 添加表白墙
  bindSave(e) {
    const that = this
    let content = e.detail.value.content
    let uploadcom = this.selectComponent("#uploadmore")
    let checkdata = [{
      type: 'required',
      value: content,
      info: '请填写信息'
    },]
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    
    that.setData({
      i_load: true,
    })
  //  更新
    uploadcom.getupload().then(res=> {
        let apidata = {
          imagelist: JSON.stringify(res),
          content: content
        }
        // 添加表白
        WXAPI.addlove(apidata).then(res => {
          console.log(res)
          that.setData({
            i_load: false
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