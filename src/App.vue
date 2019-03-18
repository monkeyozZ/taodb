<template>
  <div id="app">
    <router-view/>
    <div v-transfer-dom class="index">
      <x-dialog v-model="registerGift" :hide-on-blur="true" :dialog-style="{'max-width': '100%', width: '92%', 'background-color': 'transparent'}">
        <div class="gift">
          <div class="content_box">
            <P>150积分</P>
          </div>
          <button class="rz_btn" @click="goCertification">立即认证</button>
        </div>
        <x-icon type="ios-close-outline" class="close mrt20" @click.native="closeGiftDialog"></x-icon>
      </x-dialog>
      <div class="lead_mask" v-if="lead">
        <div class="lead_box">
          <img src="./assets/img/lead.png">
          <p>点击这里签到分享哦~</p>
          <button type="button" class="close_lead_btn" @click="updateLeadStatus">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import leadApi from '@/api/lead'
import bus from '@/utils/eventBus'
export default {
  name: 'App',
  components: {
    XDialog
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      registerGift: false,
      lead: false
    }
  },
  computed: {
    ...mapGetters(['login_status'])
  },
  methods: {
    showGiftDialog () {
      this.registerGift = true
    },
    closeGiftDialog () {
      this.registerGift = false
      this.lead = true
    },
    goCertification () {
      this.$router.push('/certification')
      this.registerGift = false
    },
    closeLead () {
      this.lead = false
    },
    getLeadStatus () {
      if (this.login_status) {
        let obj = {
          type: 'regGuide'
        }
        leadApi.leadStatus(obj).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data) {
              this.lead = true
            }
          }
        })
      }
    },
    updateLeadStatus () {
      let obj = {
        type: 'regGuide'
      }
      leadApi.updateLeadStatus(obj).then((res) => {
        if (res.data.code === 0) {
          this.lead = false
          this.statistics('抢单列表-关闭签到引导', {})
        }
      })
    }
  },
  mounted () {
    bus.$on('showGiftDialog', () => {
      this.showGiftDialog()
    })
    bus.$on('closeLead', () => {
      this.closeLead()
    })
    bus.$on('getLeadStatus', () => {
      this.getLeadStatus()
    })
    bus.$on('updateLeadStatus', () => {
      this.updateLeadStatus()
    })
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './assets/less/componentsReset.less';
@import '~vux/src/styles/1px.less';
  .gift{
    position: relative;
    width: 100%;
    height: 427px;
    background: url('./assets/img/gift.png') no-repeat center center;
    background-size: 100% 100%;
    overflow: hidden;
    .content_box{
      margin-top: 110px;
      color: #FA1952;
      font-size: 39px;
      text-align: center
    }
    .rz_btn{
      position: absolute;
      width: 72%;
      left: 50%;
      bottom: 25px;
      display: block;
      line-height: 40px;
      font-size: 18px;
      font-weight: 600;
      color: #E9003A;
      transform: translate(-50%, 0);
      border: none;
      outline: none;
      border-radius: 20px;
      background: #FFA500;
    }
  }
  .index{
    .lead_mask{
      position: fixed;
      background: rgba(0,0,0,.7);
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 998;
      .lead_box{
        width: 53.33%;
        position: absolute;
        top: 27%;
        right: 0;
        text-align: right;
        img{
          margin: 50px 30px 0 0;
          display: inline-block;
          width: 72px;
        }
        p{
          font-size: 16px;
          color:#fff;
          letter-spacing:2px;
          text-align: left;
          font-weight:500;
        }
        .close_lead_btn{
          display: block;
          margin: 15px auto 0;
          width: 75px;
          line-height: 24px;
          text-emphasis: center;
          font-size: 16px;
          letter-spacing: 2px;
          border: 2px solid #FFFFFF;
          box-shadow: 1px 1px 1px 0 #BEBEBE;
          border-radius: 20px;
          outline: none;
          background: #1D93D2;
          color: #fff;
        }
      }
    }
  }
  .close{
    fill:#fff;
    width: 40px;
    height: 40px;
    font-size: 40px;
  }
  .mrt20{
    margin-top: 20px;
  }
</style>
