import type GroupType from "../types/group";
import type StudentType from "../types/student";
import getRandomInt from "../utils/random";
import GroupService from "./GroupService";
import LabService from "./LabService";
import LessonService from "./LessonService";
import StudentService from "./StudentService";

const getShortDate = (longDate: string) => {
    return `${longDate.split('-')[2].split('T')[0]}/${longDate.split('-')[1]}`
}

export default async (subjectID: number) => {
    const teacherID = Number(localStorage.getItem('id'))
    const groups: GroupType[] = await GroupService.getGroups()
    const students: StudentType[] = await StudentService.getAll()
    
    for (let group of groups) {
        group.students = students.filter(student => student.groupID == group.id)

        const lectures = await LessonService.getAll(subjectID, group.id, 1)
        const practices = await LessonService.getAll(subjectID, group.id, 2)
        const activities = await LabService.getActivities(teacherID, subjectID, group.id)
        for (let student of group.students) {
            for (let lecture of lectures) {
                if (lecture.StudentId == student.id) {
                    const date = new Date(lecture.Date)
                    date.setDate(date.getDate() + 1)
                    student.lectures.push({
                        id: lecture.id,
                        cellID: lecture.id + getRandomInt(1, 10000),
                        value: lecture.Mark,
                        valueType: 'symbol',
                        date: getShortDate(date.toISOString())
                    })
                }
            }
            for (let practice of practices) {
                if (practice.StudentId == student.id) {
                    const date = new Date(practice.Date)
                    date.setDate(date.getDate() + 1)
                    student.practices.push({
                        id: practice.id,
                        cellID: practice.id + getRandomInt(1, 10000),
                        value: practice.Mark,
                        valueType: 'symbol',
                        date: getShortDate(date.toISOString())
                    })
                }
            }
            const labs = {}
            for (let activity of activities) {
                if (activity.StudentId == student.id) {
                    if (activity.TaskId in labs) {
                        // @ts-ignore
                        labs[activity.TaskId].push(activity)
                        continue
                    }
                    // @ts-ignore
                    labs[activity.TaskId] = [activity]
                }
            }
            for (let lab in labs) {
                // @ts-ignore
                const date = new Date(labs[lab][0].Date)
                date.setDate(date.getDate() + 1)
                student.labs.push(
                    {
                        id: Number(lab),
                        // @ts-ignore
                        date: getShortDate(date.toISOString()),
                        // @ts-ignore
                        tasks: labs[lab]
                            .sort((activity1: any, activity2: any) => activity1.Number - activity2.Number)
                            .map((activity: any) => {
                                return {
                                    id: activity.id,
                                    value: activity.Mark,
                                    valueType: 'checkbox',
                                }
                            }),
                        // @ts-ignore
                        number: labs[lab][0].TaskNumber,
                    }
                )
            }
            student.labs.sort((lab1: any, lab2: any) => lab1.number - lab2.number)
        }
    }
    return groups
}