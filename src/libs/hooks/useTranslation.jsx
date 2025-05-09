import { useState, useEffect, useRef } from 'react';
import { validators } from './usePropTypes';
import useDOMChangesObserver from './useDOMChangesObserver';
import useOnScreen from './useOnScreen';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Obtiene los nodos de texto y atributos de un conjunto de nombres de atributos.
 * @function getTextNodesAndAttributes
 * @param {Array<string>} attributeNames - Los nombres de los atributos a buscar.
 * @returns {Array<Object>} Los nodos de texto y atributos encontrados.
 */
function getTextNodesAndAttributes(attributeNames) {
    let walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let textNodes = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
        textNodes.push(currentNode);
        currentNode = walker.nextNode();
    }

    attributeNames.forEach(attr => {
        let elements = document.querySelectorAll(`[${attr}]`);
        elements.forEach(element => {
            if (element.getAttribute(attr)) {
                textNodes.push({
                    node: element,
                    attr: attr,
                    text: element.getAttribute(attr),
                });
            }
        });
    });

    return textNodes;
}

/**
 * Guarda los datos del idioma actual y anterior en el almacenamiento local.
 * @function saveLanguageData
 * @param {string} prevLanguage - El idioma anterior.
 * @param {string} currentLanguage - El idioma actual.
 */
function saveLanguageData(prevLanguage, currentLanguage) {
    const validateString = (prop) => validators.string(prop);
    const isPrevLanguageValid = validateString(prevLanguage) === true;
    const isCurrentLanguageValid = validateString(currentLanguage) === true;

    if (isPrevLanguageValid && isCurrentLanguageValid) {
        localStorage.setItem('languageData', JSON.stringify({ prev: prevLanguage, current: currentLanguage }));
    } else {
        console.error('Invalid language data:', {
            prevLanguage: isPrevLanguageValid ? prevLanguage : `Invalid value '${prevLanguage}'`,
            currentLanguage: isCurrentLanguageValid ? currentLanguage : `Invalid value '${currentLanguage}'`,
        });
    }
}

/**
 * Detecta si las traducciones están en formato plano o agrupado por idioma.
 * @function isGroupedTranslations
 * @param {Array<Object>} translations - Las traducciones a verificar.
 * @returns {boolean} `true` si están agrupadas por idioma, `false` en caso contrario.
 */
function isGroupedTranslations(translations) {
    return (
        translations.length === 1 &&
        typeof translations[0] === 'object' &&
        Object.keys(translations[0]).some((key) => typeof translations[0][key] === 'object')
    );
}

/**
 * Convierte traducciones agrupadas a formato plano.
 * @function flattenGroupedTranslations
 * @param {Object} groupedTranslations - Las traducciones agrupadas por idioma.
 * @returns {Array<Object>} Traducciones en formato plano.
 */
function flattenGroupedTranslations(groupedTranslations) {
    const flatTranslations = [];
    const languages = Object.keys(groupedTranslations);

    languages.forEach((language) => {
        const entries = Object.entries(groupedTranslations[language]);
        entries.forEach(([key, value], index) => {
            if (!flatTranslations[index]) flatTranslations[index] = {};
            flatTranslations[index][language] = value;
        });
    });

    return flatTranslations;
}

/**
 * Obtiene los datos del idioma actual y anterior del almacenamiento local.
 * @function getLanguageData
 * @returns {Object} Un objeto con las propiedades `prev` y `current` que representan los idiomas anterior y actual.
 */
