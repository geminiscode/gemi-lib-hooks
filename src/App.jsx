import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Consts_Validadores } from './libs/hooks/usePropTypes/validadores/Constants'
import Validadores from './libs/hooks/usePropTypes/validadores/Validadores'



function App() {
    const [count, setCount] = useState(0)


    const array = Validadores.array;
    const string = Validadores.string;
    const number = Validadores.number;
    const boolean = Validadores.boolean;



    // ✅ 1. Validar que sea un array
    console.log('--- 1. Validar que sea un array ---');
    console.log(array(['hola', 'mundo'])); // true ✅
    console.log(array('esto no es un array')); // Error: El valor proporcionado no es un array. ❌
    console.log(array([1, 2, 3])); // true ✅

    // ✅ 2. Validar longitud mínima
    console.log('\n--- 2. Validar longitud mínima ---');
    const min3 = array.minLength(3);
    console.log(min3([1, 2])); // Error: El array debe tener al menos 3 elementos. ❌
    console.log(min3([1, 2, 3])); // true ✅

    // ✅ 3. Validar longitud máxima
    console.log('\n--- 3. Validar longitud máxima ---');
    const max2 = array.maxLength(2);
    console.log(max2([1, 2, 3])); // Error: El array no puede tener más de 2 elementos. ❌
    console.log(max2([1, 2])); // true ✅

    // ✅ 4. Permitir array vacío
    console.log('\n--- 4. Permitir array vacío ---');
    const optionalEmpty = array.optionalEmpty();
    console.log(optionalEmpty([])); // true ✅
    console.log(optionalEmpty([1, 2])); // true ✅

    // ✅ 5. Validar que todos los elementos sean del mismo tipo (ofOne)
    console.log('\n--- 5. Validar todos los elementos sean del mismo tipo (ofOne) ---');
    const ofOnlyStrings = array.ofOne(string);
    console.log(ofOnlyStrings(['hola', 'mundo'])); // true ✅
    console.log(ofOnlyStrings(['hola', 123])); // Error en posición [1]: Se esperaba un valor de tipo "string", pero se recibió "number". ❌

    // ✅ 6. Validar que los elementos sean de algún tipo permitido (ofAny)
    console.log('\n--- 6. Validar elementos sean de algún tipo permitido (ofAny) ---');
    const ofStringOrNumber = array.ofAny(string, number);
    console.log(ofStringOrNumber(['hola', 123, 'mundo'])); // true ✅
    console.log(ofStringOrNumber(['hola', true])); // Error en posición [2]: Tipo "boolean" no permitido. Se esperaba: string, number. Valor recibido: true ❌

    // ✅ 7. Combinar varias reglas
    console.log('\n--- 7. Combinar varias reglas ---');
    const validator = array
        .minLength(2)
        .maxLength(4)
        .ofOne(number);

    console.log(validator([1])); // Error: El array debe tener al menos 2 elementos. ❌
    console.log(validator([1, 2, 3, 4, 5])); // Error: El array no puede tener más de 4 elementos. ❌
    console.log(validator([1, 2])); // true ✅
    console.log(validator([1, 'hola'])); // Error en posición [1]: Se esperaba un valor de tipo "number", pero se recibió "string". ❌

    // ✅ 8. Usar __config() para configurar todo de una vez
    console.log('\n--- 8. Usar __config() para configurar todo de una vez ---');
    const configValidator = array.__config({
        minLength: 1,
        maxLength: 3,
    });

    console.log(configValidator([])); // Error: El array no puede estar vacío. ❌
    console.log(configValidator([1, 2, 3])); // true ✅
    console.log(configValidator([1, 2, 3, 4])); // Error: El array no puede tener más de 3 elementos. ❌

    // ✅ 9. Probar con validador inválido (debería mostrar error detallado)
    console.log('\n--- 9. Probar con validador inválido ---');

    // Caso 1: Pasar un validador inválido
    const invalidValidator = {}; // Simulamos un validador inválido
    const badValidator = array.ofOne(invalidValidator);
    console.log(badValidator(['hola']));
    // Debe mostrar:
    // Error: El validador en la posición [0] (desconocido) no es válido. ❌

    // Caso 2: En ofAny, uno de los validadores es inválido
    const badValidatorInList = array.ofAny(string, {});
    console.log(badValidatorInList(['hola', 123]));
    // Debe mostrar:
    // Error: El validador en la posición [1] (desconocido) no es válido. ❌

    // ✅ 10. Validar array vacío opcional
    console.log('\n--- 10. Validar array vacío opcional ---');
    const optionalEmptyArray = array.optionalEmpty();
    console.log(optionalEmptyArray([])); // true ✅
    console.log(optionalEmptyArray([1, 2])); // true ✅



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