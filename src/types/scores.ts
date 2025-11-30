// Описание настройки одной оценки
interface ScoreType {
    id: number
    type: string
    mark: string
    score: number
}

// Описание совокупности настроек всех оценок
interface ScoresType {
    lectures: ScoreType[]
    practices: ScoreType[]
    labs: ScoreType[]
}

export type {ScoreType, ScoresType}