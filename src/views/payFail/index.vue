<template>
<scroll ref="scroll" class="wrapper">
  <div class="payFail">
    <svg-icon icon-class="payFail"></svg-icon>
    <p>充值失败！</p>
    <div class="btn_box">
      <div>
        <button class="active" @click="pay">重新充值</button>
      </div>
    </div>
    <p class="tip">温馨提示：<br>1、由于网络，服务器原因连连充值失败，跳转充值中心<br>2、点击重新充值返回充值中心<br>3、点击返回回到充值中心<br>4、由于支付超过当日限额或者当月限额。</p>
  </div>
</scroll>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    pay () {
      this.statistics('充值成功-继续充值', {})
      this.$router.push('/recharge')
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
    height: calc(100vh - 46px);
  }
  .payFail{
    padding: 28px 15px 36px;
    .svg-icon{
      display: block;
      margin: 0 auto;
      width: 56px;
      height: 56px;
      color: #FF6969;
    }
    p{
      margin-top: 24px;
      text-align: center;
      font-size: 18px;
      font-weight: 500;
      line-height: 24px;
    }
    .btn_box{
      margin-top: 46px;
      div{
        width: 50%;
        margin: 0 auto;
        button{
          display: block;
          width: 86.8%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          border: none;
          outline: none;
          background: #fff;
          border-radius:4px;
          color: #1F7CF0;
        }
        .active{
          background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
          box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
          color: #fff;
        }
      }
    }
    .tip{
      text-align: left;
      font-size:12px;
      color: #999999;
      line-height: 20px;
    }
  }
</style>
