<template>
  <div>
    <swiper v-if="isKeep" :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide>
          <a :href="login_status?'javascript:;':bannerArr[0].link"
          @click="statistics('点击banner', {'bannerUrl': bannerArr[0].imgSrc?baseUrl + bannerArr[0].imgSrc: ''})
          ">
            <img :src="bannerArr[0].imgSrc?baseUrl + bannerArr[0].imgSrc: ''">
          </a>
        </swiper-slide>
        <swiper-slide>
          <a :href="bannerArr[1].link">
            <img :src="bannerArr[1].imgSrc?baseUrl + bannerArr[1].imgSrc: ''">
          </a>
        </swiper-slide>
        <swiper-slide>
          <a :href="bannerArr[2].link">
            <img :src="bannerArr[2].imgSrc?baseUrl + bannerArr[2].imgSrc: ''">
            <img src="./img/go.png" class="go heartBeat">
          </a>
        </swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
import indexApi from '@/api/index'
export default {
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    ...mapGetters(['login_status'])
  },
  data () {
    return {
      baseUrl: process.env.BASE_API + '/resource/',
      bannerArr: [{imgSrc: '', link: ''}, {imgSrc: '', link: ''}, {imgSrc: '', link: ''}],
      swiperOption: {
        autoplay: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        // loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      isKeep: false
    }
  },
  methods: {
    getBanner () {
      indexApi.getBanner().then((res) => {
        if (res.data.code === 0) {
          this.bannerArr = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  activated () {
    this.isKeep = true
  },
  deactivated () {
    this.isKeep = false
  },
  mounted () {
    this.getBanner()
  }
}
</script>

<style lang="less" scoped>
@-webkit-keyframes heartBeat {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    14% {
        -webkit-transform: scale(1.3);
        transform: scale(1.3)
    }

    28% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    42% {
        -webkit-transform: scale(1.3);
        transform: scale(1.3)
    }

    70% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@keyframes heartBeat {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    14% {
        -webkit-transform: scale(1.3);
        transform: scale(1.3)
    }

    28% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    42% {
        -webkit-transform: scale(1.3);
        transform: scale(1.3)
    }

    70% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

.heartBeat {
    -webkit-animation-duration: 1.3s;
    -webkit-animation-name: heartBeat;
    -webkit-animation-timing-function: ease-in-out;
    animation-duration: 1.3s;
    animation-name: heartBeat;
    animation-timing-function: ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
}
.swiper-container{
  .swiper-slide{
    img{
      display: inline-block;
      max-width: 100%;
      width: 100%;
      height: auto;
    }
    .go{
      display: inline-block;
      width: 31px;
      height: 31px;
      position: absolute;
      top: 52%;
      right: 24%;
    }
  }
}
</style>
