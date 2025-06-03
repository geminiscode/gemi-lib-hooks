import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Consts_Validadores } from './libs/hooks/usePropTypes/validadores/Constants'
import Validadores from './libs/hooks/usePropTypes/validadores/Validadores'



function App() {
    const [count, setCount] = useState(0)

    const validateUser = Validadores.object.shape({
        id: Validadores.number.required(),
        nombre: Validadores.string.min(3),
        email: Validadores.string.min(3),
    }).requiredKeys(['id', 'nombre']).validateValues();

    console.log(validateUser({ id: 123, nombre: 'Ans'})); // true ✅
    console.log(validateUser({ nombre: 'Ana', id: 100, email: "shs" })); // Error ❌ (falta "id")
    console.log(validateUser({ id: 123, nombre: 'Ana', email: "shs" })); // Error ❌ (falta "nombre")
    console.log(validateUser({ id: 123, nombre: 'Ana', email: "shs" })); // Error ❌ (clave no permitida)



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