import React from 'react'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'

function App(): React.ReactElement {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}

export default App
