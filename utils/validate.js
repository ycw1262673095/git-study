/**
 * 表单检查控件
 */
function validate(data) {
  let regexarr = {
    required: /^(\s*\S+\s*)+$/,
    custom:null,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    age: /^([1-9]?\d|1[0-3]\d)$/,
    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/,
    price:/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
  }
  let status = true
  for (let i = 0; i < data.length; i++) {
    if(data[i].type!='custom'){
      status = regexarr[data[i].type].test(data[i].value);
    }else{
      status = data.regex.test(data[i].value);
    }
    if (!status) {
      wx.showModal({
        title: '提示',
        content: data[i].info,
        showCancel:false,
        confirmColor: 'green',
      })
      return false;
    }
  }
  return true;
}
module.exports = {
  validate,
};