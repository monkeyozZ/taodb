<template>
<div style="background: #F8F9F9;">
  <svg-icon icon-class="orderDetailsTop" class="top_bg"></svg-icon>
  <scroll ref="scroll" class="detailsWrapper" :style="{height: height}">
    <div class="details_box">
      <div class="base_info_box">
        <ul>
          <li>
            <p>
              <span class="name_box">
                <span>{{customerData.name}}</span>
              </span>
              <span class="money"><em>{{customerData.loanMoney}}</em>万元</span>
              <span class="tag_box" :class="customerData.type === 'ORDINARY' ? 'tao' : 'you'">{{customerData.type | transformTypeText}}</span>
              <span class="time">{{customerData.longOrderTimeTime | transformDate}}</span>
            </p>
            <p class="detail_info">
              <span>
                <svg-icon icon-class="address"></svg-icon>
                {{customerData.city}}
              </span>
              <span>
                <svg-icon icon-class="age"></svg-icon>
                {{customerData.age}}岁
              </span>
            </p>
          </li>
        </ul>
      </div>

      <div class="chargeback_reason">
        <h2 class="title">
          选择退单原因
          <a href="javascript:;" @click="show = true;statistics('订单详情-查看订单说明', {订单ID: id})"><svg-icon icon-class="reason"></svg-icon>退单说明</a>
        </h2>
        <div class="chargeback_box">
          <div class="item_box">
            <flexbox :gutter="0" wrap="wrap">
              <flexbox-item :span="4" v-for="(item, index) in itemArr" :key="index">
                <div>
                  <input :class="{active: item.active}" type="button" :value="item.label" @click="selected(item)">
                </div>
              </flexbox-item>
            </flexbox>
          </div>
          <div class="chargeback_body">
            <p style="font-size:12px;color:#666666;text-align:left;" ref="title">备注内容</p>
            <textarea v-model="tip" ref="textarea" rows="3" maxlength="200" placeholder="请写额外要备注的信息" @keyup="filterEmoji" v-on:input='autoTextAreaHeight' @blur="scrollTOBottom"></textarea>
            <p :class="{set_color: set_color, font_num: true}">{{text_num}}/200个字</p>
            <p style="margin-top:9px;font-size: 13px;color: #E84747;text-align:left;">退单后我们将人工审核</p>
          </div>
        </div>
      </div>

      <div class="chargeback_screenshot">
        <h2 class="title">
          上传证据截图
        </h2>
        <div class="upload">
          <div :style="{backgroundImage: `url(${blobURL})`}">
            <spinner type="bubbles" class="loading" v-if="loading"></spinner>
            <input type="file" id="file" accept="image/*" @change="handleFileChange" :disabled="isdisabled" ref="file">
          </div>
        </div>
      </div>
      <div v-transfer-dom>
          <x-dialog v-model="show" :dialog-style="{'max-width': '90.6666%', width: '100%', 'background-color': 'transparent'}">
              <div class="chargeback_explain">
                <h2>退单说明</h2>
                <h4> <svg-icon icon-class="ok"></svg-icon> 可退单情形</h4>
                <p>
                  1.不同时间段拨打客户手机3次一直处于关机、正在通话、停机、秒挂、无法接通、空号等情形之一的；<br>
                  2.客户所在城市与实际不符，为异地贷款且无法为其正常办理贷款业务的；<br>
                  3.其它原因造成无法为客户进行放款服务的（具体以客服最终审核结果为准）。
                </p>
                <h4 class="line_top"> <svg-icon icon-class="no"></svg-icon> 不可退单情形</h4>
                <p>
                  1.收到客户信息后24小时内未与客户主动联系的；<br>
                  2.客户订单已经超过24小时的；<br>
                  3.因信贷经理个人沟通方式造成不良后果的（例如：对客户态度恶劣、人身攻击等）；<br>
                  4.淘单客户不可退单，只有优选客户可进行退单；<br>
                  5、退单失败不可再次申请退单。
                </p>
              </div>
              <x-icon type="ios-close-outline" class="close" @click.native="closeDialog"></x-icon>
          </x-dialog>
          <x-dialog v-model="showResult" :dialog-style="{'max-width': '100%', width: '90.6%', 'background-color': 'transparent'}">
              <div class="result_box">
                <div class="result_header">
                  <p>已提交退单申请！</p>
                </div>
                <div class="result_body">
                  <p>审核通过后淘单币在1个工作日<br>内退回你的账户！</p>
                </div>
                <button class="confirm_btn" @click="closeSuccessDialog">我知道了</button>
              </div>
          </x-dialog>
      </div>
    </div>
  </scroll>
  <div class="button_box" ref="button_box">
    <button class="button" :disabled="this.customerData.overTime?true:isdisabled" @click="chargeback">{{this.customerData.overTime?'抢单超过24小时，不可退单':btn_text}}</button>
  </div>
