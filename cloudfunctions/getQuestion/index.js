// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  const wxContext = cloud.getWXContext()
    const questions = await db.collection('question').where({
      use_status: true
    })
    .get()
 
  function randFun(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
      let index = parseInt(Math.random() * (len - 1));
      let tempValue = arr[i];
      arr[i] = arr[index];
      arr[index] = tempValue;
    }
    return arr;
  }
  
  questions.data = randFun(questions.data);
  
  return {
    questions: questions,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}