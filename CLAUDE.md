# Nederlands 学习 PWA

给中文母语者的荷兰语入门学习 PWA，主设备 iPhone（Safari → 添加到主屏幕）。
**目标**：帮助中文母语者从零学到 A2：积累常用词汇、掌握发音难点、能读懂身边的荷兰语。界面与讲解语言：简体中文。

## 技术栈
React 19 + Vite + TypeScript + `vite-plugin-pwa` + `react-router-dom` 的 **HashRouter**。
部署：GitHub Actions → GitHub Pages（`.github/workflows/deploy.yml`，推送 main 即发布）。
Vite `base: './'`，同一份构建可放在任何仓库路径下，无需改配置。
数据：IndexedDB（`idb-keyval`）。无后端。

命令：`npm run dev` · `npm run build`（含 tsc 类型检查）· `npm run preview`。
本机 Windows：Node/Git 通过 winget 安装；新开终端才会刷新 PATH。

## 目录
```
src/
  types.ts            全部数据类型
  db/db.ts            IndexedDB 读写、种子导入、导出/整体替换
  lib/srs.ts          SM-2 简化版（重来/困难/记得/简单）
  lib/tts.ts          speechSynthesis，nl-NL
  lib/claude.ts       拍照解读：Claude Messages API（vision + tool use 强制 JSON）
  lib/image.ts        图片压缩（长边 1600px JPEG）
  lib/gist.ts         GitHub Gist 手动同步
  lib/merge.ts        按记录 updatedAt 合并 + 墓碑删除
  lib/settings.ts     localStorage：API key、模型、Gist token/ID
  data/a1-words.ts    50 个 A1 种子词（updatedAt=0）
  data/phonemes.ts    5 个发音难点
  pages/              Home Review Deck Scan Pronunciation Settings
```

## 数据结构（见 `src/types.ts`）
- **Word**：`id=${nl小写}-${pos}`（用于去重）、nl、article(de/het)、pos、zh[]、ipa、examples[]、level(CEFR)、topic、`source: 'deck'|'photo'`、extra{plural,pastTense,separable}、createdAt、updatedAt。
- **ReviewRecord**：wordId、ease、interval(天)、reps、lapses、due、lastReview、updatedAt。一词一条；没有记录 = 新词。
- **GrammarLesson**：中文讲解 + 例句 + 练习（choice/fill/order）。**类型已定义，页面未做。**
- **PhonemeUnit**：音素、IPA、舌位/唇形中文说明、小贴士、对比词。
- **PhotoScan**：拍照历史（原文、逐词、语法讲解）。
- **BackupData**：words/reviews/scans/tombstones，用于导出与 Gist。

IndexedDB 键：`words` `reviews` `scans` `tombstones` `seeded-v1`，每个键存一个 `Record<id, …>`。

## 同步与备份
- Gist 同步**只手动触发**。上传前先拉远端合并；拉取也是合并，不整体覆盖。
- 冲突规则：逐条取 `updatedAt` 较大者；删除写入 `tombstones`，墓碑晚于记录才删除。
- 凡修改 Word / ReviewRecord / PhotoScan，**必须更新 `updatedAt`**，否则合并会丢改动。
- Gist API 需要**经典 token（gist 权限）**；细粒度 token 目前不支持 Gist。私密 Gist ≠ 加密。
- 也有本地 JSON 导出/导入作为兜底。

