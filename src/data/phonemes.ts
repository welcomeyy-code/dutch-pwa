import type { PhonemeUnit } from '../types'

export const PHONEMES: PhonemeUnit[] = [
  {
    id: 'ui',
    grapheme: 'ui',
    ipa: '/œy/',
    summaryZh: '中国人最容易读成"哎"或"奥意"的双元音',
    articulationZh:
      '先把嘴唇撅圆（像发"u/ü"），舌位在口腔中部靠前，发 /œ/ 音，然后下巴略合、舌头向前上滑，嘴唇保持圆形不要松开，滑向 /y/。起点开口比 "eu" 大，全程嘴唇都圆。',
    tipsZh: [
      '不要读成英语的 "ow" 或汉语的"哦意"：嘴唇圆形保持到最后。',
      '可先发汉语"鹅"的口型，再把嘴唇撅圆，边保持边滑向"迂（ü）"。',
      '对比 ij/ei：ui 嘴唇是圆的，ij/ei 嘴唇是扁的。',
    ],
    minimalPairs: [
      { nl: 'huis', ipa: '/ɦœys/', zh: '房子', contrast: false },
      { nl: 'hoes', ipa: '/ɦus/', zh: '套子', contrast: true },
      { nl: 'uit', ipa: '/œyt/', zh: '出，来自', contrast: false },
      { nl: 'oud', ipa: '/ʌut/', zh: '老的', contrast: true },
      { nl: 'zuid', ipa: '/zœyt/', zh: '南', contrast: false },
      { nl: 'zout', ipa: '/zʌut/', zh: '盐', contrast: true },
    ],
  },
  {
    id: 'eu',
    grapheme: 'eu',
    ipa: '/øː/',
    summaryZh: '嘴唇圆、舌位靠前的长元音，类似德语 ö',
    articulationZh:
      '舌头位置和发"e（诶）"一样，舌尖抵下齿，但把嘴唇撅圆，像要吹口哨。这是一个单元音，口型从头到尾不变，不要滑动。',
    tipsZh: [
      '先发长长的"诶——"，保持舌头不动，只把嘴唇慢慢撅圆，就得到 eu。',
      '不要读成汉语"欧"（o）：欧的舌位靠后，eu 的舌位靠前。',
      '不要读成"二（er）"，舌头不要卷。',
    ],
    minimalPairs: [
      { nl: 'deur', ipa: '/døːr/', zh: '门', contrast: false },
      { nl: 'door', ipa: '/doːr/', zh: '穿过', contrast: true },
      { nl: 'duur', ipa: '/dyːr/', zh: '贵', contrast: true },
      { nl: 'reus', ipa: '/røːs/', zh: '巨人', contrast: false },
      { nl: 'roos', ipa: '/roːs/', zh: '玫瑰', contrast: true },
      { nl: 'neus', ipa: '/nøːs/', zh: '鼻子', contrast: false },
    ],
  },
  {
    id: 'ij-ei',
    grapheme: 'ij / ei',
    ipa: '/ɛi/',
    summaryZh: 'ij 和 ei 发音完全相同，口型是"扁"的双元音',
    articulationZh:
      '起点是开口较大的 /ɛ/（类似汉语"诶"，比英语 bed 略开），然后舌头向上抬高滑向 /i/，嘴唇始终展平（不圆）。听感介于汉语"爱"和"黑"之间，但比"爱"更偏 e。',
    tipsZh: [
      '不要读成汉语"爱（ai）"：荷兰语起点是 ɛ，更靠前、更紧。',
      'ij 和 ei 是同一个音，只是拼写不同；背单词时要记拼写（tijd，trein）。',
      '注意与 ie /i/ 区分：wijn（葡萄酒）≠ win（赢）。',
    ],
    minimalPairs: [
      { nl: 'wijn', ipa: '/ʋɛin/', zh: '葡萄酒', contrast: false },
      { nl: 'win', ipa: '/ʋɪn/', zh: '赢（ik win）', contrast: true },
      { nl: 'trein', ipa: '/trɛin/', zh: '火车', contrast: false },
      { nl: 'tien', ipa: '/tin/', zh: '十', contrast: true },
      { nl: 'zijn', ipa: '/zɛin/', zh: '是', contrast: false },
      { nl: 'zin', ipa: '/zɪn/', zh: '句子，兴致', contrast: true },
    ],
  },
  {
    id: 'g-ch',
    grapheme: 'g / ch',
    ipa: '/x/',
    summaryZh: '喉咙后部的摩擦音，类似汉语"喝"，但摩擦更强',
    articulationZh:
      '舌根向软腭（口腔顶部靠后）抬起，留一条窄缝，气流从缝中挤出产生摩擦，声带不振动（荷兰北部口音）。口型像汉语"喝（h）"但位置更靠后，像清嗓子的轻声版。g 和 ch 在荷兰（北部）的标准读法里是同一个音。',
    tipsZh: [
      '不要读成汉语的"k"或"g"（不能完全堵住气流）。',
      '也不要读成英语的轻 "h"：荷兰语 g/ch 有明显的摩擦感。',
      '南部（比利时、林堡）口音会读得偏软（/ɣ/），考试和日常两种都能被理解。',
      '词尾 ch（acht、dag）要读清楚，不要吞掉。',
      '词库里的音标由 eSpeak 生成，g 可能标成 [ɣ]（浊），ch 标成 [x]（清）；日常说话差别很小，都往喉咙后部摩擦即可。',
    ],
    minimalPairs: [
      { nl: 'goed', ipa: '/xut/', zh: '好', contrast: false },
      { nl: 'hoed', ipa: '/ɦut/', zh: '帽子', contrast: true },
      { nl: 'gaan', ipa: '/xaːn/', zh: '去', contrast: false },
      { nl: 'haan', ipa: '/ɦaːn/', zh: '公鸡', contrast: true },
      { nl: 'dag', ipa: '/dɑx/', zh: '天，你好', contrast: false },
      { nl: 'dak', ipa: '/dɑk/', zh: '屋顶', contrast: true },
    ],
  },
  {
    id: 'r',
    grapheme: 'r',
    ipa: '/r/ · /ʀ/ · /ʁ/',
    summaryZh: 'r 可以是舌尖颤音，也可以是小舌音，两种都被接受',
    articulationZh:
      '词首和元音之间：可以用舌尖轻弹上齿龈（类似西班牙语 r 的单击/颤音），或用小舌在喉咙后部颤动/摩擦（类似法语 r）。词尾和辅音前（vier、werk）通常发得较弱，接近 /r/ 的轻读或 /ɐ/。',
    tipsZh: [
      '不要读成汉语卷舌音"日"或英语的 r：荷兰语 r 舌头不向后卷。',
      '初学者先用舌尖弹动版本：舌尖放松放在上齿龈后，让气流带动舌尖颤一下。',
      '练习 r 与 l 的区分：rood（红）≠ lood（铅）。',
      '不用追求颤很多下：一下弹音就够用。',
    ],
    minimalPairs: [
      { nl: 'rood', ipa: '/roːt/', zh: '红色', contrast: false },
      { nl: 'lood', ipa: '/loːt/', zh: '铅', contrast: true },
      { nl: 'raam', ipa: '/raːm/', zh: '窗户', contrast: false },
      { nl: 'laam', ipa: '/laːm/', zh: '瘫痪的', contrast: true },
      { nl: 'vier', ipa: '/vir/', zh: '四', contrast: false },
      { nl: 'vies', ipa: '/vis/', zh: '脏的', contrast: true },
    ],
  },
]
