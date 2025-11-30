import { useEffect, useState } from 'react'
import '../../globals.css';
import Header from '../../components/header/header';
import Table from '../../components/table/table';
import type GroupType from '../../types/group';
import type {ScoresType} from '../../types/scores';
import {groups_data, scores_data} from '../../data'
import alphabet from '../../consts/alphabet';
import type StudentType from '../../types/student';
import getRandomInt from '../../utils/random';
import { useNavigate } from 'react-router';
import getTeacherData from '../../services/getTeacherData';
import StudentService from '../../services/StudentService';
import LessonService from '../../services/LessonService';
import LabService from '../../services/LabService';
import getDBDate from '../../utils/getDBDate';
import getStudentData from '../../services/getStudentData';
import Subjects from '../../components/subjects/subjects';
import type SubjectType from '../../types/subject';
import SubjectService from '../../services/SubjectService';
import type LectureType from '../../types/lecture';
import type PracticeType from '../../types/practice';
import type LabType from '../../types/lab';

const Home = () => {
    
    const navigate = useNavigate()

    // Состояния и локальные хранилища данных
    const [teacher, setTeacher] = useState<string>('ФИО преподавателя');
    const [subjects, setSubjects] = useState<SubjectType[]>([])
    const [selectedSubject, setSelectedSubject] = useState<SubjectType>();
    const [groups, setGroups] = useState<GroupType[]>(groups_data)
    const [scores, setScores] = useState<ScoresType>(scores_data)

    const [selectedStudents, setSelectedStudents] = useState<number[]>([])
    const [selectedColumns, setSelectedColumns] = useState<any[]>([])
    const [hiddenStudents, setHiddenStudents] = useState<number[]>([])
    const [isFiltersCollapsed, setIsFiltersCollapsed] = useState<boolean>(true)

    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        loadSubjects()
    }, [])

    useEffect(() => {
        loadData()
    }, [selectedSubject])

    const loadData = async () => {
        if (!localStorage.getItem('token')) navigate('/signin')
        const role = localStorage.getItem('role')
        let data = []
        if (selectedSubject)  {
            if (role == 'teacher') {
                data = await getTeacherData(selectedSubject!.id)
                const userdata = JSON.parse(localStorage.getItem('user')!)
                setTeacher(`${userdata.LastName} ${userdata.FirstName} ${userdata.MiddleName}`)
            } else {
                data = await getStudentData(selectedSubject!.id)
            }
            setGroups(data)
            setIsLoading(false)
        }
        
    }

    const loadSubjects = async () => {
        const subjects = await SubjectService.getAll()
        setSubjects(subjects)
        setSelectedSubject(subjects[0])
    }

    // Добавление студента
    const onAddStudent = async (userdata: any) => {
        const user = await StudentService.create(userdata)
        for (let group of groups) {
            if (group.id == userdata.groupID) {
                const data: StudentType = {
                    id: user.id,
                    name: `${userdata.lastName} ${userdata.name} ${userdata.middleName}`,
                    groupID: userdata.groupID,
                    lectures: [],
                    practices: [],
                    labs: [],
                    lecture_presences: 0,
                    practice_presences: 0,
                    lab_dones: 0,
                    summary: 0
                }
                const lectures: LectureType[] = []
                const practices: PracticeType[] = []
                const labs: LabType[] = []
                for (let lecture of groups[0].students[0].lectures) {
                    const data = await LessonService.create(user.id, 1, 1, ' ', getDBDate(lecture.date))
                    lectures.push({id: data.id, cellID: data.id, date: lecture.date, value: '', valueType: 'symbol'})
                }

                for (let practice of groups[0].students[0].practices) {
                    const data = await LessonService.create(user.id, 1, 2, ' ', getDBDate(practice.date))
                    practices.push({id: data.id, cellID: data.id, date: practice.date, value: '', valueType: 'symbol'})
                }

                for (let lab of groups[0].students[0].labs) {
                    const tasks = []
                    for (let i = 0; i < lab.tasks.length; i++) {
                        const data = await LabService.createActivity({
                            studentId: user.id,
                            subjectId: selectedSubject?.id,
                            teacherId: Number(localStorage.getItem('id')),
                            taskId: lab.id,
                            taskTypeId: 1,
                            meta: ' ',
                            date: getDBDate(lab.date),
                            mark: ' ',
                            number: i,
                            taskNumber: lab.number
                        })
                        tasks.push({id: data.id, value: '', valueType: 'symbol'})
                    }
                    labs.push({id: lab.id, number: lab.number, date: lab.date, tasks: tasks})
                }
                data.lectures = lectures
                data.practices = practices
                data.labs = labs
                group.students.push(data)
            }
        }
        setGroups(JSON.parse(JSON.stringify(groups)))
    }
    
    // Удаление студента
    const onRemoveStudent = async () => {
        for (let group of groups) {
            for (let student of group.students) {
                if (selectedStudents.includes(student.id)) {
                    for (let lesson of [...student.lectures, ...student.practices]) {
                        await LessonService.deleteById(lesson.id)
                    }
                    for (let lab of student.labs) {
                        await LabService.deleteLab(lab.id)
                    }
                    await StudentService.delete(student.id)
                }
            }
        }
        setGroups(groups.map(group => {
            group.students = group.students.filter(student => !selectedStudents.includes(student.id))
            return group
        }))
    }

    // Выделение студента
    const onStudentSelected = (studentID: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedStudents([...selectedStudents, studentID])
        } else {
            setSelectedStudents(selectedStudents.filter(studentID => studentID != studentID))
        }
    }

    // Установление значения для ячейки задания лабы
    const onSetLabTaskValue = async (student: StudentType, labID: number, taskID: number, value: string, valueType: string) => {
        for (let group of groups) {
            if (group.id == student.groupID) {
                for (let person of group.students) {
                    if (person.id == student.id) {
                        for (let lab of student.labs) {
                            if (lab.id == labID) {
                                for (let task of lab.tasks) {
                                    if (task.id == taskID) {
                                        task.value = value
                                        task.valueType = valueType
                                        await LabService.updateActivity(task.id, lab.id, 1, String(lab.number), value)
                                        break
                                    }
                                }
                                break
                            }
                        }
                        break
                    }
                }
                break
            }
        }
        setGroups(groups)
    }

    // Установление значение для ячейки лекции или практики
    const onSetCellValue = async (student: StudentType, lessonID: number, lessonType: string, value: string, valueType: string) => {
        for (let group of groups) {
            if (group.id == student.groupID) {
                for (let person of group.students) {
                    if (person.id == student.id) {
                        if (lessonType == 'lecture') {
                            for (let lecture of person.lectures) {
                                if (lecture.id == lessonID) {
                                    lecture.value = value
                                    lecture.valueType = valueType
                                    await LessonService.update(lecture.id, 1, value, getDBDate(lecture.date))
                                    break
                                }
                            }
                        } else if (lessonType == 'practice') {
                            for (let practice of person.practices) {
                                if (practice.id == lessonID) {
                                    practice.value = value
                                    practice.valueType = valueType
                                    await LessonService.update(practice.id, 2, value, getDBDate(practice.date))
                                    break
                                }
                            }
                        }
                        break
                    }
                }
                break
            }
        }
        setGroups(groups)
    }

    // Добавление колонки
    const onAddColumns = async (columns: any, lessonType: string) => {
        for (let column of columns) {
            column.number = 1
            if (groups[0].students[0].labs.length)  {
                column.number = groups[0].students[0].labs[groups[0].students[0].labs.length - 1].number + 1
            }
            for (let group of groups) {
                for (let student of group.students) {
                    const id = getRandomInt(1, 10000)
                    column.id = id
                    if (!selectedSubject) return
                    switch (lessonType) {
                        case 'lecture':
                            const lecture = await LessonService.create(student.id, selectedSubject!.id, 1, ' ', getDBDate(column.date))
                            column.id = lecture.id
                            student.lectures.push(column)
                            break
                        case 'practice':
                            const practice = await LessonService.create(student.id, selectedSubject!.id, 2, ' ', getDBDate(column.date))
                            column.id = practice.id
                            student.practices.push(column)
                            break
                        case 'lab':
                            const lab = JSON.parse(JSON.stringify(column))
                            for (let i = 0; i < column.tasks.length; i++) {
                                const activity = await LabService.createActivity({
                                    studentId: student.id,
                                    subjectId: selectedSubject.id,
                                    teacherId: Number(localStorage.getItem('id')),
                                    taskId: column.id,
                                    taskTypeId: 1,
                                    meta: " ",
                                    date: getDBDate(column.date),
                                    mark: " ",
                                    taskNumber: column.number,
                                    number: i
                                })
                                lab.tasks[i].id = activity.id
                            }
                            student.labs.push(lab)
                    }
                }
            }
        }
        setGroups(JSON.parse(JSON.stringify(groups)))
    }

    // Изменение даты лекции или практики
    const editDate = async (lessonID: number, lessonType: string, date: string) => {
        for (let group of groups) {
            for (let student of group.students) {
                switch (lessonType) {
                    case 'lecture':
                        for (let lecture of student.lectures) {
                            if (lecture.id == lessonID) {
                                lecture.date = date
                                await LessonService.update(lecture.id, 1, lecture.value, getDBDate(lecture.date))
                                break
                            }
                        }
                        break
                    case 'practice':
                        for (let practice of student.practices) {
                            if (practice.id == lessonID) {
                                practice.date = date
                                await LessonService.update(practice.id, 2, practice.value, getDBDate(practice.date))
                                break
                            }
                        }
                }
            }
        }
        setGroups(JSON.parse(JSON.stringify(groups)))
    }

    // Удаление колонки
    const onRemoveColumns = async () => {
        for (let group of groups) {
            for (let student of group.students) {
                for (let lecture of student.lectures) {
                    if (selectedColumns.includes(lecture)) {
                        await LessonService.delete(selectedSubject!.id, 1, getDBDate(lecture.date))
                    }
                }
                for (let practice of student.practices) {
                    if (selectedColumns.includes(practice)) {
                        await LessonService.delete(selectedSubject!.id, 2, getDBDate(practice.date))
                    }
                }
                for (let lab of student.labs) {
                    if (selectedColumns.includes(lab)) {
                        await LabService.deleteLab(lab.id)
                    }
                }
                for (let column of selectedColumns) {
                    student.lectures = student.lectures.filter(lecture => lecture.date != column.date)
                    student.practices = student.practices.filter(practice => practice.date != column.date)
                    student.labs = student.labs.filter(lab => lab.date != column.date)
                }
            }
        }
        setGroups(JSON.parse(JSON.stringify(groups)))
    }

    // Изменение кол-ва заданий в лабах
    const editLabTasks = async (labID: number, tasksCount: number) => {
        for (let group of groups) {
            for (let student of group.students) {
                for (let lab of student.labs) {
                    if (lab.id == labID) {
                        if (tasksCount > lab.tasks.length) {
                            const newTasks = []
                            for (let i = lab.tasks.length + 1; i <= tasksCount; i++) {
                                newTasks.push({
                                    id: Date.now() + getRandomInt(0, 10000),
                                    value: '',
                                    valueType: 'symbol'
                                })
                                await LabService.createActivity({
                                    studentId: student.id,
                                    subjectId: selectedSubject?.id,
                                    teacherId: Number(localStorage.getItem('id')),
                                    taskId: lab.id,
                                    taskTypeId: 1,
                                    meta: ' ',
                                    date: getDBDate(lab.date),
                                    mark: ' ',
                                    number: i,
                                    taskNumber: lab.number
                                })
                            }
                            Array.prototype.push.apply(lab.tasks, newTasks)
                        } else {
                            const tasks = []
                            for (let i = 0; i < tasksCount; i++) {
                                tasks.push(lab.tasks[i])
                            }
                            for (let i = tasksCount; i < lab.tasks.length; i++) {
                                await LabService.deleteActivity(lab.tasks[i].id)
                            }
                            lab.tasks = tasks
                        }
                        break
                    }
                }
            }
        }

        setGroups(JSON.parse(JSON.stringify(groups)))
    }

    // Сортировка по возрастанию (по алфавиту)
    const sortByAscending = () => {
        setGroups(groups.map(group => {
            group.students.sort((s1, s2) => {
                return alphabet.indexOf(s1.name[0].toLowerCase()) - alphabet.indexOf(s2.name[0].toLowerCase())
            })
            return group
        }))
    }

    // Сортировка по убыванию (по алфавиту)
    const sortByDescending = () => {
        setGroups(groups.map(group => {
            group.students.sort((s1, s2) => {
                return alphabet.indexOf(s2.name[0].toLowerCase()) - alphabet.indexOf(s1.name[0].toLowerCase())
            })
            return group
        }))
    }

    const search = (student_name: string) =>{
        if (!student_name) {
            loadData()
            return
        }
        setGroups(groups.map(group => {
            group.students = group.students.filter(student => student.name.includes(student_name))
            return group
        }))
    }

    if (!isLoading)
        return (
            <>

                {/* Шапка */}
                <Header 
                    teacher={teacher} 
                    onTeacherEdit={(value: string) => setTeacher(value)}
                    subject={selectedSubject!.title} 
                    onSubjectEdit={(_) => {}}
                    groups={groups}
                    onAddStudent={onAddStudent}
                    onRemoveStudent={onRemoveStudent}
                    onAddColumns={onAddColumns}
                    onRemoveColumns={onRemoveColumns}
                    isFiltersCollapsed={isFiltersCollapsed}
                    setIsFiltersCollapsed={setIsFiltersCollapsed}
                    sortByAscending={sortByAscending}
                    sortByDescending={sortByDescending}
                    search={search}
                />
                <main>
                    {/* Таблица */}
                    <Table 
                        groups={groups}
                        onStudentSelected={onStudentSelected}
                        onSetCellValue={onSetCellValue}
                        onSetLabTaskValue={onSetLabTaskValue}
                        editDate={editDate}
                        selectedColumns={selectedColumns}
                        setSelectedColumns={setSelectedColumns}
                        editLabTasks={editLabTasks}
                        scores={scores}
                        setScores={setScores}
                        hiddenStudents={hiddenStudents}
                        setHiddenStudents={setHiddenStudents}
                        isFiltersCollapsed={isFiltersCollapsed}
                        setIsFiltersCollapsed={setIsFiltersCollapsed}
                    />
                    {
                        selectedSubject && 
                            <Subjects subjects={subjects} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
                    }
                </main>
            </>
        )
    return <></>
}
export default Home;