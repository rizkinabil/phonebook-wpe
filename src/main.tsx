import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { globalStyles } from './assets/style/globalStyle.tsx';
import { theme } from './assets/style/theme.ts';
import { ThemeProvider } from '@emotion/react';
import { ToastNotifications, ToastNotificationsProvider } from 'cherry-components';

// set client
import client from './lib/client.ts';
import { ApolloProvider } from '@apollo/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <ToastNotificationsProvider>
          {globalStyles}
          <App />
          <ToastNotifications />
        </ToastNotificationsProvider>
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
);
