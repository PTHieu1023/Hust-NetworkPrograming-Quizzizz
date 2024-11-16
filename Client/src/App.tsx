import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { AuthProvider } from './contexts/AuthContext'
import RootComponent from './RootComponent'
import { persistor, store } from './store/reducers/store'

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthProvider>
                    <RootComponent />
                </AuthProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
