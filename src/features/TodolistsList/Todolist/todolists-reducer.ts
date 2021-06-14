import {todolistsAPI, TodolistType} from "../../../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppErrorAC, setAppStatusAC, SetAppStatusActionType} from "../../../app/app-reducer";

export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST"
    id: string
}

export type AddTodolistActionType = {
    type: "ADD-TODOLIST"
    todolist: TodolistType
}

export type ChangeTodolistTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE"
    id: string
    title: string
}

export type ChangeTodolistFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER"
    id: string
    filter: FilterValuesType
}

export type SetTodolistsActionType = {
    type: "SET-TODOLISTS"
    todolists: Array<TodolistType>
}

type ActionType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType
    | SetTodolistsActionType | SetAppStatusActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = "all" | "completed" | "active"

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.id)
        }
        case "ADD-TODOLIST": {
            const newTodolist: TodolistDomainType = {...action.todolist, filter: "all", entityStatus: "idle"}
            return [newTodolist, ...state]
        }
        case "CHANGE-TODOLIST-TITLE": {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.title = action.title
            }
            return [...state]
        }
        case "CHANGE-TODOLIST-FILTER": {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case "SET-TODOLIST-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => {
                return {
                    ...tl,
                    filter: "all",
                    entityStatus: "idle"
                }
            })
        }
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}

export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolist}
}

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: "CHANGE-TODOLIST-TITLE", id: id, title: title}
}

export const changeTodolistFilterAC = (filter: FilterValuesType, id: string): ChangeTodolistFilterActionType => {
    return {type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter}
}

export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: "SET-TODOLIST-ENTITY-STATUS", id, status
} as const)

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {type: "SET-TODOLISTS", todolists}
}

export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}

export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setAppErrorAC("Some error occurred"))
                    }
                    dispatch(setAppStatusAC("failed"))
                }
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}