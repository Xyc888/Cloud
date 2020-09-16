// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const { OPENID } = cloud.getWXContext()
  const hasUser = await db.collection('user').where({
    _openid: OPENID
  })
    .get()

  if (hasUser.data.length) {
    return true;
  } else {
    return false;
  }
}