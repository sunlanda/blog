# 使用next.js 构建一个全栈电商网站

众所周知,前端在开发项目的时候绕不开react/vue技术栈的选择,如果一人全栈开发实现前后端的所有功能的时候,我们就会从技术栈的周边生态,部署的便捷性,前后端共用逻辑的同构上去考虑问题.所以这篇文章就讲讲我如何围绕next.js并结合生态完成一个全栈电商项目.


## 项目介绍
首先假定我们是一个技术服务类型的公司,公司主要经营技术咨询服务,并录制特定行业的课程进行销售,并且不打算借助其他课程平台去售卖,而是自建电商网站,独立完成商品上架展示,购物车,支付,账单结算,邮件推送,课程权限开通等业务逻辑.


## 业务流程图

### 核心业务域划分

```mermaid
graph TB
    classDef productDomain fill:#f9d5e5,stroke:#333,stroke-width:1px
    classDef cartDomain fill:#eeeeee,stroke:#333,stroke-width:1px
    classDef orderDomain fill:#d5f5e3,stroke:#333,stroke-width:1px
    classDef userDomain fill:#d6eaf8,stroke:#333,stroke-width:1px

    subgraph "商品域 (Product Domain)"
        direction TB
        A1[商品展示] --> A2[商品详情]
        A2 --> A3[商品搜索]
        A3 --> A4[商品分类]
        A4 --> A5[商品评价]
    end
    
    subgraph "购物车域 (Cart Domain)"
        direction TB
        B1[购物车展示] --> B2[购物车添加]
        B2 --> B3[购物车删除]
        B3 --> B4[购物车修改]
        B4 --> B5[购物车结算]
    end
    
    subgraph "订单域 (Order Domain)"
        direction TB
        C1[订单创建] --> C2[订单展示]
        C2 --> C3[订单支付]
        C3 --> C4[订单取消]
        C4 --> C5[订单退款]
        C5 --> C6[订单完成]
    end
    
    subgraph "用户域 (User Domain)"
        direction TB
        D1[用户注册] --> D2[用户登录]
        D2 --> D3[用户信息]
        D3 --> D4[用户权限]
        D4 --> D5[用户课程]
    end
    商品域 --> 购物车域
    购物车域 --> 订单域
    用户域 --> 购物车域
    用户域 --> 订单域
    
    class A1,A2,A3,A4,A5 productDomain
    class B1,B2,B3,B4,B5 cartDomain
    class C1,C2,C3,C4,C5,C6 orderDomain
    class D1,D2,D3,D4,D5 userDomain
```

### 用户购买课程完整流程

```mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    participant 数据库
    participant 支付系统
    participant 邮件系统
    participant 课程系统
    
    用户->>前端: 浏览课程列表
    前端->>后端: 请求课程数据
    后端->>数据库: 查询课程信息
    数据库-->>后端: 返回课程列表
    后端-->>前端: 返回课程数据
    前端-->>用户: 展示课程列表
    
    用户->>前端: 查看课程详情
    前端->>后端: 请求课程详细信息
    后端->>数据库: 查询课程详情
    数据库-->>后端: 返回课程详情
    后端-->>前端: 返回课程详情
    前端-->>用户: 展示课程详情
    
    用户->>前端: 添加课程到购物车
    前端->>后端: 发送添加购物车请求
    后端->>数据库: 保存购物车信息
    数据库-->>后端: 确认保存成功
    后端-->>前端: 返回购物车更新结果
    前端-->>用户: 显示添加成功提示
    
    用户->>前端: 查看购物车
    前端->>后端: 请求购物车数据
    后端->>数据库: 查询购物车信息
    数据库-->>后端: 返回购物车数据
    后端-->>前端: 返回购物车信息
    前端-->>用户: 展示购物车内容
    
    用户->>前端: 结算购物车
    前端->>后端: 发送创建订单请求
    后端->>数据库: 创建订单记录
    数据库-->>后端: 确认订单创建成功
    后端-->>前端: 返回订单信息
    前端-->>用户: 展示订单确认页面
    
    用户->>前端: 确认支付
    前端->>后端: 发起支付请求
    后端->>支付系统: 创建支付会话
    支付系统-->>后端: 返回支付链接/表单
    后端-->>前端: 返回支付信息
    前端-->>用户: 重定向到支付页面
    
    用户->>支付系统: 完成支付
    支付系统->>后端: 支付成功回调
    后端->>数据库: 更新订单状态为已支付
    后端->>课程系统: 开通用户课程权限
    课程系统-->>后端: 确认权限开通成功
    
    后端->>邮件系统: 发送订单确认邮件
    邮件系统-->>用户: 发送购买成功邮件
    后端->>邮件系统: 发送课程访问信息
    邮件系统-->>用户: 发送课程访问详情
    
    后端-->>前端: 通知支付成功
    前端-->>用户: 显示支付成功页面
    
    用户->>前端: 访问我的课程
    前端->>后端: 请求用户课程列表
    后端->>数据库: 查询用户课程权限
    数据库-->>后端: 返回课程权限信息
    后端-->>前端: 返回可访问课程列表
    前端-->>用户: 展示用户课程列表
```

### 订单处理流程

```mermaid
stateDiagram-v2
    [*] --> 创建订单
    创建订单 --> 等待支付: 用户提交订单
    等待支付 --> 支付处理中: 用户发起支付
    支付处理中 --> 支付失败: 支付异常
    支付处理中 --> 支付成功: 支付完成
    支付失败 --> 等待支付: 重新支付
    支付失败 --> 订单取消: 用户取消
    支付成功 --> 开通权限: 自动处理
    开通权限 --> 发送邮件: 权限开通成功
    发送邮件 --> 订单完成: 邮件发送成功
    等待支付 --> 订单取消: 超时未支付
    订单取消 --> [*]
    订单完成 --> [*]
```

## 技术架构图

```mermaid
graph LR
    classDef frontendLayer fill:#f9d5e5,stroke:#333,stroke-width:1px
    classDef backendLayer fill:#d5f5e3,stroke:#333,stroke-width:1px
    classDef dataLayer fill:#d6eaf8,stroke:#333,stroke-width:1px
    classDef infrastructureLayer fill:#fdebd0,stroke:#333,stroke-width:1px
    classDef thirdPartyLayer fill:#e8daef,stroke:#333,stroke-width:1px

    subgraph "前端层 (Frontend Layer)"
        direction TB
        A1[Next.js] --> A2[React.js]
        A2 --> A3[TypeScript]
        A1 --> A4[Shadcn UI]
        A1 --> A5[Radix UI]
        A1 --> A6[TailwindCSS]
    end
    
    subgraph "后端层 (Backend Layer)"
        direction TB
        B1[Hono.js] --> B2[TypeScript]
        B1 --> B3[API 路由]
        B1 --> B4[中间件]
        B1 --> B5[验证器]
    end
    
    subgraph "数据层 (Data Layer)"
        direction TB
        C1[PostgreSQL] --> C2[Prisma ORM]
        C3[MinIO] --> C4[对象存储]
        C5[Redis] --> C6[缓存]
    end
    
    subgraph "基础设施层 (Infrastructure Layer)"
        direction TB
        D1[Docker] --> D2[Docker Compose]
        D1 --> D3[CI/CD]
        D1 --> D4[容器编排]
    end
    
    subgraph "第三方服务层 (Third-party Services)"
        direction TB
        E1[Stripe] --> E2[支付处理]
        E3[Plunk] --> E4[邮件服务]
        E5[AWS S3] --> E6[备份存储]
    end
    
    前端层 --> 后端层
    后端层 --> 数据层
    后端层 --> 第三方服务层
    数据层 --> 基础设施层
    后端层 --> 基础设施层
    前端层 --> 基础设施层
    
    class A1,A2,A3,A4,A5,A6 frontendLayer
    class B1,B2,B3,B4,B5 backendLayer
    class C1,C2,C3,C4,C5,C6 dataLayer
    class D1,D2,D3,D4 infrastructureLayer
    class E1,E2,E3,E4,E5,E6 thirdPartyLayer
```

