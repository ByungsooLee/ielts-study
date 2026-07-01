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
 },
{
   id:21, title:"バナナ", emoji:"🍌",
   story:[
     "The banana is a [staple|staple|主要な・主食の|mainstay / principal|a staple food] food for millions and is [essential|essential|不可欠な|vital / indispensable|essential for] to many diets.",
     "The Cavendish is the [quintessential|quintessential|典型的な・真髄の|classic / archetypal|the quintessential example] supermarket banana, and it [accounts for|account for|〜を占める|make up|account for 40%] nearly half of all [cultivated|cultivate|栽培する|grow / farm|cultivated land] fruit.",
     "However, this variety is now [on the brink of|on the brink of|〜の間際で|on the verge of / on the edge of|on the brink of collapse] disaster, because a fungus has begun to [ravage|ravage|壊滅させる|devastate / despoil|be ravaged by disease] plantations.",
     "The disease can [run rampant|run rampant|はびこる|spread uncontrollably / get out of hand|disease runs rampant] worldwide, and Cavendish plants are not [immune to|immune to|〜に免疫のある|resistant to|immune to the disease] it.",
     "Because every plant is a clone, [conventional|conventional|従来の|traditional / ordinary|conventional methods] farming has allowed the infection a [rapid expansion|rapid expansion|急激な拡大|explosive growth|the rapid expansion of].",
     "Growers now take [drastic|drastic|思い切った・抜本的な|radical / extreme|drastic measures] measures to [preserve|preserve|保存する・保護する|conserve / safeguard|preserve the crop] the crop, since numbers [dwindle|dwindle|減少する|decline / diminish|numbers dwindle] each year.",
     "Some hope to [eradicate|eradicate|根絶する|wipe out / destroy|eradicate a disease] the fungus, while others [diversify|diversify|多様化する|branch out|diversify crops] and search for a [substitute|substitute|代わり・代用品|alternative / replacement|a substitute for] variety."
   ],
   jp:"バナナは何百万人もの主食であり、多くの食生活に不可欠だ。キャベンディッシュは典型的なスーパーのバナナで、栽培される果物のほぼ半分を占める。しかしこの品種は今や大惨事の間際にあり、菌類が農園を壊滅させ始めている。この病気は世界中にはびこり、キャベンディッシュはそれに免疫がない。すべての株がクローンのため、従来の農法は感染の急拡大を許してきた。生産者は作物を守るため思い切った対策を取るが、数は年々減少している。菌の根絶を望む者もいれば、多様化して代わりの品種を探す者もいる。"
 },
 {
   id:22, title:"フロー（集中状態）", emoji:"🎯",
   story:[
     "Psychologists use the term 'flow' to describe a state of [intense|intense|強烈な・熱烈な|fervent / passionate|intense concentration] [concentration|concentration|集中|focus / absorption|intense concentration] in which people become completely [engrossed in|be engrossed in|没頭する|be absorbed in / be immersed in|engrossed in the task] a task.",
     "This state is informally [known as|be known as|〜として知られる|be referred to as|informally known as] 'being in the zone', and its [implications|implication|影響・含意|consequence / significance|have implications for] for work have great [significance|significance|重要性|importance|of great significance].",
     "Flow can boost [productivity|productivity|生産性|efficiency / output|boost productivity] because workers [attain|attain|達成する|achieve / reach|attain a goal] a sense of [mastery|mastery|熟達・習熟|proficiency / command|mastery of a skill].",
     "To reach it, a task needs clear, almost [instantaneous|instantaneous|即座の|immediate / instant|instantaneous feedback] feedback so people can [assess|assess|評価する・見極める|gauge / evaluate|assess the situation] their progress and [ascertain|ascertain|確かめる|verify / confirm|ascertain the facts] how well they are doing.",
     "The benefits are [manifold|manifold|多数の・多様な|numerous / multiple|manifold benefits] and [abundant|abundant|豊富な|plentiful / ample|abundant resources].",
     "Interestingly, people in flow work for its own sake, [in lieu of|in lieu of|〜の代わりに|instead of|in lieu of payment] any reward, driven by [intrinsic|intrinsic|内在的な|inherent / internal|intrinsic motivation] rather than [extrinsic|extrinsic|外部の|external|extrinsic rewards] motives.",
     "Without a financial [incentive|incentive|動機付け・誘因|motivation / stimulus|a financial incentive], they still feel deep [gratification|gratification|満足|satisfaction / fulfilment|a sense of gratification] and a [tremendous|tremendous|とてつもない|huge / enormous|a tremendous impact] sense of joy."
   ],
   jp:"心理学者は『フロー』という語で、人が完全に没頭する強烈な集中状態を表す。この状態は俗に『ゾーンに入る』と呼ばれ、仕事への影響は大きな重要性を持つ。フローは生産性を高める。働く人が熟達の感覚を達成するからだ。それに達するには、進捗を評価し、どれだけうまくできているか確かめられるよう、ほぼ即座のフィードバックが必要だ。その利点は多数で豊富だ。興味深いことに、フロー状態の人は報酬の代わりにそれ自体のために働き、外的動機ではなく内的動機に駆られる。金銭的な動機付けがなくても、深い満足ととてつもない喜びを感じる。"
 },
 {
   id:23, title:"イエローストーンのオオカミ", emoji:"🐺",
   story:[
     "The [reintroduction|reintroduction|再導入|reinstatement|the reintroduction of] of wolves to Yellowstone helped [kick-start|kick-start|始動させる|jump-start / trigger|kick-start the economy] the recovery of the whole ecosystem.",
     "It set off a [cascade effect|cascade effect|連鎖効果|ripple effect / domino effect|trigger a cascade effect] that [restored|restore|回復させる・戻す|reinstate / bring back|restore balance] the natural [balance|balance|均衡・バランス|equilibrium / stability|restore balance] of the park.",
     "As an [apex predator|apex predator|頂点捕食者|top predator / alpha predator|the apex predator], the wolf [plays a key role|play a key role|重要な役割を果たす|play an important part|play a key role in], though it can also kill [livestock|livestock|家畜|cattle|kill livestock].",
     "This made the plan [controversial|controversial|物議を醸す|contentious / questionable|a controversial decision], and ranchers were [hostile towards|hostile towards|敵対的な|antagonistic to|hostile towards the idea] it, fearing a [detrimental|detrimental|有害な|adverse / harmful / damaging|a detrimental effect] effect on their herds.",
     "To [mollify|mollify|なだめる・和らげる|allay / put to rest|mollify concerns] them, ecologists had to [formulate|formulate|立案する|devise / draw up|formulate a plan] a careful [course of action|course of action|行動方針|plan / strategy|the best course of action].",
     "Under [constant|constant|絶え間ない|continuous / continual|constant pressure] [surveillance|surveillance|監視|scrutiny / close observation|under surveillance], the wolves did not [harass|harass|悩ませる・付きまとう|stalk / chase|harass the herd] cattle as feared.",
     "Instead, elk numbers began to [diminish|diminish|減る・衰える|shrink / dwindle|diminish over time], willows returned to [replenish|replenish|補充する|restore / top up|replenish stocks] the riverbanks, and the once [fragile|fragile|もろい・繊細な|delicate|a fragile ecosystem] ecosystem grew strong."
   ],
   jp:"イエローストーンへのオオカミの再導入は、生態系全体の回復を始動させた。それは連鎖効果を引き起こし、公園の自然な均衡を回復させた。頂点捕食者としてオオカミは重要な役割を果たすが、家畜を殺すこともある。このため計画は物議を醸し、牧場主は群れへの有害な影響を恐れて敵対的だった。彼らをなだめるため、生態学者は慎重な行動方針を立案しなければならなかった。絶え間ない監視の下、オオカミは懸念されたほど牛を襲わなかった。むしろエルクの数は減り始め、ヤナギが川岸に戻って補充し、かつてもろかった生態系は強くなった。"
 },
 {
   id:24, title:"おとぎ話の起源", emoji:"📖",
   story:[
     "It is a [commonly held belief|commonly held belief|通説・広く信じられた考え|accepted truth / axiom|a commonly held belief that] that fairy tales are only a few centuries old.",
     "People assume the Brothers Grimm simply [concocted|concoct|でっち上げる・考え出す|make up / invent|concoct a story] their stories and [wrote them down|write down|書き留める|set down / record|write down a story].",
     "In fact, the tales were passed on [through oral tradition|through oral tradition|口伝えで|by word of mouth|passed on by word of mouth] for centuries before anyone [meticulously|meticulously|入念に・骨を折って|laboriously / diligently|meticulously recorded] recorded them.",
     "The brothers [compiled|compile|編集する・集める|amass / collect|compile a collection] a huge [anthology|anthology|選集・作品集|collection|an anthology of tales] of folk stories.",
     "It may [occur to|occur to|ふと思い浮かぶ|strike / dawn on|it occurred to] us that cultures which seem [poles apart|poles apart|大きくかけ離れた|worlds apart / as different as chalk and cheese|be poles apart] often share the same tales.",
     "Researchers now [confirm|confirm|確認する・裏付ける|establish / affirm / verify|confirm a theory] the [ancestry|ancestry|起源・血統|origin / source|trace the ancestry of] of these stories.",
     "Many are instantly [recognisable|recognisable|見分けがつく・見覚えのある|familiar|instantly recognisable] despite [varying|varying|異なる・さまざまな|differing|varying endings] endings, and each new [version|version|版・翻案|adaptation / interpretation|different versions] is [based on|be based on|〜に基づく|be rooted in|based on a folk tale] an older one.",
     "When linguists [classify|classify|分類する|categorise / group|classify sth as] the tales, some can [be traced back to|be traced back to|〜まで遡る|be dated back to|be traced back to] the Bronze Age, before Indo-European languages [split|split|分ける・分裂する|divide|split into branches] and [transformed|transform|一変させる・変身する|metamorphose / change completely|transform into] into many branches."
   ],
   jp:"おとぎ話はほんの数世紀前のものだというのが通説だ。グリム兄弟が単に物語をでっち上げて書き留めたと人々は思っている。実際には、誰かが入念に記録するずっと前から、話は何世紀も口伝えで受け継がれてきた。兄弟は民話の膨大な選集を編集した。文化的に大きくかけ離れて見える地域が、しばしば同じ話を共有していることにふと気づくかもしれない。研究者は今、これらの話の起源を裏付けている。多くは結末が異なっても一目で分かり、新しい版はより古いものに基づく。言語学者が話を分類すると、インド・ヨーロッパ語族が分裂し多くの枝へ一変する前の青銅器時代まで遡るものもある。"
 },
 {
   id:25, title:"日本ザルと温泉", emoji:"🐒",
   story:[
     "Japanese macaques show a high [incidence|incidence|発生・発生率|occurrence / instance|a high incidence of] of bathing in hot springs.",
     "Scientists first [observed|observe|見つける・観察する|spot / sight|observe behaviour] this in Jigokudani, in a [mountainous|mountainous|山地の|hilly / alpine|a mountainous region] area.",
     "The monkeys use a pool [adjacent to|adjacent to|〜に隣接した|adjoining / alongside|adjacent to the hotel] a hotel, and for [hygienic|hygienic|衛生的な|sanitary / sterile|for hygienic reasons] reasons the bath is now used [exclusively|exclusively|もっぱら・独占的に|solely / entirely|used exclusively by] by them.",
     "This [phenomenon|phenomenon|現象|occurrence|a natural phenomenon] has become famous, and studies [validate|validate|実証する・確認する|corroborate / confirm / verify|validate a hypothesis] the idea that the springs help them.",
     "The monkeys [adapt to|adapt to|〜に適応する|acclimatise / adjust to|adapt to the environment] the cold and [maintain|maintain|維持する・保つ|preserve|maintain body temperature] body heat, so we should not [assume|assume|当然と思う・推定する|presume|assume that] the baths merely [act as|act as|〜として機能する|serve as|act as a barrier] play.",
     "Researchers [uncovered|uncover|発見する|find out / discover|uncover the truth] that the warm water can [alleviate stress|alleviate stress|ストレスを軽減する|reduce stress|alleviate stress] and help the monkeys [unwind|unwind|くつろぐ|relax / take it easy|unwind after work].",
     "During the mating season monkeys can be [aggressive|aggressive|攻撃的な|belligerent / combative|aggressive behaviour] and [conflict|conflict|対立・口論|dispute / quarrel|avoid conflict] is common.",
     "A warm bath can [lower|lower|下げる・減らす|reduce / lessen|lower stress levels] stress hormones [significantly|significantly|著しく・かなり|considerably / measurably|significantly higher], with a [corresponding|corresponding|対応する・関連する|correlative|a corresponding effect] drop in aggression."
   ],
   jp:"日本ザルは温泉に入る発生率が高い。科学者は山地の地獄谷で初めてこれを観察した。サルはホテルに隣接した湯を使い、衛生的な理由から今その湯はもっぱらサルだけが使う。この現象は有名になり、研究は温泉が役立つという説を実証している。サルは寒さに適応し体温を維持するので、その入浴を単なる遊びと当然視すべきではない。研究者は、温かい湯がストレスを軽減しサルをくつろがせることを発見した。繁殖期にはサルは攻撃的になり対立も多い。温かい湯はストレスホルモンを著しく下げ、攻撃性もそれに対応して減る。"
 },
 {
   id:26, title:"法隆寺", emoji:"🏯",
   story:[
     "Buddhist temples [dot|dot|点在する|be scattered around|temples dot the countryside] the countryside around Nara, where Prince Shotoku is still [revered|revere|崇敬する|venerate|be revered as].",
     "He built Horyu-ji [in honour of|in honour of|〜に敬意を表して|in memory of|in honour of] his father while he [recuperated from|recuperate from|（病気から）回復する|recover from / convalesce from|recuperate from an illness] an illness.",
     "It served as a temple for an [uninterrupted|uninterrupted|途切れない・連続した|continuous / constant / continual|uninterrupted service] 1,400 years and was [declared|declare|宣言する・発表する|announce|be declared a World Heritage Site] a World Heritage Site.",
     "The complex [is comprised of|be comprised of|〜から成る|be made up of / be composed of|be comprised of two sections] two [sections|section|区域|area / zone|in the western section].",
     "It is [widely acknowledged|widely acknowledged|広く認められた|universally accepted|widely acknowledged as] to hold the oldest wooden [structure|structure|建造物|edifice / building|the oldest wooden structure] in the world, built for more than a [utilitarian|utilitarian|実用的な|practical / functional|a utilitarian purpose] purpose.",
     "Its [interior|interior|内部|inner / internal|the interior] is plain, but the [exterior|exterior|外観・外部|façade / outside appearance|the exterior] is ornate, and the halls [house|house|収蔵する・収める|store / contain / keep|house a statue] a [sacred|sacred|神聖な|holy / divine|a sacred statue] statue that is only [on display|be on display|展示中で|be exhibited / be open to the public|be on display] at certain times.",
     "After a fire, some believed the buildings were [reconstructed|reconstruct|再建する|rebuild|be reconstructed], but [analysis|analysis|分析|examination|analysis of the timber] of the timber gave [conclusive evidence|conclusive evidence|決定的証拠|absolute proof / confirmation|conclusive evidence that] they were original, thanks to a dating [technique|technique|技法・手法|method / procedure|a dating technique]."
   ],
   jp:"奈良の周辺には仏教寺院が点在し、聖徳太子は今も崇敬されている。彼は病から回復する間、父に敬意を表して法隆寺を建てた。それは途切れなく1400年寺院として機能し、世界遺産に登録された。伽藍は二つの区域から成る。世界最古の木造建造物を持つと広く認められ、実用を超えた目的で建てられた。内部は簡素だが外観は華やかで、堂は特定の時期にしか公開されない神聖な像を収める。火災の後、建物は再建されたと考える者もいたが、木材の分析が年代測定法により、それらが当初のものだという決定的証拠を与えた。"
 },
 {
   id:27, title:"行動経済学", emoji:"📊",
   story:[
     "Despite a recent [economic downturn|economic downturn|景気後退・不況|recession|an economic downturn], cruise lines still [turn a profit|turn a profit|利益を上げる|get into the black|turn a profit] [on a massive scale|on a massive scale|大規模に|on a large scale / in great measure|on a massive scale].",
     "They do this by getting customers to [compare|compare with|〜と比較する|weigh against|compare A with B] one price with another.",
     "A $1,000 television seems [costly|costly|高価な|pricey / overpriced|costly goods] next to a $700 one, yet cheap next to a $2,000 one.",
     "If you [refurbish|refurbish|改装する・一新する|renovate / spruce up / fix up|refurbish a room] your living room [thoroughly|thoroughly|徹底的に|inside and out / from top to bottom|thoroughly clean] for $20,000, a $1,000 set then seems minor.",
     "This [contradicts|contradict|矛盾する・反論する|run counter to / contrast with|contradict the theory] the idea that people spend money [logically|logically|論理的に・合理的に|rationally / sensibly|act rationally] and treat cash as having an [absolute|absolute|絶対的な・確定した|definite / fixed|an absolute value] value.",
     "Economists once [underestimated|underestimate|過小評価する|undervalue|underestimate the risk] this, but behavioural economics — a [hybrid|hybrid|融合・混成|fusion / combination / amalgamation|a hybrid of] of psychology and economics — has [gained traction|gain traction|勢いを増す|pick up momentum / gain ground|gain traction].",
     "It shows people make [irrational|irrational|不合理な|illogical / ill-considered|an irrational decision] choices, and companies [take advantage of|take advantage of|利用する・つけ込む|utilise / capitalise on|take advantage of] this to [boost|boost|増やす・押し上げる|increase / raise|boost sales] sales.",
     "Once on board, customers spend [astronomical|astronomical|天文学的な・莫大な|enormous / sky-high|astronomical prices] amounts, doubling the company's [earnings|earnings|収入・収益|revenue|annual earnings]."
   ],
   jp:"近年の景気後退にもかかわらず、クルーズ会社は大規模に利益を上げている。客にある価格を別の価格と比較させることでこれを行う。1000ドルのテレビは700ドルの隣では高価に見えるが、2000ドルの隣では安く見える。居間を2万ドルで徹底的に改装すれば、1000ドルのテレビは小さく思える。これは、人はお金を論理的に使い現金を絶対的な価値として扱うという考えと矛盾する。経済学者はかつてこれを過小評価したが、心理学と経済学の融合である行動経済学は勢いを増している。人は不合理な選択をし、企業はそれを利用して売上を伸ばす。いったん乗せられると客は天文学的な額を使い、企業の収益は倍増する。"
 },
 {
   id:28, title:"エジプト王国の滅亡", emoji:"🏺",
   story:[
     "It is now [common knowledge|common knowledge|常識・広く知られた事実|widely accepted knowledge|it is common knowledge that] that the Egyptian Empire began to [perish|perish|滅びる・崩壊する|collapse|perish from drought] around 2200 BC.",
     "By studying pollen, archaeologists [deduce|deduce|推論する・見抜く|figure out / infer|deduce that] that a drought caused a lack of [precipitation|precipitation|降水|rainfall|a lack of precipitation].",
     "The Nile valley was once a [fertile region|fertile region|肥沃な地帯|breadbasket|a fertile region] that could [yield|yield|産出する・もたらす|harvest / produce|yield crops] huge harvests.",
     "As the [fringes|fringe|周辺・周縁|periphery / outskirts|on the fringes of] of the empire dried up, pharaohs failed to [take steps|take steps|対策を講じる|act / move|take steps to] or [plan ahead|plan ahead|前もって計画する|prepare in advance / pre-plan|plan ahead for] to [ward off|ward off|食い止める・防ぐ|avert / stave off|ward off disaster] famine.",
     "They still tried to [conquer|conquer|征服する・打ち負かす|defeat / vanquish / take over|conquer a region] neighbours rather than act in a [selfless|selfless|無私の・利他的な|altruistic / noble / magnanimous|a selfless act] way, and chaos spread to the [borders|border|境界・国境|boundary|cross the border].",
     "Even a [hardy|hardy|丈夫な・頑健な|robust / sturdy|a hardy breed] people, [resilient|resilient|耐性のある・回復力のある|resistant|resilient to] and used to [arid|arid|乾燥した|bone-dry|arid conditions] land, could not survive.",
     "With more [prescience|prescience|先見・先見の明|foresight / forethought|show foresight], they might have [bred|breed|品種改良する・繁殖させる|cross / crossbreed|breed cattle] tougher cattle, but the empire began to [disintegrate|disintegrate|崩壊する・衰退する|decline / fall into ruin|empires disintegrate]."
   ],
   jp:"エジプト帝国は紀元前2200年頃に滅び始めたというのが今や常識だ。花粉を調べ、考古学者は干ばつが降水不足を招いたと推論する。ナイル渓谷はかつて莫大な収穫を産出できる肥沃な地帯だった。帝国の周辺が干上がると、ファラオは飢饉を食い止める対策も前もっての計画も怠った。彼らは無私に振る舞うより近隣を征服しようとし、混乱は国境に広がった。乾燥した地に慣れた頑健で耐性のある民でさえ生き延びられなかった。もっと先見があれば、より丈夫な牛を品種改良できたかもしれないが、帝国は崩壊し始めた。"
 },
 {
   id:29, title:"ナノボット", emoji:"🤖",
   story:[
     "There is much [misinformation|misinformation|誤情報|inaccurate information / disinformation|spread misinformation] about the dangers of nanobots, [minuscule|minuscule|極めて小さい|microscopic / infinitesimal|minuscule machines] machines that could [upend|upend|一変させる・ひっくり返す|transform|upend an industry] medicine.",
     "Some critics [insist|insist|主張する・断言する|contend / assert / claim|insist that] that robots will [displace|displace|取って代わる|supersede / replace / supplant|displace workers] human workers.",
     "Yet nanobots have a [myriad|myriad|無数の|innumerable / countless / infinite|a myriad of uses] of uses; in 2018 one successfully [delivered|deliver|届ける・分配する|distribute / dispense|deliver drugs] drugs to a single cancerous cell with [precision|precision|正確さ|complete accuracy / exactitude|with precision].",
     "This technology has [revealed|reveal|明るみに出す・暴く|expose / bring to light|reveal a possibility] the chance to develop [tailor-made|tailor-made|あつらえの・特注の|custom-made / customised / bespoke|a tailor-made solution] [medical treatment|medical treatment|治療・医療|medical care|receive medical treatment].",
     "Because they can be [mass-produced|mass-produce|大量生産する|mass-manufacture|be mass-produced], nanobots could be [durable|durable|丈夫な・耐久性のある|resilient / tough|a durable material], [affordable|affordable|手頃な・安価な|economical / low-cost|affordable for everyone] and able to work [efficiently|efficiently|効率的に|quickly and effectively|work efficiently].",
     "In future, airborne nanobots may remove the [contaminants|contaminant|汚染物質|pollutant|remove contaminants] we [emit|emit|放出する・排出する|discharge|emit pollution] into the air.",
     "They might even [rejuvenate|rejuvenate|若返らせる・再生する|regenerate / breathe new life into|rejuvenate cells] our cells and reverse the [deterioration|deterioration|劣化・悪化|damage|environmental deterioration] of the body, making illness [a thing of the past|a thing of the past|過去のもの|ancient history|become a thing of the past]."
   ],
   jp:"極めて小さな機械で医療を一変させうるナノボットの危険については、多くの誤情報がある。ロボットが人間の労働者に取って代わると主張する批判者もいる。だがナノボットには無数の用途があり、2018年には一つが正確にがん細胞一つへ薬を届けた。この技術は、あつらえの治療を開発する可能性を明るみに出した。大量生産できるため、ナノボットは丈夫で手頃で効率的に働ける。将来、空中のナノボットは我々が大気に放出する汚染物質を除去するかもしれない。細胞を若返らせ体の劣化を逆転させ、病を過去のものにするかもしれない。"
 },
 {
   id:30, title:"情報格差", emoji:"📶",
   story:[
     "In the 1800s, remote and [inhospitable|inhospitable|住みにくい・荒涼とした|desolate / barren / unforgiving|inhospitable terrain] regions were cut off, and being 'off-line' had serious [repercussions|repercussion|悪影響・余波|fallout / consequence|serious repercussions].",
     "Today a similar 'digital divide' separates a [metropolitan area|metropolitan area|大都市圏|urban centre|a major metropolitan area] from poorer places.",
     "Where the network is [sound|sound|安定した・信頼できる|stable / reliable|a sound infrastructure], the internet can [provide|provide|供給する|furnish / supply|provide access] endless job [opportunities|opportunity|機会・可能性|possibility|job opportunities].",
     "But this does not [apply to|be applicable to|〜に当てはまる|apply to|applicable to] everyone, and the [gulf|gulf|隔たり・格差|gap / divide|a widening gulf] between rich and poor continues to [widen|widen|広がる|broaden|the gap widens].",
     "Access remains [unequal|unequal|不平等な|lop-sided / imbalanced|unequal distribution], and many people lack the [digital literacy|digital literacy|デジタルリテラシー|computer know-how|digital literacy skills] to use resources [adequately|adequately|適切に・十分に|effectively|adequately trained].",
     "Without it, it is hard to find [gainful employment|gainful employment|実入りの良い仕事|well-paying work|find gainful employment], which [exacerbates|exacerbate|悪化させる|worsen / amplify|exacerbate the problem] [income inequality|income inequality|所得格差|the gap between the haves and the have-nots|growing income inequality].",
     "To [reverse|reverse|逆転させる|change the momentum of|reverse the trend] this [trend|trend|傾向・動向|movement|reverse a trend] and [bridge the gap|bridge the gap|格差を埋める|overcome the divide|bridge the gap between], the UN has [teamed up with|team up with|提携する・協働する|collaborate with / work together with / cooperate with|team up with] NGOs to teach young people how to use [applications|application|応用・アプリケーション|programme / app|a practical application]."
   ],
   jp:"1800年代、辺鄙で住みにくい地域は隔絶され、『オフライン』であることは深刻な悪影響をもたらした。今日、同様の『デジタル格差』が大都市圏と貧しい地域を分ける。回線が安定した所では、インターネットは無数の仕事の機会を供給できる。だがこれは万人に当てはまらず、富める者と貧しい者の隔たりは広がり続ける。アクセスは不平等なままで、多くの人は資源を適切に使うデジタルリテラシーを欠く。それがないと実入りの良い仕事を見つけにくく、所得格差を悪化させる。この傾向を逆転させ格差を埋めるため、国連はNGOと提携し、若者にアプリの使い方を教えている。"
 },
{
   id:31, title:"スウェーデンと音楽", emoji:"🎸",
   story:[
     "Sweden produces an [inordinate|inordinate|過度の・過大な|disproportionate / excessive|an inordinate number of] number of pop hits, and its artists often [eclipse|eclipse|しのぐ・上回る|surpass / top|eclipse rivals] far bigger nations.",
     "Their success has [spanned|span|（ある期間に）及ぶ|stretch over|span decades] decades, so what is the [reason behind|be the reason behind|〜の原因となる|account for|be the reason behind] this musical [powerhouse|powerhouse|強力なグループ・精力家|force to be reckoned with|a musical powerhouse]?",
     "One factor is a school [curriculum|curriculum|教育課程|course of study / educational programme|the school curriculum] that values the [humanities|humanities|人文科学|liberal arts|study the humanities] and offers heavily [subsidised|subsidised|助成を受けた|funded / supported|a subsidised programme] music lessons.",
     "Many children [take up|take up|〜を始める・志す|pursue / adopt|take up a hobby] music through [extracurricular|extracurricular|課外の|after-school|extracurricular activities] clubs, so a large [proportion|proportion|割合|percentage|a large proportion of] of young Swedes gain real [confidence|confidence|自信|self-assurance / self-confidence|gain confidence].",
     "Musicians are [concentrated|concentrated|密集した|dense|concentrated in cities] in cities and live [in close proximity|in close proximity|〜に近接して|within walking distance / a stone's throw from|in close proximity to] to one another.",
     "[Empirical evidence|empirical evidence|経験的証拠|objective proof|empirical evidence shows] suggests that clusters where creative people [reside|reside|住む|dwell|reside in the city] together boost creative [output|output|生産・産出|productivity|boost output].",
     "Finally, Swedes [readily embrace|readily embrace|快く受け入れる|welcome|readily embrace new ideas] new trends, quickly adopting the latest ideas from abroad."
   ],
   jp:"スウェーデンは不釣り合いなほど多くのヒット曲を生み、そのアーティストはしばしばより大きな国をしのぐ。成功は数十年に及ぶが、この音楽大国の理由は何か。一つの要因は、人文科学を重んじ手厚く助成された音楽教育を行う学校のカリキュラムだ。多くの子どもが課外クラブで音楽を始め、若者の大きな割合が本物の自信を得る。音楽家は都市に密集し、互いに近接して住む。経験的証拠は、創造的な人々が集まって住む地域が創造的産出を高めることを示す。最後に、スウェーデン人は新しい流行を快く受け入れ、海外の最新の考えをすぐに取り入れる。"
 },
 {
   id:32, title:"日本建築の耐震性", emoji:"🏗️",
   story:[
     "Japan is at the [forefront of|forefront of|〜の最前線|vanguard of / fore of|at the forefront of] building towers that can [withstand|withstand|耐える・持ちこたえる|endure / take|withstand an earthquake] strong [seismic activity|seismic activity|地震活動|tremor / quake|seismic activity].",
     "A building must not be too [stiff|stiff|硬い・曲がらない|inflexible / rigid|a stiff structure], or it will [whip|whip|激しく揺れる|snap / jolt|whip back and forth] [back and forth|back and forth|前後に・行ったり来たり|backwards and forwards / to and fro|move back and forth], so it must be [sufficiently|sufficiently|十分に|adequately / suitably|sufficiently flexible] flexible to [sway|sway|揺れる|rock / swing|sway in the wind] with the motion.",
     "Tokyo Skytree uses a heavy central pillar to [dampen|dampen|勢いをそぐ・弱める|curb / absorb / minimise|dampen the shock] the [lateral|lateral|横の|horizontal / side-to-side|lateral movement] jolts.",
     "This engineering [marvel|marvel|驚くべきもの・偉業|feat / wonder|an engineering marvel] was [inspired by|be inspired by|〜に触発される|be influenced by|be inspired by nature] the pagoda, whose central column helps [stabilise|stabilise|安定させる|steady / keep steady|stabilise the tower] the tower.",
     "It is [modelled after|be modelled after|〜をモデルにする|borrow from|be modelled after] a design that has never [toppled|topple|倒れる|be knocked over|topple in a quake] in an earthquake.",
     "After each disaster, the government tightens building [regulations|regulation|規制・規則|rule / code|building regulations] so that fewer homes are [flattened|flatten|平らにする・倒壊させる|level / knock down|be flattened].",
     "They [revise|revise|改正する|amend / update|revise the law] the laws to be more [stringent|stringent|厳格な|rigorous|stringent codes], making reinforced concrete [mandatory|mandatory|義務的な|compulsory / obligatory|mandatory for all] in tall buildings."
   ],
   jp:"日本は地震に耐える塔を建てる最前線にある。建物は硬すぎると激しく前後に揺れて折れるため、揺れに合わせて十分にしなやかに揺れなければならない。東京スカイツリーは重い心柱で横揺れを弱める。この工学の偉業は五重塔に触発され、その心柱が塔を安定させる。地震で倒れたことのない設計をモデルにしている。災害のたびに政府は建築規制を強化し、倒壊する家を減らす。法律をより厳格に改正し、高層ビルには鉄筋コンクリートを義務づける。"
 },
 {
   id:33, title:"親しい友人と脳の働き", emoji:"🧠",
   story:[
     "How close friends think may be [down to|be down to|〜が原因で|be the result of / be due to|be down to] how their brains [function|function|機能する・働く|operate / behave|the brain functions].",
     "Scientists [carried out|carry out|〜を実行する|conduct|carry out research] a study using video clips that [ranged from|range from|〜から〜に及ぶ|span from|range from A to B] [unusual|unusual|異常な・普通でない|odd / bizarre / offbeat|unusual behaviour] music videos to [dull|dull|退屈な|monotonous / uninspiring / tedious|a dull video] wedding scenes.",
     "Strangers showed [divergent|divergent|食い違う・異なる|differing / dissimilar|divergent patterns] neural patterns, following their own [ebb and flow|ebb and flow|浮き沈み|ups and downs / highs and lows|the ebb and flow of] of attention.",
     "The same scenes [evoked|evoke|呼び起こす|induce / elicit|evoke emotions] the same responses in close friends, whose brains were highly [synchronised|synchronised|同調した|harmonised / synced|synchronised activity].",
     "Researchers [came across|come across|偶然見つける|stumble upon / accidentally uncover|come across a link] a clear [link|link|関連・つながり|connection / relationship|a link between] between friendship and a longer [life expectancy|life expectancy|寿命|lifespan|increase life expectancy].",
     "Loneliness can even be a [symptom of|symptom of|（病気の）兆候|sign of / indicator of|a symptom of dementia] poor health, so social ties matter.",
     "Like-mindedness may have [evolved|evolve|徐々に発達する|develop gradually|evolve over time] as humans [formed|form|形成する|create|form groups] hunting groups that had to [reach a consensus|reach a consensus|意見の一致をみる|settle on a decision / concur|reach a consensus] quickly.",
     "A shared [mindset|mindset|考え方|mentality|a fixed mindset] built strong [social bonds|social bond|社会的つながり|social tie / social network|a strong social bond], helping people [look after|look after|〜の世話をする|take care of / nurture / bring up|look after children] one another's young."
   ],
   jp:"親しい友人の考え方は、脳の働き方が原因かもしれない。科学者は、風変わりな音楽動画から退屈な結婚式まで幅のある映像を使って研究を行った。他人は食い違う神経パターンを示し、それぞれの注意の浮き沈みに従った。同じ場面が親友には同じ反応を呼び起こし、脳は高度に同調していた。研究者は友情と長い寿命との明確な関連を偶然見つけた。孤独は健康悪化の兆候でもあり、社会的つながりは重要だ。共感は、素早く合意する必要のある狩猟集団を人類が形成する中で徐々に発達したのかもしれない。共通の考え方は強い社会的つながりを築き、互いの子の世話を助けた。"
 },
 {
   id:34, title:"先祖調査ビジネス", emoji:"🧬",
   story:[
     "A [burgeoning|burgeoning|急成長する|thriving / flourishing / booming|a burgeoning industry] business of tracing our [ancestors|ancestor|先祖|forebear / forefather|trace one's ancestors] has grown into a huge [industry|industry|業界・事業分野|line of business / business field|a growing industry].",
     "What [drives|drive|駆り立てる・動機づける|motivate / inspire|drive sb to do] people to [dig into|dig into|〜を掘り下げる・調べる|investigate / delve into|dig into the past] their family trees is a [sense of identity|sense of identity|自己認識|sense of who one is / understanding of one's place in the world|a sense of identity] in a [cosmopolitan|cosmopolitan|国際化した|internationalised / globalised|a cosmopolitan city] world.",
     "It is [convenient|convenient|わかりやすい・便利な|straightforward / uncomplicated|convenient to use]: people can [track down|track down|〜を突き止める|trace / research|track down ancestors] their history from home.",
     "You [input|input|入力する|enter / upload|input the information] some details, and the company [issues|issue|発行する・送る|send out|issue a chart] a chart, all [accomplished|accomplish|やり遂げる・完了する|achieve / complete|be accomplished] from a saliva sample.",
     "DNA tests can [unearth|unearth|発掘する・明るみに出す|uncover / dig up|unearth one's roots] your [roots|roots|遺産・ルーツ|heritage|trace one's roots] going back thousands of years.",
     "Yet these databases are [susceptible to|susceptible to|〜の危険にさらされて|at risk of / prone to / vulnerable to|susceptible to hacking] hacking, and they may reveal diseases that [run in the family|run in one's family|（病気などが）遺伝である|be genetically inherited / be hereditary|run in the family].",
     "For this reason, privacy [advocates|advocate|擁護者・支持者|proponent|an advocate of] [raise concerns about|raise concerns about|〜への懸念を提起する|call into question / cast doubt on|raise concerns about] information that could become [accessible|accessible|入手可能な|available / out in the open / in public view|be accessible] at the click of a mouse."
   ],
   jp:"先祖をたどる急成長中のビジネスは巨大な業界へと育った。人々を家系調査に駆り立てるのは、国際化した世界での自己認識だ。便利で、家にいながら自分の歴史を突き止められる。いくつか情報を入力すると会社が家系図を発行し、すべて唾液の検体から完了する。DNA検査は何千年も遡ってルーツを掘り出せる。だがこれらのデータベースはハッキングの危険にさらされ、遺伝する病気を明らかにしうる。このため、プライバシーの擁護者は、クリック一つで入手可能になる情報への懸念を提起する。"
 },
 {
   id:35, title:"アルツハイマー病と修道女", emoji:"⛪",
   story:[
     "The [likelihood|likelihood|可能性|probability / prospect|the likelihood of] of developing Alzheimer's [disease|disease|病気・疾患|ailment / illness / condition|treat a disease] rises as people live longer.",
     "It [takes its toll on|take its toll on|〜に悪影響を与える|have an adverse effect on|take its toll on] [senior citizens|senior citizen|高齢者|elderly person / pensioner|senior citizens], and researchers wanted to [shed light on|shed light on|〜を解明する|illuminate / make clear|shed light on] its causes.",
     "They [selected|select|選ぶ|pick|select participants] nuns to [interview|interview|質問する・調査する|question / survey|interview sb] because they form a [homogeneous|homogeneous|同質の|remarkably similar|a homogeneous group] group.",
     "The nuns share the same [lifestyle|lifestyle|生活様式|way of life|a healthy lifestyle] and [background|background|人物の背景|personal history / profile|a similar background], which does not [affect|affect|影響を与える・変える|alter / transform|affect thinking] their thinking differently.",
     "This let scientists [rule out|rule out|〜を除外する|exclude / factor out|rule out a factor] the [extraneous variables|extraneous variable|外的変数・外部要因|external factor|control for extraneous variables] they usually must [take into account|take into account|〜を考慮する|consider / bear in mind|take into account] when they [perform|perform|〜を行う・実施する|conduct / carry out / run|perform a study] such studies.",
     "The nuns had also [kept journals|keep a journal|日記をつける|keep a diary / chronicle one's life|keep a journal] since they were young, a [critical|critical|決定的に重要な|key / crucial / indispensable|critical to success] source of data.",
     "Analysing these, researchers could [identify|identify|特定する・見つける|single out / detect|identify the cause] a link with [high intellect|high intellect|高い知性|above average intellect / greater acumen|high intellect], reaching a surprising [conclusion|conclusion|結論・発見|finding / discovery|reach a conclusion]."
   ],
   jp:"アルツハイマー病になる可能性は、人々の長寿化とともに高まる。それは高齢者に悪影響を与え、研究者はその原因を解明したかった。彼らは同質の集団であるため修道女を選び、調査した。修道女は同じ生活様式と背景を持ち、思考に別々の影響を与えない。これにより、こうした研究で通常考慮すべき外的変数を除外できた。修道女は若い頃から日記をつけており、決定的に重要なデータ源だった。これを分析し、研究者は高い知性との関連を特定し、意外な結論に達した。"
 },
 {
   id:36, title:"動物の進化", emoji:"🪲",
   story:[
     "One of the most [remarkable|remarkable|注目すべき・驚くべき|extraordinary / noteworthy / notable|a remarkable creature] creatures may hide in the [soil|soil|土|earth|in the soil] [underneath|underneath|〜の下に|beneath|underneath the ground] our feet.",
     "The rove beetle may [hold the key to|hold the key to|〜の答えを握る|provide the answer to|hold the key to] how evolution works, since it did not evolve [randomly|randomly|無作為に・偶然に|by chance / arbitrarily / without design|happen randomly].",
     "These beetles [prey on|prey on|〜を捕食する|consume / feed on|prey on insects] ants using a [tried-and-trusted|tried-and-trusted|実証済みの|proven / time-tested|a tried-and-trusted method] method.",
     "To [repel|repel|撃退する|fight off / chase away / repulse|repel an enemy] attackers, they [resemble|resemble|似ている|look like / bear a close resemblance to|resemble ants] ants and live among them [all year long|all year long|一年中|throughout the year / permanently|all year long].",
     "Over time they [enlarged|enlarge|大きくする・拡大する|expand|enlarge the colony] their bodies to [masquerade as|masquerade as|〜になりすます|imitate / pretend to be / pass as|masquerade as ants] ants and even copied their chemical [signal|signal|合図・しるし|cue / marker / indicator|a chemical signal].",
     "The benefits are [self-evident|self-evident|わかりやすい・自明の|obvious / clear / apparent|self-evident benefits]: a [temperate climate|temperate climate|温暖な気候|mild climate|a temperate climate] and an [ample|ample|十分な・豊富な|abundant / substantial / more than sufficient|an ample supply] [food supply|food supply|食料源|food source|an ample food supply].",
     "What [startled|startle|びっくりさせる|astound / amaze / astonish|be startled] scientists is that twelve types of beetle have done this in [identical|identical|同一の|alike / indistinguishable|identical to] ways, yet [independently|independently|独立して・別々に|separately|evolve independently] of each other.",
     "They believe that in the same [circumstances|circumstance|環境・状況|condition|in the same circumstances], animals follow similar paths."
   ],
   jp:"最も注目すべき生き物は、足元の土の下に隠れているかもしれない。ハネカクシは進化の仕組みの答えを握るかもしれない。無作為に進化したのではないからだ。この甲虫は実証済みの方法でアリを捕食する。攻撃者を撃退するためアリに似せ、一年中アリの中で暮らす。時とともに体を大きくしてアリになりすまし、化学的な合図までまねた。利点は自明だ。温暖な気候と十分な食料源である。科学者を驚かせたのは、12種の甲虫が同一の方法で、しかも互いに独立してこれを行ったことだ。同じ環境なら動物は似た道をたどると彼らは考えている。"
 },
 {
   id:37, title:"イギリス女王の発音", emoji:"👑",
   story:[
     "The Queen of England was known for her [crystal clear|crystal clear|極めて明確な|precise / exact|crystal clear pronunciation] diction.",
     "Yet a [subtle|subtle|微妙な・かすかな|slight / modest|a subtle change] but [noticeable|noticeable|目立つ|evident / perceptible|a noticeable difference] shift moved her accent from a strong [upper class|upper class|上流階級|aristocracy / nobility / the elite / ruling class|the upper class] sound towards [standard|standard|標準の|common / accepted / established|standard pronunciation] English.",
     "This change was [caused by|be caused by|〜によってもたらされる|be brought about by / result from|be caused by] the people around her, who [peg|peg as|〜を…と見なす|mark as / characterise as / label as|peg sb as] a speaker as belonging to a class.",
     "It is unlikely she consciously [echoed|echo|まねる|resemble / mirror / emulate|echo the accent] her subjects, or was even [conscious of|conscious of|〜を自覚して|aware of / cognizant of / alert to|conscious of] it.",
     "The [root cause|root cause|根本的な原因|fundamental reason|the root cause of] may [lie in|lie in|〜にある|be found in|the key lies in] how we [interact with|interact with|〜と交流する|communicate with / converse with|interact with others] one another.",
     "Each time we speak with someone, our accents [imperceptibly|imperceptibly|気づかないほどに|gradually / inconspicuously / unnoticeably|change imperceptibly] [merge|merge|混ざり合う|come together / meld / blend / combine|merge together].",
     "This helps us [build rapport|build rapport|人間関係を築く|develop a relationship|build rapport] and [enhance|enhance|向上させる・よくする|improve / advance / better|enhance communication] mutual [comprehension|comprehension|理解（力）|understanding|improve comprehension], as we unconsciously [find common ground|find common ground|合意点を見出す|discover an area of agreement / reach a consensus|find common ground].",
     "As the Queen [came into contact with|come into contact with|〜と接触する・触れ合う|move in the same circles as / encounter|come into contact with] ordinary people, she picked up their accents, though we should [bear in mind|bear in mind|心に留める|keep in mind / be aware of|bear in mind] that she still spoke quite [formally|formally|正しく・明瞭に|properly / articulately|speak formally]."
   ],
   jp:"イギリス女王は極めて明確な話し方で知られた。だが微妙だが目立つ変化が、強い上流階級の発音から標準英語へと彼女のアクセントを移した。この変化は周囲の人々によってもたらされた。人は話し方で相手を階級と見なす。彼女が意識的に臣民をまねたとは考えにくく、そもそも自覚してもいなかっただろう。根本的な原因は、私たちが互いに交流する仕方にあるのかもしれない。誰かと話すたびに、アクセントは気づかないほど混ざり合う。これは人間関係を築き、相互の理解を高めるのに役立つ。無意識に合意点を見出すからだ。女王は庶民と接触するうちに彼らのアクセントを拾ったが、それでもかなり正しく話していたことは心に留めておくべきだ。"
 },
 {
   id:38, title:"バラの香り", emoji:"🌹",
   story:[
     "Roses are [celebrated|celebrated|名高い・世に知られた|well-loved / adored|a celebrated flower] for their [magnificent|magnificent|壮大な・上等の|sublime / heavenly / wonderful|a magnificent scent] [scent|scent|香り|aroma / fragrance|a sweet scent].",
     "However, [intensive|intensive|徹底的な・集中的な|thorough / vigorous|intensive breeding] breeding for colour has [deprived|deprive of|〜から…を奪う|strip of|be deprived of] many [vivid|vivid|鮮やかな|bright / brilliant / radiant|vivid colours] roses of their smell.",
     "Genetics may now [hold the key to|hold the key to|〜の鍵を握る|be fundamental to / provide the answer to|hold the key to] breeding perfect, fragrant roses that are no longer [odourless|odourless|無香の|scentless|odourless roses].",
     "In the past, growers used a slow [trial-and-error|trial-and-error|試行錯誤|hit-or-miss|a trial-and-error approach] approach that was [prohibitively|prohibitively|法外に・ひどく|excessively|prohibitively expensive] expensive.",
     "Scientists can now [map out|map out|（遺伝子を）割り出す|sequence|map out a genome] a genome, and the [price tag|the price tag|費用|cost / expense|the price tag] has dropped sharply.",
     "This [enables|enable|〜を可能にする|allow / make possible|enable scientists to] them to [pick and choose|pick and choose|選別する|designate|pick and choose genes] [individual|individual|個々の・ある特定の|certain / particular / specific|individual genes] genes and [shorten|shorten|短縮する・凝縮する|condense|shorten the time frame] the [time frame|time frame|時間（枠）|period of time / timespan|a short time frame] for breeding.",
     "Researchers have found which enzyme is [responsible for|be responsible for|〜の原因となる|be the cause of|be responsible for] the scent [released by|be released by|〜によって放たれる|be emitted by|be released by] the petals.",
     "Understanding this [process|process|過程・方法|system / way / manner|a natural process] is [vital|vital|極めて重要な|indispensable / essential|vital for reproduction] for creating the perfect rose."
   ],
   jp:"バラはその壮大な香りで名高い。しかし色を求める徹底的な品種改良が、多くの鮮やかなバラから香りを奪ってきた。遺伝学は今、無香でない香り高いバラを育てる鍵を握るかもしれない。かつて生産者は法外に高くつく試行錯誤の手法を用いた。今や科学者はゲノムを割り出せ、費用は大きく下がった。これにより個々の遺伝子を選別し、品種改良の期間を短縮できる。研究者は、花びらから放たれる香りの原因となる酵素を突き止めた。この過程の理解は、完璧なバラを作るのに極めて重要だ。"
 },
 {
   id:39, title:"ビール製造の歴史", emoji:"🍺",
   story:[
     "It is widely believed that farming let people [settle down|settle down|定住する|put down roots|settle down] and marked the [spark|spark|引き金・きっかけ|trigger|the spark for] of civilisation.",
     "But some argue beer, not bread, was the [current|current|現在の|contemporary / modern-day / modern|current thinking] reason for this shift.",
     "The [circumstantial|circumstantial|状況証拠の・間接的な|indirect|circumstantial evidence] evidence is old [relics|relic|遺物・遺構|artefact|ancient relics] that archaeologists [dug up|dig up|発掘する|uncover / unearth|dig up remains], which [appear as if|appear as if|（〜のように）見える|look as if / seem like|appear as if] they were used to brew beer.",
     "It may seem [paradoxical|paradoxical|逆説的な・矛盾した|absurd / contradictory|paradoxical but true], but beer was safer than water thanks to the antibacterial [properties|property|特性|characteristic / attribute / feature|an antibacterial property] that killed [impurities|impurity|不純物・汚染物質|contaminant|impurities in water].",
     "Beer also played a [pivotal|pivotal|極めて重要な|central / essential / principal|a pivotal role] social role, because [subservience|subservience|服従|obedience / submissiveness|subservience to a leader] to a leader was easier when alcohol could [aid|aid|助ける・促進する|assist / support|aid one another] cooperation, and problems [multiply|multiply|増える・繁殖する|reproduce|multiply quickly] when people work alone.",
     "To solve problems together, people needed to [suppress|suppress|抑える|push down / hold in check / restrain|suppress instincts] their instincts and [break free from|break free from|〜から抜け出す・自由になる|break away from / disentangle oneself from / escape from|break free from] the [constraints|constraint|制約|restriction / restraint / limitation|social constraints] of social life.",
     "Drinking lowered their [inhibitions|inhibition|抑制||lose one's inhibitions] and [social barriers|social barrier|社会的障壁|social anxiety|lower social barriers], so people could [speak their minds|speak one's mind|本音を言う|express oneself / voice one's opinion|speak one's mind] more freely."
   ],
   jp:"農耕が人々を定住させ文明の引き金になったと広く信じられている。だがパンではなくビールがこの転換の現在の理由だと主張する者もいる。状況証拠は、考古学者が発掘した古い遺物で、ビール醸造に使われたように見える。逆説的だが、ビールは水より安全だった。不純物を殺す抗菌性のおかげだ。ビールは重要な社会的役割も果たした。指導者への服従は、酒が協力を助けるとき容易になり、一人で働くと問題が増えるからだ。共に問題を解決するため、人は本能を抑え、社会生活の制約から抜け出す必要があった。飲酒は抑制と社会的障壁を下げ、人はより自由に本音を言えた。"
 },
 {
   id:40, title:"ガイ・フォークス", emoji:"🎆",
   story:[
     "On 5 November, British people [stroll around|stroll around|ぶらつく・歩き回る|wander around|stroll around town] town squares to [light|light|火をつける・燃やす|burn / set aflame / torch / set alight|light a bonfire] bonfires and remember a plot to [blow up|blow up|爆破する|destroy / bomb|blow up the building] Parliament in 1605.",
     "[Against this background|against this background|こうした状況を背景に|in the context of / against this backdrop|against this background] of religious conflict, a group of Catholics [conspired|conspire|共謀する・たくらむ|plot / collude|conspire to do] to kill the Protestant king.",
     "They [set out|set out|〜を企てる・引き受ける|undertake / endeavour|set out to do] to [explode|explode|爆発する・爆発させる|detonate / set off|detonate a bomb] a bomb during the [inaugural|inaugural|開会の|opening|the inaugural session] session of Parliament.",
     "The plotters [stocked|stock|蓄える・こっそりしまう|stockpile / stash|stock supplies] barrels of gunpowder in a cellar and [concealed|conceal|隠す|disguise / cover up / camouflage|conceal sth] them under firewood.",
     "Guy Fawkes was [tasked with|be tasked with|〜の任務を負う|be assigned to / be given responsibility for / be given charge of|be tasked with] guarding the powder, and [the authorities|the authorities|当局・官憲|law enforcement|the authorities] were [in the dark about|in the dark about|〜について知らない|ignorant of / unaware of / oblivious to|in the dark about] the [insidious|insidious|陰険な・卑劣な|cunning / sneaky / treacherous|an insidious plan] plan.",
     "Warned by a letter, someone refused to [take part in|take part in|〜に参加する|join / participate in|take part in] it, and [in the wee hours|in the wee hours|早朝に・深夜過ぎに|in the early morning hours / at dawn / at daybreak|in the wee hours] the police [arrested|arrest|逮捕する|take into custody / capture / apprehend|be arrested] Fawkes.",
     "[Defiant|defiant|反抗的な|resistant / steadfast / unwavering|defiant at first] at first, he [eventually|eventually|ついに・結局は|ultimately / in the end|eventually] [confessed to|confess to|〜を認める・白状する|admit to|confess to] the plot, and people still [commemorate|commemorate|祝う・記念する|observe / celebrate|commemorate an event] the night today."
   ],
   jp:"11月5日、イギリスの人々は広場をぶらつき、かがり火をたいて、1605年に議会を爆破しようとした陰謀を思い出す。宗教対立を背景に、カトリックの一団がプロテスタントの王を殺そうと共謀した。彼らは議会の開会中に爆弾を爆発させようと企てた。陰謀者は地下に火薬の樽を蓄え、薪の下に隠した。ガイ・フォークスは火薬を守る任務を負い、当局はこの陰険な計画について知らなかった。手紙で警告され、ある者が参加を拒み、深夜過ぎに警察はフォークスを逮捕した。当初は反抗的だったが、彼はついに陰謀を白状し、人々は今もその夜を記念している。"
 },
{
   id:41, title:"巨大空港", emoji:"🛫",
   story:[
     "Flying is an efficient [means of|means of|〜の手段|mode of / method of|a means of transport] travelling long distances, and passenger numbers have [gone through the roof|go through the roof|天井知らずに上がる|shoot up / skyrocket / soar|prices go through the roof].",
     "Most journeys [pass through|pass through|通過する|proceed through|pass through security] a major hub run by a [network|network|網状組織・提携|alliance / association|a network of airlines] of airlines.",
     "To cope, airports have [undergone|undergo|経験する|go through / experience|undergo change] rapid expansion, becoming [miniature|miniature|超小型の|small-scale / mini|a miniature city] cities that ease [congestion|congestion|渋滞・混雑|clog / jam / bottleneck|traffic congestion].",
     "Dubai's [newly-minted|newly-minted|真新しい|brand new|a newly-minted airport] mega-airport is expected to [conclude|conclude|終える・完成させる|wrap up / finish up|conclude soon] soon and handle a [mind-boggling|mind-boggling|びっくりするほどの|stunning / staggering|a mind-boggling number] number of passengers, so as to [fulfil demand|fulfil demand|需要を満たす|meet demand / satisfy demand|fulfil demand].",
     "Their [facilities|facility|設備・施設|amenity|airport facilities] are becoming [lavish|lavish|贅沢な|grand / opulent / extravagant|a lavish design], with casinos and malls on the [premises|premises|敷地・構内|grounds|on the premises].",
     "As this [urban sprawl|urban sprawl|都市の膨張|suburban sprawl / suburbanisation|urban sprawl] grows, [friction|friction|摩擦・あつれき|tension / discontent / discord|cause friction] with locals can [overload|overload|過剰な負担をかける|overwhelm / overburden|overload the system] resources.",
     "Airports also enter [direct|direct|直接の・直接対決の|head-to-head / head-on|direct competition] [competition|competition|競争|rivalry / contention|intense competition] with local businesses."
   ],
   jp:"飛行機は長距離移動の効率的な手段で、乗客数は天井知らずに増えてきた。ほとんどの旅は航空会社の連合が運営する主要拠点を通過する。対応するため空港は急拡大し、混雑を和らげる小型都市のようになった。ドバイの真新しい巨大空港は間もなく完成予定で、驚異的な数の乗客をさばき、需要を満たす。その施設は贅沢になり、敷地内にカジノやモールがある。この都市膨張が進むと、地元との摩擦が資源に過剰な負担をかけうる。空港は地元企業とも直接競争に入る。"
 },
 {
   id:42, title:"英仏海峡トンネル", emoji:"🚇",
   story:[
     "In 1802 a French engineer first [aimed at|aim at|〜を目指す|set one's sights on|aim at doing] building a tunnel under the English Channel and [envisaged|envisage|想像する|envision / imagine / visualise|envisage a future] horse-drawn carriages inside it.",
     "He [submitted a proposal|submit a proposal|提案書を提出する|tender a proposal / put forward a plan|submit a proposal], but the government [abandoned|abandon|断念する|discard / withdraw|abandon a plan] it.",
     "In 1985, banks and construction firms [took up the baton|take up the baton|責任を引き受ける|take responsibility / accept responsibility|take up the baton] as a [commercial venture|commercial venture|商業的な事業|money-making enterprise|a commercial venture].",
     "They began to [measure|measure|測定する・評価する|evaluate / calculate / judge|measure the depth] the [depth|depth|深さ|deepness|the depth of] of the channel, aiming for a 1993 [deadline|deadline|締切・期限|target date|meet a deadline], and had to [exercise patience|exercise patience|我慢する|show patience / exhibit patience|exercise patience] as work did not [commence|commence|始める・着手する|initiate / start up / launch|commence work] until 1988.",
     "Boring machines with [rotating|rotate|回転する|revolve / spin|rotate quickly] blades were used to [cut through|cut through|〜を切り開く|bore through / drill through|cut through rock] the rock, where many [obstacles|obstacle|障害（物）|obstruction / blockage|overcome an obstacle] made the work [arduous|arduous|困難な・骨の折れる|gruelling / laborious|an arduous task].",
     "Problems [cropped up|crop up|突然現れる|arise / emerge|problems crop up], and [escalating costs|escalating cost|増大するコスト|rising expenditure|escalating costs] caused [setbacks|setback|障害・つまずき|stumbling block / hurdle / difficulty|a major setback] and [delayed|delay|遅らせる|postpone / put off / push back|delay the start] construction.",
     "Finally, an English tunneller and his French [counterpart|counterpart|対応する人（もの）|equivalent / opposite number|his counterpart] met in the tunnel, [bringing it to completion|bring to completion|〜を終わらせる|wrap up|bring to completion]."
   ],
   jp:"1802年、フランス人技師が英仏海峡の下にトンネルを掘ることを初めて目指し、中を馬車が通る様子を想像した。彼は提案書を提出したが、政府は断念した。1985年、銀行と建設会社が商業的事業として責任を引き受けた。彼らは海峡の深さを測定し始め、1993年の締切を目指し、着工が1988年までずれ込む中で我慢を強いられた。回転する刃を持つ掘削機で岩を切り開いたが、多くの障害が作業を困難にした。問題が突然現れ、増大するコストがつまずきを生み、工事を遅らせた。ついに英国の掘削者とフランス側の相手役がトンネル内で出会い、工事を完成させた。"
 },
 {
   id:43, title:"イギリス人の外国語習得", emoji:"🗣️",
   story:[
     "As the [pace|pace|速度・ペース|speed / tempo / rate|the pace of change] of global business [quickens|quicken|速める|accelerate / speed up|quicken the pace], learning a foreign language [grows in importance|grow in importance|〜が増大する|escalate in / heighten in / increase in|grow in importance].",
     "Employees who speak another language are [in demand|be in demand|需要がある|be sought after|be in demand], because it [opens up|open up|〜を切り開く・創出する|create|open up markets] new [channels|channel|ルート・手段|means / gateway / pathway|a channel to success] of [communication|communication|意思疎通・情報交換|exchanging information|improve communication].",
     "They can understand cultural norms and avoid [inappropriate|inappropriate|不適当な|improper / unsuitable|inappropriate behaviour] behaviour abroad.",
     "To [acquire fluency in|acquire fluency in|〜を流暢に話せるようになる|master / be proficient in|acquire fluency in] a language can [give|give an edge|優位に立たせる|provide an advantage / give the upper hand|give sb an edge] a person an edge, yet British people are among the most [dismal|dismal|みじめな・散々な|awful / terrible / appalling|a dismal result] learners.",
     "In school, exams are the [immediate priority|immediate priority|最優先事項|first concern|an immediate priority], so students do not [appreciate|appreciate|〜に感謝する|be grateful for / be thankful for|appreciate the chance] the [usefulness|usefulness|有用性|utility / practicality|the usefulness of] of other languages and simply [switch off|switch off|集中力が切れる|stop paying attention / zone out|switch off].",
     "[In response to|in response to|〜に応じて・反応して|in answer to / in reaction to|in response to] this, local authorities changed their [objective|objective|目的・目標|aim / goal / target|the objective of] to [engage|engage|参加させる・引きつける|motivate / stimulate|engage students] children earlier, so they are not [deterred|deter|思いとどまらせる|discourage / dissuade|deter sb from] from the skill."
   ],
   jp:"世界のビジネスの速度が速まるにつれ、外国語の習得は重要性を増す。別の言語を話せる社員は需要があり、それが新しい意思疎通のルートを切り開くからだ。彼らは文化的規範を理解し、海外で不適切な振る舞いを避けられる。言語を流暢に話せると優位に立てるが、イギリス人は最も散々な学習者の一つだ。学校では試験が最優先事項で、生徒は他言語の有用性に感謝せず、ただ集中を切らす。これに応じて、地方当局は目標を変え、子どもをより早く引きつけ、この技能から思いとどまらせないようにした。"
 },
 {
   id:44, title:"グレートバリアリーフ", emoji:"🐠",
   story:[
     "The Great Barrier Reef supports a [whole array of|whole array of|ありとあらゆる|wide variety of|a whole array of] [marine|marine|海洋の|aquatic|marine life] life and a [wealth of|wealth of|豊富さ|abundance of / bounty of|a wealth of] coral.",
     "When oil from tour boats [breaks off|break off|折り取る|snap off|break off] and [saturates|saturate|染み込む・満たす|permeate / suffuse|be saturated with] the water, it can [block|block from|〜が…するのを阻む|prevent from|block sth from] sunlight from reaching the coral and [come to rest on|come to rest on|〜のところで止まる|settle on / descend onto|come to rest on] it.",
     "By 2017 the reef was [in bad shape|in bad shape|悪い状態で|in a sorry state|be in bad shape], and years of [neglect|neglect|無視・無関心|indifference / apathy / carelessness|neglect] had hurt its [attractiveness|attractiveness|魅力|allure / attraction|the attractiveness of].",
     "The wonder is [under threat|under threat|危機にひんして|at risk / in harm's way|be under threat] unless people [take measures|take measures|対策を取る|take action / mount a response|take measures].",
     "Still, there may be a [light at the end of the tunnel|light at the end of the tunnel|希望の光|cause for optimism / reason for hope|a light at the end of the tunnel]: the government [pledged|pledge|固く約束する|give one's word / commit / vow|pledge to do] money to [address|address|対処する|deal with / focus on / attend to|address a problem] the [current state of affairs|current state of affairs|現状|status quo / current situation|the current state of affairs].",
     "Officials aim to [limit|limit|制限する|restrict / put a quota on|limit numbers] visitors, though making the reef too [exclusive|exclusive|排他的な|restrictive / exclusionary / selective|an exclusive destination] is a risk.",
     "The goal is a [sustainable|sustainable|持続可能な|tenable / viable|a sustainable approach] approach so the reef can [spring back|spring back|立ち直る|bounce back / rebound / revive|spring back], though the survival of this remarkable place remains [tenuous|tenuous|薄っぺらい・希薄な|shaky|a tenuous grasp]."
   ],
   jp:"グレートバリアリーフはありとあらゆる海洋生物と豊富なサンゴを支える。観光船の油が折れて水に染み込むと、日光がサンゴに届くのを阻み、その上に止まりうる。2017年までにサンゴ礁は悪い状態になり、長年の無視がその魅力を損なった。対策を取らなければこの驚異は危機にひんしている。それでも希望の光はある。政府は現状に対処するため資金を約束した。当局は訪問者を制限しようとするが、リーフを排他的にしすぎるのは危険だ。目標は持続可能な方法で、リーフが立ち直れるようにすることだが、この稀有な場所の存続は依然として希薄だ。"
 },
 {
   id:45, title:"睡眠の大切さ", emoji:"😴",
   story:[
     "In our [fast-paced|fast-paced|テンポの早い|rapidly changing / fast-moving|a fast-paced world] world, a full night's sleep is often [undervalued|undervalue|過小評価する|underappreciate / fail to appreciate|undervalue sth].",
     "Only a third of adults in the [developed world|developed world|先進国|first world / industrialised world|the developed world] get the eight hours [required|required|必須の|requisite / necessary|required for health] for good health.",
     "Some [get by|get by|どうにかやっていく|cope / survive / manage|get by] on coffee, but trying to run on too little sleep is [doomed to fail|be doomed to fail|失敗する運命にある|be destined to fail|be doomed to fail], and caffeine can [disrupt|disrupt|中断させる・混乱させる|upset / disturb|disrupt sleep] the rest we do get.",
     "We [pay a high price|pay a high price|大きな代償を払う|suffer the consequences / pay a heavy price|pay a high price] for poor sleep [habits|habit|習慣・日課|routine|a daily habit].",
     "Dr Matthew Walker [extols the virtues of|extol the virtues of|〜を賞め讃える|sing the praises of|extol the virtues of] sleep, which can [reinvigorate|reinvigorate|活力を与える|revitalise / refresh|reinvigorate the body] the brain, while a lack of it [impairs|impair|損なう|harm / hinder / undermine|impair ability] our ability to [perform to certain standards|perform to certain standards|基準に達する|measure up / pass muster|measure up].",
     "Sleep deprivation is a [major concern|major concern|大きな懸念事項|matter of great concern / serious issue|a major concern] that [places|place at risk|危険にさらす|endanger / put in danger|place sb at risk] tired drivers at risk, and [insufficient|insufficient|不十分な|inadequate / deficient|insufficient sleep] sleep may [contribute to|contribute to|〜を引き起こす|be somewhat responsible for|contribute to] disease.",
     "Given the [ubiquity|ubiquity|どこにでもあること|pervasiveness / prevalence / widespread presence|the ubiquity of] of screens, it is [imperative|imperative|緊急の|urgent / pressing|it is imperative that] that we [pay attention to|pay attention to|〜に注意を払う|listen to|pay attention to] our body clocks rather than staying up [at the expense of|at the expense of|〜を犠牲にして|at the cost of / at the price of|at the expense of] our health."
   ],
   jp:"テンポの早い現代社会では、十分な睡眠はしばしば過小評価される。先進国で健康に必要な8時間の睡眠を取る大人は3分の1だけだ。コーヒーでどうにかやっていく人もいるが、少なすぎる睡眠で走ろうとするのは失敗する運命にあり、カフェインは得られる休息を妨げる。私たちは睡眠習慣の悪さに大きな代償を払う。マシュー・ウォーカー博士は睡眠を賞め讃える。睡眠は脳に活力を与え、不足は基準に達する能力を損なう。睡眠不足は大きな懸念事項で、疲れた運転手を危険にさらし、不十分な睡眠は病気を引き起こしうる。画面がどこにでもある今、健康を犠牲にして夜更かしするより、体内時計に注意を払うことが緊急に必要だ。"
 },
 {
   id:46, title:"シェイクスピア", emoji:"🎭",
   story:[
     "Shakespeare's plays are [admired|admire|称賛する|hail / hold in high regard|admire sb] the world over, but some [sceptics|sceptic|懐疑論者|naysayer / disbeliever / doubter|a sceptic] are [dubious|dubious|疑わしい・半信半疑の|doubtful / sceptical|be dubious about] about the authorship.",
     "They doubt a glove maker's son could have [penned|pen|書く・執筆する|compose / author|pen a play] such [intricate|intricate|複雑な・入り組んだ|elaborate / sophisticated|intricate language] language or shown such [intimate|intimate|内密の・直接の|behind the scenes / first-hand|intimate knowledge] knowledge of the court.",
     "Some claim the plays were written by a noble using a [pseudonym|pseudonym|ペンネーム・仮名|alias / pen name|use a pseudonym], and that Shakespeare was a [hoax|hoax|でっち上げ・ごまかし|deception|a hoax].",
     "This theory may rest on a class [bias|bias|偏見|bigotry / prejudice|class bias] and a [flaw|flaw|欠陥・弱点|failing / weakness|a flaw in]: it does not [take into consideration|take into consideration|〜を考慮に入れる|take into account|take into consideration] his education.",
     "Scholars found a more [comprehensive|comprehensive|包括的な・広範囲の|exhaustive / far-reaching / sweeping|comprehensive research] way to settle the [guesswork|guesswork|当て推量・憶測|conjecture / speculation|pure guesswork] and give a [definitive|definitive|決定的な|clear-cut / categorical / unambiguous|definitive proof] answer, so as to [reject|reject|拒否する|dismiss / repudiate / discredit|reject a theory] the doubters' claim.",
     "Stylometry studies the [frequency|frequency|頻度|regularity / repetition|the frequency of] of words to [accurately|accurately|正確に|precisely / reliably|accurately attribute] a text and check its [authenticity|authenticity|本物であること|genuineness|the authenticity of].",
     "After [subjecting|subject to scrutiny|精査する|examine / scrutinise|subject sth to scrutiny] the plays to scrutiny and [overlaying|overlay|重ね合わせる|superimpose|overlay data] the data, it is clear Shakespeare did write them."
   ],
   jp:"シェイクスピアの戯曲は世界中で称賛されているが、作者について半信半疑の懐疑論者もいる。彼らは、手袋職人の息子がこれほど複雑な言葉や宮廷の内密の知識を書けたのか疑う。貴族がペンネームで書き、シェイクスピアはでっち上げだと主張する者もいる。この説は階級的偏見と、彼の教育を考慮に入れない欠陥に基づくのかもしれない。学者は当て推量を決着させ決定的な答えを出すより包括的な方法を見つけ、疑う者の主張を拒否した。計量文献学は語の頻度を調べて文章を正確に帰属させ、その真正性を確かめる。戯曲を精査しデータを重ね合わせた結果、シェイクスピアが確かに書いたことは明らかだ。"
 },
 {
   id:47, title:"リチャード三世", emoji:"♚",
   story:[
     "King Richard III is popularly seen as a [ruthless|ruthless|無慈悲な|cutthroat / heartless / unforgiving|a ruthless ruler] and [jealous|jealous|嫉妬深い|envious|jealous of] ruler who [confined|confine|監禁する|lock up / incarcerate / imprison|confine sb] and murdered his nephews to [seize|seize|つかむ・手に入れる|take hold of|seize power] power.",
     "Shakespeare [characterised|characterise as|〜として描く|portray as / depict as|be characterised as] him as a villain who was [willing|willing|〜する意思がある|prepared / inclined|be willing to] to do anything, and it is [rumoured|be rumoured|うわさされている|be reputed / be reported|be rumoured to] that his [corpse|corpse|死体|cadaver / body / remains|a corpse] was thrown into a river.",
     "Yet some scholars now [rethink|rethink|考え直す|reconsider / take another look at / re-examine|rethink sth] the story of his [downfall|downfall|失脚・没落|ruin / collapse|the downfall of].",
     "They feel the play [omits|omit|〜を除外する|exclude / leave out|omit sth] his [loyalty|loyalty|忠誠|fidelity / allegiance / fealty|loyalty to] and [faithful|faithful|忠実な|loyal / dutiful|a faithful servant] [stewardship|stewardship|管理・運営|management / administration / supervision|stewardship of] of England.",
     "[In retrospect|in retrospect|今にして思えば|in hindsight / looking back|in retrospect], he may not have been a villain, but a product of his [turbulent|turbulent|不安定な・無法の|chaotic / lawless|turbulent times] times.",
     "Scholars [poured time and money into|pour time and money into|〜に時間とお金をつぎ込む|devote time and money to / commit time and money to|pour time and money into] the search to [untangle|untangle|解き明かす|clear up / straighten out / solve|untangle a mystery] the mystery of his death [once and for all|once and for all|きっぱりと|at long last / conclusively|once and for all].",
     "They were [taken aback|be taken aback|驚く|be astonished / be speechless|be taken aback] to find his skeleton in a [grave|grave|墓|burial site / tomb / final resting place|a grave] under a car park."
   ],
   jp:"リチャード三世は、権力をつかむため甥を監禁し殺した無慈悲で嫉妬深い王として一般に見られている。シェイクスピアは彼を何でもする悪人として描き、その死体は川に投げ込まれたとうわさされる。だが一部の学者は今、彼の没落の物語を考え直している。劇は彼の忠誠と忠実なイングランド統治を除外していると彼らは感じる。今にして思えば、彼は悪人ではなく不安定な時代の産物だったのかもしれない。学者は彼の死の謎をきっぱり解き明かそうと時間とお金をつぎ込んだ。そして駐車場の下の墓で骸骨を見つけ、驚いた。"
 },
 {
   id:48, title:"組織市民行動", emoji:"🤝",
   story:[
     "In daily [interactions|interaction|交流・やり取り|dealing / encounter|social interaction] at work, co-workers help each other in small ways that are not [acknowledged|acknowledge|認める・気づく|recognise / note / notice|acknowledge sb] by [superiors|superior|上司・上位の人|supervisor / person higher up the pecking order|one's superior] through an [explicit|explicit|明確な|specific / unambiguous / unequivocal|an explicit reward] reward.",
     "By [going above and beyond|go above and beyond|期待をはるかに上回る|exceed expectations / go the extra mile|go above and beyond], they help colleagues [overcome|overcome|克服する|surmount|overcome obstacles] difficulties and [pass on|pass on|伝える|convey / deliver|pass on information] useful ideas.",
     "This 'organisational citizenship behaviour' gives [insight|insight|見識・理解|awareness / comprehension|gain insight] and can [strengthen|strengthen|強化する|bolster / build up / reinforce|strengthen bonds] bonds and boost [fulfilment|fulfilment|達成感・満足|gratification / contentment|a sense of fulfilment].",
     "Although it sounds like a management [buzzword|buzzword|流行語・専門用語|catchphrase|a buzzword], it is real; reacting to [complaints|complaint|苦情|protest / objection|make a complaint] as [a matter of course|a matter of course|当然のこと|run-of-the-mill / par for the course|as a matter of course] improves the [atmosphere|atmosphere|雰囲気・気分|mood|a positive atmosphere] and the [perception|perception|見方・印象|impression / opinion|the perception of] of a company.",
     "Such [discretionary|discretionary|任意の|optional / voluntary|discretionary behaviour] behaviour [promotes|promote|促進する|advance / further / push|promote sth] efficiency and brings [numerous|numerous|多くの|abundant / multiple / copious|numerous benefits] benefits.",
     "[Subordinates|subordinate|部下・下位の人|lower-ranking person / person lower down the pecking order|a subordinate] do not feel like a single cog in a [vast|vast|広大な・莫大な|enormous / mammoth / tremendous|a vast gap] machine, but part of a [supportive|supportive|支援する・協力的な|encouraging|a supportive family] family."
   ],
   jp:"職場での日々のやり取りの中で、同僚は明確な報酬を通じてではなく、小さなことで助け合う。期待をはるかに上回ることで、彼らは同僚が困難を克服するのを助け、有用な考えを伝える。この『組織市民行動』は見識を与え、結束を強め、達成感を高めうる。経営の流行語のようだが実在し、苦情に当然のこととして対応することは会社の雰囲気と見方を改善する。こうした任意の行動は効率を促進し、多くの利点をもたらす。部下は広大な機械の一つの歯車ではなく、協力的な家族の一員だと感じる。"
 },
 {
   id:49, title:"ウィキペディア", emoji:"📚",
   story:[
     "Daniel Pink, an author who [specialises in|specialise in|〜を専門に扱う|concentrate on / focus on|specialise in] motivation, has an [anecdote|anecdote|逸話・説明|account / description|an anecdote about] about what [energises|energise|活気づける|drive / motivate|energise people] people.",
     "He compares the [timeline|timeline|時系列・年表|chronology / history|a timeline of] of two encyclopedias that began at the [height|height|頂点・絶頂|peak / zenith|the height of] of the tech boom.",
     "One was [for all intents and purposes|for all intents and purposes|事実上|in essence / in practice|for all intents and purposes] a monopoly, while the other [accumulated|accumulate|蓄積する|amass / collect|accumulate knowledge] information from volunteers in the [pursuit of|pursuit of|〜の追求|hunt for / quest for|the pursuit of] shared knowledge.",
     "Everyone [presupposed|presuppose|〜を当然と思う|assume / presume / take for granted|presuppose that] that the [excellence|excellence|優れていること|superiority / supremacy|excellence in] of the first would [tip the balance|tip the balance|形勢を一方に傾ける|tilt the scales|tip the balance] in its favour.",
     "However, something [perplexing|perplexing|不可解な・当惑させる|baffling / mystifying / puzzling|a perplexing problem] happened: users [flocked to|flock to|〜に群がる|stream to / swarm to|flock to] the free Wikipedia, and the firm [conceded defeat|concede defeat|敗北を認める|give in / give up / surrender|concede defeat] and [shut its doors|shut one's doors|廃業する|close up shop / go out of business|shut one's doors].",
     "Wikipedia was a [trailblazer|trailblazer|先駆者|innovator / pioneer / groundbreaker|a trailblazer] and a [testimony to|testimony to|〜の証拠|testament to / tribute to|a testimony to] the spirit of volunteering.",
     "[Unpaid|unpaid|無報酬の|uncompensated|unpaid work] editors [screen out|screen out|〜を除外する|filter out|screen out errors] [errors|error|間違い|inaccuracy / blunder|spot an error] and look for [suitable|suitable|適切な|appropriate / acceptable|a suitable source] sources."
   ],
   jp:"動機づけを専門に扱う著者ダニエル・ピンクは、人を活気づけるものについての逸話を持つ。彼は、テックブームの絶頂に始まった二つの百科事典の時系列を比較する。一つは事実上の独占で、もう一つは共有知識の追求のためボランティアから情報を蓄積した。誰もが最初のものの優秀さが形勢を有利に傾けると当然視した。だが不可解なことが起きた。利用者は無料のウィキペディアに群がり、企業は敗北を認めて廃業した。ウィキペディアは先駆者であり、ボランティア精神の証拠だ。無報酬の編集者が間違いを除外し、適切な情報源を探す。"
 },
 {
   id:50, title:"海をきれいに", emoji:"🌊",
   story:[
     "Our oceans are being [inundated|inundate|押し寄せる|overwhelm|be inundated with] with plastic, and the problem is especially [acute|acute|深刻な|severe / intense|an acute problem] in ocean currents called gyres.",
     "It is hard to [quantify|quantify|定量化する|calculate / measure|quantify sth], but the best [educated guess|educated guess|知識に基づく推測|approximation / estimation|an educated guess] is that the patch holds five trillion pieces.",
     "Plastic bags are the main [culprits|culprit|犯人・元凶|offender|the main culprit], and fish that eat them cause a [knock-on effect|knock-on effect|波及効果・連鎖反応|indirect effect|a knock-on effect] up the food chain.",
     "[Traces|trace|痕跡・残留物|residue / vestige|traces of] of [toxic|toxic|有毒な|poisonous / noxious|toxic waste] chemicals from the plastic [end up|end up|結局〜になる|finish up / wind up|end up in the ocean] in the fish we eat.",
     "Cleaning up with nets is [outdated|outdated|時代遅れの|old-fashioned / obsolete / outmoded|outdated ideas], as ships have to [zigzag|zigzag|ジグザグに進む|weave|zigzag through] the water in a [fruitless|fruitless|無益な|ineffectual / futile / pointless|a fruitless exercise], likely [irreversible|irreversible|取り返しがつかない|irrevocable|irreversible damage] task.",
     "A teenager named Boyan Slat was [frustrated|be frustrated|あきれる・いらだつ|be dissatisfied / be fed up|be frustrated] by this [dearth of|dearth of|〜の欠乏|absence of / deficiency of / lack of|a dearth of] [practical|practical|実現性のある|workable / realistic / doable|a practical solution] solutions.",
     "He invented a [buoyant|buoyant|浮力のある・浮く|floatable / floating|buoyant material] boom that lets the sea gather the plastic, and a [field test|field test|実地試験|beta test / real-world test|a field test] of the [prototype|prototype|試作品|mock-up|a prototype] was a [resounding success|resounding success|大成功|roaring success / complete success|a resounding success].",
     "It is hoped that [under|under circumstances|状況下で|given conditions|under the right circumstances] the right circumstances, the oceans may be plastic-free by 2050."
   ],
   jp:"私たちの海はプラスチックで押し寄せられており、環流と呼ばれる海流で特に深刻だ。定量化は難しいが、最良の知識に基づく推測では、そのごみの塊は5兆個の破片を含む。レジ袋が主な元凶で、それを食べる魚は食物連鎖を上って波及効果を生む。プラスチックの有毒な化学物質の痕跡は、私たちが食べる魚に結局入り込む。網での清掃は時代遅れで、船は水中をジグザグに進む無益で、おそらく取り返しのつかない作業になる。ボイヤン・スラットという10代の若者は、実現性のある解決策の欠乏にいらだった。彼は海がプラスチックを集められる浮力のあるブームを発明し、その試作品の実地試験は大成功だった。適切な状況下なら、2050年までに海はプラスチックのない状態になると期待されている。"
 },
{
   id:51, title:"カラスの道具作り", emoji:"🐦‍⬛",
   story:[
     "Besides humans, the New Caledonian crow makes and improves its own [implements|implement|道具|instrument / tool|a useful implement], much like a human [craftsman|craftsman|職人|artisan|a skilled craftsman] who [carves|carve|削る・彫る|sculpt / shape / whittle|carve a tool] tools.",
     "In 2002, biologists filmed a crow bending a twig into a hook to [retrieve|retrieve|回収する・取り出す|fetch / obtain|retrieve food] an [anticipated|anticipated|予期された|expected|an anticipated reward] reward.",
     "This [astounding|astounding|信じがたい・驚くべき|hard to believe / almost beyond belief|astounding behaviour] behaviour is actually [commonplace|commonplace|ありふれた・普通の|prevalent|commonplace amongst crows] among these birds.",
     "There is a [long-simmering|long-simmering|長年くすぶり続けている|long-standing / age-old|a long-standing debate] debate over whether the skill is [inherent|inherent|生来の・先天的な|hard-wired / genetic|an inherent skill] or learned.",
     "In an Oxford [experiment|experiment|調査・研究|investigation / study|conduct an experiment], scientists learned the [tricks of the trade|tricks of the trade|専門的な技術|know-how / bag of tricks / stratagem|the tricks of the trade] by [deliberately|deliberately|故意に・わざと|intentionally / purposely / consciously|deliberately do sth] keeping some crows [apart|keep apart|引き離しておく|isolate / set apart / segregate|keep apart].",
     "Birds [in the presence of|in the presence of|〜の面前で|in the company of / in the midst of|in the presence of] more [knowledgeable|knowledgeable|博識な|experienced / seasoned|a knowledgeable person] crows learned faster than [naive|naive|経験に欠けた|inexperienced / green|a naive pair] ones, seeming to [take their cues from|take one's cues from|〜からヒントを得る|be influenced by / imitate|take cues from] the [old hands|old hand|熟練者|old pro / expert|an old hand].",
     "Driven by [curiosity|curiosity|好奇心|inquisitiveness|natural curiosity], a crow can store a [visual|visual|視覚の|optical|visual memory] memory and later [recreate|recreate|再現する|reproduce / reconstruct|recreate sth] a useful tool from it."
   ],
   jp:"人間以外で唯一、道具を作り改良するのがカレドニアガラスで、道具を彫る職人のようだ。2002年、生物学者は小枝を鉤状に曲げて予期した報酬を取り出すカラスを撮影した。この信じがたい行動は実はこれらの鳥ではありふれている。この能力が生来のものか学習かは長年くすぶり続ける議論だ。オックスフォードの実験で、科学者は一部のカラスをわざと引き離して専門的な技術を学んだ。博識なカラスの面前にいる鳥は経験の浅い鳥より速く学び、熟練者からヒントを得ているようだった。好奇心に駆られ、カラスは視覚的な記憶を蓄え、後でそこから役立つ道具を再現できる。"
 },
 {
   id:52, title:"遺伝子操作", emoji:"🧫",
   story:[
     "Editing genes, once an [abstract|abstract|理論上の|theoretical / conceptual / academic|an abstract concept] concept, is now real thanks to CRISPR, which makes [adjustments|adjustment|調整・変更|alteration / modification|make an adjustment] to the [intertwined|intertwined|絡み合った|interlaced / interlinked|intertwined strands] strands of DNA.",
     "The possible uses are [fascinating|fascinating|魅力的な|captivating / intriguing|a fascinating idea]: it could [stop|stop in one's tracks|直ちに〜を止める|block / halt|stop sth in its tracks] diseases that [afflict|afflict|苦しめる・悩ます|cause suffering to / strike / harm|afflict children] children.",
     "Scientists [aspire|aspire|目指す|aim / hope|aspire to do] to [put an end to|put an end to|〜を終わらせる|eliminate / bring an end to|put an end to] mortality from disease, and to help [infertile|infertile|不妊の|sterile / barren|infertile women] women have children.",
     "It could also [extend|extend|延ばす・伸ばす|expand / prolong|extend lifespan] life by boosting the body's [capacity|capacity|能力・可能性|potential / capability|the capacity to] for repair, so gene editing seems to be [the way forward|the way forward|今後の道筋|the wave of the future|the way forward].",
     "But there are [downsides|downside|マイナス面|drawback / minus / snag|the downside of], and the [worst-case scenario|worst-case scenario|最悪のシナリオ|worst possible outcome|the worst-case scenario] is that we [face|face|直面する|confront|face challenges] a new [epidemic|epidemic|病気の蔓延|plague / contagion / outbreak of disease|an epidemic].",
     "Altered DNA could [spell|spell|（悪い結果を）招く・示す|signal / indicate / portend|spell disaster] disaster for [humanity|humanity|人類|the human race / humankind / mankind|the future of humanity].",
     "So a [government body|government body|政府機関|the authorities / government agency / the powers-that-be|a government body] needs to [set restrictions|set a restriction|制限を設ける|draw a line / establish a boundary / set a limit|set restrictions] to make sure the industry [does everything by the book|do by the book|規則に従って行う|do by the numbers / follow the letter of the law|do everything by the book]."
   ],
   jp:"かつて理論上の概念だった遺伝子編集は、CRISPRのおかげで現実になった。CRISPRは絡み合ったDNAの鎖に調整を加える。その用途は魅力的で、子どもを苦しめる病気を止められるかもしれない。科学者は病気による死をなくし、不妊の女性が子を持てるよう目指す。修復能力を高めて寿命を延ばすこともでき、遺伝子編集は今後の道筋に見える。だがマイナス面もあり、最悪のシナリオは新たな蔓延に直面することだ。改変されたDNAは人類に災いを招きうる。だから政府機関は制限を設け、この産業がすべて規則通りに行うようにする必要がある。"
 },
 {
   id:53, title:"3Dプリンター", emoji:"🖨️",
   story:[
     "Building a house with bricks can [cost an arm and a leg|cost an arm and a leg|大金がかかる|cost a fortune|cost an arm and a leg], a problem [compounded|compound|悪化させる|magnify / exacerbate / intensify|compound a problem] by a [shortage of|shortage of|〜の不足|scarcity of / deficiency in the number of|a shortage of] bricklayers.",
     "Concrete buildings are often [banal|banal|平凡な・つまらない|bland / mundane|banal design] and [devoid of|devoid of|〜を欠いた|completely lacking in / bereft of|devoid of] artistic excellence, but a new [gadget|gadget|道具・装置|gizmo|a handy gadget] offers a solution: 3D printers.",
     "The first printer was an [abject failure|abject failure|全くの失敗|complete bomb / unmitigated disaster|an abject failure] in 1983, but the technology now advances [at breakneck speed|at breakneck speed|猛烈なスピードで|at a whirlwind pace / at full tilt|at breakneck speed].",
     "Printers can make a [facsimile|facsimile|複製・写し|replica / carbon copy / duplicate|a carbon copy] of [everyday|everyday|毎日の・日常の|commonplace / familiar|everyday objects] objects by [laying down|lay down|横たえる・置く|place|lay down a layer] one thin [slice|slice|薄片・薄切り|sliver|a slice of] of plastic after another, with a [high degree of|high degree of|高度の〜|considerable amount of / high level of|a high degree of] accuracy.",
     "A Dutch firm has [unveiled|unveil|発表する・公表する|reveal / debut|unveil sth] printers that can build houses, [embellish|embellish|装飾する|decorate / adorn / ornament|embellish a house] them with intricate designs and [personalise|personalise|個人向けに変える|customise / individualise|personalise sth] each one, [made to measure|made to measure|あつらえで作った|custom-made / tailor-made|made to measure].",
     "The low cost lets planners renew [dilapidated|dilapidated|荒廃した|run-down / crumbling / seedy|dilapidated areas] areas cheaply.",
     "The next [phase|phase|段階|stage|the first phase] is to [scale up|scale up|〜を拡大させる|ratchet up|scale up production] the [operation|operation|操業・事業|enterprise|scale up the operation] and export the printers worldwide."
   ],
   jp:"レンガで家を建てると大金がかかり、レンガ職人の不足がこの問題を悪化させる。コンクリートの建物はしばしば平凡で芸術性を欠くが、新しい装置がその解決策を示す。3Dプリンターだ。最初のプリンターは1983年には全くの失敗だったが、技術は今や猛烈な速さで進歩する。プリンターは日常品の複製を、薄い層を一枚ずつ横に重ねて高い精度で作れる。オランダの会社は、家を建て、精巧なデザインで装飾し、それぞれをあつらえで個人向けに変えるプリンターを発表した。低コストのおかげで、計画者は荒廃した地域を安く一新できる。次の段階は操業を拡大し、プリンターを世界に輸出することだ。"
 },
 {
   id:54, title:"スポーツにおけるファン心理", emoji:"🏟️",
   story:[
     "There are [various|various|様々な|assorted / varied / miscellaneous|various reasons] reasons people love sport, such as sharing support with [like-minded|like-minded|同じ考えの|similar-thinking|like-minded people] fans.",
     "Others [experience chills|experience chills|興奮する|get goosebumps|experience chills] and enjoy the [suspense|suspense|緊張感・スリル|thrill / buzz|a sense of suspense] of competition.",
     "Scientists now [zero in on|zero in on|〜に注意を集中する|home in on / direct one's attention towards|zero in on] a deeper reason: tribalism, which acts [subconsciously|subconsciously|潜在意識で|subliminally|act subconsciously] as a [proxy for|proxy for|〜の代わりになるもの|substitute for / alternative to|a proxy for] fighting another group.",
     "It is human [nature|nature|性質・本性|character / disposition|human nature] to want our team to win, and if they are [beaten|beat|負かす|defeat / best|beat a team], we [distance ourselves from|distance oneself from|〜から自分を遠ざける|disassociate oneself from|distance oneself from] them.",
     "Our social [status|status|地位・立場|standing / position / rank|social status] seems to depend on the team's [victory|victory|勝利|triumph|a great victory].",
     "[Empathy|empathy|共感・親近感|affinity / kinship|feel empathy] [underlies|underlie|〜の基礎となる|form the basis of / be at the root of|underlie sth] our connection to the team, and we [put ourselves in the shoes of|put oneself in the shoes of|〜の立場に身を置く|empathise with / identify with|put oneself in the shoes of] the players.",
     "If the team wins, we feel [triumphant|triumphant|勝ち誇った|victorious|feel triumphant], but if they [suffer a loss|suffer a loss|敗北を喫する|suffer a defeat|suffer a loss], it hurts.",
     "This 'us versus them' [state of mind|state of mind|心理状態・物の見方|mentality / mindset / outlook|a state of mind] can [spiral out of control|spiral out of control|手に負えない状況に陥る|get out of hand|spiral out of control] and lead to violence [fuelled by|be fuelled by|〜に煽られる|be fed by / be inflamed by|be fuelled by] tribalism."
   ],
   jp:"人がスポーツを愛する理由は様々で、同じ考えのファンと応援を分かち合うこともその一つだ。試合の緊張感に興奮する人もいる。科学者は今、より深い理由に注意を集中する。部族主義で、別の集団と戦うことの潜在意識的な代わりとして働く。自分のチームに勝ってほしいのは人の本性で、負かされると私たちは彼らから距離を置く。社会的地位はチームの勝利に左右されるようだ。共感が私たちとチームのつながりの基礎にあり、選手の立場に身を置く。勝てば勝ち誇った気分になり、負ければつらい。この『我々対彼ら』の心理状態は手に負えなくなり、部族主義に煽られた暴力につながりうる。"
 },
 {
   id:55, title:"苦境に立つデパート", emoji:"🏬",
   story:[
     "Department stores had their [heyday|heyday|全盛期|prime / best days|in its heyday] [for the better part of|for the better part of|〜の大半で|for the bulk of / for most of|for the better part of] the twentieth century.",
     "They were the first to sell [up-to-date|up-to-date|最新の|current / contemporary|up-to-date products] fashion and [niche|niche|特定分野・専門市場|speciality / boutique|a niche] goods, all [under one roof|under one roof|一つの屋根の下で|in one location|under one roof].",
     "Shoppers had to [put up with|put up with|〜に耐える|tolerate / endure|put up with] finding [merchandise|merchandise|商品|goods / commodity / wares|sell merchandise] in a [labyrinth|labyrinth|迷路|maze|a labyrinth of] of departments.",
     "Now, [brick and mortar stores|brick and mortar store|実店舗|retail store|a brick and mortar store]' [days are numbered|days are numbered|もう長くは続けられない|time is up|days are numbered], and they are [under the gun|under the gun|重圧の下で・追い込まれて|under pressure|under the gun] from online shopping.",
     "Why would anyone [waste|waste|浪費する|fritter away / squander / blow|waste money] a day to [amble|amble|のんびり歩く|drift / wander / meander|amble around] through a store when goods arrive at the click of a button?",
     "There is something [ominous|ominous|不吉な|dire / alarming|an ominous sign] [on the horizon|on the horizon|差し迫って|in the pipeline / imminent / just around the corner|on the horizon]: online [retailers|retailer|小売業者|merchant / vendor|online retailers] are looking at drones.",
     "They [look into|look into|調査する・見極める|investigate / determine / check out|look into sth] whether packages can arrive [safe and sound|safe and sound|無事に|intact / unscathed / in one piece|arrive safe and sound].",
     "As drone firms [make strides|make strides|前進する|make progress / make headway / forge ahead|make strides] and [put|put to use|〜を利用する|utilise / make use of|put to use] the technology to use, the closure of famous stores may [foreshadow|foreshadow|前兆となる|act as a bellwether for|foreshadow sth] the end of high street shopping."
   ],
   jp:"デパートは20世紀の大半で全盛を誇った。最新のファッションや専門的な商品を、一つ屋根の下で最初に売った店だった。買い物客は迷路のような売り場で商品を探すのに耐えねばならなかった。今や実店舗はもう長くは続けられず、オンラインショッピングに追い込まれている。ボタン一つで商品が届くのに、なぜ一日を無駄にして店内をのんびり歩くのか。地平線上に不吉なものが差し迫っている。オンライン小売業者はドローンを検討している。彼らは荷物が無事に届くか調査している。ドローン企業が前進し技術を活用するにつれ、有名店の閉店は本通りでの買い物の終わりの前兆かもしれない。"
 },
 {
   id:56, title:"セルフリッジのデパート", emoji:"🛍️",
   story:[
     "Harry Gordon Selfridge founded [high-end|high-end|高級な|upmarket / upscale / posh|high-end stores] department stores and certainly [marched to the beat of a different drum|march to the beat of a different drum|型破りである|be unconventional / be unorthodox|march to the beat of a different drum].",
     "He saw that American shopping was an [exhausting|exhausting|骨の折れる・疲れさせる|draining / taxing / tiresome|exhausting work] chore rather than a form of [leisure|leisure|余暇・娯楽|recreation|leisure time].",
     "He [erected|erect|建てる・設立する|put up / construct / establish|erect a building] his store away from the [hustle and bustle|hustle and bustle|喧騒・混雑|commotion / pandemonium / clamour|the hustle and bustle] of the city centre.",
     "He [oversaw|oversee|監督する|manage / supervise|oversee sth] each area, [situating|situate|置く・場所を定める|locate / place|situate sth] the perfume department on the ground floor to pull customers in.",
     "Every store then [followed suit|follow one's example|先例に倣う|follow suit|follow suit], and he was the first to sell [first-rate|first-rate|一流の|the highest-quality|first-rate goods] and [stylish|stylish|流行の|chic / trendy|stylish clothes] clothes at a [discount|discount|割引|reduction / markdown|offer a discount].",
     "In a [bid|bid|試み・努力|attempt / effort|in a bid to] to attract a wider [cross-section|cross-section|代表的な一団|representative sample|a cross-section of] of customers, his approach [proved invaluable|prove invaluable|とても価値があるとわかる|be worth its weight in gold|prove invaluable] and [gave him a competitive advantage|give a competitive advantage|競争で優位に立つ|give a leg up on the competition|give a competitive advantage].",
     "He was also [progressive|progressive|進歩的な|enlightened / forward-looking|a progressive attitude] in his [attitude|attitude|姿勢・考え方|approach / philosophy / point of view|a positive attitude] to women's rights.",
     "When the city would not [give the go-ahead|give the go-ahead|承認する|give a thumbs up / give the green light / give approval|give the go-ahead] for a taller building, he still [installed|install|設置する|put in place|install sth] women's toilets so ladies could stay out of the house longer."
   ],
   jp:"ハリー・ゴードン・セルフリッジは高級デパートを創業し、まさに型破りだった。彼はアメリカの買い物が娯楽ではなく骨の折れる雑用であることに気づいた。彼は都心の喧騒から離れて店を建てた。彼は各区域を監督し、客を引き込むため香水売り場を一階に配置した。どの店もそれに倣い、彼は一流でおしゃれな服を割引で最初に売った。より幅広い層の客を引きつけようとする試みの中で、彼のやり方はとても価値があるとわかり、競争で優位に立たせた。彼は女性の権利への姿勢も進歩的だった。市がより高い建物を承認しなかったとき、彼はそれでも女性用トイレを設置し、女性が長く外出できるようにした。"
 },
 {
   id:57, title:"火山噴火の予知", emoji:"🌋",
   story:[
     "In April 2018, an eruption [took place|take place|起こる|occur|take place] on Mount Io after it had been [dormant|dormant|休眠中の|inactive / inert|a dormant volcano] for 250 years, and ash [blanketed|blanket|覆う|coat / cloak / envelop|blanket the area] the area.",
     "Japan is not a [special case|special case|特殊なケース・異例|anomaly / deviation from the norm|a special case]; it has a [cluster|cluster|集団・群れ|bunch|a cluster of] of [volatile|volatile|不安定な・危険な|unstable / explosive|a volatile volcano] volcanoes near cities, [coupled with|coupled with|〜と共に|along with / combined with|coupled with] the danger of earthquakes.",
     "It is vital to [forecast|forecast|予測する|predict|forecast eruptions] eruptions, but the timing is elusive, and volcanologists must go to the volcano [in the flesh|in the flesh|直接に・じきじきに|in person|in the flesh].",
     "It takes great [courage|courage|勇気|bravery / boldness / fortitude|take courage] to take data from an active volcano.",
     "The [duration|duration|継続時間・期間|length / timespan|the duration of] of the [intervals|interval|小止み・休止|lull|a lull between] between eruptions varies, making each visit a [precarious|precarious|危ない・危険な|hazardous / perilous / risky|a precarious situation] situation, but a solution may be [close at hand|close at hand|手の届く所に・目前に|imminent|close at hand].",
     "Scientists use satellites to safely [process|process|処理する|analyse|process data] changes in the [density|density|濃度・体積・質量|thickness / bulk / mass|the density of] of the dome and get [feedback|feedback|評価・フィードバック|assessment / appraisal|provide feedback] in real time.",
     "These changes are hard to [perceive|perceive|見分ける・気づく|discern / distinguish|perceive changes] with the naked eye, so scientists [integrate|integrate|統合する|incorporate / consolidate|integrate data] this data with past eruptions.",
     "Albeit still in the [rudimentary|rudimentary|初歩の|basic / elementary|rudimentary knowledge] stages, it could be an important [step forward|step forward|前進|advancement / improvement|a step forward]."
   ],
   jp:"2018年4月、硫黄山は250年休眠した後に噴火が起こり、火山灰が一帯を覆った。日本は特殊なケースではない。都市の近くに不安定な火山の集団があり、地震の危険も伴う。噴火を予測することは重要だが、時期は捉えにくく、火山学者は火山に直接行かねばならない。活火山からデータを取るには大きな勇気が要る。噴火の間隔の継続時間はまちまちで、訪問のたびに危ない状況になるが、解決策は目前かもしれない。科学者は衛星を使ってドームの密度の変化を安全に処理し、リアルタイムで評価を得る。こうした変化は肉眼では見分けにくいので、科学者はこのデータを過去の噴火と統合する。まだ初歩の段階だが、重要な前進になりうる。"
 },
{
   id:58, title:"若者のニュース入手方法", emoji:"📈",
   story:[
     "The line graph shows how young people in the UK obtained their news from 1980 to the present day.",
     "Overall, television was dominant, while the internet [rose|rise|上昇する|climb|rise from nothing] from almost nothing to become the leading source.",
     "The figure [shot up|shoot up|急上昇する|skyrocket / catapult|the number shot up] after 2000, [overtaking|overtake|追い越す・上回る|surpass|overtake newspapers] newspapers around 2010.",
     "Television [topped the table|top the table|首位を占める|be dominant / be predominant|top the table throughout] throughout the period, [peaking|peak|頂点に達する|reach a high|peak at 9 million] at nine million before a slow [decline|decline|減少・下降|descent / downswing|a steady decline].",
     "Newspapers saw a steady [fall|fall|減少する|drop / slip|fall from 7 to 2 million], [slumping|slump|急落する|plunge|slump to 2 million] from seven million to two million [over the years|during the time in question|当該期間中に|over the years|over the years]."
   ],
   jp:"この折れ線グラフは、英国の若者が1980年から現在までどのようにニュースを入手したかを示す。全体として、テレビが主流だった一方、インターネットはほぼ無から最も人気のある情報源へと上昇した。利用者数は2000年以降に急増し、2010年ごろ新聞を追い越した。テレビは期間を通じて首位を占め、900万人で頂点に達した後、ゆるやかに減少した。新聞は着実に減少し、当該期間中に700万から200万へと落ち込んだ。"
 },
 {
   id:59, title:"英国のエネルギー使用量", emoji:"⚡",
   story:[
     "The line graph shows energy consumption by fuel type in the UK from 1950, with projections to 2050.",
     "Petrol began at 60 units and [doubled|double|倍増する|increase twofold|double from 60 to 130] to 130 by 2000.",
     "It is [projected|be projected to|〜すると予測される|be estimated to / be predicted to|be projected to remain steady] to [remain steady|remain steady|一定に保たれる|stay constant / remain static / hover|remain steady until 2050] until 2050.",
     "Coal and gas saw a brief [uptick|uptick|上昇・急増|hike / boost / upsurge|a brief uptick] to 100 units in 1975, but then [plunged|plunge|急落する|plummet / nose-dive / tumble|plunge to 50 units] to 50 by 2000.",
     "Today only 25 units are used, and this fuel is estimated to [fluctuate slightly|fluctuate slightly|わずかに変動する|waver|fluctuate slightly between 20 and 25] between 20 and 25, while solar is expected to [reach|reach|（値に）達する|hit|reach 100 units] higher levels."
   ],
   jp:"この折れ線グラフは、1950年からの英国の燃料別エネルギー消費を2050年までの予測とともに示す。石油は60単位から始まり、2000年までに130へ倍増した。石油は2050年まで一定に保たれると予測されている。石炭とガスは1975年に100単位への一時的な急増を見せたが、その後2000年までに50へ急落した。現在は25単位しか使われず、この燃料は今後20から25の間でわずかに変動すると見積もられ、一方で太陽エネルギーはより高い水準に達すると見込まれる。"
 },
 {
   id:60, title:"ビニール袋と紙袋の原料", emoji:"🛒",
   story:[
     "The pictures [depict|depict|描写する・示す|represent / illustrate / show|the pictures depict] the [resources|resource|資源|raw material / natural resource|consume resources] needed to make paper and plastic bags.",
     "Overall, paper bags [consume|consume|消費する|use up / expend|consume resources] far more materials than plastic ones.",
     "The [manufacture|manufacture|製造（する）|production / creation|the manufacture of bags] of a paper bag needs [treble|treble|3倍の|triple / threefold|treble the quantity] the wood of a plastic one.",
     "More oil is used to [transport|transport|輸送する|ship / transit / transfer|transport bags] paper bags than plastic ones.",
     "[Looking at the data from a general perspective|looking at the data from a general perspective|全体的な視点から見ると|overall / generally|looking at the data from a general perspective], paper bags are more resource-intensive."
   ],
   jp:"この絵は、紙袋とビニール袋を作るのに必要な資源を描いている。全体として、紙袋はビニール袋よりはるかに多くの材料を消費する。紙袋の製造にはビニール袋の3倍の木材が必要だ。紙袋の輸送にはビニール袋より多くの石油が使われる。全体的な視点から見ると、紙袋の方が資源集約的である。"
 },
 {
   id:61, title:"水の濾過装置", emoji:"💧",
   story:[
     "The pictures show two simple water filters.",
     "In both, [unsanitary|unsanitary|不衛生な|unhygienic / contaminated / impure|unsanitary water] water is poured onto a layer of [gravel|gravel|砂利|pebble|a layer of gravel].",
     "It then reaches a layer that [consists of|consist of|〜から成る|be made up of|consist of ground rocks] [ground|ground|すり砕いた|crushed / pulverised|ground rocks] rocks or [coarse|coarse|粗い|rough / granular / gritty|coarse sand] sand.",
     "The two filters use charcoal and fine sand in a different order, and one uses cloth while the other uses cotton balls.",
     "[In short|in short|要するに|to sum up / in summary / all in all|in short, both filters], both filters clean water in [practically|practically|実質的に・ほぼ|essentially / basically / virtually|practically the same] the same way."
   ],
   jp:"この絵は2つの簡単な水の濾過装置を示す。どちらも不衛生な水が砂利の層に注がれる。次に水はすり砕いた岩や粗い砂から成る層に達する。2つの装置は木炭と細かい砂を使う順序が異なり、一方は布を、他方は綿球を使う。要するに、両方の装置はほぼ同じ方法で水をきれいにする。"
 },
 {
   id:62, title:"音楽学校の改修案", emoji:"🎼",
   story:[
     "The plans show a music school now and a proposed refurbishment.",
     "The stairs at the front [entrance|entrance|入り口|doorway / entry / entranceway|the front entrance] will be [taken out|take out|取り除く|remove|the stairs will be taken out] and replaced with a ramp.",
     "The supply cupboard will be [converted into|convert into|〜に改造する|change into|be converted into toilets] toilets.",
     "The stairs at the end of the [hallway|hallway|廊下|corridor / hall|the end of the hallway] will [remain|remain|そのまま残る|be kept|the stairs will remain], but a new lift will be installed.",
     "Outside, the trees will be [cut down|cut down|切り倒す|chop down|trees will be cut down] to [make room for|make room for|〜のための場所をあける|allow room for / provide space for / accommodate|make room for a ramp] a ramp."
   ],
   jp:"この平面図は、音楽学校の現状と改修案を示す。正面入口の階段は取り除かれ、スロープに置き換えられる。備品室はトイレに改造される。廊下の端の階段はそのまま残るが、新しいエレベーターが設置される。外では、スロープのための場所をあけるため木が切り倒される。"
 },
 {
   id:63, title:"再開発ビフォー・アフター", emoji:"🗺️",
   story:[
     "The two maps show a town before and after reconstruction.",
     "[Prior to|prior to|〜より前に|preceding / previous to|prior to the changes] the changes, there was a [harbour|harbour|港|port|a harbour in the south] in the south of this [industrial|industrial|工業の|manufacturing|an industrial area] area.",
     "A road headed north until it reached a [crossing|crossing|交差点|crossroad / intersection|reach a crossing], where it [forked|fork|分岐する|split / divide|the road forks into two] into two.",
     "The right fork led to houses, while the left went towards a [rural area|rural area|農村地域|agricultural area / the countryside|towards a rural area].",
     "[Following|following|〜の後に|subsequent to|following the reconstruction] the reconstruction, the factories were replaced by a museum and shops."
   ],
   jp:"この2枚の地図は、町の再開発前後を示す。変更前は、この工業地域の南に港があった。道路は北へ向かい交差点に達し、そこで二つに分岐した。右の道は住宅へ、左の道は農村地域へと続いた。再開発の後、工場は博物館と店に置き換えられた。"
 },
 {
   id:64, title:"北アメリカのセミのライフサイクル", emoji:"🦗",
   story:[
     "The diagram shows the life cycle of the North American cicada.",
     "After mating, the female cuts a [groove|groove|溝|slit / gouge|cut a groove into the bark] into the bark and lays her eggs.",
     "The larva [burrows|burrow|穴を掘る|tunnel down|burrow down to the roots] down to the roots, where it feeds for years.",
     "It goes through four [stages|stage|段階|phase|four stages of development] of development.",
     "The adults [shed|shed|脱ぎ捨てる|cast off / moult / discard|shed the exoskeleton] their exoskeleton, and the males look for a [partner|partner|相手・配偶者|mate|look for a partner] with an [incessant|incessant|絶え間ない|never-ending / persistent / ceaseless|an incessant call] call, so the cycle [is renewed|be renewed|再び始まる|start over / begin again|the cycle is renewed]."
   ],
   jp:"この図は北アメリカのセミのライフサイクルを示す。交尾の後、メスは樹皮に溝を作り卵を産む。幼虫は根まで穴を掘り、そこで何年も餌を食べる。幼虫は4つの発達段階を経る。成虫は外骨格を脱ぎ捨て、オスは絶え間ない鳴き声で相手を探し、こうしてサイクルは再び始まる。"
 },
 {
   id:65, title:"ペットボトルのリサイクル", emoji:"♻️",
   story:[
     "The [diagram|diagram|図・図表|representation / flowchart|the diagram depicts] shows how PET bottles are recycled in six [steps|step|段階・手順|stage|a process with six steps].",
     "First, bottles are collected from the [consumer|consumer|消費者|customer / purchaser|from the consumer] and transported to warehouses.",
     "Next, they are [sorted|sort|分類する|organise / categorise / group|sorted by size and colour] by size and colour.",
     "The bottles are then [sent on|send on|先へ送る|forward|be sent on for processing] and [chopped up|chop up|切り刻む|shred|chopped up into pieces] into small pieces.",
     "Finally, the flakes are [packed|pack|詰める・積む|load|packed into boxes] into boxes and made into new products."
   ],
   jp:"この図は、ペットボトルが6つの段階でどうリサイクルされるかを示す。まず、ボトルは消費者から回収され倉庫へ運ばれる。次に、大きさと色で分類される。その後ボトルは次工程へ送られ、小さく切り刻まれる。最後に、フレークは箱に詰められ、新しい製品になる。"
 }
];
