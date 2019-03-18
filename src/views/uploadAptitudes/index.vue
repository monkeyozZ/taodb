<template>
<scroll ref="scroll" class="wrapper" :style="{height: height}">
  <div class="uploadAptitudes">
    <h2 class="title">上传资质证明（二选一）</h2>
    <flexbox :gutter="0" wrap="wrap">
      <flexbox-item :span="6" class="upload">
        <div>
          <label for="file1" :style="{backgroundImage: `url(${blobURL1})`}">
            <spinner type="bubbles" class="loading" v-if="loading1"></spinner>
            <input type="file" id="file1" accept="image/*" @change="handleFileChange" :disabled="isdisabled" ref="file1">
          </label>
        </div>
        <p>工牌、名片、等其他<br>证明材料</p>
      </flexbox-item>

      <flexbox-item :span="6" class="upload_example">
        <img src="./img/card.png" alt="照片示例" >
        <p>照片示例<br>&nbsp;</p>
      </flexbox-item>

      <flexbox-item :span="6" class="upload">
        <div>
          <label for="file2" :style="{backgroundImage: `url(${blobURL2})`}">
            <spinner type="bubbles" class="loading" v-if="loading2"></spinner>
            <input type="file" id="file2" accept="image/*" @change="handleFileChange2" :disabled="isdisabled" ref="file2">
          </label>
        </div>
        <p>公司logo墙合照</p>
      </flexbox-item>

      <flexbox-item :span="6" class="upload_example">
        <img src="./img/logoImg.png" alt="照片示例" >
        <p>照片示例</p>
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
  name: 'uploadAptitudes',
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
      aptitudes: {
        card: null,
        logoImg: null
      },
      isdisabled: false,
      loading1: false,
      loading2: false
    }
  },
  computed: {
    ...mapGetters({
      aptitudesObj: 'aptitudes'
    }),
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : ''
    }
  },
  methods: {
    ...mapActions({
      setAptitudesImg: 'setAptitudesImg'
    }),
    ownStatus () {
      ownApi.ownCertificationStatus().then((res) => {
        if (res.data.code === 0) {
          if (res.data.data !== null) {
            if (res.data.data.result === 'SUCCESS' || res.data.data.result === 'UNDERWAY') {
              this.isdisabled = true
              if (res.data.data.evidenceImgId) {
                this.blobURL1 = this.baseUrl + res.data.data.evidenceImgId.originPath
              }
              if (res.data.data.logoImgId) {
                this.blobURL2 = this.baseUrl + res.data.data.logoImgId.originPath
              }
            } else {
              if (res.data.data.evidenceImgId) {
                if (this.aptitudesObj === null) {
                  this.blobURL1 = require('./img/upload.png')
                  this.aptitudes.card = null
                }
              }
              if (res.data.data.logoImgId) {
                if (this.aptitudesObj === null) {
                  this.blobURL2 = require('./img/upload.png')
                  this.aptitudes.logoImg = null
                }
              }
              this.isdisabled = false
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleFileChange (e) {
      if (e.target.files.length === 0) return
      this.loading1 = true
      lrz(e.target.files[0], { width: 800 }).then((rst) => {
        this.loading1 = false
        this.aptitudes.card = rst.base64
        this.blobURL1 = rst.base64
        this.$refs.file1.value = '' // 重置表单值，hank两次选择同一张蹄片不触发change事件
        /* console.log(this.toFixed2(e.target.files[0].size / 1024))
        console.log(this.toFixed2(rst.fileLen / 1024)) */
      }).catch((err) => {
        console.log('压缩图片失败:' + err)
      })
    },
    handleFileChange2 (e) {
      if (e.target.files.length === 0) return
      this.loading2 = true
      lrz(e.target.files[0], { width: 800 }).then((rst) => {
        this.loading2 = false
        this.aptitudes.logoImg = rst.base64
        this.blobURL2 = rst.base64
        this.$refs.file2.value = '' // 重置表单值，hank两次选择同一张蹄片不触发change事件
        /* console.log(this.toFixed2(e.target.files[0].size / 1024))
        console.log(this.toFixed2(rst.fileLen / 1024)) */
      }).catch((err) => {
        console.log('压缩图片失败:' + err)
      })
    },
    validate () {
      if (this.aptitudes.card === null && this.aptitudes.logoImg === null) {
        this.$vux.toast.text('请上传资质证明', 'top')
        return false
      } else {
        this.setAptitudesImg(this.aptitudes)
        this.statistics('上传资质证明-确定', {})
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
.uploadAptitudes{
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
        .preview{
          display: inline-block;
          max-width: 100%;
          width: 100%;
          height: 100px;
        }
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
