import type { POS, Word } from '../types'

// 种子词：updatedAt/createdAt=0，保证多设备合并时一致。IPA 为标准荷兰语（荷兰）。
function w(
  nl: string, article: 'de' | 'het' | undefined, pos: POS, zh: string[], ipa: string,
  topic: string, exNl: string, exZh: string, extra?: Word['extra'],
): Word {
  return {
    id: `${nl.toLowerCase()}-${pos}`, nl, article, pos, zh, ipa,
    examples: [{ nl: exNl, zh: exZh }], level: 'A1', topic, source: 'deck', extra,
    createdAt: 0, updatedAt: 0,
  }
}

const N = (nl: string, a: 'de' | 'het', zh: string[], ipa: string, topic: string, exNl: string, exZh: string, plural: string) =>
  w(nl, a, 'noun', zh, ipa, topic, exNl, exZh, { plural })
const V = (nl: string, zh: string[], ipa: string, exNl: string, exZh: string, pastTense: string) =>
  w(nl, undefined, 'verb', zh, ipa, '动词', exNl, exZh, { pastTense })

export const SEED_WORDS: Word[] = [
  // 家与生活
  N('huis', 'het', ['房子', '家'], '/ɦœys/', '家', 'Ik woon in een groot huis.', '我住在一栋大房子里。', 'huizen'),
  N('deur', 'de', ['门'], '/døːr/', '家', 'Doe de deur dicht, alsjeblieft.', '请把门关上。', 'deuren'),
  N('raam', 'het', ['窗户'], '/raːm/', '家', 'Het raam is open.', '窗户开着。', 'ramen'),
  N('tafel', 'de', ['桌子'], '/ˈtaːfəl/', '家', 'De koffie staat op de tafel.', '咖啡放在桌子上。', 'tafels'),
  N('stoel', 'de', ['椅子'], '/stul/', '家', 'Er staat een stoel bij de tafel.', '桌子旁边有一把椅子。', 'stoelen'),
  N('boek', 'het', ['书'], '/buk/', '家', 'Ik lees een boek.', '我在读一本书。', 'boeken'),
  // 人
  N('man', 'de', ['男人', '丈夫'], '/mɑn/', '人', 'Die man is mijn buurman.', '那个男人是我的邻居。', 'mannen'),
  N('vrouw', 'de', ['女人', '妻子'], '/ʋrʌu/', '人', 'Mijn vrouw werkt in een winkel.', '我妻子在一家商店工作。', 'vrouwen'),
  N('kind', 'het', ['孩子'], '/kɪnt/', '人', 'Het kind speelt buiten.', '孩子在外面玩。', 'kinderen'),
  N('vriend', 'de', ['朋友', '男朋友'], '/vrint/', '人', 'Hij is mijn beste vriend.', '他是我最好的朋友。', 'vrienden'),
  N('collega', 'de', ['同事'], '/kɔˈleːxaː/', '工作', 'Mijn collega komt uit Utrecht.', '我的同事来自乌得勒支。', "collega's"),
  N('naam', 'de', ['名字'], '/naːm/', '人', 'Wat is jouw naam?', '你叫什么名字？', 'namen'),
  // 饮食
  N('water', 'het', ['水'], '/ˈʋaːtər/', '饮食', 'Ik drink een glas water.', '我喝一杯水。', 'wateren'),
  N('brood', 'het', ['面包'], '/broːt/', '饮食', 'Ik eet brood met kaas.', '我吃配奶酪的面包。', 'broden'),
  N('koffie', 'de', ['咖啡'], '/ˈkɔfi/', '饮食', 'Wil je koffie of thee?', '你想要咖啡还是茶？', "koffies"),
  N('melk', 'de', ['牛奶'], '/mɛlk/', '饮食', 'Ik neem melk in mijn koffie.', '我的咖啡里加牛奶。', '—'),
  N('kaas', 'de', ['奶酪'], '/kaːs/', '饮食', 'Nederlandse kaas is lekker.', '荷兰奶酪很好吃。', 'kazen'),
  N('appel', 'de', ['苹果'], '/ˈɑpəl/', '饮食', 'Ik eet elke dag een appel.', '我每天吃一个苹果。', 'appels'),
  // 城市与出行
  N('straat', 'de', ['街道'], '/straːt/', '城市', 'Ik woon in deze straat.', '我住在这条街上。', 'straten'),
  N('stad', 'de', ['城市'], '/stɑt/', '城市', 'Amsterdam is een grote stad.', '阿姆斯特丹是一座大城市。', 'steden'),
  N('winkel', 'de', ['商店'], '/ˈʋɪŋkəl/', '城市', 'De winkel is om negen uur open.', '商店九点开门。', 'winkels'),
  N('school', 'de', ['学校'], '/sxoːl/', '城市', 'De kinderen gaan naar school.', '孩子们去上学。', 'scholen'),
  N('fiets', 'de', ['自行车'], '/fits/', '出行', 'Ik ga met de fiets naar mijn werk.', '我骑自行车去上班。', 'fietsen'),
  N('auto', 'de', ['汽车'], '/ˈʌuto/', '出行', 'Mijn auto is nieuw.', '我的车是新的。', "auto's"),
  N('trein', 'de', ['火车'], '/trɛin/', '出行', 'De trein vertrekt om acht uur.', '火车八点出发。', 'treinen'),
  // 工作与时间
  N('werk', 'het', ['工作'], '/ʋɛrk/', '工作', 'Ik ben op mijn werk.', '我在上班。', '—'),
  N('geld', 'het', ['钱'], '/xɛlt/', '工作', 'Ik heb geen geld bij me.', '我身上没带钱。', '—'),
  N('dag', 'de', ['天', '日'], '/dɑx/', '时间', 'Goedendag! Hoe gaat het?', '你好！最近怎么样？', 'dagen'),
  N('week', 'de', ['星期', '周'], '/ʋeːk/', '时间', 'Volgende week heb ik vakantie.', '下周我放假。', 'weken'),
  N('tijd', 'de', ['时间'], '/tɛit/', '时间', 'Ik heb nu geen tijd.', '我现在没有时间。', 'tijden'),
  // 动词
  V('zijn', ['是', '在'], '/zɛin/', 'Ik ben moe.', '我累了。', 'was / waren'),
  V('hebben', ['有'], '/ˈɦɛbə(n)/', 'Ik heb een fiets.', '我有一辆自行车。', 'had / hadden'),
  V('gaan', ['去'], '/xaːn/', 'Wij gaan naar huis.', '我们回家。', 'ging / gingen'),
  V('komen', ['来'], '/ˈkoːmə(n)/', 'Hij komt uit China.', '他来自中国。', 'kwam / kwamen'),
  V('willen', ['想要'], '/ˈʋɪlə(n)/', 'Ik wil graag een kopje koffie.', '我想要一杯咖啡。', 'wilde / wilden'),
  V('eten', ['吃'], '/ˈeːtə(n)/', 'Wij eten om zes uur.', '我们六点吃饭。', 'at / aten'),
  V('drinken', ['喝'], '/ˈdrɪŋkə(n)/', 'Ik drink geen alcohol.', '我不喝酒。', 'dronk / dronken'),
  V('wonen', ['居住'], '/ˈʋoːnə(n)/', 'Ik woon in Rotterdam.', '我住在鹿特丹。', 'woonde / woonden'),
  V('werken', ['工作'], '/ˈʋɛrkə(n)/', 'Zij werkt bij een bank.', '她在银行工作。', 'werkte / werkten'),
  V('spreken', ['说（语言）'], '/ˈspreːkə(n)/', 'Ik spreek een beetje Nederlands.', '我会说一点荷兰语。', 'sprak / spraken'),
  // 形容词
  w('groot', undefined, 'adj', ['大'], '/xroːt/', '形容词', 'Het huis is groot.', '房子很大。'),
  w('klein', undefined, 'adj', ['小'], '/klɛin/', '形容词', 'Mijn kamer is klein.', '我的房间很小。'),
  w('goed', undefined, 'adj', ['好'], '/xut/', '形容词', 'Het gaat goed met mij.', '我过得很好。'),
  w('mooi', undefined, 'adj', ['漂亮'], '/moːi/', '形容词', 'Wat een mooie dag!', '多好的一天！'),
  w('nieuw', undefined, 'adj', ['新的'], '/niu/', '形容词', 'Ik heb een nieuwe baan.', '我有了一份新工作。'),
  w('duur', undefined, 'adj', ['贵'], '/dyːr/', '形容词', 'Deze jas is te duur.', '这件外套太贵了。'),
  // 常用词
  w('graag', undefined, 'adv', ['乐意', '请（客气）'], '/xraːx/', '常用', 'Ik drink graag thee.', '我喜欢喝茶。'),
  w('ook', undefined, 'adv', ['也'], '/oːk/', '常用', 'Ik ben ook moe.', '我也累了。'),
  w('niet', undefined, 'adv', ['不'], '/nit/', '常用', 'Ik begrijp het niet.', '我不明白。'),
  w('alsjeblieft', undefined, 'phrase', ['请', '给你（递东西时）'], '/ˌɑlʃəˈblift/', '常用', 'Alsjeblieft, hier is je koffie.', '给你，这是你的咖啡。'),
]
