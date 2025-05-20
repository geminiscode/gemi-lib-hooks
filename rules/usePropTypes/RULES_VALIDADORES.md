# ✅ REGLAS DE NEGOCIO Y PATRONES DE DESARROLLO

## 1. Validadores funcionales puros
- Cada validador debe ser una función pura.
- Recibe un valor y devuelve `true` o un mensaje de error (`string`).
- Ejemplo:
  (valor: unknown): Type_Validadores_Response_Basic;

## 2. Estructura base del validador
- Todo validador sigue el mismo patrón:
  - Archivo por tipo (`Validadores_String.tsx`, `Validadores_Number.tsx`, etc.)
  - Función `Build_Validadores_X()` que genera el validador.
  - Interfaz explícita con métodos encadenables.
  - Uso consistente de tipos definidos en `Types.tsx`.

## 3. Estructura de carpetas esperada
usePropTypes/
└── validadores/
    ├── Types.tsx
    ├── Validadores.tsx
    ├── Validadores_Array.tsx
    ├── Validadores_Boolean.tsx
    ├── Validadores_Number.tsx
    ├── Validadores_Object.tsx
    └── Validadores_String.tsx

## 4. Tipos reutilizables en Types.tsx
type Type_Validadores_Response_Basic = true | string;
type Type_Validadores = (valor: unknown) => Type_Validadores_Response_Basic;

## 5. Patrón de estado interno para objetos
- En `Validadores_Object.tsx`, se usa un objeto base con estado interno (`__internalConfig`) para controlar comportamientos dinámicos.
- Esto permite configuraciones como:
  Validadores.object.allowMoreFields().allowLessFields();

## 6. Uso de chainable(...) (excepto en objetos)
- En todos los archivos menos en `Validadores_Object.tsx`, se usa una función auxiliar `chainable(...)` para mantener consistencia entre métodos encadenables.
- Devuelve una nueva función con métodos adicionales asignados.

## 7. Interfaz pública clara y documentada
- Cada archivo exporta una interfaz que define:
  - La firma principal del validador.
  - Métodos encadenables.
  - Descripción JSDoc de cada método.

## 8. Documentación obligatoria
- Todo método debe tener comentario JSDoc:
  - ¿Qué hace?
  - ¿Qué parámetros recibe?
  - ¿Qué devuelve?

## 9. Encadenamiento funcional
- Cada método encadenable devuelve una nueva versión del validador con la regla aplicada.
- No se modifican funciones anteriores.

## 10. Separación de lógica de React
- Los validadores son utilidades independientes de React.
- No usan ni deben depender de hooks como `useEffect` o `useState`.
- Se consumen después desde un custom hook (`usePropTypes`) separado.

## 11. Archivo central de mapeo: Validadores.tsx
- Exporta todos las instancias de validadores bajo un único punto de entrada:
  const Validadores: Interface_Validadores = {
      string: Validadores_String,
      number: Validadores_Number,
      boolean: Validadores_Boolean,
      object: Validadores_Object,
  };

## 12. Exportación de tipos e instancias
- Cada archivo debe exportar:
  - El tipo de interfaz (`export type { Interface_Validadores_String }`)
  - La instancia construida (`export const Validadores_String = Build_Validadores_String();`)

## 13. Validaciones basadas en esquema (solo en objetos)
- Algunos validadores (como `object`) reciben un esquema de validación (`ObjectSchema`) y lo usan para validar estructuras complejas.

## 14. No duplicar lógica innecesaria
- Reusar código siempre que sea posible.
- Evitar efectos secundarios o mutaciones globales.

## 15. Consistencia visual y estructural
- Todos los archivos siguen esta estructura:
  /* TYPES */
  /* INTERFACES */
  /* BUILDER */
      /* MAIN */
      /* CHAINABLE UTILITY */
      /* CHAINED METHODS */
      /* RETURN */
  /* EXPORT */

## 16.1. Comentarios estandarizados
- Usar bloques de comentarios consistentes con 3 breaklines al inicio y al final:



  /*///////////////////////////////////////////////////////////////////////////////////////////////*/
  /* TYPES ----------------------------------------------------------------------------------------*/
  /*///////////////////////////////////////////////////////////////////////////////////////////////*/



## 16.2. Comentarios estandarizados
- Usar bloques separadores de comentarios como grupos consistentes con 3 breaklines al inicio y al final:



  /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
  /*///////////////////////////////////////////////////////////////////////////////////////////*/



## 17. Extensibilidad futura
- Dejar espacio para nuevas extensiones sin romper compatibilidad:
  - .shape(...)
  - .of(...)
  - .custom(...)

## 18. No usar React ni hooks en los validadores
- Los validadores no dependen de React.
- Son utilidades TypeScript/JS reutilizables y libres de framework.

## 19. Uso de Build_Validadores_X() para crear validadores
- Cada archivo tiene su propio builder.
- Facilita testing y mantenimiento.

