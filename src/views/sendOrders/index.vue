<template>
  <div class="filter_container">
    <scroll ref="scroll" :style="{height: height}">
      <div>
        <div class="explain_box">
          <img src="./img/send_orders_icon.png">
          <span>设置派单后优选订单您将一手独享</span>
          <button @click="showRuleDialog">说明</button>
        </div>
        <div class="filter_box">
          <div v-if="!moneyRadio" class="bottom_line">
            <h2 class="title">贷款额度（多选）
              <router-link to="" @click.native="goSetSendOrdersCity">
              <span v-if="selectedCity">{{selectedCity}}</span>
              <span v-else>定位中<spinner type="dots" :size="'16px'"></spinner></span>
              <svg-icon icon-class="xia"></svg-icon>
              </router-link>
            </h2>
            <div class="item_box">
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="4" v-for="(item, index) in LoanMoney" :key="index">
                  <div class="item">
                    <p class="text" :class="{selected: item.active }">{{item.label}}</p>
                    <input type="checkbox" :value="item.label" v-model="item.active" :disabled="hasStart">
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
          </div>

          <div v-else class="bottom_line">
            <h2 class="title">贷款额度（单选）
              <router-link :to="{ path: '/setsendorderscity', query: { 'sendordersCity': selectedCity } }">
              <span v-if="selectedCity">{{selectedCity}}</span>
              <span v-else>定位中<spinner type="dots" :size="'16px'"></spinner></span>
              <svg-icon icon-class="xia"></svg-icon>
              </router-link>
            </h2>
            <div class="item_box">
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="4" v-for="(item, index) in LoanMoney" :key="index">
                  <div class="item">
                    <p class="text" :class="{selected: item.active }">{{item.label}}</p>
                    <input type="radio" :value="item.label" v-model="form.loanMoney" :disabled="hasStart">
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
          </div>

          <div class="bottom_line">
            <h2 class="title">资产情况（多选）</h2>
            <div class="item_box">
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="4" v-for="(item, index) in Asset" :key="index">
                  <div class="item">
                    <p class="text" :class="{selected: item.active }">{{item.label}}</p>
                    <input type="checkbox" :value="item.label" @click="selectedAsset(item)" :disabled="hasStart">
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
          </div>

          <group>
            <cell title="派单数量" class="bottom_line" v-if="!sendOrderProgress">
              <inline-x-number style="display:block;" :min="1" :max="5" width="50px" button-style="round" v-model="form.requirement"></inline-x-number>
            </cell>
            <cell :title="'派单进度('+ requirement +'单)'" class="bottom_line" v-else>
              <div class="circle_box">
                <x-circle
                :percent="percent "
                :trail-width="2"
                :stroke-width="6"
                stroke-color="#1f7cf0">
                <span>{{ percent  }}%</span>
              </x-circle>
              </div>
            </cell>
          </group>

          <div class="tip">
            <h2>温馨提示：</h2>
            <p>1.派单时间:工作日(08:00 - 20:00)</p>
            <p>2.一轮派单完成才可修改设置</p>
          </div>
        </div>
      </div>
    </scroll>
    <div class="bottom_btn_box" ref="button_box">
      <button class="btn closeBtn" @click="closeSendOrder" v-if="isStartSendOrders">关闭派单</button>
      <button class="btn"  v-if="isStartSendOrders">正在派单</button>
      <button class="btn start" @click="startSendOrder" v-if="hideStartSendOrders">开启派单</button>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="ruleDialog" :hide-on-blur="true"  :dialog-style="{'max-width': '100%', width: '90%', 'background-color': 'transparent'}">
          <div class="rule_box">
            <h1>派单说明</h1>
            <div class="content">
              <p>1、派单申请后平台会根据您的需求优先、独享派送给您并自动扣除45淘单币；</p>
              <p>2、您提交派单申请后平台会自动将符合您需求的单子存入您的客户管理页面中；</p>
              <p>3、平台完全派送完您上次申请的单子后方可进行下一轮派单申请；</p>
              <p>4、所有派送的单子需收到后及时与客户联系，如因为联系不及时造成不成单的，不予退单。</p>
            </div>
          </div>
        <x-icon type="ios-close-outline" class="close_btn" @click.native="closeRuleDialog"></x-icon>
      </x-dialog>
      <x-dialog v-model="confirmDialog" :hide-on-blur="true"  :dialog-style="{'max-width': '100%', width: '90%', 'background-color': 'transparent'}">
          <div class="confirm_box">
            <a href="javascript:;" class="close_box" @click="close">
              <img src="./img/close.png">
            </a>

            <h2>关闭派单后将不再派单，是否关闭？</h2>
            <div class="confirm_btn_box">
              <div class="confirm_item">
                <button class="btn close" @click="cancel">取消</button>
              </div>
              <div class="confirm_item">
                <button class="btn" @click="confirm">确认</button>
              </div>
            </div>
          </div>
      </x-dialog>
      <x-dialog v-model="notSufficientFunds" :hide-on-blur="true"  :dialog-style="{'max-width': '100%', width: '90%', 'background-color': 'transparent'}">
          <div class="confirm_box">
            <a href="javascript:;" class="close_box" @click="close2">
              <img src="./img/close.png">
            </a>

            <h2>账户余额不足225，不可设置派单，是否立即充值？</h2>
            <div class="confirm_btn_box">
              <div class="confirm_item">
                <button class="btn close" @click="cancel2">取消</button>
              </div>
              <div class="confirm_item">
                <button class="btn" @click="confirm2">确认</button>
              </div>
            </div>
          </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import { Group, PopupPicker, Cell, Spinner, Flexbox, FlexboxItem, InlineXNumber, XDialog, XCircle, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import filterApi from '@/api/filter'
import axios from 'axios'
import Auth from '@/utils/auth'
import indexApi from '@/api/index'
import sendOrdersApi from '@/api/sendOrders'
export default {
  name: 'sendOrders',
  directives: {
    TransferDom
  },
  components: {
    Group,
    PopupPicker,
    Cell,
    Spinner,
    Flexbox,
    FlexboxItem,
    InlineXNumber,
    XDialog,
    XCircle
  },
  data () {
    return {
      height: '',
      selectedCity: '',
      LoanMoney: [],
      // Age: [],
      Asset: [
        /* {
          key: 'car',
          label: '有车产',
          value: '有车产',
          active: false
        },
        {
          key: 'house',
          label: '有房产',
          value: '有房产',
          active: false
        },
        {
          key: 'hasPolicy',
          label: '有保单',
          value: '有',
          active: false
        } */
      ],
      form: {
        // money: [],
        // age: []
        requirement: 1
      },
      moneyRadio: false, // 是否单选,
      ruleDialog: false,
      confirmDialog: false,
      isStartSendOrders: false,
      hideStartSendOrders: false,
      sendOrderProgress: false, // 派单进度,
      percent: 0, // 已派单数比例,
      assetSelectCount: 0,
      notSufficientFunds: false,
      hasStart: false // 派单开启之后禁用条件选择项
    }
  },
  computed: {
    ...mapGetters({
      sendOrdersCity: 'sendOrdersCity'
    })
  },
  methods: {
    goSetSendOrdersCity () {
      if (!this.hasStart) {
        this.$router.push({ path: '/setsendorderscity', query: { 'sendordersCity': this.selectedCity } })
      }
    },
    ...mapActions({
      setSendOrdersCity: 'setSendOrdersCity'
    }),
    copy (obj) {
      let newobj = {}
      for (let attr in obj) {
        newobj[attr] = obj[attr]
      }
      return newobj
    },
    startSendOrder () { // 开启派单
      this.$set(this.form, 'city', this.sendOrdersCity)

      sendOrdersApi.startSendOrders(this.form).then((res) => {
        if (res.data.code === 0) {
          this.isStartSendOrders = true
          this.hideStartSendOrders = false
          this.getSendOrderFilter() // 初始化筛选条件
        }
        if (res.data.code === -1) {
          this.$vux.toast.text(res.data.msg, 'middle')
        }
        if (res.data.code === -1001) {
          this.notSufficientFunds = true
        }
        if (res.data.code === -1011 || res.data.code === -1012) {
          this.$vux.toast.text('', 'middle')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    closeSendOrder () { // 关闭派单
      this.confirmDialog = true
    },
    confirm () {
      sendOrdersApi.closeSendOrders().then((res) => {
        this.confirmDialog = false
        if (res.data.code === 0) {
          this.isStartSendOrders = false
          this.hideStartSendOrders = true
          this.getSendOrderFilter() // 初始化筛选条件
        }
        if (res.data.code === -1) {
          this.$vux.toast.text(res.data.msg, 'middle')
        }
      })
    },
    cancel () {
      this.confirmDialog = false
    },
    confirm2 () {
      this.notSufficientFunds = false
      this.$router.push('/recharge')
    },
    cancel2 () {
      this.notSufficientFunds = false
    },
    getSendOrderFilter () { // 获取已派单的筛选条件，及状态
      sendOrdersApi.getSendOrdersFilter().then((res) => {
        if (res.data.code === 0) {
          Auth.setSendOrdersFilterItem(res.data.data)
          let FilterItem = res.data.data
          if (FilterItem.status !== 'CLOSED' && FilterItem.status !== null && FilterItem.status !== 'COMPLETE') {
            this.isStartSendOrders = true
            this.hideStartSendOrders = false
            this.sendOrderProgress = true
            this.hasStart = true
            if (FilterItem.loanMoney) {
              let moneyArr = FilterItem.loanMoney
              this.LoanMoney.map((item) => {
                item.active = false // 重置所有，防止当默认选中项不选时，也显示选中
                moneyArr.map((value) => {
                  if (value === item.value) {
                    item.active = true
                  }
                })
              })
            }

            let assetArr = []
            if (FilterItem.car) {
              assetArr.push('car')
            }
            if (FilterItem.house) {
              assetArr.push('house')
            }
            if (FilterItem.socialSecurity) {
              assetArr.push('socialSecurity')
            }
            if (FilterItem.providentFund) {
              assetArr.push('providentFund')
            }
            if (FilterItem.weilidai) {
              assetArr.push('weilidai')
            }
            if (FilterItem.policy) {
              assetArr.push('policy')
            }
            if (FilterItem.creditCard) {
              assetArr.push('creditCard')
            }
            this.Asset.map((item) => {
              item.active = false // 重置所有，防止当默认选中项不选时，也显示选中
              assetArr.map((value) => {
                if (value === item.key) {
                  item.active = true
                }
              })
            })

            if (FilterItem.requirement) { // 同步派单数量
              this.form.requirement = FilterItem.requirement
            }
            if (FilterItem.city) {
              this.setSendOrdersCity(FilterItem.city)
            } else {
              this.initCity() // 如果不存在就初始化城市
            }
            if (((FilterItem.current / FilterItem.requirement) * 100) % 1 !== 0) { // 如果是小数
              this.percent = +((FilterItem.current / FilterItem.requirement) * 100).toFixed(1) // 进度比例
            } else {
              this.percent = (FilterItem.current / FilterItem.requirement) * 100 // 进度比例
            }

            this.requirement = FilterItem.requirement
          } else {
            this.isStartSendOrders = false
            this.hideStartSendOrders = true
            this.sendOrderProgress = false
            this.hasStart = false
            this.LoanMoney.map((item, index) => {
              if (index === 0) {
                item.active = true
              } else {
                item.active = false
              }
            })
            this.Asset.map((item, index) => {
              if (index === 0) {
                item.active = true
              } else {
                item.active = false
              }
            })
            this.form.requirement = 1 // 重置派单数量
          }
        }
      })
    },
    selectedAsset (item) {
      if (item.active !== true) {
        if (this.assetSelectCount >= 3) {
          this.$vux.toast.text('只可选择3个条件！', 'middle')
          return false
        }
      }
      if (item.active) {
        this.assetSelectCount -= 1
      } else {
        this.assetSelectCount += 1
      }

      item.active = !item.active
    },
    getFilter () {
      filterApi.getFilterList().then((res) => {
        if (res.data.code === 0) {
          res.data.data.loanMoney.options.map((item, index) => {
            if (index === 0) {
              item.active = true
            } else {
              item.active = false
            }
          })
          this.LoanMoney = res.data.data.loanMoney.options

          /* res.data.data.age.options.map((item) => {
            item.active = false
          })
          this.Age = res.data.data.age.options */

          let carObj = res.data.data.car.options[0]
          carObj.active = false
          carObj.key = res.data.data.car.key

          let houseObj = res.data.data.house.options[0]
          houseObj.active = false
          houseObj.key = res.data.data.house.key

          let socialSecurityObj = res.data.data.socialSecurity.options[0]
          socialSecurityObj.active = false
          socialSecurityObj.key = res.data.data.socialSecurity.key

          let providentFundObj = res.data.data.providentFund.options[0]
          providentFundObj.active = false
          providentFundObj.key = res.data.data.providentFund.key

          let weilidaiObj = res.data.data.weilidai.options[0]
          weilidaiObj.active = false
          weilidaiObj.key = res.data.data.weilidai.key

          let policyObj = res.data.data.policy.options[0]
          policyObj.active = false
          policyObj.key = res.data.data.policy.key

          let creditCardObj = res.data.data.creditCard.options[0]
          creditCardObj.active = false
          creditCardObj.key = res.data.data.creditCard.key

          let itemArr = []

          itemArr.push(carObj)
          itemArr.push(houseObj)
          itemArr.push(socialSecurityObj)
          itemArr.push(providentFundObj)
          itemArr.push(weilidaiObj)
          itemArr.push(policyObj)
          itemArr.push(creditCardObj)
          this.Asset = itemArr
          this.Asset[0].active = true

          this.getSendOrderFilter() // 初始化派单筛选条件
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    initCity () {
      let sendOrdersFilterItem = Auth.getSendOrdersFilterItem()
      if (sendOrdersFilterItem && sendOrdersFilterItem.city) {
        this.setSendOrdersCity(sendOrdersFilterItem.city)
      } else {
        if (!Auth.getCurrentCity()) {
          indexApi.getCity().then((res) => {
            if (res.data.code === 0) {
              if (res.data.data !== null) {
                this.setSendOrdersCity(res.data.data)
                // this.selectedCity = res.data.data
              } else {
                this.getCity()
              }
            }
            if (res.data.code === -1) {
              this.getCity()
            }
          })
        } else {
          this.setSendOrdersCity(Auth.getCurrentCity())
        }
      }
    },
    getCity () {
      this.$vux.loading.show({
        text: '加载中...'
      })
      axios({
        url: 'https://elm.cangdu.org/v1/cities?type=guess',
        method: 'get',
        timeout: 2000 // request timeout
      }).then((res) => {
        this.$vux.loading.hide()
        if (res.status === 200) {
          // this.selectedCity = res.data.name
          this.setSendOrdersCity(res.data.name)
        } else {
          this.setSendOrdersCity('上海')
        }
      }).catch((err) => {
        this.$vux.loading.hide()
        this.setSendOrdersCity('上海')
        console.log(err)
      })
    },
    showRuleDialog () {
      this.ruleDialog = true
    },
    closeRuleDialog () {
      this.ruleDialog = false
    },
    close () {
      this.confirmDialog = false
    },
    close2 () {
      this.notSufficientFunds = false
    }
  },
  watch: {
    sendOrdersCity: {
      handler () {
        console.log(this.sendOrdersCity)
        if (this.sendOrdersCity === '') {
          this.selectedCity = '不限'
        } else {
          this.selectedCity = this.sendOrdersCity
        }
      }
    },
    LoanMoney: {
      handler () {
        let arr = []
        this.LoanMoney.map((item) => {
          if (item.active) {
            arr.push(item.label)
          }
        })
        if (arr.length !== 0) {
          this.$set(this.form, 'loanMoney', arr)
        } else {
          delete this.form.loanMoney
        }
      },
      deep: true
    },
    'form.loanMoney': {
      handler () {
        if (this.moneyRadio) {
          this.LoanMoney.map((item) => {
            if (item.label === this.form.loanMoney) {
              item.active = true
            } else {
              item.active = false
            }
          })
        }
      }
    },
    Age: {
      handler () {
        let arr = []
        this.Age.map((item) => {
          if (item.active) {
            arr.push(item.label)
          }
        })
        if (arr.length !== 0) {
          this.$set(this.form, 'age', arr.join(','))
        } else {
          delete this.form.age
        }
        // this.form.age = arr
      },
      deep: true
    },
    'form.age': {
      handler () {
        if (this.ageRadio) {
          this.Age.map((item) => {
            if (item.label === this.form.age) {
              item.active = true
            } else {
              item.active = false
            }
          })
        }
      }
    },
    Asset: {
      handler () {
        let assetSelectCount = 0
        this.Asset.map((item) => {
          if (item.active) {
            assetSelectCount += 1
            this.$set(this.form, item.key, item.value)
          } else {
            if (this.form.hasOwnProperty(item.key)) {
              delete this.form[item.key] // 取消选择是删除该属性
            }
          }
          this.assetSelectCount = assetSelectCount
        })
      },
      deep: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      window.onpopstate = () => {
        vm.$router.push('/own')
      }
      window.history.pushState('forward', null, '#')
      window.history.forward(1)

      if (!new RegExp('setsendorderscity').test(from.path)) {
        vm.getFilter()
        vm.initCity()
      } else {
        if (vm.LoanMoney.length === 0) {
          vm.getFilter()
          vm.initCity()
        }
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    window.onpopstate = null
    next()
  },
  mounted () {
    this.$nextTick(function () {
      this.height = `${document.body.clientHeight - 49}px`
    })
  }
}
</script>

<style lang="less" scoped>
.filter_container{
  background: #F7F7F7;
}
.bottom_line{
  border-bottom: 1px solid #FBFBFB;
}
.circle_box{
  width: 40px;
  height: 40px;
  span{
    font-size: 12px;
    line-height: 23px;
    transform: scale(.8);
    display: inline-block;
  }
}
.explain_box{
  width: 100%;
  height: 44px;
  background: url(./img/explain_bg.png) no-repeat center center;
  background-size: cover;
  font-size: 0;
  img{
    width: 21px;
    height: 24px;
    margin: 10px 10px 0px 15px;
    float: left;
  }
  span{
    display: inline-block;
    line-height: 44px;
    font-size: 13px;
    color: #fff;
  }
  button{
    width: 52px;
    display: block;
    float: right;
    margin: 10px 15px 0px 0px;
    border: none;
    outline: none;
    line-height: 25px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    background: #FD7034;
    border-radius: 20px;
  }
}
.filter_box{
  padding: 0 15px 20px;
  background: #fff;
  overflow: hidden;
  .title{
    font-size: 14px;
    color: #333333;
    font-weight: normal;
    padding: 9px 0;
    margin-top: 4px;
    line-height: 25px;
    a{
      float: right;
      display: block;
      font-size: 16px;
      padding: 0 5px;
      color: #333333;
      .svg-icon{
        width: 9px;
        height: 6px;
        color: #2C2C2C;
        vertical-align: middle;
        margin-left: 4px;
      }
    }
  }
  .item_box{
    padding: 8px 0px 0;
    margin: 0 15px;
    box-sizing: border-box;
    .vux-flexbox-item{
      text-align: center;
      margin-bottom: 12px;
      .item{
        width: 85%;
        height: 39px;
        position: relative;
        .text{
          width: 100%;
          line-height: 39px;
          text-align: center;
          color: #343434;
          font-size: 13px;
          background-color: #F7F7F7;
          &.selected{
            background-color: #D6E9FF;
            color: #0A80FA;
            &::after{
              position: absolute;
              right: 0;
              bottom: 0;
              content: '';
              width: 0;
              height: 0;
              border-bottom: 15px solid #0A80FA;
              border-left: 25px solid transparent;
              background: url(./img/gou.png) no-repeat right bottom;
              background-size: 12px 8px;
              z-index: 99;
            }
            &::before{
              position: absolute;
              right: 1px;
              bottom: 1px;
              content: '';
              width: 12px;
              height: 8px;
              background: url(./img/gou.png) no-repeat center center;
              background-size: 10px 6px;
              z-index: 100;
            }
          }
        }
      }
      &:nth-child(1),&:nth-child(4){
        text-align: left;
        .item{
          display: inline-block;
          margin-left: 0;
        }
      }
      &:nth-child(2),&:nth-child(5){
        .item{
          margin: 0 auto;
        }
      }
      &:nth-child(3),&:nth-child(6){
        text-align: right;
        .item{
          display: inline-block;
          margin-right: 0;
        }
      }
      input[type="checkbox"]{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 39px;
        line-height: 39px;
        text-align: center;
        color: #9B9B9B;
        font-size: 14px;
        border-radius:2px;
        outline: none;
        -webkit-appearance: none;
        opacity: 0;
      }
      input[type="radio"]{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 39px;
        line-height: 39px;
        text-align: center;
        color: #9B9B9B;
        font-size: 14px;
        border-radius:2px;
        outline: none;
        -webkit-appearance: none;
        opacity: 0;
      }
    }
  }
  .tip{
    margin-top: 12px;
    font-size: 14px;
    color: #666666;
    line-height: 24px;
    h2{
      font-size: 14px;
      font-weight: normal;
    }
  }
}
.bottom_btn_box{
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0px;
  background: #fff;
  overflow: hidden;
  z-index: 999;
  .btn{
    width: 50%;
    float: left;
    display: block;
    border: none;
    outline: none;
    line-height: 50px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    background:linear-gradient(90deg,#52AFF9 0%,rgba(31,124,240,1) 100%);
    &.closeBtn{
      background: #fff;
      color: #343434;
    }
    &.start{
      width: 100%
    }
  }
}

.rule_box{
  background-color: #fff;
  padding: 0 15px;
  box-sizing: border-box;
  text-align: left;
  border-radius: 3px;
  h1{
    margin-bottom: 15px;
    padding-top: 25px;
    font-size: 16px;
    color: #333333;
    text-align: center;
    font-weight: 600;
  }
  .content{
    padding-bottom: 25px;
    p{
      font-size: 13px;
      color: #999999;
    }
  }
}

.confirm_box{
  position: relative;
  background-color: #fff;
  padding: 0 15px;
  box-sizing: border-box;
  text-align: left;
  border-radius: 3px;
  overflow: hidden;
  .close_box{
    position: absolute;
    top:0;
    right: 0;
    width: 45px;
    height: 45px;
    text-align: center;
    img{
      margin-top: 15px;
      display: inline-block;
      width: 11px;
      height: 15px;
    }
  }
  h2{
    margin-bottom: 15px;
    margin-top: 70px;
    font-size: 16px;
    color: #333333;
    text-align: center;
    font-weight: 600;
  }
  .confirm_btn_box{
    margin-top: 47px;
    overflow: hidden;
    padding-bottom: 30px;
    .confirm_item{
      width: 50%;
      float: left;
      button{
        width: 100px;
        margin: 0 auto;
        display: block;
        border: none;
        outline: none;
        line-height: 40px;
        color: #fff;
        text-align: center;
        font-size: 18px;
        background:linear-gradient(90deg,#52AFF9 0%,rgba(31,124,240,1) 100%);
        border-radius: 4px;
        &.close{
          line-height: 38px;
          background: #fff;
          color: #0A80FA;
          border: 1px solid #0A80FA;
        }
      }
    }
  }
}

.close_btn{
  margin-top: 20px;
  fill:#fff;
  width: 40px;
  height: 40px;
  font-size: 40px;
}
  @media (max-width: 320px) {
    .filter_box .item_box{
      margin: 5px;
    }
  }
</style>
