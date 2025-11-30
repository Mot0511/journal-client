import React from 'react'
import cl from './subjects.module.sass'
import type SubjectType from '../../types/subject';

const Subjects = (
    {
        subjects, 
        selectedSubject, 
        setSelectedSubject
    }: {
        subjects: SubjectType[], 
        selectedSubject: SubjectType, 
        setSelectedSubject: (subjectID: SubjectType) => void
    }) => {

    return (
        <div className={cl.subjects}>
            {
                subjects.map(subject => 
                    <div 
                        className={cl.subject}
                        style={{borderTopColor: subject.id == selectedSubject.id ? '#0062E1' : 'grey'}}
                        onClick={() => setSelectedSubject(subject)}
                    >
                        <p>{subject.title}</p>
                    </div>
                )
            }
        </div>
    )
}
export default Subjects;