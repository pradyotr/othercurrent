import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from './components/ui/provider'
import { Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Provider>
        <App />
      </Provider>
    </Router>
  </StrictMode>,
)
