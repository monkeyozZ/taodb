<template>
  <div class="company_box">
     <search
      @result-click="resultClick"
      @on-change="getResult"
      :results="results"
      v-model="value"
      placeholder="搜索"
      auto-scroll-to-top
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search"></search>
  </div>
</template>

<script>
import { Group, XInput, Search } from 'vux'
import searchCompanyApi from '@/api/company'
export default {
  components: {
    Group,
    XInput,
    Search
  },
  data () {
    return {
      form: {
        orgName: ''
      },
      results: [],
      value: '',
      timeout: null
    }
  },
  methods: {
    debounce (func, wait, ...args) {
      let timeout
      return function () {
        const context = this
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    },
    scrollTOBottom2 () {
      window.scrollTo(0, 0)
      this.statistics('认证-输入公司全称', {})
    },
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      this.$router.push({path: '/certification', query: { company: item.title }})
    },
    getResult (val) {
      console.log('on-change', val, 'time', (new Date()).getTime())
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.results = val ? this.search(val) : []
      }, 200)
    },
    onSubmit () {
      this.$refs.search.setBlur()
      this.$vux.toast.show({
        type: 'text',
        position: 'top',
        text: 'on submit'
      })
    },
    onFocus () {
      console.log('on focus')
    },
    onCancel () {
      console.log('on cancel')
    },
    search (val) {
      searchCompanyApi.searchCompany({key: val}).then((result) => {
        if (result.data.code === 0) {
          if (result.data.data.length !== 0) {
            this.results = result.data.data.map((item) => {
              return {
                title: item
              }
            })
          } else {
            this.results = [{title: this.value}]
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.weui-search-bar__label{
  display: none
}
</style>
