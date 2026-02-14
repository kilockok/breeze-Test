// 模拟数据

export const categories = [
  { id: 'hot', name: '热门推荐', icon: 'hot' },
  { id: 'classic', name: '经典奶茶', icon: 'cup' },
  { id: 'fruit', name: '鲜果茶', icon: 'fruit' },
  { id: 'milk', name: '鲜奶系列', icon: 'milk' },
  { id: 'special', name: '季节限定', icon: 'blossom' },
  { id: 'snack', name: '小食甜点', icon: 'cake' },
]

export const products = [
  // 热门推荐
  { id: 'p001', categoryId: 'hot', name: '招牌黑糖珍珠奶茶', desc: '手炒黑糖 · Q弹珍珠 · 香浓奶茶', price: 18, image: '/images/product-placeholder.png', sales: 2680 },
  { id: 'p002', categoryId: 'hot', name: '芝芝莓莓', desc: '新鲜草莓 · 芝士奶盖 · 清爽果茶', price: 22, image: '/images/product-placeholder.png', sales: 1920 },
  { id: 'p003', categoryId: 'hot', name: '杨枝甘露', desc: '芒果 · 西柚 · 椰浆 · 西米', price: 20, image: '/images/product-placeholder.png', sales: 1560 },
  // 经典奶茶
  { id: 'p004', categoryId: 'classic', name: '珍珠奶茶', desc: '经典配方 · 丝滑口感', price: 14, image: '/images/product-placeholder.png', sales: 3200 },
  { id: 'p005', categoryId: 'classic', name: '波霸奶茶', desc: '大颗波霸 · 嚼劲十足', price: 15, image: '/images/product-placeholder.png', sales: 2100 },
  { id: 'p006', categoryId: 'classic', name: '仙草奶茶', desc: '手工仙草 · 清凉爽口', price: 15, image: '/images/product-placeholder.png', sales: 1800 },
  { id: 'p007', categoryId: 'classic', name: '红豆奶茶', desc: '绵密红豆 · 甜蜜满分', price: 16, image: '/images/product-placeholder.png', sales: 1200 },
  // 鲜果茶
  { id: 'p008', categoryId: 'fruit', name: '满杯百香果', desc: '百香果 · 新鲜果肉 · 维C满满', price: 16, image: '/images/product-placeholder.png', sales: 1680 },
  { id: 'p009', categoryId: 'fruit', name: '超级芒果杯', desc: '大块芒果 · 芒果酱 · 清爽茶底', price: 19, image: '/images/product-placeholder.png', sales: 1450 },
  { id: 'p010', categoryId: 'fruit', name: '葡萄满满', desc: '巨峰葡萄 · 手剥果肉', price: 21, image: '/images/product-placeholder.png', sales: 980 },
  // 鲜奶系列
  { id: 'p011', categoryId: 'milk', name: '鲜奶麻薯', desc: '手工麻薯 · 北海道鲜奶', price: 19, image: '/images/product-placeholder.png', sales: 1320 },
  { id: 'p012', categoryId: 'milk', name: '双皮奶', desc: '传统工艺 · 奶香浓郁', price: 17, image: '/images/product-placeholder.png', sales: 890 },
  // 季节限定
  { id: 'p013', categoryId: 'special', name: '樱花白桃乌龙', desc: '春季限定 · 樱花风味 · 白桃果肉', price: 24, image: '/images/product-placeholder.png', sales: 760 },
  { id: 'p014', categoryId: 'special', name: '桂花酒酿奶茶', desc: '秋日限定 · 桂花香 · 酒酿圆子', price: 22, image: '/images/product-placeholder.png', sales: 650 },
  // 小食甜点
  { id: 'p015', categoryId: 'snack', name: '黑糖麻薯', desc: '软糯Q弹 · 黑糖风味', price: 12, image: '/images/product-placeholder.png', sales: 520 },
  { id: 'p016', categoryId: 'snack', name: '芋泥蛋糕', desc: '绵密芋泥 · 轻盈蛋糕', price: 15, image: '/images/product-placeholder.png', sales: 430 },
]

