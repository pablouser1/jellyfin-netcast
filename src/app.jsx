import Router from 'preact-router'
import Home from './views/Home'
import Login from './views/Login'
import { createHashHistory } from 'history'
const App = () => (
  <Router history={createHashHistory()}>
    <Home path='/' />
    <Login path='/login' />
  </Router>
)

export default App
