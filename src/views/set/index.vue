<template>
<div class="set">
  <div class="list_box">
     <group class="box_item">
        <cell title="更换手机号" value="137****2345" is-link class="auth" v-if="false"></cell>

        <cell title="修改密码" is-link link="/updatepassword" @click.native="statistics('点击修改密码', {})"></cell>

        <cell title="意见反馈"  is-link link="/feedback" @click.native="statistics('点击意见反馈', {})"></cell>

        <cell title="关于我们" is-link link="/about" @click.native="statistics('点击关于我们', {})"></cell>
     </group>
     <button class="btn" @click="outSign" v-if="show">退出</button>
  </div>
</div>
</template>

<script>
import { Group, Cell } from 'vux'
import auth from '@/utils/auth'
export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    outSign () {
      auth.removeLoginStatus()
      auth.removeAuthLoginStatus()
      this.$router.push('/login')
    },
    isweixin () {
      let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') > -1) {
        this.show = false
      } else {
        this.show = true
      }
    }
  },
  mounted () {
    this.isweixin()
  }
}
</script>

<style lang="less" scoped>
.set{
  .list_box{
    .box_item{
      .weui-cells{
        &::before{
          border-top: none;
        }
      }
    }
    .btn{
      display: block;
      width: 91.5%;
      margin: 88px auto 100px;
      border: none;
      outline: none;
      line-height: 45px;
      color: #fff;
      text-align: center;
      font-size: 18px;
      background:linear-gradient(151deg,rgba(66,179,249,1) 0%,rgba(31,124,240,1) 100%);
      border-radius:4px;
    }
  }
}
</style>
