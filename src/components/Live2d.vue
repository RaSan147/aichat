<template>
  <div class="Live2d" id="live-div">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>


import {onMounted, ref, watch} from "vue";
import store from "@/store";
export default {
  name: "Live2d",
  setup() {
    const model = ref(null);
    const canvasWidth = ref(0);
    const canvasHeight = ref(0);
    var volume = 1; //[Optional arg, can be null or empty] [0.0 - 1.0]
    var expression = 3; //[Optional arg, can be null or empty] [index|name of expression]
    var resetExpression = true; //[Optional arg, can be null or empty] [true|false] [default: true] [if true, expression will be reset to default after animation is over]
    var cors = "Anonymous" //[Optional arg, can be null or empty] [default: "Anonymous"] [if you want to use cors, set it to "use-cors"]
//
//
    // 定义一个加载 Live2D 模型的函数
    async function loadLive2DModel() {
      // 加载 Live2D 模型
      // const live2dModel = await PIXI.live2d.Live2DModel.from("/Resources/hiyori_pro_zh/runtime/hiyori_pro_t11.model3.json", {idleMotionGroup: 'standby'});
      const live2dModel = await PIXI.live2d.Live2DModel.from("/Resources/Nagisa/nagisa.model3.json", {idleMotionGroup: 'standby'});
      // 创建 PIXI 应用程序
      const app = new PIXI.Application({
        view: document.getElementById("canvas"),
        autoStart: true,
        resizeTo: document.getElementById("canvas"),
        transparent: true
      });
      // 将 Live2D 模型添加到 PIXI 应用程序的舞台上
      app.stage.addChild(live2dModel);
      // 将加载后的 Live2D 模型保存到 ref 中
      model.value = live2dModel;
      updateCanvasSize();
    }

    watch(()=> store.getters.getAuditData, (newValue, oldValue) => {
      randomEvent();
    });

    // 在组件挂载时执行加载 Live2D 模型的函数
    onMounted(() => {
      loadLive2DModel();
    });


    function randomEvent() {
      const byteCharacters = atob(store.getters.getAuditData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/wav' });
      // 创建 Blob 对象的 URL
      const audioUrl = URL.createObjectURL(blob);
      // 在这里编写你想要触发的随机事件的代码
      // model.value.motion("Idle", animation_index, priority_number, {sound: audioUrl, volume: volume, expression:expression, resetExpression:resetExpression})
      model.value.speak(audioUrl, {
        volume: volume,
        expression: expression,
        resetExpression: resetExpression,
        crossOrigin: cors,
      })
      const audio = new Audio();
      audio.src = audioUrl;
      audio.addEventListener('loadedmetadata', function() {
        const duration = audio.duration * 1000; // 将时长转换为毫秒
        // 在音频播放时长之后执行清除操作
        setTimeout(() => {
          URL.revokeObjectURL(audioUrl);
        }, duration);
      });
    }

    // 返回响应式数据和方法
    // 当窗口大小改变时更新画布大小
    window.addEventListener("resize", updateCanvasSize);

    // 更新画布大小的方法
    function updateCanvasSize() {
      const liveDiv = document.getElementById("live-div");
      canvasHeight.value = liveDiv.offsetHeight;
      canvasWidth.value = liveDiv.offsetHeight * 0.7;
      // console.log(model.value)
      model.value.width = canvasWidth._value;
      model.value.height = canvasHeight._value;
    }

    // 返回响应式数据和方法
    return {model, canvasWidth, canvasHeight};
  }

}
</script>

<style scoped>
.Live2d {
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}

#canvas {
  width: 100%;
  height: 100%;
}
</style>