## 安全约定
- Claude API key 和 GitHub token 只存 localStorage，请求从浏览器直发。调用 Anthropic 需要头 `anthropic-dangerous-direct-browser-access: true`。仅自用，**不得提交任何 key 到仓库**。
- 默认模型 `claude-sonnet-5-5`，可在设置页修改。
- 拍照解读支持两个服务商（设置页切换，默认 Gemini）：`lib/claude.ts`（Claude，tool use）和 `lib/gemini.ts`（Gemini，`responseSchema`，默认模型别名 `gemini-flash-latest`），由 `lib/scan.ts` 分发；两者共用同一个 JSON schema 和提示词。第三个服务商 DeepSeek 在 `lib/deepseek.ts`：OpenAI 兼容的 chat completions + `response_format: json_object`，图片走 `image_url`（视觉功能较新，默认模型 `deepseek-flash`，失败时自动试 `deepseek-v4-flash-vision-exp`，模型名可在设置里改）；输出经 `normalize()` 容错。浏览器直连已验证 CORS 允许（对 github.io 来源回 allow-origin）。写作批改/口语反馈这类纯文本任务以后可直接复用 DeepSeek 的文本模型。Gemini 免费档的内容可能被 Google 用于改进产品，设置页有提示。
- 朗读声音：`lib/tts.ts` 自动优先选荷兰语女声，设置页可手选。iOS 的网页朗读接口常常看不到系统里下载的增强版/高品质声音（如 Claire），属于系统限制；备选方案是预生成音频文件。

## iOS PWA 注意事项
- `index.html` 需要 `apple-touch-icon`、`apple-mobile-web-app-capable`、`viewport-fit=cover`；样式用 `env(safe-area-inset-*)` 处理刘海和底部横条（`.main` 与 `.tabbar` 已处理）。
- 输入框字体 ≥16px，否则 iOS 聚焦时会自动放大页面。
- **TTS**：`speechSynthesis` 必须由点击触发，不能自动播放；声音列表异步加载，需监听 `voiceschanged`；需要用户在「设置 → 辅助功能 → 朗读内容 → 声音」里下载荷兰语声音。TTS 区分最小对立词的能力有限，只作参考。
- **存储**：主屏幕 PWA 与 Safari 的存储是隔离的，数据要在 PWA 里使用/导入。iOS 可能清理长期不用的站点数据 → 定期导出或同步 Gist。
- 相机：`<input type="file" accept="image/*" capture="environment">`；大图先压缩，避免内存吃紧。
- 无推送、无后台同步，复习靠主动打开。
- Service Worker 更新有延迟：改完代码后要彻底关闭并重开 PWA，或在 Safari 里刷新。
- 路由必须用 HashRouter（GitHub Pages 无 SPA 回退）。

## 词库（src/data/core.json）
- 来自用户提供的 `dutch_a1_a2_core.json`：1608 词（A1 618 / A2 990），NT2Lex + 手工补充，中文释义，eSpeak 生成 IPA（`ipa_checked` 为手工校对过的）。**许可 CC BY-NC-SA 4.0：仅个人非商业使用，需署名，衍生品同协议。** 若仓库/站点公开，要保留署名（设置页「关于词库」已有）并确认符合非商业条件。
- 不进主包：`lib/library.ts` 用动态 `import()` 单独成块，映射为 `Word`（N→noun, WW→verb, ADJ→adj, BW→adv, VZ→prep, VNW→pron, VG→conj, TW→num, LID→other, TSW→phrase）。
- 没有例句；themes（werk/eten/gemeente…）存入 `Word.themes`，`topic` 取第一个。`freq_rank` → `Word.freqRank`，新词按它排序出现。
- 用户在「词库」页（/library）筛选后手动加入卡组，不自动全量导入。id 规则与种子词相同（`nl-pos`），重复自动跳过。
- 待做：给词库补例句（可用 Claude 批量生成并人工抽查）。

## 已完成的 MVP
词汇（50 词 + SRS + TTS）· 拍照解读（Claude vision → JSON → 一键入卡组）· 发音（ui、eu、ij/ei、g/ch、r）· Gist/JSON 备份。

