import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Validadores from './libs/hooks/usePropTypes/validadores/Validadores'

function App() {
  const [count, setCount] = useState(0)

  console.log(Validadores.string("hola")); // true
  console.log(Validadores.string.required()("")); // Error: Este campo es requerido.
  console.log(Validadores.string.min(3)("ab")); // Error: Debe tener al menos 3 caracteres.
  console.log(Validadores.string.max(5)("abcdef")); // Error: No puede superar los 5 caracteres.
  console.log(Validadores.string.required().min(3).max(5)("hola")); // true

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}



export default App