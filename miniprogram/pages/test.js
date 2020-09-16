const app = getApp()
var sumCount = 0;
let loading = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tips:"",
    number:0, //答对题目数量
    grade:0, // 总成绩
    template: {},
    optionlock:false,
    nextlock:false,
    isTrue:false,
    curClass:"",
    curOption:-1,

    // new
    curQuestionData:null,
    questionData:[], //当前数据源
    curIndex:0 // 选中索引
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
      // 调用云函数
      var self = this
      var idx = self.data.questionIdx;
      loading = false;
      
      // 函数节流，防止多次点击
      
        wx.cloud.callFunction({
          name: 'getQuestion',
          data: {},
          success: res => {
            console.log('[云函数] [getQuestion] ',res.result);

            let option = ["A","B","C","D","E","F"];
            if (res.result.questions.data){
              // 构造abcd
              res.result.questions.data.map(d=>{
                d.questionList.map((q,index)=>{
                  q.option = option[index];
                })
              })
            }
            this.setData({
              questionData: res.result.questions.data,
              curQuestionData: res.result.questions.data[0]
            })
          },
          fail: err => {
            console.error('云函数未开启', err);
          }
        })
  },
  
  checkOption(e){
    let dataId = Number(e.target.dataset.id);
    const { optionlock, curIndex, curQuestionData, curClass, questionData, number} = this.data;
    if(loading) return;
    loading = true;
      // 回答正确
      if (curQuestionData.questionList[dataId].is_true){
        sumCount += curQuestionData.point;
        this.setData({
          tips: curQuestionData.hint,
          optionlock: true,
          number: number+1,
          grade: sumCount, // 分数
          isTrue: true,
          curClass:'cur',
          nextlock:true,
          curOption: dataId
        },()=>{
          loading = false;
        })
      }else{
        this.setData({
          tips: curQuestionData.hint,
          nextlock: true,
          grade: sumCount,
          optionlock: true,
          isTrue: false,
          curClass:"cur",
          curOption: dataId
        },()=>{
          loading = false;
        })
      }
  },
  next(e){
    const {curQuestionData,questionData,curIndex} = this.data;
    if (loading) return;
    loading = true;
    // 数组形式，所以是4 不是5 
    if (curIndex < 9 ){
      this.setData({
        curIndex: curIndex + 1,
        curQuestionData: questionData[curIndex + 1],
        tips: "",
        optionlock: false,
        nextlock:false,
        curClass:"",
        curOption:-1
      },()=>{
        loading = false;
      })
    }else{
      wx.showLoading({
        title: '提交中',
      })
      this.recordUser()
    }
  },
  // 记录用户
  recordUser:function(){
    const { number, grade} = this.data;
    const db = wx.cloud.database();
    const userInfo = app.globalData.userInfo,
          openid = app.globalData.openid;

      wx.cloud.callFunction({
        name: 'setUser',
        data: {},
        success: res => {
          // 不存在
          if (!res.result) {
            if (!userInfo.nickName){
              wx.hideLoading();
              wx.showToast({
                title: '重新答题试试～',
                icon: 'error',
                duration: 2000
              })
              setTimeout(()=>{
                wx.redirectTo({
                  url: `result?grade=${grade}&count=${number}`
                })
              },2000)
              return false;
            }
            // 插入数据库
            db.collection('user').add({
              data: {
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender,
                grade: +grade,
                number: +number
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                console.log('[数据库] [新增用户记录] 成功，记录用户: ', userInfo.nickName)
              },
              fail: err => {
                console.error('[数据库] [新增用户记录] 失败：', err)
              }
            })
          }else{
            // 存在 更新成绩
            db.collection('user').where({ _openid: openid}).update({
              data: {
                grade: +grade,
                number: +number
              },
              success: () => {
                wx.showToast({
                  title: '完成此轮答题~',
                })
              },
              fail: err => {
                console.error('用户更新失败：', err)
              }
            })
          }
          wx.redirectTo({
            url: `result?grade=${grade}&count=${number}`
          })
        }
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onUnload:function(){
    console.log('onUnload')
  }
})
