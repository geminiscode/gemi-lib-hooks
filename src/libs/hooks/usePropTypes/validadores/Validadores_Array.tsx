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
 * Configuración del validador de arrays.
 */
interface Config {
    /**
     * Indica si el array puede estar vacío.
     * @default false
     */
    optionalEmpty?: boolean;

    /**
     * Longitud mínima permitida del array.
     * @default 0
     */
    minLength?: number;

    /**
     * Longitud máxima permitida del array.
     * @default Infinity
     */
    maxLength?: number;
}



/**
 * Interfaz principal del validador de arrays.
 *
 * Se puede invocar directamente o encadenar métodos como `.minLength()`, `.of()` etc.
 */
interface Interface_Validadores_Array {
    /**
     * Valida que el valor sea un array y cumpla con las condiciones definidas.
     * @param valor - Valor a validar.
     * @returns `true` si es válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Permite que el array esté vacío.
     * @returns Función de validación actualizada.
     */
    optionalEmpty(): Interface_Validadores_Array;

    /**
     * Valida que el array tenga al menos la longitud especificada.
     * @param length - Longitud mínima requerida.
     * @returns Función de validación actualizada.
     */
    minLength(length: number): Interface_Validadores_Array;

    /**
     * Valida que el array no exceda la longitud especificada.
     * @param length - Longitud máxima permitida.
     * @returns Función de validación actualizada.
     */
    maxLength(length: number): Interface_Validadores_Array;

    /**
     * Valida que todos los elementos del array sean del **mismo tipo/validador**.
     * @param schema - Un único validador que deben cumplir **todos** los elementos.
     * @returns Función de validación encadenable.
     */
    ofOne(
        schema: Interface_Validadores[keyof Interface_Validadores]
    ): Interface_Validadores_Array;

    /**
     * Valida que cada elemento del array cumpla **con al menos uno** de los validadores dados.
     * @param schemas - Lista de validadores para comprobar cada elemento.
     * @returns Función de validación encadenable.
     */
    ofAny(
        ...schemas: Interface_Validadores[keyof Interface_Validadores][]
    ): Interface_Validadores_Array;
    
    /**
     * Configura opciones avanzadas del validador.
     * @param config - Objeto con configuraciones como `minLength`, `maxLength`, etc.
     * @returns Función de validación actualizada.
     */
    __config(config: Partial<Config>): Interface_Validadores_Array;

    /**
     * Tipo de validador.
     */
    type: typeof Consts_Validadores.types.array;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Array(): Interface_Validadores_Array {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (!Array.isArray(valor)) {
            return "Error: El valor proporcionado no es un array.";
        }
        return true;
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Array {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            const baseResult = validar(valor);
            if (typeof baseResult === 'string') return baseResult;
            return nuevaValidacion(valor);
        };

        return Object.assign(combinedValidator, {
            optionalEmpty: () => chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;
                const arr = valor as unknown[];
                if (arr.length === 0) return true;
                return result;
            }),

            minLength: (length: number) => chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;
                const arr = valor as unknown[];
                if (arr.length < length) {
                    return `Error: El array debe tener al menos ${length} elementos.`;
                }
                return true;
            }),

            maxLength: (length: number) => chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;
                const arr = valor as unknown[];
                if (arr.length > length) {
                    return `Error: El array no puede tener más de ${length} elementos.`;
                }
                return true;
            }),

            ofOne: (schema: Interface_Validadores[keyof Interface_Validadores]) => {
                return chainable((valor) => {
                    const result = combinedValidator(valor);
                    const isValid = isValidValidators(schema);
                    if (typeof result === 'string') return result;
                    if (typeof isValid === 'string') return isValid;

                    const arr = valor as unknown[];
                    const validator = schema as (value: unknown) => Type_Validadores_Response_Basic;

                    for (let i = 0; i < arr.length; i++) {
                        const element = arr[i];
                        const res = validator(element);

                        if (res !== true) {
                            const expectedType = getValidatorType(schema) || 'desconocido';
                            const receivedType = typeof element;
                            return `Error en posición [${i}]: Se esperaba un valor de tipo "${expectedType}", pero se recibió "${receivedType}".`;
                        }
                    }

                    return true;
                });
            },

            ofAny: (...schemas: Interface_Validadores[keyof Interface_Validadores][]) => {
                return chainable((valor) => {
                    const result = combinedValidator(valor);
                    const isValid = isValidValidators(schemas);
                    if (typeof result === 'string') return result;
                    if (typeof isValid === 'string') return isValid;

                    const arr = valor as unknown[];
                    
                    for (let i = 0; i < arr.length; i++) {

                        const element = arr[i];
                        let isValid = false;
                        let firstError: string | null = null;

                        for (const schema of schemas) {
                            const validator = schema as (value: unknown) => Type_Validadores_Response_Basic;
                            const res = validator(element);

                            if (res === true) {
                                isValid = true;
                                break;
                            } else if (!firstError && typeof res === 'string') {
                                firstError = res;
                            }
                        }

                        if (!isValid) {
                            const allowedTypes = schemas.map(getValidatorType).join(', ');
                            const receivedType = typeof element;
                            return `
                            Error en posición [${i}]: Tipo "${receivedType}" no permitido. Se esperaba: ${allowedTypes}. Valor recibido: ${element}
                            ${firstError ? `Detalle: ${firstError}` : ''}
                            `;
                        }
                    }

                    return true;
                });
            },

            __config: (config: Partial<Config>) => chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;

                const arr = valor as unknown[];

                if (config.minLength !== undefined && arr.length < config.minLength) {
                    return `Error: El array debe tener al menos ${config.minLength} elementos.`;
                }

                if (config.maxLength !== undefined && arr.length > config.maxLength) {
                    return `Error: El array no puede tener más de ${config.maxLength} elementos.`;
                }

                if (!config.optionalEmpty && arr.length === 0) {
                    return "Error: El array no puede estar vacío.";
                }

                return true;
            }),

            type: Consts_Validadores.types.array,
        }) as Interface_Validadores_Array;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    // -- no apply



    /* RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/

    

    return chainable(validar) as Interface_Validadores_Array;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Array };
export const Validadores_Array = Build_Validadores_Array();