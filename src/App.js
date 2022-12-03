import logo from './fehello.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar" id='navbar'>
        <div className="container-fluid">
          <h1>Corean's Compiler</h1>
        </div>
      </nav>
      <div className='botones'>
        <button className='boton1'>Import</button>
        <button className='boton2'>Compile</button>
      </div>
      <div className="container">
        <textarea className='codigo'>
        </textarea>
        <img className='logo' src={logo} />
        <textarea className='resultado'>
        </textarea>
      </div>
    </div>
  );
}

export default App;
