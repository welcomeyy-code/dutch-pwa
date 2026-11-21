# Nederlands 学习

给中文母语者的荷兰语入门学习 PWA（A1–A2），为 iPhone 设计（Safari → 添加到主屏幕），也可在电脑浏览器使用。

## 功能
- **词汇**：SRS 间隔复习，点喇叭用系统荷兰语语音朗读。
- **词库**：A1+A2 核心词 1608 个，可按级别、词性、主题筛选后加入卡组。
- **拍照解读**：拍照或选图 → Claude（视觉）→ 原文、逐词释义、中文语法讲解 → 一键加入卡组。
- **发音**：ui、eu、ij/ei、g/ch、r 五个难点音，含舌位说明和对比词。
- **备份**：本地 JSON 导出/导入，可选 GitHub Gist 手动同步。

## 技术栈
React + Vite + TypeScript + vite-plugin-pwa + HashRouter，数据存 IndexedDB，通过 GitHub Actions 部署到 GitHub Pages。

## 本地运行
```bash
npm install
npm run dev
```

## 使用拍照解读
在设置页填入自己的 Claude API key。key 只保存在本机浏览器里，不会进入仓库。

## 许可
- 代码：MIT。
- 词库 `src/data/core.json`：CC BY-NC-SA 4.0，基于 [NT2Lex](https://github.com/anaistack/NT2Lex)（Tack et al. 2018），仅限个人、非商业使用，需署名。

详见 [LICENSE](LICENSE)。开发约定见 [CLAUDE.md](CLAUDE.md)。
