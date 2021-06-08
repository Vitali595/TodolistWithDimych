import React from 'react';
import {Meta, Story} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task, TaskPropsType} from "../Task";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

export default {
    title: 'Todolist/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
} as Meta;

const changeTaskStatusCallback = action("Status changed")
const changeTaskTitleCallback = action("Title changed")
const removeTaskCallback = action("Task removed")

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const baseArgs = {
    onChangeStatusHandler: changeTaskStatusCallback,
    onChangeTitleHandler: changeTaskTitleCallback,
    onRemoveHandler: removeTaskCallback
}

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
    ...baseArgs,
    task: {
        id: "1", title: "CSS", status: TaskStatuses.Completed,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1"
    },
    todolistId: "todolistId1"
};

export const TaskIsNoteDoneExample = Template.bind({});
TaskIsNoteDoneExample.args = {
    ...baseArgs,
    task: {
        id: "1", status: TaskStatuses.New, title: "JS",
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1"
    },
    todolistId: "todolistId1",
};