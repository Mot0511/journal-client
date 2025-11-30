import { useState } from 'react'
import cl from './student_modal.module.sass'
import type GroupType from '../../types/group'

const StudentModal = (
    {
        groups, 
        onAddStudent,
        onCancel,
    }: 
    {
        groups: GroupType[], 
        onAddStudent: (userdata: {}) => void
        onCancel: () => void
    }) => {

    const [groupID, setGroupID] = useState<number>(groups[0].id)
    const [login, setLogin] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [middleName, setMiddleName] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <div className={cl.modal}>
            <div className={cl.header}>
                <h1>Добавить студента</h1>
            </div>
            <div className={cl.body}>
                <div className={cl.content}>
                    <select onChange={(e) => setGroupID(Number(e.target.value))} value={groupID}>
                        {
                            groups.map(group => <option value={group.id}>{group.title}</option>)
                        }
                    </select>
                    <input className={cl.input} value={login} onChange={(e) => setLogin(e.target.value)} placeholder='Логин' />
                    <input className={cl.input} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Фамилия' />
                    <input className={cl.input} value={name} onChange={(e) => setName(e.target.value)} placeholder='Имя' />
                    <input className={cl.input} value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder='Отчество' />
                    <input className={cl.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Пароль' />
                </div>
                <div className={cl.btns}>
                    <button className={cl.btn} onClick={onCancel}>Отмена</button>
                    <button className={cl.btn} onClick={() => {
                        (groupID)
                        if (name != '') onAddStudent({
                            groupID,
                            login,
                            lastName,
                            name,
                            middleName,
                            password
                        })
                    }}>ОК</button>
                </div>
            </div>
        </div>
    )
}
export default StudentModal;