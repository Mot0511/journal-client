import type StudentType from "../types/student";
import { get, post, deleteR} from "./request";

class StudentService {

  static async auth(login: string, password: string) {
    const res = await post('/auth/login/student', {
        login: login,
        password: password
    })
    return res
  }

  static async getMe(): Promise<StudentType> {
    const student = await get('/students/me')
    return {
      id: student.id,
      name: `${student.FirstName} ${student.LastName} ${student.MiddleName}`,
      groupID: student.GroupId,
      lectures: [],
      practices: [],
      labs: [],
      lecture_presences: 0,
      practice_presences: 0,
      lab_dones: 0,
      summary: 0,
    }
  }

  static async getAll(): Promise<StudentType[]> {
    const data = await get(`/students`)
    const res: StudentType[] = data.map((student: any) => {
      return {
        id: student.id,
        name: `${student.FirstName} ${student.LastName} ${student.MiddleName}`,
        groupID: student.GroupId,
        lectures: [],
        practices: [],
        labs: [],
        lecture_presences: 0,
        practice_presences: 0,
        lab_dones: 0,
        summary: 0,
      }
    })
    return res
  }

  static async create(userdata: any) {
    const user = await post('/students', {
      login: userdata.login,
      password: userdata.password,
      lastName: userdata.lastName,
      firstName: userdata.name,
      middleName: userdata.middleName,
      groupId: userdata.groupID,
      vyatsuMail: ""
    })
    return user
  }

  static async delete(id: number) {
    await deleteR(`/students/${id}`)
  }
}


export default StudentService