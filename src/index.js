import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import Login from './components/Login';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Create an ApolloClient instance
const client = new ApolloClient({
  uri: 'https://privoz.lavron.dev/graphql/',
  cache: new InMemoryCache()
});

// Use createRoot from react-dom/client to render the App component wrapped with ApolloProvider
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/game" element={<App />} />
        </Routes>
      </BrowserRouter>

    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
