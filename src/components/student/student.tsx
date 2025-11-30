import { useEffect, useState } from 'react'
import cl from './student.module.sass';
import type StudentType from '../../types/student';
import type { ScoresType } from '../../types/scores';
import Cell from '../cell/cell';
// Один студент
const Student = (
    {
        student,
        onSelected,
        onSetCellValue,
        onSetLabTaskValue,
        selectedCell,
        setSelectedCell,
        scores
    }: {
        student: StudentType
        onSelected: (studentID: number, isSelected: boolean) => void
        onSetCellValue: (student: StudentType, lessonID: number, lessonType: string, value: string, valueType: string) => void
        onSetLabTaskValue: (student: StudentType, labID: number, taskID: number, value: string, valueType: string) => void
        selectedCell: number | null,
        setSelectedCell: (lessonID: number | null) => void,
        scores: ScoresType
    }) => {

    const [isSelected, setIsSelected] = useState<boolean>(false) // выделен ли студент
    
    const [lecturePresneces, setLecturePresences] = useState<number>(0) // кол-во посещений лекций
    const [practicePresneces, setPracticePresences] = useState<number>(0) // кол-во посещений практик
    const [labDones, setLabDones] = useState<number>(0) // кол-во выполненных лаб
    const [summary, setSummary] = useState<number>(0) // сумма
    const [role, setRole] = useState<string | null>()

    useEffect(() => {
        getLecturePresences()
        getPracticePresences()
        getLabDones()
        getSummary()
        
        setRole(localStorage.getItem('role'))
    }, [JSON.stringify(student)])

    // Получение кол-ва посещений лекций
    const getLecturePresences = () => {
        let count = 0
        student.lectures.forEach(lecture => {
            if (lecture.value != 'Н') count++
        })

        setLecturePresences(count)
    }

    // Получение кол-ва посещений практик
    const getPracticePresences = () => {
        let count = 0
        student.practices.forEach(practice => {
            if (practice.value != 'Н') count++
        })

        setPracticePresences(count)
    }

    // Получение кол-ва выполненных лаб
    const getLabDones = () => {
        let count = 0
        student.labs.forEach(lab => {
            let tasks_count = 0
            lab.tasks.forEach(task => {
                if (task.value != ' ') tasks_count++
            })
            if (tasks_count == lab.tasks.length) count++
        })
        setLabDones(count)
    }

    // Получение суммы
    const getSummary = () => {
        let summary = 0

        student.lectures.forEach(lecture => {
            for (let score of scores.lectures) {
                if (score.mark == lecture.value) {
                    summary += score.score
                    break
                }
            }
        })

        student.practices.forEach(practice => {
            for (let score of scores.practices) {
                if (score.mark == practice.value) {
                    if (score.score > 0) {
                        summary += score.score
                    } else {
                        summary -= score.score
                    }
                }
            }
        })

        student.labs.forEach(lab => {
            lab.tasks.forEach(task => {
                for (let score of scores.labs) {
                    if (score.mark == task.value) {
                        if (score.score > 0) {
                            summary += score.score
                        } else {
                            summary -= score.score
                        }
                        break
                    }
                }
            })
        })

        setSummary(summary)
    }

    return (
        <div 
            className={cl.student}
            style={{backgroundColor: isSelected ? '#F0F3F9' : '#ffffff'}} 
            onClick={() => {
                onSelected(student.id, !isSelected)
                setIsSelected(!isSelected)
            }}
        >
            <div className={cl.student_name}>
                <p>{student.name}</p>
            </div>
            {/* Оценки по лекциям */}
            <div className={cl.marks + ' ' + cl.lectures_marks} style={{minWidth: role == 'student' ? '90px' : undefined}}>
                {
                    student.lectures.map((lecture) => 
                        <Cell
                            lesson={lecture}
                            scores={scores.lectures}
                            isSelected={selectedCell == lecture.cellID}
                            setSelectedCell={(value: number | null) => {
                                setSelectedCell(value)
                            }}
                            onSetCellValue={(value: string, valueType: string) => {
                                onSetCellValue(student, lecture.id, 'lecture', value, valueType)
                            }}
                        />
                    )
                }
            </div>
            {/* Оценки по практикам */}
            <div className={cl.marks + ' ' + cl.practic_marks} style={{minWidth: role == 'student' ? '105px' : undefined}}>
                {
                    student.practices.map((practice) => 
                        <Cell 
                            lesson={practice}
                            scores={scores.practices}
                            isSelected={selectedCell == practice.cellID}
                            setSelectedCell={setSelectedCell}
                            onSetCellValue={(value: string, valueType: string) => {
                                onSetCellValue(student, practice.id, 'practice', value, valueType)
                            }}
                        />
                    )
                }
            </div>
            {/* Лабы */}
            <div className={cl.marks + ' ' + cl.labs_marks} style={{minWidth: role == 'student' ? '200px' : undefined}}>
                <div className={cl.labs}>
                    {
                        student.labs.map((lab) => {
                            let count = -1
                            return <div className={cl.lab}>
                                {
                                    lab.tasks.map(task => {
                                        count += 1
                                        return <Cell 
                                            lesson={task}
                                            isSelected={selectedCell == task.id}
                                            scores={scores.labs}
                                            setSelectedCell={setSelectedCell}
                                            onSetCellValue={(value: string, valueType: string) => {
                                                onSetLabTaskValue(student, lab.id, task.id, value, valueType)
                                            }}
                                        />
                                    }
                                    )
                                }
                            </div>
                        })
                    }
                </div>
            </div>
            {/* Итоги */}
            <div className={cl.counts}>
                <p className={cl.table_value}>{lecturePresneces}/{student.lectures.length}</p>
                <p className={cl.table_value}>{practicePresneces}/{student.practices.length}</p>
                <p className={cl.table_value}>{labDones}/{student.labs.length}</p>
            </div>
            <div className={cl.summary}>
                <p className={cl.table_sum}>{summary}</p>
            </div>
        </div>
    )
}
export default Student;