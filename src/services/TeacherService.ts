import { post } from "./request";

class TeacherService {
    static async auth(login: string, password: string) {
        const res = await post('/auth/login/teacher', {
            login: login,
            password: password
        })
        
        return res
    }

    static async getData() {
        const res = await post('/auth/me')

        if (res.role == 'teacher') {
            return res.user
        }

        return null
    }
}


export default TeacherService