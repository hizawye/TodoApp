import React, { useReducer, useState } from 'react'
import { IoIosAdd } from "react-icons/io";

import { MdDeleteOutline } from 'react-icons/md'
import { CiEdit } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";


const ACTIONS = {
    ADD_TODO: "add-todo",
    DELETE_TODO: "delete-todo",
    MARK_COMPLETE: "mark-complete",
    EDIT_TODO: "edit-todo",
    SAVE_EDIT: "save-edit",
    CANCEL_COMPLETE: "cancel-complete",
}
function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }],
                ...state.editTodoId,
            }

        case ACTIONS.DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload),
                ...state.editTodoId
            }

        case ACTIONS.EDIT_TODO:
            return { ...state, ...state.todos, editTodoId: action.payload }
        case ACTIONS.SAVE_EDIT:
            return {
                ...state,
                todos: state.todos.map(todo => {
                    if (todo.id === action.payload.id) {
                        return { ...todo, text: action.payload.text };
                    }
                    return todo;
                }),
                editTodoId: null
            };
        case ACTIONS.MARK_COMPLETE:
            return {
                ...state,
                todos: state.todos.map(todo => {
                    if (todo.id == action.payload) {
                        return { ...todo, completed: true }
                    }
                    return todo;
                }
                )
                , ...state.editTodoId
            }
        case ACTIONS.CANCEL_COMPLETE:
            return {
                ...state,
                todos: state.todos.map(todo => {
                    if (todo.id == action.payload) {
                        return { ...todo, completed: false }
                    }
                    return todo;
                }
                ), ...state.editTodoId
            }
    }
}


export default function Todolist() {
    const [state, dispatch] = useReducer(reducer, { todos: [], editTodoId: null })
    const [inputValue, setInputValue] = useState('')
    const [textareaValue, setTextareaValue] = useState("")

    const handleAddTodo = (e) => {
        e.preventDefault()
        if (inputValue.trim() !== '') {
            dispatch({ type: ACTIONS.ADD_TODO, payload: inputValue })
        }
        setInputValue("")
    }
    const handleDeleteTodo = (id) => {
        dispatch({ type: ACTIONS.DELETE_TODO, payload: id })
    }
    const handleEditMode = (id) => {

        dispatch({ type: ACTIONS.EDIT_TODO, payload: id })
        const currentTodo = state.todos.find(todo => todo.id == id)
        setTextareaValue(currentTodo ? currentTodo.text : '')
    }

    const handleSaveEdit = (id, newText) => {
        if (newText.trim() != "") {
            dispatch({ type: ACTIONS.SAVE_EDIT, payload: { id: id, text: newText } })
        }
    }
    const handleComplete = id => {
        dispatch({ type: ACTIONS.MARK_COMPLETE, payload: id })
    }
    const cancelComplete = id => {
        dispatch({ type: ACTIONS.CANCEL_COMPLETE, payload: id })
    }
    return (
        <>
            <form className='form' onSubmit={handleAddTodo}>
                <input
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} />


                <button type='submit'><IoIosAdd fontSize="1em" /></button>
            </form>
            <ul>
                {state.todos.map(todo => (
                    < li key={todo.id} >
                        {todo.id !== state.editTodoId ? (
                            !todo.completed ? (
                                <>
                                    <span className='liText'>{todo.text}</span>
                                    <div className='liBtns'>
                                        < button onClick={() => handleDeleteTodo(todo.id)}> <MdDeleteOutline /> </button>
                                        <button onClick={() => handleEditMode(todo.id)}><CiEdit /></button>
                                        <button onClick={() => handleComplete(todo.id)}><FaCheck /></button>
                                    </div>
                                </>) : (<>
                                    <div style={{ textDecoration: 'line-through' }}>{todo.text}</div>
                                    <button onClick={() => cancelComplete(todo.id)}><MdOutlineCancel /></button>
                                </>)
                        )
                            : (
                                <>

                                    <textarea
                                        value={textareaValue}
                                        onChange={(e) => setTextareaValue(e.target.value)}
                                    >{todo.text}</textarea>
                                    <button onClick={() => handleSaveEdit(todo.id, textareaValue)}><CiCircleCheck /></button>
                                    <button onClick={() => handleEditMode(null)}><MdOutlineCancel /></button>
                                </>
                            )}
                    </li >
                ))}
            </ul >
        </>
    )
}
