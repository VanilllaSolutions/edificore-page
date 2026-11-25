import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EdifiCoreLanding from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EdifiCoreLanding />
  </StrictMode>,
)
