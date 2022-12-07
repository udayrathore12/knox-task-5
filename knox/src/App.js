import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';  
import OrderCard from './components/orderManagement';
import OrderAdd from './components/orderAdd';
import NoMatch from './components/noMatch';

const theme = createTheme();

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
           <Routes>  
                 <Route exact path='/' element={<OrderCard/>}></Route>  
                 <Route exact path='/add' element={<OrderAdd/>}></Route>
                 <Route exact path='*' element={<NoMatch/>}></Route>
          </Routes>  
          </ThemeProvider>
       </Router>  
  );
}

export default App;
