import React from 'react'

interface Props {
    id: string,
    title: string,
    del : (id : string) => void,
    update : (id: string, completed: boolean) => void,
    completed: boolean
}

const TodoBox = ({id, title, del, update, completed}: Props) => {
    return (
        <div style={{display: 'flex'}}>
            <li>
                {completed ? <del>{title}</del> : title}
                <div>
                <span onClick={() => del(id)}>x</span>
                <span onClick={() => update(id, completed)}>{completed ? 'Undo' : 'Done'}</span>
                </div>
            </li>
        </div>
    )
}

export default TodoBox
