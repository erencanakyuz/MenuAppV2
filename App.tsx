import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, InteractionManager } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Improve startup performance by ignoring specific warnings
LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
  'RCTBridge required dispatch_sync',
]);

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#10b981',
    secondary: '#6366f1',
  },
};

export default function App() {

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {

    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}