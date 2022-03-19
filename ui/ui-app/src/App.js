import logo from './logo.svg';
import {Home} from './Home';
import {Product} from './Product';
import {Category} from './Category';
import {Route,Routes,Link, BrowserRouter} from 'react-router-dom';
import {Navbar,Nav,Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <BrowserRouter>
  <Navbar bg="light" variant="light">
    <Container>
    <Navbar.Brand href="/" className='btn'>FishingStore</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link><Link to="/product" className='btn'>Товары</Link></Nav.Link>
      <Nav.Link><Link to="/category" className='btn'>Категории</Link></Nav.Link>
    </Nav>
    </Container>
  </Navbar>
  <Container>
      <Routes>
        <Route exact path='/product' element={<Product/>}/>
        <Route exact path='/category' element={<Category/>}/>
        </Routes>
        
        </Container>
    </BrowserRouter>
  );
}

export default App;
