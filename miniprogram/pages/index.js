// miniprogram/pages/index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据 app.globalData.userInfo.nickName
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  startTest: function () {
    const { canIUse} = this.data;
    if (app.globalData.userInfo.nickName){
      wx.redirectTo({
        url: './test',
      })
    }else{
      wx.showToast({
        title: '请先授权才能使用',
        icon: 'error',
        duration: 2000
      })
    }
  },

  // 授权
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo;
    app.globalData.openid = e.detail.openid;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          app.getUserOpenIdViaCloud()
          .then(openid => {
            wx.getUserInfo({
              success: function (res) {
                if (res.userInfo){
                  var userInfo = res.userInfo;
                  app.globalData.userInfo = userInfo;
                  app.globalData.openid = openid;
                }else{
                  this.setData({
                    canIUse:false
                  })
                }
              }
            })
          }) 
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})