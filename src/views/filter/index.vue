<template>
<div class="filter_container">
  <scroll ref="scroll" :style="{height: height}">
    <div class="filter_box">
      <!-- <group> -->
        <!-- <cell title="城市" is-link link="/city" :value="selectedCity"></cell> -->
        <!-- <popup-picker title="借款额度" :data="list" v-model="form.money" placeholder="不限" @on-hide="onHideMoney"></popup-picker>
        <popup-picker title="年龄区间" :data="list2" v-model="form.age" placeholder="不限" @on-hide="onHideAge"></popup-picker> -->
        <!-- <popup-picker title="客户类型" :data="list3" v-model="form.category" placeholder="不限" @on-hide="onHideCate"></popup-picker> -->
        <!-- <popup-picker title="是否有房" :data="list4" v-model="form.house" placeholder="不限" @on-hide="onHideHouse"></popup-picker>
        <popup-picker title="是否有车" :data="list5" v-model="form.car" placeholder="不限" @on-hide="onHideCar"></popup-picker>
        <popup-picker title="是否有保单" :data="list6" v-model="form.baodan" placeholder="不限" @on-hide="onHidebao"></popup-picker> -->
      <!-- </group> -->
      <div v-if="moneyMulti" class="bottom_line">
        <h2 class="title">贷款额度（多选）
          <router-link to="/city">
          <span v-if="selectedCity">{{selectedCity}}</span>
          <span v-else>获取中<spinner type="dots" :size="'16px'"></spinner></span>
          <svg-icon icon-class="xia"></svg-icon>
          </router-link>
        </h2>
        <div class="item_box">
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="4" v-for="(item, index) in LoanMoney" :key="index">
              <div class="item">
                <p class="text" :class="{selected: item.active }">{{item.label}}</p>
                <input type="checkbox" :value="item.label" v-model="item.active">
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>

      <div v-else class="bottom_line">
        <h2 class="title">贷款额度（单选）
          <router-link to="/city">
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
                <input type="radio" :value="item.label" v-model="form.loanMoney">
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>

      <div v-if="ageMulti" class="bottom_line">
        <h2 class="title">年龄区间（多选）</h2>
        <div class="item_box">
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="4" v-for="(item, index) in Age" :key="index">
              <div class="item">
                <p class="text" :class="{selected: item.active }">{{item.label}}</p>
                <input type="checkbox" :value="item.label" v-model="item.active">
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>

      <div v-else class="bottom_line">
        <h2 class="title">年龄区间（单选）</h2>
        <div class="item_box">
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="4" v-for="(item, index) in Age" :key="index">
              <div class="item">
                <p class="text" :class="{selected: item.active }">{{item.label}}</p>
                <input type="radio" :value="item.label" v-model="form.age">
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
                <input type="checkbox" :value="item.label" v-model="item.active">
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <p class="tip">您下次进入抢单页面会默认本次筛选条件，如需修改请点击”已筛选“按钮</p>
      <!-- <group>
        <cell title="派单数量">
          <inline-x-number style="display:block;" :min="0" :max="5" width="50px" button-style="round"></inline-x-number>
        </cell>
      </group> -->
    </div>
  </scroll>
  <button class="btn" @click="setFilter" ref="button_box">确定</button>
  </div>
