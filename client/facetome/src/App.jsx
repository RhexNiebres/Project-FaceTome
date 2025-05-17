import '../src/styles/App.css';  
import NavBar from './components/NavBar';
import { Outlet } from 'react-router-dom';
const App = () => {
  return (
    <div>
      <NavBar/>
      <Outlet/>
    </div>
  );
};

export default App;


