import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskType} from "./Todolist";

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useDispatch()

    const onRemoveHandler = () => {
        dispatch(removeTaskAC(props.task.id, props.todolistId))
    }
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(changeTaskStatusAC(props.task.id, newIsDoneValue, props.todolistId))
    }
    const onChangeTitleHandler = useCallback((newValue: string) => {
        dispatch(changeTaskTitleAC(props.task.id, newValue, props.todolistId))
    }, [dispatch])

    return <div className={props.task.isDone ? "is-done" : ""} key={props.task.id}>
        <Checkbox
            checked={props.task.isDone}
            onChange={onChangeStatusHandler}
        />
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton onClick={onRemoveHandler}>
            <Delete/>
        </IconButton>
    </div>
})