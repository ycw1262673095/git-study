/**
 * 上传
 */
const WXAPI = require('../wxapi/main.js');
function uploadimg(imglist){
  return new Promise((resolve, reject) => {
    let imgarr = [];
    let resultarr = [];
    if (typeof imglist == 'string') {
      imgarr.push(imglist)
    } else if (typeof imglist == 'object') {
      imgarr = imglist;
    } else {
      console.log('上传路径错误')
      return
    }
    if (imgarr.length == 0) {
      resolve(resultarr);
      return;
    }
    for (let i = 0; i < imgarr.length; i++) {
      // 调用提示框 
      wx.showLoading({
        // 提示标题
        title: '正在上传第' + (i + 1) + '张图片中……',
      })
      // 本地资源上传服务器
      wx.uploadFile({
        url: WXAPI.UPLOAD,
        filePath: imgarr[i],
        name: 'file',
        header: {
          'Content-Type': 'application/json'
        },
        success: r => {
          console.log('r',r)
          let data = JSON.parse(r.data)
          console.log(data)
          if (data.code === 0) {
            wx.showToast({
              title: data.msg?data.msg:'上传失败',
              duration:3000,
              icon:'none'
            })
            resolve({code:0});
            return;
          }
          //服务器路径
          resultarr.push(data.data)
          if (resultarr.length == imgarr.length) {
            resolve(resultarr);
          }
        },
        fail: e => {
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {
          // 隐藏loading提示框
          wx.hideLoading()
        }
      })

    }

  })
}
module.exports = {
  uploadimg,
};
