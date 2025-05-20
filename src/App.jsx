import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Validadores } from './libs/index'

function App() {
    const [count, setCount] = useState(0)

    const schema = {
        nombre: Validadores.string.required('Nombre obligatorio'),
        edad: Validadores.number.min(-10, 'La edad no puede ser negativa'),
    };

    const validarUsuario = Validadores.object.allowMoreFields();

    /* console.log(1, validarUsuario({
        nombre: 'Juan',
    }, schema));

    console.log(2, validarUsuario({
        edad: 25,
    }, schema));

    console.log(3, validarUsuario({
        nombre: 'Ana',
        edad: -5,
    }, schema));
 */
    console.log(4, validarUsuario({
        nombre: 'Ana',
        edad: 30,
        dni: '12345678',
    }, schema));
    // ❌ 

    

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
