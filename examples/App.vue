<script setup lang="ts">
import { useObserveResize } from "../src/index";
import type { Direction } from "../src/directives/vDrag";

interface DirMap {
  [key: string]: string;
}

const logoEle = ref<HTMLDivElement>();
const width = ref<number>(389);
const height = ref<number>(174);
const isBoundaryTouched = ref<boolean>(false);
const boundaryDir = ref<string>();

const handleDragStart = (event: MouseEvent) => {
  console.log("Drag started:", event);
};

const handleDrag = (event: MouseEvent) => {
  console.log("Dragging:", event);
};

const handleDragEnd = (event: MouseEvent) => {
  console.log("Drag ended:", event);
};

const handleBoundaryTouch = (dir: Direction) => {
  const dirMap: DirMap = {
    up: "上",
    right: "右",
    down: "下",
    left: "左",
  };
  isBoundaryTouched.value = true;
  boundaryDir.value = dirMap[dir];
  console.log(`触碰到${dir}边界`);
};

onMounted(() => {
  useObserveResize(logoEle.value as HTMLElement, (cr) => {
    width.value = cr.width;
    height.value = cr.height;
  });
});
</script>

<template>
  <div class="logo-container resize" ref="logoEle">
    <div>
      <span>
        <img src="/vite.svg" draggable="false" class="logo" alt="Vite logo" />
      </span>
      <span>
        <img
          src="./assets/vue.svg"
          draggable="false"
          class="logo vue"
          alt="Vue logo"
        />
      </span>
    </div>
    <div>请改变我的尺寸</div>
    <div>
      <span> 宽度：{{ width.toFixed(0) }} </span>
      <span> 高度：{{ height.toFixed(0) }}</span>
    </div>
  </div>
  <div
    class="logo-container"
    v-drag="{
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
    }"
  >
    <div>
      <span>
        <img src="/vite.svg" draggable="false" class="logo" alt="Vite logo" />
      </span>
      <span>
        <img
          src="./assets/vue.svg"
          draggable="false"
          class="logo vue"
          alt="Vue logo"
        />
      </span>
    </div>
    <div>请拖动我吧！</div>
  </div>
  <div class="drap-wrap">
    <div
      class="logo-container"
      v-drag="{
        position: 'absolute',
        onBoundaryTouch: handleBoundaryTouch,
      }"
    >
      <div>
        <span>
          <img src="/vite.svg" draggable="false" class="logo" alt="Vite logo" />
        </span>
        <span>
          <img
            src="./assets/vue.svg"
            draggable="false"
            class="logo vue"
            alt="Vue logo"
          />
        </span>
      </div>
      <div>请拖动我吧！</div>
      <div>但是我只能在蓝色盒子内部移动</div>
      <div v-show="isBoundaryTouched">
        <span>边界触碰状态：</span>
        <span style="color: #ffc51d"> {{ `${boundaryDir}边界` }} </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drap-wrap {
  position: relative !important;
  width: 650px;
  height: 394px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #71afe5;
}
.logo-container {
  width: 389px;
  height: 274px;
  margin-bottom: 20px;
  user-select: none;
  border: 1px solid #ccc;
}
.logo-container.resize {
  resize: both;
  overflow: hidden;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