export const iceOptions = [
  { label: '正常冰', value: 'normal' },
  { label: '少冰', value: 'less' },
  { label: '去冰', value: 'no' },
  { label: '热饮', value: 'hot' },
]

export const sugarOptions = [
  { label: '全糖', value: 'full' },
  { label: '七分糖', value: 'seventy' },
  { label: '半糖', value: 'half' },
  { label: '三分糖', value: 'thirty' },
  { label: '无糖', value: 'zero' },
]

export const toppingOptions = [
  { label: '珍珠', value: 'pearl', price: 2 },
  { label: '椰果', value: 'coconut', price: 2 },
  { label: '仙草', value: 'grass_jelly', price: 2 },
  { label: '芋圆', value: 'taro_ball', price: 3 },
  { label: '红豆', value: 'red_bean', price: 2 },
  { label: '芝士奶盖', value: 'cheese', price: 5 },
  { label: '布丁', value: 'pudding', price: 3 },
]

export const stores = [
  { id: 's001', name: '清凤时光·万达广场店', address: '万达广场B1层L-023号', distance: 0.3, lat: 31.2304, lng: 121.4737, hours: '10:00-22:00', phone: '021-12345678' },
  { id: 's002', name: '清凤时光·中山公园店', address: '长宁路1018号龙之梦购物中心1F', distance: 0.8, lat: 31.2244, lng: 121.4167, hours: '09:30-22:30', phone: '021-23456789' },
  { id: 's003', name: '清凤时光·南京西路店', address: '南京西路1266号恒隆广场B2', distance: 1.2, lat: 31.2286, lng: 121.4485, hours: '10:00-22:00', phone: '021-34567890' },
  { id: 's004', name: '清凤时光·徐家汇店', address: '漕溪北路331号中金国际广场1F', distance: 2.5, lat: 31.1955, lng: 121.4365, hours: '09:00-23:00', phone: '021-45678901' },
  { id: 's005', name: '清凤时光·陆家嘴店', address: '世纪大道1192号世纪汇广场LG1', distance: 3.8, lat: 31.2353, lng: 121.5055, hours: '10:00-22:00', phone: '021-56789012' },
]

export const banners = [
  { id: 'b001', image: '/images/banner1.png', title: '新品上市 · 樱花白桃乌龙', color: '#FFE4E1' },
  { id: 'b002', image: '/images/banner2.png', title: '第二杯半价', color: '#FFF3E0' },
  { id: 'b003', image: '/images/banner3.png', title: '会员日 · 全场8折', color: '#E8F5E9' },
]

// 模拟订单数据
export const mockOrders = [
  {
    id: 'o20240101001',
    status: 'completed',
    statusText: '已完成',
    storeName: '清凤时光·万达广场店',
    orderType: 'pickup',
    createTime: '2024-01-15 14:30',
    totalPrice: 36,
    items: [
      { name: '招牌黑糖珍珠奶茶', spec: '少冰/七分糖', count: 1, price: 18 },
      { name: '珍珠奶茶', spec: '正常冰/全糖/加芋圆', count: 1, price: 18 },
    ]
  },
  {
    id: 'o20240101002',
    status: 'making',
    statusText: '制作中',
    storeName: '清凤时光·中山公园店',
    orderType: 'pickup',
    createTime: '2024-01-16 10:15',
    totalPrice: 22,
    items: [
      { name: '芝芝莓莓', spec: '少冰/半糖', count: 1, price: 22 },
    ]
  },
  {
    id: 'o20240101003',
    status: 'pending',
    statusText: '待支付',
    storeName: '清凤时光·南京西路店',
    orderType: 'delivery',
    createTime: '2024-01-16 11:00',
    totalPrice: 45,
    deliveryFee: 5,
    items: [
      { name: '杨枝甘露', spec: '去冰/半糖', count: 1, price: 20 },
      { name: '满杯百香果', spec: '少冰/七分糖', count: 1, price: 16 },
      { name: '黑糖麻薯', spec: '', count: 1, price: 12 },
    ]
  },
]
