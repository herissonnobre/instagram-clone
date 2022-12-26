import React from 'react';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Unrecognized WebSocket']);

import Routes from './routes';

export default function App() {
  return <Routes />;
}
