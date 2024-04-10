<template>
  <div class="AllScreen">
    <Live2d/>
    <PhoneChat id="phone"/>
  </div>
</template>

<script>
import PhoneChat from "@/components/PhoneChat";
import Live2d from "@/components/Live2d";

export default {
  name: "AllScreen",
  components: {
    Live2d,
    PhoneChat
  }
}
</script>

<style scoped>
.AllScreen {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}

/* 根据屏幕宽度调整 PhoneChat 样式 */
@media screen and (max-width: 1440px) {
  .AllScreen {
    flex-direction: column; /* 在平板宽度下，垂直布局 */
  }

  #live-div {
    display: none;
  }
}

/* 移动端样式 */
@media screen and (max-width: 768px) {
  .AllScreen {
    flex-direction: column; /* 在移动端，垂直布局 */
  }

  #live-div {
    display: none;
  }
}
</style>