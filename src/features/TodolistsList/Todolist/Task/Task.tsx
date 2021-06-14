import {useDispatch} from "react-redux";
import {removeTaskTC, updateTaskTC} from "../tasks-reducer";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useDispatch()

    const onRemoveHandler = () => {
        dispatch(removeTaskTC(props.task.id, props.todolistId))
    }
    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(updateTaskTC(props.task.id, {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}, props.todolistId))
    }, [dispatch])
    const onChangeTitleHandler = useCallback((newValue: string) => {
        dispatch(updateTaskTC(props.task.id, {title: newValue}, props.todolistId))
    }, [dispatch])

    return <div className={props.task.status === TaskStatuses.Completed ? "is-done" : ""} key={props.task.id}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            onChange={onChangeStatusHandler}
        />
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton onClick={onRemoveHandler}>
            <Delete/>
        </IconButton>
    </div>
})