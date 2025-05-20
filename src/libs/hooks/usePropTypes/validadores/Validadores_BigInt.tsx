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
     * Valida que el valor **no** sea `bigint`.
     * @returns Función de validación encadenable.
     */
    required(): Interface_Validadores_BigInt;

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
        if (typeof valor === 'bigint') {
            return true;
        }
        return 'Error: El valor debe ser `bigint`.';
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_BigInt {
        return Object.assign(fn, {
            required: validar.required,
            type: Consts_Validadores.types.bigint,
        }) as Interface_Validadores_BigInt;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.required = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            if (typeof valor !== 'bigint') {
                return true;
            }
            return 'Error: Este campo no puede ser `bigint`.';
        });
    };



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_BigInt;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_BigInt };
export const Validadores_BigInt = Build_Validadores_BigInt();