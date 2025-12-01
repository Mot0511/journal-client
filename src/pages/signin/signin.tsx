import { useState } from 'react'
import cl from './signin.module.sass'
import TeacherService from '../../services/TeacherService'
import { useNavigate } from 'react-router'
import StudentService from '../../services/StudentService'

const Signin = () => {

    const navigate = useNavigate()

    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isTeacher, setIsTeacher] = useState<boolean>(false)

    const submit = async () => {
        let res
        if (isTeacher) {
            res = await TeacherService.auth(login, password)
        } else {
            res = await StudentService.auth(login, password)
            localStorage.setItem('groupID', res.user.groupId)
        }
        localStorage.setItem('token', res.token)
        localStorage.setItem('id', res.user.id)
        localStorage.setItem('role', res.role)
        localStorage.setItem('user', JSON.stringify(res.user))
        navigate('/')
    }

    return (
        <div className={cl.main}>
            <div className={cl.auth}>
                <div className={cl.header}>
                    <h1>Вход</h1>
                </div>
                <div className={cl.form}>
                    <input type="text" value={login} onChange={e => setLogin(e.target.value)} className='input' placeholder='Логин'/><br />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className='input' placeholder='Пароль'/><br /><br />
                    <div>
                        <label className={cl.isTeacherLabel} htmlFor="isTeacher">Я преподаватель</label>
                        <input type="checkbox" id='isTeacher' checked={isTeacher} onChange={() => setIsTeacher(!isTeacher)} className='checkbox' placeholder='Я учитель'/><br /><br />
                    </div>
                    <button onClick={submit}>Войти</button>
                </div>
            </div>
        </div>
    )
}
export default Signin;