import {
  createAddress,
  updateAddress,
  getAddresses,
} from '../../utils/api'
import { isLoggedIn } from '../../utils/auth'

const app = getApp<IAppOption>()

Page({
  data: {
    id: '' as any,
    name: '',
    phone: '',
    region: [] as string[],
    detail: '',
    isDefault: false,
    isEdit: false,
  },

  onLoad(options: Record<string, string>) {
    if (options.id) {
      const addrId = options.id
      this.setData({ isEdit: true, id: addrId })
      wx.setNavigationBarTitle({ title: '编辑地址' })

      this.loadAddress(addrId)
    } else {
      wx.setNavigationBarTitle({ title: '新增地址' })
    }
  },

  /** 加载地址详情，API 失败 fallback 到本地 */
  loadAddress(addrId: any) {
    const numId = Number(addrId)

    if (numId && isLoggedIn()) {
      getAddresses().then((list) => {
        const address = list.find((a: any) => a.id === numId)
        if (address) {
          this.setData({
            name: address.name,
            phone: address.phone,
            region: address.region || [],
            detail: address.detail,
            isDefault: address.is_default || address.isDefault || false,
          })
        } else {
          this.fallbackLoadAddress(addrId)
        }
      }).catch(() => {
        this.fallbackLoadAddress(addrId)
      })
    } else {
      this.fallbackLoadAddress(addrId)
    }
  },

  /** fallback 从 globalData / localStorage 加载 */
  fallbackLoadAddress(addrId: any) {
    const addressList: any[] = (app.globalData as any).addressList || wx.getStorageSync('addressList') || []
    const address = addressList.find((item) => String(item.id) === String(addrId))
    if (address) {
      this.setData({
        name: address.name,
        phone: address.phone,
        region: address.region || [],
        detail: address.detail,
        isDefault: address.isDefault || address.is_default || false,
      })
    }
  },

  onInputChange(e: WechatMiniprogram.Input) {
    const field = e.currentTarget.dataset.field as string
    this.setData({ [field]: e.detail.value } as any)
  },

  onRegionChange(e: any) {
    this.setData({ region: e.detail.value })
  },

  onSwitchChange(e: WechatMiniprogram.SwitchChange) {
    this.setData({ isDefault: e.detail.value })
  },

  useWxAddress() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          name: res.userName,
          phone: res.telNumber,
          region: [res.provinceName, res.cityName, res.countyName],
          detail: res.detailInfo,
        })
      },
      fail: () => {
        wx.showToast({ title: '获取地址失败', icon: 'none' })
      },
    })
  },

  validate(): boolean {
    const { name, phone, region, detail } = this.data
    if (!name.trim()) {
      wx.showToast({ title: '请输入收货人姓名', icon: 'none' })
      return false
    }
    if (!phone.trim()) {
      wx.showToast({ title: '请输入手机号', icon: 'none' })
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return false
    }
    if (!region || region.length < 3) {
      wx.showToast({ title: '请选择所在地区', icon: 'none' })
      return false
    }
    if (!detail.trim()) {
      wx.showToast({ title: '请输入详细地址', icon: 'none' })
      return false
    }
    return true
  },

  save() {
    if (!this.validate()) return

    const { id, name, phone, region, detail, isDefault, isEdit } = this.data
    const data = {
      name: name.trim(),
      phone: phone.trim(),
      region,
      detail: detail.trim(),
      is_default: isDefault,
    }

    const numId = Number(id)

    // 尝试 API
    if (isLoggedIn()) {
      const promise = isEdit && numId ? updateAddress(numId, data) : createAddress(data)

      promise.then(() => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          success: () => {
            setTimeout(() => wx.navigateBack(), 500)
          },
        })
      }).catch(() => {
        // API 失败 fallback 到本地保存
        this.localSave()
      })
    } else {
      this.localSave()
    }
  },

  /** 本地保存地址 */
  localSave() {
    const { id, name, phone, region, detail, isDefault, isEdit } = this.data
    const addressList: any[] = [...((app.globalData as any).addressList || [])]

    const address = {
      id: isEdit ? id : `addr_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      region,
      detail: detail.trim(),
      isDefault,
      is_default: isDefault,
    }

    if (isDefault) {
      addressList.forEach((item) => {
        item.isDefault = false
        item.is_default = false
      })
    }

    if (isEdit) {
      const index = addressList.findIndex((item) => String(item.id) === String(id))
      if (index !== -1) {
        addressList[index] = address
      }
    } else {
      addressList.push(address)
    }

    ;(app.globalData as any).addressList = addressList
    wx.setStorageSync('addressList', addressList)
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        setTimeout(() => wx.navigateBack(), 500)
      },
    })
  },
})
