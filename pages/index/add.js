const VALIDATE = require('../../utils/validate');
const WXAPI = require('../../wxapi/main');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_image_url:WXAPI.IMAGE_BASE_URL,
    loading: false,
    tindex:0,
    edit:false,
    list:{
      address:'',
      price:0
    },
    typelist: [{
      title: '丢失东西',
      id: 0
    }, {
      title: '捡到东西',
      id: 1
    }, ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    if (options.id) {
      this.setData({
        id: options.id,
        edit: true
      })
      // 动态设置编辑发布页面的标题
      wx.setNavigationBarTitle({
        title: '编辑发布信息',
      })
    // 获取发布丢失物品信息
      WXAPI.detailtopic({
        id: options.id
      }).then(res => {
        let imagelist=res.data.imagelist.map(item=>{
          return WXAPI.IMAGE_BASE_URL+item
        })
       // 数据存入页面缓存时候
        that.setData({
          list: res.data,
          imagelist:imagelist,
        })
      })
    }
  },
  // 获取地址
  getaddress(){
    let that=this
    let list=this.data.list
    // 打开地图选择位置
    wx.chooseLocation({
      success: function(res) {
        list.address=res.address
        that.setData({
          list
        })
      },
    })
  },
  // 类型的变换 有丢失的物品和拾取的物品两种类型
  bindtypeChange(e){
    this.setData({
      // 获取点击事件的value 也就是物品的类型
      tindex:e.detail.value
    })
  },
  // 添加的信息 
  bindSave(e) {
    const that = this
    let content = e.detail.value.content
    let address = e.detail.value.address
    let title = e.detail.value.title
    let phone = e.detail.value.phone
    let price = e.detail.value.price
    let type = this.data.typelist[this.data.tindex].id
    let info=that.data.edit == 1?'编辑':'添加'
    let uploadcom = this.selectComponent("#uploadmore")
    let checkdata = [{
      type: 'required',
      value: title,
      info: '请填写标题'
    },{
      type: 'phone',
      value: phone,
      info: '请填写手机号'
    },{
      type: 'required',
      value: address,
      info: '请填写位置'
    },{
      type: 'required',
      value: content,
      info: '请填写信息内容'
    }]
    if(type==0){
      checkdata.push(
        {
          type: 'required',
          value: price,
          info: '请填写价格'
        }
      )
    }
    // 表单验证
    if (!VALIDATE.validate(checkdata)) {
      return
    }
    //  加载发布中  
    that.setData({
      i_load: true,
    })
    // 更新获取失物数据
    uploadcom.getupload().then(res=> {
        let apidata = {
          imagelist: JSON.stringify(res),
          address:address,
          type: type,
          title:title,
          phone,
          price,
          content: content
        }
        if(that.data.edit){
          apidata.id=that.data.list.id
        }
        // 通过接口将数据传入 re_topic表中
        WXAPI.addtopic(apidata).then(res => {
          console.log('失物信息',res)
          // 判断添加还是修改
          that.setData({
            i_load: false
          })
          // 弹窗
          wx.showModal({
            title: '提示',
            content: '操作成功',
            // 不显示取消按钮
            showCancel: false,
            success(r) {
              // 返回上一页
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