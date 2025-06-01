import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// -- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_BigInt {
    /**
     * Valida que el valor sea exactamente un `bigint`.
     * @param valor - Valor a validar.
     * @returns true si es bigint, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor NO sea null/undefined y sea `bigint`.
     * @param mensaje - Mensaje opcional de error.
     * @returns Función de validación encadenable.
     */
    required(mensaje?: string): Interface_Validadores_BigInt;

    /**
     * Valida que el valor sea mayor o igual a cierto número.
     * @param numero - Valor mínimo (number o bigint).
     * @param mensaje - Mensaje opcional de error.
     * @returns Función de validación encadenable.
     */
    min(numero: number | bigint, mensaje?: string): Interface_Validadores_BigInt;

    /**
     * Valida que el valor sea menor o igual a cierto número.
     * @param numero - Valor máximo (number o bigint).
     * @param mensaje - Mensaje opcional de error.
     * @returns Función de validación encadenable.
     */
    max(numero: number | bigint, mensaje?: string): Interface_Validadores_BigInt;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.bigint;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_BigInt(): Interface_Validadores_BigInt {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'bigint') {
            return 'Error: El valor debe ser `bigint`.';
        }
        return true;
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_BigInt {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            // Primero valida que sea `bigint`
            const baseResult = validar(valor);
            if (typeof baseResult === 'string') return baseResult;

            // Luego aplica la nueva regla
            return nuevaValidacion(valor);
        };

        return Object.assign(combinedValidator, {
            required: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    if (valor === null || valor === undefined) {
                        return mensaje || 'Error: Este campo es requerido.';
                    }

                    return true;
                }),

            min: (numero: number | bigint, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const big = valor as bigint;
                    const limite = BigInt(numero);

                    if (big < limite) {
                        return mensaje || `Error: Debe ser mayor o igual a ${limite}n.`;
                    }

                    return true;
                }),

            max: (numero: number | bigint, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const big = valor as bigint;
                    const limite = BigInt(numero);

                    if (big > limite) {
                        return mensaje || `Error: Debe ser menor o igual a ${limite}n.`;
                    }

                    return true;
                }),

            type: Consts_Validadores.types.bigint,
        }) as Interface_Validadores_BigInt;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    // -- no apply



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chainable(validar) as Interface_Validadores_BigInt;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_BigInt };
export const Validadores_BigInt = Build_Validadores_BigInt();