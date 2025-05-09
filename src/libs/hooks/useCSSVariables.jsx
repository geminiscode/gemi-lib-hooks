import { useState, useEffect, useCallback } from 'react';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para gestionar variables CSS en temas, con soporte para un esquema de color basado en el sistema.
 * @function useCSSVariables
 * @param {Object} options - Opciones para configurar el hook.
 * @param {Object[]} options.themesVariables - Array de objetos que representan los temas, cada uno con variables CSS.
 * @param {Object} [options.persistentVariables={}] - Variables CSS que deben ser persistentes y aplicarse a todos los temas.
 * @param {function} [options.onThemeChange] - Callback que se ejecuta cuando se cambia el tema.
 * @param {boolean} [options.useSystemColorScheme=false] - Si es verdadero, ajusta el tema en función del esquema de color del sistema. Solo si el nombre de los temas son: "light / dark".
 * @returns {Object} - Un objeto con métodos y propiedades para gestionar los temas y las variables CSS.
 * 
 * @returns {Object}
 * @property {function} currentTheme - Devuelve el tema actual.
 * @property {function} switchTheme - Cambia el tema actual al tema especificado.
 * @property {function} updateVariable - Actualiza una variable CSS específica dentro del tema actual.
 * @property {function} switchAndUpdateVariables - Cambia el tema y actualiza variables CSS específicas en base a condiciones.
 * @property {function} getActivationOrder - Devuelve el orden de activación de los temas, incluyendo referencias opcionales.
 * @property {function} getThemeVariables - Devuelve las variables CSS del tema actual en un formato estructurado.
 * 
 * @example
 * import useCSSVariables from './useCSSVariables';
 * 
 * const App = () => {
 *   const { 
 *     currentTheme, 
 *     switchTheme, 
 *     updateVariable, 
 *     switchAndUpdateVariables,
 *     getActivationOrder,
 *     getThemeVariables
 *   } = useCSSVariables({
 *     themesVariables: [
 *       { light: { '--bg-color': '#fff', '--text-color': '#000' } },
 *       { dark: { '--bg-color': '#000', '--text-color': '#fff' } },
 *     ],
 *     onThemeChange: (theme, ref) => console.log('Theme changed to:', theme, 'with ref:', ref),
 *     useSystemColorScheme: true
 *   });
 * 
 *   return (
 *     <div>
 *       <p>Current Theme: {currentTheme()}</p>
 *       <button onClick={() => switchTheme('dark', 'ref1')}>Switch to Dark Theme</button>
 *       <button onClick={() => updateVariable('--bg-color', '#f0f0f0')}>Update Background Color</button>
 *       <button onClick={() => switchAndUpdateVariables(['--bg-color'], 'dark', true)}>Switch and Update Background Color</button>
 *       <button onClick={() => console.log(getActivationOrder())}>Get Activation Order</button>
 *       <button onClick={() => console.log(getThemeVariables())}>Get Theme Variables</button>
 *     </div>
 *   );
 * };
 * 
 * @note
 * - `themesVariables` debe ser un array de objetos donde cada objeto representa un tema y contiene variables CSS.
 * - El hook guarda el tema actual en `localStorage`, permitiendo que el tema persista entre recargas de la página.
 * - Si `useSystemColorScheme` es verdadero, el hook ajusta el tema automáticamente según el esquema de color del sistema y actualiza el tema en consecuencia.
 * - `updateVariable` permite actualizar dinámicamente las variables CSS en el tema actual.
 * - `switchAndUpdateVariables` permite cambiar y actualizar dinámicamente variables CSS específicas en base a un tema seleccionado y una condición booleana.
 * - `getActivationOrder` devuelve un array con el orden en el que se han activado los temas, incluyendo referencias opcionales proporcionadas al cambiar de tema.
 * - `getThemeVariables` retorna las variables CSS del tema actual, estructuradas con su información y valores.
 * 
 * @internal
 * - Se valida que todas las variables CSS comiencen con `--` para evitar que se ignoren variables incorrectas.
 * - El hook usa un `IntersectionObserver` para observar los cambios en el esquema de color del sistema y aplicar el tema adecuado.
 * - La función `applyTheme` es responsable de crear o actualizar el estilo en el DOM con las variables CSS del tema actual y manejar el almacenamiento local.
 * - Los temas y variables se actualizan en el estado para permitir cambios dinámicos sin necesidad de recargar la página.
 * - La función `switchAndUpdateVariables` verifica si el tema y las variables existen antes de aplicar los cambios.
 * - `getActivationOrder` se asegura de registrar cada tema activado junto con las referencias opcionales, facilitando el seguimiento de los cambios.
 * - `getThemeVariables` valida si el tema actual existe; en caso contrario, devuelve un array vacío y un mensaje de error en la consola.
 */
