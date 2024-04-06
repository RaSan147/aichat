<script>
import Login from '@/components/Login';
import {onMounted, ref} from 'vue'
import {register} from 'vue-advanced-chat'
import '../css/iphone.css'
import {get, post} from '@/api/user'

register()
export default {
  components: {
    Login
  },
  data() {
    return {
      loggedIn: ref(false),
      messagesLoaded: false,
      currentUserId: '1234',
      rooms: [{
        roomId: '1',
        roomName: 'Nagisa',
        avatar: 'nagisa.png',
        unreadCount: 0,
        index: 3,
        lastMessage: [],
        users: [
          {
            _id: '1234',
            username: 'Me',
            avatar: '粉色团子.png'
          },
          {
            _id: '4321',
            username: 'Nagisa',
            avatar: 'nagisa.png'
          }
        ],
        typingUsers: [4321]
      }],
      messages: []
    }
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    const header = {
      'Content-Type': 'application/json', // 设置请求头为 JSON 格式
      'token': token,
    }
    post("/tokenIsEffective", null, header).then(response => {
      this.loggedIn = response.data.data
    })
  },
  methods: {
    handleLoginSuccess() {
      this.loggedIn = true;
    },
    sendMessage(message) {
      console.log(message)
      this.messages.push(
          {
            _id: message.detail[0].roomId,
            indexId: 12092,
            content: message.detail[0].content,
            senderId: '1234',
            username: 'Me',
            avatar: '粉色团子.png',
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString(),
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            failure: false,
            disableActions: false,
            disableReactions: false,
          },
          {
            _id: message.detail[0].roomId,
            indexId: 12092,
            content: message.detail[0].content,
            senderId: '4321',
            username: 'Nagisa',
            avatar: 'nagisa.png',
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString(),
            saved: true,
            distributed: true,
            seen: true
          }
      )
    },
    fetchMessages({room, options}) {
      this.messagesLoaded = true;
      {
        room, options
      }
    }
  },
  setup() {
    const active = ref(0);
    const roomsListOpened = ref(false); // 默认值为true，平板状态下默认打开
    const responsiveChange = () => {
      const mediaQuery = window.matchMedia("(max-width: 1440px)");
      const appQuery = window.matchMedia("(min-width: 840px)");
      if (mediaQuery.matches && appQuery.matches) {
        roomsListOpened.value = false;
      }else{
        roomsListOpened.value = true;
      }
    };

    onMounted(() => {
      responsiveChange(); // 初始化检查一次
      window.addEventListener('resize', responsiveChange); // 监听窗口大小变化
    });
    return {
      active, roomsListOpened
    }
  }
}
</script>
<template>
  <div class="chat-box">
    <div class="phone-app">
      <var-app-bar
          :safe-area-top="true"
          round
          image="粉色背景.jpg"
          image-linear-gradient="to left top, rgba(227,203,222, 0.5) 0%, rgba(254,221,222, 0.9) 100%"
          class="phone-bar"

      >
        <template #left>
          <div
              style="margin-top: 20%;display: flex;flex-direction: row;justify-content: center;align-items: center">
            <var-button round text color="transparent" text-color="#fff" style="width: 40px; ">
              <var-icon name="menu" :size="24"/>
            </var-button>
            <p style="user-select:none;" v-if="loggedIn">对话</p>
            <p style="user-select:none;" v-if="!loggedIn">登录</p>
          </div>
        </template>

        <template #content>
          <var-tabs
              style="margin-top: 0px"
              color="transparent"
              active-color="#fff"
              inactive-color="#ddd"
              v-model:active="active"
          >
          </var-tabs>
        </template>
      </var-app-bar>
      <div class="chat-wrapper" v-if="loggedIn">
        <vue-advanced-chat
            style="height: 100%"
            :rooms-list-opened="!roomsListOpened"
            :responsive-breakpoint="841"
            :current-user-id="currentUserId"
            :rooms="JSON.stringify(rooms)"
            :messages="JSON.stringify(messages)"
            :room-actions="JSON.stringify(roomActions)"
            :rooms-loaded=true
            :loading-rooms=true
            :messages-loaded="messagesLoaded"
            @fetch-messages="fetchMessages"
            @send-message="sendMessage"
            v-if="loggedIn"
        />
      </div>
      <Login v-if="!loggedIn" @login-success="handleLoginSuccess"></Login>
    </div>
    <div class="device iphone-x">
      <!--    外部轮廓    -->
      <div class="frame">
        <div class="content">
          <div style="z-index: 20;position: absolute;padding-right: 20px;right: 0;color: black;padding-top: 2px"
               class="time">10:19
          </div>
          <var-app-bar
              :safe-area-top="true"
              round
              image="粉色背景.jpg"
              image-linear-gradient="to left top, rgba(227,203,222, 0.5) 0%, rgba(254,221,222, 0.9) 100%"
              class="phone-bar"

          >
            <template #left>
              <div
                  style="margin-top: 20%;display: flex;flex-direction: row;justify-content: center;align-items: center">
                <var-button round text color="transparent" text-color="#fff" style="width: 40px; ">
                  <var-icon name="menu" :size="24"/>
                </var-button>
                <p style="user-select:none;" v-if="loggedIn">对话</p>
                <p style="user-select:none;" v-if="!loggedIn">登录</p>
              </div>
            </template>

            <template #content>
              <var-tabs
                  style="margin-top: 0px"
                  color="transparent"
                  active-color="#fff"
                  inactive-color="#ddd"
                  v-model:active="active"
              >
              </var-tabs>
            </template>
          </var-app-bar>
          <div class="chat-wrapper" v-if="loggedIn">
            <vue-advanced-chat
                style="height: 100%"
                :rooms-list-opened="!roomsListOpened"
                :responsive-breakpoint="841"
                :current-user-id="currentUserId"
                :rooms="JSON.stringify(rooms)"
                :messages="JSON.stringify(messages)"
                :room-actions="JSON.stringify(roomActions)"
                :rooms-loaded=true
                :loading-rooms=false
                :messages-loaded="messagesLoaded"
                @fetch-messages="fetchMessages"
                @send-message="sendMessage"
                v-if="loggedIn"
            />
          </div>
          <Login v-if="!loggedIn" @login-success="handleLoginSuccess"></Login>
        </div>
      </div>

      <!--    天线    -->
      <div class="stripe"></div>

      <!--    听筒孔    -->
      <div class="header">
        <div class="sensors"></div>
      </div>

      <!--    按键    -->
      <div class="btns"></div>
      <div class="power"></div>
    </div>
  </div>
