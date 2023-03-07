import Register from './components/Register';
import Login from './components/Login';
import Layout from './components/Layout';
import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
import Editor from './components/Editor';
import Admin from './components/Admin';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

// Style Imports
import 'normalize.css/normalize.css'
import './styles/styles.scss';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path='login' element={<Login />} />
        <Route path='unauthorized' element={<Unauthorized />} />
        
        {/* private routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path='/' element={<Home />} />
        </Route>
        
        <Route path='editor' element={<Editor />} />
          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
        </Route>
        
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path='register/:id' element={<Register />} />
          <Route path='admin' element={<Admin />} />
        </Route>

        {/* cath all */}
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
