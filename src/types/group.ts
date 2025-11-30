import type Student from "./student"

// Описание группы
export default interface GroupType {
    id: number
    title: string
    students: Student[]
}