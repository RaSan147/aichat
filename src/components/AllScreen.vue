<template>
  <div class="AllScreen">
    <Live2d/>
    <PhoneChat/>
  </div>
</template>

<script>
import PhoneChat from "@/components/PhoneChat";
import Live2d from "@/components/Live2d";
export default {
  name: "AllScreen",
  components:{
    Live2d,
    PhoneChat
  }
}
</script>

<style scoped>
.AllScreen{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>