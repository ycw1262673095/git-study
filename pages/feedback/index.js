const VALIDATE = require('../../utils/validate');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },
// 意见反馈
  bindSave(e) {
    const that = this
    let content = e.detail.value.content
    let uploadcom = this.selectComponent("#uploadmore") //返回组件的实例
    let checkdata = [{
      type: 'required',
      value: content,
      info: '请填写内容'
    }]
    //表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    // 数据存入页面缓存时候
    that.setData({
      i_load: true,
    })
    // 获取更新的内容
    uploadcom.getupload().then(res=> {
      console.log('图片信息',res);
        let apidata = {
          imagelist: JSON.stringify(res),
          content: content
        }
        // 添加反馈意见接口
        WXAPI.addfeedback(apidata).then(res => {
          console.log('反馈意见信息',res)
          that.setData({
            i_load: false
          })
          // 提示弹窗
          wx.showModal({
            // 弹窗标题
            title: '提示',
            // 提示内容
            content: '操作成功',
            // 不显示取消按钮
            showCancel: false,
            success(r) {
              // 返回到上一个页面
                wx.navigateBack({})
            }
          })
        })
      })
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})