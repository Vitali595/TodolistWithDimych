import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {logoutTC} from "../features/Login/auth-reducer";

type AppPropsType = {
    demo?: boolean
}

function App({demo = false}: AppPropsType) {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    // const logoutHandler = useCallback(() => {
    //     dispatch(logoutTC())
    // }, [])

    useEffect(() => {
        dispatch(initializeAppTC())
    })

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
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
                        {isLoggedIn && <Button color="inherit" onClick={() => {dispatch(logoutTC())}}>Log out</Button>}
                    </Toolbar>
                    {status === "loading" && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Switch>
                        <Route exact path={"/"} render={() => <TodolistsList demo={demo}/>}/>
                        <Route path={"/login"} render={() => <Login/>}/>
                        <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                        <Redirect from={"*"} to={"/404"}/>
                    </Switch>
                </Container>
            </div>
        </BrowserRouter>
    );
}

export default App;