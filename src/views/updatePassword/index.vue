<template>
<div class="updatePassword">
  <group class="list_box">
     <x-input v-model="oldpass" :type="password1" placeholder="请输入旧密码" @on-blur="validate1" :max="16">
       <svg-icon slot="right" :icon-class="closeEye1" @click.native="open1"></svg-icon>
     </x-input>
     <x-input v-model="newpass" :type="password2" placeholder="请输入新密码" @on-blur="validate2" :max="16">
       <svg-icon slot="right" :icon-class="closeEye2" @click.native="open2"></svg-icon>
     </x-input>
     <x-input v-model="newpass2" :type="password3" placeholder="请确认新密码" @on-blur="validate3" :max="16">
       <svg-icon slot="right" :icon-class="closeEye3" @click.native="open3"></svg-icon>
     </x-input>
  </group>
  <button class="btn" @click="submit">确认修改</button>
</div>
</template>

<script>
import { Group, XInput } from 'vux'
import ownApi from '@/api/own'
export default {
  components: {
    Group,
    XInput
  },
  data () {
    return {
      oldpass: '',
      newpass: '',
      newpass2: '',
      closeEye1: 'closeEye',
      closeEye2: 'closeEye',
      closeEye3: 'closeEye',
      password1: 'password',
      password2: 'password',
      password3: 'password',
      status: true
    }
  },
  methods: {
    open1 () {
      if (this.closeEye1 === 'closeEye') {
        this.closeEye1 = 'eye'
        this.password1 = 'text'
      } else {
        this.closeEye1 = 'closeEye'
        this.password1 = 'password'
      }
    },
    open2 () {
      if (this.closeEye2 === 'closeEye') {
        this.closeEye2 = 'eye'
        this.password2 = 'text'
      } else {
        this.closeEye2 = 'closeEye'
        this.password2 = 'password'
      }
    },
    open3 () {
      if (this.closeEye3 === 'closeEye') {
        this.closeEye3 = 'eye'
        this.password3 = 'text'
      } else {
        this.closeEye3 = 'closeEye'
        this.password3 = 'password'
      }
    },
    validate1 () {
      if (this.oldpass === '') {
        this.$vux.toast.text('请输入原密码', 'middle')
        this.status = false
      } else {
        this.status = true
      }
    },
    validate2 () {
      if (this.newpass === '') {
        this.$vux.toast.text('请输入新密码', 'middle')
        this.status = false
      } else {
        let passRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        let res = passRegex.test(this.newpass)
        if (!res) {
          this.$vux.toast.text('请输入6-16位数字与字母组合', 'middle')
          this.status = false
        } else {
          this.status = true
        }
      }
    },
    validate3 () {
      if (this.newpass === '') {
        this.$vux.toast.text('请再次输入新密码', 'middle')
        this.status = false
      } else {
        let passRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        let res = passRegex.test(this.newpass)
        if (!res) {
          this.$vux.toast.text('请输入6-16位数字与字母组合', 'middle')
          this.status = false
        } else {
          if (this.newpass !== this.newpass2) {
            this.$vux.toast.text('两次密码输入不一致', 'middle')
            this.status = false
          } else {
            this.status = true
          }
        }
      }
    },
    submit () {
      this.validate1()
      if (this.status) {
        this.validate2()
        if (this.status) {
          this.validate3()
          if (this.status) {
            // console.log(22)
            let obj = {
              password: this.oldpass,
              newPassword: this.newpass
            }
            this.statistics('提交修改密码', {})
            ownApi.updatePassword(obj).then((res) => {
              if (res.data.code === 0) {
                this.$vux.toast.text('密码修改成功', 'top')
                this.$router.push('/set')
              } else {
                this.$vux.toast.text(res.data.msg, 'top')
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.updatePassword{
  .list_box{
    .box_item{
      .weui-cells{
        &::before{
          border-top: none;
        }
      }
    }
  }
  .btn{
      display: block;
      width: 91.5%;
      margin: 88px auto 100px;
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
</style>
