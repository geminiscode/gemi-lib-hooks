// Validadores_Array.tsx

import type {
    Type_Validadores,
    Type_Validadores_Response_Basic,
} from './Types';

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES ----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/

interface Interface_Validadores_Array {
    /**
     * Valida que el valor sea un array.
     * @param valor - Valor a validar.
     * @returns true si es un array válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el array no sea null ni undefined.
     * @returns Función de validación.
     */
    required(): Interface_Validadores_Array;

    /**
     * Valida que el array tenga al menos X elementos.
     * @param longitud - Número mínimo de elementos.
     * @returns Función de validación.
     */
    min(longitud: number): Interface_Validadores_Array;

    /**
     * Valida que el array tenga como máximo X elementos.
     * @param longitud - Número máximo de elementos.
     * @returns Función de validación.
     */
    max(longitud: number): Interface_Validadores_Array;

    /**
     * Valida que cada elemento del array cumpla con una regla dada.
     * @param validator - Validador para cada elemento.
     * @returns Función de validación.
     */
    of(validator: Type_Validadores): Interface_Validadores_Array;
}

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER -------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/

function Build_Validadores_Array(): Interface_Validadores_Array {

    /* MAIN --------------------------------------------------------------------------------------*/

    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (!Array.isArray(valor)) {
            return 'Error: El valor proporcionado no es un array.';
        }
        return true;
    };

    /* CHAINABLE UTILITY -------------------------------------------------------------------------*/

    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Array {
        return Object.assign(fn, {
            required: validar.required,
            min: validar.min,
            max: validar.max,
            of: validar.of,
        }) as Interface_Validadores_Array;
    }

    /* CHAINED METHODS ---------------------------------------------------------------------------*/

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

    validar.min = (longitud: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const arr = valor as unknown[];
            if (arr.length < longitud) {
                return `Error: Debe contener al menos ${longitud} elementos.`;
            }

            return true;
        });
    };

    validar.max = (longitud: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const arr = valor as unknown[];
            if (arr.length > longitud) {
                return `Error: No puede contener más de ${longitud} elementos.`;
            }

            return true;
        });
    };

    validar.of = (validator: Type_Validadores) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const arr = valor as unknown[];

            for (const item of arr) {
                const res = validator(item);
                if (typeof res === 'string') {
                    return `Error: Uno de los elementos no es válido. Detalle: ${res}`;
                }
            }

            return true;
        });
    };

    /* RETURN ------------------------------------------------------------------------------------*/

    return validar as Interface_Validadores_Array;
}

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/

export const Validadores_Array = Build_Validadores_Array();