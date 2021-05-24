import React from 'react';
import {Meta} from '@storybook/react';
import AppWithRedux from "../AppWithRedux";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";

export default {
  title: 'Todolist/AppWithRedux',
  component: AppWithRedux,
  decorators: [ReduxStoreProviderDecorator]
} as Meta;

export const AppWithReduxBaseExample = () => {
  return <AppWithRedux/>
}