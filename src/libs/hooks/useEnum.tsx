import { useMemo } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Custom hook para crear un "enum-like" object similar a un enum class de Kotlin.
 * Este hook permite definir un conjunto fijo de constantes con propiedades y métodos adicionales,
 * facilitando la gestión de valores predefinidos en aplicaciones React y TypeScript.
 *
 * @function useEnum
 * @template T - Tipo genérico que representa los valores del enum. Puede ser cualquier tipo válido en TypeScript (por ejemplo, `string`, `number`, etc.).
 * @param {Record<string, T>} enumDefinition - Un objeto que define las claves y valores del enum.
 *                                             Cada clave representa el nombre de la constante, y su valor es el valor asociado.
 *                                             Ejemplo:
 *                                             ```
 *                                             {
 *                                               PENDING: 'pending',
 *                                               IN_PROGRESS: 'in_progress',
 *                                               COMPLETED: 'completed'
 *                                             }
 *                                             ```
 * @returns {Object} - Un objeto inmutable que representa el enum con métodos adicionales para su manipulación.
 *
 * @property {function} keys - Devuelve un array con todas las claves (nombres) del enum.
 *                             Ejemplo: ['PENDING', 'IN_PROGRESS', 'COMPLETED']
 *                             @returns {Array<string>} - Array con las claves del enum.
 * @property {function} values - Devuelve un array con todos los valores del enum.
 *                               Ejemplo: ['pending', 'in_progress', 'completed']
 *                               @returns {Array<T>} - Array con los valores del enum.
 * @property {function} contains - Verifica si un valor existe en el enum.
 *                                 @param {any} value - El valor a verificar.
 *                                 @returns {boolean} - True si el valor existe en el enum, false en caso contrario.
 * @property {function} getValueByKey - Obtiene el valor correspondiente a una clave específica.
 *                                      @param {string} key - La clave a buscar.
 *                                      @returns {T | undefined} - El valor correspondiente a la clave, o undefined si no existe.
 * @property {function} getKeyByValue - Obtiene la clave correspondiente a un valor específico.
 *                                      @param {any} value - El valor a buscar.
 *                                      @returns {string | undefined} - La clave correspondiente al valor, o undefined si no existe.
 *
 * @example
 * import useEnum from './useEnum';
 *
 * const Status = useEnum({
 *   PENDING: 'pending',
 *   IN_PROGRESS: 'in_progress',
 *   COMPLETED: 'completed',
 * });
 *
 * console.log(Status.keys()); // ['PENDING', 'IN_PROGRESS', 'COMPLETED']
 * console.log(Status.values()); // ['pending', 'in_progress', 'completed']
 * console.log(Status.contains('pending')); // true
 * console.log(Status.getValueByKey('PENDING')); // 'pending'
 * console.log(Status.getKeyByValue('in_progress')); // 'IN_PROGRESS'
 *
 * @note
 * - El objeto resultante es inmutable gracias al uso de `Object.freeze`, lo que garantiza que no pueda ser modificado accidentalmente.
 * - Los valores del enum deben ser únicos; si hay duplicados, el comportamiento de `getKeyByValue` puede ser inconsistente.
 * - Este hook es útil para representar estados, tipos, roles u otros conjuntos de valores predefinidos en una aplicación.
 *
 * @internal
 * - El hook utiliza `useMemo` para optimizar el rendimiento, asegurando que el enum solo se recree cuando cambia la definición inicial.
 * - Se valida que el argumento `enumDefinition` sea un objeto no nulo; de lo contrario, se lanza un error.
 * - Los métodos adicionales (`keys`, `values`, `contains`, etc.) están diseñados para ser ligeros y eficientes.
 * - El hook está pensado para ser reutilizable en cualquier componente donde se necesite un "enum".
 *
 * @customization
 * - Si necesitas agregar funcionalidades adicionales, como validaciones específicas o métodos personalizados, puedes extender este hook.
 * - También puedes adaptar el hook para trabajar con valores numéricos, booleanos u otros tipos de datos.
 * - El uso de TypeScript proporciona seguridad de tipos, lo que reduce errores en tiempo de ejecución y mejora la experiencia de desarrollo.
 */
function useEnum<T>(enumDefinition: Record<string, T>): object {
    return useMemo(() => {
        // Validar que la entrada sea un objeto
        if (typeof enumDefinition !== 'object' || enumDefinition === null) {
            throw new Error('El argumento debe ser un objeto que defina el enum.');
        }

        // Crear el enum base
        const enumValues: Record<string, T> = Object.freeze({ ...enumDefinition });

        /**
         * Método para obtener todas las claves del enum.
         * @returns {Array<string>} - Array con las claves del enum.
         */
        const keys = (): string[] => Object.keys(enumValues);

        /**
         * Método para obtener todos los valores del enum.
         * @returns {Array<T>} - Array con los valores del enum.
         */
        const values = (): T[] => Object.values(enumValues);

        /**
         * Método para verificar si un valor existe en el enum.
         * @param {any} value - El valor a verificar.
         * @returns {boolean} - True si el valor existe en el enum, false en caso contrario.
         */
        const contains = (value: any): boolean => Object.values(enumValues).includes(value);

        /**
         * Método para obtener el valor correspondiente a una clave.
         * @param {string} key - La clave a buscar.
         * @returns {T | undefined} - El valor correspondiente a la clave, o undefined si no existe.
         */
        const getValueByKey = (key: string): T | undefined => enumValues[key];

        /**
         * Método para obtener la clave correspondiente a un valor.
         * @param {any} value - El valor a buscar.
         * @returns {string | undefined} - La clave correspondiente al valor, o undefined si no existe.
         */
        const getKeyByValue = (value: any): string | undefined => {
            const entry = Object.entries(enumValues).find(([_, val]) => val === value);
            return entry ? entry[0] : undefined;
        };

        // Retornar el enum con métodos adicionales
        return Object.freeze({
            ...enumValues,
            keys,
            values,
            contains,
            getValueByKey,
            getKeyByValue,
        });
    }, [enumDefinition]);
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useEnum;