</template>


<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}

.phone-bar {
  z-index: 1;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
}

.chat-box {
  height: 100%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: flex-direction 0.5s ease;
}

.chat-wrapper {
  flex: 1;
  overflow-y: auto; /* 垂直方向上出现滚动条 */
  height: calc(100% - 100px);
  border-bottom-right-radius: 32px;
  border-bottom-left-radius: 32px;

  @media screen and (max-width: 1440px) {
    height: calc(100% - 106px);
  }
  @media screen and (max-width: 1260px) {
    height: calc(100% - 120px);
  }
  @media screen and (max-width: 1200px) {
    height: calc(100% - 130px);
  }
  @media screen and (max-width: 1100px) {
    height: calc(100% - 140px);
  }
  @media screen and (max-width: 1050px) {
    height: calc(100% - 146px);
  }
  @media screen and (max-width: 990px) {
    height: calc(100% - 158px);
  }
  @media screen and (max-width: 910px) {
    height: calc(100% - 168px);
  }
  @media screen and (max-width: 856px) {
    height: calc(100% - 178px);
  }
  @media screen and (min-width: 841px) {
    height: calc(100% - 200px);
  }
}

@media screen and (max-width: 1440px) {
  .chat-box {
    width: 100%;

  }

  .phone-bar {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px
  }
}

@media screen and (max-width: 840px) {
  .device, .iphone-x, .frame, .content, .time {
    display: none;
  }
}

@media screen and (min-width: 841px) {
  .phone-app {
    display: none;
  }
}

.phone-app {
  width: 100%;
  height: 100%;
}
</style>