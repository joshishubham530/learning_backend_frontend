type Gender = 'male' | 'female' | 'other'
interface IUser {
  name: string
  age: number
  gender: Gender
}

export const getUser = (): IUser => {
  return { name: 'Test User', age: 24, gender: 'male' }
}

export const generateDummyJobData = (): any => {
  const titles: string[] = [
    'Software Engineer',
    'UI/UX Developer',
    'ML Engineer',
    'Database Engineer',
    'Devops Engineer',
    'Full Stack Developer',
  ]

  const employeeIds = [2, 5, 8, 9, 10, 11]

  const salary = [
    [20000, 40000],
    [30000, 60000],
    [40000, 80000],
    [70000, 150000],
    [100000, 150000],
    [50000, 100000],
  ]

  const experience = [
    [0, 2],
    [1, 5],
    [2, 3],
    [2, 6],
    [3, 6],
    [6, 10],
  ]

  const types = ['FULL-TIME', 'PART-TIME', 'REMOTE', 'INTERN', 'CONTRACT', 'TRAINING']

  const cities = ['Mohali', 'Delhi', 'Noida', 'Banglore', 'Indore', 'Gurgaon']
  const departments = [
    'Software Development',
    'Quality Engineering',
    'Management',
    'Finance',
    'Talent Acquisition',
    'Design',
    'Human Resources',
    'Project Management',
    'Networking',
    'Marketing',
    'Administration',
  ]
  const jobReq = ['c', 'database', 'webdev']
  const jobRes = ['tema leader', 'verry verry good']

  const title: string = titles[Math.floor(Math.random() * 10) % 6]
  const salaryRng: number[] = salary[Math.floor(Math.random() * 10) % 6]
  const experienceRng: number[] = experience[Math.floor(Math.random() * 10) % 6]
  const type: string[] = [types[Math.floor(Math.random() * 10) % 6]]
  const city: string = cities[Math.floor(Math.random() * 10) % 6]
  const keywords = [...title.toLowerCase().split(' '), city.toLowerCase(), type[0].toLowerCase(), 'all']
  const employeeId = employeeIds[Math.floor(Math.random() * 10) % 6]
  const description =
    "It's always good to bring a slower friend with you on a hike. If you happen to come across bears, the whole group doesn't have to worry. Only the slowest in the group do. That was the lesson they were about to learn that day."
  const department = departments[Math.floor(Math.random() * 10) % 11]
  return { title, salaryRng, experienceRng, type, city, keywords, jobReq, jobRes, employeeId, description, department }
}
