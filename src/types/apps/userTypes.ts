// Type Imports
import type { ThemeColor } from '@core/types'

// export type UsersType = {
//   id: number
//   role: string
//   email: string
//   status: string
//   avatar: string
//   company: string
//   country: string
//   contact: string
//   fullName: string
//   username: string
//   currentPlan: string
//   avatarColor?: ThemeColor
//   billing: string
// }
export type UsersType = {
  _id: string
  role: string
  email: string
  isActive: boolean
  firstName: string
  lastName: string
  avatarColor?: ThemeColor
  password?: string
}
