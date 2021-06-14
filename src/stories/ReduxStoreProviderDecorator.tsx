import React from 'react';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {tasksReducer} from '../features/TodolistsList/Todolist/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/Todolist/todolists-reducer';
import {v1} from 'uuid';
import {AppRootStateType} from "../app/store";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {appReducer} from "../app/app-reducer";
import thunkMiddleware from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", entityStatus: "idle", order: 0, addedDate: ""},
        {id: "todolistId2", title: "What to buy", filter: "all", entityStatus: "loading", order: 0, addedDate: ""}
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: ""
            }
        ],
        ["todolistId2"]: [
            {
                id: v1(), title: "Milk", status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: ""
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: ""
            }
        ]
    },
    app: {
        error: null,
        status: "idle"
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunkMiddleware));

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)