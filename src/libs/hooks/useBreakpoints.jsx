import { useEffect, useState, useCallback } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const breakpoints = {
    xs: { min: 0, max: 359 },         // Extra small (mobile)
    sm: { min: 360, max: 599 },       // Small (mobile)
    md: { min: 600, max: 1023 },      // Medium (tablet)
    lg: { min: 1024, max: 1439 },     // Large (tablet)
    xl: { min: 1440, max: 1919 },     // Extra large (laptop)
    xxl: { min: 1920, max: 2559 },    // Extra extra large (laptop)
    xxxl: { min: 2560, max: Infinity } // Extra extra extra large (desktop)
};

const getBreakpoint = width => {
    for (const [size, range] of Object.entries(breakpoints)) {
        if (width >= range.min && width <= range.max) {
            return size;
        }
    }
    return null;
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para gestionar y detectar puntos de ruptura (breakpoints) de la ventana,
 * la naturaleza del dispositivo (móvil o no móvil) y la orientación (Portrait o Landscape).
 * 
 * Este hook combina la detección de breakpoints basados en las dimensiones del viewport
 * con la identificación del tipo de dispositivo según su modelo, utilizando el agente de usuario
 * y otras características (como soporte táctil). También detecta si el dispositivo está en modo
 * vertical (Portrait) u horizontal (Landscape).
 * 
 * @function useBreakpoints
 * @returns {Object} Un objeto con estados y funciones para gestionar los puntos de ruptura, la detección de dispositivos, y la orientación.
 * 
 * @property {Object} windowSize - Información del tamaño de la ventana actual.
 * @property {number} windowSize.width - Ancho actual de la ventana en píxeles.
 * @property {number} windowSize.height - Alto actual de la ventana en píxeles.
 * @property {string|null} windowSize.breakpoint - Breakpoint actual basado en el ancho de la ventana (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl` o `null`).
 * @property {string} windowSize.orientation - Orientación actual del dispositivo (`portrait` o `landscape`).
 * 
 * @property {boolean} isXs - Indica si el breakpoint actual es `xs` (extra pequeño).
 * @property {boolean} isSm - Indica si el breakpoint actual es `sm` (pequeño).
 * @property {boolean} isMd - Indica si el breakpoint actual es `md` (mediano).
 * @property {boolean} isLg - Indica si el breakpoint actual es `lg` (grande).
 * @property {boolean} isXl - Indica si el breakpoint actual es `xl` (extra grande).
 * @property {boolean} isXxl - Indica si el breakpoint actual es `xxl` (extra extra grande).
 * @property {boolean} isXxxl - Indica si el breakpoint actual es `xxxl` (extra extra extra grande).
 * 
 * @property {boolean} isMobile - Indica si el dispositivo es considerado móvil, ya sea por su naturaleza o por las dimensiones.
 * @property {boolean} isTablet - Indica si el dispositivo está en un rango de dimensiones correspondiente a tablets.
 * @property {boolean} isLaptop - Indica si el dispositivo está en un rango de dimensiones correspondiente a laptops o dispositivos mayores.
 * @property {boolean} isMobileDevice - Indica si el dispositivo es móvil basado exclusivamente en su modelo y agente de usuario.
 * @property {boolean} isPortrait - Indica si el dispositivo está en modo vertical (`portrait`).
 * 
 * @property {function} onXs - Permite registrar un callback que se ejecutará cuando el breakpoint sea `xs`.
 * @property {function} onSm - Permite registrar un callback que se ejecutará cuando el breakpoint sea `sm`.
 * @property {function} onMd - Permite registrar un callback que se ejecutará cuando el breakpoint sea `md`.
 * @property {function} onLg - Permite registrar un callback que se ejecutará cuando el breakpoint sea `lg`.
 * @property {function} onXl - Permite registrar un callback que se ejecutará cuando el breakpoint sea `xl`.
 * @property {function} onXxl - Permite registrar un callback que se ejecutará cuando el breakpoint sea `xxl`.
 * @property {function} onXxxl - Permite registrar un callback que se ejecutará cuando el breakpoint sea `xxxl`.
 * @property {function} onMobile - Permite registrar un callback que se ejecutará cuando el dispositivo esté en un rango móvil (dimensiones o modelo).
 * @property {function} onTablet - Permite registrar un callback que se ejecutará cuando el dispositivo esté en un rango de tablet.
 * @property {function} onLaptop - Permite registrar un callback que se ejecutará cuando el dispositivo esté en un rango de laptop o superior.
 * 
 * @example
 * import useBreakpoints from './useBreakpoints';
 * 
 * const MyComponent = () => {
 *   const {
 *     windowSize,
 *     isXs,
 *     isSm,
 *     isMd,
 *     isLg,
 *     isXl,
 *     isXxl,
 *     isXxxl,
 *     isMobile,
 *     isTablet,
 *     isLaptop,
 *     isMobileDevice,
 *     isPortrait,
 *     onXs,
 *     onMd,
 *     onLaptop
 *   } = useBreakpoints();
 * 
 *   useEffect(() => {
 *     onXs(() => console.log('Extra small breakpoint reached'));
 *     onMd(() => console.log('Medium breakpoint reached'));
 *     onLaptop(() => console.log('Laptop size reached'));
 *   }, []);
 * 
 *   return (
 *     <div>
 *       <p>Current window size: {windowSize.width} x {windowSize.height}</p>
 *       <p>Current breakpoint: {windowSize.breakpoint}</p>
 *       <p>Orientation: {windowSize.orientation}</p>
 *       <p>Is Mobile: {isMobile ? 'Yes' : 'No'}</p>
 *       <p>Is Mobile Device: {isMobileDevice ? 'Yes' : 'No'}</p>
 *       <p>Is Portrait: {isPortrait ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * };
 * 
 * export default MyComponent;
 */
const useBreakpoints = () => {



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useStates, useCallback)------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        breakpoint: getBreakpoint(window.innerWidth),
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    });

    const detectMobileDevice = useCallback(() => {
        // Detecta si el dispositivo es móvil basado en su agente de usuario y eventos táctiles
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|iPhone|iPad|iPod|blackberry|opera mini|iemobile|mobile|motorola/i;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return mobileRegex.test(userAgent.toLowerCase()) || isTouchDevice;
    }, [window.innerWidth, window.innerHeight]);

    const [isMobileDevice, setIsMobileDevice] = useState(detectMobileDevice());

    const [callbacks, setCallbacks] = useState({
        xs: null,
        sm: null,
        md: null,
        lg: null,
        xl: null,
        xxl: null,
        xxxl: null,
        mobile: null,
        tablet: null,
        laptop: null
    });

    const setCallback = useCallback((size, callback) => {
        setCallbacks(prev => ({ ...prev, [size]: callback }));
    }, []);

    const evaluateBreakpoint = useCallback((width) => {
        const defaultBreakpoint = getBreakpoint(width);

        // Re-evaluar dispositivo móvil en tiempo real
        if (isMobileDevice) {
            if (['xs', 'sm', 'md'].includes(defaultBreakpoint)) return defaultBreakpoint;
            return 'sm';
        }

        return defaultBreakpoint;
    }, [isMobileDevice]);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useEffects)------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setWindowSize((prev) => ({
                ...prev,
                width,
                height,
                breakpoint: evaluateBreakpoint(width),
                orientation: width > height ? 'landscape' : 'portrait'
            }));

            // Actualizar la detección de dispositivo móvil en cada resize
            setIsMobileDevice(detectMobileDevice);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [evaluateBreakpoint]);

    useEffect(() => {
        const { breakpoint } = windowSize;
        if (callbacks[breakpoint]) callbacks[breakpoint]();
        if (['xs', 'sm'].includes(breakpoint) && callbacks.mobile) callbacks.mobile();
        if (['md', 'lg'].includes(breakpoint) && callbacks.tablet) callbacks.tablet();
        if (['xl', 'xxl', 'xxxl'].includes(breakpoint) && callbacks.laptop) callbacks.laptop();
    }, [callbacks, windowSize.breakpoint]);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURN ---------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const isMobile = ['xs', 'sm'].includes(windowSize.breakpoint);
    const isTablet = ['md', 'lg'].includes(windowSize.breakpoint);
    const isLaptop = ['xl', 'xxl', 'xxxl'].includes(windowSize.breakpoint);

    return {
        windowSize,
        isXs: windowSize.breakpoint === 'xs',
        isSm: windowSize.breakpoint === 'sm',
        isMd: windowSize.breakpoint === 'md',
        isLg: windowSize.breakpoint === 'lg',
        isXl: windowSize.breakpoint === 'xl',
        isXxl: windowSize.breakpoint === 'xxl',
        isXxxl: windowSize.breakpoint === 'xxxl',
        isMobile: isMobile || isMobileDevice,
        isTablet,
        isLaptop,
        isPortrait: windowSize.orientation === 'portrait',
        onXs: callback => setCallback('xs', callback),
        onSm: callback => setCallback('sm', callback),
        onMd: callback => setCallback('md', callback),
        onLg: callback => setCallback('lg', callback),
        onXl: callback => setCallback('xl', callback),
        onXxl: callback => setCallback('xxl', callback),
        onXxxl: callback => setCallback('xxxl', callback),
        onMobile: callback => setCallback('mobile', callback),
        onTablet: callback => setCallback('tablet', callback),
        onLaptop: callback => setCallback('laptop', callback),
        isMobileDevice
    };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useBreakpoints;