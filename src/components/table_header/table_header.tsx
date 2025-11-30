import cl from './table_header.module.sass';
import type GroupType from '../../types/group';
import { useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import TasksModal from '../tasks_modal/tasks_modal';
import type LabType from '../../types/lab';
import ScoresModal from '../scores_modal/scores_modal';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import type StudentType from '../../types/student';
import type { ScoresType, ScoreType } from '../../types/scores';
// Шапка таблицы
const TableHeader = (
        {
            groups,
            editDate,
            selectedColumns,
            setSelectedColumns,
            editLabTasks,
            scores,
            setScores,
            hiddenStudents,
            setHiddenStudents,
            isFiltersCollapsed,
            setIsFiltersCollapsed
        }: 
        {
            groups: GroupType[]
            editDate: (lessonID: number, lessonType: string, date: string) => void
            selectedColumns: any[],
            setSelectedColumns: (columns: any[]) => void
            editLabTasks: (labID: number, tasksCount: number) => void,
            scores: ScoresType,
            setScores: (scores: ScoresType) => void,
            hiddenStudents: number[],
            setHiddenStudents: (students: number[]) => void
            isFiltersCollapsed: boolean,
            setIsFiltersCollapsed: (state: boolean) => void
        }
    ) => {

    const [role, setRole] = useState<string | null>('student')

    const [editingLesson, setEditingLesson] = useState<any>() // изменяющийся урок
    const [editingLessonValue, setEditingLessonValue] = useState<string>('') // изменяющиеся значение даты

    const [editingLab, setEditingLab] = useState<LabType | null>() // изменяющаяся лаба
    const [editingLessonsType, setEditingLessonsType] = useState<string | null>() // тип уроков, у которых изменяется разбалловка
    const [isHideEverybody, setIsHideEverybody] = useState<boolean>(false) // скрыть ли всех студентов группы

    useEffect(() => {
        setRole(localStorage.getItem('role'))
    }, [])

    // Получение массива студентов
    const getStudents = (): StudentType[] => {
        const students: StudentType[] = []
        groups.forEach(group => {
            group.students.forEach(student => students.push(student))
        })
        return students
    }

    return (
        <div className={cl.table_header}>
            {/* Модальное окно "Изменить кол-во заданий" */}
            {
                editingLab &&
                    <TasksModal
                        onEditTasks={(tasksCount: number) => {
                            editLabTasks(editingLab.id, tasksCount)
                            setEditingLab(null)
                        }}
                        onCancel={() => {
                            setEditingLab(null)
                        }}
                        tasksCount={editingLab.tasks.length}
                    />
            }
            {/* Модальное окно "Настройка оценок" */}
            {
                editingLessonsType &&
                    <ScoresModal
                        lessonsType={editingLessonsType}
                        scoresData={scores}
                        setScoresData={(newScores: ScoreType[]) => {
                            switch (editingLessonsType) {
                                case 'lectures':
                                    scores.lectures = newScores
                                    break
                                case 'practices':
                                    scores.practices = newScores
                                    break
                                case 'labs':
                                    scores.labs = newScores
                            }
                            setScores(scores)
                            setEditingLessonsType(null)
                        }}
                        onCancel={() => setEditingLessonsType(null)}
                    />
            }
            <div className={cl.student_name_box + ' ' + cl.table_header_box}>
                <div style={{display: 'flex'}}>
                    <div>
                        <h3>ФИО</h3>
                    </div>
                    <button onClick={_ => setIsFiltersCollapsed(!isFiltersCollapsed)}>
                        {   
                            isFiltersCollapsed 
                                ? <MdArrowDropDown /> 
                                : <MdArrowDropUp />
                        }
                    </button>
                </div>
                {/* Выпадающее меню с фильтрами */}
                {
                    !isFiltersCollapsed &&
                        <div className={cl.filters}>
                            <div className={cl.student}>
                                <input type="checkbox" checked={!isHideEverybody} onClick={() => {
                                   if (isHideEverybody) {
                                        setHiddenStudents([])
                                        setIsHideEverybody(false)
                                   } else {
                                        setHiddenStudents(getStudents().map(student => student.id))
                                        setIsHideEverybody(true)
                                   }

                                }} />
                                <p>Выделить все</p>
                            </div>
                            {
                                getStudents().map(student => 
                                    <div className={cl.student}>
                                        <input type="checkbox" checked={!hiddenStudents.includes(student.id)} onClick={() => {
                                            if (hiddenStudents.includes(student.id)) {
                                                setHiddenStudents(hiddenStudents.filter(studentID => studentID != student.id))
                                            } else {
                                                setHiddenStudents([...hiddenStudents, student.id])
                                            }
                                        }} />
                                        <p><label>{student.name}</label></p>
                                    </div>
                                )
                            }
                        </div>
                }
            </div>
            {/* Блок с лекциями */}
            <div className={cl.table_header_box + ' ' + cl.lessons_header_box}>
                <div className={cl.lectures_header}>
                    <h3>Лекции</h3>
                    {
                        role == 'teacher' && <button className={cl.scoresBtn} onClick={() => setEditingLessonsType('lectures')}><IoSettingsOutline /></button>
                    }
                    
                </div>
                <div className={cl.days}>
                    {
                        groups[0].students.length ?
                        groups[0].students[0].lectures.map(lecture => {
                            return <div 
                                className={cl.day} 
                                style={{backgroundColor: selectedColumns.includes(lecture) ? '#F0F3F9' : 'white'}} 
                                onClick={() => {
                                    if (selectedColumns.includes(lecture)) {
                                        setSelectedColumns(selectedColumns.filter(lesson => lesson != lecture))
                                    } else {
                                        setSelectedColumns([...selectedColumns, lecture])
                                    }

                                }}>
                                {
                                    editingLesson?.lessonID == lecture.id
                                        ? <input 
                                            type="text"
                                            value={editingLessonValue}
                                            onChange={e => setEditingLessonValue(e.target.value)}
                                            onClick={e => e.stopPropagation()}
                                            onBlur={() => {
                                                editDate(lecture.id, 'lecture', editingLessonValue)
                                                setEditingLesson(null)
                                                setEditingLessonValue('')
                                            }}
                                        />
                                        : <p onClick={e => {
                                            e.stopPropagation()
                                            setEditingLessonValue(lecture.date)
                                            setEditingLesson({
                                                lessonType: 'lecture',
                                                lessonID: lecture.id,
                                            })
                                        }}>{lecture.date}</p>
                                }
                            </div>
                        }
                            
                        ) : <></>
                    }
                </div>
            </div>
            {/* Блок с практиками */}
            <div className={cl.table_header_box + ' ' + cl.lessons_header_box}>
                <div className={cl.practices_header}>
                    <h3>Практика</h3>
                    {
                        role == 'teacher' && <button className={cl.scoresBtn} onClick={() => setEditingLessonsType('practices')}><IoSettingsOutline /></button>
                    }
                </div>
                <div className={cl.days}>
                    {
                        groups[0].students.length ?
                        groups[0].students[0].practices.map(practice => 
                            <div 
                                className={cl.day}
                                style={{backgroundColor: selectedColumns.includes(practice) ? '#F0F3F9' : 'white'}} 
                                onClick={() => {
                                    if (selectedColumns.includes(practice)) {
                                        setSelectedColumns(selectedColumns.filter(lessonID => lessonID != practice))
                                    } else {
                                        setSelectedColumns([...selectedColumns, practice])
                                    }

                                }}>
                                {
                                    editingLesson?.lessonID == practice.id
                                    ? <input 
                                        type="text"
                                        value={editingLessonValue}
                                        onChange={e => setEditingLessonValue(e.target.value)}
                                        onClick={e => e.stopPropagation()}
                                        onBlur={() => {
                                            editDate(practice.id, 'practice', editingLessonValue)
                                            setEditingLesson(null)
                                            setEditingLessonValue('')
                                        }}
                                    />
                                    : <p onClick={e => {
                                        e.stopPropagation()
                                        setEditingLessonValue(practice.date)
                                            setEditingLesson({
                                            lessonType: 'practice',
                                            lessonID: practice.id,
                                        })
                                    }}>{practice.date}</p>
                                }
                            </div>
                        ) : <></>
                    }
                </div>
            </div>
            {/* Блок с лабами */}
            <div className={cl.table_header_box + ' ' + cl.labs_header_box}>
                <div className={cl.labs_header}>
                    <h3>Лабораторные работы</h3>
                    {
                        role == 'teacher' && <button className={cl.scoresBtn} onClick={() => setEditingLessonsType('labs')}><IoSettingsOutline /></button>
                    }
                </div>
                <div className={cl.labs}>
                    {
                        groups[0].students.length ?
                        groups[0].students[0].labs.map(lab => {
                            let num = 0
                            return <div 
                                className={cl.lab} 
                                style={{width: 30 * lab.tasks.length + (role == 'teacher' ? 10 : 5), backgroundColor: selectedColumns.includes(lab) ? '#F0F3F9' : 'white'}} 
                                onClick={() => {
                                    if (selectedColumns.includes(lab)) {
                                        setSelectedColumns(selectedColumns.filter(lessonID => lessonID != lab))
                                    } else {
                                        setSelectedColumns([...selectedColumns, lab])
                                    }

                                }}>
                                <div className={cl.lab_header}>
                                    <span className={cl.lab_title}>Лабораторная работа</span>
                                    <span className={cl.lab_number}>{lab.number}</span>
                                    {
                                        role == 'teacher' && <button onClick={e => {
                                            e.stopPropagation()
                                            setEditingLab(lab)
                                        }}><IoSettingsOutline /></button>
                                    }
                                    
                                </div>
                                
                                <div className={cl.lab_tasks}>
                                    {
                                        lab.tasks.map(_ => {
                                            num += 1
                                            return <div className={cl.lab_task}>{num}</div>
                                        })
                                    }   
                                </div>
                            </div>
                        }) : <></>
                    }
                </div>
            </div>
            {/* Итоги */}
            <div className={cl.table_header_box + ' ' + cl.summary_header_box}>
                <p>Посещение<br /> лекций</p>
                <p>Посещение<br /> практик</p>
                <p>Сдача<br /> лабораторных<br /> работ</p>
            </div>
            <div className={cl.table_header_box}>
                <h3>Сумма</h3>
            </div>
        </div>
    )
}
export default TableHeader;