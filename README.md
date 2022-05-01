# Web-Viewer

## 描述

Web-Viewer 无打包开发页面插件是在运行时进行 rollup 打包 ts 和一些插件的快速开发工具。

Web-Viewer 将打包从服务器端转移到浏览器端，通过 https 获取到本地的代码文件并打包，通过 CDN (Skypack 或者是 esm.run) 直接载入原本 node_module 中的库。

Web-Viewer 基于 Rollup 的 Web 版本衍生出了 Rollup 的一套浏览器插件，实现了 Babel， swc 等超级实用的代码插件。

## 如何使用
