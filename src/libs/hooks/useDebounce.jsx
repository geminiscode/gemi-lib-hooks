import { useState, useEffect, useCallback } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para manejar debounce en valores. Este hook retrasa la actualización del valor hasta que el usuario
 * haya dejado de interactuar con el mismo durante el tiempo especificado. También permite ejecutar al inicio (leading edge) y cancelar manualmente.
 * 
 * @function useDebounce
 * @param {any} value - El valor que deseas aplicar debounce (puede ser un valor o una función).
 * @param {number} delay - El tiempo de espera en milisegundos antes de actualizar el valor.
 * @param {boolean} [options.leading=false] - Si se debe ejecutar inmediatamente en la primera invocación (leading edge).
 * 
 * @returns {Object} Un objeto con:
 *   - `debouncedValue`: El valor con debounce aplicado.
 *   - `cancelDebounce`: Función para cancelar manualmente el debounce.
 *
 * @example
 * import useDebounce from './useDebounce';
 * 
 * const SearchComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const { debouncedValue, cancelDebounce } = useDebounce(searchTerm, 500);
 *   
 *   useEffect(() => {
 *     if (debouncedValue) {
 *       // Lógica para realizar la búsqueda o consulta
 *       console.log('Buscando:', debouncedValue);
 *     }
 *   }, [debouncedValue]);
 *   
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={searchTerm}
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *         placeholder="Buscar..."
 *       />
 *       <button onClick={cancelDebounce}>Cancelar búsqueda</button>
 *     </div>
 *   );
 * };
 * 
 * @note
 * - Con `leading: true`, el valor o función se ejecuta al inicio y luego aplica debounce.
 * - Puedes cancelar manualmente el debounce con la función retornada.
 */
function useDebounce(value, delay, options = { leading: false }) {
    const { leading } = options;
    const [debouncedValue, setDebouncedValue] = useState(leading ? value : null);
    const [timeoutId, setTimeoutId] = useState(null);

    const cancelDebounce = useCallback(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }, [timeoutId]);

    useEffect(() => {
        if (leading && !debouncedValue) {
            setDebouncedValue(value);
        }

        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        setTimeoutId(handler);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, leading]);

    return {
        debouncedValue,
        cancelDebounce,
    };
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useDebounce;