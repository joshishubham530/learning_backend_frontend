type Gender = 'male' | 'female' | 'other'
interface IUser {
  name: string
  age: number
  gender: Gender
}

export const getUser = (): IUser => {
  return { name: 'Test User', age: 24, gender: 'male' }
}
