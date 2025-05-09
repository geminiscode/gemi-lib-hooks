import { useEffect, useRef, useState } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para observar la visibilidad de elementos en la pantalla utilizando la API Intersection Observer.
 * 
 * @function useOnScreen
 * @param {Object} options - Opciones para configurar el hook.
 * @param {string[]} [options.selectors=[]] - Array de selectores de CSS para los elementos a observar.
 * @param {function} [options.onOverScreen] - Callback que se ejecuta cuando un elemento se vuelve visible en la pantalla.
 * @param {function} [options.onOutScreen] - Callback que se ejecuta cuando un elemento queda fuera de la pantalla.
 * @param {function} [options.onFullyVisible] - Callback que se ejecuta cuando un elemento está completamente visible en la pantalla.
 * @param {Element} [options.root=null] - Elemento raíz para el Intersection Observer. Por defecto es el viewport.
 * @param {string} [options.rootMargin='0px'] - Margen del root para el Intersection Observer.
 * @param {number[]} [options.thresholds=[0]] - Umbrales de intersección para el Intersection Observer.
 * @returns {Object} - Un objeto con los arrays de elementos que están en la pantalla, fuera de la pantalla, y completamente visibles.
 * 
 * @example
 * import useOnScreen from './useOnScreen';
 * 
 * const MyComponent = () => {
 *   const { OverScreen, OutScreen, FullyVisible } = useOnScreen({
 *     selectors: ['.my-element'],
 *     onOverScreen: (elements) => console.log('OverScreen:', elements),
 *     onOutScreen: (elements) => console.log('OutScreen:', elements),
 *     onFullyVisible: (elements) => console.log('FullyVisible:', elements),
 *     thresholds: [0, 0.5, 1],
 *   });
 * 
 *   return (
 *     <div>
 *       <p>OverScreen: {OverScreen.length}</p>
 *       <p>OutScreen: {OutScreen.length}</p>
 *       <p>FullyVisible: {FullyVisible.length}</p>
 *     </div>
 *   );
 * };
 * 
 * @note
 * - El hook observa todos los elementos que coinciden con los selectores proporcionados.
 * - `OverScreen` contiene los elementos que están parcialmente visibles en el viewport.
 * - `OutScreen` contiene los elementos que están completamente fuera del viewport.
 * - `FullyVisible` contiene los elementos que están completamente visibles en el viewport.
 * - Los arrays devueltos por el hook se actualizan en función de los cambios en la visibilidad de los elementos.
 * 
 * @internal
 * - El hook usa un `Set` para rastrear los elementos visibles, invisibles y completamente visibles. Esto ayuda a evitar duplicados y mejorar el rendimiento.
 * - Se utiliza la propiedad `intersectionRatio` del objeto `entry` para determinar si un elemento es completamente visible (ratio === 1).
 * - El hook desconecta y vuelve a conectar el IntersectionObserver en cada cambio de selector, lo cual es importante para asegurar que solo se observen los elementos actuales.
 */
const useOnScreen = ({
    selectors = [], // Cambiado a un array de selectores
    onOverScreen,
    onOutScreen,
    onFullyVisible,
    root = null,
    rootMargin = '0px',
    thresholds = [0],
}) => {
    const observerRef = useRef(null);
    const [OverScreen, setOverScreen] = useState([]);
    const [OutScreen, setOutScreen] = useState([]);
    const [FullyVisible, setFullyVisible] = useState([]);
    const visibleSet = useRef(new Set());
    const invisibleSet = useRef(new Set());
    const fullyVisibleSet = useRef(new Set());

    useEffect(() => {
        if (selectors.length === 0) return;

        const elements = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)));

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio === 1) {
                    fullyVisibleSet.current.add(entry.target);
                } else {
                    fullyVisibleSet.current.delete(entry.target);
                }

                if (entry.isIntersecting) {
                    visibleSet.current.add(entry.target);
                    invisibleSet.current.delete(entry.target);
                } else {
                    visibleSet.current.delete(entry.target);
                    invisibleSet.current.add(entry.target);
                }
            });

            const visibleArray = Array.from(visibleSet.current);
            const invisibleArray = Array.from(invisibleSet.current);
            const fullyVisibleArray = Array.from(fullyVisibleSet.current);

            setOverScreen(visibleArray);
            setOutScreen(invisibleArray);
            setFullyVisible(fullyVisibleArray);

            if (onOverScreen) {
                onOverScreen(visibleArray);
            }
            if (onOutScreen) {
                onOutScreen(invisibleArray);
            }
            if (onFullyVisible) {
                onFullyVisible(fullyVisibleArray);
            }
        }, { root, rootMargin, threshold: thresholds });

        elements.forEach((element) => {
            if (observerRef.current) {
                observerRef.current.observe(element);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [selectors, onOverScreen, onOutScreen, onFullyVisible, root, rootMargin, thresholds]);

    return { OverScreen, OutScreen, FullyVisible };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useOnScreen;