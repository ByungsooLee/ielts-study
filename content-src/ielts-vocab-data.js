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
 }
];
