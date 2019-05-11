<template>
  <div>
  </div>
</template>

<script>
import Auth from '@/utils/auth'
import authApi from '@/api/registerAndLogin'
import { mapActions } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    code () {
      return this.$route.query.code
    }
  },
  methods: {
    ...mapActions({
      setLoginstatus: 'setLoginstatus',
      setJdbAuthToken: 'setJdbAuthToken',
      setuserinfo: 'setuserinfo'
    }),
    getUserInfo () {
      let redirectUrl = Auth.getRouterUrl()
      let status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'

      if (this.code && !JSON.parse(status)) {
        authApi.getUserInfo(this.code).then((res) => {
          Auth.setAuthLoginStatus(true) // 授权登录状态
          if (res.data.code === 0) {
            this.setLoginstatus(true)
            this.setJdbAuthToken(res.data.data)
            this.$router.push(redirectUrl)
          }
          if (res.data.code === 1) {
            this.setLoginstatus(false)
            this.setuserinfo(res.data.data)
            this.$router.push('/')
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>

</style>
