<template>
  <div class="feedback_box">
    <h2 class="title">您的反馈是：</h2>
    <flexbox :gutter="0" wrap="wrap">
       <flexbox-item :span="4" v-for="(item, index) in list" :key="index">
         <input :class="{active: item.active}" type="button" :value="item.label" @click="selected(item)">
       </flexbox-item>
    </flexbox>
    <h2 class="title">反馈内容：</h2>
    <div class="content_box">
      <textarea v-model="content"></textarea>
    </div>
    <button class="btn" @click="submit">提交</button>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" :dialog-style="{'max-width': '100%', width: '90.6%', 'background-color': 'transparent'}">
          <div class="feedback_res">
            <div class="feedback_body">
              <svg-icon icon-class="paySuccess"></svg-icon>
              <h2>反馈成功！</h2>
              <p>感谢您对淘单宝的关注与支持，我们会认真处理您的反馈，尽快修复和完善相关功能。</p>
            </div>
          </div>
          <x-icon type="ios-close-outline" class="close" @click.native="closeDialog"></x-icon>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XDialog, TransferDomDirective as TransferDom } from 'vux'
import ownApi from '@/api/own'
export default {
  directives: {
    TransferDom
  },
  components: {
    Flexbox,
    FlexboxItem,
    XDialog
  },
  data () {
    return {
      showDialog: false,
      list: [
        {
          label: '充值',
          val: 'RechargeAndWithdraw',
          active: false
        },
        {
          label: '产品功能',
          val: 'Product',
          active: false
        },
        {
          label: '服务态度',
          val: 'Service',
          active: false
        },
        {
          label: '抢单流程',
          val: 'Order',
          active: false
        },
        {
          label: '界面设计',
          val: 'PageDesign',
          active: false
        },
        {
          label: '其他',
          val: 'Other',
          active: false
        }
      ],
      category: '',
      categoryText: '',
      content: ''
    }
  },
  methods: {
    selected (item) {
      this.list.forEach(function (item) {
        item.active = false
      })
      item.active = true
      this.category = item.val
      this.categoryText = item.label
    },
    submit () {
      if (this.category.length === 0) {
        this.$vux.toast.text('请选择反馈类型', 'middle')
        return false
      }
      if (this.content.length === 0) {
        this.$vux.toast.text('请填写反馈内容', 'middle')
        return false
      }
      // api 请求
      let obj = {
        type: this.category,
        content: this.content
      }
      this.statistics('提交意见反馈', {反馈类型: this.categoryText, 反馈内容: this.content})
      this.$vux.loading.show({
        text: '加载中...'
      })
      ownApi.feedBack(obj).then((res) => {
        if (res.data.code === 0) {
          this.$vux.loading.hide()
          this.showDialog = true
        }
      })
      /* setTimeout(() => {
        this.showDialog = true
      }, 1000) */
    },
    closeDialog () {
      this.showDialog = false
      this.$router.push('/set')
    }
  }
}
</script>

<style lang="less" scoped>
.feedback_box{
  padding: 15px;
  .title{
    font-size: 16px;
    color: #333333;
    font-weight: normal;
    box-sizing: border-box;
    margin-bottom: 16px;
  }
  .vux-flexbox{
    margin-bottom: 20px;
  }
  .vux-flexbox-item{
    padding: 0 5px;
    box-sizing: border-box;
    text-align: center;
    margin-bottom: 16px!important;
    &:first-child{
      margin-bottom: 16px!important;
    }
    input[type="button"]{
      width: 84.3%;
      border: 1px solid #666;
      outline: none;
      background: inherit;
      padding: 7px 0;
      color: #333;
    }
    .active{
      border: 1px solid #4AA7F8!important;
      color: #1F7CF0!important;
    }
  }
  .content_box{
    margin-top: 20px;
    padding: 0 10px;
    textarea{
      width: 100%;
      padding-left: 8px;
      height: 176px;
      resize:none;
      outline: none;
      border: 1px solid #D8D8D8;
    }
  }
  .btn{
      display: block;
      width: 91.5%;
      margin: 57px auto 100px;
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
.feedback_res{
      overflow: hidden;
      background: #fff;
      border-radius: 13px;
      padding: 50px 22px;
      .feedback_body{
        .svg-icon{
          display: block;
          margin: 0 auto;
          width: 67px;
          height: 67px;
          color: #1F7CF0;
        }
        h2{
          font-size: 18px;
          color: #333333;
          margin: 22px 0 33px;
          text-align: center;
        }
        p{
          font-size: 14px;
          color: #333;
          font-weight: 400;
          line-height: 20px;
        }
      }
    }
    .close{
      margin-top: 20px;
      fill:#fff;
      width: 40px;
      height: 40px;
      font-size: 40px;
    }
</style>
