import type { Exercise, GrammarLesson } from '../types'

// A2 语法课。讲解面向中文母语者，所有例句和练习由人工编写，建议学习者抽查并和老师/教材核对。
const ex = (nl: string, zh: string) => ({ nl, zh })
const ch = (prompt: string, options: string[], answer: string, explainZh?: string, hint?: string): Exercise =>
  ({ type: 'choice', prompt, options, answer, explainZh, hint })
const fi = (prompt: string, answer: string, hint?: string, explainZh?: string, accept?: string[]): Exercise =>
  ({ type: 'fill', prompt, answer, hint, explainZh, accept })
const or = (zh: string, answer: string, explainZh?: string, alts?: string[]): Exercise =>
  ({ type: 'order', prompt: zh, answer, explainZh, alts })

/** 题目作答后朗读/生成音频用的完整荷兰语句子 */
export function exerciseSentence(e: Exercise): string | null {
  const s = e.type === 'order' ? e.answer : e.prompt.includes('___') ? e.prompt.replace('___', e.answer) : null
  return s && /[.?!]$/.test(s) ? s : null // 只给完整句子配朗读
}

export const LESSONS: GrammarLesson[] = [
  {
    id: 'zijn-hebben', title: '人称代词与 zijn / hebben', level: 'A1',
    explanationZh:
`人称代词：ik（我）、jij/je（你）、u（您）、hij（他）、zij/ze（她）、het（它）、wij/we（我们）、jullie（你们）、zij/ze（他们）。
• zijn（是）：ik ben · jij bent · u bent · hij/zij/het is · wij/jullie/zij zijn
• hebben（有）：ik heb · jij hebt · u hebt/heeft · hij/zij/het heeft · wij/jullie/zij hebben
注意：主语 jij 放在动词后面（倒装）时，动词词尾的 -t 要去掉：Heb jij tijd？Ben jij moe？
je/ze/we 是 jij/zij/wij 的弱读形式，口语和书写中非常常见。`,
    examples: [ex('Ik ben Anna.', '我是安娜。'), ex('Jij bent mijn collega.', '你是我的同事。'), ex('Hij heeft een fiets.', '他有一辆自行车。'), ex('Wij zijn thuis.', '我们在家。'), ex('Heb jij tijd?', '你有时间吗？')],
    exercises: [
      ch('Ik ___ moe.', ['ben', 'bent', 'is', 'zijn'], 'ben'),
      ch('Hij ___ een auto.', ['heeft', 'hebt', 'heb', 'hebben'], 'heeft'),
      fi('Wij ___ in Amsterdam.', 'zijn', '（zijn）'),
      fi('___ jij morgen tijd?', 'Heb', '（hebben，注意倒装）', 'jij 在动词后面时，hebt 变成 heb。', ['heb']),
      ch('___ jij moe?', ['Ben', 'Bent', 'Is', 'Zijn'], 'Ben', 'jij 倒装时 bent 变成 ben。'),
      or('他们有两个孩子。', 'Zij hebben twee kinderen.'),
    ],
  },
  {
    id: 'regular-verbs', title: '规则动词的现在时', level: 'A1',
    explanationZh:
`不定式去掉 -en 得到词干（werken → werk）。
• ik：词干（ik werk）
• jij / u / hij / zij / het：词干 + t（hij werkt）
• wij / jullie / zij（复数）：不定式（wij werken）
• jij 放在动词后面时去掉 -t：Werk jij hier？
词干本身已经以 t 结尾，不再加 t：hij praat。
拼写：长元音在词干里变回双写：wonen → ik woon，maken → ik maak。词干以 v/z 结尾的，v 变 f、z 变 s：leven → ik leef，reizen → ik reis。`,
    examples: [ex('Ik werk in Utrecht.', '我在乌得勒支工作。'), ex('Jij woont in Delft.', '你住在代尔夫特。'), ex('Hij maakt koffie.', '他煮咖啡。'), ex('Wij werken samen.', '我们一起工作。'), ex('Werk jij op maandag?', '你周一上班吗？')],
    exercises: [
      ch('Mijn zus ___ bij een bank.', ['werkt', 'werk', 'werken', 'gewerkt'], 'werkt'),
      fi('Ik ___ in Rotterdam.', 'woon', '（wonen）', '词干：woon。长元音 o 在词干里写成 oo。'),
      fi('Hij ___ koffie.', 'drinkt', '（drinken）'),
      fi('___ jij hier?', 'Werk', '（werken，注意倒装）', 'jij 倒装时不加 -t。', ['werk']),
      ch('Wij ___ graag Nederlands.', ['spreken', 'spreekt', 'spreek', 'gesproken'], 'spreken'),
      or('你们很努力地工作。', 'Jullie werken hard.'),
    ],
  },
  {
    id: 'word-order-v2', title: '语序：动词第二位与倒装', level: 'A1',
    explanationZh:
`陈述句里，变位动词永远是句子的第二个“成分”（不一定是第二个词）。
• 主语在前：Ik werk morgen.
• 把时间或地点放到句首，主语和动词就倒装：Morgen werk ik.
• 句首的成分只占第一位：Op het terras drink ik thee.
有两个动词时，变位动词在第二位，不定式或过去分词放到句尾：Ik wil morgen werken.
和中文不同：时间放句首后，动词不能退到第三位，必须紧跟在后面。`,
    examples: [ex('Ik werk morgen.', '我明天上班。'), ex('Morgen werk ik.', '明天我上班。'), ex('Vandaag ga ik naar school.', '今天我去学校。'), ex('In Utrecht woon ik.', '我住在乌得勒支。'), ex('Ik wil morgen werken.', '我明天想工作。')],
    exercises: [
      or('明天我不上班。', 'Morgen werk ik niet.'),
      ch('Vandaag ___ naar school.', ['ga ik', 'ik ga', 'ik gaat', 'gaan ik'], 'ga ik', '句首是 Vandaag，动词必须紧跟在第二位。'),
      ch('In Utrecht ___.', ['woon ik', 'ik woon', 'ik woont', 'wonen ik'], 'woon ik'),
      fi('Nu ___ ik koffie.', 'drink', '（drinken）'),
      or('我今天想待在家里。', 'Ik wil vandaag thuis blijven.', undefined, ['Ik wil thuis vandaag blijven.', 'Vandaag wil ik thuis blijven.']),
    ],
  },
  {
    id: 'questions', title: '疑问句与疑问词', level: 'A1',
    explanationZh:
`• 是非问句：动词放句首：Heb jij een fiets？Werk je hier？
• 疑问词问句：疑问词 + 动词 + 主语：Waar woon jij？
常用疑问词：wie（谁）、wat（什么）、waar（哪里）、wanneer（什么时候）、waarom（为什么）、hoe（怎样）、hoeveel（多少）、welke / welk（哪个）。
• welk 用于 het 词（Welk boek？），welke 用于 de 词和复数（Welke tafel？）。
• 固定问法：Hoe heet je？（你叫什么？）Hoe laat is het？（几点了？）Hoeveel kost dit？（这个多少钱？）`,
    examples: [ex('Waar woon jij?', '你住在哪里？'), ex('Hoe heet je?', '你叫什么名字？'), ex('Wanneer kom jij naar huis?', '你什么时候回家？'), ex('Hoeveel kost dit brood?', '这个面包多少钱？'), ex('Spreek je Nederlands?', '你会说荷兰语吗？')],
    exercises: [
      ch('___ woon jij?', ['Waar', 'Wie', 'Wanneer', 'Hoeveel'], 'Waar'),
      ch('___ heet je?', ['Hoe', 'Wat', 'Wie', 'Waar'], 'Hoe'),
      fi('___ kost dit brood?', 'Hoeveel', '（多少钱）'),
      or('你什么时候回家？', 'Wanneer kom jij naar huis?'),
      ch('___ jij Nederlands?', ['Spreek', 'Spreekt', 'Spreken', 'Spreke'], 'Spreek', 'jij 倒装时不加 -t。'),
      ch('___ boek is dit?', ['Welk', 'Welke', 'Wat', 'Wie'], 'Welk', 'boek 是 het 词，所以用 welk。'),
    ],
  },
  {
    id: 'negation', title: '否定：niet 与 geen', level: 'A1',
    explanationZh:
`• geen：否定“een + 名词”，或没有冠词的名词：Ik heb geen fiets. / Ik drink geen koffie.
• niet：否定动词、形容词、介词短语，或带定冠词/物主词的名词：Ik werk niet. / De koffie is niet warm. / Dit is niet mijn fiets.
位置：niet 通常放在句末（Ik ken hem niet.），有形容词或介词短语时放在它们前面（Het is niet duur.）。
记法：能用 een 或无冠词的名词用 geen；其他用 niet。`,
    examples: [ex('Ik heb geen tijd.', '我没有时间。'), ex('Hij werkt niet.', '他不工作。'), ex('Dit is niet mijn fiets.', '这不是我的自行车。'), ex('Zij heeft geen kinderen.', '她没有孩子。'), ex('Ik ken hem niet.', '我不认识他。')],
    exercises: [
      ch('Ik heb ___ tijd.', ['geen', 'niet'], 'geen'),
      ch('Hij werkt ___.', ['niet', 'geen'], 'niet'),
      ch('Dit is ___ mijn fiets.', ['niet', 'geen'], 'niet', '带物主词 mijn 的名词，用 niet。'),
      fi('Zij heeft ___ kinderen.', 'geen'),
      ch('Ik drink ___ koffie.', ['geen', 'niet'], 'geen', '没有冠词的名词，用 geen。'),
      or('我不认识他。', 'Ik ken hem niet.'),
    ],
  },
  {
    id: 'de-het-plural', title: 'de / het 与名词复数', level: 'A1',
    explanationZh:
`荷兰语名词分 de 词（约 3/4）和 het 词，没有绝对规律，要连冠词一起记。可靠的规则：
• 小称（-je 结尾）一律是 het：het meisje、het kopje。
• 语言名称是 het：het Nederlands。
复数：
• 多数加 -en：boek → boeken。
• -el、-er、-em、-en、-aar 结尾的词加 -s：tafel → tafels。
• 以 a、i、o、u、y 结尾的词加 's：auto → auto's。
• 拼写要跟着变：huis → huizen，brief → brieven，maan → manen。`,
    examples: [ex('Het huis is groot.', '房子很大。'), ex('De tafel is nieuw.', '桌子是新的。'), ex('Het meisje speelt buiten.', '女孩在外面玩。'), ex('Ik heb twee boeken.', '我有两本书。'), ex('Wij hebben twee auto\'s.', '我们有两辆车。')],
    exercises: [
      ch('___ huis is groot.', ['Het', 'De'], 'Het'),
      ch('___ meisje', ['het', 'de'], 'het', '小称结尾 -je 的词都是 het。'),
      fi('een boek → twee ___', 'boeken'),
      fi('een auto → twee ___', 'auto\'s', undefined, 'auto 以 o 结尾，复数加 \'s。', ['autos']),
      fi('een tafel → twee ___', 'tafels', undefined, '-el 结尾的词加 -s。'),
      fi('een huis → twee ___', 'huizen', undefined, '复数里 s 变成 z。'),
    ],
  },
  {
    id: 'adjective-e', title: '形容词词尾 -e', level: 'A1',
    explanationZh:
`形容词放在名词前面时，通常加 -e：de grote auto、een grote auto、het grote huis。
唯一不加 -e 的情况：不定冠词 een + het 词（单数）：een groot huis。
• de 词：de / een + 形容词-e + 名词（een nieuwe fiets）
• het 词：het + 形容词-e（het grote huis）；een + 形容词（een groot huis）
形容词放在动词后面（做表语）时，永远不变：Het huis is groot.`,
    examples: [ex('Ik heb een groot huis.', '我有一栋大房子。'), ex('De grote auto is duur.', '那辆大车很贵。'), ex('Het grote huis is nieuw.', '那栋大房子是新的。'), ex('Zij heeft een nieuwe fiets.', '她有一辆新自行车。'), ex('Het huis is groot.', '房子很大。')],
    exercises: [
      ch('een ___ huis', ['groot', 'grote'], 'groot', 'een + het 词（单数）不加 -e。'),
      ch('de ___ auto', ['grote', 'groot'], 'grote'),
      ch('het ___ huis', ['grote', 'groot'], 'grote', 'het + 形容词 + het 词：要加 -e。'),
      fi('Het huis is ___.', 'groot', '（大）', '形容词在动词后面，不变化。'),
      ch('een ___ auto', ['grote', 'groot'], 'grote', 'auto 是 de 词，所以加 -e。'),
      fi('een ___ fiets', 'nieuwe', '（nieuw）'),
    ],
  },
  {
    id: 'possessive-demonstrative', title: '物主代词与指示代词', level: 'A1',
    explanationZh:
`物主代词：mijn（我的）、jouw/je（你的）、zijn（他的）、haar（她的）、ons/onze（我们的）、jullie（你们的）、hun（他们的）、uw（您的）。
• ons 用于单数 het 词（ons huis），onze 用于 de 词和复数（onze auto、onze kinderen）。
指示代词（这、那）：
• het 词单数：dit（这）、dat（那）：dit boek、dat huis
• de 词和所有复数：deze（这）、die（那）：deze jas、die mensen
单独使用时：Wat is dit？Dat is mijn tas.`,
    examples: [ex('Dit is mijn boek.', '这是我的书。'), ex('Dat is onze auto.', '那是我们的车。'), ex('Ons huis is groot.', '我们的房子很大。'), ex('Hoeveel kost deze jas?', '这件外套多少钱？'), ex('Wat is dat?', '那是什么？')],
    exercises: [
      ch('___ huis is groot.', ['Ons', 'Onze'], 'Ons', 'huis 是 het 词。', '（我们的）'),
      ch('___ auto is nieuw.', ['Onze', 'Ons'], 'Onze', 'auto 是 de 词。', '（我们的）'),
      ch('___ boek is leuk.', ['Dit', 'Deze'], 'Dit', 'boek 是 het 词，用 dit。', '（这本）'),
      ch('___ jas is duur.', ['Deze', 'Dit'], 'Deze', 'jas 是 de 词，用 deze。', '（这件）'),
      fi('Zij pakt ___ jas.', 'haar', '（她的）'),
      ch('Dit is ___ moeder.', ['zijn', 'haar', 'mijn', 'hun'], 'zijn', undefined, '（他的）'),
    ],
  },
  {
    id: 'modal-verbs', title: '情态动词 kunnen / willen / moeten / mogen', level: 'A2',
    explanationZh:
`• kunnen（能）：ik kan · jij kunt/kan · hij kan · wij kunnen
• willen（想）：ik wil · jij wilt/wil · hij wil · wij willen
• moeten（必须）：ik moet · jij moet · hij moet · wij moeten
• mogen（可以）：ik mag · jij mag · hij mag · wij mogen
语序：情态动词是变位动词，放第二位；真正表示动作的不定式放句尾：Ik kan morgen komen.
问句：Kunt u mij helpen？Mag ik hier zitten？Wil je koffie？
礼貌：对陌生人用 u + kunt，比命令式更礼貌。`,
    examples: [ex('Ik kan goed zwemmen.', '我游泳游得好。'), ex('Wil je koffie?', '你想喝咖啡吗？'), ex('Je moet hier wachten.', '你得在这里等。'), ex('Mag ik binnenkomen?', '我可以进来吗？'), ex('Kunt u mij helpen?', '您能帮我吗？')],
    exercises: [
      ch('Ik ___ niet komen.', ['kan', 'kunt', 'kunnen'], 'kan'),
      ch('___ ik hier roken?', ['Mag', 'Mogen', 'Mags'], 'Mag'),
      fi('Wij ___ nu gaan.', 'moeten', '（moeten）'),
      or('我想喝一杯咖啡。', 'Ik wil een kopje koffie drinken.'),
      ch('Jij ___ hier wachten.', ['moet', 'moeten', 'moetst'], 'moet'),
      or('您能帮我吗？', 'Kunt u mij helpen?'),
    ],
  },
  {
    id: 'separable-verbs', title: '可分动词', level: 'A2',
    explanationZh:
`可分动词由前缀 + 动词组成（op + bellen = opbellen）。
• 主句里变位动词在第二位，前缀分开放到句尾：Ik bel hem op.
• 不定式（和情态动词连用时）不分开：Ik wil hem opbellen.
• 重音在前缀上：ˈopbellen。
常见：opstaan（起床）、aankomen（到达）、meenemen（带上）、uitleggen（解释）、terugkomen（回来）、binnenkomen（进来）、inschrijven（登记）。`,
    examples: [ex('Ik sta om zeven uur op.', '我七点起床。'), ex('De trein komt om acht uur aan.', '火车八点到。'), ex('Ik bel je morgen op.', '我明天给你打电话。'), ex('Wij willen hem morgen opbellen.', '我们想明天给他打电话。'), ex('Hij komt vandaag terug.', '他今天回来。')],
    exercises: [
      or('我七点起床。', 'Ik sta om zeven uur op.'),
      fi('Ik ___ je morgen op.', 'bel', '（opbellen）'),
      ch('Wij willen hem morgen ___.', ['opbellen', 'bellen op', 'opbelt'], 'opbellen', '和情态动词连用时，不定式不分开。'),
      or('他今天回来。', 'Hij komt vandaag terug.'),
      ch('De trein komt om negen uur ___.', ['aan', 'aankomt', 'op'], 'aan', '前缀 aan 分开放到句尾：aankomen → komt … aan。'),
    ],
  },
  {
    id: 'perfect', title: '完成时（hebben / zijn + 过去分词）', level: 'A2',
    explanationZh:
`结构：hebben 或 zijn（第二位）+ 过去分词（句尾）。
规则动词的分词：ge + 词干 + t/d。
• 词干最后一个字母在 t、k、f、s、ch、p（记作 't kofschip）里 → 加 -t：werken → gewerkt，maken → gemaakt
• 否则加 -d：wonen → gewoond，bellen → gebeld
不规则动词的分词要单独记：gaan → gegaan，komen → gekomen，eten → gegeten，drinken → gedronken，zien → gezien，doen → gedaan，lezen → gelezen。
以 be-、ge-、ver-、ont- 开头的动词，分词不加 ge-：betalen → betaald，vergeten → vergeten。
用 zijn 的情况：表示移动或状态改变的动词，如 gaan、komen、blijven、worden：Ik ben naar huis gegaan。
其余用 hebben。口语里谈论过去，最常用的就是完成时。`,
    examples: [ex('Ik heb gisteren gewerkt.', '我昨天工作了。'), ex('Zij heeft in Utrecht gewoond.', '她在乌得勒支住过。'), ex('Wij zijn naar Amsterdam gegaan.', '我们去了阿姆斯特丹。'), ex('Ik heb koffie gedronken.', '我喝了咖啡。'), ex('Ik heb de rekening betaald.', '我付了账单。')],
    exercises: [
      fi('Ik heb gisteren ___.', 'gewerkt', '（werken）', '词干 werk 以 k 结尾（属于 \'t kofschip），加 -t。'),
      fi('Zij heeft in Utrecht ___.', 'gewoond', '（wonen）', '词干 woon 不在 \'t kofschip 里，加 -d。'),
      ch('Wij ___ naar Amsterdam gegaan.', ['zijn', 'hebben'], 'zijn', 'gaan 表示移动，用 zijn。'),
      ch('Ik ___ koffie gedronken.', ['heb', 'ben'], 'heb'),
      fi('Hij heeft mij ___.', 'gebeld', '（bellen）'),
      fi('Ik heb de rekening ___.', 'betaald', '（betalen）', '以 be- 开头，不加 ge-。'),
      or('我昨天读了一本书。', 'Ik heb gisteren een boek gelezen.'),
    ],
  },
  {
    id: 'past-simple', title: '简单过去时', level: 'A2',
    explanationZh:
`规则动词：词干 + te / de（单数），+ ten / den（复数）。同样用 't kofschip 决定 te 还是 de：werken → werkte，wonen → woonde。
常用不规则动词（单数 / 复数）：
• zijn：was / waren
• hebben：had / hadden
• gaan：ging / gingen
• komen：kwam / kwamen
• kunnen：kon / konden
• willen：wilde / wilden
• moeten：moest / moesten
• zien：zag / zagen；doen：deed / deden；eten：at / aten；drinken：dronk / dronken
用法：说话时多用完成时；但 was、had 和情态动词的过去式（kon、wilde、moest）几乎总用简单过去时。`,
    examples: [ex('Gisteren was ik ziek.', '昨天我生病了。'), ex('Wij waren vorig jaar in Spanje.', '我们去年在西班牙。'), ex('Ik had geen tijd.', '我没有时间。'), ex('Hij ging naar school.', '他去上学了。'), ex('Ik werkte in Utrecht.', '我曾在乌得勒支工作。')],
    exercises: [
      ch('Gisteren ___ ik ziek.', ['was', 'waren', 'ben'], 'was'),
      ch('Wij ___ vorig jaar in Spanje.', ['waren', 'was', 'zijn'], 'waren'),
      fi('Hij ___ gisteren naar school.', 'ging', '（gaan）'),
      fi('Ik ___ gisteren in Utrecht.', 'werkte', '（werken）'),
      fi('Ik ___ geen tijd.', 'had', '（hebben）'),
      ch('Wij ___ naar huis.', ['kwamen', 'kwam', 'komt'], 'kwamen', '复数用 kwamen。'),
    ],
  },
  {
    id: 'prepositions', title: '常用介词', level: 'A2',
    explanationZh:
`• in：在…里面、在某个城市/月份：in Amsterdam、in januari
• op：在…上面、在某一天：op de tafel、op maandag
• aan：靠近、在…边：aan de deur
• bij：在…旁边、在某人/某公司：bij een bank
• naar：去往：naar school、naar huis
• uit：来自、从…出来：uit China
• met：和、乘坐：met de trein
• voor：为了、在…之前
• om：表示具体时刻：om negen uur
固定搭配要整体记：wonen in + 地点，werken bij + 公司，naar school gaan，met de fiets，om acht uur。`,
    examples: [ex('Ik woon in Amsterdam.', '我住在阿姆斯特丹。'), ex('Zij werkt bij een bank.', '她在银行工作。'), ex('Ik ga naar school.', '我去学校。'), ex('Wij reizen met de trein.', '我们坐火车旅行。'), ex('De les begint om negen uur.', '课九点开始。')],
    exercises: [
      ch('Ik woon ___ Amsterdam.', ['in', 'op', 'bij'], 'in'),
      ch('Zij werkt ___ een bank.', ['bij', 'in', 'op'], 'bij'),
      ch('Ik ga ___ school.', ['naar', 'in', 'op'], 'naar'),
      ch('Wij reizen ___ de trein.', ['met', 'in', 'op'], 'met'),
      ch('De les begint ___ negen uur.', ['om', 'op', 'in'], 'om'),
      ch('Ik heb ___ maandag vrij.', ['op', 'in', 'om'], 'op'),
    ],
  },
  {
    id: 'conjunctions', title: '连词与从句语序', level: 'A2',
    explanationZh:
`并列连词不改变语序：en（和）、maar（但是）、of（或者）、want（因为）。
• Ik blijf thuis, want ik ben ziek.
从属连词引导从句，变位动词放到从句末尾：omdat（因为）、dat（……这件事）、als（如果）、of（是否）、terwijl（当……时）。
• Ik blijf thuis omdat ik ziek ben.
• Ik denk dat hij thuis is.
从句放前面时，主句要倒装（动词仍在第二位）：Als het regent, blijf ik thuis.
想一想：omdat 之后动词跑到最后，want 之后和平常一样。`,
    examples: [ex('Ik blijf thuis omdat ik ziek ben.', '我待在家里，因为我生病了。'), ex('Ik blijf thuis, want ik ben ziek.', '我待在家里，因为我生病了。'), ex('Ik denk dat hij thuis is.', '我觉得他在家。'), ex('Als het regent, blijf ik thuis.', '如果下雨，我就待在家。'), ex('Ik weet niet of hij komt.', '我不知道他来不来。')],
    exercises: [
      or('我待在家里，因为我生病了。', 'Ik blijf thuis omdat ik ziek ben.'),
      or('我待在家里，因为我生病了。（用 want）', 'Ik blijf thuis want ik ben ziek.'),
      ch('Ik denk dat hij ___.', ['thuis is', 'is thuis', 'thuis ist'], 'thuis is', 'dat 之后，动词放到从句最后。'),
      ch('Als het regent, ___ ik thuis.', ['blijf', 'ik blijf', 'blijft'], 'blijf', '从句在前，主句要倒装：blijf ik。'),
      ch('Ik weet niet ___ hij komt.', ['of', 'dat', 'omdat'], 'of'),
      or('我上班，但我丈夫在家。', 'Ik werk, maar mijn man is thuis.'),
    ],
  },
  {
    id: 'comparison', title: '比较级与最高级', level: 'A2',
    explanationZh:
`• 比较级：形容词 + er：groot → groter，klein → kleiner，goedkoop → goedkoper。比较对象用 dan：groter dan…
• 最高级：het + 形容词 + st：het grootst；放在名词前时：het grootste huis。
• 同级：zo … als：zo groot als…
不规则：goed → beter → best，veel → meer → meest，graag → liever → liefst。
拼写：长元音词干加 -er 时要改写：groot → groter。`,
    examples: [ex('Mijn huis is groter dan jouw huis.', '我的房子比你的大。'), ex('Een fiets is goedkoper dan een auto.', '自行车比汽车便宜。'), ex('Hij is zo groot als ik.', '他和我一样高。'), ex('Dit is het beste boek.', '这是最好的书。'), ex('Ik drink liever thee.', '我更喜欢喝茶。')],
    exercises: [
      fi('groot → ___', 'groter', undefined, 'groot 的比较级：长元音 oo 变成单 o。'),
      fi('klein → ___', 'kleiner'),
      ch('Een fiets is ___ dan een auto.', ['goedkoper', 'goedkoop', 'goedkoopst'], 'goedkoper'),
      ch('Dit is ___ boek.', ['het beste', 'beter', 'goed'], 'het beste'),
      ch('Hij is zo groot ___ ik.', ['als', 'dan'], 'als', '同级比较用 zo … als。'),
      fi('goed → ___', 'beter', undefined, '不规则：goed – beter – best。'),
    ],
  },
  {
    id: 'imperative-polite', title: '命令式与礼貌请求', level: 'A2',
    explanationZh:
`• 命令式：用词干，不加主语：Kom binnen. Wacht even. 加 alsjeblieft（熟人）或 alstublieft（正式）更客气。
• 更礼貌的请求：用情态动词问句：Kunt u mij helpen？Mag ik een glas water？Zou je dat willen herhalen？
• 对陌生人、长辈、工作场合用 u（动词形式同 jij：u kunt）；对朋友、同事用 je。
• 想引起注意时：Pardon / Neem me niet kwalijk，再说请求。`,
    examples: [ex('Kom binnen.', '请进。'), ex('Wacht even, alsjeblieft.', '请等一下。'), ex('Kunt u mij een glas water geven?', '您能给我一杯水吗？'), ex('Mag ik een glas water?', '我可以要一杯水吗？'), ex('Pardon, kunt u mij helpen?', '不好意思，您能帮我吗？')],
    exercises: [
      fi('___ binnen.', 'Kom', '（komen，命令式）'),
      ch('哪一句对陌生人更礼貌？', ['Kunt u mij een glas water geven?', 'Geef me water!'], 'Kunt u mij een glas water geven?'),
      ch('Pardon, ___ u mij helpen?', ['kunt', 'kunnen', 'kan jij'], 'kunt'),
      or('我可以要一杯水吗？', 'Mag ik een glas water?'),
    ],
  },
  {
    id: 'er', title: 'er is / er zijn（有…）', level: 'A2',
    explanationZh:
`表示“有……”用 er is（单数）和 er zijn（复数）：Er is een winkel in de straat. Er zijn twee stoelen.
• 否定：er is geen…：Er is geen melk.
• er 放在句中作为“引入”，名词（主语）放后面。
• 回答数量时 er 也可以代替前面提到的名词：Hoeveel boeken heb je？Ik heb er twee.
不要把 er is 说成 het is：Het is 是“它是”，Er is 是“有”。`,
    examples: [ex('Er is een bank in de straat.', '街上有一家银行。'), ex('Er zijn drie stoelen.', '有三把椅子。'), ex('Er is geen melk.', '没有牛奶。'), ex('Hoeveel boeken heb je? Ik heb er twee.', '你有几本书？我有两本。')],
    exercises: [
      ch('___ is een supermarkt in de straat.', ['Er', 'Het', 'Dat'], 'Er'),
      ch('Er ___ drie stoelen.', ['zijn', 'is'], 'zijn'),
      ch('Er ___ geen melk.', ['is', 'zijn'], 'is', 'melk 是不可数的单数。'),
      or('街上有一家银行。', 'Er is een bank in de straat.'),
    ],
  },
  {
    id: 'time-date', title: '时间、日期与数字', level: 'A1',
    explanationZh:
`• Hoe laat is het？（几点了？）Het is negen uur. 具体时刻用 om：om negen uur。
• 整点后：kwart over vier（4:15），tien over vier（4:10）。
• 整点前：kwart voor vijf（4:45），tien voor negen（8:50）。
• 半点：half + 下一个整点！half drie = 2:30（不是 3:30）。
• 星期：maandag、dinsdag、woensdag、donderdag、vrijdag、zaterdag、zondag。
• 月份：januari、februari、maart、april、mei、juni、juli、augustus、september、oktober、november、december。
• 日期：Het is vandaag 5 mei。（用基数词说日，与中文类似）`,
    examples: [ex('Hoe laat is het?', '几点了？'), ex('Het is half drie.', '现在两点半。'), ex('Het is kwart over vier.', '现在四点一刻。'), ex('De trein vertrekt om tien voor negen.', '火车八点五十分出发。'), ex('Ik heb op maandag vrij.', '我周一休息。')],
    exercises: [
      ch('half drie =', ['2:30', '3:30', '3:15'], '2:30', 'half 指“差半小时到下一个整点”。'),
      ch('kwart over vier =', ['4:15', '4:45', '3:45'], '4:15'),
      ch('kwart voor vijf =', ['4:45', '5:15', '5:45'], '4:45'),
      ch('dinsdag 之后是哪一天？', ['woensdag', 'maandag', 'donderdag'], 'woensdag'),
      fi('Het is ___ uur.', 'zeven', '（7:00）'),
      ch('tien voor negen =', ['8:50', '9:10', '9:50'], '8:50'),
    ],
  },
]
