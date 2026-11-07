import {ui,withItalian} from './locales.mjs';
/* Italia Uno blackboard transcription. Menu facts come from the supplied photos,
 * not the game's invented serving times, scores or prices. No current price claims. */
export const MENU_PROVENANCE = {
    version: 1,
    transcribedAt: '2026-11-07',
    restaurant: 'Italia Uno, 91 Charlotte Street, London W1T 4PX',
    photographyDate: 'Not independently verified',
    pricePolicy: 'Historical prices omitted. The reference photographs show different historical prices, and several digits are occluded. Customer ordering uses a separate, explicitly invented virtual price schedule, not current café prices.',
    sources: [
        { id: 'photo-close', type: 'team-supplied photograph', file: 'reference-photos/caption.jpg', description: 'Close view of the three blackboards: Panini Italiani, Hot Food / Large Salads / Basic Rolls / Dolci, Breakfasts / Hot Drinks / Bakery / Gelati / Orange Juice.' },
        { id: 'photo-wide', type: 'team-supplied photograph', file: 'reference-photos/caption-1.jpg', description: 'Wider shop interior used to cross-check visible menu headings and wording. Flags obscure part of the drinks board.' },
        { id: 'listing', type: 'photo provenance / restaurant identity only', url: 'https://www.tripadvisor.co.uk/Restaurant_Review-g186338-d2395438-Reviews-Italia_Uno-London_England.html', description: 'The supplied reference photographs are consistent with this restaurant listing. Listing reviews are not used to invent menu rows.' }
    ],
    checkedButExcluded: [{ url: 'https://italiauno.shop/menu', checkedAt: '2026-11-07', reason: 'Redirected to a third-party Locallya listing with OCR-like names and inconsistent prices; not accepted as an official or complete current menu.' }],
    limits: [
        'Complete transcription of the legible menu names and explicitly named choices in the supplied three-board view; not a verified complete current restaurant menu.',
        'OR choices, sizes and three named gelato flavours are shown as separate searchable entries. Two generic gelato formats are retained as written, rather than assuming their relationship.',
        'The board says ask staff what is available for dolci and ends its examples with etc.; unnamed sweets are not invented.',
        'No bottled cold drinks, alcohol or other items not legibly listed in the supplied boards have been added.',
        'Translations describe readable words; they are not allergen declarations. The three-ingredient panino puzzle is a simplified game adaptation.'
    ]
};
export const MENU_CATEGORIES = [
    withItalian({ id: 'panini', en: 'Panini Italiani', zh: '意式帕尼尼', board: 'Panini Italiani' }),
    withItalian({ id: 'hot-food', en: 'Hot food & sides', zh: '热食与配菜', board: 'Hot Food' }),
    withItalian({ id: 'salads', en: 'Large salads', zh: '大份沙拉', board: 'Large Salads · bread included' }),
    withItalian({ id: 'rolls', en: 'Basic rolls', zh: '基础面包卷', board: 'Basic Rolls with Salad' }),
    withItalian({ id: 'breakfast', en: 'Breakfasts', zh: '早餐', board: 'Breakfasts' }),
    withItalian({ id: 'hot-drinks', en: 'Hot drinks', zh: '热饮', board: 'Hot Drinks' }),
    withItalian({ id: 'bakery', en: 'Bakery & biscuits', zh: '烘焙与饼干', board: 'Rows below Hot Drinks' }),
    withItalian({ id: 'dolci', en: 'Dolci', zh: '意式甜点', board: 'Dolci · ask staff what’s available' }),
    withItalian({ id: 'gelato', en: 'Gelati', zh: '冰淇淋', board: 'Gelati / Coppe / Gelato in bicchiere' }),
    withItalian({ id: 'juice', en: 'Fresh juice', zh: '鲜榨果汁', board: 'Spremuta d’arancia' })
];
const item = (id, category, name, en, zh, descriptionEn, descriptionZh, extra = {}) => (withItalian({
    id, category, name, en, zh, description: withItalian({ en: descriptionEn, zh: descriptionZh }),
    sourceIds: ['photo-close', 'photo-wide'], certainty: 'clear', ...extra
}));
export const MENU_ITEMS = [
    item('italia', 'panini', 'Italia', 'Italia', 'Italia 帕尼尼', 'Prosciutto crudo (Parma ham), mozzarella and salad.', '帕尔马生火腿、马苏里拉奶酪与沙拉。', { gameRecipe: 'italia' }),
    item('campagnolo', 'panini', 'Campagnolo', 'Campagnolo', 'Campagnolo 帕尼尼', 'Aubergines, sun-dried tomatoes, artichoke hearts and salad.', '茄子、风干番茄、洋蓟心与沙拉。', { gameRecipe: 'campagnolo' }),
    item('cotoletta', 'panini', 'Cotoletta', 'Cotoletta', 'Cotoletta 鸡排帕尼尼', 'Chicken escalope with salad. The board also offers extra cheese.', '薄鸡排配沙拉；黑板另列加奶酪选项。'),
    item('pescatore', 'panini', 'Pescatore', 'Pescatore', 'Pescatore 海鲜帕尼尼', 'Insalata di mare (seafood) and salad.', '海鲜沙拉与沙拉菜。'),
    item('piccante', 'panini', 'Piccante', 'Piccante', 'Piccante 辣萨拉米帕尼尼', 'Spicy salame, pecorino cheese and salad. Extra sun-dried tomatoes are listed.', '辣萨拉米、佩科里诺奶酪与沙拉；另列加风干番茄。'),
    item('bondola', 'panini', 'Bondola', 'Bondola', 'Bondola 帕尼尼', 'Mortadella ham, cheese and salad. Extra artichoke hearts are listed.', '莫塔德拉肉肠、奶酪与沙拉；另列加洋蓟心。'),
    item('barese', 'panini', 'Barese', 'Barese', 'Barese 金枪鱼帕尼尼', 'Tuna fish, mozzarella cheese and salad.', '金枪鱼、马苏里拉奶酪与沙拉。', { gameRecipe: 'barese' }),
    item('puglia', 'panini', 'Puglia', 'Puglia', 'Puglia 自选帕尼尼', 'Choose one cheese and either aubergines, sun-dried tomatoes or artichoke hearts.', '选一种奶酪，再从茄子、风干番茄或洋蓟心中选一种。'),
    item('veneziano', 'panini', 'Veneziano', 'Veneziano', 'Veneziano 帕尼尼', 'Pancetta ham, dolcelatte cheese and salad. Extra aubergines are listed.', '意式培根、Dolcelatte 奶酪与沙拉；另列加茄子。'),
    item('vegetable-soup', 'hot-food', 'Vegetable soup', 'Vegetable soup', '蔬菜汤', 'One of the two soup choices written on the board.', '黑板上列出的两种汤之一。'),
    item('tomato-soup', 'hot-food', 'Tomato soup', 'Tomato soup', '番茄汤', 'The other soup choice written on the board.', '黑板上列出的另一种汤。'),
    item('meat-lasagne', 'hot-food', 'Meat lasagne', 'Meat lasagne', '肉酱千层面', 'Meat option on the “meat or vegetable lasagne” row.', '“肉类或蔬菜千层面”一行中的肉类选项。'),
    item('vegetable-lasagne', 'hot-food', 'Vegetable lasagne', 'Vegetable lasagne', '蔬菜千层面', 'Vegetable option on the lasagne row.', '千层面一行中的蔬菜选项。'),
    item('pasta-day', 'hot-food', 'Pasta of the day', 'Pasta of the day', '每日意面', 'The board offers vegetarian or meat pasta; the day’s particular recipe is not specified.', '黑板列有素食或肉类意面，未注明当日具体食谱。'),
    item('parmigiana', 'hot-food', 'Melanzane alla parmigiana + bread', 'Melanzane alla parmigiana + bread', '帕尔马式焗茄子配面包', 'Aubergines alla parmigiana, served with bread as written.', '黑板列出的帕尔马式茄子，配面包。'),
    item('arancine-meat', 'hot-food', 'Arancine di riso · carne', 'Arancine di riso · meat', '肉馅意式炸饭团', 'Rice balls; the board names a meat filling.', '米饭团；黑板列有肉馅选项。'),
    item('arancine-spinach', 'hot-food', 'Arancine di riso · spinach + mozzarella', 'Arancine · spinach & mozzarella', '菠菜马苏里拉炸饭团', 'Rice balls with spinach and mozzarella, as listed.', '黑板列出的菠菜与马苏里拉奶酪米饭团。'),
    item('side-salad', 'hot-food', 'Insalatina', 'Side salad · insalatina', '配菜小沙拉', 'A side salad is listed separately from the large salads.', '单独列出的配菜沙拉，与大份沙拉不同。'),
    item('bread', 'hot-food', 'Pane', 'Portion of bread · pane', '一份面包', 'A portion of bread.', '黑板单列的一份面包。'),
    item('salad-pollo', 'salads', 'Insalata di pollo + mozzarella', 'Insalata di pollo + mozzarella', '鸡肉马苏里拉沙拉', 'Chicken escalope and mozzarella; the large-salad heading says bread is included.', '薄鸡排与马苏里拉奶酪；大份沙拉标题注明配面包。'),
    item('salad-vegetariana', 'salads', 'Insalata vegetariana', 'Insalata vegetariana', '素食沙拉', 'Vegetarian salad; individual ingredients are not listed here. Bread included on the board.', '素食沙拉；此处未列具体食材。黑板注明配面包。'),
    item('salad-mare', 'salads', 'Insalata di mare', 'Insalata di mare', '海鲜沙拉', 'Seafood salad; bread included on the board.', '海鲜沙拉；黑板注明配面包。'),
    item('affettato-misto', 'salads', 'Affettato misto', 'Affettato misto', '意式混合冷切肉拼盘', 'Mixed sliced meats; listed in the large-salad section with bread.', '意式混合冷切肉，列于含面包的大份沙拉区域。'),
    item('antipasto-grande', 'salads', 'Antipasto grande', 'Antipasto grande', '大份意式开胃拼盘', 'Large antipasto; individual ingredients are not specified. Bread included on the board.', '大份意式开胃拼盘；黑板未列具体组成，并注明配面包。'),
    ...[
        ['cheese', 'Cheese', '奶酪'], ['tuna', 'Tuna', '金枪鱼'], ['salame', 'Salame', '萨拉米'], ['mortadella', 'Mortadella', '莫塔德拉肉肠'],
        ['parma', 'Prosciutto crudo (Parma ham)', '帕尔马生火腿'], ['pancetta', 'Pancetta', '意式培根']
    ].map(([id, en, zh]) => item('roll-' + id, 'rolls', en + ' roll', en + ' roll', zh + '面包卷', en + ' in a basic roll with salad, as listed on the board.', '基础面包卷配' + zh + '与沙拉。')),
    item('scrambled-toast', 'breakfast', 'Scrambled eggs on toast', 'Scrambled eggs on toast', '炒蛋吐司', 'Scrambled eggs on toast.', '吐司配炒蛋。'),
    item('parma-eggs', 'breakfast', 'Parma ham + scrambled eggs', 'Parma ham + scrambled eggs', '帕尔马火腿配炒蛋', 'Parma ham and scrambled eggs. Toast is not separately specified on this row.', '帕尔马火腿与炒蛋；此行未另注明吐司。'),
    item('italian-breakfast', 'breakfast', 'Italian breakfast', 'Italian breakfast', '意式早餐', 'Parma ham, salame, mortadella, cheese and scrambled eggs.', '帕尔马火腿、萨拉米、莫塔德拉肉肠、奶酪与炒蛋。'),
    item('vegetarian-breakfast', 'breakfast', 'Vegetarian breakfast', 'Vegetarian breakfast', '素食早餐', 'Cheese, aubergines, sun-dried tomatoes, artichoke hearts and scrambled eggs.', '奶酪、茄子、风干番茄、洋蓟心与炒蛋。'),
    item('espresso', 'hot-drinks', 'Espresso (singolo)', 'Espresso · single', '单份浓缩咖啡', 'Single espresso.', '单份意式浓缩咖啡。'),
    item('espresso-doppio', 'hot-drinks', 'Espresso doppio', 'Espresso doppio · double', '双份浓缩咖啡', 'Double-shot espresso.', '双份意式浓缩咖啡。'),
    item('cappuccino-small', 'hot-drinks', 'Cappuccino (small)', 'Cappuccino · small', '小杯卡布奇诺', 'Small cappuccino, explicitly listed as a size.', '黑板明确列出的小杯卡布奇诺。'),
    item('cappuccino-grande', 'hot-drinks', 'Cappuccino grande', 'Cappuccino grande · large', '大杯卡布奇诺', 'Large cappuccino.', '大杯卡布奇诺。'),
    item('cappuccino-doppio', 'hot-drinks', 'Cappuccino doppio', 'Cappuccino doppio · double shot', '双份浓缩卡布奇诺', 'Cappuccino with a double shot.', '使用双份浓缩咖啡的卡布奇诺。'),
    item('cappuccino-grande-doppio', 'hot-drinks', 'Cappuccino grande doppio', 'Cappuccino grande doppio', '大杯双份浓缩卡布奇诺', 'Large cappuccino with a double shot.', '大杯卡布奇诺，使用双份浓缩咖啡。'),
    item('caffelatte', 'hot-drinks', 'Caffelatte', 'Caffelatte', '拿铁咖啡', 'Caffelatte, as written on the board.', '黑板列出的 Caffelatte。'),
    item('caffelatte-doppio', 'hot-drinks', 'Caffelatte doppio', 'Caffelatte doppio · double shot', '双份浓缩拿铁', 'Caffelatte with a double shot.', '使用双份浓缩咖啡的拿铁。'),
    item('cioccolata-calda', 'hot-drinks', 'Cioccolata calda', 'Cioccolata calda · hot chocolate', '热巧克力', 'Hot chocolate.', '热巧克力。'),
    item('tea', 'hot-drinks', 'Normal tea', 'Tea', '普通茶', 'Written as “normal tea” on the board; a particular tea variety is not specified.', '黑板写作“Normal tea”，未注明具体茶种。'),
    item('earl-grey', 'hot-drinks', 'Earl Grey', 'Earl Grey', '伯爵茶', 'One of the three named tea choices.', '黑板列出的三种茶饮选择之一。'),
    item('camomile', 'hot-drinks', 'Camomile', 'Camomile', '洋甘菊茶', 'Camomile, preserving the spelling visible on the board.', '洋甘菊茶，原名保留黑板上的拼写。'),
    item('peppermint', 'hot-drinks', 'Peppermint', 'Peppermint', '薄荷茶', 'Peppermint tea.', '薄荷茶。'),
    item('croissant-piccolo', 'bakery', 'Croissant piccoli', 'Small croissants', '小可颂', 'The board lists “Croissant piccoli o nastrine”.', '黑板列为“Croissant piccoli o nastrine”。'),
    item('nastrine', 'bakery', 'Nastrine', 'Nastrine', 'Nastrine 蝴蝶结酥', 'Nastrine is the alternative named beside small croissants.', '黑板在小可颂旁列出的另一种糕点。'),
    item('croissant-grande', 'bakery', 'Croissant grande', 'Large croissant', '大可颂', 'Listed beside Danish pastries.', '与丹麦酥并列的一项。'),
    item('danish', 'bakery', 'Danish', 'Danish pastry', '丹麦酥', 'Danish pastry, as listed.', '黑板列出的丹麦酥。'),
    item('wafers', 'bakery', 'Wafers', 'Wafers', '威化饼干', 'One of the “wafers o cantucci” choices.', '“Wafers o cantucci”中的一种选择。'),
    item('cantucci', 'bakery', 'Cantucci', 'Cantucci', '意式脆饼', 'Cantucci, listed as an alternative to wafers.', 'Cantucci 意式脆饼，与威化饼干并列。'),
    item('panettone', 'bakery', 'Fetta panettone', 'Slice of panettone', '一片潘妮托妮', 'A slice of panettone, one of two named festive cakes.', '切片潘妮托妮，黑板列出的两种节庆蛋糕之一。'),
    item('pandoro', 'bakery', 'Fetta pandoro', 'Slice of pandoro', '一片潘多洛', 'A slice of pandoro.', '切片潘多洛蛋糕。'),
    item('tiramisu', 'dolci', 'Tiramisu', 'Tiramisu', '提拉米苏', 'One of the named dolci examples. The board says to ask staff what is available.', '黑板甜点示例之一，并注明向店员询问当日供应。'),
    item('torta-nonna', 'dolci', 'Torta nonna', 'Torta nonna', 'Torta nonna 蛋糕', 'Preserves the name written on the board; the exact recipe is not specified. Ask staff what is available.', '保留黑板名称，未注明具体食谱；供应请询问店员。'),
    item('cannolo', 'dolci', 'Cannolo siciliano', 'Cannolo siciliano', '西西里奶油卷', 'One of the named dolci examples; ask staff what is available.', '黑板甜点示例之一；供应请询问店员。'),
    item('torte-piccole', 'dolci', 'Torte piccole · ½ porzione', 'Small cakes · half portion', '小蛋糕 · 半份', 'The board lists small cakes in a half portion, without naming a particular cake.', '黑板列出半份小蛋糕，但没有指定蛋糕种类。'),
    item('gelati', 'gelato', 'Gelati', 'Gelati', '冰淇淋', 'A general “gelati” entry is visible. Its format or flavours are not specified on that row.', '可见“Gelati”通用条目；这一行未注明形式或口味。', { certainty: 'format-unspecified' }),
    item('coppe', 'gelato', 'Coppe', 'Coppe · Italian ice cream in glass', '杯装意式冰淇淋', 'Written as Italian ice cream in glass. Its relationship to the following flavoured-glass row is unspecified.', '黑板注释为玻璃杯装意式冰淇淋；与下一行口味杯装的关系未说明。', { certainty: 'format-unspecified' }),
    item('gelato-cioccolato', 'gelato', 'Gelato al cioccolato in bicchiere', 'Chocolate gelato in glass', '巧克力杯装冰淇淋', 'Cioccolato is one of three named flavours on the “in bicchiere” row.', '杯装一行中明确列出的三种口味之一。'),
    item('gelato-pistacchio', 'gelato', 'Gelato al pistacchio in bicchiere', 'Pistachio gelato in glass', '开心果杯装冰淇淋', 'Pistacchio is one of three named flavours on the “in bicchiere” row.', '杯装一行中明确列出的三种口味之一。'),
    item('gelato-cocco', 'gelato', 'Gelato al cocco in bicchiere', 'Coconut gelato in glass', '椰子杯装冰淇淋', 'Cocco is one of three named flavours on the “in bicchiere” row.', '杯装一行中明确列出的三种口味之一。'),
    item('orange-juice', 'juice', 'Spremuta d’arancia', 'Freshly squeezed orange juice', '鲜榨橙汁', 'The Italian and English lines name the same drink, so it is listed once.', '意大利文和英文两行指同一种饮料，故只列一次。')
];
export const MENU_COUNT = MENU_ITEMS.length;
export const menuById = Object.fromEntries(MENU_ITEMS.map(item => [item.id, item]));
