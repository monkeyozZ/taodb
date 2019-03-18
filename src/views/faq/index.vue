<template>
<scroll ref="scroll" class="wrapper">
  <div class="item_box">
     <flexbox :gutter="0" wrap="wrap">
       <flexbox-item :span="4.5">
         <router-link :to="{ path: '/issue/auth'}" @click.native="statistics('常见问题', {type: '认证审核'})">
           <svg-icon icon-class="rzsh"></svg-icon>
          <p>认证审核</p>
         </router-link>
       </flexbox-item>
       <flexbox-item :span="3">
         <router-link :to="{ path: '/issue/order'}" @click.native="statistics('常见问题', {type: '抢单'})">
          <svg-icon icon-class="qiangdan"></svg-icon>
          <p>抢单</p>
         </router-link>
       </flexbox-item>
       <flexbox-item :span="4.5">
         <router-link :to="{ path: '/issue/recharge'}" @click.native="statistics('常见问题', {type: '充值与退款'})">
          <svg-icon icon-class="chongzhi"></svg-icon>
          <p>充值与退款</p>
         </router-link>
       </flexbox-item>
       <flexbox-item :span="4.5">
         <router-link :to="{ path: '/issue/invite'}" @click.native="statistics('常见问题', {type: '邀请奖励'})">
          <svg-icon icon-class="yaoqing"></svg-icon>
          <p>邀请奖励</p>
         </router-link>
       </flexbox-item>
       <flexbox-item :span="3">
         <router-link :to="{ path: '/issue/integral'}" @click.native="statistics('常见问题', {type: '积分'})">
          <svg-icon icon-class="jf"></svg-icon>
          <p>积分</p>
         </router-link>
       </flexbox-item>
       <flexbox-item :span="4.5">
         <router-link :to="{ path: '/issue/other'}" @click.native="statistics('常见问题', {type: '其他'})">
          <svg-icon icon-class="other"></svg-icon>
          <p>其他</p>
         </router-link>
       </flexbox-item>
     </flexbox>
  </div>
  <h2 class="title">热门问题</h2>
  <div class="issue_hot">
    <ul>
      <li>
        <h2 @click="tagglg1"><p>信贷经理认证审核要求是什么？个人可不可以认证？</p><svg-icon v-if="!show_1" icon-class="up"></svg-icon><svg-icon v-else icon-class="down"></svg-icon></h2>
        <div v-show="show_1" class="content">
          <p>平台目前只接受机构信贷经理认证，个人不可以认证</p>
        </div>
      </li>
      <li>
        <h2 @click="tagglg2"><p>认证审核需要多少天？</p><svg-icon v-if="!show_2" icon-class="up"></svg-icon><svg-icon v-else icon-class="down"></svg-icon></h2>
        <div v-show="show_2" class="content">
          <p>审核时间：</p>
          <p>1.工作日内提交，1个工作日进行审核。</p>
          <p>2.非工作日提交，1-2个工作日审核。</p>
        </div>
      </li>
    </ul>
  </div>
</scroll>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import bus from '@/utils/eventBus'
export default {
  components: {
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      show_1: false,
      show_2: false
    }
  },
  methods: {
    tagglg1 () {
      if (!this.show_1) {
        this.show_1 = true
        this.show_2 = false
      } else {
        this.show_1 = false
      }
    },
    tagglg2 () {
      if (!this.show_2) {
        this.show_2 = true
        this.show_1 = false
      } else {
        this.show_2 = false
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (from.path !== '/own') {
        bus.$emit('changeHideOverLeftStatus', true)
      } else {
        bus.$emit('changeHideOverLeftStatus', false)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.wrapper{
    height: calc(100vh - 46px);
  }
.item_box{
  .vux-flexbox-item{
   a{
    display: block;
    padding: 16px 0;
    box-sizing: border-box;
    text-align: center;
    border-right: 1px solid #EFEDED;
    border-bottom: 1px solid #EFEDED;
    .svg-icon{
      width: 31px;
      height: 31px;
    }
    p{
      font-size: 16px;
      color: #333;
    }
   }
  }
}
.title{
  font-size: 18px;
  color: #333;
  padding: 14px 16px;
  background: #EFEDED;
  font-weight: 500;
}
.issue_hot{
  ul{
    li{
      border-bottom: 1px solid #EFEDED;
      h2{
        position: relative;
        padding: 16px 15px;
        font-size: 16px;
        color: #333333;
        font-weight: 500;
        p{
          width: calc(100% - 20px)
        }
        .svg-icon{
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translate(0, -50%)
        }
      }
      .content{
        padding: 13px 15px;
        color: #666666;
        font-size: 14px;
        p{
          line-height: 24px;
        }
      }
    }
  }
}
</style>
