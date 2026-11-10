# big胆studio / BigDan Studio 官方网站

一个可直接部署到 GitHub Pages 的纯静态官网。沿用已选定的黄色笑脸品牌设计，包含本地 Three.js 互动场景、中文与 English、响应式布局和两个可以实际游玩的小游戏。

## 最简单的上线方式：GitHub Pages

1. 登录你的 GitHub，新建一个用于官网的仓库，例如 `bigdan-studio`。使用支持 GitHub Pages 的账户/仓库可见性设置；免费账户通常使用公开仓库。
2. 解压交付的 ZIP，把**里面的文件与文件夹直接上传到仓库根目录**。确保在仓库首页就能看见 `index.html`，不要再套一层 `bigdan-studio-site` 文件夹。
3. 进入仓库 **Settings → Pages**。
4. 在 **Build and deployment → Source** 选择 **Deploy from a branch**；分支选择 **main**，目录选择 **/(root)**，然后保存。
5. 等待 GitHub 的 Pages 发布完成，打开 Pages 设置页显示的网址。普通项目仓库通常是 `https://你的GitHub用户名.github.io/bigdan-studio/`。这只是格式示例，请使用 GitHub 实际给出的地址。

如果你的仓库名正好是 `你的GitHub用户名.github.io`，发布后通常使用根网址 `https://你的GitHub用户名.github.io/`。两种路径本项目都支持，页面资源全部使用相对路径。

**无需租服务器、无需数据库、无需填写 API Key，也无需安装 Node 或运行构建命令。** GitHub Pages 提供静态托管；浏览器负责运行网页和小游戏。代码包内已包含 `.nojekyll`，用于跳过 Jekyll 处理。

> 上传 ZIP 文件本身不会自动成为官网。请上传解压后的内容，并完成 Pages 设置。

## 网站包含什么

- **Three.js 太阳游乐场**：真实三维场景。点击太阳或「戳一下」可弹跳并收集快乐；拖动可轻微转动；「换个队形」调整玩具；可手动开启音效，默认静音。
- **抓住小快乐 / Catch a Smile**：20 秒九宫格反应小游戏，支持鼠标、触屏与数字键 1–9。离开页面自动暂停，返回后可手动继续。
- **翻翻好心情 / Happy Pairs**：12 张卡、6 对图案的记忆配对小游戏。
- **工作室介绍**：中文介绍、英文介绍、品牌理念与轻松的小互动。
- **语言切换**：首次根据浏览器语言选择中文或英文；手动选择后优先使用本机保存的偏好。页面文案、按钮、小游戏和无障碍标签一起切换。
- **自适应**：根据实际屏幕宽度响应式排版；手机支持触摸，画布跟随容器尺寸改变，并限制渲染像素比。
- **完整轻量互动**：基础太阳即时可玩，随后尝试启用 Three.js；WebGL 不可用时继续使用二维互动。点击有弹跳、+1 和彩纸，每 5 次庆祝；支持拖动、三套队形与表情、手动开启的音效。触摸纵向滚动不计分。系统「减少动态效果」偏好会减少动画。

官网内的两个小游戏是本次制作的互动演示，不表示已有商业发行游戏。没有加入虚构下载量、玩家评价、团队人数、产品发行信息或未提供的联系方式。

## 文件结构

```text
index.html                 页面内容与结构
.nojekyll                  GitHub Pages 静态站标记
styles/main.css            全站视觉与手机自适应
styles/fallback.css        二维太阳互动反馈
styles/mini-games.css      小游戏界面
scripts/language-init.js   浏览器语言/本机语言偏好初始化
scripts/app.bundle.js      已打包的网页入口（无需构建即可使用）
scripts/boot-check.js      独立启动检查，避免持续显示加载中
scripts/main.js            中英翻译、菜单、交互整合源码
scripts/fallback-playground.js  二维太阳完整互动
scripts/playground.js      Three.js 太阳场景
scripts/mini-games.js      两个小游戏
assets/logo.png            网站横版 Logo
assets/logo-square.png     512×512 品牌 Logo
assets/favicon.svg        浏览器标签页图标
vendor/three/              Three.js 官方模块与许可证
THIRD_PARTY_LICENSES.txt   第三方说明
package.json / build.mjs  可选的开发构建配置
```

## 以后怎么修改

### 工作室介绍与中文 / English

编辑 `scripts/main.js` 的 `copy.zh` 和 `copy.en`。同一个键在两种语言里各有一份，例如 `aboutDescription`、`heroTitle`、`footerLine`。标题中的 `<br>` 是换行，保留需要的 HTML 标签。初始静态中文内容在 `index.html` 中，修改主要内容时同步更新，保证禁用 JavaScript 时也能阅读。修改 JavaScript 源码后，需要按下方开发步骤重新生成 `scripts/app.bundle.js`；网页实际加载的是这个打包文件。

