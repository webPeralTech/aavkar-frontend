export type Customer = {
  _id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  gst_no?: string
  address?: string
  city?: string
  notes?: string
}

export type ReferralsType = {
  _id: string
  user: string
  email: string
  avatar: string
  referredId: string
  status: string
  value: string
  earning: string
}

export type ReviewType = {
  _id: string
  product: string
  companyName: string
  productImage: string
  reviewer: string
  email: string
  avatar: string
  date: string
  status: string
  review: number
  head: string
  para: string
}

export type ProductType = {
  _id: string
  productName: string
  category: string
  stock: boolean
  sku: number
  price: string
  qty: number
  status: string
  image: string
  productBrand: string
}

export type OrderType = {
  _id: string
  order: string
  customer: string
  email: string
  avatar: string
  payment: number
  status: string
  spent: number
  method: string
  date: string
  time: string
  methodNumber: number
}

export type ECommerceType = {
  products: ProductType[]
  orderData: OrderType[]
  customerData: Customer[]
  reviews: ReviewType[]
  referrals: ReferralsType[]
}
