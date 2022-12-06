import React, { useState, useEffect } from 'react';
import { analize } from './services/analizador';
import logo from './fehello.jpg';
import './App.css';

function App() {

  const [saveFiles, setSaveFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const [selectedFile, setSelectedFile] = useState(0);
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);

  const handleFileInput = (e) => {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    setSaveFiles([...filesArr]);
  };
  const handleAnalizeCode = () => {
    console.log('olap')
    if (files[0]) {
      const results = analize(code);
      setResults(results);
    }
  };

  const handleTextAreaChange = async (e) => {
    setCode(e.target.value);
  };

  useEffect(() => {
    (async () => {
      if (saveFiles[0]) {
        const check = new Set();
        files.forEach((file) => {
          check.add(file.name);
        });
        if (check.has(saveFiles[0].name)) {
        } else {
          const text = await saveFiles[0].text();
          setSelectedFile(files.length);
          setCode(text);
        }
        setSaveFiles([]);
      }
    })();
  }, [saveFiles]);

  useEffect(() => {
    setFiles([{ ...files[0], name: "actual", text: code }]);
  }, [code]);



  return (
    <div className="App">
      <nav className="navbar" id='navbar'>
        <div className="container-fluid">
          <h1>Corean's Compiler</h1>
        </div>
      </nav>
      <div className='botones'>
        <input type="file"
          onChange={handleFileInput}
          id="file" name='file'
          accept='.txt, .js, .jsx, .ts, .tsx' />
        <label htmlFor='file' className='boton1'>
          Import
        </label>
        <label type="button" id='button' name='button' className='boton1' onClick={(e) => handleAnalizeCode()} >Compile</label>
      </div>
      <div className="container">
        <textarea className='codigo' rows={10} cols={40} value={code} onChange={handleTextAreaChange}>
        </textarea>
        <img className='logo' src={logo} alt='' />
        <div className='resultado'>
          <span>Terminal</span><br />
          {results && results?.codeProcessed.length > 0 ? (
            <React.Fragment>
              Codigo compilado
              <p>{results && results.codeProcessed}</p>
              <div>
                {(results && results?.errors?.length > 0) ? (
                  <React.Fragment>
                    <table>
                      <thead>
                        <tr>
                          <th>Linea</th>
                          <th>Columna</th>
                          <th>Descripcion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results && results?.errors?.map((error, index) => (
                          <tr key={index}>
                            <td>{error.line}</td>
                            <td>{error.column}</td>
                            <td>{error.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </React.Fragment>
                ) : "Sin errores"}
              </div>
            </React.Fragment>
          ) : "Esperando entradas"}
        </div>
      </div>
    </div>
  );
}

export default App;
