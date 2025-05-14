// Validadores_Boolean.tsx
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Boolean {
    /**
     * Valida que el valor sea un booleano.
     * @param valor - Valor a validar.
     * @returns true si es un booleano válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor no sea null ni undefined.
     * @returns Función de validación.
     */
    required(): Interface_Validadores_Boolean;

    /**
     * Valida que el valor sea exactamente `true`.
     * @returns Función de validación.
     */
    true(): Interface_Validadores_Boolean;

    /**
     * Valida que el valor sea exactamente `false`.
     * @returns Función de validación.
     */
    false(): Interface_Validadores_Boolean;

    /**
     * Valida con una función personalizada.
     * @param fn - Función de validación personalizada.
     * @returns Función de validación.
     */
    custom(fn: (value: boolean) => Type_Validadores_Response_Basic): Interface_Validadores_Boolean;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Boolean(): Interface_Validadores_Boolean {



    /*MAIN --------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'boolean') {
            return 'Error: El valor proporcionado no es un booleano.';
        }
        return true;
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Boolean {
        return Object.assign(fn, {
            required: validar.required,
            true: validar.true,
            false: validar.false,
            custom: validar.custom,
        }) as Interface_Validadores_Boolean;
    }



    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



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

    validar.true = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const bool = valor as boolean;

            if (bool !== true) {
                return 'Error: El valor debe ser verdadero.';
            }

            return true;
        });
    };

    validar.false = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const bool = valor as boolean;

            if (bool !== false) {
                return 'Error: El valor debe ser falso.';
            }

            return true;
        });
    };

    validar.custom = (fn: (value: boolean) => Type_Validadores_Response_Basic) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const bool = valor as boolean;

            return fn(bool);
        });
    };



    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Boolean;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Boolean };
export const Validadores_Boolean = Build_Validadores_Boolean();