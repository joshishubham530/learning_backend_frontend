import { Request } from 'express'

export interface IEmp {
  firstName: string
  lastName: string
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

export interface IRequestWithEmp extends Request {
  emp: IEmpToken
}
