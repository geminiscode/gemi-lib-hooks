import { useEffect, useRef } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para observar cambios en el DOM.
 * 
 * @version 1.0.0
 * 
 * @function useDOMChangesObserver
 * @param {Object} targetRef - Referencia al elemento DOM que se va a observar.
 * @param {Object} [options] - Opciones de configuración para el observador de cambios.
 * @param {boolean} [options.observeAttributes=false] - Indica si se deben observar los cambios en los atributos del elemento.
 * @param {boolean} [options.observeChildList=false] - Indica si se deben observar los cambios en la lista de hijos del elemento.
 * @param {boolean} [options.observeCharacterData=false] - Indica si se deben observar los cambios en los datos de los nodos de texto del elemento.
 * @param {Array<string>} [options.attributeFilter] - Lista de nombres de atributos específicos que se deben observar.
 * @param {Function} [options.onAttributesChange] - Función de devolución de llamada que se ejecuta cuando cambian los atributos del elemento. Recibe los argumentos (attributeName, oldValue, target).
 * @param {Function} [options.onChildListChange] - Función de devolución de llamada que se ejecuta cuando cambian los hijos del elemento. Recibe los argumentos (changeType, nodes, target).
 * @param {Function} [options.onCharacterDataChange] - Función de devolución de llamada que se ejecuta cuando cambian los datos de los nodos de texto del elemento. Recibe los argumentos (oldValue, target).
 * 
 * @example
 * import { useRef } from 'react';
 * import useDOMChangesObserver from './useDOMChangesObserver';
 * 
 * const MyComponent = () => {
 *     const targetRef = useRef(null);
 * 
 *     useDOMChangesObserver(targetRef, {
 *         observeAttributes: true,
 *         observeChildList: true,
 *         observeCharacterData: true,
 *         attributeFilter: ['class', 'style'],
 *         onAttributesChange: (attributeName, oldValue, target) => {
 *             console.log(`Attribute ${attributeName} changed from ${oldValue} on`, target);
 *         },
 *         onChildListChange: (changeType, nodes, target) => {
 *             console.log(`Child nodes ${changeType}:`, nodes, 'on', target);
 *         },
 *         onCharacterDataChange: (oldValue, target) => {
 *             console.log(`Character data changed from ${oldValue} on`, target);
 *         },
 *     });
 * 
 *     return <div ref={targetRef}>Observe me!</div>;
 * };
 * 
 * export default MyComponent;
 */
const useDOMChangesObserver = (targetRef, options = {}) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const target = targetRef?.current || document;

    if (!target) {
      console.error('Target ref is not assigned to any DOM element and document is not available.');
      return;
    }

    const {
      observeAttributes = false,
      observeChildList = false,
      observeCharacterData = false,
      attributeFilter,
      onAttributesChange,
      onChildListChange,
      onCharacterDataChange,
    } = options;

    const callback = (mutationList) => {
      mutationList.forEach((mutation) => {
        switch (mutation.type) {
          case 'attributes':
            if (onAttributesChange) {
              onAttributesChange(mutation.attributeName, mutation.oldValue, mutation.target);
            }
            break;
          case 'childList':
            if (onChildListChange) {
              if (mutation.addedNodes.length) {
                onChildListChange('added', mutation.addedNodes, mutation.target);
              }
              if (mutation.removedNodes.length) {
                onChildListChange('removed', mutation.removedNodes, mutation.target);
              }
            }
            break;
          case 'characterData':
            if (onCharacterDataChange) {
              onCharacterDataChange(mutation.oldValue, mutation.target);
            }
            break;
          default:
            break;
        }
      });
    };

    observerRef.current = new MutationObserver(callback);

    const config = {
      attributes: observeAttributes,
      childList: observeChildList,
      characterData: observeCharacterData,
      attributeOldValue: observeAttributes && onAttributesChange ? true : undefined,
      characterDataOldValue: observeCharacterData && onCharacterDataChange ? true : undefined,
      attributeFilter: attributeFilter?.length ? attributeFilter : undefined,
      subtree: true,
    };

    observerRef.current.observe(target, config);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [targetRef, options]);

  return;
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useDOMChangesObserver;