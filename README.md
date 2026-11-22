# PromptVerse

把好用的 AI 提示词集中收录、分类整理，打开就能搜到并一键复制的只读镜像站。

**线上地址：<https://bridy1012.github.io/PromptVerse/>**

## 内容规模

- 284 条已上架 Prompt
- 12 个内容分类
- 646 个可用标签

## 功能

- 首页：精选卡片流、示例 Prompt、最近更新、分类速览
- 关键词搜索：覆盖标题、简介、正文与标签
- 分类与标签筛选，支持组合筛选与分页
- 详情页：完整正文、更新时间、同分类推荐
- 一键复制 Prompt 正文
- 响应式布局，桌面端与移动端均可正常使用
- 只读镜像：没有登录、后台入口与任何写操作

## 仓库结构

```
index.html          入口页面，加载样式、数据与脚本
assets/
  styles.css        全站样式
  js/ui.js          通用 UI 组件（卡片、分页、Toast、复制）
  js/static-db.js   内存数据查询层（搜索 / 筛选 / 分页 / 关联推荐）
  js/static-app.js  路由与页面渲染
data/prompts.js     构建时内嵌的全部 Prompt 数据
.nojekyll           让 GitHub Pages 跳过 Jekyll 处理
404.html            非根路径兜底，跳回首页
```

所有数据在构建时写入 `data/prompts.js`（挂到 `window.PV_DATA`），页面渲染完全在前端完成，不依赖任何后端接口或 `/api` 请求。

## 数据来源与更新

站点内容在本地维护，本仓库只存放发布产物。更新流程：

1. 在本地内容库中编辑 Prompt 与分类；
2. 运行 `publish-github.ps1`，脚本读取 `data/db.json`，仅导出已上架且未删除的条目，重新生成静态快照并推送到本仓库；
3. GitHub Pages 收到推送后自动重建，只读站点随即更新。

README 与快照同源生成，重新发布时会一起刷新并保留，不会被覆盖丢失。

## 技术说明

- 零依赖原生 JavaScript（ES5 语法），无框架、无构建工具链
- hash 路由（`#/`、`#/category`、`#/prompt/:id`），可直接静态托管
- 构建脚本：`tools/build-static.js`

## 本地预览

```powershell
.\publish-github.ps1 -Preview
```

生成快照后启动本地服务，默认地址为 <http://127.0.0.1:8080/>。若只想生成、不推送，可使用 `.\publish-github.ps1 -NoPush`。
