import { useState } from 'react'
import cl from './header.module.sass'
import { GoPencil } from "react-icons/go"
import { FaCheck } from "react-icons/fa6";

import SortIcon from '../../img/sort.png'
import FilterIcon from '../../img/filter.png'
import TableIcon from '../../img/table.png'
import StudentIcon from '../../img/student.png'
import StudentModal from '../student_modal/student_modal';
import type GroupType from '../../types/group';
import ColumnsModal from '../columns_modal/columns_modal';
// Шапка всего сайта
const Header = (
    {   
        teacher, 
        onTeacherEdit, 
        subject, 
        onSubjectEdit,
        groups,
        onAddStudent,
        onRemoveStudent,
        onAddColumns,
        onRemoveColumns,
        isFiltersCollapsed,
        setIsFiltersCollapsed,
        sortByAscending,
        sortByDescending,
        search
    }: {
        teacher: string, 
        onTeacherEdit: (teacher: string) => void,
        subject: string,
        onSubjectEdit: (subject: string) => void,
        groups: GroupType[],
        onAddStudent: (userdata: {}) => void
        onRemoveStudent: () => void,
        onAddColumns: (columns: any, lessonType: string, count: number) => void,
        onRemoveColumns: () => void
        isFiltersCollapsed: boolean,
        setIsFiltersCollapsed: (state: boolean) => void,
        sortByAscending: () => void
        sortByDescending: () => void,
        search: (student_name: string) => void
    }) => {

    // Состояния на отображение...
    const [isInfoEditing, setInfoEditing] = useState<boolean>(); // ...полей ввода ФИО преподавателя и предмета
    const [isContextStudentsVisible, setIsContextStudentsVisible] = useState<boolean>(); // ... контекстного меню кнопки "Студенты"
    const [isContextColumnsVisible, setIsContextColumnsVisible] = useState<boolean>(); // ... контекстного меню кнопки "Столбцы"
    const [isStudentModalVisible, setIsStudentModalVisible] = useState<boolean>(false) // ... модального окна "Добавить студента"
    const [isColumnsModalVisible, setIsColumnsModalVisible] = useState<boolean>(false) // ... модального окна "Добавить колонку"
    const [isContextSortVisible, setIsContextSortVisible] = useState<boolean>(false) // ... контекстного меню кнопки "Сортировка"

    const [searchText, setSearchText] = useState<string>('')


    return (
        <div className={cl.header}>
            {/* Модальное окно "Добавить студента" */}
            {
                isStudentModalVisible &&
                    <StudentModal 
                        groups={groups} 
                        onAddStudent={(userdata: {}) => {
                            onAddStudent(userdata)
                            setIsStudentModalVisible(false)
                        }} 
                        onCancel={() => setIsStudentModalVisible(false)}
                    />
            }
            {/* Модальное окно "Добавить колонку" */}
            {
                isColumnsModalVisible &&
                    <ColumnsModal
                        onAddColumns={(column, lessonType, count) => {
                            onAddColumns(column, lessonType, count)
                            setIsColumnsModalVisible(false)
                        }} 
                        onCancel={() => setIsColumnsModalVisible(false)}
                    />
            }
            {/* Поля ввода ФИО преподавателя и предмета */}
            <div className={cl.info}>
                {
                    isInfoEditing
                        ? <div>
                            <input className='input' value={teacher} onChange={e => onTeacherEdit(e.target.value)} />
                            /
                            <input className='input' value={subject} onChange={e => onSubjectEdit(e.target.value)} />
                        </div>
                        : <h2 className={cl.heading}>{teacher} / {subject}</h2>
                }
                
                {/* <button className={cl.edit_btn} onClick={() => setInfoEditing(!isInfoEditing)}>
                    {
                        isInfoEditing
                            ? <FaCheck className={cl.icon} />
                            : <GoPencil className={cl.icon} />
                    }
                </button> */}
            </div>
            <input type="search" className={cl.search} placeholder='Поиск' value={searchText} onChange={e => {
                setSearchText(e.target.value)
                search(e.target.value)
            }} />
            <div className={cl.menu}>
                {/* Кнопка "Сортировка" */}
                <button onClick={() => {
                    setIsContextSortVisible(!isContextSortVisible)
                    setIsContextColumnsVisible(false)
                    setIsContextStudentsVisible(false)
                }}>
                    <img src={SortIcon} alt="" /><br />
                    Сортировка
                    {
                        isContextSortVisible &&
                        <div className={cl.context_menu}>
                            <div onClick={sortByAscending}>
                                По возрастанию
                            </div>
                            <div onClick={sortByDescending} style={{borderRadius: '0 0 10px 10px'}}>
                                По убыванию
                            </div>
                        </div>
                    }
                </button>
                {/* Кнопка "Фильтр" */}
                <button onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}>
                    <img src={FilterIcon} alt="" /><br />
                    Фильтр
                </button>
                {/* Кнопка "Столбцы" */}
                {
                    localStorage.getItem('role') == 'teacher' &&
                        <button onClick={() => {
                            setIsContextColumnsVisible(!isContextColumnsVisible)
                            setIsContextSortVisible(false)
                            setIsContextStudentsVisible(false)
                        }}>
                            <img src={TableIcon} alt="" /><br />
                            Столбцы
                            {
                                isContextColumnsVisible &&
                                <div className={cl.context_menu}>
                                    <div onClick={() => setIsColumnsModalVisible(true)}>
                                        + Добавить
                                    </div>
                                    <div style={{borderRadius: '0 0 10px 10px'}} onClick={onRemoveColumns}>
                                        - Удалить
                                    </div>
                                </div>
                            }
                        </button>
                }
                {/* Кнопка "Студенты" */}
                {
                    localStorage.getItem('role') == 'teacher' &&
                        <button onClick={() => {
                            setIsContextStudentsVisible(!isContextStudentsVisible)
                            setIsContextSortVisible(false)
                            setIsContextColumnsVisible(false)
                        }}>
                            <img src={StudentIcon} alt="" /><br />
                            Студенты
                            {
                                isContextStudentsVisible &&
                                <div className={cl.context_menu}>
                                    <div onClick={() => setIsStudentModalVisible(true)}>
                                        + Добавить
                                    </div>
                                    <div style={{borderRadius: '0 0 10px 10px'}} onClick={onRemoveStudent}>
                                        - Удалить
                                    </div>
                                </div>
                            }
                            
                        </button>
                }
            </div>
        </div>
    )
}
export default Header;