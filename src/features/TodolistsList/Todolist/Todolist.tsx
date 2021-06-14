import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../app/store";
import {addTaskTC, fetchTasksTC} from "./tasks-reducer";
import {Task} from "./Task/Task";
import {FilterValuesType, TodolistDomainType} from "./todolists-reducer";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";

type PropsType = {
    todolist: TodolistDomainType
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist = React.memo(({demo = false, ...props}: PropsType) => {
    console.log("Todolist is called")

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTasksTC(props.todolist.id))
    }, [])
    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todolist.id])
    const dispatch = useDispatch()

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.todolist.id), [props.changeFilter, props.todolist.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.todolist.id), [props.changeFilter, props.todolist.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.todolist.id), [props.changeFilter, props.todolist.id])

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolist.id)
    }, [props.removeTodolist, props.todolist.id])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(props.todolist.id, title))
    }, [dispatch])

    const changeTodolistTitle = useCallback((newTitle: string) => {
        props.changeTodolistTitle(props.todolist.id, newTitle)
    }, [props.changeTodolistTitle, props.todolist.id])

    let tasksForTodolist = tasks

    if (props.todolist.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
    }
    if (props.todolist.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
    }

    return (
        <div>
            <h3><EditableSpan title={props.todolist.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"}/>
            <div>
                {
                    tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}/>)
                }
            </div>
            <div>
                <Button variant={props.todolist.filter === "all" ? "contained" : "text"}
                        onClick={onAllClickHandler}>All
                </Button>
                <Button color={"primary"} variant={props.todolist.filter === "active" ? "contained" : "text"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={"secondary"} variant={props.todolist.filter === "completed" ? "contained" : "text"}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
})