/* ===================================================================
   IELTS単語データ（このファイルだけ編集すれば、アプリに反映されます）
   -------------------------------------------------------------------
   ■ 追加・編集のしかた
   ・THEMES 配列にテーマを足す/直すだけ。本体HTMLは触りません。
   ・story は「1文＝1行（文字列）」の配列。文の順に表示されます。
   ・覚えたい語は文中で [ ... ] で囲み、| で区切って6項目書きます：
       [表示形|基本形|意味(日本語)|言い換え|コロケーション|イメージ(任意)]
     例： [departed|depart|出発する|leave / set off|depart from|港を出ていく→part(離れる)]
   ・イメージ(6番目)は省略可。省略時は [表示形|基本形|意味|言い換え|コロケーション] でOK。
   ・[ ] で囲まない語はただの本文（クリックも復習対象にもなりません）。
   ・jp はテーマ全体の和訳（学習モードで物語の下に表示）。
   =================================================================== */

window.IELTS_DATA = [
 { id:1, title:"ポリネシアの入植", emoji:"🛶",
   story:[
     "For years it was a real [concern|concern|懸念|worry / trouble|a growing concern] how the [ancient|ancient|古代の・先史の|prehistoric|ancient people] people first came to [settle|settle|定住する|colonise|settle a region] the Polynesian islands.",
     "Some believe bold [pioneers|pioneer|先駆者|trailblazer|early pioneers], skilled [seafarers|seafarer|船乗り|voyager / mariner|ancient seafarers], sailed east using only [primitive|primitive|原始的な|undeveloped|primitive tools] tools.",
     "With few resources [available|available|利用できる|accessible|readily available], they had to [construct|construct|組み立てる|build|construct a raft] sturdy rafts and [navigate|navigate|航海・誘導する|steer|navigate by the stars] by the stars to [find their bearings|find one's bearings|自分の方角を知る|get oriented|find one's bearings].",
     "Thor Heyerdahl set out to [discover|discover|発見する|come upon|discover the truth] the truth, leading an [expedition|expedition|探検|voyage|lead an expedition] from Peru on a raft he [dubbed|dub|名づける|name|dub it X] Kon-Tiki.",
     "[Favourable|favourable|好都合な|advantageous|favourable winds] winds and fish as a [source|source|供給源|supply|a source of food] of food made the long [voyage|voyage|航海|expedition|a long voyage] possible."
   ],
   jp:"古代の人々がどのようにポリネシアの島々に最初に定住したのかは、長年の懸念（謎）だった。原始的な道具だけでアジアから東へ渡った、大胆な先駆者＝熟練の船乗りたちだと考える人もいる。資源が乏しい中、彼らは頑丈ないかだを組み立て、星で航海して自分の方角を知らねばならなかった。トール・ヘイエルダールはその真実を確かめようと、コンティキ号と名づけたいかだでペルーから探検を率いた。好都合な風と、食料の供給源となる魚のおかげで、長い航海が可能になった。"
 },
 { id:2, title:"プラスチック", emoji:"♻️",
   story:[
     "Plastic is [arguably|arguably|おそらく|possibly|arguably the most…] one of the most useful inventions, since it can be [formed|form|形成する|mould / shape|form into shapes] into a huge [variety of|a variety of|様々な|a wide range of|a variety of products] products.",
     "A [waterproof|waterproof|防水の|impermeable|waterproof coating] [coating|coating|塗装膜・コーティング|outer layer|a protective coating] protects cables, while [synthetic|synthetic|合成の|artificial / man-made|synthetic materials] bottles are light and [inexpensive|inexpensive|安価な|cost-effective|inexpensive to produce].",
     "The idea did not [originate|originate|～から生じる|spring from / stem from|originate from…] recently; [mankind|mankind|人類|humanity|the future of mankind] has used simple plastics since [the medieval period|the medieval period|中世|the Middle Ages|in the medieval period].",
     "The real [turning point|turning point|転機|watershed|a turning point] came in 1907, though one early inventor went [bankrupt|go bankrupt|倒産する|go out of business|go bankrupt] before success.",
     "Today the environmental [impact|impact|影響|effect / consequence|have an impact on] of plastic is a [growing concern|a growing concern|懸念の高まり|serious worry|a growing concern over…], so biodegradable bottles have been [launched|launch|世に出す|introduce|launch a product]."
   ],
   jp:"プラスチックは、あらゆる種類の製品に形成できることから、おそらく最も便利な発明の一つだ。防水のコーティングはケーブルを守り、合成のボトルは軽くて安価だ。この発想は最近生じたものではなく、人類は中世から簡単なプラスチックを使ってきた。本当の転機は1907年に訪れたが、ある初期の発明家は成功前に倒産した。今日ではプラスチックの環境への影響が懸念の高まりとなり、生分解性ボトルが世に出された。"
 },
 { id:3, title:"タイタニック", emoji:"🚢",
   story:[
     "When the Titanic [departed|depart|出発する|leave / set off|depart from|港を出ていく→part(離れる)] from Ireland in 1912, few had any [doubt|doubt|疑い|scepticism|cast doubt on, there is little doubt that…] it was unsinkable.",
     "[Initially|initially|最初は|at first|initially planned, the initial stage], the crew ignored the iceberg warnings, and a fatal [lack|lack|不足|shortage of|a lack of resources, a shortage of staff] of lifeboats turned the night into a tragedy.",
     "For decades, [previous attempts|previous attempt|以前の試み|earlier efforts|previous attempts to…] to find the wreck all failed.",
     "Then, [in collaboration with|in collaboration with|～と協力して|in partnership with|work in collaboration with] a French team, explorers made an astonishing [discovery|discovery|発見|finding|make a discovery, recent findings] on the seabed — though the hull had badly [deteriorated|deteriorate|悪化・劣化する|worsen / decline|conditions deteriorate rapidly|de(下へ)+劣化→どんどん下がって悪くなる] after seventy years underwater."
   ],
   jp:"1912年にタイタニックがアイルランドを出発した時、それが沈むと疑う者はほとんどいなかった。当初、乗組員は氷山警告を無視し、救命ボートの致命的な不足が悲劇を生んだ。何十年もの間、残骸を見つける以前の試みはすべて失敗した。やがてフランスのチームと協力して、探検家たちは海底で驚くべき発見をした——船体は70年の海中で激しく劣化していたが。"
 },
 { id:4, title:"アイダホのビーバー", emoji:"🦫",
   story:[
     "Beavers became such a [nuisance|nuisance|迷惑|inconvenience|a public nuisance, cause inconvenience] in Idaho that their dam [construction|construction|建設|building / development|under construction, urban development] began to [alter|alter|変える|transform / modify|alter the landscape|alter≒changeの上品語。Writingで多用] the whole landscape.",
     "Their [instinct|instinct|本能|predisposition|a natural instinct to…] to build never stops, and homes had begun to [encroach on|encroach on|～を侵害する|infringe upon|encroach on natural habitat] their habitat.",
     "So wardens found an [ideal|ideal|理想的な|optimal|an ideal location, optimal conditions] valley with an [abundance|abundance|豊富さ|a wealth of|an abundance of food, in abundance] of food.",
     "Using a [surplus|surplus|余剰|excess|a surplus of, surplus stock] of war parachutes, they dropped the beavers from a plane — a truly [unique|unique|独自の|one-of-a-kind|a unique solution / opportunity] solution."
   ],
   jp:"アイダホでビーバーは大迷惑になり、そのダム建設が地形全体を変え始めた。作る本能は止まらず、人家が彼らの生息地を侵害し始めていた。そこで猟区管理人は食料が豊富な理想的な谷を見つけた。第二次大戦の余剰パラシュートを使い、飛行機からビーバーを落とすという実にユニークな解決策をとった。"
 },
 { id:5, title:"ダンス", emoji:"💃",
   story:[
     "Dancing [stimulates|stimulate|刺激する|trigger / arouse|stimulate the brain, trigger emotions] the brain like little else.",
     "Despite some [uncertainty|uncertainty|不確かさ|ambiguity|a degree of uncertainty], one [theory|theory|説|argument|one theory is that…] is that a key [factor|factor|要因|element|a key factor, an essential element] is how music and movement combine to [generate|generate|生み出す|produce|generate energy / dopamine] dopamine.",
     "The brain loves to [predict|predict|予測する|anticipate / foresee|predict the outcome, anticipate problems] patterns, so watching a [complex|complex|複雑な|complicated|a complex system, a complicated process] move we cannot foresee creates an [intense|intense|強烈な|deep|intense emotion / excitement] rush of pleasure — it is [obvious|obvious|明らかな|self-evident|it is obvious that…] why we love the dance floor."
   ],
   jp:"ダンスは他に類を見ないほど脳を刺激する。多少の不確かさはあるが、一説では、音楽と動きが組み合わさってドーパミンを生み出す点が重要な要因だという。脳はパターンを予測するのが好きで、予見できない複雑な動きを見ると強烈な快感が湧く——私たちがダンスフロアを愛する理由は明らかだ。"
 },
 { id:6, title:"AIによる芸術", emoji:"🎨",
   story:[
     "AI art challenges our [perspective|perspective|視点・見方|viewpoint / standpoint|from my perspective] on creativity.",
     "At first, the [notion|notion|考え方|concept / idea|the notion that…] that machines could paint was met with [scepticism|scepticism|懐疑|doubt|met with scepticism], yet the results were [credible|credible|信じられる|plausible|a credible explanation, a plausible argument] enough to fool experts.",
     "This [innovative|innovative|革新的な|ingenious / groundbreaking|an innovative approach] technology raises hard questions about [value|value|価値|worth|the true value of…]: the [scarcity|scarcity|希少性|rarity|scarcity of resources, due to its rarity|scarce(乏しい)の名詞。scar=傷ついて少ないと連想] of an original gives it worth, so where does that leave a copy?",
     "There is a real [disparity|disparity|隔たり・差|gap / difference|a wide disparity, bridge the gap] between how experts and the public [interpret|interpret|解釈する|decipher|interpret a text / data] such art — and a fear that [automation|automation|自動化|mechanisation|the rise of automation] will replace human artists."
   ],
   jp:"AI芸術は創造性に対する私たちの見方を揺さぶる。当初、機械が絵を描けるという考え方は懐疑をもって受け止められたが、その結果は専門家を騙すほど本物らしかった。この革新的技術は価値について難しい問いを投げかける。原画の希少性がその価値を生むなら、複製はどうなるのか。専門家と一般人がこうした芸術を解釈する仕方には大きな隔たりがあり、自動化が人間の芸術家に取って代わるという恐れもある。"
 },
 { id:7, title:"才能ある子どもの学校", emoji:"🎓",
   story:[
     "Our school exists to [foster|foster|育む|nurture / cultivate|foster independence, nurture talent] the talents of [gifted|gifted|才能のある|talented / bright|a gifted child, academically gifted] children.",
     "We follow a clear [blueprint|blueprint|計画・構想|framework / model|a blueprint for success, a clear framework]: rather than coddle pupils, we build their [self-reliance|self-reliance|自立|independence / autonomy|develop self-reliance] and [independence|independence|自立|autonomy|greater independence / autonomy].",
     "Doing things alone [compensates for|compensate for|～の埋め合わせをする|make up for|compensate for the lack of…] time away from family, sparks [creativity|creativity|創造性|inventiveness / ingenuity|encourage creativity], and drives real [progress|progress|進歩・成長|advancement|make progress, career advancement]."
   ],
   jp:"当校は才能ある子どもの能力を育むために存在する。明確な構想に従い、生徒を甘やかすのではなく、自立と自主性を育てる。自分で物事を行うことは家族と離れている時間を埋め合わせ、創造性を刺激し、本当の成長を促す。"
 },
 { id:8, title:"ハイパーループ", emoji:"🚄",
   story:[
     "A famous entrepreneur who achieved [overnight success|overnight success|一夜にして成功|instant success|achieve overnight success] online decided to [invest in|invest in|投資する|finance / put money into|invest in infrastructure] a [groundbreaking|groundbreaking|画期的な|revolutionary / innovative|a groundbreaking technique] train linking two [metropolitan|metropolitan|大都市の|urban|metropolitan areas, urban centres] areas.",
     "But there were [obstacles|obstacle|障害|impediment / stumbling block|a major obstacle / stumbling block]. Tickets might be too [exorbitant|exorbitant|法外な|excessive|exorbitant prices, excessive costs] for ordinary people to [afford|afford|～する余裕がある|budget for|can't afford to…, afford a ticket].",
     "Until the company can [persuade|persuade|説得する・左右する|influence / sway|persuade sb to…, sway public opinion] local governments to [authorise|authorise|認可する|approve / permit|authorise a project, approve plans] the project, the train of the future stays on the drawing board."
   ],
   jp:"オンラインで一夜にして成功した有名な起業家が、二つの大都市圏を結ぶ画期的な列車に投資することを決めた。だが障害があった。運賃は一般の人が払えないほど法外かもしれない。会社が地元政府を説得して計画を認可させるまで、未来の列車は設計図のままだ。"
 },
 { id:9, title:"マリア・モンテッソーリ", emoji:"📚",
   story:[
     "Maria Montessori [struggled|struggle|奮闘する|fight / battle|struggle for a cause, struggle to do] for every child's right to learn.",
     "From an [esteemed|esteemed|立派な・名高い|prestigious / renowned|a prestigious university, a renowned expert] family, she [persevered|persevere|耐え忍ぶ・やり通す|persist|persevere despite difficulties] as the only woman in medical school and graduated with top grades.",
     "Working with poor children, she [came up with|come up with|～を思いつく|conceive|come up with an idea, conceive a plan] the theory that all kids have an [innate|innate|生まれつきの|natural / inborn|an innate desire, innate ability] desire to learn.",
     "Her method [emphasised|emphasise|強調する|highlight / underscore|emphasise the importance of] freedom and responsibility, and was soon [adopted|adopt|採用する|embrace / take up|adopt a method, embrace change] worldwide.",
     "A lifelong [advocate|advocate of|擁護者|champion of|a strong advocate of reform] of peace, her [subsequent|subsequent|その後の|resulting / later|subsequent events, the resulting impact] influence on education endures."
   ],
   jp:"マリア・モンテッソーリは、すべての子どもの学ぶ権利のために奮闘した。名家に生まれ、医学部で唯一の女性として耐え抜き、優秀な成績で卒業した。貧しい子どもたちと働く中で、すべての子は生まれつき学びたい願望を持つという理論を思いついた。彼女の手法は自由と責任を強調し、すぐに世界中で採用された。生涯平和の擁護者であり、その後の教育への影響は今も続いている。"
 },
 { id:10, title:"なぜ人はウソをつくのか", emoji:"🤥",
   story:[
     "Lying may seem [troubling|troubling|問題となる|worrisome / disquieting|a troubling trend], but it is an [indication|indication|証・しるし|sign / evidence|a clear indication of…, a sign that…] of a [sophisticated|sophisticated|洗練された|refined / polished|a sophisticated system] brain.",
     "The skill of [manipulating|manipulate|操作・説得する|persuade / convince|manipulate others, convince sb to do] others without force was an evolutionary advantage, and skilled liars passed this [trait|trait|特徴|characteristic|a personality trait, a key characteristic] to their children.",
     "We lie to [exaggerate|exaggerate|誇張する|inflate / overstate|exaggerate the truth, inflate figures] our image or to ease social [tension|tension|緊張|stress / strain|ease tension, cause strain].",
     "Scientists who [investigated|investigate|調査する|delve into / research|investigate the causes of…, delve into] child development found that learning to [conceal|conceal|隠す|cover up / disguise / mask|conceal the truth, mask one's feelings] the truth is actually a [milestone|milestone|道しるべ・節目|turning point / landmark|a key milestone, a turning point] — a sign the brain is reaching [maturity|maturity|成熟|adulthood|a sign of maturity, reach maturity]."
   ],
   jp:"ウソは問題に見えるが、実は洗練された脳の証だ。力を使わずに他人を操る技術は進化上の利点であり、巧みな嘘つきはこの特徴を子へ伝えた。人は自分のイメージを誇張するため、または社会的緊張を和らげるために嘘をつく。子どもの発達を調査した科学者は、真実を隠すことを学ぶのは実は節目——脳が成熟に近づいている印——だと突き止めた。"
 },
 { id:11, title:"マウンテンゴリラ", emoji:"🦍",
   story:[
     "The mountain gorilla is in serious [peril|peril|危険・危機|jeopardy / danger|be in peril], so researchers [scramble|scramble|急いで〜する|rush|scramble to do sth] to [monitor|monitor|観察・監視する|observe / track|monitor closely] the few that remain in the wild.",
     "Each troop has a [rigid|rigid|厳格な|strict / fixed|a rigid structure] social [structure|structure|構造・体制|framework / hierarchy|social structure], with one dominant male at the top.",
     "Younger, [immature|immature|未熟な|adolescent|immature males] males are [subordinate|subordinate to|〜の下位の|subservient to|subordinate to sb] to him, while the females [tend to|tend to|〜の世話をする|attend to / nurture|tend to the young] the young.",
     "As a male matures, a [distinctive|distinctive|特徴的な・際立った|unique / characteristic|a distinctive feature] silver back appears, and he may fight the leader for [dominance|dominance|支配|supremacy|fight for dominance].",
     "A gorilla's day is [segmented into|segment into|〜に分ける|divide into / split into|segment into parts] resting, roaming and feeding, and they rarely sleep in the same place on [successive|successive|連続する|consecutive / back-to-back|on successive days] nights.",
     "They largely [shun|shun|避ける|avoid / eschew|shun violence] meat, and scientists now [consider|consider as|〜を…と見なす|regard as / view as|consider sth as] them among the most intelligent animals."
   ],
   jp:"マウンテンゴリラは深刻な危機に瀕しており、研究者は野生に残るわずかな個体を観察しようと急いでいる。各群れは厳格な社会構造を持ち、頂点に1頭の支配的な雄がいる。より若い未熟な雄は彼の下位にあり、雌は子の世話をする。雄が成熟するとはっきりした特徴のある銀色の背が現れ、リーダーに支配権を求めて挑むこともある。ゴリラの一日は休息・放浪・採食に分けられ、連続する夜に同じ場所で眠ることはめったにない。彼らは概して肉を避け、科学者は今や彼らを最も知能の高い動物の一つと見なしている。"
 },
 { id:12, title:"オリーブの栽培", emoji:"🫒",
   story:[
     "Fresh olives are bitter and almost [inedible|inedible|食べられない|inconsumable|inedible in its raw state], so for centuries farmers [sought|seek|求める・〜しようとする|pursue / look for|seek a solution] ways to make them palatable.",
     "Removing the bitterness was once a [protracted|protracted|長く続く・長引く|drawn-out / time-consuming|a protracted process] and [painstaking|painstaking|骨の折れる・大変な|meticulous / thorough|a painstaking process] task.",
     "The Romans [supplemented|supplement|補う・加える|augment|supplement the diet] the saltwater with lye, which [reduced|reduce|減らす|cut down on / decrease|reduce the time] the time needed to cure the fruit.",
     "After curing, they [pressed|press|圧搾する・押しつぶす|squash / crush|press the olives] the olives to [extract|extract|抽出する・取り出す|obtain / draw out|extract oil] the oil, then sealed them in [airtight|airtight|密閉した|watertight / sealed|an airtight container] jars so they would not [spoil|spoil|腐る・だめになる|rot / decay|the food spoils].",
     "Depending on the region, the [harvest|harvest|収穫する|reap|harvest a crop] takes place between autumn and early winter.",
     "Today most olives come from Spain's [arable|arable|耕作に適した|food-producing|arable land] regions, where the trees [thrive|thrive|健康に育つ・繁栄する|flourish|thrive in a climate] thanks to a warm climate and [moisture|moisture|湿度・湿気|dampness|moisture in the air] in the air."
   ],
   jp:"採れたてのオリーブは苦くてほとんど食べられないため、農民は何世紀にもわたって食べやすくする方法を求めてきた。苦味を取り除く作業はかつて長く続く骨の折れる仕事だった。ローマ人は塩水にアルカリ液を加え、これが実を処理する時間を短縮した。処理後、彼らはオリーブを圧搾して油を抽出し、腐らないよう密閉した容器に入れた。地域によって収穫は秋から初冬の間に行われる。今日ほとんどのオリーブはスペインの耕作に適した地域から来ており、そこでは温暖な気候と空気中の湿度のおかげで樹がよく育つ。"
 },
 { id:13, title:"ロボカップ", emoji:"🤖",
   story:[
     "The annual RoboCup [showcases|showcase|紹介する・見せる|exhibit / display|showcase the latest technology] [state-of-the-art|state-of-the-art|最新式の|cutting-edge|state-of-the-art equipment] robotics through a football tournament.",
     "Organisers have set a [formidable|formidable|手ごわい・大変な|challenging / daunting|a formidable goal] goal: by 2050, a robot team that can beat human champions.",
     "Football is far more [demanding|demanding|きつい・要求の厳しい|exacting|a demanding task] than chess because it is [dynamic|dynamic|動的な・活動的な|ever-changing|a dynamic system]: players must [react|react|反応する|respond|react in real time] in real time and [position|position|配置する|place|position oneself] themselves around many [variables|variable|変化するもの・要因|factor|many variables].",
     "Current robots are not yet [adept at|adept at|〜が上手で|proficient at / deft at|adept at dealing with sth] this and look [awkward|awkward|ぎこちない・不器用な|clumsy|look awkward] on the pitch, so a truly [viable|viable|実現可能な|feasible|a viable option] robot team is still some way off.",
     "If they succeed it would be a scientific [breakthrough|breakthrough|飛躍的な進歩・突破口|quantum leap|a scientific breakthrough], with [promising|promising|見込みのある・期待できる|potentially exciting|a promising application] [applications|application|応用・利用|use / utilisation|practical applications] in elderly care and rescue."
   ],
   jp:"毎年開かれるロボカップは、サッカーのトーナメントを通して最新式のロボット工学を披露する。主催者は手ごわい目標を掲げている——2050年までに人間の王者を打ち負かせるロボットチームを作ることだ。サッカーはチェスよりはるかに過酷だ。動的で、選手は即座に反応し、多くの変化する要因に合わせて自らを配置しなければならない。現在のロボットはまだこれが上手でなく、ピッチ上でぎこちなく見えるので、本当に実現可能なロボットチームはまだ先だ。もし成功すれば科学的な突破口となり、老人介護や救助に見込みのある応用が広がるだろう。"
 },
 { id:14, title:"ニコラ・テスラと電流戦争", emoji:"⚡",
   story:[
     "Nikola Tesla set out to [revamp|revamp|改良する・見直す|overhaul|revamp a system] Edison's electrical system with alternating current.",
     "The two men became bitter [rivals|rival|ライバル・敵対者|antagonist / adversary|a bitter rival] and grew to [despise|despise|軽蔑する|loathe / detest|despise sb] each other in the 'War of the Currents'.",
     "Edison tried to [prove|prove|証明する|demonstrate|prove that…] AC was dangerous, but its [merits|merit|利点|benefit / advantage|the merits of…] eventually won out.",
     "Tesla [outlined|outline|概要を作る・起草する|draft|outline a plan] plans for free wireless electricity, and people were [dumbfounded|dumbfounded|とても驚いて|astonished / shocked|be dumbfounded by sth] by inventions such as the X-ray.",
     "He [established|establish|設立する|found / set up|establish a laboratory] a new laboratory but could not raise the [capital|capital|資本・資金|funding / financing|raise capital] he needed, and died [penniless|penniless|一文無しの|destitute / broke|die penniless].",
     "Once dismissed as the [archetype|archetype|典型|epitome|the archetype of…] of the 'mad scientist', his [accomplishments|accomplishment|業績・成果|achievement|a great accomplishment] are now being [reconsidered|reconsider|考え直す・見直す|reevaluate / reassess|reconsider his legacy]."
   ],
   jp:"ニコラ・テスラは交流電流でエジソンの電気システムを改良しようとした。2人は激しいライバルとなり、「電流戦争」の中で互いを軽蔑するようになった。エジソンは交流が危険だと証明しようとしたが、結局その利点が勝った。テスラは無料の無線電気の計画概要を作り、X線などの発明に人々はとても驚いた。彼は新しい研究所を設立したが必要な資本を集められず、一文無しで亡くなった。かつては「マッドサイエンティスト」の典型と片付けられた彼の業績は、今や見直されている。"
 },
 { id:15, title:"ある思考実験", emoji:"🚃",
   story:[
     "A runaway trolley is heading towards five people who are [unable|unable|〜できない|powerless|unable to move] to move.",
     "You can pull a lever to [divert|divert|〜を…に逸らす|redirect / switch|divert the trolley onto another track] it onto another track, where it would kill one person — two hard [options|option|選択肢|alternative / choice|two options].",
     "Which is the most [ethical|ethical|倫理的な|moral / principled|an ethical choice] choice? A utilitarian sees a clear moral [obligation|obligation|義務|duty / responsibility|a moral obligation] to save five, though most people are [reluctant|reluctant|したがらない|hesitant|be reluctant to do] to act.",
     "This [dilemma|dilemma|葛藤・ジレンマ|predicament|face a dilemma] is no longer abstract: self-driving cars raise real [ramifications|ramification|予期しない結果・影響|complication / consequence|serious ramifications].",
     "If a car must [endanger|endanger|危険にさらす|imperil / put in jeopardy|endanger lives] its passenger to avoid pedestrians, our instinct to [survive|survive|生き残る・生き延びる|stay alive|the instinct to survive] conflicts with the choice to [mitigate|mitigate|軽減する|lessen / allay|mitigate the risk] overall harm, and someone must be [accountable|accountable|責任がある|responsible / answerable|be accountable for]."
   ],
   jp:"暴走したトロッコが、動くことのできない5人に向かって突進している。レバーを引けば別の軌道に逸らせるが、そこには1人がいて死んでしまう——2つのつらい選択肢だ。どちらが最も倫理的な選択か。功利主義者は5人を救う明確な道徳的義務を見るが、多くの人はそうした決断をしたがらない。このジレンマはもはや抽象的ではない。自動運転車は現実の予期しない結果を生む。歩行者を避けるために車が乗客を危険にさらさねばならないとき、生き残ろうとする本能は全体の害を軽減する選択と対立し、誰かが責任を負わねばならない。"
 },
 { id:16, title:"火星で暮らす", emoji:"🪐",
   story:[
     "Many [leading|leading|一流の・有名な|prominent / noted|a leading scientist] scientists [call for|call for|〜を求める|push for|call for action] the colonisation of Mars to [ensure|ensure|保証する・確保する|guarantee / make sure|ensure survival] humanity's long-term survival.",
     "An environmental [catastrophe|catastrophe|災害・大惨事|calamity / disaster|an environmental catastrophe] or an [unforeseen|unforeseen|予想できない・不測の|unanticipated|unforeseen consequences] event could push us towards [extinction|extinction|絶滅|annihilation / dying out|face extinction], so they [urge|urge|強く促す・勧める|press / implore|urge sb to do] us to become a multi-planet species.",
     "In [isolation|isolation|隔離|remoteness|in isolation] on another planet, new traits could [arise|arise|生まれる・生じる|emerge|problems arise].",
     "One [feature|feature|特徴|trait / characteristic|a key feature] that would [stand out|stand out|目立つ|be prominent / attract attention|stand out from the crowd] is thicker bones, giving Martians a [robust|robust|がっしりした・たくましい|sturdy|a robust appearance] appearance.",
     "There is [considerable debate over|considerable debate over|相当な議論|some dispute over|considerable debate over the issue] their skin colour, which would likely darken to [counter|counter|対抗する・反撃する|counteract|counter the radiation] the radiation."
   ],
   jp:"多くの一流の科学者は、人類の長期的な生存を確保するために火星の植民地化を求めている。環境的な大惨事や不測の事象が私たちを絶滅へ追いやりかねないので、彼らは多惑星種になるよう強く促す。別の惑星での隔離の中で、新しい特徴が生じうる。際立つであろう特徴の一つは、より厚い骨で、火星人にがっしりとした外見を与える。彼らの肌の色については相当な議論があり、放射線に対抗するためおそらく暗くなるだろう。"
 },
 { id:17, title:"小惑星の衝突", emoji:"☄️",
   story:[
     "Another asteroid strike is [inevitable|inevitable|避けられない|inescapable / unavoidable|an inevitable outcome]; rocks [routinely|routinely|定期的に・いつも決まって|constantly|routinely come close] come close to Earth.",
     "Only recently have we begun to [track|track|追跡する・監視する|monitor|track the movement] their movements, raising the question of how to [deal with|deal with|〜に対処する|tackle / handle|deal with a problem] an [enormous|enormous|巨大な|gigantic / immense / massive|an enormous size] asteroid once we [pin down|pin down|突き止める|pinpoint / get a fix on|pin down its trajectory] its [trajectory|trajectory|軌道・進路|path / course|the trajectory of…].",
     "NASA has two possible [solutions|solution|解決策|answer|find a solution]. If we detect an [incoming|incoming|入ってくる・到着する|approaching|an incoming asteroid] asteroid early, we can nudge it away — but the long timescale makes this [impractical|impractical|現実的でない・実行困難な|unrealistic / unworkable|an impractical idea] in a [crisis|crisis|危機|emergency|a crisis situation].",
     "The other option is more [spectacular|spectacular|目を見張るような|dramatic / astonishing|a spectacular result]: blowing it up with nuclear weapons, though the [drawback|drawback|欠点|disadvantage / pitfall|a major drawback] is that it could break apart into pieces that still hit Earth."
   ],
   jp:"別の小惑星の衝突は避けられない。岩は定期的に地球に接近する。私たちはつい最近その動きを追跡し始めたばかりで、ひとたび軌道を突き止めたら巨大な小惑星にどう対処するかという疑問が生じる。NASAには2つの解決策がある。入ってくる小惑星を早期に検知できれば押しやれるが、長い所要時間のため危機においてこの案は現実的でない。もう一つの選択肢はより目を見張るもので、核兵器で吹き飛ばすことだ。ただし欠点は、なお地球に衝突する破片に分裂しうることだ。"
 },
 { id:18, title:"暗号通貨", emoji:"🪙",
   story:[
     "Cryptocurrencies first [appeared|appear|登場する・現れる|emerge / come onto the scene|first appeared in…] in 2009 as a [novel|novel|まったく新しい|original / brand-new|a novel way] way to [exchange|exchange|交換する・取引する|trade / deal in|exchange money] money, possibly [created|create|作り出す|conceive / design|create a system] by Satoshi Nakamoto.",
     "Each [transaction|transaction|取引|dealing|a financial transaction] is [recorded|record|記録する|document|record a transaction] on a decentralised ledger, which makes the currency nearly [invulnerable|invulnerable|傷つけられない|impenetrable|invulnerable to hacking].",
     "A key [benefit|benefit|利点|advantage / upside|the benefits of…] is cutting out the [middleman|middleman|仲介者|intermediary / go-between|cut out the middleman], so people can [transmit|transmit|送る・送金する|send / transfer|transmit money] money cheaply.",
     "But the price can [fluctuate|fluctuate|大幅に変動する|vacillate / seesaw|fluctuate widely] widely, so [newcomers|newcomer|新規参入者|beginner / novice|a newcomer to…] should be [cautious|cautious|注意深い・用心深い|prudent / wary|be cautious about].",
     "Because of its [anonymity|anonymity|匿名性|obscurity|preserve anonymity], the currency attracts criminals, and money has sometimes [disappeared|disappear|消失する・消える|vanish / go missing|money disappears] from an unregulated [marketplace|marketplace|市場|market|a global marketplace], leading critics to [label|label|レッテルを貼る|characterise / brand|label sth as…] these schemes as frauds."
   ],
   jp:"暗号通貨は、コンピュータで資金を交換するまったく新しい方法として2009年に初めて登場し、おそらくサトシ・ナカモトによって作られた。各取引は分散型の台帳に記録され、これにより通貨はほぼ傷つけられないものになる。大きな利点は仲介者を取り除くことで、人々は安く送金できる。だが価格は大幅に変動しうるので、新規参入者は注意深くあるべきだ。匿名性のため犯罪者を引きつけ、規制されていない市場から資金が消失することもあり、批評家はこうした仕組みを詐欺だとレッテルを貼る。"
 },
 { id:19, title:"ポンジスキーム", emoji:"💸",
   story:[
     "A Ponzi scheme is a [scam|scam|詐欺|swindle / con / fraud|a financial scam] in which early investors are paid [dividends|dividend|配当（金）|return|pay dividends] from newcomers' money rather than from [legitimate|legitimate|合法的な・まっとうな|legal / authentic / genuine|a legitimate business] business.",
     "Charles Ponzi [assured|assure|保証する・確信させる|convince / reassure|assure sb that…] his [community|community|地域社会|neighbourhood|the local community] they could double their money, and [enthusiasm|enthusiasm|熱中・熱狂|fervour / zeal|enthusiasm for…] swept the city as he raked in great [wealth|wealth|財産・富|affluence / prosperity|accumulate wealth].",
     "But local newspapers grew suspicious because of his [inaccurate|inaccurate|不正確な|erroneous|inaccurate figures] bookkeeping, which aroused [suspicion|suspicion|疑念|scepticism|arouse suspicion].",
     "They [calculated|calculate|判断する・確定する|determine / ascertain|calculate that…] it was [inconceivable|inconceivable|あり得ない|beyond belief / beyond reason|it is inconceivable that…] to earn so much so fast, the police launched an [inquiry|inquiry|捜査・取り調べ|probe / investigation|launch an inquiry], and the scheme [collapsed|collapse|崩壊する・破綻する|fall apart / turn sour|the scheme collapses].",
     "Such frauds [endure|endure|生き長らえる・耐える|live on / continue to exist|endure for centuries] today: Bernie Madoff seemed [trustworthy|trustworthy|信頼できる|credible / honest / reliable|a trustworthy partner] but ran the most [infamous|infamous|悪名高い|notorious / scandalous|the most infamous case] Ponzi scheme in history."
   ],
   jp:"ポンジスキームとは、合法的な商取引からではなく新規の投資家の資金で前の投資家に配当を払う詐欺だ。チャールズ・ポンジは地域の人々に資金を2倍にできると保証し、彼が巨額の富を荒稼ぎする中で熱狂が市内を席巻した。だが彼の不正確な帳簿のため地元紙は疑念を抱いた。彼らはこんなに短期間でこれほど稼ぐのはあり得ないと判断し、警察が捜査に乗り出し、スキームは破綻した。こうした詐欺は今日も生き長らえている——バーナード・マドフは信頼できるように見えたが、歴史上最も悪名高いポンジスキームを運営した。"
 },
 { id:20, title:"普遍文法", emoji:"🗣️",
   story:[
     "There are two [competing|competing|相反する・競合する|differing / clashing|competing theories] theories of language acquisition: either language is learned, or it is a natural [ability|ability|能力|capability / competence|the ability to do].",
     "B.F. Skinner argued that all language is learned through [repetition|repetition|反復・繰り返し|reiteration|learn through repetition], an [approach|approach|方法|method|a new approach] that had a [profound|profound|大規模な・深い|deep|a profound impact] impact for years.",
     "Yet deaf children babble in a [systematic|systematic|体系的な・規則正しい|methodical / standardised|a systematic order] order, and new creole languages [emerge|emerge|出現する・生まれる|arise / appear|a new language emerges] with a [common|common|一般的な・普通の|shared / universal|a common grammar] grammar.",
     "Noam Chomsky, the [renowned|renowned|著名な|acclaimed / esteemed|a renowned linguist] linguist, proposed 'universal grammar', believing the [fundamentals|fundamental|基本・基礎|foundation / basics|the fundamentals of…] are innate — such as the ability to [differentiate between|differentiate between|〜を区別する|distinguish between|differentiate between a verb and a noun] a verb and a noun.",
     "[Drawing on|draw on|〜を利用する|tap into / employ|draw on ideas] these ideas, his [contemporary|contemporary|同時代の人|peer|his contemporaries] Steven Pinker [speculated|speculate|推測する|hypothesise / surmise|speculate that…] that an isolated group would naturally [develop|develop|発達する|evolve / materialise|language develops] a full language."
   ],
   jp:"言語習得には2つの相反する理論がある。言語は学ぶものか、生まれ持った能力かというものだ。B.F.スキナーは、すべての言語は反復によって習得されると主張し、その方法は長年大きな影響を与えた。しかし聴覚障害のある子どもは規則正しい順序でしゃべり、新しいクレオール語は共通の文法をもって生まれてくる。著名な言語学者ノーム・チョムスキーは「普遍文法」を提唱し、動詞と名詞を区別する能力のような基本は生まれつきのものだと信じた。これらの考えを利用し、同時代のスティーブン・ピンカーは、隔離された集団は自然に完全な言語を発達させると推測した。"
 }
];
