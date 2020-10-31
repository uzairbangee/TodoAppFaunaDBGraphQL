import React, {useState} from 'react'
import TodoBox from '../components/TodoBox/TodoBox';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const TodosQuery = gql`{
    todo{
        id
        title
        completed
    }
  }`

const AddTODO = gql`
  mutation addTodo($title: String!){
    addTodo(title: $title){
     title 
    }
}
`

const RemoveTodo = gql`
  mutation removeTodo($id: ID!){
    removeTodo(id: $id){
     title 
    }
}
`

const UpdateTodo = gql`
  mutation updateTodo($id: ID!, $completed: Boolean!){
    updateTodo(id: $id, completed: $completed){
     title 
    }
}
`


const index = () => {
    const [reminder, setterReminder] = useState<string>("");
    const [sendLoading, setLoading] = useState(false);
    const { loading, error, data } = useQuery(TodosQuery);
    const [addTodo] = useMutation(AddTODO);
    const [removeTodo] = useMutation(RemoveTodo);
    const [updateTodo] = useMutation(UpdateTodo);

    if(loading)
        return "loading.....";

    const Submit = () => {
        setLoading(true);
        addTodo({
            variables : {
                title : reminder
            },
            refetchQueries: [{query:TodosQuery}],
        })
        setterReminder("");
        setLoading(false);
    }

    const onDelete = (id) => {
        removeTodo({
            variables : {
                id : id
            },
            refetchQueries: [{query:TodosQuery}],
        })
    }

    const onUpdate = (id, completed) => {
        updateTodo({
            variables : {
                id : id,
                completed: !completed
            },
            refetchQueries: [{query:TodosQuery}],
        })
    }

    return (
        <div className="App">
            <div className="box">
                <input type="text" className="input" placeholder="Reminder" value={reminder} name="reminder" onChange={({target}) => setterReminder(target.value)}/>
                <button className="submit__button" onClick={Submit}>
                    {!sendLoading ? "Add" : "Loading"}
                </button>
                <ul className="lists">
                    {
                    data.todo.length > 0 &&
                    data.todo.map(rem => (
                    <TodoBox
                        id={rem.id}
                        key={rem.id}
                        del={onDelete}
                        title={rem.title}
                        update={onUpdate}
                        completed={rem.completed}
                        />
                    ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default index
