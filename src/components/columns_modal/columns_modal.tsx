import { useState } from 'react'
import cl from './columns_modal.module.sass'
import getRandomInt from '../../utils/random'

const ColumnsModal = (
    {
        onAddColumns,
        onCancel,
    }: 
    {
        onAddColumns: (columns: any, lessonType: string, count: number) => void
        onCancel: () => void
    }) => {

    const [lessonType, setLessonType] = useState<string>('lecture')
    const [count, setCount] = useState<string>('1')
    const [date, setDate] = useState<string>();

    const addColumnHandler = () => {
        if (Number(count) <= 0) return
        const columns: any = []
        for (let i = 0; i < Number(count); i++) {
            const lesson_date = date 
                ? `${date?.split('-')[2]}/${date?.split('-')[1]}`
                : `${new Date().toISOString().split('-')[2].split('T')[0]}/${new Date().toISOString().split('-')[1]}`
            const lesson: any = {
                id: getRandomInt(0, 10000),
                cellID: Date.now() + getRandomInt(0, 10000),
                date: lesson_date,
            }
            switch (lessonType) {
                case 'lecture':
                    lesson.value = ''
                    columns.push(lesson)
                    break
                case 'practice':
                    lesson.value = ''
                    columns.push(lesson)
                    break
                case 'lab':
                    lesson.tasks = []
                    for (let i = 0; i < 3; i++) {
                        lesson.tasks.push({
                            id: getRandomInt(0, 10000),
                            value: ' ',
                            valueType: 'checkbox'
                        })
                    }
                    columns.push(lesson)
            }
        }
        onAddColumns(columns, lessonType, Number(count))
    }

    return (
        <div className={cl.modal}>
            <div className={cl.header}>
                <h1>Добавить столбцы</h1>
            </div>
            <div className={cl.body}>
                <div className={cl.content}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <select onChange={(e) => setLessonType(e.target.value)} value={lessonType}>
                            <option value={'lecture'}>Лекции</option>
                            <option value={'practice'}>Практики</option>
                            <option value={'lab'}>Лабораторные работы</option>
                        </select>
                        <input type={'number'} className={cl.count_input} value={count} onChange={(e) => setCount(e.target.value)} placeholder='Количество' />
                    </div>
                    <input type={'date'} className={cl.date_input} value={date} onChange={(e) => setDate(e.target.value)} placeholder='Количество' />
                </div>
                <div className={cl.btns}>
                    <button className={cl.btn} onClick={onCancel}>Отмена</button>
                    <button className={cl.btn} onClick={addColumnHandler}>ОК</button>
                </div>
            </div>
        </div>
    )
}
export default ColumnsModal;