## 核心功能实现

那我们分析一下这个项目中需要使用的技术栈: 
* 网页展现: react.js + antd/shadcn/radixui
* 后台业务: express / next.js / hono
* 数据库存储: postgresql / mysql
* OSS存储: minio / AWS S3
* 支付: stripe
* 邮件推送: plunk / mailgun

因为hono最近比较火,所以我们就使用hono作为后端框架.搭配postgresql来实现:使用next.js, 后端使用hono, 数据库使用postgresql, 存储使用minio, 支付使用stripe, 邮件推送使用plunk.
我将这几个核心模块如商品,购物车,订单支付,邮件的MVP实现逻辑贴在下方,分为前端和后端的代码,简易实现了核心的逻辑.



### 商品模型设计

在设计电商系统时，商品模型是核心数据结构之一。以下是使用 Prisma 定义的商品模型：

```typescript
// prisma/schema.prisma
model Product {
  id          String      @id @default(cuid())
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  title       String
  description String
  price       Decimal     @db.Decimal(10, 2)
  imageUrl    String?
  videoUrl    String?
  published   Boolean     @default(false)
  featured    Boolean     @default(false)
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  cartItems   CartItem[]
  orderItems  OrderItem[]
  reviews     Review[]

  @@index([categoryId])
}

model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  products  Product[]
}

model Review {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  rating    Int
  comment   String?
  userId    String
  productId String
  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  @@index([userId])
  @@index([productId])
}
```

### 购物车实现

购物车是电商系统的关键功能，下面是购物车相关的数据模型和API实现：

```typescript
// prisma/schema.prisma
model Cart {
  id        String     @id @default(cuid())
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]
}

model CartItem {
  id        String   @id @default(cuid())
  quantity  Int
  cartId    String
  productId String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
  @@index([cartId])
  @@index([productId])
}
```

购物车API实现：

```typescript
// server/api/cart.ts
import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { auth } from '../middleware/auth';

const cart = new Hono();

// 中间件：确保用户已登录
cart.use('*', auth);

// 获取当前用户的购物车
cart.get('/', async (c) => {
  const userId = c.get('userId');
  
  try {
    // 查找用户的购物车，如果不存在则创建
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }
    
    return c.json({ success: true, cart });
  } catch (error) {
    console.error('获取购物车失败:', error);
    return c.json({ success: false, message: '获取购物车失败' }, 500);
  }
});

// 添加商品到购物车
cart.post('/items', async (c) => {
  const userId = c.get('userId');
  const { productId, quantity } = await c.req.json();
  
  if (!productId || !quantity || quantity < 1) {
    return c.json({ success: false, message: '无效的商品或数量' }, 400);
  }
  
  try {
    // 查找商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return c.json({ success: false, message: '商品不存在' }, 404);
    }
    
    // 查找或创建用户的购物车
    let cart = await prisma.cart.findUnique({
      where: { userId }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }
    
    // 查找购物车中是否已有该商品
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });
    
    if (existingItem) {
      // 更新数量
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // 添加新商品
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }
    
    // 返回更新后的购物车
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    return c.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('添加商品到购物车失败:', error);
    return c.json({ success: false, message: '添加商品到购物车失败' }, 500);
  }
});

// 更新购物车商品数量
cart.put('/items/:itemId', async (c) => {
  const userId = c.get('userId');
  const itemId = c.req.param('itemId');
  const { quantity } = await c.req.json();
  
  if (!quantity || quantity < 0) {
    return c.json({ success: false, message: '无效的数量' }, 400);
  }
  
  try {
    // 查找购物车项
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });
    
    if (!cartItem || cartItem.cart.userId !== userId) {
      return c.json({ success: false, message: '购物车项不存在或无权限' }, 404);
    }
    
    if (quantity === 0) {
      // 删除商品
      await prisma.cartItem.delete({
        where: { id: itemId }
      });
    } else {
      // 更新数量
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity }
      });
    }
    
    // 返回更新后的购物车
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    return c.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('更新购物车失败:', error);
    return c.json({ success: false, message: '更新购物车失败' }, 500);
  }
});

// 清空购物车
cart.delete('/', async (c) => {
  const userId = c.get('userId');
  
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
    
    return c.json({ success: true, message: '购物车已清空' });
  } catch (error) {
    console.error('清空购物车失败:', error);
    return c.json({ success: false, message: '清空购物车失败' }, 500);
  }
});

export default cart;
```

