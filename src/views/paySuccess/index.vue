<template>
<scroll ref="scroll" class="wrapper">
  <div class="paySuccess">
    <svg-icon icon-class="paySuccess"></svg-icon>
    <p>充值成功！</p>
    <div class="btn_box">
      <div>
        <button @click="pay">继续充值</button>
      </div>
      <div>
        <button class="active" @click="order">去抢单</button>
      </div>
    </div>
  </div>
  <div class="adv_box">
     <img src="@/assets/img/adv.png">
  </div>
</scroll>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    order () {
      this.statistics('充值成功-去抢单', {})
      this.$router.push('/')
    },
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
  .paySuccess{
    padding: 28px 32px 36px;
    .svg-icon{
      display: block;
      margin: 0 auto;
      width: 56px;
      height: 56px;
      color: #1F7CF0;
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
        float: left;
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
          border:1px solid rgba(31,124,240,1);
          color: #1F7CF0;
        }
        .active{
          background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
          box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
          border:1px solid #338CF5;
          color: #fff;
        }
      }
    }
  }
  .adv_box{
    margin-top: 48px;
    img{
      display: inline-block;
      max-width: 100%;
      width: 100%;
      height: auto
    }
  }
</style>
