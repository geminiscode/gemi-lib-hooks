import { useState, useEffect, useRef } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para controlar un historial de acciones, 
 * con soporte para `undo` y `redo`, observando múltiples estados de React.
 * 
 * @function useHistoryState
 * @param {Array} states - Lista de objetos `{ state, setState }` que se desean observar.
 * @returns {Object} - Métodos y estado para manejar el historial de acciones.
 * 
 * @returns {function} undo - Revertir al estado anterior en el historial.
 * @returns {function} redo - Avanzar al siguiente estado en el historial.
 * @returns {boolean} canUndo - Indica si hay acciones disponibles para deshacer.
 * @returns {boolean} canRedo - Indica si hay acciones disponibles para rehacer.
 * @returns {function} addCheckpoint - Agregar manualmente un nuevo punto en el historial.
 * @returns {Array} history - El historial completo de acciones (solo lectura).
 * 
 * @example
 * import useHistoryState from './useHistoryState';
 * 
 * const CounterApp = () => {
 *   const [count, setCount] = useState(0);
 *   const [text, setText] = useState('');
 * 
 *   const {
 *     undo,
 *     redo,
 *     canUndo,
 *     canRedo,
 *     addCheckpoint
 *   } = useHistoryState([
 *     { state: count, setState: setCount },
 *     { state: text, setState: setText }
 *   ]);
 * 
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <p>Text: {text}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *       <button onClick={() => setText('Updated Text')}>Update Text</button>
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *       <button onClick={redo} disabled={!canRedo}>Redo</button>
 *       <button onClick={addCheckpoint}>Save Checkpoint</button>
 *     </div>
 *   );
 * };
 * 
 * export default CounterApp;
 * 
 * @note
 * - El hook registra automáticamente cambios en los estados observados.
 * - `addCheckpoint` permite registrar un estado manualmente en el historial.
 * - Se utiliza una lista doblemente enlazada para gestionar los puntos del historial.
 * 
 * @internal
 * - El historial se almacena en dos listas (para optimizar `undo` y `redo`).
 * - Se utilizan referencias (`useRef`) para evitar bucles infinitos al sincronizar estados.
 */
const useHistoryState = (states) => {



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useStates)-------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useRef)----------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const stateRefs = useRef(states.map(({ state }) => state));



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useCallbacks)----------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    // Aplicar un estado desde el historial
    const applyState = (index) => {
        const snapshot = history[index];
        if (!snapshot) return;

        snapshot.forEach((value, i) => {
            const { setState } = states[i];
            setState(value);
        });
    };

    // Métodos del historial
    const undo = () => {
        if (currentIndex <= 0) return;
        setCurrentIndex((prev) => prev - 1);
        applyState(currentIndex - 1);
    };

    const redo = () => {
        if (currentIndex >= history.length - 1) return;
        setCurrentIndex((prev) => prev + 1);
        applyState(currentIndex + 1);
    };

    const addCheckpoint = () => {
        const currentStates = states.map(({ state }) => state);
        const updatedHistory = history.slice(0, currentIndex + 1);
        updatedHistory.push(currentStates);
        setHistory(updatedHistory);
        setCurrentIndex(updatedHistory.length - 1);
    };



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useEffects)------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    // Sincronizar estados observados con el historial
    useEffect(() => {
        const currentStates = states.map(({ state }) => state);
        if (
            currentIndex === -1 ||
            JSON.stringify(currentStates) !== JSON.stringify(history[currentIndex])
        ) {
            const updatedHistory = history.slice(0, currentIndex + 1);
            updatedHistory.push(currentStates);
            setHistory(updatedHistory);
            setCurrentIndex(updatedHistory.length - 1);
        }
    }, states.map(({ state }) => state));



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURN ---------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    return {
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        addCheckpoint,
        history: [...history],
    };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useHistoryState;