import type { Type_Validadores_Response_Basic, Type_Validadores } from "./Types";
import { getValidatorType, type Interface_Validadores } from "./Validadores";
import { Consts_Validadores } from "./Constants";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// -- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



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
    /**
     * Tipos/validadores permitidos para cualquier elemento del array.
     */
    of?: Interface_Validadores[keyof Interface_Validadores][];
}

interface Interface_Validadores_Array {
    /**
     * Valida que el valor sea un array y cumpla con las condiciones definidas.
     * @param valor - Valor a validar.
     * @returns true si es válido, sino un mensaje de error.
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
     * Define los tipos/validadores permitidos para cualquier elemento del array.
     * Un elemento pasa si es aceptado por **al menos uno** de los validadores.
     * @param schema - Esquema para validar elementos.
     * @returns Función de validación actualizada.
     */
    of(schema: Interface_Validadores[keyof Interface_Validadores] | Interface_Validadores[keyof Interface_Validadores][]): Interface_Validadores_Array;

    /**
     * Configura opciones avanzadas del validador.
     * @param config - Objeto con configuraciones como `minLength`, `maxLength`, etc.
     * @returns Función de validación actualizada.
     */
    __config(config: Partial<Config>): Interface_Validadores_Array;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
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

        const config = baseValidator.__internalConfig || {
            optionalEmpty: false,
            minLength: 0,
            maxLength: Infinity,
            of: undefined,
        };

        const length = valor.length;

        // Validar longitud mínima
        if (length < config.minLength!) {
            return `Error: El array debe tener al menos ${config.minLength} elementos.`;
        }

        // Validar longitud máxima
        if (length > config.maxLength!) {
            return `Error: El array no puede tener más de ${config.maxLength} elementos.`;
        }

        // Si está vacío y no se permite
        if (length === 0 && !config.optionalEmpty) {
            return "Error: El array no puede estar vacío.";
        }

        // Validar elementos si hay esquema definido
        if (config.of?.length) {
            for (let i = 0; i < length; i++) {
                const element = valor[i];
                let isValid = false;
                let firstError: string | null = null;

                // Obtener el tipo nativo del valor (string, number, boolean, etc.)
                const elementType = typeof element;

                // Filtrar solo los validadores que corresponden al tipo del valor
                const matchingValidators = config.of.filter((validator) => {
                    const validatorType = getValidatorType(validator);
                    return validatorType === elementType;
                });

                // Si hay validadores que coinciden con el tipo, usarlos
                if (matchingValidators.length > 0) {
                    for (const validator of matchingValidators) {
                        if (typeof validator === "function") {
                            const result = validator(element);

                            if (result === true) {
                                isValid = true;
                                break;
                            } else if (!firstError && typeof result === "string") {
                                firstError = result;
                            }
                        }
                    }
                } else {
                    // Si ningún validador corresponde al tipo del valor
                    const allowedTypes = config.of
                        .map((v) => getValidatorType(v) || 'desconocido')
                        .join(', ');

                    return `Error en posición [${i}]: Tipo "${elementType}" no permitido. Se esperaba: ${allowedTypes}. Valor recibido: ${element}`;
                }

                if (!isValid && firstError) {
                    return `Error en posición [${i}]: ${firstError}`;
                }

                if (!isValid) {
                    const allowedTypes = config.of
                        .map((v) => getValidatorType(v) || 'desconocido')
                        .join(', ');

                    return `Error en posición [${i}]: El valor no coincide con ninguno de los tipos permitidos: ${allowedTypes}`;
                }
            }
        }

        return true;
    };

    const baseValidator = validar as Interface_Validadores_Array & {
        __internalConfig?: Config;
    };

    baseValidator.__internalConfig = {
        optionalEmpty: false,
        minLength: 0,
        maxLength: Infinity,
        of: undefined,
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(fn: Type_Validadores): Interface_Validadores_Array {
        return Object.assign(fn, {
            optionalEmpty: validar.optionalEmpty,
            minLength: validar.minLength,
            maxLength: validar.maxLength,
            of: validar.of,
            type: Consts_Validadores.types.array,
            __config: validar.__config,
        }) as Interface_Validadores_Array;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.optionalEmpty = () => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            optionalEmpty: true,
        };
        return chainable(validar);
    };

    validar.minLength = (length: number) => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            minLength: length,
        };
        return chainable(validar);
    };

    validar.maxLength = (length: number) => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            maxLength: length,
        };
        return chainable(validar);
    };

    validar.of = (schema: Interface_Validadores[keyof Interface_Validadores] | Interface_Validadores[keyof Interface_Validadores][]) => {
        const validators = Array.isArray(schema) ? schema : [schema];

        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            of: validators,
        };
        return chainable(validar);
    };

    validar.__config = (config: Partial<Config>): Interface_Validadores_Array => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            ...config,
        };
        return chainable(validar);
    };



    /* RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/

    

    return validar as Interface_Validadores_Array;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Array };
export const Validadores_Array = Build_Validadores_Array();