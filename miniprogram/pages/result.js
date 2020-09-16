// miniprogram/pages/result.js
import Card from '../palette/image-example';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    template: {},
    count:0,
    grade:0,
    image:null,
    list:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  startTest: function () {
    wx.redirectTo({
      url: './test',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.userInfo;

    wx.cloud.callFunction({
      name: 'rankingList',
      data: {},
      success: res => {
        if (res.result.data.length){
          this.setData({
            list: res.result.data.slice(0, 5)
          })
        }else{
          this.setData({
            list: []
          })
        }
        
      }
    })
    // 题目和分数
    this.setData({
      count: options.count || 0 ,
      grade: options.grade || 0,
      avatarUrl: userInfo.avatarUrl,
      template: new Card().palette()
    })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    this.setData({
      
    });
  },
  // 图片
  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      image: this.imagePath
    })
  },
  // 保存
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var grade = that.data.grade;
    var count = that.data.count
    return{
      title: "哇塞~题这么难，我竟然对了" + count + "道得了" + grade +"分，一起来答题吧！",
      path: '/pages/result',
      success:function(res){},
      fail:function(res){}
    }
  },

  onPullDownRefresh:function(){
    let userInfo = app.globalData.userInfo;

    wx.cloud.callFunction({
      name: 'rankingList',
      data: {},
      success: res => {
        if (res.result.data.length) {
          this.setData({
            list: res.result.data.slice(0, 5)
          })
          wx.showToast({
            title: '排行榜已更新~',
            duration:1000
          })
          wx.stopPullDownRefresh()
        } else {
          this.setData({
            list: []
          })
        }

      }
    })
  }
})