### 订单和支付流程

订单模型设计：

```typescript
// prisma/schema.prisma
model Order {
  id            String      @id @default(cuid())
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  status        OrderStatus @default(PENDING)
  total         Decimal     @db.Decimal(10, 2)
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]
  paymentId     String?     @unique
  paymentIntent String?     // Stripe payment intent ID

  @@index([userId])
}

model OrderItem {
  id        String   @id @default(cuid())
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)
  orderId   String
  productId String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@index([productId])
}

enum OrderStatus {
  PENDING
  PROCESSING
  PAID
  COMPLETED
  CANCELLED
  REFUNDED
}
```

订单创建和支付处理：

```typescript
// server/api/orders.ts
import { Hono } from 'hono';
import { prisma } from '../lib/prisma';
import { auth } from '../middleware/auth';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '../lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const orders = new Hono();

// 中间件：确保用户已登录
orders.use('*', auth);

// 创建订单
orders.post('/', async (c) => {
  const userId = c.get('userId');
  
  try {
    // 获取用户购物车
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!cart || cart.items.length === 0) {
      return c.json({ success: false, message: '购物车为空' }, 400);
    }
    
    // 计算订单总金额
    const total = cart.items.reduce(
      (sum, item) => sum + (Number(item.product.price) * item.quantity),
      0
    );
    
    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    // 创建 Stripe 支付意向
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe 使用最小货币单位（分）
      currency: 'usd',
      metadata: {
        orderId: order.id
      }
    });
    
    // 更新订单的支付意向 ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: paymentIntent.id }
    });
    
    // 清空购物车
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    
    return c.json({
      success: true,
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    return c.json({ success: false, message: '创建订单失败' }, 500);
  }
});

// Stripe Webhook 处理支付成功
orders.post('/webhook', async (c) => {
  const sig = c.req.header('stripe-signature');
  const body = await c.req.text();
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      
      // 更新订单状态
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });
      
      // 为用户开通课程权限
      for (const item of order.items) {
        await prisma.userCourse.create({
          data: {
            userId: order.userId,
            productId: item.productId,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 一年有效期
          }
        });
      }
      
      // 发送订单确认邮件
      await sendOrderConfirmationEmail(order);
      
      return c.json({ received: true });
    }
    
    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook 错误:', error);
    return c.json({ success: false, message: 'Webhook 错误' }, 400);
  }
});

// 获取用户订单列表
orders.get('/', async (c) => {
  const userId = c.get('userId');
  
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return c.json({ success: true, orders });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return c.json({ success: false, message: '获取订单列表失败' }, 500);
  }
});

// 获取订单详情
orders.get('/:id', async (c) => {
  const userId = c.get('userId');
  const orderId = c.req.param('id');
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order || order.userId !== userId) {
      return c.json({ success: false, message: '订单不存在或无权限' }, 404);
    }
    
    return c.json({ success: true, order });
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return c.json({ success: false, message: '获取订单详情失败' }, 500);
  }
});

export default orders;
```

