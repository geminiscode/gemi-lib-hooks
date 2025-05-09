import { useMemo } from "react";
import usePropTypes, { usePropTypesValidator } from "./usePropTypes";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES --------------------------------------------------------------------------------------- */
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Define los métodos predeterminados disponibles en la instancia creada por `useDataClass`.
 * Estos métodos permiten operaciones comunes sobre objetos inmutables, como copiar, comparar, fusionar, seleccionar propiedades, etc.
 * @template T - El tipo de los datos inmutables. Representa la estructura del objeto que se maneja.
 * @typedef {Object} UseDataClassMethods
 */
type UseDataClassMethods<T> = Readonly<{
    /**
     * Crea una copia del objeto actual con posibles actualizaciones aplicadas.
     * Este método es útil para mantener la inmutabilidad mientras se realizan cambios en el objeto.
     * @function
     * @param {Partial<T>} updates - Un objeto parcial que contiene las propiedades a actualizar.
     * @returns {Readonly<{ data: T }>} - Retorna un nuevo objeto inmutable con las actualizaciones aplicadas.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * const updatedInstance = instance.copy({ age: 31 });
     * console.log(updatedInstance.data); // { name: "Alice", age: 31 }
     */
    copy: (updates: Partial<T>) => Readonly<{ data: T }>;

    /**
     * Compara el objeto actual con otro objeto para determinar si son iguales.
     * La comparación se realiza profundamente, asegurando que todos los niveles del objeto sean idénticos.
     * @function
     * @param {*} other - El objeto con el que se comparará.
     * @returns {boolean} - Retorna `true` si los objetos son iguales, de lo contrario `false`.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * console.log(instance.equals({ name: "Alice", age: 30 })); // true
     * console.log(instance.equals({ name: "Bob", age: 30 })); // false
     */
    equals: (other: any) => boolean;

    /**
     * Genera una representación en string del objeto actual.
     * Esta representación es útil para depuración o registro.
     * @function
     * @returns {string} - Retorna una cadena que representa el objeto.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * console.log(instance.toString()); // "{ name: 'Alice', age: 30 }"
     */
    toString: () => string;

    /**
     * Genera un hash único basado en las propiedades del objeto.
     * Este hash puede ser utilizado para identificar el objeto de manera única.
     * @function
     * @returns {number} - Retorna un número entero que representa el hash del objeto.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * console.log(instance.hashCode()); // Ejemplo: 123456789
     */
    hashCode: () => number;

    /**
     * Fusiona múltiples objetos con los datos actuales para crear un nuevo objeto inmutable.
     * Las actualizaciones se aplican en el orden en que se proporcionan, sobrescribiendo propiedades existentes.
     * @function
     * @param {...Partial<T>[]} updates - Uno o más objetos parciales que contienen las actualizaciones.
     * @returns {Readonly<{ data: T }>} - Retorna un nuevo objeto inmutable con las fusiones aplicadas.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * const mergedInstance = instance.merge({ age: 31 }, { city: "Wonderland" });
     * console.log(mergedInstance.data); // { name: "Alice", age: 31, city: "Wonderland" }
     */
    merge: (...updates: Partial<T>[]) => Readonly<{ data: T }>;

    /**
     * Selecciona un subconjunto de propiedades del objeto actual.
     * Este método es útil para extraer solo las propiedades necesarias.
     * @function
     * @param {Array<keyof T>} keys - Un arreglo de claves que se desea seleccionar.
     * @returns {Readonly<{ data: Partial<T> }>} - Retorna un nuevo objeto inmutable con solo las propiedades seleccionadas.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30, city: "Wonderland" });
     * const pickedInstance = instance.pick(["name", "city"]);
     * console.log(pickedInstance.data); // { name: "Alice", city: "Wonderland" }
     */
    pick: (keys: Array<keyof T>) => Readonly<{ data: Partial<T> }>;

    /**
     * Excluye propiedades específicas del objeto actual.
     * Este método es útil para eliminar propiedades innecesarias.
     * @function
     * @param {Array<keyof T>} keys - Un arreglo de claves que se desea excluir.
     * @returns {Readonly<{ data: Partial<T> }>} - Retorna un nuevo objeto inmutable sin las propiedades excluidas.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30, city: "Wonderland" });
     * const omittedInstance = instance.omit(["age"]);
     * console.log(omittedInstance.data); // { name: "Alice", city: "Wonderland" }
     */
    omit: (keys: Array<keyof T>) => Readonly<{ data: Partial<T> }>;

    /**
     * Verifica si el objeto actual está vacío.
     * Un objeto se considera vacío si no tiene propiedades definidas.
     * @function
     * @returns {boolean} - Retorna `true` si el objeto está vacío, de lo contrario `false`.
     * @example
     * const instance = useDataClass({});
     * console.log(instance.isEmpty()); // true
     */
    isEmpty: () => boolean;

    /**
     * Devuelve las claves del objeto actual.
     * Este método es útil para obtener una lista de todas las propiedades disponibles.
     * @function
     * @returns {ReadonlyArray<keyof T>} - Retorna un arreglo de las claves del objeto.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * console.log(instance.keys()); // ["name", "age"]
     */
    keys: () => ReadonlyArray<keyof T>;

    /**
     * Devuelve los valores del objeto actual.
     * Este método es útil para obtener una lista de todos los valores asociados a las propiedades.
     * @function
     * @returns {ReadonlyArray<any>} - Retorna un arreglo de los valores del objeto.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * console.log(instance.values()); // ["Alice", 30]
     */
    values: () => ReadonlyArray<any>;

    /**
     * Verifica si una propiedad específica existe en el objeto actual.
     * @function
     * @param {keyof T} key - La clave de la propiedad que se desea verificar.
     * @returns {boolean} - Retorna `true` si la propiedad existe, de lo contrario `false`.
     * @example
     * const instance = useDataClass({ name: "Alice", age: 30 });
     * console.log(instance.has("name")); // true
     * console.log(instance.has("city")); // false
     */
    has: (key: keyof T) => boolean;

    /**
     * Crea una copia profunda del objeto actual.
     * Este método asegura que todos los niveles del objeto sean clonados, manteniendo la inmutabilidad.
     * @function
     * @returns {Readonly<{ data: T }>} - Retorna un nuevo objeto inmutable que es una copia profunda del original.
     * @example
     * const instance = useDataClass({ name: "Alice", details: { age: 30 } });
     * const clonedInstance = instance.cloneDeep();
     * console.log(clonedInstance.data.details === instance.data.details); // false
     */
    cloneDeep: () => Readonly<{ data: T }>;
}>;

