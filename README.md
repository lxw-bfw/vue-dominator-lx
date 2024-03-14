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

## 安装和基本用法

### 安装

```bash
npm install dominator-lx
or
yarn add dominator-lx
```

### 基本用法

#### 注册成为vue插件

##### 使用指令

#### 导出hooks函数



## 说明

- 以vue指令、组合函数等形式封装涉及dom操作的系列功能，诸如dom元素监听、信息获取和元素拖动位移操作等系列功能
- 可以以vue插件形式安装到vue2或者是vue3项目中，以使用提供的全局指令；也支持导出hooks函数形式
- 支持vue2和vue3



## 特性

- 以组合函数（hooks）或者是全局指令等形式提供
- 使用`ts`开发，提供类型声明文件，支持`ts`类型提示
  - 如果是使用全局指令，那么可以在`main.ts`进行插件注册
- 如果是使用hooks，可以直接在对应的组件导入需要使用的hooks即可



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

![demonstration](D:\学吧\code-practice-实践-非小程序\开源-npm-组件库-其他库开发\vue-useResize\use-observe-resize\static\demonstration.gif)