## 路线图
1. **NT2Lex A2 全词库导入**：先核对授权；写 CSV → `Word` 的转换脚本；分级、分主题、按需加载（数据量大时拆分 JSON 或放入 IndexedDB，不要塞进 JS 包）。
2. **中文语法课**：按入籍 A2 语法点排序（语序、变位、可分动词、de/het、复数、过去式、完成时、从句），含练习。
3. **场景句型**：问路、看病、超市、银行、市政厅、工作闲聊/会议用语。
4. **考试模拟**：入籍考试的听、说、读、写、KNM（荷兰社会常识）。
5. 其他：更多发音单元（sch、aa/ee/oo/uu、eu 与 oe 对比等）、录音自评、真人音频源、统计与连续天数。

## 预生成音频（神经女声）
- `scripts/gen-audio.ts`（`npm run audio`）用 Azure Speech 的 `nl-NL-ColetteNeural` 为词库词条、种子例句、发音对比词生成 mp3，写入 `public/audio/`，并生成 `index.json`（文本 → 文件名）。约 1658 条、1.35 万字符，在 Azure 免费档（F0，每月 50 万字符）内；免费档限速，脚本约 18 次/分钟，可中断重跑。
- 应用里 `lib/tts.ts` 的 `speak()` 先查清单：有预录音频就播放，否则退回系统朗读。文本必须与 `displayWord()` 完全一致才能命中。
- 音频不预缓存，播放过的由 Service Worker 运行时缓存（含 Range 请求，iOS 需要）。
- key 通过环境变量传入，不要写进代码或提交。

## ��ϰ��ϵ��A2 ��˵��д��
- ·�ߣ��﷨�� �� ����/��д �� д������ + ����¼�� �� �Ķ� �� ģ�⿼�ԡ�**KNM ����**���û���ȷ����Ҫ����
- �﷨�Σ�`src/data/grammar.ts`��18 �Ρ�103 �⣩������ choice / fill / order��choice/fill �� prompt �� `___` ��ʾ�ո�order �� prompt ��������˼��answer ���������ӣ����� `alts` ���ܶ������򣩡�`exerciseSentence()` ����������������ӣ����ڴ���ʶ���Ԥ������Ƶ��
- ��ϰ���� `components/ExerciseRunner.tsx`���������� `schedule()` д�� `reviews`����Ϊ `ex:<lessonId>:<���>`�����=�ǵã����=���������ʻ㸴ϰҳֻ���� `words`��������Щ��Ӱ�죻Gist �ϲ�����ͨ�ã����Խ��Ȼ��汸��ͬ����
- ҳ�棺`/practice`����ϰ���ģ���`/grammar`��`/grammar/:id`��`/grammar/review`�����ڴ��⣩���ײ� 5 ����ǩ����ҳ / ��ϰ / ��ϰ / ���� / ���á�
- �����������ı���Ҫ���� `scripts/gen-audio.ts` ����Ƶ��`gen-audio` ������﷨�������ϰ�䣩��

## 听力与听写
- `data/listening.ts`：12 段 A2 场景（问路、超市、预约医生、车站广播、咖啡馆、同事闲聊、图书馆留言、邻居、天气、学校通知、药店、会议改期），31 道三选一题。每句标 `who: 'f' | 'm'`（女声 Colette / 男声 Maarten）。答完题才显示原文和中文；成绩写入 `reviews`，键 `ls:<id>`。
- `data/dictation.ts`：听写题库 = 听力对话句 + 语法例句（3–14 个词的完整句子）。键 `dc:<哈希>`。判分按词对齐（LCS），≥90% 记得，≥60% 困难，否则重来。
- 播放：`lib/tts.ts` 的 `speak(text, rate, who)` 与 `speakLines(lines)`。预生成音频清单键：女声 = 文本，男声 = `m|文本`。iOS 必须复用同一个 `<audio>` 元素，连续播放才不会被拦截。没有预录音频时退回系统朗读（男声尽量选系统里的男声）。
- 新增荷兰语内容后，运行 `node scripts/gen-audio.ts`（需 Azure key，见脚本头注释）补音频；脚本可断点续跑。