### Logo 和颜色

替换 `assets/logo.png` 与 `assets/logo-square.png` 即可。主色在 `styles/main.css` 开头的 `:root` 中：黄色 `#ffce32`、蓝色 `#3262f5`、奶油白 `#fffdf5`。

### 正式游戏与联系方式

当前「玩一下」展示的是网站内置体验。后续有正式游戏的 TapTap / App Store / Steam 链接时，可在 `index.html` 对应卡片中换成真实入口。当前没有捏造邮箱或社交账号；获得实际联系方式后可把「打个招呼」区域改成真实联系入口。

## 本地预览

完整解压后，**直接双击 `index.html`** 即可打开。交付包使用普通脚本，Three.js 和小游戏都已打包到本地，不需要 HTTP 服务器，也不需要访问 CDN。请保留 `scripts`、`styles`、`assets` 等文件夹；不要只取出一个 HTML 文件。

如果更新了旧版本，请整体替换文件并刷新网页。手机和其他访客直接访问 GitHub Pages 网址即可。

## 修改 JavaScript 后重新打包（仅开发者需要）

交付包已生成 `scripts/app.bundle.js`，**部署或游玩无需执行本节**。如果修改了 `scripts/main.js`、`scripts/playground.js`、`scripts/fallback-playground.js` 或小游戏源码，请在本目录安装 Node.js 后执行：

```bash
npm install
npm run build
```

构建使用固定版本 esbuild 0.28.2，产物为一个普通 IIFE 脚本，不拆分动态模块。将更新后的 `scripts/app.bundle.js` 一并上传；不要上传 `node_modules`。CSS 和图片修改可直接生效，无需重新打包。

## 数据与兼容性

- 本站不使用账号、数据库、统计跟踪或表单提交。
- 浏览器 `localStorage` 只用于保存语言偏好和该设备的小游戏最好成绩；关闭存储权限也可以游玩，只是不保存记录。
- Three.js 使用本地 **0.187.0 / r187** 官方发布模块，已合并进普通脚本；保留模块源码与许可证供后续维护。无运行时 CDN、在线字体或模型下载。
- 当前 Three.js 三维渲染需要 WebGL 2；页面提供可点击、拖动、换队形和开启音效的二维兼容模式。不支持 JavaScript 时可以阅读静态介绍，但无法切换语言或运行游戏。
- 建议使用更新的 Chrome、Edge、Firefox 或 Safari。不同手机的图形性能存在差异，因此限制了画布像素比并在后台/离屏时暂停三维循环。

## 修复说明与核验

- 已将 ES module 网页入口改为自包含普通脚本，支持本地双击；页面资源保持相对路径。JavaScript 语法与打包结果已检查。
- 基础互动先于 Three.js 和其他小游戏启动；三维初始化失败、超时或上下文丢失时继续使用二维太阳，并保留快乐计数和声音偏好。入口文件缺失时不再永久显示「正在唤醒小太阳」。
- 已在浏览器实际检查中英切换、窄屏菜单、20 秒小游戏的点击计分与暂停、记忆游戏的翻牌反馈。太阳兼容模式连续点击 5 次准确计为 05；拖动不计分，换队形与声音开关正常。
- 已检查 390px 与 320px 外框的手机窄屏布局（浏览器滚动条会占用少量宽度），并修正横向溢出；平板布局也已预览。
- 已用 `/bigdan-studio/` 子目录实际打开页面，验证项目站点资源路径。
- 初始化中途失败、资源销毁与 context loss 的程序级故障检查通过。
- 当前检查用的云端浏览器禁用 WebGL，因而浏览器实测的是二维兼容互动。完整 Three.js 模块与场景已交付并通过语法、依赖及生命周期检查；三维画面的真实 GPU 渲染与实际音频出声未在该环境实测。
- 本轮环境只允许 HTTP/HTTPS，无法现场打开 file://。本地双击所需的普通脚本与相对资源路径已完成检查，打包产物没有运行时 import 或动态模块请求；file:// 路径未做浏览器现场验证。

## 官方参考资料

- GitHub Pages 介绍：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- 发布来源设置：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Three.js 自适应设计：https://threejs.org/manual/pages/responsive.html
- Three.js 许可证：见 `vendor/three/LICENSE`

© 2026 BigDan Studio. 网站中的工作室名称与品牌素材由项目提供；Three.js 按其 MIT 许可证使用。
