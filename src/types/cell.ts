// Описание ячейки
export default interface CellType {
    id: number
    studentID?: string
    lessonID: number
    lessonType: string
    value: string
    valueType: string
}