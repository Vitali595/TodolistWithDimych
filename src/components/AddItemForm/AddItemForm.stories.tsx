import React from 'react';
import {Meta, Story} from '@storybook/react';

import {AddItemForm, AddItemFormPropsType} from "./AddItemForm";
import {action} from "@storybook/addon-actions";

export default {
  title: 'Todolist/AddItemForm',
  component: AddItemForm
} as Meta;

const Template: Story<AddItemFormPropsType> = (args) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
  addItem: action("Button 'add' was pressed inside the form")
};

export const AddItemFormDisabledExample = Template.bind({});
AddItemFormDisabledExample.args = {
  addItem: action("Button 'add' was pressed inside the form"),
  disabled: true
};