const UPLOAD = require('../../utils/upload');
const WXAPI = require('../../wxapi/main');
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['i-uploadpic'],
  properties: {
    uploadlist: {
      type: Array,
      value: []
    },
    maxsize: {
      type: Number,
      value: 1
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    base_image_url:WXAPI.IMAGE_BASE_URL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择图片
    checkimg: function (e) {
      let uploadlist = this.data.uploadlist
      let len = this.data.maxsize - uploadlist.length
      if(this.data.maxsize==0) len=9
      const that = this;
      wx.chooseImage({
        count: len > 9 ? 9 : len,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          uploadlist = uploadlist.concat(tempFilePaths)
          that.setData({
            uploadlist,
          })
        }
      })
    },
    //移除图片
    removeimage(e) {
      let index = e.currentTarget.dataset.index
      let uploadlist = this.data.uploadlist
      uploadlist.splice(index, 1)
      this.setData({
        uploadlist
      })
    },
    //预览
    preview(e) {
      let index = e.currentTarget.dataset.index
      let uploadlist = this.data.uploadlist
      wx.previewImage({
        urls: uploadlist,
        current: uploadlist[index],
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    },
    //获取图片数组
    getupload() {
      return new Promise((resolve, reject) => {
        let uploadlist = this.data.uploadlist
        let upload=uploadlist.filter((url)=>{
          return url.indexOf('http://tmp/') != -1 || url.indexOf('wxfile://tmp_') != -1
        })
        UPLOAD.uploadimg(upload).then(res=>{
          let j=0,start=0
          while(start<res.length){
            while (uploadlist[j].indexOf('http://tmp/') == -1 && uploadlist[j].indexOf('wxfile://tmp') == -1) {
              j++;
            }
            uploadlist[j++]=res[start++]
          }
          let uploadlistres=uploadlist.map(item=>{
            return item.replace(WXAPI.IMAGE_BASE_URL,'')
          })
          
          resolve(uploadlistres)
        })
     })
    }
  }
})