import cl from './cell.module.sass'
import type { ScoreType } from '../../types/scores'
import checkboxColors from '../../consts/checkbox_colors'
import { MdClear } from "react-icons/md";
import { useEffect, useState } from 'react';
// Одна ячейка
const Cell = (
    {
        lesson,
        scores,
        isSelected,
        setSelectedCell,
        onSetCellValue
    }: {
        lesson: any
        scores: ScoreType[]
        isSelected: boolean
        setSelectedCell: (lessonID: number | null) => void,
        onSetCellValue: (value: string, valueType: string) => void
    }
) => {

    const [role, setRole] = useState<string | null>()

    useEffect(() => {
        setRole(localStorage.getItem('role'))
    }, [])

    return (
        <div className={cl.cell} style={{color: lesson.value == 'Н' ? 'red' : 'black', background: isSelected ? '#EFF3F9' : 'none'}} onClick={e => {
                if (role != 'teacher') return
                e.stopPropagation()
                setSelectedCell(
                    lesson.cellID ? lesson.cellID : lesson.id
                )
            }
        }>
        {
            lesson.valueType == 'checkbox'
                ? lesson.value != ' '
                    ? <input type="checkbox" className='checkbox' style={{accentColor: checkboxColors[lesson.value]}} checked={true}/>
                    : ''
                : lesson.value
        }
        {/* Панель выбора оценки */}
        {
            isSelected &&
                <div className={cl.marks}>
                    {/* Пустое значение */}
                    <div 
                        className={cl.mark + ' ' + cl.emptyMark}
                        onClick={e => {
                            e.stopPropagation()
                            setSelectedCell(null)
                            onSetCellValue(' ',  'checkbox')
                        }}
                    >
                    <MdClear size={'18px'} />
                    </div>
                    {/* Возможные оценки */}
                    {
                        scores.map(score => <div 
                                className={cl.mark}
                                onClick={e => {
                                    e.stopPropagation()
                                    setSelectedCell(null)
                                    onSetCellValue(score.mark, score.type)
                                }}
                            >
                            {
                                score.type == 'checkbox'
                                    ? <input type="checkbox" className='checkbox' style={{accentColor: checkboxColors[Number(score.mark)]}} checked={true}/>
                                    : <p>{score.mark}</p>
                            }
                        </div>)
                    }
                </div>
        }
    </div>
    )
}
export default Cell;