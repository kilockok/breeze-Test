# 微信小程序 Demo

点单类业务的演示项目，用于展示小程序的页面流与基础交互。部分能力为演示或 mock 实现，非完整业务落地版本。

**功能概览（Demo）**
- 首页轮播与快捷入口
- 自取与外送下单流程
- 门店列表与地图定位、门店选择
- 菜单分类与商品详情
- 规格选项与加料
- 购物车持久化与金额汇总
- 订单确认、支付、取消、订单列表与详情
- 地址管理与默认地址
- 登录态与用户信息缓存
- 接口失败时的 mock 数据兜底

**Demo 说明**
- 部分流程依赖 mock 数据或本地缓存回退
- 支付、订单与地址等流程为演示用途，未覆盖真实业务的完整校验与风控
- 该项目不适用于生产环境

**技术栈**
- 微信小程序原生框架
- TypeScript
- WXSS
- 微信开发者工具

**目录结构**
```text
miniprogram/
  app.json
  app.ts
  app.wxss
  components/
  pages/
  utils/
typings/
project.config.json
tsconfig.json
package.json
```

**快速开始**
1. 安装依赖：`pnpm install`
2. 使用微信开发者工具导入项目目录：`D:\Code\breeze-Test`
3. 确认 `project.config.json` 中 `miniprogramRoot` 为 `miniprogram/`
4. 如需真实调试，请更新 `project.config.json` 中的 `appid`
5. 在开发者工具中编译、预览或真机调试

**接口对接（可选）**
- 接口基址在 `miniprogram/utils/api.ts` 的 `BASE_URL`
- 本地默认地址为 `http://localhost:8000`
- 需要实现的核心接口模块：
- 认证：`/api/auth/login`、`/api/auth/update-profile`
- 用户：`/api/user/profile`
- 首页：`/api/home/banners`、`/api/home/hot-products`
- 菜单：`/api/menu/categories`、`/api/menu/products`、`/api/menu/spec-options`
- 门店：`/api/stores`、`/api/stores/:id`
- 地址：`/api/addresses`、`/api/addresses/:id`、`/api/addresses/:id/default`
- 订单：`/api/orders`、`/api/orders/:id`、`/api/orders/:id/pay`、`/api/orders/:id/cancel`、`/api/orders/count`

**数据与状态**
- 购物车与登录信息使用本地缓存与全局状态同步
- 订单与地址在接口失败时回退到本地缓存与 mock 数据
- mock 数据位于 `miniprogram/utils/mock-data.ts`
