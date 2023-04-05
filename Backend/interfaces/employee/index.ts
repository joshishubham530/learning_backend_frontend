import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export interface IEmp {
  nmae: string
  type: string
  email: string
  phone: number
  password: string
  organization: string
}

export interface IEmpToken {
  id: number
  firstName: string
  type: string
  organization: string
}

export interface IForgotPassToken {
  email: string
}

export interface IRequestWithEmp extends Request {
  emp: IEmpToken
}

export interface IAdminToken extends JwtPayload {
  id: number
  role: string
}
