import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {ControlPoint} from "@material-ui/icons";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false, ...props}: AddItemFormPropsType) => {
    console.log("AddItemForm is called")
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        setNewTaskTitle(e.currentTarget.value)
    }

    const addItemHandler = () => {
        const trimmedTitle = newTaskTitle.trim()
        if (trimmedTitle) {
            addItem(trimmedTitle)
        } else {
            setError("Title is required")
        }
        setNewTaskTitle("")
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addItemHandler()
        }
    }

    return (
        <div>
            <TextField value={newTaskTitle}
                       variant={"outlined"}
                       label={"Type value"}
                       onChange={onNewTitleChangeHandler}
                       onKeyPress={onKeyPressHandler}
                       error={!!error}
                       helperText={error}
                       disabled={disabled}
            />
            <IconButton onClick={addItemHandler} color={"primary"} disabled={disabled}>
                <ControlPoint/>
            </IconButton>
        </div>
    )
})