function getLanguageData() {
    const data = localStorage.getItem('languageData');
    if (data) {
        try {
            const parsedData = JSON.parse(data);
            const validateString = (prop) => validators.string(prop);
            const isPrevLanguageValid = validateString(parsedData.prev) === true;
            const isCurrentLanguageValid = validateString(parsedData.current) === true;

            if (isPrevLanguageValid && isCurrentLanguageValid) {
                return parsedData;
            } else {
                console.error('Invalid language data found in local storage:', parsedData);
                return { prev: '', current: '' };
            }
        } catch (error) {
            console.error('Error parsing language data from local storage:', error);
            return { prev: '', current: '' };
        }
    } else {
        return { prev: '', current: '' };
    }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Hook personalizado para gestionar la traducción de contenido en la página.
 * @function useTranslation
 * @param {Array<Object>|Object} translations - Las traducciones disponibles. Puede ser:
 *  - Un arreglo de objetos con traducciones planas, por ejemplo:
 *    [
 *        { es: 'Hola', en: 'Hello', fr: 'Bonjour' },
 *        { es: 'Adiós', en: 'Goodbye', fr: 'Au revoir' }
 *    ]
 *  - Un objeto agrupado por idioma, por ejemplo:
 *    {
 *        en: { appName: 'Hello', appSlogan: 'Simple content' },
 *        es: { appName: 'Hola', appSlogan: 'Contenido simple' }
 *    }
 * @param {string} [defaultLanguage='es'] - El idioma por defecto que se utilizará inicialmente.
 * @returns {Object} Un objeto con las siguientes propiedades:
 *  - `currentLanguage` (string): El idioma actual seleccionado.
 *  - `prevLanguage` (string): El idioma previamente seleccionado.
 *  - `setLanguage` (function): Función para cambiar el idioma actual.
 * 
 * @example
 *  import useTranslation from './useTranslation';
 * 
 *  // Ejemplo con traducciones planas
 *  const translations = [
 *      { es: 'Hola', en: 'Hello', fr: 'Bonjour' },
 *      { es: 'Adiós', en: 'Goodbye', fr: 'Au revoir' }
 *  ];
 * 
 *  const MyComponent = () => {
 *      const { currentLanguage, setLanguage } = useTranslation(translations, 'es');
 * 
 *      const handleChangeLanguage = (event) => {
 *          setLanguage(event.target.value);
 *      };
 * 
 *      return (
 *          <div>
 *              <h1>{translations.find(t => t.es === 'Hola')[currentLanguage]}</h1>
 *              <select onChange={handleChangeLanguage} value={currentLanguage}>
 *                  <option value="es">Español</option>
 *                  <option value="en">English</option>
 *                  <option value="fr">Français</option>
 *              </select>
 *          </div>
 *      );
 *  };
 * 
 *  // Ejemplo con traducciones agrupadas por idioma
 *  const groupedTranslations = {
 *      en: { greeting: 'Hello', farewell: 'Goodbye' },
 *      es: { greeting: 'Hola', farewell: 'Adiós' }
 *  };
 * 
 *  const MyComponentGrouped = () => {
 *      const { currentLanguage, setLanguage } = useTranslation([groupedTranslations], 'en');
 * 
 *      const handleChangeLanguage = (event) => {
 *          setLanguage(event.target.value);
 *      };
 * 
 *      return (
 *          <div>
 *              <h1>{groupedTranslations[currentLanguage].greeting}</h1>
 *              <select onChange={handleChangeLanguage} value={currentLanguage}>
 *                  <option value="en">English</option>
 *                  <option value="es">Español</option>
 *              </select>
 *          </div>
 *      );
 *  };
 * 
 * @note
 * Este hook utiliza el almacenamiento local para persistir el estado del idioma entre sesiones.
 * Asegúrate de proporcionar las traducciones necesarias para cada idioma en el formato adecuado.
 */
function useTranslation(translations, defaultLanguage = 'es') {
    const normalizedTranslations = isGroupedTranslations(translations)
        ? flattenGroupedTranslations(translations[0])
        : translations;

    const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
    const [prevLanguage, setPrevLanguage] = useState('');



    const applyTranslations = debounce((prevLanguage, currentLanguage) => {
        const textNodes = getTextNodesAndAttributes(['placeholder', 'title', 'alt']);

        textNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const textContent = node.textContent.trim();
                let translation = normalizedTranslations.find(
                    (translation) => translation[prevLanguage] === textContent
                );

                if (!translation) {
                    for (const lang of Object.keys(normalizedTranslations[0])) {
                        translation = normalizedTranslations.find((t) => t[lang] === textContent);
                        if (translation) break;
                    }
                }

                if (translation) {
                    node.textContent = translation[currentLanguage] || textContent;
                }
            } else if (node.nodeType === undefined && node.attr && node.text) {
                let translation = normalizedTranslations.find(
                    (translation) => translation[prevLanguage] === node.text
                );

                if (!translation) {
                    for (const lang of Object.keys(normalizedTranslations[0])) {
                        translation = normalizedTranslations.find((t) => t[lang] === node.text);
                        if (translation) break;
                    }
                }

                if (translation) {
                    node.node.setAttribute(node.attr, translation[currentLanguage] || node.text);
                }
            }
        });
    }, 200);

    const setLanguage = (language) => {
        applyTranslations(currentLanguage, language);
        saveLanguageData(currentLanguage, language);
        setPrevLanguage(currentLanguage);
        setCurrentLanguage(language);
    };

    const reloadLanguage = () => {
        const { prev, current } = getLanguageData();
        if (current) {
            setPrevLanguage(prev);
            setCurrentLanguage(current);
            applyTranslations(prev, current);
        } else {
            setLanguage(defaultLanguage);
        }
    };

    const forceUpdateRef = useRef(false);

    
    /*///////////////////////////////////////////////////////////////////////////////////////////////*/
    /*HOOKS------------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////////*/



    // Observa el body y html con useOnScreen
    useOnScreen({
        selectors: ['body', 'html'],
        onOverScreen: () => reloadLanguage(),
        onOutScreen: () => reloadLanguage(),
        onFullyVisible: () => reloadLanguage(),
    });

    // Observa cambios en el DOM
    useDOMChangesObserver(document.body, {
        observeAttributes: false,
        observeChildList: true,
        observeCharacterData: false,
        onChildListChange: () => reloadLanguage(),
    });
    

    
    /*///////////////////////////////////////////////////////////////////////////////////////////////*/
    /*USE EFFECT-------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////////*/



    useEffect(() => {
        setCurrentLanguage(getLanguageData().current);
        reloadLanguage();
    }, []);

    useEffect(() => {
        reloadLanguage();

        // Listener para cambios de ruta y recarga
        const handleRouteChange = debounce(() => {
            const { current } = getLanguageData();
            if (current !== currentLanguage) {
                setLanguage(current);
            }
        }, 200);

        window.addEventListener('popstate', handleRouteChange);
        window.addEventListener('beforeunload', handleRouteChange);
        window.addEventListener('mouseover', handleRouteChange);

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            window.removeEventListener('beforeunload', handleRouteChange);
            window.removeEventListener('mouseover', handleRouteChange);
        };
    }, [currentLanguage]);

    useEffect(() => {
        const { current } = getLanguageData();
        if (current && current !== currentLanguage) {
            applyTranslations(prevLanguage, current);
            setCurrentLanguage(current);
        }
    }, [currentLanguage]);
    


    /*///////////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURNS----------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////////*/



    return {
        currentLanguage,
        prevLanguage,
        setLanguage,
        getLanguageData,
    };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useTranslation;