</div>
</template>

<script>
import { Flexbox, FlexboxItem, XDialog, Spinner, TransferDomDirective as TransferDom } from 'vux'
import detailsApi from '@/api/details'
import customerApi from '@/api/customer'
import lrz from 'lrz'
export default {
  directives: {
    TransferDom
  },
  components: {
    Flexbox,
    FlexboxItem,
    XDialog,
    Spinner
  },
  data () {
    return {
      textareaHeight: '',
      show: false,
      tip: '',
      text_num: 0,
      set_color: false,
      itemArr: [
        {
          label: '未接通',
          active: false
        },
        {
          label: '空号',
          active: false
        },
        {
          label: '秒挂',
          active: false
        },
        {
          label: '所在城市错误',
          active: false
        },
        {
          label: '拒接(拨打三次)',
          active: false
        },
        {
          label: '其他',
          active: false
        }],
      customerData: {},
      customerDataDetails: {},
      orderId: null,
      height: '',
      remarkType: '',
      screenshot: '',
      blobURL: require('./img/upload.png'),
      btn_text: '退单',
      loading: false,
      isdisabled: false,
      showResult: false,
      baseUrl: process.env.BASE_API + '/resource/'
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : ''
    }
  },
  methods: {
    getdata () {
      let obj = {
        orderId: this.id
      }
      detailsApi.chargebackDetails(obj).then((res) => {
        if (res.data.code === 0) {
          this.customerData = res.data.data
          this.initFormData()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    showDialog (id, remark) {
      this.orderId = id
      if (remark) {
        this.tip = remark
      }
      this.show = true
    },
    closeDialog () {
      this.show = false
      this.tip = ''
    },
    initFormData () {
      if (this.customerData.id) {
        this.itemArr.forEach((item) => {
          if (this.customerData.reason === item.label) {
            item.active = true
          }
        })
        if (this.customerData.remark) {
          this.tip = this.customerData.remark
        }
        if (this.customerData.callRecordImg.originPath) {
          this.blobURL = this.baseUrl + this.customerData.callRecordImg.originPath
        }
        if (this.customerData.status === 'UNDERWAY') {
          this.isdisabled = true
          this.btn_text = '审核中'
        }
      }
    },
    closeSuccessDialog () {
      this.showResult = false
    },
    selected (item) {
      this.itemArr.forEach(function (item) {
        item.active = false
      })
      item.active = true
      this.remarkType = item.label
    },
    chargeback () {
      if (this.customerData.type === 'OPTIMIZATION' && !this.customerData.id) {
        if (!this.remarkType) {
          this.$vux.toast.text('请选择退单原因', 'middle')
          return false
        } else {
          if (this.remarkType === '其他') {
            if (this.tip === '') {
              this.$vux.toast.text('请填写备注内容', 'middle')
              return false
            } else {
              if (this.screenshot === '') {
                this.$vux.toast.text('请上传证据截图', 'middle')
                return false
              }
            }
          } else {
            if (this.screenshot === '') {
              this.$vux.toast.text('请上传证据截图', 'middle')
              return false
            }
          }
        }
        let obj = {
          orderId: this.id,
          reason: this.remarkType,
          remark: this.tip,
          callRecordImg: this.screenshot
        }
        this.statistics('提交退单申请', {订单ID: this.id})
        customerApi.chargeback(obj).then((res) => {
          if (res.data.code === 0) {
            this.getdata()
            this.showResult = true
            this.scrollTOBottom()
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    filterEmoji () {
      this.tip.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
    },
    autoTextAreaHeight () {
      let h = event.target.scrollTop + event.target.scrollHeight
      console.log(event.target.scrollTop + event.target.scrollHeight)
      if (h > this.textareaHeight) {
        event.target.style.height = event.target.scrollTop + event.target.scrollHeight + 'px'
      }
    },
    scrollTOBottom () {
      window.scrollTo(0, 0)
    },
    handleFileChange (e) {
      if (e.target.files.length === 0) return
      this.loading = true
      lrz(e.target.files[0], { width: 800 }).then((rst) => {
        this.loading = false
        this.screenshot = rst.base64
        this.blobURL = rst.base64
        this.$refs.file.value = '' // 重置表单值，hank两次选择同一张图片不触发change事件
        /* console.log(this.toFixed2(e.target.files[0].size / 1024))
        console.log(this.toFixed2(rst.fileLen / 1024)) */
      }).catch((err) => {
        console.log('压缩图片失败:' + err)
      })
    }
  },
  watch: {
    tip: {
      handler () {
        this.text_num = this.tip.length
        if (this.tip.length === 200) {
          this.set_color = true
        } else {
          this.set_color = false
        }
      }
    }
  },
  mounted () {
    this.getdata()
    this.height = `${document.body.clientHeight - this.headerHeight - this.$refs.button_box.offsetHeight}px`
    this.textareaHeight = this.$refs.textarea.offsetHeight
  }
}
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'money';   /*字体名称*/
          src: url('../../assets/font/DIN-Medium.eot') format('embedded-opentype'), /* IE6-IE8 */
              url('../../assets/font/DIN-Medium.woff') format('woff'),
              url('../../assets/font/DIN-Medium.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
              url('../../assets/font/DIN-Medium.svg') format('svg'); /* iOS 4.1- */
  font-weight: normal;
  font-style: normal;
}
.svg-icon.top_bg{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 157px;
}
  .details_box{
    width: 92%;
    margin: 0 auto;
    background: #F8F9F9;
    border-radius: 7px 7px;
    .base_info_box{
      padding: 15px;
      overflow: hidden;
      background: #fff;
      border-radius: 7px;
      margin-bottom: 10px;
      ul{
        li{
          list-style: none;
          &:not(:last-child){
            margin-bottom: 10px;
          }
          p{
            font-size: 16px;
            line-height: 23px;
            .name_box{
              color: #333;
              font-weight: 600;
              line-height: 25px;
              .svg-icon{
                  font-size: 16px;
                }
            }
            .money{
              color: #F7912F;
              margin-left: 10px;
              font-family: money;
              font-size: 12px;
              em{
                font-style: normal;
                font-size: 24px;
              }
            }
            .tag_box{
              display: inline-block;
              width: 35px;
              height: 19px;
              line-height: 19px;
              margin-left: 10px;
              text-align: center;
              font-size: 12px;
              color: #fff;
              border-radius: 4px;
              &.tao{
                background:linear-gradient(90deg,#9FE048 0%,#55B72B 100%);
                box-shadow:1px 1px 4px 0px #9FE048;/* no */
              }
              &.you{
                background:linear-gradient(90deg,#F9C755 0%,#F77925 100%);
                box-shadow:1px 1px 4px 0px #F9C755;/* no */
              }
            }
          }
          .time{
            margin-left: 10px;
            font-size: 12px;
            color: #9b9b9b;
            line-height: 18px;
          }
          .detail_info{
            margin-top: 20px;
            font-size: 12px;
            line-height: 18px;
            color: #999999;
            span{
              background:rgba(239,243,253,1);
              border-radius:4px;
              color: #1859E1;
              font-size: 12px;
              padding:2px 3px;
              &:not(:first-child){
                margin-left: 10px
              }
            }
          }
        }
      }
    }
    .chargeback_reason,.chargeback_screenshot{
      overflow: hidden;
      background: #fff;
      padding: 15px;
      margin-bottom: 8px;
      border-radius: 7px;
      .title{
        padding-bottom: 15px;
        font-size: 16px;
        line-height: 20px;
        color: #333;
        font-weight: 600;
        border-bottom:1px solid #EEEEEE;
        a{
          float: right;
          font-size: 12px;
          color: #217FFE;
          line-height: 20px;
          .svg-icon{
            width: 14px;
            height: 14px;
            margin-right: 3px;
          }
        }
      }
    }
    .chargeback_screenshot{
      margin-bottom: 0;
      .upload{
        margin-top: 17px;
        width: 80px;
        height: 80px;
        >div{
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          input[type="file"]{
            width: 100%;
            height: 100%;
            opacity: 0;
          }
          .loading{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%)
          }
        }
      }
    }
  }
  .chargeback_box{
    width: 100%;
    overflow: hidden;
    background: #fff;
    .chargeback_body{
      font-size: 0!important;
      position: relative;
      .label_text{
        font-size: 14px;
        color: #333;
        text-align: left;
      }
      textarea{
        width: 100%;
        height: 100px;
        margin-top: 8px;
        resize:none;
        border: 1px solid #eee;
        border-bottom: none;
        background: #F8F8F8;
        outline: none;
        padding:4px 8px 29px;
        box-sizing: border-box;
        font-size: 14px;
        -webkit-appearance: none;
        border-radius: 5px;
      }
      .font_num{
        position: absolute;
        right: 0;
        bottom: 29px;
        text-align: right;
        font-size: 14px;
        color: #999999;
        line-height: 20px;
        border: none;
        border-top: none;
        padding: 0 13px 6px 0;
        border-radius: 0 0 5px 5px;
      }
      .set_color{
        color: #f44336;
      }
    }
    .item_box{
      padding: 8px 0px 0;
      box-sizing: border-box;
      .vux-flexbox-item{
        text-align: center;
        margin-bottom: 8px;
        >div{
          width: 90%
        }
        &:nth-child(1),&:nth-child(4){
          text-align: left;
          >div{
            margin-left: 0;
          }
        }
        &:nth-child(2),&:nth-child(5){
          >div{
            margin: 0 auto;
          }
        }
        &:nth-child(3),&:nth-child(6){
          text-align: right;
          >div{
            display: inline-block;
            margin-right: 0;
          }
        }
        input[type="button"]{
          width: 100%;
          height: 34px;
          line-height: 34px;
          text-align: center;
          color: #9B9B9B;
          font-size: 12px;
          background:#fff;
          border-radius:5px;
          border:1px solid rgba(236,236,236,1);
          outline: none;
          -webkit-appearance: none;
          &.active{
            border: 1px solid #fff;
            color: #FF7B00;
            background: url('./img/active.png') no-repeat center center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .confirm_btn{
      display: block;
      width: 72.6%;
      margin: 50px auto 32px auto;
      border: none;
      outline: none;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
      box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
      border-radius:4px; /* no */
    }
  }
  .chargeback_explain{
    background: #fff;
    padding: 0 18px;
    box-sizing: border-box;
    padding-bottom: 10px;
    border-radius: 13px;
    transform: scale(.85);
    h2{
      padding: 15px 0 20px;
      border-bottom: 1px solid #DDDDDD;
      text-align: center;
      font-size: 16px;
      color: #666666;
      font-weight: 600;
    }
    h4{
      padding: 15px 0 10px;
      text-align: left;
      font-size: 13px;
      color: #333333;
      font-weight: 600;
      &.line_top{
        border-top: 1px solid #DDDDDD;
      }
    }
    p{
      padding-bottom: 18px;
      color: #979797;
      font-size: 13px;
      text-align: left;
      line-height:26px;
    }
  }
  .result_box{
      overflow: hidden;
      background: #fff;
      border-radius: 13px;
      padding: 17px 18px 47px;
      .result_header{
        p{
          padding-bottom: 24px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 42px;
          text-align: center;
          color: #666666;
          border-bottom: 1px solid #dddddd;
        }
      }
      .result_body{
        p{
          word-break: break-all;
          word-wrap: break-word;
          font-size: 14px;
          color: #333;
          font-weight: 400;
          line-height: 20px;
        }
      }
      .confirm_btn{
        display: block;
        width: 73%;
        margin: 33px auto 10px auto;
        border: none;
        outline: none;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
        box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
        border-radius:4px;
      }
    }
  .close{
    margin-top: -25px;
    margin-bottom: 50px;
    fill:#fff;
    width: 40px;
    height: 40px;
    font-size: 40px;
  }
  .button_box{
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0px;
    background: #fff;
    overflow: hidden;
    z-index: 999;
    padding: 8px 0;
    .button{
      margin: 0 auto;
      display: block;
      width: 91.5%;
      height: 45px;
      border: none;
      outline: none;
      color: #fff;
      font-size: 18px;
      line-height: 45px;
      background:linear-gradient(151deg,rgba(66,179,249,1) 0%,rgba(31,124,240,1) 100%);
      border-radius:4px; /* no */
      &:disabled{
        background: #C8C8C8;
      }
    }
    button[disabled="disabled"]{
        background: #d8d8d8
    }
  }
  @media (max-width: 320px) {
    .chargeback_box{
      .item_box{
        padding: 8px 0px 0;
        box-sizing: border-box;
        .vux-flexbox-item{
          text-align: center;
          margin-bottom: 8px;
          >div{
            width: 95%;
          }
        }
      }
    }
  }
</style>
