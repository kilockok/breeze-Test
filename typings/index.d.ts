/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo: WechatMiniprogram.UserInfo | null;
    cart: ICartItem[];
    selectedStore: IStore | null;
    addressList: IAddress[];
    selectedAddress: IAddress | null;
    orderType: 'pickup' | 'delivery';
  };
  saveCart(): void;
  addToCart(item: ICartItem): void;
  getCartCount(): number;
  getCartTotal(): number;
  clearCart(): void;
}

interface ICartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  ice: string;
  sugar: string;
  toppings: string[];
  count: number;
}

interface IStore {
  id: string;
  name: string;
  address: string;
  distance: number;
  lat: number;
  lng: number;
  hours: string;
  phone: string;
}

interface IAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

interface IProduct {
  id: string;
  categoryId: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  sales: number;
}

interface IOrder {
  id: string;
  status: 'pending' | 'making' | 'completed';
  statusText: string;
  storeName: string;
  orderType: 'pickup' | 'delivery';
  createTime: string;
  totalPrice: number;
  deliveryFee?: number;
  items: IOrderItem[];
}

interface IOrderItem {
  name: string;
  spec: string;
  count: number;
  price: number;
}
