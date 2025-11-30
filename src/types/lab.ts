// Описание задания в лабе
interface LabTask {
    id: number
    value: string
    valueType: string
}

// Описание лабы
export default interface LabType {
    id: number
    number: number
    date: string
    tasks: LabTask[]
}