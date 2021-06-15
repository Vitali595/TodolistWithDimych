import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from "../../app/app-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "ADD-TODOLIST":
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "SET-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        default:
            return state
    }
}

export const removeTodolistAC = (id: string) => (
    {type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => (
    {type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => (
    {type: "CHANGE-TODOLIST-TITLE", id, title} as const)
export const changeTodolistFilterAC = (filter: FilterValuesType, id: string) => (
    {type: "CHANGE-TODOLIST-FILTER", id, filter} as const)
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => (
    {type: "SET-TODOLIST-ENTITY-STATUS", id, status} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => (
    {type: "SET-TODOLISTS", todolists} as const)

export const fetchTodolistsTC = () => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const addTodolistTC = (title: string) => (dispatch: ThunkDispatch) => {
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

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.updateTodolist(id, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export type FilterValuesType = "all" | "completed" | "active"

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType
    | SetTodolistsActionType | SetAppStatusActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>

type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>