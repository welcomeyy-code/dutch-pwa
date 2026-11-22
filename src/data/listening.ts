import type { ListeningPiece } from '../types'

// A2 听力材料：对话和通知。who: f=女声（Colette），m=男声（Maarten）。
// 全部原创，参照 A2 常见生活场景；请抽查荷兰语和问题的准确性。
const L = (who: 'f' | 'm', nl: string, zh: string) => ({ who, nl, zh })
const Q = (q: string, qZh: string, options: string[], answer: number) => ({ q, qZh, options, answer })

export const LISTENING: ListeningPiece[] = [
  {
    id: 'directions', kind: 'dialogue', title: '问路',
    lines: [
      L('f', 'Pardon, meneer. Waar is het station?', '不好意思，先生。火车站在哪里？'),
      L('m', 'Het station? Ga hier rechtdoor en neem de tweede straat links.', '火车站？从这里一直走，在第二条街左转。'),
      L('f', 'De tweede straat links. Is het ver?', '第二条街左转。远吗？'),
      L('m', 'Nee, het is maar tien minuten lopen.', '不远，走路只要十分钟。'),
      L('f', 'Dank u wel!', '谢谢您！'),
      L('m', 'Graag gedaan.', '不客气。'),
    ],
    questions: [
      Q('Wat zoekt de vrouw?', '这位女士在找什么？', ['Het station', 'De bank', 'Het ziekenhuis'], 0),
      Q('Hoe moet zij lopen?', '她应该怎么走？', ['Meteen rechtsaf', 'Rechtdoor en dan de tweede straat links', 'De eerste straat links'], 1),
      Q('Hoe lang duurt het?', '要多久？', ['Tien minuten', 'Twintig minuten', 'Een uur'], 0),
    ],
  },
  {
    id: 'supermarket', kind: 'dialogue', title: '超市结账',
    lines: [
      L('m', 'Goedemiddag. Heeft u een klantenkaart?', '下午好。您有会员卡吗？'),
      L('f', 'Nee, helaas niet.', '没有，可惜。'),
      L('m', 'Dat is dan twaalf euro vijftig.', '那一共是十二欧五十分。'),
      L('f', 'Kan ik met pin betalen?', '我可以刷卡（用银行卡）付款吗？'),
      L('m', 'Ja, natuurlijk. Wilt u een tas?', '当然可以。您要袋子吗？'),
      L('f', 'Nee, dank u. Ik heb mijn eigen tas bij me.', '不用，谢谢。我自己带了袋子。'),
    ],
    questions: [
      Q('Hoeveel moet de vrouw betalen?', '女士要付多少钱？', ['€ 12,50', '€ 15,20', '€ 12,05'], 0),
      Q('Hoe betaalt zij?', '她怎么付款？', ['Contant', 'Met pin', 'Met een cadeaubon'], 1),
      Q('Wil zij een tas?', '她要袋子吗？', ['Ja, een grote tas', 'Ja, een kleine tas', 'Nee, ze heeft een eigen tas'], 2),
    ],
  },
  {
    id: 'doctor-appointment', kind: 'dialogue', title: '电话预约医生',
    lines: [
      L('f', 'Huisartsenpraktijk De Linde, goedemorgen.', '德林德家庭医生诊所，早上好。'),
      L('m', 'Goedemorgen. Ik wil graag een afspraak maken. Ik heb al drie dagen hoofdpijn.', '早上好。我想预约。我已经头痛三天了。'),
      L('f', 'Kunt u donderdag om half tien komen?', '您周四九点半能来吗？'),
      L('m', 'Donderdag kan ik niet. Ik werk dan de hele dag. Kan het vrijdag?', '周四我不行，那天我整天上班。周五可以吗？'),
      L('f', 'Ja, vrijdag om kwart over elf.', '可以，周五十一点一刻。'),
      L('m', 'Prima. Dank u wel.', '好的，谢谢您。'),
    ],
    questions: [
      Q('Waarom belt de man?', '这位先生为什么打电话？', ['Hij wil een afspraak maken', 'Hij wil medicijnen ophalen', 'Hij wil een rekening betalen'], 0),
      Q('Waarom kan hij niet op donderdag?', '他为什么周四不行？', ['Hij is op vakantie', 'Hij werkt de hele dag', 'Hij moet naar school'], 1),
      Q('Hoe laat is de afspraak?', '预约是几点？', ['Half tien', 'Kwart voor twaalf', 'Kwart over elf'], 2),
    ],
  },
  {
    id: 'train-announcement', kind: 'announcement', title: '火车站广播',
    lines: [
      L('f', 'Reizigers naar Utrecht, let op! De trein van kwart over tien naar Utrecht vertrekt vandaag niet van spoor vier, maar van spoor zeven. De trein heeft tien minuten vertraging. Onze excuses voor het ongemak.', '前往乌得勒支的乘客请注意！十点一刻开往乌得勒支的火车，今天不从四号站台出发，而是七号站台。火车晚点十分钟。给您带来不便，我们深表歉意。'),
    ],
    questions: [
      Q('Van welk spoor vertrekt de trein?', '火车从哪个站台出发？', ['Spoor vier', 'Spoor zeven', 'Spoor tien'], 1),
      Q('Hoeveel vertraging heeft de trein?', '火车晚点多久？', ['Vijf minuten', 'Tien minuten', 'Een kwartier'], 1),
      Q('Waar gaat de trein naartoe?', '火车开往哪里？', ['Utrecht', 'Amsterdam', 'Rotterdam'], 0),
    ],
  },
  {
    id: 'cafe-order', kind: 'dialogue', title: '咖啡馆点单',
    lines: [
      L('m', 'Goedemiddag, wat mag het zijn?', '下午好，想点什么？'),
      L('f', 'Doe maar twee koffie, één met melk en één zwart.', '来两杯咖啡，一杯加牛奶，一杯黑咖啡。'),
      L('m', 'Wilt u er iets bij?', '要配点什么吗？'),
      L('f', 'Ja, graag een stuk appeltaart.', '好的，来一块苹果派。'),
      L('m', 'Dat is zes euro veertig.', '一共六欧四十分。'),
    ],
    questions: [
      Q('Wat bestelt de vrouw?', '女士点了什么？', ['Twee koffie en appeltaart', 'Thee en een broodje', 'Twee koffie met melk'], 0),
      Q('Hoeveel kost het?', '一共多少钱？', ['€ 4,60', '€ 6,14', '€ 6,40'], 2),
    ],
  },
  {
    id: 'colleagues-weekend', kind: 'dialogue', title: '同事聊周末',
    lines: [
      L('f', 'Hoi Peter, had je een fijn weekend?', '嗨，彼得，周末过得愉快吗？'),
      L('m', 'Ja hoor. Ik ben zaterdag met mijn kinderen naar de dierentuin gegaan. En jij?', '很愉快。周六我带孩子们去了动物园。你呢？'),
      L('f', 'Ik ben zondag naar mijn ouders gegaan. We hebben samen gegeten.', '周日我去了父母家。我们一起吃了饭。'),
      L('m', 'Gezellig!', '真温馨！'),
      L('f', 'Ja, erg gezellig. Maar nu moet ik weer hard werken.', '是啊，非常温馨。不过现在我又得努力工作了。'),
    ],
    questions: [
      Q('Waar ging Peter zaterdag naartoe?', '彼得周六去了哪里？', ['Naar zijn ouders', 'Naar de dierentuin', 'Naar zijn werk'], 1),
      Q('Met wie at de vrouw op zondag?', '女士周日和谁一起吃饭？', ['Met haar collega\'s', 'Met haar kinderen', 'Met haar ouders'], 2),
    ],
  },
  {
    id: 'voicemail', kind: 'announcement', title: '图书馆留言',
    lines: [
      L('f', 'Goedemiddag, u spreekt met Lisa van de bibliotheek. U hebt een boek gereserveerd. Het boek ligt vanaf morgen voor u klaar. U kunt het ophalen tot vrijdag. De bibliotheek is open van negen tot vijf uur. Tot ziens.', '下午好，我是图书馆的丽莎。您预约了一本书。这本书从明天起为您备好。您可以在周五之前来取。图书馆开放时间是九点到五点。再见。'),
    ],
    questions: [
      Q('Waarom belt Lisa?', '丽莎为什么打电话？', ['Het boek is te laat', 'Het gereserveerde boek ligt klaar', 'De bibliotheek is gesloten'], 1),
      Q('Tot wanneer kan men het boek ophalen?', '可以取书到什么时候？', ['Tot morgen', 'Tot vrijdag', 'Tot zaterdag'], 1),
      Q('Wanneer is de bibliotheek open?', '图书馆什么时候开放？', ['Van acht tot twee uur', 'Van tien tot zes uur', 'Van negen tot vijf uur'], 2),
    ],
  },
  {
    id: 'neighbour', kind: 'dialogue', title: '认识新邻居',
    lines: [
      L('m', 'Goedenavond, ik ben uw nieuwe buurman. Ik woon sinds gisteren op nummer twaalf.', '晚上好，我是您的新邻居。我从昨天起住在十二号。'),
      L('f', 'Welkom in de straat! Ik ben Mieke. Ik woon hier al tien jaar.', '欢迎来到这条街！我是米克。我在这里住了十年。'),
      L('m', 'Mag ik u iets vragen? Wanneer komt de vuilnisauto?', '我可以问您件事吗？垃圾车什么时候来？'),
      L('f', 'Elke dinsdagochtend. Dan zet u de bak buiten.', '每周二早上。到时候您把垃圾桶放到外面。'),
    ],
    questions: [
      Q('Hoe lang woont Mieke al in de straat?', '米克在这条街住了多久？', ['Twee jaar', 'Tien jaar', 'Twaalf jaar'], 1),
      Q('Wanneer komt de vuilnisauto?', '垃圾车什么时候来？', ['Elke maandagmiddag', 'Elke dinsdagochtend', 'Elke vrijdagavond'], 1),
    ],
  },
  {
    id: 'weather', kind: 'announcement', title: '天气预报',
    lines: [
      L('f', 'Het weer voor morgen. In de ochtend is het bewolkt en droog. In de middag regent het in het noorden van het land. De temperatuur is ongeveer twaalf graden. Neem een paraplu mee als u naar Groningen gaat.', '明天的天气。上午多云、干燥。下午北部地区会下雨。气温大约十二度。如果您要去格罗宁根，请带伞。'),
    ],
    questions: [
      Q('Wanneer regent het?', '什么时候下雨？', ['In de ochtend in het zuiden', 'In de middag in het noorden', 'De hele dag overal'], 1),
      Q('Hoe warm is het?', '气温多少？', ['Ongeveer twee graden', 'Ongeveer twaalf graden', 'Ongeveer twintig graden'], 1),
    ],
  },
  {
    id: 'school-note', kind: 'announcement', title: '学校通知',
    lines: [
      L('m', 'Beste ouders, volgende week woensdag is de school gesloten. De kinderen hebben dan een vrije dag. De les begint weer op donderdag om half negen. Wilt u er ook aan denken dat de kinderen donderdag gymkleren meenemen?', '亲爱的家长们，下周三学校关闭，孩子们放假一天。周四八点半恢复上课。请记得，周四孩子们要带体育课的衣服。'),
    ],
    questions: [
      Q('Wanneer is de school gesloten?', '学校什么时候关闭？', ['Volgende week woensdag', 'Deze week donderdag', 'Volgende week donderdag'], 0),
      Q('Wat moeten de kinderen donderdag meenemen?', '周四孩子们要带什么？', ['Een lunch', 'Gymkleren', 'Een paraplu'], 1),
    ],
  },
  {
    id: 'pharmacy', kind: 'dialogue', title: '药店买药',
    lines: [
      L('f', 'Goedemorgen, kan ik u helpen?', '早上好，我能帮您吗？'),
      L('m', 'Ja, ik heb last van keelpijn. Heeft u iets voor mij?', '是的，我喉咙痛。您有什么药适合我吗？'),
      L('f', 'Ja, deze tabletten. U neemt drie keer per dag één tablet, na het eten.', '有，这些药片。每天三次，每次一片，饭后吃。'),
      L('m', 'En hoeveel kost dat?', '这个多少钱？'),
      L('f', 'Acht euro vijfenzeventig.', '八欧七十五分。'),
    ],
    questions: [
      Q('Wat heeft de man?', '这位先生怎么了？', ['Hoofdpijn', 'Keelpijn', 'Buikpijn'], 1),
      Q('Hoe vaak per dag neemt hij een tablet?', '他每天吃几次药？', ['Eén keer', 'Twee keer', 'Drie keer'], 2),
      Q('Wanneer neemt hij de tablet?', '他什么时候吃药？', ['Voor het eten', 'Na het eten', 'Voor het slapen'], 1),
    ],
  },
  {
    id: 'meeting-moved', kind: 'dialogue', title: '会议改时间',
    lines: [
      L('m', 'Hallo Sanne, ik bel over de vergadering van morgen.', '你好，桑妮，我打电话是为了明天的会议。'),
      L('f', 'Ja, om tien uur, toch?', '对，十点，对吗？'),
      L('m', 'Nee, die is verplaatst naar twee uur \'s middags. De manager is ziek.', '不，改到下午两点了。经理生病了。'),
      L('f', 'Oké, dank je. Dan kom ik morgen om twee uur.', '好的，谢谢。那我明天两点来。'),
    ],
    questions: [
      Q('Wat is er veranderd?', '有什么变化？', ['De vergadering is verplaatst', 'De vergadering is afgelast', 'De vergadering is in een andere stad'], 0),
      Q('Waarom is de vergadering verplaatst?', '会议为什么改时间？', ['De manager is ziek', 'Sanne heeft vakantie', 'Het kantoor is dicht'], 0),
      Q('Hoe laat is de vergadering nu?', '会议现在是几点？', ['Om tien uur', 'Om twee uur \'s middags', 'Om twee uur \'s ochtends'], 1),
    ],
  },
]
