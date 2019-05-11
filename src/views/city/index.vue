<template>
  <div class="ciyt_box">
     <scroll
      ref="indexList"
      class="wrapper"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      :click="true"
      :bounce="{top: false, bottom: false}">
        <div class="current_city_box">
          <h2 class="title">当前城市</h2>
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="4" class="current_city">
                <svg-icon icon-class="cityIcon"></svg-icon>
                <span v-if="currentCity">{{currentCity}}</span>
                <span v-else>定位中<spinner type="dots" :size="'16px'"></spinner></span>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="has_select_box">
          <h2 class="title">最多可选五个城市</h2>
            <flexbox :gutter="0" wrap="wrap">
              <transition-group name="list" tag="div" class="animate_box">
                <flexbox-item :span="4" class="selected_city" v-for="(item, index) in selected" :key="index">
                  <div>
                    {{item}}
                    <svg-icon icon-class="cancel" @click.native="removeData"></svg-icon>
                  </div>
                </flexbox-item>
                </transition-group>
            </flexbox>
        </div>

        <div class="hot_city_box">
          <h2 class="title">热门城市</h2>
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="4" class="hot_city" v-for="(item, index) in hot_city" :key="index">
              <div @click="setData">
                {{item}}
              </div>
            </flexbox-item>
          </flexbox>
        </div>

    <div class="all_city">
      <ul class="city_box" ref="groups">
          <li v-for="(value, key, index) in sortgroupcity" :key="index"  class="letter_item" ref="listGroup">
              <h4 class="city_title">{{key}}</h4>
              <ul class="letter_city_box">
                  <li v-for="item in value" :key="item.id" class="city_item" @click="setData">
                      {{item.name}}
                  </li>
              </ul>
          </li>
      </ul>
    </div>
    </scroll>
    <div class="index-list-nav" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" :data-index="index">{{item}}</li>
      </ul>
    </div>
    <!-- <div class="index-list-fixed" ref="fixed" v-show="fixedTitle">
      {{fixedTitle}}
    </div> -->
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Spinner } from 'vux'
import { mapActions, mapGetters } from 'vuex'
import groupcity from '@/../static/city.json'
import bus from '@/utils/eventBus'
import axios from 'axios'
import { getData } from '@/utils/dom'
import Auth from '@/utils/auth'
const ANCHOR_HEIGHT = window.innerHeight <= 480 ? 17 : 18
export default {
  name: 'city',
  components: {
    Flexbox,
    FlexboxItem,
    Spinner
  },
  data () {
    return {
      currentCity: '',
      selected: [],
      hot_city: ['上海', '北京', '广州', '深圳', '南京', '杭州', '天津', '武汉', '重庆'],
      arr: [],
      currentIndex: 0
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
    this.listHeight = []
    this.touch = {}
  },
  computed: {
    // 将获取的数据按照A-Z字母开头排序
    sortgroupcity () {
      let sortobj = {}
      for (let i = 65; i <= 90; i++) {
        if (groupcity[String.fromCharCode(i)]) {
          sortobj[String.fromCharCode(i)] = groupcity[String.fromCharCode(i)]
        }
      }
      return sortobj
    },
    shortcutList () {
      let list = []
      for (let i = 65; i <= 90; i++) {
        if (i !== 73 && i !== 79 && i !== 85 && i !== 86) {
          list.push(String.fromCharCode(i))
        }
      }
      return list
    },
    ...mapGetters({
      city: 'city'
    })
  },
  methods: {
    ...mapActions({
      setCity: 'setCity'
    }),
    getCity () {
      axios({
        url: 'https://elm.cangdu.org/v1/cities?type=guess',
        method: 'get',
        timeout: 5000
      }).then((res) => {
        if (res.status === 200) {
          this.currentCity = res.data.name
          let FilterItem = Auth.getFilterItem()
          let cityArr = FilterItem.citys.split(',')
          // this.selected = this.city
          if (this.city.length !== 0) {
            this.selected = this.city.slice(0)
          } else {
            if (cityArr.length !== 0) {
              this.selected = cityArr
            } else {
              this.selected = [res.data.name]
            }
          }
        } else {
          this.currentCity = '上海'
          this.selected = ['上海']
        }
      }).catch((err) => {
        this.currentCity = '上海'
        this.selected = ['上海']
        console.log(err)
      })
    },
    indexOf (arr, val) {
      let status = -1
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].trim() === val.trim()) {
          status = i
        }
      }

      return status
    },
    remove (arr, val) {
      var index = this.indexOf(arr, val)
      if (index > -1) {
        arr.splice(index, 1)
      }
    },
    setData (e) {
      if (this.selected.length === 5) {
        this.$vux.toast.text('最多只能选择五个城市', 'middle')
        this.$refs.indexList.scrollTo(0, 0, 100)
      } else {
        let city = e.target.innerText
        if (this.selected.length === 0) {
          this.arr.push(city)
        } else {
          for (let index = 0; index < this.selected.length; index++) {
            if (this.selected[index] === city) {
              this.$vux.toast.text('已选择该城市', 'middle')
            } else {
              this.arr.push(city)
              // console.log(this.arr)
              // this.arr = new Set(this.arr)
            }
          }
        }
        let newArr = new Set(this.arr)
        this.arr = [...newArr]
        let newSelected = new Set(this.selected.concat(this.arr))
        this.selected = [...newSelected]
        this.$refs.indexList.scrollTo(0, 0, 100)
      }
    },
    removeData (e) {
      // console.log(e.target.parentNode.parentNode.innerText)
      this.remove(this.selected, e.target.parentNode.parentNode.innerText)
      this.remove(this.arr, e.target.parentNode.parentNode.innerText)
      // console.log(e.path[2].innerText)
    },
    _calculateHeight () {
      const list = this.$refs.listGroup
      if (!list) {
        return
      }
      this.listHeight = []
      let height = 46
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.indexList.scrollToElement(this.$refs.listGroup[index], 100)
    },
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    }
  },
  watch: {
  },
  mounted () {
    this.getCity()
    bus.$on('setFilterCity', () => {
      this.setCity(this.selected)
    })
    setTimeout(() => {
      this._calculateHeight()
    }, 20)
  }
}
</script>

