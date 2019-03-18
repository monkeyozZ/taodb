<template>
  <div class="issue_box">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <h2 @click="tagglg(index)"><p>{{item.title}}</p><svg-icon v-if="!item.show" icon-class="up"></svg-icon><svg-icon v-else icon-class="down"></svg-icon></h2>
        <div v-show="item.show" class="content" v-html="item.content">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import bus from '@/utils/eventBus'
export default {
  data () {
    return {
      list: [],
      issueType: ''
    }
  },
  methods: {
    tagglg (index) {
      for (let i = 0; i < this.list.length; i++) {
        if (index === i) {
          if (!this.list[i].show) {
            this.list[i].show = true
            this.statistics('常见问题', {问题: this.list[i].title, type: this.issueType})
          } else {
            this.list[i].show = false
          }
        } else {
          this.list[i].show = false
        }
      }
    },
    matching (cate) {
      switch (cate) {
        case 'auth':
          this.list = [
            {
              title: '信贷经理认证审核要求是什么？个人可不可以认证？',
              content: '<p>平台目前只接受机构信贷经理认证，个人不可以认证</p>',
              show: false
            },
            {
              title: '认证审核需要哪些材料？',
              content: '</p>请上传本人在公司logo合影照片；可以选择补充本人劳动合同盖章页／公司的营业执照／工作证明／工牌／名片等材料照片，补充资料越多审核通过率越高。',
              show: false
            },
            {
              title: '认证失败怎么办？',
              content: '<p>请按照短信／信息提示，上传相关证明材料，即可通过认证。</p>',
              show: false
            },
            {
              title: '认证审核需要一般需要多久？',
              content: '<p>审核时间：</p><p>1、工作日内提交，1个工作日进行审核。</p><p>2、非工作日提交，1-2个工作日审核。</p>',
              show: false
            },
            {
              title: '认证时提示“身份证已注册”，如何解决？',
              content: '<p>1、首先请确定您是否使用过其他手机号注册App，尝试用回忆起来的手机号登录，查看是否有同样的提示。</p><p>2、还是无法解决问题，请至淘单宝微信公众号留言，我们会尽快回复您！</p>',
              show: false
            }
          ]
          this.issueType = '认证审核'
          break
        case 'order':
          this.list = [
            {
              title: '订单是需要自己抢，还是平台会自动抢单？',
              content: '<p>目前平台暂未开通自动抢单功能，您可以根据情况，手动选择购买的订单。</p>',
              show: false
            },
            {
              title: '购买订单是否直接买断不用跟别人共享？',
              content: '<p>订单是直接买断的，您购买订单后订单将会自动下架，您可以独享该订单。</p>',
              show: false
            },
            {
              title: '是否可以退单?',
              content: '<p>以下情况可以退单：<br>1、不同时间段拨打客户手机3次一直处于关机、正在通话、停机、秒挂、无法接通、空号等情形之一的；<br>2、客户所在城市与实际不符，为异地贷款且无法为其正常办理贷款业务的；<br>3、其它原因造成无法为客户进行放款服务的（具体以客服最终审核结果为准）;</p>',
              show: false
            }
          ]
          this.issueType = '抢单'
          break
        case 'recharge':
          this.list = [
            {
              title: '最低可以充值多少，有多少档充值套餐可供选择？',
              content: '<p>最低可以充值500元，1000元、1500元、2000元、3000元，5000元，1000元为固定充值套餐，您可根据需要进行充值。</p>',
              show: false
            },
            {
              title: '充值未到账，如何解决？',
              content: '<p>请至淘单宝微信公众号留言，我们会尽快回复您！</p>',
              show: false
            },
            {
              title: '充值的淘单币是否存在有效期？',
              content: '<p>充值的淘单币未设置有效期，永久有效。</p>',
              show: false
            },
            {
              title: '问题订单是否可以申请退款？',
              content: '<p>平台目前没有退款政策，如遇特殊情况请至淘单宝微信公众号留言，我们会帮您登记上报给相关部门进行审核。</p>',
              show: false
            }
          ]
          this.issueType = '充值与退款'
          break
        case 'invite':
          this.list = [
            {
              title: '邀请朋友注册认证有什么奖励？',
              content: '<p>请查看邀请注册的活动页，具体奖励详见规则说明。</p>',
              show: false
            }
          ]
          this.issueType = '邀请奖励'
          break
        case 'integral':
          this.list = [
            {
              title: '积分能做什么？',
              content: '<p>积分可以购买淘订单。</p>',
              show: false
            },
            {
              title: '怎样能获得积分？',
              content: '<p>1、充值获得；</p><p>2、新用户通过信贷经理认证审核；</p><p>3、每日分享；</p><p>4、每日签到。</p>',
              show: false
            }
          ]
          this.issueType = '积分'
          break
        case 'other':
          this.list = [
            {
              title: '登录收不到验证码或账号登不上怎么办？',
              content: '<p>请至淘单宝微信公众号留言，我们会尽快回复您！</p>',
              show: false
            }
          ]
          this.issueType = '其他'
          break
        default:
          this.list = []
          break
      }
    }
  },
  mounted () {
    bus.$emit('changeHideOverLeftStatus', false)
    this.matching(this.$route.params.cate)
  }
}
</script>

<style lang="less" scoped>
.issue_box{
  ul{
    li{
      border-bottom: 1px solid #EFEDED;
      h2{
        position: relative;
        padding: 16px 15px;
        font-size: 16px;
        color: #333333;
        font-weight: 500;
        p{
          width: calc(100% - 20px)
        }
        .svg-icon{
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translate(0, -50%)
        }
      }
      .content{
        padding: 13px 15px;
        color: #666666;
        font-size: 14px;
        p{
          line-height: 24px;
        }
      }
    }
  }
}
</style>
