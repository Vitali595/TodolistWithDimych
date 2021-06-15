import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "../todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType} from "../../../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../../app/store";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
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
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => (
    {type: "REMOVE-TASK", taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) => (
    {type: "ADD-TASK", task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => (
    {type: "UPDATE-TASK", taskId, model, todolistId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => (
    {type: "SET-TASKS", tasks, todolistId} as const)

export const fetchTasksTC = (todolistId: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: ThunkDispatch) => {
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

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
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

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type ActionsType = RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType

type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>