## 20. Validaciones basadas en contexto
- Algunos validadores (como object) reciben un segundo parámetro opcional:
  (valor: unknown, esquema?: any): Type_Validadores_Response_Basic;

## 21. Limpieza de estado entre pruebas
- En entornos de desarrollo (HMR), el estado puede persistir entre recargas.
- Si se requiere limpieza, se recomienda devolver nuevos validadores independientes.

## 22. Archivos individuales por tipo
- Cada tipo de dato vive en su propio archivo.
- Permite mantenimiento modular y escalabilidad.

## 23. Uso de __config(...) para opciones avanzadas
- En lugar de múltiples métodos encadenables, algunos validadores usan una única función de configuración:
  __config(config: Config): Interface_Validadores_Object;

## 24. Separación clara de responsabilidades
- Validadores solo validan.
- El consumo dentro de React se hará después, en un custom hook (`usePropTypes`) aparte.

## 25. Escalabilidad y testing
- Validadores deben ser fáciles de testear unitariamente.
- Sin dependencias externas ni efectos colaterales.

## 26. Plantilla general de validador (recomendada)
- Incluye:
  - Tipos
  - Interfaz pública
  - Builder
  - Main validator
  - Chainable utility (opcional)
  - Chained methods
  - Return
  - Export

## 27. Diferencia entre chainable(...) y __internalConfig
- chainable(...) → usado cuando cada método tiene lógica propia.
- __internalConfig → usado cuando el validador responde a banderas internas.

## 28. Validadores no son React Hooks
- Son utilidades TypeScript/JS.
- Se consumen desde un custom hook (`usePropTypes`) posteriormente.

## 29. Evitar estado compartido entre llamadas
- Idealmente, cada método encadenable debe devolver un nuevo validador limpio.
- Esto evita problemas en entornos con HMR.

## 30. Revisión técnica y QA
- Todo validador debe seguir este patrón para evitar revisiones innecesarias.
- Mejora la claridad, escalabilidad y mantenibilidad del proyecto.

## 31. Ejemplo utilizando __internalConfig
```TSX
import type { Type_Validadores, Type_Validadores_Response_Basic } from './Types';
import { Interface_Validadores } from './Validadores';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// Tipo para cada campo del esquema: string | number | boolean, etc.
type Type_Validador_Elemento = Interface_Validadores[keyof Interface_Validadores];

// Esquema de validación: { clave: validador }
type ObjectSchema = Record<string, Type_Validador_Elemento>;



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Config {
    /**
     * Permite que el objeto tenga menos campos que los definidos en el esquema.
     * @default false
     */
    allowLess?: boolean;

    /**
     * Permite que el objeto tenga más campos que los definidos en el esquema.
     * @default false
     */
    allowMore?: boolean;
}

interface Interface_Validadores_Object {
    /**
     * Valida que el valor sea un objeto y cumpla con el esquema proporcionado.
     * @param valor - Valor a validar.
     * @param esquema - Esquema de validación.
     * @returns true si el objeto cumple con el esquema, sino un mensaje de error.
     */
    (valor: unknown, esquema: ObjectSchema): Type_Validadores_Response_Basic;

    /**
     * Permite que el objeto tenga menos campos que los definidos en el esquema.
     * @returns Función de validación.
     */
    allowLessFields(): Interface_Validadores_Object;

    /**
     * Permite que el objeto tenga más campos que los definidos en el esquema.
     * @returns Función de validación.
     */
    allowMoreFields(): Interface_Validadores_Object;

    /**
     * Configura el validador con opciones adicionales.
     * @param config - Configuración adicional.
     * @returns Función de validación.
     */
    __config(config: Config): Interface_Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Object(): Interface_Validadores_Object {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown, esquema: ObjectSchema): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'object' || valor === null) {
            return 'Error: El valor proporcionado no es un objeto válido.';
        }

        const obj = valor as Record<string, unknown>;
        const schemaKeys = new Set(Object.keys(esquema));
        const objKeys = Object.keys(obj);

        // Obtener configuración actual
        const config = baseValidator.__internalConfig || {};

        // Validar campos obligatorios según el esquema
        for (const [key, validator] of Object.entries(esquema)) {
            if (!(key in obj)) {
                if (!config.allowLess) {
                    return `Error: El campo "${key}" es requerido pero está faltando.`;
                }
            } else {
                const result = validator(obj[key], esquema);
                if (typeof result === 'string') {
                    return `Error en el campo "${key}": ${result}`;
                }
            }
        }

        // Verificar si hay campos extras (no definidos en el esquema)
        if (!config.allowMore) {
            for (const key of objKeys) {
                if (!schemaKeys.has(key)) {
                    return `Error: El campo "${key}" no está permitido en este esquema.`;
                }
            }
        }

        return true;
    };

    const baseValidator = validar as Interface_Validadores_Object & {
        __internalConfig?: Config;
    };

    baseValidator.__internalConfig = {
        allowLess: false,
        allowMore: false,
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown, esquema: ObjectSchema) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Object {
        return Object.assign(fn, {
            allowLessFields: validar.allowLessFields,
            allowMoreFields: validar.allowMoreFields,
        }) as Interface_Validadores_Object;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.allowLessFields = () => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            allowLess: true,
        };
        return baseValidator;
    };

    validar.allowMoreFields = () => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            allowMore: true,
        };
        return baseValidator;
    };


    validar.__config = (config: Config): Interface_Validadores_Object => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            ...config,
        };
        return baseValidator;
    };

    

    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Object };
export const Validadores_Object = Build_Validadores_Object();
```

