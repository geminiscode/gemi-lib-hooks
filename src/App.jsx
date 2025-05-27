import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Validadores } from './libs/index'

function App() {
    const [count, setCount] = useState(0)



    const schema = Validadores.object.shape({
        id: Validadores.number.required(),
        name: Validadores.string.min(3, 'Muy corto').required(),
        address: Validadores.object.shape({
            street: Validadores.string,
            zip: Validadores.number.min(1000, 'Código postal inválido'),
        }).required(),
    });

    const valor = {
        id: 123,
        name: 'Ju',
        address: {
            street: "hola como estas",
            zip: 12345,
        },
    };

    console.log(schema(valor)); // true



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