const useCSSVariables = ({ themesVariables, persistentVariables = {}, onThemeChange, useSystemColorScheme = false }) => {
    

    
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*UTILS-----------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    // Verifica que todas las variables CSS comiencen con '--'
    const validateVariables = (variables) => {
        Object.keys(variables).forEach(key => {
            if (!key.startsWith('--')) {
                console.warn(`CSS variable ${key} does not start with '--'. It will be ignored.`);
            }
        });
    };

    // Recupera el tema actual del localStorage o usa el primer tema válido o vacío si no hay temas disponibles
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('currentTheme');
        // Recolecta todas las claves de los temas disponibles
        const themeKeys = themesVariables.flatMap(themeObj => Object.keys(themeObj));
    
        if (savedTheme && themeKeys.includes(savedTheme)) {
            return savedTheme; // Retorna el tema guardado si existe en los temas disponibles
        }
    
        if (themeKeys.length > 0) {
            console.warn(
                savedTheme
                    ? `El tema "${savedTheme}" guardado en localStorage no existe. Cargando el primer tema disponible: "${themeKeys[0]}".`
                    : `No se encontró ningún tema en localStorage. Cargando el primer tema disponible: "${themeKeys[0]}".`
            );
            return themeKeys[0]; // Retorna el primer tema disponible si no se encuentra el tema guardado
        }
    
        console.error(
            savedTheme
                ? `El tema "${savedTheme}" guardado en localStorage no existe y no hay temas disponibles.`
                : `No se encontró ningún tema guardado ni temas disponibles.`
        );
        return ''; // Retorna vacío si no hay temas disponibles
    };
    

    
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useStates)-------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    // Guarda los temas en el estado para permitir actualizaciones
    const [themes, setThemes] = useState(themesVariables);
    const [currentTheme, setCurrentTheme] = useState(getInitialTheme);
    const [modifiedVariables, setModifiedVariables] = useState({});
    const [activationOrder, setActivationOrder] = useState([getInitialTheme()]); // Nuevo estado para el orden de activación



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useCallbacks)----------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    const applyTheme = useCallback(() => {
        const theme = themes.find(t => t[currentTheme]);
        if (theme) {
            const variables = { ...persistentVariables, ...theme[currentTheme], ...modifiedVariables };
            validateVariables(variables); // Validar variables CSS
            const style = document.createElement('style');
            style.id = 'theme-style';
            style.innerHTML = `
                :root {
                    ${Object.entries(variables).map(([key, value]) => `${key}: ${value};`).join('\n')}
                }
            `;
            const existingStyle = document.getElementById('theme-style');
            if (existingStyle) {
                existingStyle.replaceWith(style);
            } else {
                document.head.appendChild(style);
            }

            // Guarda el tema actual en el localStorage
            localStorage.setItem('currentTheme', currentTheme);

            // Callback opcional cuando el tema cambia
            if (onThemeChange) {
                onThemeChange(currentTheme);
            }
        }
    }, [currentTheme, themes, persistentVariables, modifiedVariables, onThemeChange]);



    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useEffects)------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    useEffect(() => {
        applyTheme();
    }, [applyTheme]);

    useEffect(() => {
        if (useSystemColorScheme) {
            const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const lightTheme = themes.find(t => t['light']);
            const darkTheme = themes.find(t => t['dark']);
            const style = document.createElement('style');
            style.id = 'system-color-scheme-style';

            const createThemeVariables = (variables) => {
                return Object.entries(variables)
                    .map(([key, value]) => `${key}: ${value};`)
                    .join('\n');
            };

            const lightThemeVariables = lightTheme ? createThemeVariables({ ...persistentVariables, ...lightTheme['light'] }) : '';
            const darkThemeVariables = darkTheme ? createThemeVariables({ ...persistentVariables, ...darkTheme['dark'] }) : '';

            style.innerHTML = `
                @media (prefers-color-scheme: light) {
                    :root {
                        ${lightThemeVariables}
                    }
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        ${darkThemeVariables}
                    }
                }
            `;

            const existingStyle = document.getElementById('system-color-scheme-style');
            if (existingStyle) {
                existingStyle.replaceWith(style);
            } else {
                document.head.appendChild(style);
            }

            // Set initial theme based on system color scheme
            const handleChange = (e) => {
                const darkMode = e.matches;
                setCurrentTheme(darkMode ? 'dark' : 'light');
            };

            handleChange(darkThemeQuery);
            darkThemeQuery.addEventListener('change', handleChange);

            return () => {
                darkThemeQuery.removeEventListener('change', handleChange);
            };
        }
    }, [useSystemColorScheme, themes, persistentVariables]);

    

    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETORNABLES-----------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/


    
    const getCurrentTheme = () => {
        return currentTheme
    };

    const switchTheme = (themeName, ref) => {
        const theme = themes.find(t => t[themeName]);
        if (theme) {
            validateVariables(theme[themeName]); // Validar variables del tema
            setCurrentTheme(themeName);

            // Agregar la referencia al orden de activación
            setActivationOrder(prevOrder => [...prevOrder, ref]);

            // Callback opcional cuando el tema cambia
            if (onThemeChange) {
                onThemeChange(currentTheme, ref); // Pasar el ref al callback
            }
        } else {
            console.warn(`Theme ${themeName} not found`);
        }
    };

    const updateVariable = (variableName, value) => {
        if (!variableName.startsWith('--')) {
            console.warn(`CSS variable ${variableName} does not start with '--'. It will be ignored.`);
            return;
        }

        // Actualiza la variable en el tema actual y en el estado
        setThemes(prevThemes => {
            const updatedThemes = prevThemes.map(theme => {
                if (theme[currentTheme]) {
                    return {
                        ...theme,
                        [currentTheme]: {
                            ...theme[currentTheme],
                            [variableName]: value
                        }
                    };
                }
                return theme;
            });
            applyTheme(); // Reaplica el tema con la nueva variable
            return updatedThemes;
        });
    };

    const switchAndUpdateVariables = (variableNames, themeName, shouldUpdate) => {
        if (shouldUpdate) {
            const theme = themes.find(t => t[themeName]);
            if (!theme) {
                console.warn(`Theme ${themeName} not found`);
                return;
            }

            const selectedVariables = theme[themeName];
            if (!selectedVariables) {
                console.warn(`No variables found for theme ${themeName}`);
                return;
            }

            validateVariables(selectedVariables);

            const updatedVariables = variableNames.reduce((acc, varName) => {
                if (selectedVariables[varName]) {
                    acc[varName] = selectedVariables[varName];
                } else {
                    console.warn(`Variable ${varName} not found in theme ${themeName}`);
                }
                return acc;
            }, {});

            setModifiedVariables(prevState => ({
                ...prevState,
                ...updatedVariables
            }));
        } else {
            // Revertir las variables modificadas
            const revertedVariables = variableNames.reduce((acc, varName) => {
                if (acc[varName]) delete acc[varName];
                return acc;
            }, { ...modifiedVariables });

            setModifiedVariables(revertedVariables);
        }
    };
    
    const getActivationOrder = () => {
        return activationOrder
    };

    const getThemeVariables = () => {
        const currentTheme = localStorage.getItem('currentTheme') || ''; // Recupera el tema actual
        const themeData = themesVariables.find(theme => theme[currentTheme]); // Busca la información del tema actual
    
        if (!themeData) {
            console.error(`El tema "${currentTheme}" no existe o no tiene variables definidas.`);
            return {
                info: null,
                vars: [],
            };
        }
    
        const info = { name: currentTheme, details: themeData[currentTheme] || {} }; // Información del tema actual
        const vars = Object.entries(themeData[currentTheme] || {}).map(([name, value]) => ({
            name,
            value,
        }));
    
        return {
            info,
            vars,
        };
    };
    
    

    /*//////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURN --------------------------------------------------------------------------------------*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////*/



    return { currentTheme: getCurrentTheme, switchTheme, updateVariable, switchAndUpdateVariables, getActivationOrder, getThemeVariables };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useCSSVariables;