### 邮件发送服务

使用 Plunk 发送订单确认邮件：

```typescript
// server/lib/email.ts
import { Plunk } from '@plunk/node';
import { Order } from '@prisma/client';

const plunk = new Plunk(process.env.PLUNK_API_KEY!);

export async function sendOrderConfirmationEmail(order: any) {
  try {
    const { user, items } = order;
    
    // 格式化订单项目
    const formattedItems = items.map((item: any) => ({
      name: item.product.title,
      quantity: item.quantity,
      price: `$${Number(item.price).toFixed(2)}`,
      total: `$${(Number(item.price) * item.quantity).toFixed(2)}`
    }));
    
    // 发送邮件
    await plunk.emails.send({
      to: user.email,
      subject: `订单确认 #${order.id}`,
      template: 'order-confirmation',
      variables: {
        customerName: user.name,
        orderId: order.id,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        orderTotal: `$${Number(order.total).toFixed(2)}`,
        orderItems: formattedItems,
        orderStatus: '已支付',
        accessLink: `${process.env.FRONTEND_URL}/dashboard/courses`
      }
    });
    
    console.log(`订单确认邮件已发送至 ${user.email}`);
    return true;
  } catch (error) {
    console.error('发送订单确认邮件失败:', error);
    return false;
  }
}

export async function sendCourseAccessEmail(user: any, course: any) {
  try {
    await plunk.emails.send({
      to: user.email,
      subject: `您已获得「${course.title}」的访问权限`,
      template: 'course-access',
      variables: {
        customerName: user.name,
        courseName: course.title,
        courseDescription: course.description,
        accessLink: `${process.env.FRONTEND_URL}/courses/${course.id}`,
        expiryDate: '一年后到期'
      }
    });
    
    console.log(`课程访问邮件已发送至 ${user.email}`);
    return true;
  } catch (error) {
    console.error('发送课程访问邮件失败:', error);
    return false;
  }
}
```


## 代码部分

```js
// hono
import { Hono } from 'hono'
const app = new Hono()
```

```js
// plunk
export const sendMail: = async ({ to, subject, html, text }) => {
	const response = await fetch("https://api.useplunk.com/v1/send", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
            // PLUNK_API_KEY 需要从官网注册后台获取
			Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
		},
		body: JSON.stringify({
			to,
			subject,
			body: html,
			text,
		}),
	});

	if (!response.ok) {
		// logger.error(await response.json());
		throw new Error("Could not send email");
	}
};

