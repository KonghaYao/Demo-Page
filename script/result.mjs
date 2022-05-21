





























const description$d = {
  fileName: "assemblyscript",
  title: "AssemblyScript",
  desc: "AssemblyScript 是 Typescript-like 的 WebAssembly 编写语言",
  link: ["https://www.assemblyscript.org/", "https://www.npmjs.com/package/assemblyscript", "https://github.com/AssemblyScript/assemblyscript"]
};



const description$c = {
  fileName: "color-thief",
  title: "ColorThief 颜色抽取器",
  link: ["https://lokeshdhakar.com/projects/color-thief/", "https://github.com/lokesh/color-thief"],
  desc: "Color Thief 可以提取一个图片中的主体颜色，或者直接抽取出一个颜色模板。"
};



const description$b = {
  fileName: "compressorjs",
  title: "Compressorjs —— 图片压缩插件",
  desc: "Compressorjs 是前端压缩图片的一个插件",
  link: ["https://github.com/fengyuanchen/compressorjs"]
};



const description$a = {
  fileName: "count-up",
  title: "countUp.js 数字滚动库",
  desc: "实现数字滚动的无依赖库",
  link: ["https://github.com/inorganik/CountUp.js#usage", "https://inorganik.github.io/countUp.js/"]
};



/** 渲染指定的数据进行一个展示 */
const description$9 = {
  fileName: "CryptoFile",
  title: "Sodium 实现文件加密与解密",
  desc: "Sodium 可以实现浏览器端的加密，使用 Sodium 可以实现文件的加密与解密！",
  link: ["https://hat.sh/about/#technical-details"]
};



const description$8 = {
  fileName: "gpu-cat",
  title: "GPU.js —— Cat 图像扰动",
  desc: "GPU.js 可以执行图像的像素级调整！",
  link: ["https://www.npmjs.com/package/gpu.js", "https://github.com/gpujs/gpu.js"]
};

const description$7 = {
  fileName: "index",
  title: "介绍文件",
  desc: "这是我们的介绍文件",
  link: []
};

const description$6 = {
  fileName: "pyodide",
  title: "pyodide —— 浏览器 Python 环境",
  desc: "在浏览器上运行 Python 的插件",
  link: ["https://pyodide.org/en/stable/usage/loading-packages.html", "https://github.com/pyodide/pyodide"]
}; // 注册一个 CDN， 这个 CDN 可以通过 JSDelivr 获取！



const description$5 = {
  fileName: "runkit",
  title: "RunKit —— Nodejs 运行器",
  desc: "RunKit 是 NPM 官方推荐的在线 Nodejs 运行器！",
  link: ["https://runkit.com/home"]
};

const description$4 = {
  fileName: "typed",
  title: "Typed.js —— 打字效果",
  desc: "Typed.js 是 用于创建打字效果的常用插件; 这里配合 PrismJS 对代码进行格式化，形成一个动态写代码的效果",
  link: ["https://github.com/mattboldt/typed.js"]
};

/** 配置 CDN 选项，如果使用 CDN 的话 */
const isDev = () => globalThis.location.host.split(":")[0] === "127.0.0.1";
/* 项目文件的 CDN 目录 */

isDev() ? globalThis.location.href : "https://fastly.jsdelivr.net/gh/konghayao/Demo-Page/index.html"; // NPM 插件 CDN 的根

const description$3 = {
  fileName: "vanta",
  title: "vanta 3D 背景动画",
  desc: "少量代码生成漂亮的 3D 背景动画",
  link: ["https://www.vantajs.com/", "https://github.com/tengbao/vanta"]
}; // 该插件依赖 threejs

const description$2 = {
  fileName: "wc-spinner",
  title: "Wc Spinners",
  desc: "Wc Spinners 是 基于 Web Component 的 Loading 动画组件",
  link: ["https://wc-spinners.cjennings.dev/", "https://github.com/craigjennings11/wc-spinners"]
};

const description$1 = {
  fileName: "xmind",
  title: "XMind 思维导图支持",
  desc: "在网页端打开思维导图",
  link: ["https://www.xmind.cn/", "https://github.com/xmindltd/xmind-embed-viewer"]
};



const description = {
  fileName: "ztext",
  title: "zText 3D 文字生成",
  desc: "3D 文本动画附加",
  link: ["https://bennettfeely.com/ztext/#js-init", "https://github.com/bennettfeely/ztext"]
}; // 该插件没有 npm

var temp = [description$d, description$c, description$b, description$a, description$9, description$8, description$7, description$6, description$5, description$4, description$3, description$2, description$1, description];

export { temp as default };
