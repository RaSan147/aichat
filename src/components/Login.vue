<template>
  <div class="login-box" ref="teleportTarget">
    <var-space align="center" justify="center" direction="column" size="large">
      <var-image
          width="100px"
          height="100px"
          fit="cover"
          :radius="10"
          src="logoko.png"
      />
      <var-input
          class="var-input-div"
          size="normal"
          placeholder="账号"
          variant="outlined"
          :rules="[(v) => v.length >= 6 || '文本长度必须大于6']"
          v-model="username"
      />
      <var-input
          class="var-input-div"
          size="normal"
          placeholder="密码"
          variant="outlined"
          type="password"
          :rules="[(v) => v.length >= 6 || '文本长度必须大于6']"
          v-model="password"
      />
    </var-space>
    <var-button @click="login" size="normal" style="width: 15%; margin-top: 30px; background-color: RGB(254,221,222)">登录</var-button>
  </div>
</template>

<script>
import {inject, ref} from 'vue'
import {get, post} from '@/api/user'
import {Snackbar} from "@varlet/ui";

export default {
  name: "Login",
  setup(_, {emit}) {
    const teleportTarget = ref(null);
    const username = ref('')
    const password = ref('')
    const loggedIn = inject('loggedIn', ref(false));

    function createSnackbar(type,msg,tele) {
      Snackbar[type](msg,{teleport: tele})
      console.log(teleportTarget.value)
      if (type === 'loading') {
        setTimeout(() => {
          Snackbar.success("加载成功")
        }, 2000)
      }
    }

    function login() {
      // 发送post登录请求
      const postData = {
        username: username.value,
        password: password.value
      };
      post("/login",postData)
          .then(response=>{
            if (response.data.code===200){
              loggedIn.value=true;
              localStorage.setItem("token",response.data.data.token)
              localStorage.setItem("userInfo", JSON.stringify(response.data.data.userInfo))
              createSnackbar("success","登录成功",teleportTarget.value);
              emit('login-success');
            }else{
              createSnackbar("warning",response.data.msg,teleportTarget.value);
            }

          })
          .catch(error=>{
            console.error(error);
          })
      // 触发登录成功事件
    }

    return {
      loggedIn,
      login,
      username,
      password,
      teleportTarget
    };
  }
}
</script>

<style scoped lang="less">
.login-box {
  width: 100%;
  height: 88.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10%;
}

.var-input-div {
  width: 300px;
}
</style>