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
     * Valida que el valor **no** sea `symbol`.
     * @returns Función de validación encadenable.
     */
    required(): Interface_Validadores_Symbol;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Symbol(): Interface_Validadores_Symbol {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor === 'symbol') {
            return true;
        }
        return 'Error: El valor debe ser `symbol`.';
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Symbol {
        return Object.assign(fn, {
            required: validar.required,
        }) as Interface_Validadores_Symbol;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.required = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            if (typeof valor !== 'symbol') {
                return true;
            }
            return 'Error: Este campo no puede ser `symbol`.';
        });
    };



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Symbol;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Symbol };
export const Validadores_Symbol = Build_Validadores_Symbol();