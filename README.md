# 陈晓锋 · 3D Artist Portfolio

硬表面武器与风格化角色的 3D 美术个人作品集。纯 HTML / CSS / JavaScript 静态站点，无构建步骤，可直接部署到 GitHub Pages。

在线地址：<https://biekzi.github.io/portfolio/>

## 本地预览

```bash
python -m http.server 4173
```

打开 `http://127.0.0.1:4173`。

## 目录结构

```
index.html              页面结构（文案、项目、图库）
assets/css/style.css    全部样式与响应式规则
assets/js/main.js       导航、滚动动效、灯箱图库
assets/img/weapons/     武器项目网页图（2000px 宽）
assets/img/characters/  角色项目网页图
assets/img/og-cover.jpg 社交分享封面
favicon.svg             站点图标
```

## 修改指南

- **文案**：直接编辑 `index.html` 中的项目标题、介绍与图片说明。
- **配色 / 字体 / 间距**：编辑 `assets/css/style.css` 顶部的 `:root` 变量。
- **换图**：替换 `assets/img/` 下同名文件，保持宽高比即可。
- **邮箱 / 社交链接**：搜索 `https://github.com/USERNAME` 替换为你的实际链接；如需展示邮箱，在联系区添加 `mailto:` 按钮。

## 部署

1. 推送到 GitHub 仓库的 `main` 分支。
2. 仓库 Settings → Pages → Source 选择 `Deploy from a branch`，分支 `main`、目录 `/ (root)`。
3. 稍等片刻，站点地址为 `https://<用户名>.github.io/<仓库名>/`。

## 说明

仓库只包含网页优化后的图片（约 1.5 MB）。原始高清 PNG 保留在本地，未上传，以保持仓库轻量与页面加载速度。
