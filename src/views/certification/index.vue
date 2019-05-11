<template>
  <div class="certification">
    <h2 class="title">基本信息（必填）</h2>
     <group label-width="4.5em" label-margin-right="2em" label-align="center">
       <x-input title="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名" placeholder="请输入真实姓名" text-align="right" placeholder-align="right" v-model="form.name" ref="name" :disabled="nameDisabled" @on-blur="scrollTOBottom"></x-input>
       <x-input title="身份证号" placeholder="请输入身份证号" placeholder-align="right" text-align="right" v-model="form.idCard" type="text" :max="18" @on-blur="validateIdCard" :disabled="idcardDisabled"></x-input>
       <x-input title="公司全称" placeholder="请输入与营业执照一致的全称" @click.native="searchCompany" :readonly="true" placeholder-align="right" text-align="right" v-model="form.orgName" :disabled="orgNameDisabled" @on-blur="validateCompany"></x-input>
       <popup-picker title="公司类型" @on-hide="cancel" :data="list" v-model="form.category" value-text-align="right" :disabled="categoryDisabled" @on-change="statistics('认证-输入公司类型', {})"></popup-picker>
     </group>
     <h2 class="title">上传证明</h2>
     <group label-width="4.5em" label-margin-right="2em" label-align="center">
      <cell title="身份证" is-link link="/uploadidcard" :value="isUpload1"></cell>
      <cell title="资质证明" is-link link="/uploadaptitudes" :value="isUpload2"></cell>
     </group>
     <p class="tip">
       <span>
         *上传材料文字需清晰可见，未涂抹，遮挡，并且在有效期内
       </span>
     </p>
    <button :class="{submit_btn : true, has_auth: false}" @click="submit" :disabled="isdisabled">{{submit_text}}</button>
    <div v-transfer-dom>
      <confirm
      v-model="show"
      :show-cancel-button="false"
      title="提交成功"
      @on-confirm="confirm">
        <p style="text-align:center;">审核时间1-2个工作日</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" :dialog-style="{'max-width': '100%', width: '90.6%', 'background-color': 'transparent'}">
          <div class="auth_box">
            <div class="auth_header">
              <p>认证失败</p>
            </div>
            <div class="auth_body">
              <p>{{failReason}}</p>
            </div>
            <button class="confirm_btn" @click="reEdit">重新提交</button>
          </div>
          <x-icon type="ios-close-outline" class="close" @click.native="closeDialog"></x-icon>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Group, XInput, PopupPicker, Cell, Confirm, XDialog, Search, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import ownApi from '@/api/own'
