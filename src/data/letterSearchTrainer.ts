export interface LetterSearchRow {
  letters: string;
  words: string[];
}

export interface LetterSearchTask {
  id: number;
  rows: LetterSearchRow[];
}

const RAW: Array<{ id: number; lettersList: Array<{ letters: string; words: string[] }> }> = [
  {
    id: 1,
    lettersList: [
      { letters: "димайвобурдомтикквап", words: ["май"] },
      { letters: "митмсчымирятелвмоход", words: ["мир", "мох"] },
      { letters: "ивамужнкновымехаков", words: ["муж", "мех"] },
      { letters: "дмодаоброишмёддробло", words: ["мода", "мёд"] },
      { letters: "морозьняшдумоторокаы", words: ["мороз", "мотор"] },
      { letters: "вамясопатаоскапваппр", words: ["мясо"] },
      { letters: "каппдуйемакакаарпота", words: ["макака"] },
      { letters: "ймонетанарелгадрелово", words: ["монета"] },
      { letters: "ькакмимозаавападлебе", words: ["мимоза"] },
      { letters: "музыкаайтесмимебельт", words: ["музыка", "мебель"] },
    ],
  },
  {
    id: 2,
    lettersList: [
      { letters: "чсммячедилнимечцлатр", words: ["мяч", "меч"] },
      { letters: "иваёкеопамамарецдапи", words: ["мама"] },
      { letters: "утвмореапмылоёжозриы", words: ["море", "мыло"] },
      { letters: "вакенгнгметельльнотоньв", words: ["метель"] },
      { letters: "омешоккаовалрморякап", words: ["мешок", "моряк"] },
      { letters: "рсмитпмелочьдкийсачпз", words: ["мелочь"] },
      { letters: "асмякотьнулосчмукаае", words: ["мякоть", "мука"] },
      { letters: "змалодитьырмиломпрпа", words: ["мало", "мило"] },
      { letters: "вмесяцосминусккавтьб", words: ["месяц", "минус"] },
      { letters: "емякишльторшмазьлыак", words: ["мякиш", "мазь"] },
    ],
  },
  {
    id: 3,
    lettersList: [
      { letters: "юманежетлумотивпелеф", words: ["манеж", "мотив"] },
      { letters: "онфждылмодельдежиран", words: ["модель"] },
      { letters: "ьгивмельеочмольстирва", words: ["мель", "моль"] },
      { letters: "пмышьромалижажмаякд", words: ["мышь", "маяк"] },
      { letters: "астималинаирнокпиолд", words: ["малина"] },
      { letters: "ыожомаминутабаалолал", words: ["минута"] },
      { letters: "ншимахинажарвмашина", words: ["махина", "машина"] },
      { letters: "ылмайкаархапложиотл", words: ["майка"] },
      { letters: "массаентамойкаелзоро", words: ["масса", "мойка"] },
      { letters: "ллнемискабщжютмсчню", words: ["миска"] },
    ],
  },
  {
    id: 4,
    lettersList: [
      { letters: "ацугмолодецщфжалтсчя", words: ["молодец"] },
      { letters: "тирпаумагазинцпшдаку", words: ["магазин"] },
      { letters: "щэплоароаррмуравейуш", words: ["муравей"] },
      { letters: "эдмарлялывьфлрместоч", words: ["марля", "место"] },
      { letters: "модносьтотьеуцншроры", words: ["модно"] },
      { letters: "абьзгоипннлмольбааруг", words: ["мольба"] },
      { letters: "шарпоморщиналачлдоа", words: ["морщина"] },
      { letters: "ожмельницауэцыщзыша", words: ["мельница"] },
      { letters: "мимакушкатчекрмагнит", words: ["макушка", "магнит"] },
      { letters: "нголдщмикроскопфыпав", words: ["микроскоп"] },
    ],
  },
  {
    id: 5,
    lettersList: [
      { letters: "орткмудростьщуцфшуеы", words: ["мудрость"] },
      { letters: "вфмузыкантцмилордиио", words: ["музыкант", "милорд"] },
      { letters: "мостщшукцмуссецвыа", words: ["мост", "мусс"] },
      { letters: "рэоавомартышкарыпсио", words: ["мартышка"] },
      { letters: "рнуеорлвышунёмальчик", words: ["мальчик"] },
      { letters: "помедведьышцвъапхкап", words: ["медведь"] },
      { letters: "ррнвллмассажугенёрало", words: ["массаж"] },
      { letters: "смышеловкамионмруруг", words: ["мышеловка"] },
      { letters: "цзхёвцоыфмолочницавл", words: ["молочница"] },
      { letters: "мыльницаряпвеметлаык", words: ["мыльница", "метла"] },
    ],
  },
  {
    id: 6,
    lettersList: [
      { letters: "манекенъдлитнгвакыся", words: ["манекен"] },
      { letters: "фщгемороженоеуктпвол", words: ["мороженое"] },
      { letters: "жэбюдгитсматематикач", words: ["математика"] },
      { letters: "цмеханикйфячёартокгри", words: ["механик"] },
      { letters: "сримирпопмешочекавыц", words: ["мир", "мешочек"] },
      { letters: "мизинецуапигббморозец", words: ["мизинец", "морозец"] },
      { letters: "хэъзшмухоморрпнпквом", words: ["мухомор"] },
      { letters: "гшйомолодёжьпёпяджэу", words: ["молодёжь"] },
      { letters: "втнгоёмачтаёмаскаьдор", words: ["мачта", "маска"] },
      { letters: "пёробьтманрёдмокрорвс", words: ["мокро"] },
    ],
  },
  {
    id: 7,
    lettersList: [
      { letters: "рнжмармеладцалуокшкр", words: ["мармелад"] },
      { letters: "мышонокятчтввпангуш", words: ["мышонок"] },
      { letters: "щцроёишмиллионуъкхе", words: ["миллион"] },
      { letters: "шраэмагнитофонаджьвп", words: ["магнитофон"] },
      { letters: "айммоторкаяопаьмоадз", words: ["моторка"] },
      { letters: "улшктебюмясорубкахъп", words: ["мясорубка"] },
      { letters: "маркизроавалематрасёъ", words: ["маркиз", "матрас"] },
      { letters: "уоругельниккрёвопош", words: ["мельник"] },
      { letters: "маслёнкаевьмартоущё", words: ["маслёнка", "март"] },
      { letters: "шимыслькаъкморсзхеко", words: ["мысль", "морс"] },
    ],
  },
  {
    id: 8,
    lettersList: [
      { letters: "смешмотоциклллюёжэъ", words: ["мотоцикл"] },
      { letters: "моментхавычяматчфуко", words: ["момент", "матч"] },
      { letters: "грмножительваыягщшау", words: ["множитель"] },
      { letters: "жцфцзщлдматросыьослв", words: ["матросы"] },
      { letters: "ымикробоыаоркмонтёру", words: ["микроб", "монтёр"] },
      { letters: "ныджиухоловкаузхцувх", words: ["мухоловка"] },
      { letters: "йлётьтвмочалкаырпнкп", words: ["мочалка"] },
      { letters: "оыулмушкетёрвюудпшр", words: ["мушкетёр"] },
      { letters: "квмолнияагрмужчинапё", words: ["молния", "мужчина"] },
      { letters: "ъхавмандаринзлзхлшгн", words: ["мандарин"] },
    ],
  },
  {
    id: 9,
    lettersList: [
      { letters: "мусоровозлтобьотасим", words: ["мусоровоз"] },
      { letters: "урушсметроёёмечтатьч", words: ["метро", "мечта"] },
      { letters: "рашгмкаыурлматерикир", words: ["материк"] },
      { letters: "новмощнооырамудрецов", words: ["мощно", "мудрец"] },
      { letters: "метрыряддымотористжв", words: ["метры", "моторист"] },
      { letters: "эцфмонументэхыцлйора", words: ["монумент"] },
      { letters: "нрвморжчакгвниоваеыл", words: ["морж"] },
      { letters: "лктмллаоминдальвылд", words: ["миндаль"] },
      { letters: "шумониторщндбтюжьдо", words: ["монитор"] },
      { letters: "мотылёкдпрщыафсячцей", words: ["мотылёк"] },
    ],
  },
];

function findNextNonOverlapping(haystack: string, needle: string, occupied: Set<number>): number | null {
  if (!needle) return null;
  let start = 0;
  while (start <= haystack.length - needle.length) {
    const idx = haystack.indexOf(needle, start);
    if (idx === -1) return null;
    let overlaps = false;
    for (let i = 0; i < needle.length; i++) {
      if (occupied.has(idx + i)) {
        overlaps = true;
        break;
      }
    }
    if (!overlaps) return idx;
    start = idx + 1;
  }
  return null;
}

export function buildTargetIndexes(letters: string, words: string[]): Set<number> {
  const target = new Set<number>();
  const occupied = new Set<number>();
  for (const w of words) {
    const idx = findNextNonOverlapping(letters, w.toLowerCase(), occupied);
    if (idx == null) continue;
    for (let i = 0; i < w.length; i++) {
      target.add(idx + i);
      occupied.add(idx + i);
    }
  }
  return target;
}

export const letterSearchTasks: LetterSearchTask[] = RAW.map((t) => ({
  id: t.id,
  rows: t.lettersList.map((r) => ({ letters: r.letters, words: r.words })),
}));
