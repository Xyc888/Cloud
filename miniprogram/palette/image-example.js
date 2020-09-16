export default class ImageExample {
  palette() {
    return ({
      width: '640rpx',
      height: '1008rpx',
      background: '#eee',
      views: [
        {
          type: 'image',
          url: '/palette/4.png',
          mode:'aspectFill',
          css: {
            width: '640rpx',
            height: '1008rpx',
          },
        },

      ],
    });
  }
}
