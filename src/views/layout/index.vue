<template>
  <div class="main" :class="{paddingTop: isHadHeader}">
    <my-header v-if="$route.path !== '/setcurrentcity' && $route.path !== '/company'"></my-header>
    <keep-alive include="index,customer,filters,city,certification,uploadIdcard,uploadAptitudes,news">
      <router-view></router-view>
    </keep-alive>
    <my-tabbar v-if="$route.path === '/'|| $route.path === '/customer'|| $route.path === '/own'"></my-tabbar>
  </div>
</template>

<script>
import MyHeader from '@/components/header'
import MyTabbar from '@/components/tabbar'
export default {
  components: {
    MyHeader,
    MyTabbar
  },
  data () {
    return {
      isHadHeader: true
    }
  },
  watch: {
    '$route': {
      handler () {
        if (new RegExp('setcurrentcity').test(this.$route.path) || new RegExp('company').test(this.$route.path)) {
          this.isHadHeader = false
        } else {
          this.isHadHeader = true
        }
      }
    }
  },
  mounted () {
    if (new RegExp('setcurrentcity').test(this.$route.path) || new RegExp('company').test(this.$route.path)) {
      this.isHadHeader = false
    } else {
      this.isHadHeader = true
    }
  }
}
</script>

<style lang="less" scoped>
.paddingTop{
  padding-top: 44px;
}
</style>