```

```ts
// minio
export async function uploadUserMediaFile(
	file: File,
	type: "photo" | "video",
	onProgress?: (progress: number) => void,
): Promise<UploadResponse> {
	onProgress?.(10);
	
	const response = await fetch(
		`${API_BASE_URL}/user-media/upload?type=${type}&filename=${encodeURIComponent(file.name)}`,
		{
			method: "POST",
			headers: {
				"Content-Type": file.type,
			},
			body: file,
			credentials: "include",
		},
	);

	onProgress?.(90);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to upload file: ${error}`);
	}

	onProgress?.(100);
	return response.json();
}
```

```yml
version: '3.8'

services:
  # Next.js 应用
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NODE_OPTIONS=--max-old-space-size=4096
    deploy:
      resources:
        limits:
          memory: 3G
        reservations:
          memory: 1G
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL:-postgres://root:2121@postgres:5432/online_pay_project}
      - DIRECT_URL=${DIRECT_URL:-postgres://root:2121@postgres:5432/online_pay_project}
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://aaabbbbccc.com}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_VERCEL_URL=${NEXT_PUBLIC_VERCEL_URL:-https://aaabbbbccc.com}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID:-minioadmin}
      - S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY:-minioadmin123}
      - S3_ENDPOINT=${S3_ENDPOINT:-http://minio:9000}
      - S3_REGION=${S3_REGION:-us-east-1}
      - PLUNK_API_KEY=${PLUNK_API_KEY:-sk_XXX}
      - NEXT_PUBLIC_AVATARS_BUCKET_NAME=${NEXT_PUBLIC_AVATARS_BUCKET_NAME:-avatars}
      - STORAGE_PROVIDER=${STORAGE_PROVIDER:-s3}
    depends_on:
      - postgres
      - minio
    networks:
      - app-network
    restart: unless-stopped

  # PostgreSQL 数据库
  postgres:
    image: postgres:17-alpine
    container_name: postgres_online_pay_project
    environment:
      - POSTGRES_DB=online_pay_project
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD=2121
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped

  # MinIO 对象存储
  minio:
    image: minio/minio:RELEASE.2025-04-22T22-12-26Z
    container_name: minio_online_pay_project
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin123
    volumes:
      - ./minio/data:/data
    command: server /data --console-address ":9001"
    restart: unless-stopped
    networks:
      - app-network
volumes:
  postgres_data:
networks:
  app-network:
    driver: bridge

```



## 开发过程中的挑战与解决方案

### 挑战一：跨域资源共享 (CORS) 问题

在前后端分离的架构中，CORS 问题是我们最先遇到的挑战之一。当前端（Next.js）尝试访问后端 API（Hono）时，浏览器会阻止这些请求，因为它们来自不同的源。

**解决方案：**

```typescript
// server/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// 配置 CORS
app.use('/*', cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL!],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// 其他路由配置...

export default app;
```

这个解决方案看似简单，但在实际部署中，我们发现在 Docker 环境中，前端和后端的域名可能会发生变化。因此，我们采用了环境变量的方式，使 CORS 配置更加灵活。

### 挑战二：文件上传与存储
因为售卖的视频课程需要有具体的存储区域进行存放,可以让用户在登陆后访问的同时能做到快速,可靠的访问.我从AWS和自建OSS中选择了自建(因为docker现在比较方便).技术选型用了minio,`在250422`这个版本中可视化web界面是比较全的.如果你用minio:latest最新的可能web中管理的菜单会非常少,到时配置region和aksk都没有这个方便,建议和我一样.

在实现课程视频和图片上传功能时，我们面临了文件存储的挑战。最初考虑直接存储在服务器文件系统中，但这种方式在扩展性和可靠性方面存在问题。

**解决方案：**

我们选择了 MinIO 作为对象存储解决方案，它提供了与 Amazon S3 兼容的 API，但可以在本地部署。

```typescript
// server/lib/storage.ts
import { Client } from 'minio';
import { nanoid } from 'nanoid';

// 初始化 MinIO 客户端
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const bucketName = process.env.MINIO_BUCKET_NAME || 'ecommerce';

// 确保 bucket 存在
async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
      console.log(`Bucket '${bucketName}' created successfully`);
      
      // 设置 bucket 策略为公共读取
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`]
          }
        ]
      };
      
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
}

// 初始化存储
export async function initStorage() {
  await ensureBucketExists();
  console.log('Storage initialized successfully');
}