<style lang="less" scoped>
.ciyt_box{
  position: relative;
  width: 100%;
  height: 100%;
  .wrapper{
    height: calc(100vh - 44px);
  }
  .title{
    font-size: 14px;
    line-height: 18px;
    color: #999;
    font-weight: normal;
    padding: 8px 0;
  }
  .current_city_box{
    padding: 0 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #d9d9d9;
    .current_city{
      background:#eee;
      padding: 8px 0;
      text-align: center;
      color: #333;
      .svg-icon{
        color: #CECECE;
      }
      .vux-spinner{
        margin-top: -4px;
      }
    }
  }
  .has_select_box{
    padding: 0 50px 0 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #d9d9d9;
    .animate_box{
      width: 100%;
      text-align: left;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      display: -webkit-flex;
      box-align: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      box-direction: row;
      box-orient: horizontal;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-direction: row;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .list-enter-active{
      transition: all .5s ease-in-out
    }
    .list-leave-active{
      transition: all .2s ease;
      opacity: 0
    }
    .list-enter{
      transform: translateY(20px);
      opacity: 0
    }
    .list-move {
      transition: all .5s
    }
    .selected_city{
      margin-top: 15px!important;
      div{
        position: relative;
        padding: 8px 0;
        margin: 0 7px;
        text-align: center;
        color: #4AA7F8;
        border: 1px solid #4AA7F8;
        border-radius: 4px;/* no */
        .svg-icon{
          position: absolute;
          top: -9px;
          right: -13px;
          color: #FF6969;
        }
      }
    }
  }
  .hot_city_box{
    padding: 0 50px 0 15px;
    .hot_city{
      margin-bottom: 15px!important;
       div{
        padding: 8px 0;
        margin: 0 7px;
        text-align: center;
        background:rgba(238,238,238,1);
        color: #333;
        border-radius: 4px;/* no */
       }
    }
  }
  .all_city{
    .city_box{
      .letter_item{
        list-style: none;
        .city_title{
          padding-left: 15px;
          font-weight: normal;
          background: #EEEEEE;
          color: #333;
          font-size: 14px;
          line-height: 26px;/* no */
        }
        .letter_city_box{
          padding: 0 15px;
          .city_item{
            list-style: none;
            padding: 13px 0;
            &:not(:last-child){
              border-bottom: 1px solid #EFEDED;
            }
          }
        }
      }
    }
  }
  .index-list-nav{
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    ul{
      padding: 0;
      margin: 0;
      li{
        list-style: none;
        padding: 6px 10px 0;
        line-height: 1;
        text-align: center;
        box-sizing: border-box;
        &:active{
          color: #FF6969;
        }
      }
    }
  }
  .index-list-fixed{
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    padding-left: 15px;
    font-weight: normal;
    background: #EEEEEE;
    color: #333;
    font-size: 14px;
    line-height: 26px;/* no */
  }
}
</style>
