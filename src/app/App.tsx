import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {RequestStatusType} from "./app-reducer";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";

type AppPropsType = {
    demo?: boolean
}

function App({demo = false}: AppPropsType) {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

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
                <TodolistsList demo={demo}/>
            </Container>

        </div>
    );
}

export default App;