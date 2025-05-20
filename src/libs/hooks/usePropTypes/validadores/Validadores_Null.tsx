import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// -- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Null {

    /**
     * Valida que el valor sea exactamente `null`.
     * @param valor - Valor a validar.
     * @returns true si es null, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor **no** sea `null`.
     * @returns Función de validación encadenable.
     */
    required(): Interface_Validadores_Null;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.null;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Null(): Interface_Validadores_Null {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (valor === null) {
            return true;
        }
        return 'Error: El valor debe ser `null`.';
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Null {
        return Object.assign(fn, {
            required: validar.required,
            type: Consts_Validadores.types.null,
        }) as Interface_Validadores_Null;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.required = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            if (valor !== null) {
                return true;
            }
            return 'Error: Este campo no puede ser `null`.';
        });
    };



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Null;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Null };
export const Validadores_Null = Build_Validadores_Null();