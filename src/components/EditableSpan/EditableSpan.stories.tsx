import React from 'react';
import {Meta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {EditableSpan} from "./EditableSpan";

export default {
  title: 'Todolist/EditableSpan',
  component: EditableSpan
} as Meta;

const changeCallback = action("Value changed")

export const EditableSpanExample = () => {
  return <EditableSpan title={"Start value"} onChange={changeCallback}/>
}