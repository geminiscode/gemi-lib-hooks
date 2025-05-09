import { useState, useEffect, useRef } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para realizar solicitudes HTTP con soporte para reintentos, caché, y callbacks para manejar el ciclo de vida de la solicitud.
 * 
 * @function useFetch
 * @param {string} url - La URL a la que se realizará la solicitud HTTP.
 * @param {Object} [options={}] - Opciones adicionales para la solicitud fetch.
 * @param {Object} [config={}] - Configuración adicional para el hook.
 * @param {number} [config.retryCount=3] - Número de reintentos en caso de fallo de la solicitud.
 * @param {number} [config.retryDelay=1000] - Tiempo en milisegundos entre reintentos.
 * @param {function} [config.transformResponse=(response) => response] - Función para transformar la respuesta antes de almacenarla en el estado.
 * @param {function} [config.onError=null] - Callback que se ejecuta cuando ocurre un error en la solicitud.
 * @param {string} [config.cachePolicy='no-cache'] - Política de caché para la solicitud. Puede ser 'no-cache', 'reload', 'no-store', 'same-origin', o 'default'.
 * @param {function} [config.onStart=null] - Callback que se ejecuta cuando comienza la solicitud.
 * @param {function} [config.onSuccess=null] - Callback que se ejecuta cuando la solicitud se completa con éxito.
 * @param {function} [config.onComplete=null] - Callback que se ejecuta cuando la solicitud se completa, ya sea con éxito o con error.
 * @returns {Object} - Un objeto con los datos de la respuesta, el estado de carga, el error y una función para reintentar la solicitud.
 * 
 * @example
 * import useFetch from './useFetch';
 * 
 * const UserList = () => {
 *   const { data, loading, error, refetch } = useFetch(
 *     'https://jsonplaceholder.typicode.com/users',
 *     {},
 *     {
 *       retryCount: 2,
 *       retryDelay: 500,
 *       transformResponse: (response) => response.map(user => ({
 *         id: user.id,
 *         name: user.name,
 *         email: user.email
 *       })),
 *       onStart: () => console.log('Fetch started'),
 *       onSuccess: (data) => console.log('Fetch successful:', data),
 *       onComplete: () => console.log('Fetch completed'),
 *       onError: (error) => console.error('Fetch error:', error),
 *       cachePolicy: 'no-cache',
 *     }
 *   );
 * 
 *   if (loading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 * 
 *   return (
 *     <div>
 *       <h1>User List</h1>
 *       <ul>
 *         {data && data.map(user => (
 *           <li key={user.id}>
 *             {user.name} - {user.email}
 *           </li>
 *         ))}
 *       </ul>
 *       <button onClick={refetch}>Refetch</button>
 *     </div>
 *   );
 * };
 * 
 * @note
 * - La solicitud se realiza cuando el componente se monta y se limpia si el componente se desmonta o la URL cambia.
 * - `retryCount` y `retryDelay` permiten reintentar la solicitud en caso de fallo.
 * - `transformResponse` permite modificar la respuesta antes de almacenarla.
 * - Los callbacks `onStart`, `onSuccess`, `onComplete`, y `onError` permiten manejar eventos específicos del ciclo de vida de la solicitud.
 * - La política de caché puede ser configurada para evitar solicitudes repetidas.
 * 
 * @internal
 * - El hook utiliza un `AbortController` para cancelar solicitudes si el componente se desmonta o se actualizan las dependencias.
 * - La caché se gestiona utilizando un objeto `cache` para almacenar respuestas basadas en la URL.
 * - Se usa un `Set` para manejar la lista de elementos visibles y no visibles para evitar duplicados y mejorar el rendimiento.
 */
const useFetch = (url, options = {}, config = {}) => {
  const {
    retryCount = 3,
    retryDelay = 1000,
    transformResponse = (response) => response,
    onError = null,
    cachePolicy = 'no-cache',
    onStart = null,
    onSuccess = null,
    onComplete = null,
  } = config;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const retryAttempt = useRef(0);
  const cache = useRef({});

  const fetchData = async () => {
    if (onStart) onStart();

    setLoading(true);
    setError(null);

    // Check cache first
    if (cachePolicy !== 'no-cache' && cache.current[url]) {
      setData(cache.current[url]);
      setLoading(false);
      if (onSuccess) onSuccess(cache.current[url]);
      if (onComplete) onComplete();
      return;
    }

    // Create a new AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
        cache: cachePolicy,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      const transformedResult = transformResponse(result);

      // Cache the response if needed
      if (cachePolicy !== 'no-cache') {
        cache.current[url] = transformedResult;
      }

      setData(transformedResult);
      if (onSuccess) onSuccess(transformedResult);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        if (retryAttempt.current < retryCount) {
          retryAttempt.current += 1;
          setTimeout(fetchData, retryDelay);
        } else {
          setError(err);
          if (onError) onError(err);
        }
      }
    } finally {
      setLoading(false);
      if (onComplete) onComplete();
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, JSON.stringify(options)]); // Dependencias solo cuando url u options cambian

  return { data, loading, error, refetch: fetchData };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useFetch;
