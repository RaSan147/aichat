<script>
import Login from '@/components/Login';
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {register} from 'vue-advanced-chat'
import '../css/iphone.css'
import {post} from '@/api/user'
import {addRoom, getAllRooms} from '@/api/room'
import {Snackbar} from "@varlet/ui";
import {selectRoomHistoryChat, chat} from '@/api/chat'
import {useStore} from 'vuex'
import store from "@/store";
register()
export default {
  components: {
    Login
  },
  data() {
    return {
      loggedIn: ref(false),
      messagesLoaded: false,
      currentUserId: "1",
      rooms: [],
      messages: [],
      pageNum: 1,
      maxPageNum: null,
      roomNum: null,
      isGenerationAudio: true
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
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (response.data.data) {
        const pageInfo = {
          page: 1,
          limit: 10
        }
        getAllRooms(pageInfo, token).then(response => {
          if (response.data.code === 200) {
            response.data.data.records.forEach((item, index) => {
              this.rooms.push({
                roomId: item.roomId,
                roomName: item.firstChat,
                avatar: 'nagisa.png',
                unreadCount: 0,
                lastMessage: {
                  _id: 1,
                  content: item.lastChat,
                  senderId: "0",
                  username: 'Nagisa',
                  timestamp: '10:20'
                },
                users: [
                  {
                    _id: "1",
                    username: userInfo.username,
                    avatar: '粉色团子.png'
                  },
                  {
                    _id: "0",
                    username: 'Nagisa',
                    avatar: 'nagisa.png'
                  }
                ]
              })
            });
          } else {
            this.createSnackbar("warning", response.data.error);
          }
        })
      }
    })

  },
  methods: {
    handleLoginSuccess() {
      this.loggedIn = true;
      this.fetchRooms()
    },
    handleRoomChange(obj) {
    },
    addRoom() {
      addRoom(null, localStorage.getItem("token")).then(response => {
        if (response.data.code === 200) {
          this.createSnackbar("success", response.data.message);
        } else {
          this.createSnackbar("warning", response.data.error);
        }
      })
    },
    createSnackbar(type, msg) {
      Snackbar[type](msg)
      if (type === 'loading') {
        setTimeout(() => {
          Snackbar.success("加载成功")
        }, 2000)
      }
    },

    getTotalPageNum(totalRecord, pageSize) {
      let pageNum;
      return pageNum = parseInt((totalRecord + pageSize - 1) / pageSize);
    },

    sendMessage(message) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const messages = this.messages;
      messages.push(
          {
            _id: message.detail[0].roomId,
            content: message.detail[0].content,
            senderId: "1",
            username: userInfo.username,
            avatar: '粉色团子.png',
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString(),
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            disableActions: false,
            disableReactions: true,
          }
      )
      this.messages = messages;
      const chatData = {
        dialogueMe: message.detail[0].content,
        chatType: 0,
        roomId: message.detail[0].roomId,
        isGenerationAudio: this.isGenerationAudio
      }
      chat(chatData, localStorage.getItem("token"))
          .then(response=>{
            messages.push({
              _id: message.detail[0].roomId,
              content: response.data.data.dialogueAi,
              senderId: "0",
              username: "Nagisa",
              avatar: 'nagisa.png',
              timestamp: new Date().toString().substring(16, 21),
              date: new Date().toDateString(),
              system: false,
              saved: true,
              distributed: true,
              seen: true,
              deleted: false,
              disableActions: false,
              disableReactions: true,
            })
            store.commit("setAuditData", response.data.data.audioData);
          })
      this.messages = messages;
    },
    fetchRooms() {
      const token = localStorage.getItem("token");
      if (!token) return;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      const pageInfo = {
        page: 1,
        limit: 10
      };

      getAllRooms(pageInfo, token).then(response => {
        if (response.data.code === 200) {
          this.rooms = []; // 清空原有的房间列表
          response.data.data.records.forEach((item, index) => {
            this.rooms.push({
              roomId: item.roomId,
              roomName: item.firstChat,
              avatar: 'nagisa.png',
              unreadCount: 0,
              lastMessage: {
                _id: 1,
                content: item.lastChat,
                senderId: "0",
                username: 'Nagisa',
                timestamp: '10:20'
              },
              users: [
                {
                  _id: "1",
                  username: userInfo.username,
                  avatar: '粉色团子.png'
                },
                {
                  _id: "0",
                  username: 'Nagisa',
                  avatar: 'nagisa.png'
                }
              ]
            })
          });
        } else {
          this.createSnackbar("warning", response.data.error);
        }
      });
    },
    fetchMessages(obj) {
      this.messagesLoaded = false;
      const room = obj.detail[0].room;
      this.messages = []; // 清空当前房间的消息列表
      // 添加房间标识符作为异步操作的标识符
      const roomId = room.roomId;
      if (this.roomNum == null || this.roomNum !== roomId) {
        this.messages = [];
      }
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      const data = {
        roomId: room.roomId,
        type:0
      }
      selectRoomHistoryChat(data, localStorage.getItem("token")).then(response => {
        this.maxPageNum = this.getTotalPageNum(response.data.data.total, response.data.data.size);
        const list = response.data.data.reverse();
        list.forEach((item, index) => {
          // 使用 chatDate 和 chatTimestamp 创建 Date 对象
          const myDateObject = new Date(item[1].chatDate[0], item[1].chatDate[1] - 1, item[1].chatDate[2],
              item[1].chatTimestamp[0], item[1].chatTimestamp[1], item[1].chatTimestamp[2]);

          const aiDateObject = new Date(item[0].chatDate[0], item[0].chatDate[1] - 1, item[0].chatDate[2],
              item[0].chatTimestamp[0], item[0].chatTimestamp[1], item[0].chatTimestamp[2]);
          // 将 Date 对象转换为 timestamp 字符串（HH:mm 格式）
          const myTimestamp = myDateObject.toLocaleTimeString('zh-CN', {hour12: false}).substring(0, 5);
          const aiTimestamp = aiDateObject.toLocaleTimeString('zh-CN', {hour12: false}).substring(0, 5);

          // 将 Date 对象转换为 date 字符串（完整日期格式）
          const myDate = myDateObject.toDateString();
          const aiDate = aiDateObject.toDateString();
          const messages = this.messages;
          messages.push(
              {
                _id: room.roomId,
                content: item[1].dialogueMe,
                senderId: "1",
                username: userInfo.username,
                avatar: '粉色团子.png',
                timestamp: myTimestamp,
                date: myDate,
                system: false,
                saved: true,
                distributed: true,
                seen: true,
                deleted: false,
                disableActions: false,
                disableReactions: true,
              },
              {
                _id: room.roomId,
                content: item[0].dialogueAi,
                senderId: "0",
                username: "Nagisa",
                avatar: 'nagisa.png',
                timestamp: aiTimestamp,
                date: aiDate,
                system: false,
                saved: true,
                distributed: true,
                seen: true,
                deleted: false,
                disableActions: false,
                disableReactions: true,
              }
          )
          this.messages = messages;
        })
        this.messagesLoaded = true;
      })

    }
  },
  setup() {
    const active = ref(0);
    const chatWrapperRef = ref(null)
    const roomsListOpened = ref(false); // 默认值为true，平板状态下默认打开
    const responsiveChange = () => {
      const mediaQuery = window.matchMedia("(max-width: 1440px)");
      const appQuery = window.matchMedia("(min-width: 840px)");
      // 当视窗宽度低于1440并且高于840时，打开左侧房间列表
      if (!(mediaQuery.matches && appQuery.matches)) {
        roomsListOpened.value = false;
      } else {
        roomsListOpened.value = true;
      }
    };

    // 监听窗口大小变化
    const resizeHandler = () => {
      const chatWrapper = chatWrapperRef.value;
      if (!chatWrapper) return; // 确保 chatWrapperRef 有值

      if (window.innerWidth < 838) {
        chatWrapper.style.height = 'calc(100% - 100px)';
      } else {
        chatWrapper.style.height = ''; // 移除行内样式
      }
    };

    onBeforeUnmount(() => {
      window.removeEventListener('resize', responsiveChange);
      window.removeEventListener('resize', resizeHandler);
    });

    onMounted(() => {
      window.addEventListener('resize', responsiveChange); // 监听窗口大小变化
      window.addEventListener('resize', resizeHandler);

      // 初始化时调用一次以确保高度正确
      resizeHandler();
      responsiveChange(); // 初始化检查一次
    });

    return {
      active, roomsListOpened, chatWrapperRef
    }
  }
}
</script>
<template>
  <div class="chat-box">
    <!--  app样式  -->
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
      <div class="chat-wrapper" v-if="loggedIn" ref="chatWrapperRef">
        <vue-advanced-chat
            style="height: 100%"
            :load-first-room=false
            :current-user-id="currentUserId"
            :rooms="JSON.stringify(rooms)"
            :messages="JSON.stringify(messages)"
            :rooms-loaded=true
            :loading-rooms=false
            :messages-loaded="messagesLoaded"
            @fetch-messages="fetchMessages"
            @send-message="sendMessage"
            @add-room="addRoom"
            :emojis-suggestion-enabled=false
            v-if="loggedIn"
        >
          <div slot="room-header-info" class="chat-header">
            <p>Nagisa</p>
          </div>
        </vue-advanced-chat>
      </div>
      <Login v-if="!loggedIn" @login-success="handleLoginSuccess"></Login>
    </div>
    <!--  平板以及手机样式  -->
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
                :load-first-room=true
                :current-user-id="currentUserId"
                :rooms="JSON.stringify(rooms)"
                :messages="JSON.stringify(messages)"
                :rooms-loaded=true
                :loading-rooms=false
                :messages-loaded="messagesLoaded"
                @fetch-messages="fetchMessages"
                @send-message="sendMessage"
                @add-room="addRoom"
                :emojis-suggestion-enabled=false
                v-if="loggedIn"
            >
              <div slot="room-header-info" class="chat-header">

                <p>Nagisa</p>
              </div>
            </vue-advanced-chat>
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
  width: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
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

.chat-header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>