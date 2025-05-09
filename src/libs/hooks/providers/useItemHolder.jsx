import React, { createContext, useContext, useState } from "react";

// Crear un contexto para mantener los datos
const ItemHolderContext = createContext();

// Proveedor del contexto
export const ItemHolderProvider = ({ children }) => {
    const [data, setData] = useState({});

    // Agregar un item
    const addItem = (key, value) => {
        setData((prevData) => ({ ...prevData, [key]: value }));
    };

    // Actualizar un item existente
    const updateItem = (key, value) => {
        if (!data.hasOwnProperty(key)) {
            console.warn(`El item con la llave "${key}" no existe y no se puede actualizar.`);
            return;
        }
        setData((prevData) => ({ ...prevData, [key]: value }));
    };

    // Obtener un item por su llave
    const getItem = (key, defaultValue = null) => {
        return data.hasOwnProperty(key) ? data[key] : defaultValue;
    };

    // Obtener todos los items
    const getAllItems = () => {
        return { ...data };
    };

    // Obtener el tamaño actual de los items
    const getSize = () => {
        return Object.keys(data).length;
    };

    // Obtener todos los items que coincidan con un prefijo
    const getItemsByPrefix = (prefix) => {
        const filteredItems = {};
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith(prefix)) {
                filteredItems[key] = value;
            }
        }
        return filteredItems;
    };

    // Eliminar un item por su llave
    const removeItem = (key) => {
        setData((prevData) => {
            const { [key]: _, ...rest } = prevData; // Usamos destructuración para eliminar la llave
            return rest;
        });
    };

    // Limpiar todos los items
    const clear = () => {
        setData({});
    };

    // Verificar si existe un item con una llave específica
    const hasItem = (key) => {
        return data.hasOwnProperty(key);
    };

    // Actualizar todos los items que coincidan con un prefijo
    const updateItemsByPrefix = (prefix, newValue) => {
        setData((prevData) => {
            const updatedData = {};
            for (const [key, value] of Object.entries(prevData)) {
                updatedData[key] = key.startsWith(prefix) ? newValue : value;
            }
            return updatedData;
        });
    };

    // Eliminar todos los items que coincidan con un prefijo
    const deleteItemsByPrefix = (prefix) => {
        setData((prevData) => {
            const filteredData = {};
            for (const [key, value] of Object.entries(prevData)) {
                if (!key.startsWith(prefix)) {
                    filteredData[key] = value;
                }
            }
            return filteredData;
        });
    };

    // Obtener todas las llaves
    const getKeys = () => {
        return Object.keys(data);
    };

    return (
        <ItemHolderContext.Provider
            value={{
                addItem,
                updateItem,
                getItem,
                getAllItems,
                getSize,
                getItemsByPrefix,
                removeItem,
                clear,
                hasItem,
                updateItemsByPrefix,
                deleteItemsByPrefix,
                getKeys,
            }}
        >
            {children}
        </ItemHolderContext.Provider>
    );
};


/**
 * Hook personalizado para gestionar un contenedor temporal de datos (holder),
 * permitiendo agregar, actualizar, eliminar, y consultar items en memoria
 * durante el ciclo de vida de la aplicación.
 * 
 * @function useItemHolder
 * @returns {Object} - Métodos y utilidades para manejar el contenedor de datos.
 * 
 * @returns {function} addItem - Agregar un nuevo item al contenedor.
 * @returns {function} updateItem - Actualizar un item existente por su llave.
 * @returns {function} getItem - Obtener el valor de un item por su llave, o un valor por defecto.
 * @returns {function} getAllItems - Retornar todos los items almacenados como un objeto.
 * @returns {function} getSize - Obtener la cantidad de items actuales en el contenedor.
 * @returns {function} getItemsByPrefix - Obtener todos los items cuyas llaves inicien con un prefijo.
 * @returns {function} removeItem - Eliminar un item específico por su llave.
 * @returns {function} clear - Limpiar todos los items almacenados.
 * @returns {function} hasItem - Verificar si existe un item con una llave específica.
 * @returns {function} updateItemsByPrefix - Actualizar todos los items con un prefijo dado.
 * @returns {function} deleteItemsByPrefix - Eliminar todos los items que coincidan con un prefijo.
 * @returns {function} getKeys - Obtener todas las llaves de los items almacenados.
 * 
 * @example
 * import { useItemHolder, ItemHolderProvider } from './useItemHolder';
 * 
 * const MyComponent = () => {
 *   const {
 *     addItem,
 *     updateItem,
 *     getItem,
 *     getAllItems,
 *     getSize,
 *     getItemsByPrefix,
 *     removeItem,
 *     clear,
 *     hasItem,
 *     updateItemsByPrefix,
 *     deleteItemsByPrefix,
 *     getKeys,
 *   } = useItemHolder();
 * 
 *   useEffect(() => {
 *     addItem('user_id', 123);
 *     addItem('user_name', 'John Doe');
 * 
 *     console.log(getItem('user_id')); // 123
 *     console.log(getItemsByPrefix('user_')); // { user_id: 123, user_name: 'John Doe' }
 *     console.log(getSize()); // 2
 * 
 *     updateItem('user_id', 456);
 *     console.log(getItem('user_id')); // 456
 * 
 *     removeItem('user_name');
 *     console.log(getAllItems()); // { user_id: 456 }
 *   }, []);
 * 
 *   return <div>Consulta la consola para resultados.</div>;
 * };
 * 
 * const App = () => (
 *   <ItemHolderProvider>
 *     <MyComponent />
 *   </ItemHolderProvider>
 * );
 * 
 * export default App;
 * 
 * @note
 * - Los datos son almacenados en memoria y no persisten al recargar la aplicación.
 * - Útil para manejar estados temporales y dinámicos sin depender de almacenamiento local.
 * - Los métodos basados en prefijos facilitan operaciones en subconjuntos de datos.
 * 
 * @internal
 * - Los items se almacenan en un objeto `data` manejado con el hook `useState`.
 * - La sincronización y las modificaciones de los datos se hacen a través de `setData`.
 * - Los métodos aseguran la inmutabilidad del estado al realizar copias de los datos.
 */
const useItemHolder = () => {
    const context = useContext(ItemHolderContext);
    if (!context) {
        throw new Error("useItemHolder debe ser usado dentro de un ItemHolderProvider");
    }
    return context;
};



export default useItemHolder;