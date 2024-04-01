<script>
import Login from '@/components/Login';
import {ref} from 'vue'
import {register} from 'vue-advanced-chat'
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
        avatar: '粉色团子.png',
        unreadCount: 0,
        index: 3,
        lastMessage: [
        ],
        users: [
          {
            _id: '1234',
            username: 'Me',
            avatar: '粉色团子.png'
          },
          {
            _id: '4321',
            username: 'Nagisa',
            avatar: '粉色团子.png'
          }
        ],
        typingUsers: [4321]
      }],
      messages: []
    }
  },
  methods: {
    handleLoginSuccess() {
      this.loggedIn = true;
    },
    sendMessage(message){
      console.log(message)
      this.messages.push(
          {
            _id: message.detail[0].roomId,
            indexId: 12092,
            content: message.detail[0].content,
            senderId: '1234',
            username: 'Nagisa',
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
          }
      )
    },
    fetchMessages({room, options}) {
      this.messagesLoaded = true;
      {room, options}
    }
  },
  setup() {
    const active = ref(0)
    return {
      active
    }
  }
}
</script>
<template>
  <div class="PhoneChat">
    <div class='Phone'>
      <div class='PhoneScreen'>
        <var-app-bar
            :safe-area-top="true"
            round
            image="https://varlet.gitee.io/varlet-ui/tree.jpeg"
            image-linear-gradient="to right top, rgba(29, 68, 147, 0.5) 0%, rgba(74, 198, 170, 0.9) 100%"
        >
          <template #left>
            <div style="margin-top: 20%;display: flex;flex-direction: row">
              <var-button round text color="transparent" text-color="#fff" style="width: 50px">
                <var-icon name="menu" :size="24"/>
              </var-button>
              <p style="user-select:none;" v-if="loggedIn">标题</p>
              <p style="user-select:none;" v-if="!loggedIn">登录</p>
            </div>
          </template>

          <template #right>
            <div>
              <var-button round text color="transparent" text-color="#fff">
                <var-icon name="map-marker-radius" :size="24"/>
              </var-button>
              <var-button round text color="transparent" text-color="#fff">
                <var-icon name="star" :size="24"/>
              </var-button>
              <var-button round text color="transparent" text-color="#fff">
                <var-icon name="heart" :size="24"/>
              </var-button>
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
        <div class="chat-wrapper">
          <vue-advanced-chat
              height="100%"
              :responsive-breakpoint="1600"
              :current-user-id="currentUserId"
              :rooms="JSON.stringify(rooms)"
              :messages="JSON.stringify(messages)"
              :room-actions="JSON.stringify(roomActions)"
              :rooms-loaded=true
              :messages-loaded="messagesLoaded"
              @fetch-messages="fetchMessages"
              @send-message="sendMessage"
              v-if="loggedIn"
          />
          <Login v-if="!loggedIn" @login-success="handleLoginSuccess" ></Login>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="less">
.PhoneChat {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.Phone {
  max-width: 1000px;
  max-height: 1200px;
  height: 90%;
  /* 设置内部div的高度为外部div高度的80% */
  width: calc(0.8 * 90%);
  border-radius: 40px;
  background-color: #000000;
  border: 1px solid #c0c0c0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s, box-shadow 0.3s;
  /* 添加过渡效果 */
}

.Phone .PhoneScreen {
  background-color: white;
  height: calc(100% - 5%);
  width: calc(100% - 5%);
  border-radius: 40px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}

.PhoneScreen{
  display: flex;
  flex-direction: column;
}

.chat-wrapper{
  flex:1
}

.Phone .PhoneScreen::-webkit-scrollbar {
  display: none;
}

.example::-webkit-scrollbar {
  display: none;
}

/* 隐藏 IE、Edge 和 Firefox 的滚动条 */
.example {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>