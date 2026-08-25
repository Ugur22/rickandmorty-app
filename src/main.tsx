import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { client } from './graphql/client'
import { router } from './router'
import { store } from './app/store'
import { syncThemeToDom } from './features/theme/syncThemeToDom'
import './index.css'

syncThemeToDom(store)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </Provider>
  </StrictMode>,
)
