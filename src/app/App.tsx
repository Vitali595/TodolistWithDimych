import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "../features/TodolistsList/Todolist/Todolist";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from "../features/TodolistsList/Todolist/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {TaskType} from "../api/todolists-api";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {RequestStatusType} from "./app-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type AppPropsType = {
    demo?: boolean
}

function App({demo = false}: AppPropsType) {

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTodolistsTC())
    }, [])

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

    const dispatch = useDispatch()

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    const changeTodolistFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(value, todolistId))
    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, newTitle: string) => {
        dispatch(changeTodolistTitleTC(id, newTitle))
    }, [dispatch])

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton edge={"start"} color={"inherit"} aria-label={"menu"}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        Todolist
                    </Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {

                            return <Grid key={tl.id} item>
                                <Paper elevation={6} style={{padding: "20px"}}>
                                    <Todolist
                                        todolist={tl}
                                        key={tl.id}
                                        changeTodolistTitle={changeTodolistTitle}
                                        changeFilter={changeTodolistFilter}
                                        removeTodolist={removeTodolist}
                                        demo={demo}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>

            </Container>

        </div>
    );
}

export default App;