</template>
<script>
import { Group, PopupPicker, Cell, Spinner, Flexbox, FlexboxItem, InlineXNumber } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import filterApi from '@/api/filter'
import axios from 'axios'
import Auth from '@/utils/auth'
import indexApi from '@/api/index'
export default {
  name: 'filters',
  components: {
    Group,
    PopupPicker,
    Cell,
    Spinner,
    Flexbox,
    FlexboxItem,
    InlineXNumber
  },
  data () {
    return {
      height: '',
      selectedCity: '',
      LoanMoney: [],
      Age: [],
      Asset: [],
      form: {
        // loanMoney: [],
        // age: []
      },
      moneyMulti: true, // 是否多选
      ageMulti: true // 是否多选
    }
  },
  computed: {
    ...mapGetters({
      city: 'city',
      currentCity: 'currentCity'
    })
  },
  methods: {
    ...mapActions({
      setOrderCondition: 'setOrderCondition',
      setCity: 'setCity' // 筛选的城市
    }),
    copy (obj) {
      let newobj = {}
      for (let attr in obj) {
        newobj[attr] = obj[attr]
      }
      return newobj
    },
    setFilter () {
      if (this.city.length !== 0) {
        this.$set(this.form, 'citys', this.city.join(','))
      }
      this.setOrderCondition(this.copy(this.form))
      filterApi.setFilterList(this.form).then((res) => {
        if (res.data.code === 0) {
          this.$router.push('/')
        }
      })
    },
    getFilter () {
      filterApi.getFilterList().then((res) => {
        if (res.data.code === 0) {
          res.data.data.loanMoney.options.map((item) => {
            item.active = false
          })
          this.LoanMoney = res.data.data.loanMoney.options

          res.data.data.age.options.map((item) => {
            item.active = false
          })
          this.Age = res.data.data.age.options

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

          this.Asset.push(carObj)
          this.Asset.push(houseObj)
          this.Asset.push(socialSecurityObj)
          this.Asset.push(providentFundObj)
          this.Asset.push(weilidaiObj)
          this.Asset.push(policyObj)
          this.Asset.push(creditCardObj)

          let FilterItem = Auth.getFilterItem()
          if (FilterItem !== null) {
            if (FilterItem.loanMoney) {
              let moneyArr = FilterItem.loanMoney.split(',')
              this.LoanMoney.map((item) => {
                moneyArr.map((value) => {
                  if (value === item.value) {
                    item.active = true
                  }
                })
              })
            }
            if (FilterItem.age) {
              let ageArr = FilterItem.age.split(',')
              this.Age.map((item) => {
                ageArr.map((value) => {
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
              assetArr.map((value) => {
                if (value === item.key) {
                  item.active = true
                }
              })
            })
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    initCity () {
      console.log(1111)
      let FilterItem = Auth.getFilterItem()
      let cityArr = []
      if (FilterItem && Object.keys(FilterItem).length !== 0) {
        cityArr = FilterItem.citys.split(',')
      }
      if (cityArr.length !== 0) {
        this.setCity(cityArr)
      } else {
        if (!Auth.getCurrentCity()) {
          indexApi.getCity().then((res) => {
            if (res.data.code === 0) {
              if (res.data.data !== null) {
                this.setCity([res.data.data])
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
          this.setCity([Auth.getCurrentCity()])
          // this.selectedCity = Auth.getCurrentCity()
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
          this.selectedCity = res.data.name
        } else {
          this.selectedCity = '上海'
        }
      }).catch((err) => {
        this.$vux.loading.hide()
        this.selectedCity = '上海'
        console.log(err)
      })
    }
  },
  watch: {
    city: {
      handler () {
        console.log(this.city)
        if (this.city.length === 0) {
          this.selectedCity = '不限'
          delete this.form.citys // 取消选择是删除该属性
        } else {
          if (this.city.length > 3) {
            this.selectedCity = `${this.city.slice(0, 3).join(',')}...`
          } else {
            this.selectedCity = this.city.join(',')
          }
        }
      }
      // immediate: true
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
          this.$set(this.form, 'loanMoney', arr.join(','))
        } else {
          delete this.form.loanMoney
        }
      },
      deep: true
    },
    'form.loanMoney': {
      handler () {
        if (!this.moneyMulti) {
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
        if (!this.ageMulti) {
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
        this.Asset.map((item) => {
          if (item.active) {
            this.$set(this.form, item.key, item.value)
          } else {
            if (this.form.hasOwnProperty(item.key)) {
              delete this.form[item.key] // 取消选择是删除该属性
            }
          }
        })
      },
      deep: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
    // 通过 `vm` 访问组件实例
      if (from.fullPath === '/') {
        vm.initCity()
      }
    })
  },
  mounted () {
    this.height = `${document.body.clientHeight - this.$refs.button_box.offsetHeight}px`
    this.getFilter()
    // this.initCity()
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
    margin-top: 32px;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
  }
}
.btn{
    position: fixed;
    left: 0;
    bottom: 0px;
    overflow: hidden;
    z-index: 999;
    display: block;
    width: 100%;
    margin: 14px auto 0;
    border: none;
    outline: none;
    line-height: 50px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    background:linear-gradient(151deg,rgba(66,179,249,1) 0%,rgba(31,124,240,1) 100%);
  }

  @media (max-width: 320px) {
    .filter_box .item_box{
      margin: 5px;
    }
  }
</style>
