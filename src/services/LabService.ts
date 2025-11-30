import { deleteR, get, post, put } from "./request";

class LabService {
    static async getActivities(teacherId: number, subjectId: number, groupId: number) {
        const data = await get('/grades/activities/journal', {
            teacherId,
            subjectId,
            groupId
        })
        return data
    }

    static async getActivitiesByStudent(studentID: number) {
        const data = await get(`/grades/activities/student/${studentID}`)
        return data
    }

    static async createActivity(data: any) {
        const res = await post('/grades/activities', data)
        return res
    }

    static async updateActivity(
        id: number,
        taskId: number, 
        taskTypeId: number, 
        meta: string, 
        mark: string
    ) {
        await put(`/grades/activities/${id}`, {
            taskId,
            taskTypeId,
            meta,
            mark
        })
    }

    static async deleteActivity(id: number) {
        await deleteR(`/grades/activities/${id}`)
    }

    static async deleteLab(id: number) {
        await deleteR(`/grades/labs/${id}`)
    }
}

export default LabService