// 上传文件
export async function uploadFile(file: Buffer, originalName: string, contentType: string) {
  try {
    const fileExt = originalName.split('.').pop();
    const fileName = `${nanoid()}.${fileExt}`;
    
    await minioClient.putObject(bucketName, fileName, file, {
      'Content-Type': contentType
    });
    
    const fileUrl = `${process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`}/${bucketName}/${fileName}`;
    
    return { fileName, fileUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// 删除文件
export async function deleteFile(fileName: string) {
  try {
    await minioClient.removeObject(bucketName, fileName);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
```

这个解决方案不仅解决了文件存储问题，还提供了良好的扩展性。在生产环境中，我们可以轻松切换到 AWS S3 或其他兼容的对象存储服务，而无需修改大量代码。

### 挑战三：支付流程的对接

支付功能如果是对接国内的支付系统是要申请比较多的东西,阅读大量的api接入文档的,这里我们选择国际上主流的一款集成厂商:stripe, 他有方便的沙箱供调试,还有完善的文档,集成起来也比较方便.

实现支付功能时，安全性是首要考虑因素。我们需要确保支付流程安全可靠，同时避免重复支付或支付失败后未更新订单状态等问题。

**解决方案：**

我们采用了 Stripe 的支付意向（Payment Intent）API 和 Webhook 机制：

1. 创建订单时生成支付意向，并将订单 ID 存储在支付意向的元数据中
2. 前端使用 Stripe Elements 实现安全的支付表单
3. 使用 Webhook 接收支付成功通知，并更新订单状态

```typescript
// client/components/checkout/PaymentForm.tsx
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentForm({ clientSecret, orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Customer Name', // 这里应该使用表单收集的用户信息
        },
      }
    });
    
    if (result.error) {
      setError(`支付失败: ${result.error.message}`);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setError(null);
        // 支付成功后重定向到订单确认页面
        window.location.href = `/orders/confirmation/${orderId}`;
      }
    }
    
    setProcessing(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <label htmlFor="card-element">信用卡或借记卡</label>
        <CardElement
          id="card-element"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && <div className="card-error">{error}</div>}
      
      <button
        type="submit"
        disabled={processing || !stripe || succeeded}
        className="pay-button"
      >
        {processing ? '处理中...' : '支付'}
      </button>
      
      {succeeded && <p className="success-message">支付成功！</p>}
    </form>
  );
}
```

这种方式确保了支付流程的安全性，同时通过 Webhook 机制，即使用户在支付成功后关闭了浏览器，我们的系统也能正确处理订单状态。

## 自动化部署 (Docker)

在开发这个项目的过程中，我深刻体会到了容器化部署的重要性。使用 Docker 不仅简化了开发环境的搭建，还使得生产环境的部署变得更加可靠和一致。

### Docker Compose 配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-ecommerce}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  
  # MinIO 对象存储
  minio:
    image: minio/minio
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3
  
  # Redis 缓存
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
  
  # 后端 API 服务
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@postgres:5432/${POSTGRES_DB:-ecommerce}
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY:-minioadmin}
      MINIO_BUCKET_NAME: ecommerce
      MINIO_PUBLIC_URL: ${MINIO_PUBLIC_URL:-http://localhost:9000}
      REDIS_URL: redis://redis:6379
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      PLUNK_API_KEY: ${PLUNK_API_KEY}
      JWT_SECRET: ${JWT_SECRET:-your-secret-key}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      minio:
        condition: service_healthy
      redis:
        condition: service_started
  
  # 前端 Next.js 应用
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:8000}
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    environment:
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  minio_data:
  redis_data:
```

### 前端 Dockerfile

```dockerfile
# client/Dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm ci

# 复制源代码
COPY . .

# 设置环境变量
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# 构建应用
RUN npm run build

# 运行阶段
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 复制构建产物
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 后端 Dockerfile

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm ci

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["npm", "run", "start"]
```

### 自动化部署脚本

```bash
#!/bin/bash
# deploy.sh

echo "开始部署电商应用..."

# 加载环境变量
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 拉取最新代码
echo "拉取最新代码..."
git pull

# 构建并启动容器
echo "构建并启动 Docker 容器..."
docker-compose build
docker-compose up -d

# 运行数据库迁移
echo "运行数据库迁移..."
docker-compose exec backend npx prisma migrate deploy

