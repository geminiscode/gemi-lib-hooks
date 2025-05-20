import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// -- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Undefined {
    /**
     * Valida que el valor sea `undefined`.
     * @param valor - Valor a validar.
     * @returns true si es `undefined`, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor **no** sea `undefined`.
     * @returns Función de validación.
     */
    required(): Interface_Validadores_Undefined;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.undefined;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Undefined(): Interface_Validadores_Undefined {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (valor === undefined) {
            return true;
        }
        return 'Error: El valor debe ser `undefined`.';
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Undefined {
        return Object.assign(fn, {
            required: validar.required,
            type: Consts_Validadores.types.undefined,
        }) as Interface_Validadores_Undefined;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.required = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            if (valor !== undefined) {
                return true;
            }
            return 'Error: Este campo no puede ser `undefined`.';
        });
    };



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Undefined;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Undefined };
export const Validadores_Undefined = Build_Validadores_Undefined();