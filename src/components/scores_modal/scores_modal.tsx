import { useEffect, useState } from 'react'
import cl from './scores_modal.module.sass'
import type {ScoresType, ScoreType} from '../../types/scores'
import { RiDeleteBin6Line } from "react-icons/ri";
import CheckboxColors from '../../consts/checkbox_colors.ts'

const ScoresModal = (
    {
        lessonsType,
        scoresData,
        setScoresData,
        onCancel,
    }: 
    {
        lessonsType: string
        scoresData: ScoresType
        setScoresData: (scores: ScoreType[]) => void
        onCancel: () => void
    }) => {

    const [valueType, setValueType] = useState<string>('checkbox')
    const [score, setScore] = useState<number>(0)

    const [editingScore, setEditingScore] = useState<number | null>()
    const [value, setValue] = useState<string>('')

    const [scores, setScores] = useState<ScoreType[] | null>()

    useEffect(() => {
        switch (lessonsType) {
            case 'lectures':
                setScores(scoresData.lectures)
                break
            case 'practices':
                setScores(scoresData.practices)
                break
            case 'labs':
                setScores(scoresData.labs)
        }
    }, [])

    const isExistingScoreWithSameValue = (value: string, valueType: string) => {
        if (!scores) return
        for (let score of scores) {
            if (score.mark == value && score.type == valueType) {
                return true
            }
        }
        return false
    }

    const addScore = () => {
        if (!scores) return
        const data: any = {
            id: Date.now(),
            type: valueType,
            score: score
        }
        switch (valueType) {
            case 'checkbox':
                if (isExistingScoreWithSameValue('0', 'checkbox')) return
                data.mark = '0'
                break
            case 'symbol':
                if (isExistingScoreWithSameValue('Н', 'symbol')) return
                data.mark = 'Н'
                break
            case 'number':
                if (isExistingScoreWithSameValue('1', 'number')) return
                data.mark = '1'
                break
        }
        setScores([...scores, data])
        
    }

    const removeScore = (id: number) => {
        if (!scores) return
        setScores(scores.filter(score => score.id != id))
    }

    const editValue = (id: number, valueType: string) => {
        if (!scores) return
        if (isExistingScoreWithSameValue(value, valueType)) return
        setScores(scores.map(score => {
            if (score.id == id) {
                score.mark = value
            }
            return score
        }))
    }

    const editCheckboxValue = (id: number) => {
        if (!scores) return
        setScores(scores.map(score => {
            if (score.id == id) {
                const value = Number(score.mark)
                if (value == CheckboxColors.length - 1) {
                    score.mark = '0'
                } else {
                    score.mark = String(value + 1)
                }
            }
            return score
        }))
    }

    return (
        <div className={cl.modal}>
            <div className={cl.header}>
                <h1>Настройка оценок</h1>
                <p onClick={addScore}>+ Добавить</p>
            </div>
            <div className={cl.body}>
                <div className={cl.content}>
                    <div className={cl.inputs}>
                        <select value={valueType} onChange={e => setValueType(e.target.value)}>
                            <option value="checkbox">Чекбокс</option>
                            <option value="symbol">Символ</option>
                            <option value="number">Число</option>
                        </select>
                        <input type={'number'} className={cl.count_input} value={score} onChange={(e) => setScore(Number(e.target.value))} placeholder='Балл' />
                    </div>
                    <div className={cl.scores}>
                        {
                            scores
                                ? scores.map(score => <div className={cl.score}>
                                    {
                                        score.type == 'checkbox'
                                            ? <p className={cl.value}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={true} 
                                                    className={cl.checkbox}
                                                    style={{accentColor: CheckboxColors[Number(score.mark)]}}
                                                    onClick={_ => editCheckboxValue(score.id)}
                                                />Чекбокс
                                                </p>
                                            : editingScore == score.id
                                                ? <input 
                                                    type={'symbol'}
                                                    className={cl.value_input} 
                                                    value={value}
                                                    onChange={e => setValue(e.target.value)}
                                                    onBlur={_ => {
                                                        editValue(score.id, score.type)
                                                        setEditingScore(null)
                                                    }}
                                                />
                                                : <p className={cl.value} onClick={_ => {
                                                    setValue(score.mark)
                                                    setEditingScore(score.id)
                                                }}>{score.mark}</p>
                                    }
                                    <p className={cl.score}>{score.score}</p>
                                    <button className={cl.removeBtn} onClick={() => removeScore(score.id)}><RiDeleteBin6Line size={32} /></button>
                                </div>)
                                : <></>
                        }
                    </div>
                    <div className={cl.btns}>
                        <button className={cl.btn} onClick={onCancel}>Отмена</button>
                        <button className={cl.btn} onClick={() => setScoresData(scores!)}>ОК</button>
                    </div>
                </div>
                
            </div>
        </div>
    )
}
export default ScoresModal;