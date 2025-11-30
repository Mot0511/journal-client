import sortLessons from "../utils/sortLessons";
import { deleteR, get, post, put } from "./request";

class LessonService {
    static async getAll(subjectID: number, groupID: number, typeSubjectID: number) {
        const data = await get('/grades/lessons/journal', {
            subjectId: subjectID,
            groupId: groupID,
            typeSubjectId: typeSubjectID
        })

        sortLessons(data)

        return data
    }
    
    static async getByStudent(studenetID: number) {
        const data = await get(`/lessons/student/${studenetID}`)
        return data
    }

    static async create(studentId: number, subjectId: number, typeSubject: number, mark: string, date: string) {
        const res = await post('/grades/lessons', {
            studentId,
            subjectId,
            typeSubject,
            mark,
            date
        })
        return res
    }

    static async createBulk(groupId: number, subjectId: number, typeSubjectId: number, date: string) {
        await post('/grades/lessons/bulk', {
            groupId,
            subjectId,
            typeSubjectId,
            date,
            defaultMark: " "
        })
    }

    static async update(id: number, typeSubject: number, mark: string, date: string) {
        await put(`/grades/lessons/${id}`, {
            typeSubject,
            mark,
            date
        })
    }

    static async delete(subjectId: number, subjectType: number, date: string) {
        await deleteR(`/grades/lessons/${subjectId}/${subjectType}/${date}`)
    }

    static async deleteById(lessonID: number) {
        await deleteR(`/grades/lessons/${lessonID}`)
    }
}


export default LessonService