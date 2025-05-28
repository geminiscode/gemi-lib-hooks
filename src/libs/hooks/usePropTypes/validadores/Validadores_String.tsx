//Validadores_String.tsx
import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*INTERFACES ------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_String {
    /** 
     * Valida que el valor sea un string.
     * @param valor - Valor a validar.
     * @returns true si el valor es un string, de lo contrario un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor sea un string y no esté vacío.
     * @param valor - Valor a validar.
     * @param mensaje - Mensaje opcional de error si la validación falla. El usuario puede especificar un mensaje personalizado o no
     * @returns true si el valor es un string no vacío, de lo contrario un mensaje de error.
     */
    required(mensaje?: string | undefined): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y tenga una longitud mínima.
     * @param longitud - Longitud mínima permitida.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    min(longitud: number, mensaje?: string | undefined): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y tenga una longitud máxima.
     * @param longitud - Longitud máxima permitida.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    max(longitud: number, mensaje?: string | undefined): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y tenga una longitud exacta.
     * @param longitud - Longitud exacta permitida.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    exact(longitud: number, mensaje?: string | undefined): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y contenga solo letras.
     * @param valor - Valor a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns true si el valor es un string con letras, de lo contrario un mensaje de error.
     */
    onlyLetters(mensaje?: string | undefined): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y contenga solo números.
     * @param valor - Valor a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns true si el valor es un string con números, de lo contrario un mensaje de error.
     */
    onlyNumbers(mensaje?: string | undefined): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y contenga solo letras y números.
     * @param valor - Valor a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns true si el valor es un string con letras y números, de lo contrario un mensaje de error.
     */
    alphanumeric(mensaje?: string | undefined): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y cumpla con una expresión regular.
     * @param expresion - Expresión regular a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    regex( expresion: RegExp, mensaje?: string | undefined ): Interface_Validadores_String;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.string;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*BUILDER ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_String(): Interface_Validadores_String {



    /*MAIN --------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'string') {
            return 'Error: El valor proporcionado no es un string.';
        }
        return true;
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_String {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            // Primero valida que sea un string
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

                    if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
                        return mensaje || 'Error: Este campo es requerido.';
                    }

                    return true;
                }),

            min: (longitud: number, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const str = valor as string;
                    if (str.length < longitud) {
                        return mensaje || `Error: Debe tener al menos ${longitud} caracteres.`;
                    }

                    return true;
                }),

            max: (longitud: number, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const str = valor as string;
                    if (str.length > longitud) {
                        return mensaje || `Error: No puede superar los ${longitud} caracteres.`;
                    }

                    return true;
                }),

            exact: (longitud: number, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const str = valor as string;
                    if (str.length !== longitud) {
                        return mensaje || `Error: Debe tener exactamente ${longitud} caracteres.`;
                    }

                    return true;
                }),

            onlyLetters: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const str = valor as string;
                    if (!/^[a-zA-Z]+$/.test(str)) {
                        return mensaje || 'Error: Solo se permiten letras.';
                    }

                    return true;
                }),

            onlyNumbers: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const str = valor as string;
                    if (!/^[0-9]+$/.test(str)) {
                        return mensaje || 'Error: Solo se permiten números.';
                    }

                    return true;
                }),

            alphanumeric: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const str = valor as string;
                    if (!/^[a-zA-Z0-9]+$/.test(str)) {
                        return mensaje || 'Error: Solo se permiten letras y números.';
                    }

                    return true;
                }),

            regex: (expresion: RegExp, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const str = valor as string;
                    if (!expresion.test(str)) {
                        return mensaje || 'Error: El valor no coincide con el patrón requerido.';
                    }

                    return true;
                }),

            type: Consts_Validadores.types.string,
        }) as Interface_Validadores_String;
    }
    


    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    // -- no apply



    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chainable(validar) as Interface_Validadores_String;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/


export type { Interface_Validadores_String };
export const Validadores_String = Build_Validadores_String();