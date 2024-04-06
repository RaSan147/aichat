<template>
  <div class="Live2d" id="live-div">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>


import {onMounted, ref} from "vue";
export default {
  name: "Live2d",
  setup() {
    const model = ref(null);
    const canvasWidth = ref(0);
    const canvasHeight = ref(0);

    const category_name = "speak" // name of the motion category
    const animation_index = 0 // index of animation under that motion category
    const priority_number = 3
    const audio_link = "/api.wav"; // [relative or full url path] [mp3 or wav file]
    const volume = 0.9; // [Optional arg, can be null or empty] [0.0 - 1.0]
    const expression = 3; // [Optional arg, can be null or empty] [index|name of expression]
    const resetExpression = true; // [Optional arg, can be null or empty] [true|false] [default: true] [if true, expression will be reset to default after animation is over]
//
//
    // 定义一个加载 Live2D 模型的函数
    async function loadLive2DModel() {
      // 加载 Live2D 模型
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
      // 设置 Live2D 模型的属性
      updateCanvasSize();
      modelLoadedCallback();
    }

    // 在组件挂载时执行加载 Live2D 模型的函数
    onMounted(() => {
      loadLive2DModel();
      // setInterval(randomEvent, 30000);
    });

//    // 定义模型加载完成后的回调函数
    function modelLoadedCallback() {

      // audio.play();
    }


    function randomEvent() {
      // 在这里编写你想要触发的随机事件的代码
      // model.value.motion(category_name, animation_index, priority_number, {sound: audio_link, volume: volume, expression:expression, resetExpression:resetExpression})
      // const audio = new Audio("/api.wav");
      // audio.play()
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
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}

#canvas {
  width: 80%;
  height: 100%;
}
</style>