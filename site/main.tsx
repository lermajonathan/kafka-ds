// Kafka docs site. Hash routes (#/components/chip) so GitHub Pages needs no server rules.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/kafka.css'
import './site.css'
import { App } from './app'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
