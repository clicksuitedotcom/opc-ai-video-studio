# OPC AI Video Studio

面向 OPC（One Person Company）的 AI 视频和 AI 漫剧制作 Web App 原型。

## 功能

- Homepage：登录/注册入口、产品价值说明、制作线地图和适用场景。
- 项目定义：搜索、创建项目、查看项目状态，进入剧本工作台。
- AI 生成剧本：输入故事种子、题材、风格、长度和人物设定，一键生成结构化短剧剧本。
- 剧本工作台：编辑剧本、查看项目关联、自动抽取角色/场景/输出内容。
- 素材准备：管理角色、场景、道具和音色，支持批量生成素材。
- 分镜和批量生成：为每个分镜绑定素材，选择 Seedance / Doubao / Kling / Runway 等模型生成视频。
- 合成发布：时间线预览、画幅和清晰度设置、字幕与角色一致性开关、模拟导出成片。
- 模型与 Key：配置默认模型、默认时长、生成并发和 API Key，并查看后台接口状态。
- 用量统计：按模型展示模拟消耗比例。

## 使用

直接在浏览器打开 `index.html` 即可运行，无需安装依赖。

也可以启动本地静态服务：

```bash
python3 -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 后台接口契约

当前版本是可演示的静态原型，后台由 `api.js` 提供 Mock API。后续接真实服务时，保持以下方法和响应结构即可平滑替换：

| Method | Path | 用途 |
| --- | --- | --- |
| GET | `/api/health` | 服务健康检查 |
| POST | `/api/script/generate` | AI 生成剧本、场次和分镜草稿 |
| POST | `/api/script/breakdown` | 剧本拆解为场次/分镜 |
| POST | `/api/assets/sync` | 从剧本同步角色、场景、道具 |
| POST | `/api/video/generate` | 批量生成分镜视频 |
| POST | `/api/compose/export` | 合成导出成片 |

前端入口是 `window.OPC_API`，真实后端接入时可以把 `api.js` 替换为 `fetch` 实现。

## 图片素材

原型中的真实照片保存在 `assets/`，来源为 Wikimedia Commons 公开图片，用于替换早期的 SVG 示意图。后续接入真实 AI 生成结果时，只需要替换同名 JPG 文件即可。
