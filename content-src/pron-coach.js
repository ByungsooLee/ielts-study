/* 発音コーチ・データ（connected speech：連結・弱形・脱落/同化・文強勢・要注意音）
   キー = テーマ番号-文番号（例 "t3-s4"）。md2json.js が例文に linking / tips を合成する。
   ‿ = 連結（リエゾン）。tips は日本語の要点。新しい文は追記していく。 */
module.exports = {
  // ── テーマ3 タイタニック ──
  "t3-s1": { linking: "When the Titanic departed from Ireland in 1912, few had‿any doubt‿it was unsinkable.",
    tips: ["連結: had‿any=ハダニ, doubt‿it=ダウティッ(tは弱く)", "弱形: the/from/in/it/was を弱く(was=/wəz/)", "強勢: Ti·TA·nic, de·PAR·ted, DOUBT, un·SINK·able", "注意音: doubtのbは無音、TH(the)"] },
  "t3-s2": { linking: "Initially, the crew ignored the iceberg warnings, and‿a fatal lack‿of lifeboats turned the night‿into‿a tragedy.",
    tips: ["連結: lack‿of=ラッコヴ, night‿into=ナイティントゥ", "弱形: and=/ən/, of=/əv/, a=/ə/", "強勢: i·NI·tially, ICE·berg, FA·tal, LACK, TRA·gedy", "注意音: R(crew/ignored), V(of)"] },
  "t3-s3": { linking: "For decades, previous‿attempts to find the wreck‿all failed.",
    tips: ["連結: previous‿attempts, wreck‿all=レッコール", "弱形: for=/fə/, to=/tə/, the", "強勢: DE·cades, at·TEMPTS, WRECK, FAILED", "注意音: wreckのwは無音(/r/), V(previous)"] },
  "t3-s4": { linking: "Then, in collaboration with‿a French team, explorers made‿an astonishing discovery‿on the seabed — though the hull had badly deteriorated after seventy years underwater.",
    tips: ["連結: made‿an=メイダン, discovery‿on=ディスカヴァリオン", "弱形: with/a/on/the を弱く", "強勢: collabo·RA·tion, FRENCH, a·STON·ishing, dis·CO·very", "注意音: TH(with/the/though), R(French/discovery/explorers)"] },

  // ── テーマ4 ビーバー ──
  "t4-s1": { linking: "Beavers became such‿a nuisance‿in Idaho that their dam construction began to alter the whole landscape.",
    tips: ["連結: such‿a=サッチャ, nuisance‿in", "弱形: a/in/that/to/the(that=/ðət/)", "強勢: NUI·sance, I·da·ho, con·STRUC·tion, AL·ter", "注意音: TH(that/their/the), nuisance=ニューサンス"] },
  "t4-s2": { linking: "Their‿instinct to build never stops, and homes had begun to encroach‿on their habitat.",
    tips: ["連結: encroach‿on=インクローチョン, homes‿had", "弱形: to/and/had(=/əd/)/their/on", "強勢: IN·stinct, BUILD, be·GUN, en·CROACH, HA·bitat", "注意音: TH(their), instinctの-nct連続子音"] },
  "t4-s3": { linking: "So wardens found‿an‿ideal valley with‿an‿abundance‿of food.",
    tips: ["連結: found‿an=ファウンダン, with‿an=ウィザン, abundance‿of", "弱形: an/with/of(=/əv/)", "強勢: WAR·dens, i·DE·al, a·BUN·dance, FOOD", "注意音: TH(with), V(valley)"] },
  "t4-s4": { linking: "Using‿a surplus‿of war parachutes, they dropped the beavers from‿a plane — a truly‿unique solution.",
    tips: ["連結: surplus‿of, from‿a=フロマ", "弱形: a/of/the/from を弱く", "強勢: SUR·plus, PA·rachutes, u·NIQUE, so·LU·tion", "注意音: R(surplus/war), unique=ユニーク /juːˈniːk/"] },

  // ── テーマ5 ダンス ──
  "t5-s1": { linking: "Dancing stimulates the brain like‿little‿else.",
    tips: ["連結: little‿else=リトゥルエルス(L連結)", "弱形: the を弱く", "強勢: DAN·cing, STI·mulates, BRAIN, LIT·tle", "注意音: stim-の/st/クラスター, littleのt(米=フラップ/英=明瞭)"] },
  "t5-s2": { linking: "Despite some‿uncertainty, one theory‿is that‿a key factor‿is how music‿and movement combine to generate dopamine.",
    tips: ["連結: factor‿is=ファクタリズ, music‿and", "弱形: some/that/a/and(=/ən/)/to(=/tə/)", "強勢: uncer·TAIN·ty, THEO·ry, FAC·tor, GE·nerate, DO·pamine", "注意音: TH(theory/that), R(theory/factor)"] },
  "t5-s3": { linking: "The brain loves to predict patterns, so watching‿a complex move we cannot foresee creates‿an‿intense rush‿of pleasure — it‿is‿obvious why we love the dance floor.",
    tips: ["連結: watching‿a=ワッチンガ, rush‿of=ラッショヴ, it‿is=イティズ", "弱形: to/a/an/of/the", "強勢: pre·DICT, PAT·terns, com·PLEX, in·TENSE, OB·vious", "注意音: R(predict/rush/floor), pleasureの/ʒ/"] },

  // ── テーマ6 AI芸術 ──
  "t6-s1": { linking: "AI‿art challenges‿our perspective‿on creativity.",
    tips: ["連結: perspective‿on, challenges‿our", "弱形: our/on を弱く", "強勢: AI ART, CHAL·lenges, per·SPEC·tive, crea·TI·vity", "注意音: R(art/our/perspective), creativity=クリエイ·TI·ヴィティ"] },
  "t6-s2": { linking: "At first, the notion that machines could paint was met‿with scepticism, yet the results were credible‿enough to fool experts.",
    tips: ["連結: met‿with=メットウィズ, credible‿enough", "弱形: the/that/was(=/wəz/)/with/to/were(=/wə/)", "強勢: NO·tion, ma·CHINES, SCEP·ticism, CRE·dible, e·NOUGH", "注意音: TH(the/that/with), scepticism=スケプティスィズム"] },
  "t6-s3": { linking: "This‿innovative technology raises hard questions‿about value: the scarcity‿of‿an‿original gives‿it worth, so where does that leave‿a copy?",
    tips: ["連結: of‿an, gives‿it=ギヴズィッ, scarcity‿of", "弱形: about/the/of(=/əv/)/an/that/a", "強勢: IN·novative, tech·NO·logy, SCAR·city, o·RI·ginal", "注意音: TH(this/the/that/worth), V(innovative/value/gives)"] },
  "t6-s4": { linking: "There‿is‿a real disparity between how experts‿and the public‿interpret such‿art — and‿a fear that‿automation will replace human‿artists.",
    tips: ["連結: there‿is‿a=ゼアリザ, experts‿and, such‿art", "弱形: a/and(=/ən/)/the/that/will", "強勢: dis·PA·rity, ex·PERTS, in·TER·pret, auto·MA·tion, re·PLACE", "注意音: R(real/disparity/interpret/art), TH(there/the/that)"] },

  // ── テーマ7 才能ある子の学校 ──
  "t7-s1": { linking: "Our school‿exists to foster the talents‿of gifted children.",
    tips: ["連結: talents‿of=タレンツォヴ, school‿exists", "弱形: to/the/of を弱く", "強勢: ex·ISTS, FOS·ter, TA·lents, GIF·ted, CHIL·dren", "注意音: R(our/foster/children), TH(the)"] },
  "t7-s2": { linking: "We follow‿a clear blueprint: rather than coddle pupils, we build their self-reliance‿and‿independence.",
    tips: ["連結: follow‿a, reliance‿and", "弱形: a/than(=/ðən/)/their/and(=/ən/)", "強勢: FOL·low, BLUE·print, RA·ther, COD·dle, inde·PEN·dence", "注意音: TH(rather/than/their), R(clear/rather/reliance)"] },
  "t7-s3": { linking: "Doing things‿alone compensates for time‿away from family, sparks creativity, and drives real progress.",
    tips: ["連結: time‿away, away‿from=アウェイフロム, things‿alone", "弱形: for(=/fə/)/from(=/frəm/)/and(=/ən/)", "強勢: COM·pensates, FA·mily, crea·TI·vity, PRO·gress", "注意音: TH(things), R(creativity/drives/real/progress)"] },

  // ── テーマ8 ハイパーループ ──
  "t8-s1": { linking: "A famous‿entrepreneur who‿achieved‿overnight success‿online decided to‿invest‿in‿a groundbreaking train linking two metropolitan‿areas.",
    tips: ["連結: invest‿in=インヴェスティン, achieved‿overnight, in‿a", "弱形: a/who/to(=/tə/)/in", "強勢: FA·mous, entrepre·NEUR, suc·CESS, in·VEST, GROUND·breaking", "注意音: R(entrepreneur/areas/train), entrepreneur=アントレプレ·ヌァ"] },
  "t8-s2": { linking: "But there‿were‿obstacles. Tickets might be too‿exorbitant for‿ordinary people to‿afford.",
    tips: ["連結: there‿were, were‿obstacles, too‿exorbitant", "弱形: there/were(=/wə/)/for(=/fə/)/to(=/tə/)", "強勢: OB·stacles, TI·ckets, ex·OR·bitant, OR·dinary, af·FORD", "注意音: R(there/exorbitant/ordinary/afford), TH(there)"] },
  "t8-s3": { linking: "Until the company can persuade local governments to‿authorise the project, the train‿of the future stays‿on the drawing board.",
    tips: ["連結: train‿of, stays‿on=ステイゾン", "弱形: the/can(=/kən/)/to(=/tə/)/of(=/əv/)", "強勢: COM·pany, per·SUADE, AU·thorise, PRO·ject, DRAW·ing BOARD", "注意音: R(persuade/authorise/project/train/board), TH(the)"] },

  // ── テーマ9 モンテッソーリ ──
  "t9-s1": { linking: "Maria Montessori struggled for‿every child's‿right to learn.",
    tips: ["連結: child's‿right, for‿every", "弱形: for(=/fə/)/to(=/tə/)", "強勢: Ma·RI·a, Montes·SO·ri, STRUG·gled, RIGHT, LEARN", "注意音: R(Maria/struggled/right/learn), L(struggled/child/learn)"] },
  "t9-s2": { linking: "From‿an‿esteemed family, she persevered‿as the‿only woman‿in medical school‿and graduated with top grades.",
    tips: ["連結: from‿an=フロマン, persevered‿as, woman‿in", "弱形: an/as(=/əz/)/the/in/and(=/ən/)/with", "強勢: es·TEEMED, perse·VERED, ON·ly, ME·dical, GRA·duated", "注意音: TH(the/with), R(from/persevered/grades)"] },
  "t9-s3": { linking: "Working with poor children, she came‿up with the theory that‿all kids‿have‿an‿innate desire to learn.",
    tips: ["連結: came‿up=ケイマップ, have‿an=ハヴァン, kids‿have", "弱形: with/the/that(=/ðət/)/an/to(=/tə/)", "強勢: WORK·ing, THEO·ry, in·NATE, de·SIRE, LEARN", "注意音: TH(with/the/theory/that), R(poor/children/desire), V(have)"] },
  "t9-s4": { linking: "Her method‿emphasised freedom‿and responsibility, and was soon‿adopted worldwide.",
    tips: ["連結: freedom‿and, soon‿adopted, method‿emphasised", "弱形: and(=/ən/)/was(=/wəz/)", "強勢: ME·thod, EM·phasised, FREE·dom, respon·si·BI·lity, a·DOP·ted", "注意音: TH(method), R(her/freedom/worldwide)"] },
  "t9-s5": { linking: "A lifelong‿advocate‿of peace, her subsequent‿influence‿on‿education‿endures.",
    tips: ["連結: advocate‿of=アドヴォケイトヴ, influence‿on, education‿endures", "弱形: a/of(=/əv/)/her/on", "強勢: LIFE·long, AD·vocate, PEACE, SUB·sequent, edu·CA·tion, en·DURES", "注意音: R(her/influence/endures), V(advocate/influence)"] },

  // ── テーマ10 ウソ ──
  "t10-s1": { linking: "Lying may seem troubling, but‿it‿is‿an‿indication‿of‿a sophisticated brain.",
    tips: ["連結: it‿is‿an=イティザン, indication‿of, but‿it", "弱形: but/it/an/of(=/əv/)/a", "強勢: LY·ing, TROU·bling, indi·CA·tion, so·PHIS·ticated, BRAIN", "注意音: R(troubling/brain), sophisticated=ソフィスティケイティッド"] },
  "t10-s2": { linking: "The skill‿of manipulating‿others without force was‿an‿evolutionary‿advantage, and skilled liars passed this trait to their children.",
    tips: ["連結: skill‿of=スキロヴ, was‿an, manipulating‿others", "弱形: of/without/was(=/wəz/)/an/and(=/ən/)/to(=/tə/)", "強勢: ma·NI·pulating, with·OUT, evo·LU·tionary, ad·VAN·tage, TRAIT", "注意音: TH(others/without/this/their), L(skill/skilled/liars)"] },
  "t10-s3": { linking: "We lie to‿exaggerate‿our‿image‿or to‿ease social tension.",
    tips: ["連結: exaggerate‿our, image‿or, to‿ease", "弱形: to(=/tə/)/our/or を弱く", "強勢: LIE, ex·AG·gerate, I·mage, EASE, SO·cial, TEN·sion", "注意音: R(exaggerate/our/or), exaggerate=イグ·ザ·ジャレイト, image=イミッジ"] },
  "t10-s4": { linking: "Scientists who‿investigated child development found that learning to‿conceal the truth‿is‿actually‿a milestone — a sign the brain‿is reaching maturity.",
    tips: ["連結: truth‿is, brain‿is=ブレイニズ, to‿conceal", "弱形: who/that(=/ðət/)/to(=/tə/)/the/a/is", "強勢: SCI·entists, in·VES·tigated, con·CEAL, MILE·stone, ma·TU·rity", "注意音: TH(that/the/truth), R(reaching/maturity/learning), truth=トゥルース/θ/"] },

  // ── テーマ1 ポリネシア ──
  "t1-s1": { linking:"For years‿it was‿a real concern how the‿ancient people first came to settle the Polynesian islands.",
    tips:["連結: it‿was, was‿a, the‿ancient","弱形: for/it/was/a/the/to を弱く","強勢: YEARS, con·CERN, AN·cient, SET·tle, Poly·NE·sian","注意音: R(years/real/concern), TH(the)"] },
  "t1-s2": { linking:"Some believe bold pioneers, skilled seafarers, sailed‿east‿using‿only primitive tools.",
    tips:["連結: sailed‿east, east‿using","弱形: some/only","強勢: be·LIEVE, pio·NEERS, SEA·farers, EAST, PRI·mitive","注意音: L(believe/skilled/sailed/only/tools), R(pioneers/seafarers/primitive)"] },
  "t1-s3": { linking:"With few resources‿available, they had to construct sturdy rafts‿and navigate by the stars to find‿their bearings.",
    tips:["連結: resources‿available, rafts‿and, find‿their","弱形: with/they/had/to/the/their","強勢: re·SOURCES, a·VAIL·able, con·STRUCT, NA·vigate, BEAR·ings","注意音: TH(the/their), R(resources/construct/stars)"] },
  "t1-s4": { linking:"Thor Heyerdahl set‿out to discover the truth, leading‿an expedition from Peru on‿a raft he dubbed Kon-Tiki.",
    tips:["連結: set‿out=セッタウト, leading‿an, on‿a","弱形: to/the/an/from/on/a/he","強勢: dis·CO·ver, TRUTH, expe·DI·tion, Pe·RU, DUBBED","注意音: TH(truth), R(discover/truth/Peru/raft)"] },
  "t1-s5": { linking:"Favourable winds‿and fish‿as‿a source‿of food made the long voyage possible.",
    tips:["連結: winds‿and, as‿a, source‿of","弱形: and/as/a/of/the","強勢: FA·vourable, WINDS, SOURCE, VOY·age, POS·sible","注意音: V(favourable/voyage), R(favourable/source)"] },

  // ── テーマ2 プラスチック ──
  "t2-s1": { linking:"Plastic‿is‿arguably one‿of the most useful‿inventions, since‿it can be formed‿into‿a huge variety‿of products.",
    tips:["連結: one‿of, formed‿into, variety‿of","弱形: is/of/the/it/can/be/a","強勢: AR·guably, USE·ful, FORMED, va·RI·ety, PRO·ducts","注意音: R(arguably/variety/products), V(useful/inventions/variety)"] },
  "t2-s2": { linking:"A waterproof coating protects cables, while synthetic bottles‿are light‿and‿inexpensive.",
    tips:["連結: bottles‿are, light‿and","弱形: a/while/are/and","強勢: WA·terproof, COAT·ing, syn·THE·tic, inex·PEN·sive","注意音: R(waterproof/protects/are), TH(synthetic), V(inexpensive)"] },
  "t2-s3": { linking:"The‿idea did not‿originate recently; mankind has‿used simple plastics since the medieval period.",
    tips:["連結: not‿originate, has‿used","弱形: the/did/not/has/since","強勢: i·DE·a, O·riginate, man·KIND, me·DI·eval","注意音: TH(the), R(originate/recently/period)"] },
  "t2-s4": { linking:"The real turning point came‿in 1907, though‿one early‿inventor went bankrupt before success.",
    tips:["連結: came‿in, though‿one, early‿inventor","弱形: the/in/though/one/before","強勢: REAL, TURN·ing POINT, in·VEN·tor, BANK·rupt, suc·CESS","注意音: TH(though), R(real/turning/inventor/before)"] },
  "t2-s5": { linking:"Today the‿environmental‿impact‿of plastic‿is‿a growing concern, so biodegradable bottles have‿been launched.",
    tips:["連結: impact‿of, is‿a, have‿been","弱形: the/of/a/so/have/been","強勢: to·DAY, en·viron·MEN·tal, IM·pact, con·CERN, LAUNCHED","注意音: R(environmental/concern/growing), V(environmental/biodegradable)"] }
};