echo "部署完成！应用已启动。"
echo "前端访问地址: http://localhost:3000"
echo "后端 API 地址: http://localhost:8000"
echo "MinIO 控制台: http://localhost:9001"
```

## 开发经验总结

在开发这个全栈电商项目的过程中，我遇到了不少挑战，也积累了一些宝贵的经验。想记录下来做一个沉淀,如果能帮到你,就更好了。

### 1. 技术选型很重要，但不要过度追求新技术

在这个项目中，我选择了 Next.js、Hono、Prisma 等相对较新的技术栈。这些技术确实提高了开发效率，但挑战也比较大，文档中文不是很友好,基本机翻加代码demo。
我的建议是：选择技术栈时，要平衡创新性和稳定性。对于核心业务逻辑，优先考虑成熟稳定的解决方案；对于非关键部分，可以尝试新技术以提升开发体验和性能。

### 2. 容器化是现代应用开发的必备技能

用过 Docker 进行部署的基本都知道有多爽,不想再回到那个拖包解压。在这个项目中，Docker 不仅简化了环境搭建，还解决了「在我的机器上能运行」的经典问题。
特别是对于包含多个服务的应用（前端、后端、数据库、对象存储等），Docker Compose 提供了一种优雅的方式来管理这些服务之间的依赖关系。一个简单的 `docker-compose up` 命令就能启动整个应用，这极大地提高了开发和部署效率。

### 3. 数据建模是系统设计的基础

在开始编写代码之前，我花了相当多的时间来设计数据模型。这包括定义实体之间的关系、确定字段类型、设置索引等。这个投资是值得的，因为良好的数据模型为后续的业务逻辑实现提供了坚实的基础。

使用 Prisma 这样的 ORM 工具，可以将数据模型定义为代码，并自动生成类型安全的数据库访问 API。这不仅提高了开发效率，还减少了运行时错误。

### 4. 安全性不容忽视

电商系统涉及用户数据和支付信息，安全性至关重要。在这个项目中，我实施了多层次的安全措施：

- 使用 JWT 进行身份验证和授权
- 将敏感信息（如密码）进行哈希处理
- 使用 HTTPS 加密传输数据
- 实施 CORS 策略控制资源访问
- 使用 Stripe 处理支付，避免直接接触信用卡信息

这些措施虽然增加了一些开发工作量，但对于保护用户数据和维护系统安全是必不可少的。

### 5. 错误处理和日志记录是生产环境的救命稻草

在开发过程中，我逐渐认识到全面的错误处理和日志记录的重要性。当系统在生产环境中运行时，没有人能够实时监控控制台输出。完善的错误处理和日志记录机制可以帮助我们快速定位和解决问题。

在这个项目中，我实现了结构化的错误处理和日志记录，包括：

- 使用 try-catch 块捕获异常
- 返回统一格式的错误响应
- 记录详细的错误信息，包括时间戳、错误类型、错误消息和堆栈跟踪
- 对于关键操作（如支付处理），记录更详细的上下文信息

这些实践大大提高了系统的可维护性和可靠性。

### 过程和思考

构建一个全栈电商系统是一个复杂而有挑战性的任务，但也是一个非常有价值的学习经历。通过这个项目，我不仅深入理解了现代 Web 开发技术，还学习了如何设计和实现一个可扩展、安全、高性能的应用。

希望这篇博客能够帮助你了解全栈电商系统的开发过程，并为你提供一些有用的见解和实践经验。如果你正在考虑开发类似的系统，我强烈建议你采用容器化技术（如 Docker）来简化开发和部署流程。这将为你节省大量时间，并使你的系统更加可靠和一致。

最后，记住软件开发是一个不断学习和改进的过程。不要害怕尝试新技术，但也要明智地选择适合你项目需求的解决方案。祝你开发顺利！
* 数据库 直接使用 postgresql 数据库
* OSS存储 直接使用 minio 存储
* 支付 直接使用 stripe 支付
* 邮件推送 直接使用 plunk 邮件推送

部署部分因为之前已经写过文章了,可以直接参考docker部分

 

## 参考
* docker
* minio 250422版本
* postgresql 文档
* hono 
* zod 生成
* stripe 文档