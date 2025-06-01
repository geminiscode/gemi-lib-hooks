// Validadores_Boolean.tsx
import { Consts_Validadores } from './Constants';
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
     * @param mensaje - Mensaje opcional de error si falla la validación.
     * @returns Función de validación.
     */
    required(mensaje?: string): Interface_Validadores_Boolean;

    /**
     * Valida que el valor sea exactamente `true`.
     * @param mensaje - Mensaje opcional de error si falla la validación.
     * @returns Función de validación.
     */
    true(mensaje?: string): Interface_Validadores_Boolean;

    /**
     * Valida que el valor sea exactamente `false`.
     * @param mensaje - Mensaje opcional de error si falla la validación.
     * @returns Función de validación.
     */
    false(mensaje?: string): Interface_Validadores_Boolean;

    /**
     * Valida con una función personalizada.
     * @param fn - Función de validación personalizada.
     * @returns Función de validación.
     */
    custom(fn: (value: boolean) => Type_Validadores_Response_Basic): Interface_Validadores_Boolean;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.boolean;
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
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Boolean {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            // Primero valida que sea boolean
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

            true: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const bool = valor as boolean;

                    if (bool !== true) {
                        return mensaje || 'Error: El valor debe ser verdadero.';
                    }

                    return true;
                }),

            false: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const bool = valor as boolean;

                    if (bool !== false) {
                        return mensaje || 'Error: El valor debe ser falso.';
                    }

                    return true;
                }),

            custom: (fn: (value: boolean) => Type_Validadores_Response_Basic) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const bool = valor as boolean;

                    return fn(bool);
                }),

            type: Consts_Validadores.types.boolean,
        }) as Interface_Validadores_Boolean;
    }



    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    // -- no apply



    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chainable(validar) as Interface_Validadores_Boolean;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Boolean };
export const Validadores_Boolean = Build_Validadores_Boolean();