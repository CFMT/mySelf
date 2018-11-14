<template>
  <div id="allWrap">
    <div class="header">
      <div class="headerLeft" ref="headerLeft"></div>
      <div class="headerRight">
        <span class="changAside" @click="changAside">改变尺寸</span>
      </div>
    </div>
    <div class="main">
      <div class="aside" ref="aside"><Aside></Aside></div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Aside from '@/components/aside/aside.vue'
import Header from '@/components/header/header.vue'
import ControlSidebar from '@/components/controlSidebar/controlSidebar.vue'

export default {
  data () {
    return {
      flag: 'max'
    }
  },
  components: {
    Aside,
    Header,
    ControlSidebar
  },
  methods: {
    changAside () {
      let headerLeft = this.$refs.headerLeft
      let aside = this.$refs.aside
      if (this.flag === 'max') {
        this.startMove(headerLeft, {width: 30})
        this.startMove(aside, {width: 30})
        this.flag = 'min'
      } else if (this.flag === 'min') {
        this.startMove(headerLeft, {width: 230})
        this.startMove(aside, {width: 230})
        this.flag = 'max'
      }
    },
    getStyle (obj, attr) {
      return window.getComputedStyle ? window.getComputedStyle(obj, false)[attr] : obj.currentStyle[attr]
    },
    startMove (obj, json, callback) {
      let that = this
      if (obj.timer) {
        clearInterval(obj.timer)
      }
      obj.timer = setInterval(function () {
        var flag = true   //假设值为true时   所有运动结束了  可以停止定时器
        for (var attr in json) {
          //获取实际内容样式值
          var current
          if (attr === 'opacity') {
            current = parseFloat(that.getStyle(obj, attr)) * 100
          } else if (attr === 'zIndex') {
            current = parseInt(that.getStyle(obj, attr))
          } else {
            current = parseInt(that.getStyle(obj, attr))
          }
          var speed = (json[attr] - current) / 10
          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
          if (current !== json[attr]) {
            //如果没有达到目标值  就关闭开关变量为false
            flag = false
          }
          //设置样式值
          if (attr === 'opacity') {
            obj.style.opacity = (current + speed) / 100
          } else if (attr === 'zIndex') {
            obj.style.zIndex = json[attr]
          } else {
            obj.style[attr] = current + speed + 'px'
          }
        }
        //循环结束后  如果flag值为true   停止定时器
        if (flag) {
          clearInterval(obj.timer)
          //上移动作完成  开始进入下一个动作
          // 实现下一个动作代码
          if (callback) {//判断如果存在下一个动作  就执行
            callback()
          }
        }
      }, 30)
    }
  },
  mounted () {
  }
}

</script>

<style lang="scss">
@import '@/lib/reset.scss';

*{
  margin: 0;
  padding: 0;
}
li{
  list-style: none;
}
a{
  color: black;
}
html,body{
  height: 100%;
  width: 100%;
}
#allWrap{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.header{
  height: 50px;
  background: #3c8dbc;
  display: flex;
}
.headerLeft{
  width: 230px;
}
.headerRight{
  flex: 1;
}
.main{
  flex: 1;
  display: flex;
}
.aside{
  width: 230px;
  background: #222d32;
}
.section{
  flex: 1;
  background: white;
}
.changAside{
  display: inline-block;
  height: 50px;
  width: 100px;
  line-height: 50px;
  cursor: pointer;
}
</style>
