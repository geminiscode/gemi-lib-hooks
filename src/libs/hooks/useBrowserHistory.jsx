import { useState, useCallback, useEffect } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para gestionar el historial de la pestaña del navegador.
 * Proporciona métodos y estados para interactuar con el historial de navegación,
 * como agregar, reemplazar, y navegar hacia adelante o atrás en el historial.
 * 
 * @function useBrowserHistory
 * @returns {Object} - Un objeto con métodos y estados relacionados con el historial de navegación.
 * 
 * @returns {Object} state - El estado actual del historial, incluyendo la URL y el índice del historial.
 * @returns {function} push - Función para agregar una nueva entrada al historial.
 * @returns {function} replace - Función para reemplazar la entrada actual del historial.
 * @returns {function} goBack - Función para navegar hacia atrás en el historial.
 * @returns {function} goForward - Función para navegar hacia adelante en el historial.
 * @returns {function} go - Función para navegar a una posición específica en el historial.
 * 
 * @example
 * import useBrowserHistory from './useBrowserHistory';
 * 
 * const HistoryExample = () => {
 *   const {
 *     state,
 *     push,
 *     replace,
 *     goBack,
 *     goForward,
 *     go
 *   } = useBrowserHistory();
 * 
 *   return (
 *     <div>
 *       <p>Current URL: {state.url}</p>
 *       <button onClick={() => push('/new-page')}>Go to New Page</button>
 *       <button onClick={() => replace('/replace-page')}>Replace Current Page</button>
 *       <button onClick={goBack}>Go Back</button>
 *       <button onClick={goForward}>Go Forward</button>
 *       <button onClick={() => go(-2)}>Go Back 2 Steps</button>
 *     </div>
 *   );
 * };
 * 
 * export default HistoryExample;
 * 
 * @note
 * - Este hook utiliza la API de `window.history` para interactuar con el historial del navegador.
 * - `push` agrega una nueva entrada al historial, mientras que `replace` modifica la entrada actual.
 * - Las funciones `goBack` y `goForward` navegan hacia atrás o adelante en el historial.
 * - La función `go` permite navegar a un índice específico en el historial.
 * - El estado actual (`state`) incluye la URL actual y el índice del historial.
 * 
 * @internal
 * - El hook utiliza un `useEffect` para escuchar cambios en el estado del historial y actualizar el estado local.
 * - La navegación es controlada por la API `window.history` y el evento `popstate`.
 */
const useBrowserHistory = () => {



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useStates)-------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const [currentLocation, setCurrentLocation] = useState({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
    });



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useCallbacks)----------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const updateLocation = useCallback(() => {
        setCurrentLocation({
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash
        });
    }, []);

    // Navegar hacia atrás en el historial
    const goBack = useCallback(() => {
        window.history.back();
    }, []);

    // Navegar hacia adelante en el historial
    const goForward = useCallback(() => {
        window.history.forward();
    }, []);

    // Agregar una nueva entrada al historial
    const pushHistory = useCallback((path, state = {}) => {
        window.history.pushState(state, '', path);
        updateLocation();
    }, [updateLocation]);

    // Reemplazar la entrada actual en el historial
    const replaceHistory = useCallback((path, state = {}) => {
        window.history.replaceState(state, '', path);
        updateLocation();
    }, [updateLocation]);

    // Función para limpiar listeners, útil si necesitas agregar más de un listener en un componente
    const clearHistoryListeners = useCallback(() => {
        window.removeEventListener('popstate', updateLocation);
    }, [updateLocation]);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useEffects)------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    useEffect(() => {
        // Listener para cambios en el historial
        const onPopState = () => updateLocation();

        window.addEventListener('popstate', onPopState);

        return () => {
            // Limpieza del listener al desmontar el componente
            window.removeEventListener('popstate', onPopState);
        };
    }, [updateLocation]);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURN ---------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    return {
        currentLocation,
        goBack,
        goForward,
        pushHistory,
        replaceHistory,
        clearHistoryListeners
    };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useBrowserHistory;