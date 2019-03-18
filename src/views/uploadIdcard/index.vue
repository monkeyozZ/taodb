<template>
<scroll ref="scroll" class="wrapper" :style="{height: height}">
  <div class="uploadIdcard">
    <h2 class="title">上传身份证</h2>
    <flexbox :gutter="0" wrap="wrap">
      <flexbox-item :span="6" class="upload">
        <div>
          <label for="file1" :style="{backgroundImage: `url(${blobURL1})`}">
            <spinner type="bubbles" class="loading" v-if="loading1"></spinner>
            <input type="file" accept="image/*" id="file1" @change="handleFileChange" ref="file1" :disabled="isdisabled">
          </label>
        </div>
        <p>身份证正面照片</p>
      </flexbox-item>

      <flexbox-item :span="6" class="upload_example">
        <img src="./img/front.png" alt="照片示例">
        <p>照片示例</p>
      </flexbox-item>

      <flexbox-item :span="6" class="upload">
        <div>
          <label for="file2" :style="{backgroundImage: `url(${blobURL2})`}">
            <spinner type="bubbles" class="loading" v-if="loading2"></spinner>
            <input type="file" accept="image/*" id="file2" @change="handleFileChange2" ref="file2" :disabled="isdisabled">
          </label>
        </div>
        <p>身份证反面照片</p>
      </flexbox-item>

      <flexbox-item :span="6" class="upload_example">
        <img src="./img/back.png" alt="照片示例">
        <p>照片示例</p>
      </flexbox-item>

      <flexbox-item :span="6" class="upload">
        <div>
          <label for="file3" :style="{backgroundImage: `url(${blobURL3})`}">
            <spinner type="bubbles" class="loading" v-if="loading3"></spinner>
            <input type="file" accept="image/*" id="file3" @change="handleFileChange3" ref="file3" :disabled="isdisabled">
          </label>
        </div>
        <p>手持身份证照片</p>
      </flexbox-item>
      <flexbox-item :span="6" class="upload_example">
        <img src="./img/hand.png" alt="照片示例(露出胳膊)">
        <p>照片示例(露出胳膊)</p>
      </flexbox-item>
    </flexbox>
    <button class="confirm" @click="validate" :disabled="isdisabled">确定</button>
  </div>
</scroll>
</template>

<script>
import { Flexbox, FlexboxItem, Spinner } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import ownApi from '@/api/own'
import lrz from 'lrz'
export default {
  name: 'uploadIdcard',
  components: {
    Flexbox,
    FlexboxItem,
    Spinner
  },
  data () {
    return {
      height: '',
      baseUrl: process.env.BASE_API + '/resource/',
      blobURL1: require('./img/upload.png'),
      blobURL2: require('./img/upload.png'),
      blobURL3: require('./img/upload.png'),
      idCard: {
        front: null,
        back: null,
        hand: null
      },
      isdisabled: false,
      loading1: false,
      loading2: false,
      loading3: false
    }
  },
  computed: {
    ...mapGetters({
      idCardobj: 'idCard'
    }),
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : ''
    }
  },
  methods: {
    ...mapActions({
      setIdCardImg: 'setIdCardImg'
    }),
    ownStatus () {
      ownApi.ownCertificationStatus().then((res) => {
        if (res.data.code === 0) {
          if (res.data.data !== null) {
            if (res.data.data.result === 'SUCCESS' || res.data.data.result === 'UNDERWAY') {
              this.isdisabled = true
              this.blobURL1 = this.baseUrl + res.data.data.frontCardImgId.originPath
              this.blobURL2 = this.baseUrl + res.data.data.backCardImgId.originPath
              this.blobURL3 = this.baseUrl + res.data.data.holdCardImgId.originPath
            } else {
              if (this.idCardobj === null) {
                this.blobURL1 = require('./img/upload.png')
                this.blobURL2 = require('./img/upload.png')
                this.blobURL3 = require('./img/upload.png')
                this.idCard.front = null
                this.idCard.back = null
                this.idCard.hand = null
              }
              this.isdisabled = false
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    toFixed2 (num) {
      return parseFloat(+num.toFixed(2))
    },
    handleFileChange (e) {
      if (e.target.files.length === 0) return
      this.loading1 = true
      lrz(e.target.files[0], { width: 800 }).then((rst) => {
        this.loading1 = false
        this.idCard.front = rst.base64
        this.blobURL1 = rst.base64
        this.$refs.file1.value = '' // 重置表单值，hank两次选择同一张蹄片不触发change事件
      }).catch((err) => {
        console.log('压缩图片失败:' + err)
      })
    },
    handleFileChange2 (e) {
      if (e.target.files.length === 0) return
      this.loading2 = true
      lrz(e.target.files[0], { width: 800 }).then((rst) => {
        this.loading2 = false
        this.idCard.back = rst.base64
        this.blobURL2 = rst.base64
        this.$refs.file2.value = '' // 重置表单值，hank两次选择同一张蹄片不触发change事件
        /* console.log(this.toFixed2(e.target.files[0].size / 1024))
        console.log(this.toFixed2(rst.fileLen / 1024)) */
      }).catch((err) => {
        console.log('压缩图片失败:' + err)
      })
    },
    handleFileChange3 (e) {
      if (e.target.files.length === 0) return
      this.loading3 = true
      lrz(e.target.files[0], { width: 800 }).then((rst) => {
        this.loading3 = false
        this.idCard.hand = rst.base64
        this.blobURL3 = rst.base64
        this.$refs.file3.value = '' // 重置表单值，hank两次选择同一张蹄片不触发change事件
        /* console.log(this.toFixed2(e.target.files[0].size / 1024))
        console.log(this.toFixed2(rst.fileLen / 1024)) */
      }).catch((err) => {
        console.log('压缩图片失败:' + err)
      })
    },
    validate () {
      if (this.idCard.front === null) {
        this.$vux.toast.text('请上传身份证正面照片', 'top')
        return false
      } else if (this.idCard.back === null) {
        this.$vux.toast.text('请上传身份证反面照片', 'top')
        return false
      } else if (this.idCard.hand === null) {
        this.$vux.toast.text('请上传手持身份证照片', 'top')
        return false
      } else {
        /* let formdata = new FormData()
        formdata.append('front', this.idCard.front)
        formdata.append('contrary', this.idCard.back)
        formdata.append('hand', this.idCard.hand) */
        this.setIdCardImg(this.idCard)
        this.statistics('上传身份证-确定', {})
        this.$router.push('/certification')
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.ownStatus()
    })
  },
  mounted () {
    this.height = `${document.body.clientHeight - this.headerHeight}px`
    this.ownStatus()
  }
}
</script>

<style lang="less" scoped>
.wrapper{
    height: calc(100vh - 46px);
  }
.uploadIdcard{
  padding-bottom: 52px;
  .title{
    font-size: 16px;
    font-weight: 500;
    color: #333;
    padding: 15px;
  }
  .vux-flexbox{
    padding: 0 8px;
    box-sizing: border-box;
    .upload{
      text-align: center;
      div{
        width: 87.46666%;
        height: 100px;
        margin: 0 auto;
        label{
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          input[type="file"]{
            display: none;
          }
          .loading{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%)
          }
        }
      }
      p{
        margin: 8px 0 6px 0;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        text-align: center;
      }
    }
    .upload_example{
      text-align: center;
      font-size: 0;
      img{
        display: inline-block;
        width: 87.46666%;
        height: 100px;
      }
      p{
        margin: 8px 0 6px 0;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        text-align: center;
      }
    }
  }
  .confirm{
      display: block;
      margin: 65px auto 0 auto;
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
}
</style>
