## 库工程环境说明

- 框架：vue3/2
- 构建工具：vite
  - 插件
    - plugin-vue
    - unplugin-auto-import
- 语言：ts
- 单元测试
  - vitest
  - happy-dom
  - vue/test-utils
- 自动化测试
  - husky 和 lint-staged



## 目前功能  

- 实时监听元素尺寸改变，返回元素尺寸等相关信息

  - 支持hook形式
  - 支持指令形式

- 鼠标拖动元素位移功能

  - 指令形式

  - 同时提供以下配置参数

    - 定位模式：`relative` | `absolute ` | `fixed`
    - isLimitParent：默认true，设置false可以强制取消元素被限制在父级容器内拖动

  - 元素拖动容器——网页窗口拖动 OR 相对自定义父级容器内部拖动

    - 相对自定义父级容器进行拖动的限制：**必须使用一个定位为`relative`或者是`absolute`**的父级元素包裹绑定添加拖动指令的元素即可，如果想要强制取消，可以通过传递`isLimitParent`，配置为`false`即可

  - 同时提供以下回调

    - 拖动开始
    - 拖动进行中
    - 拖动结束
    - 边界触碰

    

## 演示

![demo](https://github.com/lxw-bfw/vue-dominator-lx/blob/master/static/demonstration.gif?raw=true)



## 安装和基本用法

### 安装

```bash
npm i vue-dominator
or
yarn add vue-dominator
```

### 基本用法

#### 使用指令的话，需要先注册为vue插件

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { dominator } from 'vue-dominator'

createApp(App).use(dominator).mount("#app");

```

#### 监听元素尺寸改变

注意，为了方便改变元素尺寸，可以给它设置如下`css`

```css
.resize {
  resize: both;
  overflow: hidden;
}
```

##### hooks形式

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useObserveResize } from 'vue-dominator'

const obserBox = ref<HTMLDivElement>()
const bWidth = ref<number>(200)
const bheight = ref<number>(200)

onMounted(() => {
  // useObserveResize调用时机：组件挂载到dom，可以执行dom操作
  useObserveResize(obserBox.value as HTMLElement, (cr) => {
    console.log(cr.width, cr.height)
    bWidth.value = cr.width
    bheight.value = cr.height
  })
})
</script>

<template>
  <div class="d-wrap">
     <div class="obser-box resize" ref="obserBox">
      <div>
        <span>widht：</span> <span style="color: #008272"> {{ bWidth.toFixed(0) }} </span>
      </div>
      <div>
        <span> height：</span> <span style="color: #008272">{{ bheight.toFixed(0) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.obser-box {
  width: 200px;
  height: 200px;
  border-radius: 5px;
  border: 1px solid #fed9cc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.resize {
  resize: both;
  overflow: hidden;
}
</style>

```

##### 指令形式`v-observe-resize`接受一个回调函数

```html
<div class="obser-box resize" v-observe-resize="obserResizeChange"></div>
```

```typescript
const obserResizeChange = (cr: DOMRectReadOnly) => {
  console.log('指令形式', cr.width, cr.height)
}
```

#### 元素拖动功能

##### 指令形式`v-drag`

- `v-drag=dragOptions` ,`dragOptions`参数如下

  - `position?: string;`绑定了拖动指令后的元素的定位模式：`relative | absolute | fixed`，如果元素自身设置了定位（非默认静态定位`static`）优先从元素自身获取，否则从指令值获取，默认值`relative`
  - `isLimitParent?: boolean;` 是否限制在提供的设置`relative`定位的父容器范围内，`true|false`，默认为`true`
  - `onDragStart?: (event: MouseEvent) => void;` 开始拖动回调
  - ` onDrag?: (event: MouseEvent) => void;` 拖动进行中回调
  - `onDragEnd?: (event: MouseEvent) => void;` 拖动结束回调
  - `onBoundaryTouch?: (direction: Direction) => void;` 拖动触碰边界回调，`direction`返回边界值

- 示例在父级`drap-wrap`范围内进行拖动，注意`drap-wrap`需要设置为`relative`定位。

  ```html
  // template style
   <div class="drap-wrap">
        <div
          class="logo-container"
          v-drag="{
            position: 'absolute',
            onBoundaryTouch: handleBoundaryTouch
          }"
        >
          <div>请拖动我吧！</div>
          <div>但是我只能在蓝色父级盒子内部移动</div>
          <div v-show="isBoundaryTouched">
            <span>边界触碰状态：</span>
            <span style="color: #ffc51d"> {{ `${boundaryDir}边界` }} </span>
          </div>
        </div>
      </div>
  
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
  </style>
  ```

  ```typescript
  import type { Direction } from 'vue-dominator'
  const isBoundaryTouched = ref<boolean>(false)
  const boundaryDir = ref<string>()
  
  const handleBoundaryTouch = (dir: Direction) => {
    const dirMap: { [key: string]: string } = {
      up: '上',
      right: '右',
      down: '下',
      left: '左'
    }
    isBoundaryTouched.value = true
    boundaryDir.value = dirMap[dir]
    console.log(`触碰到${dir}边界`)
  }
  ```

  



## 说明

- 以vue指令、组合函数等形式封装涉及dom操作的系列功能，诸如dom元素监听、信息获取和元素拖动位移操作等系列功能
- 可以以vue插件形式安装到vue2或者是vue3项目中，以使用提供的全局指令；也支持导出hooks函数形式
- 支持vue2和vue3



## 特性

- 以组合函数（hooks）或者是全局指令等形式提供
- 使用`ts`开发，提供类型声明文件，支持`ts`类型提示
  - 如果是使用全局指令，那么可以在`main.ts`进行插件注册
- 如果是使用hooks，可以直接在对应的组件导入需要使用的hooks即可









