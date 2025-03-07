import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Layout from "./Layout"
import LoginForm from './Login'
import RegistrationForm from './Registration'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path='/register' element={<RegistrationForm />}></Route>
          <Route path='/login' element={<LoginForm />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App