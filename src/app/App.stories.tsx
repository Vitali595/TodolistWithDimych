import React from 'react';
import {Meta} from '@storybook/react';
import App from "./App";
import {ReduxStoreProviderDecorator} from "../stories/ReduxStoreProviderDecorator";

export default {
  title: 'Todolist/App',
  component: App,
  decorators: [ReduxStoreProviderDecorator]
} as Meta;

export const AppWithReduxBaseExample = () => {
  return <App demo={true}/>
}