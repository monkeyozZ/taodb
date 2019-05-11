<template>
  <div class="ciyt_box">
     <scroll
      ref="indexList"
      class="wrapper"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      :click="true"
      :bounce="{top: false}">
        <div class="current_city_box">
          <h2 class="title">当前城市</h2>
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="4" class="current_city">
                <svg-icon icon-class="cityIcon"></svg-icon>
                <span v-if="sendordersCity">{{sendordersCity}}</span>
                <span v-else>定位中<spinner type="dots" :size="'16px'"></spinner></span>
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
import { mapActions } from 'vuex'
import groupcity from '@/../static/city.json'
import { getData } from '@/utils/dom'
const ANCHOR_HEIGHT = window.innerHeight <= 480 ? 17 : 18
export default {
  name: 'setSendOrdersCity',
  components: {
    Flexbox,
    FlexboxItem,
    Spinner
  },
  data () {
    return {
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
    sendordersCity () {
      return this.$route.query.sendordersCity
    }
  },
  methods: {
    ...mapActions({
      setSendOrdersCity: 'setSendOrdersCity'
    }),
    setData (e) {
      let city = e.target.innerText
      this.setSendOrdersCity(city)
      // this.$refs.indexList.scrollTo(0, 0, 100)
      this.statistics('选择派单城市', {'cityName': city})
      this.$router.push('/sendOrders')
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
  mounted () {
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
    height: 100vh;
  }
  .title{
    font-size: 14px;
    line-height: 18px;
    color: #999;
    font-weight: normal;
    margin: 8px 0;
  }
  .current_city_box{
    padding: 15px;
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
