import type GroupType from "./types/group"
import type {ScoresType} from "./types/scores"

const groups_data: GroupType[] = [
    {
        id: 100,
        title: 'ИВТб-1301-05-00',
        students: [
            {
                id: 1000,
                name: 'Матвей',
                groupID: 100,
                lectures: [
                    {
                        id: 1,
                        cellID: 1,
                        date: '04/09',
                        value: 'Н',
                        valueType: 'symbol'
                    },
                    {
                        id: 2,
                        cellID: 2,
                        date: '04/09',
                        value: '',
                        valueType: 'symbol'
                    },
                    {
                        id: 3,
                        cellID: 3,
                        date: '04/09',
                        value: 'Н',
                        valueType: 'symbol'
                    },
                ],
                practices: [
                    {
                        id: 4,
                        cellID: 4,
                        date: '04/09',
                        value: '1.0',
                        valueType: 'number'
                    },
                    {
                        id: 5,
                        cellID: 5,
                        date: '04/09',
                        value: '3.0',
                        valueType: 'number'
                    }
                ],
                labs: [
                    {
                        id: 6,
                        number: 1,
                        date: '04/10',
                        tasks: [
                            {
                                id: 6,
                                value: '0',
                                valueType: 'checkbox'
                            },
                            {
                                id: 7,
                                value: '1',
                                valueType: 'checkbox'
                            },
                            {
                                id: 7,
                                value: '2',
                                valueType: 'checkbox'
                            }
                        ],
                    },
                    {
                        id: 7,
                        number: 1,
                        date: '04/10',
                        tasks: [
                            {
                                id: 9,
                                value: '0',
                                valueType: 'checkbox'
                            },
                            {
                                id: 10,
                                value: '1',
                                valueType: 'checkbox'
                            },
                            {
                                id: 11,
                                value: '2',
                                valueType: 'checkbox'
                            }
                        ],
                    },
                ],
                lecture_presences: 10,
                practice_presences: 7,
                lab_dones: 75,
                summary: 92
            },
        ]
    },
]

const scores_data: ScoresType = {
    lectures: [
        {
            id: 1,
            type: 'symbol',
            mark: 'Н',
            score: -1
        }
    ],
    practices: [
        {
            id: 2,
            type: 'number',
            mark: '1.0',
            score: 1
        },
        {
            id: 2,
            type: 'number',
            mark: '2.0',
            score: 2
        },
        {
            id: 3,
            type: 'number',
            mark: '3.0',
            score: 3
        },
        {
            id: 4,
            type: 'number',
            mark: '4.0',
            score: 4
        },
        {
            id: 5,
            type: 'number',
            mark: '5.0',
            score: 5
        }
    ],
    labs: [
        {
            id: 6,
            type: 'checkbox',
            mark: '0',
            score: 10
        },
        {
            id: 7,
            type: 'checkbox',
            mark: '1',
            score: 20
        },
        {
            id: 8,
            type: 'checkbox',
            mark: '2',
            score: 30
        }
    ]
}

export {groups_data, scores_data}