import { useState, useEffect } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para detectar el estado de la conexión de red.
 * 
 * @version 1.0.0
 * 
 * @function useNetworkStatus
 * @param {Function} [onOnline] - Función de devolución de llamada que se ejecuta cuando el navegador vuelve a estar en línea.
 * @param {Function} [onOffline] - Función de devolución de llamada que se ejecuta cuando el navegador se desconecta.
 * @returns {boolean} Estado de la conexión de red. `true` si está en línea, `false` si está desconectado.
 * 
 * @example
 * import React from 'react';
 * import useNetworkStatus from './useNetworkStatus';
 * 
 * const NetworkStatusComponent = () => {
 *   const isOnline = useNetworkStatus(
 *     () => console.log('Online'),
 *     () => console.log('Offline')
 *   );
 * 
 *   return (
 *     <div>
 *       <h1>{isOnline ? 'You are online' : 'You are offline'}</h1>
 *     </div>
 *   );
 * };
 * 
 * export default NetworkStatusComponent;
 * 
 * @example
 * // Detectando eventos personalizados de cambio de estado de red
 * window.addEventListener('networkStatusChange', (event) => {
 *   console.log('Network status changed:', event.detail.isOnline ? 'Online' : 'Offline');
 * });
 */
function useNetworkStatus(onOnline, onOffline) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = () => {
    setIsOnline(true);
    if (onOnline) onOnline();
    // Dispara un evento personalizado para el estado online
    window.dispatchEvent(new CustomEvent('networkStatusChange', { detail: { isOnline: true } }));
  };

  const handleOffline = () => {
    setIsOnline(false);
    if (onOffline) onOffline();
    // Dispara un evento personalizado para el estado offline
    window.dispatchEvent(new CustomEvent('networkStatusChange', { detail: { isOnline: false } }));
  };

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Comprueba el estado inicial de la conexión
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useNetworkStatus;