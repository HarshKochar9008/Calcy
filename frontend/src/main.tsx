import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SorobanReactProvider } from '@soroban-react/core'
import { freighter } from '@soroban-react/freighter'
import { testnet } from '@soroban-react/chains'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SorobanReactProvider
      chains={[testnet]}
      connectors={[freighter()]}
      appName="EduChain Scholarships"
    >
      <App />
    </SorobanReactProvider>
  </StrictMode>,
)
