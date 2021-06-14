import {TasksStateType} from "../../../app/App";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType} from "../../../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../../app/store";
import {setAppErrorAC, SetAppErrorActionType, SetAppStatusActionType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";


type RemoveTaskAT = {
    type: "REMOVE-TASK"
    taskId: string
    todolistId: string
}
type AddTaskAT = {
    type: "ADD-TASK"
    task: TaskType
}
type UpdateTaskAT = {
    type: "UPDATE-TASK"
    taskId: string
    model: UpdateDomainTaskModelType
    todolistId: string
}

export type SetTasksActionType = {
    type: "SET-TASKS",
    tasks: Array<TaskType>
    todolistId: string
}

type ActionType = RemoveTaskAT
    | AddTaskAT
    | UpdateTaskAT
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType
    | SetAppErrorActionType
    | SetAppStatusActionType

type ThunkDispatch = Dispatch<ActionType | SetAppStatusActionType | SetAppErrorActionType>

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            let stateCopy = {...state}
            stateCopy[action.todolistId] = stateCopy[action.todolistId].filter(t => t.id !== action.taskId)
            return stateCopy
        }
        case "ADD-TASK": {
            let newTask = action.task
            return {...state, [action.task.todoListId]: [newTask, ...state[action.task.todoListId]]}
            // const stateCopy = {...state}
            // const tasks = stateCopy[action.task.todolistId];
            // const newTasks = [action.task, ...tasks];
            // stateCopy[action.task.todolistId] = newTasks;
            // return stateCopy;
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    ...action.model
                } : t)
            }
        }
        case "ADD-TODOLIST": {
            let stateCopy = {
                ...state,
            }
            stateCopy[action.todolist.id] = []
            return stateCopy
        }
        case "REMOVE-TODOLIST": {
            let stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case "SET-TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "SET-TASKS": {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskAT => {
    return {type: "REMOVE-TASK", taskId, todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskAT => {
    return {type: "ADD-TASK", task}
}
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string): UpdateTaskAT => {
    return {type: "UPDATE-TASK", taskId, model, todolistId}
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: "SET-TASKS", tasks, todolistId}
}

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}

export const removeTaskTC = (taskId: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.deleteTask(todolistId, taskId)
            .then(res => {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}

export const addTaskTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.createTask(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const task = res.data.data.item
                    dispatch(addTaskAC(task))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => {
    return (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {

        const state = getState()

        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn("task not found in the state")
            return
        }

        const apiModel: UpdateTaskType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            title: task.title,
            ...domainModel
        }
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}