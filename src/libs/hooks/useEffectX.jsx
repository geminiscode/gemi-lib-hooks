import { useEffect, useRef } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para optimizar el uso de `useEffect`, evitando renders innecesarios al ejecutar efectos solo cuando
 * las dependencias cambian de manera significativa según la función de comparación proporcionada.
 * @function useEffectX
 * @param {function} callback - Función que se ejecuta cuando las dependencias cambian significativamente.
 * @param {Array} dependencies - Array de dependencias que se comparan en cada render para determinar si se debe ejecutar el efecto.
 * @param {function} [comparisonFn] - Función opcional que compara las dependencias anteriores con las nuevas. Por defecto utiliza `===`.
 * 
 * 
 * @returns {void} No retorna ningún valor, pero optimiza la ejecución de `callback` al evitar ejecuciones innecesarias.
 * 
 * @example
 * import useEffectX from './useEffectX';
 * 
 * const MiComponente = () => {
 *   const [valor, setValor] = useState(0);
 * 
 *   useEffectX(() => {
 *     console.log('El valor ha cambiado:', valor);
 *   }, [valor]);
 * 
 *   return (
 *     <div>
 *       <button onClick={() => setValor(valor + 1)}>Incrementar valor</button>
 *     </div>
 *   );
 * };
 * 
 * @note
 * - Este hook compara las dependencias utilizando una función personalizada que puede ser ajustada según las necesidades del componente.
 * - Si no se pasa una función de comparación (`comparisonFn`), la comparación por defecto será `===`.
 * - Ideal para evitar la ejecución innecesaria de efectos cuando las dependencias contienen objetos o arrays que podrían cambiar de referencia sin cambiar su contenido.
 * - Útil en escenarios donde se desee controlar cuándo exactamente ejecutar un efecto, basado en cambios complejos en el estado o props.
 * 
 * @internal
 * - Este hook usa un `useRef` para almacenar las dependencias anteriores y compararlas en cada render.
 * - Si las dependencias cambian significativamente (según la función de comparación), actualiza las referencias y ejecuta el efecto.
 */
function useEffectX(callback, dependencies, comparisonFn = (prev, next) => prev === next) {
    const prevDepsRef = useRef();



    useEffect(() => {
        if (!prevDepsRef.current) {
            // Primera vez que se monta el componente
            prevDepsRef.current = dependencies;
            callback();
            return;
        }



        // Comparar dependencias manualmente con la función de comparación
        const hasChanged = dependencies.some((dep, i) => !comparisonFn(dep, prevDepsRef.current[i]));



        if (hasChanged) {
            prevDepsRef.current = dependencies;
            callback();
        }
    }, [callback, comparisonFn, dependencies]);



}



/////////////////////////////////////////////////////////////////////////////////////////////////
//EXPORTS--------------------------------------------------------------------------------------//
/////////////////////////////////////////////////////////////////////////////////////////////////



export default useEffectX;