## 32. Ejemplo utilizando chainable(...)
```TSX
// Validadores_Number.tsx
import { Type_Validadores_Response_Basic } from "./Types";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Number {
    /**
     * Valida que el valor sea un número.
     * @param valor - Valor a validar.
     * @returns true si es un número válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor no sea null ni undefined.
     * @returns Función de validación.
     */
    required(): Interface_Validadores_Number;

    /**
     * Valida que el número sea mayor o igual al valor indicado.
     * @param numero - Valor mínimo permitido.
     * @returns Función de validación.
     */
    min(numero: number): Interface_Validadores_Number;

    /**
     * Valida que el número sea menor o igual al valor indicado.
     * @param numero - Valor máximo permitido.
     * @returns Función de validación.
     */
    max(numero: number): Interface_Validadores_Number;

    /**
     * Valida que el número esté dentro del rango especificado.
     * @param min - Límite inferior.
     * @param max - Límite superior.
     * @returns Función de validación.
     */
    between(min: number, max: number): Interface_Validadores_Number;

    /**
     * Valida que el número sea positivo (> 0).
     * @returns Función de validación.
     */
    positive(): Interface_Validadores_Number;

    /**
     * Valida que el número sea negativo (< 0).
     * @returns Función de validación.
     */
    negative(): Interface_Validadores_Number;

    /**
     * Valida que el número sea entero.
     * @returns Función de validación.
     */
    integer(): Interface_Validadores_Number;

    /**
     * Valida que el número sea múltiplo de otro valor.
     * @param divisor - Número por el cual debe ser divisible.
     * @returns Función de validación.
     */
    multipleOf(divisor: number): Interface_Validadores_Number;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Number(): Interface_Validadores_Number {



    /*MAIN --------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'number' || isNaN(valor)) {
            return 'Error: El valor proporcionado no es un número válido.';
        }
        return true;
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/


    
    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Number {
        return Object.assign(fn, {
            required: validar.required,
            min: validar.min,
            max: validar.max,
            between: validar.between,
            positive: validar.positive,
            negative: validar.negative,
            integer: validar.integer,
            multipleOf: validar.multipleOf,
        }) as Interface_Validadores_Number;
    }



    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.required = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            if (valor === null || valor === undefined) {
                return 'Error: Este campo es requerido.';
            }

            return true;
        });
    };

    validar.min = (numero: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num < numero) {
                return `Error: Debe ser mayor o igual a ${numero}.`;
            }

            return true;
        });
    };

    validar.max = (numero: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num > numero) {
                return `Error: Debe ser menor o igual a ${numero}.`;
            }

            return true;
        });
    };

    validar.between = (min: number, max: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num < min || num > max) {
                return `Error: Debe estar entre ${min} y ${max}.`;
            }

            return true;
        });
    };

    validar.positive = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num <= 0) {
                return 'Error: Debe ser un número positivo.';
            }

            return true;
        });
    };

    validar.negative = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num >= 0) {
                return 'Error: Debe ser un número negativo.';
            }

            return true;
        });
    };

    validar.integer = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (!Number.isInteger(num)) {
                return 'Error: Debe ser un número entero.';
            }

            return true;
        });
    };

    validar.multipleOf = (divisor: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num % divisor !== 0) {
                return `Error: Debe ser múltiplo de ${divisor}.`;
            }

            return true;
        });
    };

    

    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Number;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Number };
export const Validadores_Number = Build_Validadores_Number();
```

## 33. Ejemplo de los Types utilizables por import
```TSX
//Types.tsx
/**
 *  -   En este archivo se definen los tipos de validadores que se utilizan en la librería de validación de propiedades.
 *  -   Estos tipos son utilizados para definir la estructura de los validadores y asegurar que se cumplan las 
 *  expectativas de entrada y salida.
 */


// Definición de respuesta para los validadores
type Type_Validadores_Response_Basic = true | string;

// Interfaz para validar funciones que pueden recibir 1 o 2 argumentos
interface Type_Validadores {
    // Versión básica: solo valor
    (valor: unknown): Type_Validadores_Response_Basic;

    // Versión extendida: valor + esquema u otro dato
    (valor: unknown, esquema: any): Type_Validadores_Response_Basic;
}

// Export de tipos para su uso en otros módulos
export type { Type_Validadores, Type_Validadores_Response_Basic };
```