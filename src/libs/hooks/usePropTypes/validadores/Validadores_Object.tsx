import type { Type_Validadores_Response_Basic, Type_Validadores } from "./Types";
import { getValidatorType, isValidValidators, type Interface_Validadores } from "./Validadores";
import { Consts_Validadores } from "./Constants";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// -- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Configuración base para el validador de objetos.
 */
interface Config {
    /**
     * Indica si se permiten claves adicionales no definidas en el esquema.
     * @default false
     */
    strict?: boolean;

    /**
     * Esquema de validación para cada propiedad del objeto.
     */
    shape?: Record<string, (value: unknown) => Type_Validadores_Response_Basic>;

    /**
     * Claves obligatorias que deben estar presentes en el objeto.
     */
    requiredKeys?: string[];
}



/**
 * Interfaz principal del validador de objetos.
 *
 * Se puede invocar directamente o encadenar métodos como `.shape()`, `.strict()` etc.
 */
interface Interface_Validadores_Object {
    /**
     * Valida que el valor sea un objeto y cumpla con las condiciones definidas.
     * @param valor - Valor a validar.
     * @returns true si es válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Define la forma esperada del objeto.
     * @param schema - Objeto donde cada propiedad tiene su propio validador.
     * @returns Función de validación actualizada.
     */
    shape(
        schema: Record<string, (value: unknown) => Type_Validadores_Response_Basic>
    ): Interface_Validadores_Object;

    /**
     * El objeto NO puede tener claves adicionales fuera del esquema definido.
     * @returns Función de validación actualizada.
     */
    strict(): Interface_Validadores_Object;

    /**
     * Marca ciertas claves como obligatorias, incluso si otras son opcionales.
     * @param keys - Lista de claves que deben estar presentes.
     * @returns Función de validación actualizada.
     */
    requiredKeys(keys: string[]): Interface_Validadores_Object;

    /**
     * Tipo de validador.
     */
    type: typeof Consts_Validadores.types.object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Object(): Interface_Validadores_Object {

    

    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
            return 'Error: El valor proporcionado no es un objeto.';
        }
        return true;
    };




    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Object {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            // Primera capa: validación básica (no null/undefined/object)
            const baseResult = validar(valor);
            if (typeof baseResult === 'string') return baseResult;

            // Segunda capa: reglas adicionales (shape, strict, etc.)
            return nuevaValidacion(valor);
        };

        return Object.assign(combinedValidator, {
            //metodo encadenable que recibira la estructura shape para comparar mas adelante
            shape: createShapeMethod(combinedValidator),
            strict: createStrictMethod(combinedValidator),
            requiredKeys: createRequiredKeysMethod(combinedValidator),
            type: Consts_Validadores.types.object,
        }) as Interface_Validadores_Object;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function createShapeMethod(
        combinedValidator: (valor: unknown) => Type_Validadores_Response_Basic
    ) {
        return function (
            schema: Record<string, Interface_Validadores[keyof Interface_Validadores]>
        ): Interface_Validadores_Object {
            // Actualizar el esquema global
            config.shape = schema;

            // Validamos que los validadores sean válidos
            const validationError = isValidValidators(Object.values(schema));
            if (typeof validationError === 'string') {
                return chainable(() => validationError);
            }

            return chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;

                const obj = valor as Record<string, unknown>;

                for (const key in schema) {
                    const validator = schema[key];
                    const value = obj[key];

                    const res = validator(value);

                    if (res !== true) {
                        return `Error en propiedad "${key}": ${res}`;
                    }
                }

                return true;
            });
        };
    }


    function createStrictMethod(
        combinedValidator: (valor: unknown) => Type_Validadores_Response_Basic
    ) {
        return function (): Interface_Validadores_Object {
            return chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;

                const obj = valor as Record<string, unknown>;
                const schemaKeys = Object.keys(config.shape || {});
                const objKeys = Object.keys(obj);

                // 1. Detectar claves faltantes
                const missingKeys = schemaKeys.filter(key => !objKeys.includes(key));

                // 2. Detectar claves adicionales
                const extraKeys = objKeys.filter(key => !schemaKeys.includes(key));

                // 3. Mostrar errores si hay
                if (missingKeys.length > 0 && extraKeys.length > 0) {
                    return `Error: El objeto tiene claves faltantes y no permitidas. ` +
                        `Faltan: ${missingKeys.join(', ')}. ` +
                        `No permitidas: ${extraKeys.join(', ')}.`;
                }

                if (missingKeys.length > 0) {
                    return `Error: Faltan claves obligatorias: ${missingKeys.join(', ')}.`;
                }

                if (extraKeys.length > 0) {
                    return `Error: El objeto contiene claves no permitidas: ${extraKeys.join(', ')}.`;
                }

                return true;
            });
        };
    }


    function createRequiredKeysMethod(
        combinedValidator: (valor: unknown) => Type_Validadores_Response_Basic
    ) {
        return function (keys: string[]): Interface_Validadores_Object {
            return chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;

                const obj = valor as Record<string, unknown>;

                const missingKeys = keys.filter(key => !(key in obj));

                if (missingKeys.length > 0) {
                    return `Error: Faltan claves obligatorias: ${missingKeys.join(', ')}.`;
                }

                return true;
            });
        };
    }


    /* CONFIG ---------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////////*/



    const config: Config = {
        strict: false,
        shape: {},
        requiredKeys: [],
    };



    /* RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/

    

    return chainable(validar) as Interface_Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Object };
export const Validadores_Object = Build_Validadores_Object();