import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App' // Itt figyelj: ha az App.tsx a src/app mappában van, akkor ez jó. 

import './styles/tailwind.css'
import './styles/theme.css'
import './styles/index.css'
import './styles/fonts.css' // (Ha a fonts egy mappa, akkor ezt a sort töröld ki!)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)