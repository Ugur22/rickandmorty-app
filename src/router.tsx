import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { CharactersPage } from './features/characters/pages/CharactersPage'
import { CharacterDetailPage } from './features/characters/pages/CharacterDetailPage'
import { EpisodesPage } from './features/episodes/pages/EpisodesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <CharactersPage /> },
      { path: 'characters/:id', element: <CharacterDetailPage /> },
      { path: 'episodes', element: <EpisodesPage /> },
    ],
  },
])
