import { useEffect, useCallback, useRef } from "react";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook para manejar atajos de teclado (combinaciones de teclas).
 * Permite agregar, eliminar y registrar atajos de teclado con sus callbacks.
 * 
 * @function useKeyboardShortcuts
 * @returns {Object} - Métodos para manejar atajos de teclado.
 * 
 * @returns {function} addShortcut - Agregar un atajo de teclado con su callback.
 * @returns {function} removeShortcut - Eliminar un atajo de teclado.
 * @returns {function} registerShortcut - Registrar un atajo de teclado.
 * 
 * @example
 * import useKeyboardShortcuts from './useKeyboardShortcuts';
 * 
 * const App = () => {
 *   const { registerShortcut } = useKeyboardShortcuts();
 * 
 *   useEffect(() => {
 *     registerShortcut("Ctrl+s", () => alert("Guardando..."));
 *     registerShortcut("Ctrl+c", () => alert("Copiando..."));
 *   }, [registerShortcut]);
 * 
 *   return (
 *     <div>
 *       <h1>Prueba de atajos de teclado</h1>
 *       <p>Presiona Ctrl+S para guardar o Ctrl+C para copiar.</p>
 *     </div>
 *   );
 * };
 * 
 * export default App;
 * 
 * @note
 * - El hook escucha el evento `keydown` para ejecutar el callback asociado.
 * - Los atajos se registran con combinaciones como `"Ctrl+key"`, `"Alt+key"`, etc.
 * 
 * @internal
 * - Los atajos se gestionan con `useRef` para evitar perderlos durante el ciclo de vida.
 * - Se usa `event.preventDefault()` para evitar la acción predeterminada del navegador.
 */
const useKeyboardShortcuts = () => {



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useRef)----------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const shortcuts = useRef({});



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useCallbacks)----------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const addShortcut = useCallback((keyCombo, callback) => {
        shortcuts.current[keyCombo] = callback;
    }, []);

    const removeShortcut = useCallback((keyCombo) => {
        delete shortcuts.current[keyCombo];
    }, []);

    const registerShortcut = useCallback((combination, callback) => {
        addShortcut(combination, callback);
    }, [addShortcut]);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useEffects)------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    useEffect(() => {
        const handleKeyDown = (event) => {
            const keyCombo = `${event.ctrlKey ? "Ctrl+" : ""}${event.altKey ? "Alt+" : ""
                }${event.shiftKey ? "Shift+" : ""}${event.key}`;

            if (shortcuts.current[keyCombo]) {
                event.preventDefault();
                shortcuts.current[keyCombo](event);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURN ---------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    return { addShortcut, removeShortcut, registerShortcut };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useKeyboardShortcuts;