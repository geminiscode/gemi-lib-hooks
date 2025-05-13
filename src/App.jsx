import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Validadores } from './libs/index'

function App() {
  const [count, setCount] = useState(0)

  console.log(Validadores.string.required()('hola'))
  console.log(Validadores.number.between(0, 10)(count))
  console.log(Validadores.boolean.required()(false))
  

  const resultado = Validadores.shape({
    nombre: Validadores.string.required().max(10),
    edad: Validadores.number.required().between(0, 100),
    activo: Validadores.boolean.required(),
  })({
    nombre: 'Juan',
    edad: 25,
    activo: true,
  });

  console.log(resultado)
  console.log(Validadores.array.required().min(2).of(Validadores.string.required().min(3)) (['hola', 'mundo']))

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
