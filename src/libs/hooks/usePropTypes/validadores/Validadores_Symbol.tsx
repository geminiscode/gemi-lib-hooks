import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Symbol {
    /**
     * Valida que el valor sea exactamente un `symbol`.
     * @param valor - Valor a validar.
     * @returns true si es symbol, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor no sea null/undefined y sea `symbol`.
     * @param mensaje - Mensaje opcional de error si falla la validación.
     * @returns Función de validación encadenable.
     */
    required(mensaje?: string): Interface_Validadores_Symbol;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.symbol;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Symbol(): Interface_Validadores_Symbol {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'symbol') {
            return 'Error: El valor debe ser `symbol`.';
        }
        return true;
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Symbol {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            // Primero valida que sea `symbol`
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

            type: Consts_Validadores.types.symbol,
        }) as Interface_Validadores_Symbol;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    // -- no apply



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chainable(validar) as Interface_Validadores_Symbol;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Symbol };
export const Validadores_Symbol = Build_Validadores_Symbol();