<script setup lang="ts">
import { Direction } from "../../src/directives/vDrag";

const direction = ref<string>("");
const mX = ref<number>(0);
const mY = ref<number>(0);

const handleBoundaryTouch = (dir: Direction) => {
  direction.value = dir;
};
const handleDragStart = (event: MouseEvent) => {
  console.log(event.clientX, event.clientY);
  changeMousePos(event.clientX, event.clientY);
};
const handleDrag = (event: MouseEvent) => {
  changeMousePos(event.clientX, event.clientY);
};

const changeMousePos = (x: number, y: number) => {
  mX.value = x;
  mY.value = y;
};
</script>

<template>
  <div class="draw-wrap">
    <div
      class="drap-item"
      id="drap-item"
      v-drag="{
        position: 'absolute',
        onDragStart: handleDragStart,
        onDrag: handleDrag,
        onBoundaryTouch: handleBoundaryTouch,
      }"
    >
      <div>拖动我！！！</div>
      <div class="mouse">鼠标位置 {{ `x:${mX},y:${mY}` }}</div>
      <div v-show="direction" class="direction">触碰边界——{{ direction }}</div>
    </div>
  </div>
</template>

<style scoped>
.draw-wrap {
  position: relative;
  width: 400px;
  height: 300px;
  border: 1px solid #3b3a39;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.drap-item {
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #c7e0f4;
}
</style>
