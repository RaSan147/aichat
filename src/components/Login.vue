<template>
  <div class="login-box">
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
          :rules="[(v) => v.length > 6 || '文本长度必须大于6']"
          v-model="username"
      />
      <var-input
          class="var-input-div"
          size="normal"
          placeholder="密码"
          variant="outlined"
          type="password"
          :rules="[(v) => v.length > 6 || '文本长度必须大于6']"
          v-model="password"
      />
    </var-space>
    <var-button @click="login" size="normal" style="width: 10%; margin-top: 30px">登录</var-button>
  </div>
</template>

<script>
import {inject, ref} from 'vue'
import axios from 'axios';

export default {
  name: "Login",
  setup(_, {emit}) {
    const username = ref('')
    const password = ref('')
    const loggedIn = inject('loggedIn', ref(false));

    async function makePostRequest() {
      try {
        const result = await axios.post('https://your-api-url.com', {
          data: {username: username, password: password} // 这里是你要发送的数据
        });
        if(result.data.code === 200){
          loggedIn.value = true;
        }
      } catch (error) {
        console.error(error);
      }
    }

    function login() {
      // 登录逻辑，假设成功后更新 loggedIn 状态
      loggedIn.value = true;
      // 发送post登录请求
      makePostRequest();
      // 触发登录成功事件
      if (loggedIn.value === true){
        emit('login-success');
      }
    }

    return {
      loggedIn,
      login,
      username,
      password,
    };
  }
}
</script>

<style scoped lang="less">
.login-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10%;
}

.var-input-div {
  width: 350px;
}
</style>