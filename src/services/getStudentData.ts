import getRandomInt from "../utils/random"
import GroupService from "./GroupService"
import LabService from "./LabService"
import LessonService from "./LessonService"
import StudentService from "./StudentService"

export default async (subjectID: number) => {
    const studentID = Number(localStorage.getItem('id'))
    const student = await StudentService.getMe()

    const activities = await LabService.getActivitiesByStudent(studentID)
    const labs = {}
    for (let activity of activities) {
        if (activity.TaskId in labs && activity.SubjectId == subjectID) {
            // @ts-ignore
            labs[activity.TaskId].push(activity)
            continue
        }
        // @ts-ignore
        labs[activity.TaskId] = [activity]
    }
    for (let lab in labs) {
        student.labs.push(
            {
                id: Number(lab),
                // @ts-ignore
                date: `${labs[lab][0].Date.split('-')[2].split('T')[0]}/${labs[lab][0].Date.split('-')[1]}`,
                // @ts-ignore
                tasks: labs[lab].map((activity: any) => {
                    return {
                        id: activity.id,
                        value: activity.Mark,
                        valueType: 'checkbox',
                    }
                }),
                // @ts-ignore
                number: labs[lab][0].Meta,
            }
        )
    }

    const lessons = await LessonService.getByStudent(studentID)
    for (let lesson of lessons) {
        if (lesson.SubjectId == subjectID) {
            if (lesson.TypeSubject == '1') {
                student.lectures.push({
                    id: lesson.id,
                    cellID: lesson.id + getRandomInt(1, 10000),
                    value: lesson.Mark,
                    valueType: 'symbol',
                    date: `${lesson.Date.split('-')[2].split('T')[0]}/${lesson.Date.split('-')[1]}`,
                })
            } else if (lesson.TypeSubject == '2') {
                student.practices.push({
                    id: lesson.id,
                    cellID: lesson.id + getRandomInt(1, 10000),
                    value: lesson.Mark,
                    valueType: 'symbol',
                    date: `${lesson.Date.split('-')[2].split('T')[0]}/${lesson.Date.split('-')[1]}`,
                })
            }
        }
    }

    const groupID = Number(localStorage.getItem('groupID'))
    const group = await GroupService.getGroup(groupID)
    group.students.push(student)
    return [group]
}