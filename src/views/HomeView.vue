<template>
  <div class="home">
    <AllScreen/>
  </div>
</template>

<script>
// @ is an alias to /src
import AllScreen from "@/components/AllScreen";
export default {
  name: 'HomeView',
  components: {
    AllScreen
  }
}
</script>
<style>
.home{
  height: 100%;
}
</style>