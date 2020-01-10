## 地球模型展示

使用 Threejs 展示地球模型的 Demo

贴图比较大，加载时间会比较久，请耐心等待

## 演示地址

https://hu243285237.github.io/Earth_Demo/

## 功能点

模型的加载和显示

加载进度的实时显示

贴图按顺序加载（最主要的贴图最先加载）

自适应屏幕（当缩放浏览器时，保持模型在正中间）

鼠标拖拽物体旋转（并且停止旋转时有缓冲效果）

滚轮缩放物体尺寸（并且限制缩放尺寸大小）

云层自旋转

## 插件

three.min.js ———— threejs 插件

OBJLoader.js ———— 用于加载物体

MTLLoader.js ———— 用于加载材质和贴图

## 模型来源

https://www.cgmodel.com/model-204627.html

更改了贴图的精度，所有贴图从 4096 改为 2048，以加快加载速度

## 部署

需要本地搭服务才能正常运行，比如 httpserver

直接打开 html 无法正常运行