import { get } from "./request";

class SubjectService {
    static async getAll() {
        const data = await get('/subjects')
        const subjects = data.map((subject: any) => {
            return {
                id: subject.id,
                title: subject.Title
            }
        })
        return subjects
    }
}

export default SubjectService