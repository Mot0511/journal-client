import cl from './table.module.sass';
import TableHeader from '../table_header/table_header';
import Group from '../group/group';
import type GroupType from '../../types/group';
import type {ScoresType} from '../../types/scores';
import type StudentType from '../../types/student';
// Таблица
const Table = (
    {
        groups, 
        onStudentSelected,
        onSetCellValue,
        onSetLabTaskValue,
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
    }: {
        groups: GroupType[],
        onStudentSelected: (studentID: number, isSelected: boolean) => void
        onSetCellValue: (student: StudentType, lessonID: number, lessonType: string, value: string, valueType: string) => void
        onSetLabTaskValue: (student: StudentType, labID: number, taskID: number, value: string, valueType: string) => void
        editDate: (lessonID: number, lessonType: string, date: string) => void,
        selectedColumns: any[],
        setSelectedColumns: (columns: any[]) => void,
        editLabTasks: (labID: number, tasksCount: number) => void,
        scores: ScoresType,
        setScores: (scores: ScoresType) => void,
        hiddenStudents: number[],
        setHiddenStudents: (students: number[]) => void
        isFiltersCollapsed: boolean,
        setIsFiltersCollapsed: (state: boolean) => void
    }) => {

    return (
        <div className={cl.table}>
            {/* Шапка таблицы */}
            <TableHeader 
                groups={groups} 
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
                // Одна группа
                groups.map(group => <Group 
                    group={group} 
                    onStudentSelected={onStudentSelected}
                    onSetCellValue={onSetCellValue}
                    onSetLabTaskValue={onSetLabTaskValue}
                    hiddenStudents={hiddenStudents}
                    scores={scores}
                />)
            }
            
        </div>
    )
}
export default Table;