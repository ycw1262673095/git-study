const CONFIG = require('config.js')
const API_BASE_URL = 'http://localhost:8080/';//基地址
const IMAGE_BASE_URL = 'http://localhost:8080/';//基地址
const HTTP_URL = 'http://localhost';
const adminurl = API_BASE_URL + '/login.jsp';//后端登录地址
const UPLOAD = API_BASE_URL + 'common/upload';//上传地址
const request = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url
  data.token=wx.getStorageSync('token')|0
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        console.log(request.data)
        resolve(request.data)
      },
      fail(error) {
        reject(error.data)
      },
      complete(aaa) {
        wx.hideLoading()
      }
    })
  })
}
module.exports = {
  request,
  HTTP_URL,
  IMAGE_BASE_URL,
  adminurl,
  UPLOAD,
  

  //登录 HomeLoginServlet
  login: (data) => {
    return request('/home/baselogin', false, 'get', data)
  },
  //注册 UserServlet
  register: (data) => {
    return request('/home/baseregister', false, 'get', data)
  },
 
  //获取首页 IndexSerlet
  getindex: (data) => {
    return request('/home/homeindex', false, 'get',data)
  },

  //用户信息---------------用户 UserServlet
  getuser: ({}) => {
    return request('/home/userindex', false, 'get', { })
  },
  // 完善用户信息  UserServlet
  modifyuser: (data) => {
    return request('/home/usermodify', false, 'post', data)
  },
  
  //信息---------------简介 AboutServlet
  getabout: ({}) => {
    return request('/home/homeaboutdata', false, 'get', {})
  },
   //反馈-----------反馈 FeedbackServlet
   addfeedback: (data) => {
    return request('/home/feedbackadd', false, 'get', data)
  },


  //帖子信息---------------帖子 
  //获取失物帖子信息 TopicServlet
  gettopic: (data) => {
    return request('/home/topiclist', false, 'get', data)
  },
  //添加失物 TopicServlet
  addtopic: (data) => {
    return request('/home/topicadd', false, 'post', data)
  },
  //失物详情 TopicServlet
  detailtopic: (data) => {
    return request('/home/hometopicfind', false, 'post', data)
  },
  //删除失物 TopicServlet
  deletetopic: (data) => {
    return request('/home/topicdeleteuid', false, 'get', data)
  },
  //学号 TopicServlet
  stutopic: (data) => {
    return request('/home/topicstu', false, 'get', data)
  },
  // 已找到 详情页面 TopicServlet
  statustopic: (data) => {
    return request('/home/topicstatusuid', false, 'get', data)
  },
  // 已找到 用户发布页面 TopicServlet
  findtopic: (data) => {
    return request('/home/topicfinduid', false, 'get', data)
  },
  // 转账 对找到物品的用户 TopicServlet
  chargetopic: (data) => {
    return request('/home/topiccharge', false, 'get', data)
  },
  // 转账 用户 UserServlet
  usercharge: (data) => {
    return request('/home/usercharge', false, 'get', data)
  },
  // 获取评论 ReplyServlet
  getreply: (data) => {
    return request('/home/replylist', false, 'get', data)
  },
  // 添加评论 ReplyServlet
  addreply: (data) => {
    return request('/home/replyadd', false, 'post', data)
  },
  //表白墙信息---------------表白墙
  // 获取表白信息 LoveServlet
  getlove: (data) => {
    return request('/home/lovelist', false, 'get', data)
  },
  // 添加表白信息 LoveServlet
  addlove: (data) => {
    return request('/home/loveadd', false, 'post', data)
  },
  // 表白详情 LoveServlet
  detaillove: (data) => {
    return request('/home/homelovefind', false, 'post', data)
  },
  // 删除表白信息 LoveServlet
  deletelove: (data) => {
    return request('/home/lovedeleteuid', false, 'get', data)
  },
  // 获取表白回复信息 LovereplyServlet
  getlovereply: (data) => {
    return request('/home/lovereplylist', false, 'get', data)
  },
  // 添加表白回复信息 LovereplyServlet
  addlovereply: (data) => {
    return request('/home/lovereplyadd', false, 'post', data)
  },
  
  
}