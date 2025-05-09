import { useEffect, useState } from "react";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para calcular un tamaño dinámico ajustado a las dimensiones y densidad de la pantalla.
 * Este hook es ideal para crear diseños responsivos que se adapten perfectamente a cualquier dispositivo.
 * 
 * @function useResponsiveSize
 * @param {number} tamañoBase - Tamaño base de referencia en píxeles (por ejemplo, 16 para fuentes, 100 para un contenedor).
 * @param {number} [resolucionBase=1080] - Resolución base de referencia (diagonal en píxeles) para ajustar el cálculo dinámico.
 * 
 * @returns {number} tamañoIdeal - El tamaño ajustado dinámicamente en píxeles, basado en las dimensiones y densidad del dispositivo.
 * 
 * @example
 * import useResponsiveSize from './useResponsiveSize';
 * 
 * const ResponsiveComponent = () => {
 *   const tamañoIdeal = useResponsiveSize(100); // Tamaño base de 100px
 * 
 *   return (
 *     <div style={{ width: `${tamañoIdeal}px`, height: `${tamañoIdeal}px` }}>
 *       Este elemento tiene un tamaño dinámico de {Math.round(tamañoIdeal)}px.
 *     </div>
 *   );
 * };
 * 
 * export default ResponsiveComponent;
 * 
 * @note
 * - Este hook utiliza una fórmula basada en la diagonal de la pantalla, el tamaño base y la densidad de píxeles para calcular el tamaño ideal.
 * - El tamaño se recalcula automáticamente al cambiar el tamaño de la ventana o la orientación del dispositivo.
 * - Es útil para elementos de diseño que necesitan mantenerse visualmente consistentes en diferentes resoluciones y tamaños de pantalla.
 * 
 * @internal
 * - Utiliza `window.innerWidth` y `window.innerHeight` para obtener las dimensiones actuales de la pantalla.
 * - Ajusta el tamaño calculado usando `window.devicePixelRatio` para considerar densidades de píxeles altas (Retina o similares).
 * - Utiliza un efecto (`useEffect`) para actualizar el tamaño dinámicamente en respuesta a eventos de `resize` y `orientationchange`.
 */
const useResponsiveSize = (tamañoBase, resolucionBase = 1080) => {


    
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useStates)-------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const [tamañoIdeal, setTamañoIdeal] = useState(0);


    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*UTILS ----------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/

    

    const calcularTamañoMaestro = () => {
        const anchoPantalla = window.innerWidth; // Ancho actual de la pantalla
        const altoPantalla = window.innerHeight; // Alto actual de la pantalla
        const densidadPixel = window.devicePixelRatio; // Densidad de píxeles

        // Calcular la diagonal de la pantalla
        const diagonalPantalla = Math.sqrt(Math.pow(anchoPantalla, 2) + Math.pow(altoPantalla, 2));

        // Aplicar la fórmula maestra
        const tamañoCalculado = (tamañoBase * diagonalPantalla) / (resolucionBase * densidadPixel);

        return tamañoCalculado; // Tamaño ideal ajustado
    };



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useEffects)------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    useEffect(() => {
        // Actualizar tamaño cuando la ventana cambie
        const actualizarTamaño = () => {
            setTamañoIdeal(calcularTamañoMaestro());
        };

        // Calcular al montar el componente
        actualizarTamaño();

        // Escuchar cambios en la ventana
        window.addEventListener("resize", actualizarTamaño);
        window.addEventListener("orientationchange", actualizarTamaño);

        // Cleanup
        return () => {
            window.removeEventListener("resize", actualizarTamaño);
            window.removeEventListener("orientationchange", actualizarTamaño);
        };
    }, [tamañoBase, resolucionBase]);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURN ---------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    return tamañoIdeal;
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useResponsiveSize;