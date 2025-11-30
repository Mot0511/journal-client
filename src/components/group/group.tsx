import { useState } from 'react'
import cl from './group.module.sass'
import Student from '../student/student';
import type GroupType from '../../types/group';
import type {ScoresType} from '../../types/scores';
import type StudentType from '../../types/student';
// Группа студентов
const Group = (
    {
        group,
        onStudentSelected,
        onSetCellValue,
        onSetLabTaskValue,
        hiddenStudents,
        scores,
    }: {
        group: GroupType,
        onStudentSelected: (studentID: number, isSelected: boolean) => void
        onSetCellValue: (student: StudentType, lessonID: number, lessonType: string, value: string, valueType: string) => void
        onSetLabTaskValue: (student: StudentType, labID: number, taskID: number, value: string, valueType: string) => void
        hiddenStudents: number[],
        scores: ScoresType
    }) => {

    
    const [isStudentsVisible, setIsStudentsVisible] = useState<boolean>(true); // показан ли студент
    const [selectedCell, setSelectedCell] = useState<number | null>(null) // выделенная ячейка

    return (
        <div className={cl.group}>
            <div onClick={() => setIsStudentsVisible(!isStudentsVisible)} className={cl.group_name}>
                <p>{group.title}</p>
            </div>
            {
                
                isStudentsVisible &&
                    group.students.map((student) => {
                        if (!hiddenStudents.includes(student.id)) {
                            // Один студент
                            return <Student 
                                student={student} 
                                onSelected={onStudentSelected} 
                                onSetCellValue={onSetCellValue}
                                onSetLabTaskValue={onSetLabTaskValue}
                                selectedCell={selectedCell}
                                setSelectedCell={setSelectedCell}
                                scores={scores}
                            />
                        }
                    })
            }
        </div>
    )
}
export default Group;