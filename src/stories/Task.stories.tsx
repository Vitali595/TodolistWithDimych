import React from 'react';
import {Meta, Story} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task, TaskPropsType} from "../Task";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";

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
  task: {id: "1", isDone: true, title: "CSS"},
  todolistId: "todolistId1"
};

export const TaskIsNoteDoneExample = Template.bind({});
TaskIsNoteDoneExample.args = {
  ...baseArgs,
  task: {id: "1", isDone: false, title: "JS"},
  todolistId: "todolistId1",
};