import userCreditApi from '@/api/userCredit'
// import axios from 'axios'
import Auth from '@/utils/auth'
// import CompanyNameApi from '@/api/company'
export default {
  name: 'certification',
  directives: {
    TransferDom
  },
  components: {
    Group,
    XInput,
    PopupPicker,
    Cell,
    Confirm,
    XDialog,
    Search
  },
  data () {
    return {
      baseUrl: process.env.BASE_API,
      list: [ ['小贷公司', 'p2p网贷', '担保公司', '典当行', '其他'] ],
      form: {
        name: '',
        idCard: '',
        orgName: '',
        category: []
      },
      submit_text: '提交审核',
      show: false,
      showDialog: false,
      isdisabled: false,
      nameDisabled: false,
      idcardDisabled: false,
      orgNameDisabled: false,
      categoryDisabled: false,
      failReason: '',
      isUpload1: '未选择',
      isUpload2: '未选择',
      docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
      resizeHeight: '',
      // companyStatus: false,
      companyErrorMsg: ''
    }
  },
  computed: {
    ...mapGetters({
      idCard: 'idCard',
      aptitudes: 'aptitudes'
    })
  },
  methods: {
    ...mapActions({
      setLoginstatus: 'setLoginstatus',
      setJdbAuthToken: 'setJdbAuthToken',
      setIdCardImg: 'setIdCardImg',
      setAptitudesImg: 'setAptitudesImg'
    }),
    ownStatus () {
      ownApi.ownCertificationStatus().then((res) => {
        if (res.data.code === 0) {
          this.form.name = res.data.data.realName
          this.form.idCard = res.data.data.idCard
          this.form.orgName = res.data.data.institution
          // this.companyStatus = true // 再次提交的时候，公司名称验证可以通过
          this.form.category = new Array(res.data.data.institutionType)
          if (res.data.data.result === 'UNDERWAY') {
            this.isdisabled = true
            this.nameDisabled = true
            this.idcardDisabled = true
            this.orgNameDisabled = true
            this.categoryDisabled = true
            this.isUpload1 = '已上传'
            this.isUpload2 = '已上传'
            this.submit_text = '审核中'
          }
          if (res.data.data.result === 'SUCCESS') {
            this.isdisabled = true
            this.nameDisabled = true
            this.idcardDisabled = true
            this.orgNameDisabled = true
            this.categoryDisabled = true
            this.isUpload1 = '已上传'
            this.isUpload2 = '已上传'
            this.submit_text = '已认证'
          }
          if (res.data.data.result === 'FAIL') {
            this.isdisabled = false
            this.nameDisabled = false
            this.idcardDisabled = false
            this.orgNameDisabled = false
            this.categoryDisabled = false
            this.isUpload1 = '未选择'
            this.isUpload2 = '未选择'
            this.submit_text = '提交审核'
            this.failReason = res.data.data.failReason
            this.showDialog = true
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    validateIdCard () {
      if (this.form.idCard.length === 0) {
        this.$vux.toast.text('请输入身份证号', 'top')
        return false
      } else {
        let res = this.checkIdcard(this.form.idCard)
        if (!res) {
          this.$vux.toast.text('请输入正确的身份证号', 'top')
          return false
        } else {
          let obj = {
            idCard: this.form.idCard
          }
          userCreditApi.validateIdCard(obj).then((res) => {
            if (res.data.code === -1) {
              this.form.idCard = ''
              this.$vux.toast.text(res.data.msg, 'top')
              this.statistics('认证-输入身份证号-已认证', {})
            }
            this.statistics('认证-输入身份证号', {})
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    },
    submit () {
      if (this.form.name.length === 0) {
        this.$vux.toast.text('请输入真实姓名', 'top')
        return false
      } else {
        let namereg = /^[\u4e00-\u9fa5]{2,6}$/
        let res = namereg.test(this.form.name)
        if (!res) {
          this.$vux.toast.text('请输入真实姓名', 'top')
          return false
        }
      }

      if (this.form.idCard.length === 0) {
        this.$vux.toast.text('请输入身份证号', 'top')
        return false
      } else {
        let res = this.checkIdcard(this.form.idCard)
        if (!res) {
          this.$vux.toast.text('请输入正确的身份证号', 'top')
          return false
        }
      }

      if (this.form.orgName.length === 0) {
        this.$vux.toast.text('请输入公司全称', 'top')
        return false
      } else {
        let reg = /[~'!@#￥$%^&*-+_=:]/
        let res = reg.test(this.form.orgName)
        if (res) {
          this.$vux.toast.text('请输入正确的公司全称', 'top')
          return false
        }
        /* if (this.companyStatus) {
          let reg = /[~'!@#￥$%^&*-+_=:]/
          let res = reg.test(this.form.orgName)
          console.log(this.form.orgName)
          if (res) {
            this.$vux.toast.text('请输入正确的公司全称', 'top')
            return false
          }
        } else {
          if (this.companyErrorMsg === 'tax') {
            this.$vux.toast.text('该公司当前欠税，无法认证', 'middle')
          }
          if (this.companyErrorMsg === 'dishonest') {
            this.$vux.toast.text('该公司当前失信，无法认证', 'middle')
          }
          if (this.companyErrorMsg === 'enforcement') {
            this.$vux.toast.text('该公司当前为被执行人，无法认证', 'middle')
          }
          if (this.companyErrorMsg === 'unusual') {
            this.$vux.toast.text('该公司经营异常，无法认证', 'middle')
          }
          return false
        } */
      }

      if (this.form.category.length === 0) {
        this.$vux.toast.text('请选择公司类型', 'top')
        return false
      }
      if (this.idCard === null) {
        this.$vux.toast.text('请上传身份证明', 'top')
        return false
      }
      if (this.aptitudes === null) {
        this.$vux.toast.text('请上资质证明', 'top')
        return false
      } else {
        // 处理参数
        let obj = {}
        obj.realName = this.form.name
        obj.idCard = this.form.idCard
        obj.institution = this.form.orgName
        obj.institutionType = this.form.category[0]
        obj.frontCardImgId = this.idCard.front
        obj.backCardImgId = this.idCard.back
        obj.holdCardImgId = this.idCard.hand
        if (this.aptitudes.card !== null) {
          obj.evidenceImgId = this.aptitudes.card
        }
        if (this.aptitudes.logoImg !== null) {
          obj.logoImgId = this.aptitudes.logoImg
        }
        this.statistics('提交认证', {})
        // api请求
        userCreditApi.certification(obj).then((res) => {
          if (res.data.code === 0) {
            this.show = true
          }
          if (res.data.code === -1) {
            this.$vux.toast.text(res.data.msg, 'middle')
          }
          if (res.data.code === -2) {
            this.setLoginstatus(false)
            this.setJdbAuthToken(null)
            Auth.setAuthLoginStatus(false)
            Auth.removeUserInfo()
            let ua = navigator.userAgent.toLowerCase()
            if (ua.indexOf('micromessenger') > -1) {
              setTimeout(() => {
                this.$router.push('/index')
              }, 2000)
            } else {
              this.$vux.toast.text('身份已过期，请重新登录', 'middle')
              setTimeout(() => {
                this.$router.push('/login')
              }, 2000)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    confirm () {
      this.show = false
      this.ownStatus()
      this.setIdCardImg(null)
      this.setAptitudesImg(null)
    },
    closeDialog () {
      this.showDialog = false
    },
    reEdit () {
      this.showDialog = false
      this.$refs.name.focus()
    },
    checkIdcard (value) {
      if (value.length === 0) {
        return true
      } else {
        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
        var status = regIdCard.test(value)
        if (status) {
          if (value.length === 18) {
            var idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
            var idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
              idCardWiSum += value.substring(i, i + 1) * idCardWi[i]
            }

            var idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
            var idCardLast = value.substring(17) // 得到最后一位身份证号码

            // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod === 2) {
              if (idCardLast === 'X' || idCardLast === 'x') {
                // alert("恭喜通过验证啦！");
                return true
              } else {
                // alert("身份证号码错误！");
                return false
              }
            } else {
              // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
              if (idCardLast === idCardY[idCardMod].toString()) {
                // alert("恭喜通过验证啦！");
                return true
              } else {
                // alert("身份证号码错误！");
                return false
              }
            }
          }
        } else {
          // alert("身份证格式不正确!")
          return false
        }
      }
    },
    cancel (type) {
      if (!type) {
        this.form.category = []
      }
    },
    scrollTOBottom () {
      window.scrollTo(0, 0)
      this.statistics('认证-输入姓名', {})
    },
    validateCompany () {
      window.scrollTo(0, 0) // 解决键盘弹起页面卡住不下来bug
      this.statistics('认证-输入公司全称', {})
    },
    searchCompany () {
      if (!this.orgNameDisabled) {
        this.$router.push('/company')
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.show = false
    this.showDialog = false
    next()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.path === '/own') {
        vm.ownStatus()
      }
      if (from.path === '/uploadidcard') {
        if (vm.idCard !== null) {
          vm.isUpload1 = '已选择'
        }
      }
      if (from.path === '/uploadaptitudes') {
        if (vm.aptitudes !== null) {
          vm.isUpload2 = '已选择'
        }
      }
      if (from.path === '/company') {
        vm.form.orgName = vm.$route.query.company
      }
      /* if (from.path === '/company') {
        vm.form.orgName = vm.$route.query.company
        let obj = {
          key: vm.$route.query.company
        }
        CompanyNameApi.validateCompany(obj).then((res) => {
          if (res.data.code === -1) {
            vm.companyErrorMsg = res.data.msg
            if (res.data.msg === 'tax') {
              vm.$vux.toast.text('该公司当前欠税，无法认证', 'middle')
            }
            if (res.data.msg === 'dishonest') {
              vm.$vux.toast.text('该公司当前失信，无法认证', 'middle')
            }
            if (res.data.msg === 'enforcement') {
              vm.$vux.toast.text('该公司当前为被执行人，无法认证', 'middle')
            }
            if (res.data.msg === 'unusual') {
              vm.$vux.toast.text('该公司经营异常，无法认证', 'middle')
            }
            vm.companyStatus = false
          }
          if (res.data.code === 0) {
            vm.companyStatus = true
          }
        })
      } */
      // 通过 `vm` 访问组件实例
    })
  },
  mounted () {
    this.ownStatus()
    // window.onresize监听页面高度的变化
    /* window.onresize = () => {
      return (() => {
        this.resizeHeight = document.body.clientHeight
        console.log(`resizeHeight: ${this.resizeHeight}`)
      })()
    } */
  }
}
</script>

<style lang="less" scoped>
  .certification{
    padding-bottom: 50px;
    overflow: hidden;
    .title{
      font-size: 16px;
      font-weight: 500;
      color: #333;
      line-height: 53px;
      padding-left: 15px;
      background:rgba(243,243,243,1);
    }
    .tip{
      display: block;
      line-height: 52px;
      background:rgba(243,243,243,1);
      text-align: center;
      span{
        display: inline-block;
        transform: scale(0.9);
        text-align: center;
        font-size: 12px;
        color: #999;
        font-weight: 500;
      }
    }
    .submit_btn{
      display: block;
      margin: 36px auto 0 auto;
      width: 91.5%;
      border: none;
      outline: none;
      font-size: 18px;
      color: #fff;
      box-sizing: border-box;
      line-height: 40px;
      text-align: center;
      background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
      box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
      border-radius:4px;
    }
    .submit_btn[disabled='disabled'] {
      background:linear-gradient(154deg,#FED7A3 0%,#FA725A 100%);
    }
    .has_auth{
      background: #D8D8D8;
    }
    .vux-cell-box{
      .weui-cell{
        height: 52px;
        box-sizing: border-box;
      }
    }
    .weui-cell{
      height: 52px;
      box-sizing: border-box;
      font-size: 16px;
      background: #fff;
    }
  }
  .auth_box{
      overflow: hidden;
      background: #fff;
      border-radius: 13px;
      padding: 50px 22px;
      .auth_header{
        p{
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 42px;
          text-align: center;
          color: #333;
        }
      }
      .auth_body{
        max-height: 120px;
        overflow-y: auto;
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
        margin: 40px auto 10px auto;
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
      margin-top: 20px;
      fill:#fff;
      width: 40px;
      height: 40px;
      font-size: 40px;
    }
</style>
