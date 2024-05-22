import { Provider } from 'react-redux'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { store } from './features/store/store'
import { AuthContextProvider } from './context/AuthContext'
import { SocetContextProvider } from './context/SocketContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { routePath } from './routes/RoutePath'

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [path, setPath] = useState(location.pathname);

  useEffect(() => {
    setPath(location.pathname);
    if (path === routePath.home) {
      navigate(routePath.auth.login);
    }
  }, [path, navigate]);

  return (
    <>
      <AuthContextProvider>
        <SocetContextProvider>
          <Provider className="App" store={store}>
            <AppRoutes />
          </Provider>
        </SocetContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