/**
 * Define los parámetros requeridos para inicializar `useDataClass`.
 * @template T - El tipo de los datos inmutables.
 * @typedef {Object} UseDataClassParams
 * @property {T} data - El objeto principal de datos inmutables.
 * @property {UseDataClassPlugins<T>} [plugins] - Métodos adicionales definidos por el usuario.
 */
type UseDataClassParams<T> = Readonly<{
    data: T;
    propTypes: Record<keyof T, { type: usePropTypesValidator }>;
    effectDependencies: React.DependencyList;
}>;



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* UTILS --------------------------------------------------------------------------------------- */
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Función auxiliar para crear métodos predeterminados.
 * @template T - El tipo de los datos inmutables.
 * @param {Readonly<T>} data - Los datos inmutables.
 * @returns {UseDataClassMethods<T>} - Un objeto con los métodos predeterminados.
 */
function createDefaultMethods<T>(
    data: Readonly<T>,
): UseDataClassMethods<T> {

    /**
     * Método para generar una representación en string del objeto.
     * @returns {string} - Representación en string del objeto.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * console.log(instance.methods.toString()); // DataClass(name="John", age=30)
     */
    const toString = (): string => {
        const entries = Object.entries(data)
            .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
            .join(", ");
        return `DataClass(${entries})`;
    };

    /**
     * Método para comparar el objeto actual con otro objeto.
     * @param {any} other - El objeto a comparar.
     * @returns {boolean} - True si los objetos son iguales, false en caso contrario.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * console.log(instance.methods.equals({ name: "John", age: 30 })); // true
     */
    const equals = (other: any): boolean => {
        if (typeof other !== "object" || other === null) return false;
        return JSON.stringify(data) === JSON.stringify(other);
    };

    /**
     * Método para generar un hash único basado en las propiedades del objeto.
     * @returns {number} - Un número entero que representa el hash del objeto.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * console.log(instance.methods.hashCode()); // Ejemplo: 123456789
     */
    const hashCode = (): number => {
        let hash = 0;
        const str = JSON.stringify(data);
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convertir a entero de 32 bits
        }
        return hash;
    };

    /**
     * Método para crear una copia del objeto con posibles modificaciones.
     * @param {Partial<T>} updates - Un objeto con las propiedades a modificar.
     * @returns {Readonly<{ data: T }>} - Una nueva instancia del objeto con las propiedades actualizadas.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * const updatedInstance = instance.methods.copy({ age: 31 });
     * console.log(updatedInstance.data); // { name: "John", age: 31 }
     */
    const copy = (updates: Partial<T> = {}): Readonly<{ data: T }> => {
        const newData = { ...data, ...updates };
        return Object.freeze({ data: newData });
    };

    /**
     * Método para fusionar múltiples objetos con los datos actuales.
     * @param {Partial<T>[]} updates - Uno o más objetos con propiedades a fusionar.
     * @returns {Readonly<{ data: T }>} - Una nueva instancia del objeto con las propiedades fusionadas.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * const mergedInstance = instance.methods.merge({ age: 31 }, { city: "New York" });
     * console.log(mergedInstance.data); // { name: "John", age: 31, city: "New York" }
     */
    const merge = (...updates: Partial<T>[]): Readonly<{ data: T }> => {
        const newData = Object.freeze({ ...data, ...Object.assign({}, ...updates) });
        return { data: newData };
    };

    /**
     * Método para seleccionar un subconjunto de propiedades del objeto.
     * @param {Array<keyof T>} keys - Las claves de las propiedades a seleccionar.
     * @returns {Readonly<{ data: Partial<T> }>} - Un nuevo objeto inmutable con las propiedades seleccionadas.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30, city: "New York" } });
     * const pickedInstance = instance.methods.pick(["name", "city"]);
     * console.log(pickedInstance.data); // { name: "John", city: "New York" }
     */
    const pick = (keys: Array<keyof T>): Readonly<{ data: Partial<T> }> => {
        if (!Array.isArray(keys)) {
            throw new Error(`El parámetro 'keys' debe ser un array. Valor recibido: ${JSON.stringify(keys)}`);
        }
        const pickedData = Object.freeze(
            keys.reduce((acc, key) => {
                if (key in data) acc[key] = data[key];
                return acc;
            }, {} as Partial<T>)
        );
        return { data: pickedData };
    };

    /**
     * Método para excluir propiedades específicas del objeto.
     * @param {Array<keyof T>} keys - Las claves de las propiedades a excluir.
     * @returns {Readonly<{ data: Partial<T> }>} - Un nuevo objeto inmutable sin las propiedades excluidas.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30, city: "New York" } });
     * const omittedInstance = instance.methods.omit(["age"]);
     * console.log(omittedInstance.data); // { name: "John", city: "New York" }
     */
    const omit = (keys: Array<keyof T>): Readonly<{ data: Partial<T> }> => {
        const omittedData = Object.freeze(
            Object.entries(data).reduce((acc, [key, value]) => {
                if (!keys.includes(key as keyof T)) acc[key as keyof T] = value as T[keyof T];
                return acc;
            }, {} as Partial<T>)
        );
        return { data: omittedData };
    };

    /**
     * Método para verificar si el objeto está vacío.
     * @returns {boolean} - True si el objeto está vacío, false en caso contrario.
     * @example
     * const instance = useDataClass({ data: {} });
     * console.log(instance.methods.isEmpty()); // true
     */
    const isEmpty = (): boolean => {
        return Object.keys(data).length === 0;
    };

    /**
     * Método para obtener las claves del objeto.
     * @returns {ReadonlyArray<keyof T>} - Un array inmutable con las claves del objeto.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * console.log(instance.methods.keys()); // ["name", "age"]
     */
    const keys = (): ReadonlyArray<keyof T> => {
        return Object.freeze(Object.keys(data) as Array<keyof T>);
    };

    /**
     * Método para obtener los valores del objeto.
     * @returns {ReadonlyArray<any>} - Un array inmutable con los valores del objeto.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * console.log(instance.methods.values()); // ["John", 30]
     */
    const values = (): ReadonlyArray<any> => {
        return Object.freeze(Object.values(data));
    };

    /**
     * Método para verificar si una propiedad existe en el objeto.
     * @param {keyof T} key - La clave de la propiedad a verificar.
     * @returns {boolean} - True si la propiedad existe, false en caso contrario.
     * @example
     * const instance = useDataClass({ data: { name: "John", age: 30 } });
     * console.log(instance.methods.has("name")); // true
     * console.log(instance.methods.has("city")); // false
     */
    const has = (key: keyof T): boolean => {
        return key in data;
    };

    /**
     * Método para crear una copia profunda del objeto.
     * @returns {Readonly<{ data: T }>} - Una nueva instancia inmutable del objeto con una copia profunda.
     * @example
     * const instance = useDataClass({ data: { nested: { key: "value" } } });
     * const clonedInstance = instance.methods.cloneDeep();
     * console.log(clonedInstance.data); // { nested: { key: "value" } }
     */
    const cloneDeep = (): Readonly<{ data: T }> => {
        const deepCopy = JSON.parse(JSON.stringify(data));
        return Object.freeze({ data: deepCopy });
    };

    return {
        copy,
        equals,
        toString,
        hashCode,
        merge,
        pick,
        omit,
        isEmpty,
        keys,
        values,
        has,
        cloneDeep,
    };
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* CUSTOM HOOK --------------------------------------------------------------------------------- */
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Custom Hook para crear una clase de datos inmutable con métodos predeterminados y plugins personalizados.
 * 
 * @template T - El tipo de los datos inmutables.
 * @param {UseDataClassParams<T>} props - Los parámetros de configuración para el hook.
 * @returns {Readonly<{ data: T; methods: UseDataClassMethods<T>; plugins: UseDataClassPlugins<T> }>} - Un objeto inmutable con datos, métodos y plugins.
 * 
 * @example
 * import useDataClass from './useDataClass';
 * 
 * const MyComponent = () => {
 *     const { data, methods } = useDataClass({
 *         data: { name: "John", age: 30 },
 *         propTypes: {
 *             name: { type: types.string },
 *             age: { type: types.number }
 *         }
 *     });
 * 
 *     return (
 *         <div>
 *             <h1>{methods.toString()}</h1>
 *             <p>HashCode: {methods.hashCode()}</p>
 *         </div>
 *     );
 * };
 */
function useDataClass<T extends Record<string, any>>(
    props: UseDataClassParams<T>
): Readonly<{
    data: T;
    methods: UseDataClassMethods<T>;
}> {
    const { data: initialData, propTypes, effectDependencies } = props;

    // Asegurar inmutabilidad de los datos
    const data = useMemo(() => Object.freeze({ ...initialData }), [initialData]);

    // Función para validar los datos
    usePropTypes(data, (propTypes || {}) as Record<keyof T, { type: usePropTypesValidator }>, effectDependencies);

    // Crear métodos predeterminados con validación incorporada
    const methods = useMemo(() => createDefaultMethods(data), [data]);

    // Retornar el objeto completo
    return useMemo(() => ({ data, methods }), [data, methods]);
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORTS ------------------------------------------------------------------------------------- */
/*///////////////////////////////////////////////////////////////////////////////////////////////*/


export type { UseDataClassParams, UseDataClassMethods };
export default useDataClass;