import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {tasksReducer} from "../features/TodolistsList/Todolist/tasks-reducer";
import thunkMiddleware from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

// @ts-ignore
window.store = store;