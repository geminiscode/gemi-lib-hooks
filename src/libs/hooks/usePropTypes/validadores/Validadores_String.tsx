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
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns true si el valor es un string no vacío, de lo contrario un mensaje de error.
     */
    required(mensaje: string): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y tenga una longitud mínima.
     * @param longitud - Longitud mínima permitida.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    min(longitud: number, mensaje: string): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y tenga una longitud máxima.
     * @param longitud - Longitud máxima permitida.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    max(longitud: number, mensaje: string): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y tenga una longitud exacta.
     * @param longitud - Longitud exacta permitida.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    exact(longitud: number, mensaje: string): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y contenga solo letras.
     * @param valor - Valor a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns true si el valor es un string con letras, de lo contrario un mensaje de error.
     */
    onlyLetters(mensaje: string): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y contenga solo números.
     * @param valor - Valor a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns true si el valor es un string con números, de lo contrario un mensaje de error.
     */
    onlyNumbers(mensaje: string): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y contenga solo letras y números.
     * @param valor - Valor a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns true si el valor es un string con letras y números, de lo contrario un mensaje de error.
     */
    alphanumeric(mensaje: string): Interface_Validadores_String;

    /**
     * Valida que el valor sea un string y cumpla con una expresión regular.
     * @param expresion - Expresión regular a validar.
     * @param mensaje - Mensaje de error si la validación falla.
     * @returns Función de validación.
     */
    regex( expresion: RegExp, mensaje: string ): Interface_Validadores_String;

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



    function chainable( fn: (valor: unknown) => Type_Validadores_Response_Basic ): Interface_Validadores_String {
        return Object.assign(fn, {
            required: validar.required,
            min: validar.min,
            max: validar.max,
            exact: validar.exact,
            onlyLetters: validar.onlyLetters,
            onlyNumbers: validar.onlyNumbers,
            alphanumeric: validar.alphanumeric,
            regex: validar.regex,
            type: Consts_Validadores.types.string,
        }) as Interface_Validadores_String;
    }
    


    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.required = (mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            if (!valor) {
                if (mensaje) {
                    return mensaje;
                }
                return 'Error: Este campo es requerido.';
            }

            return true;
        });
    };

    validar.min = (longitud: number, mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const str = valor as string;

            if (str.length < longitud) {
                if (mensaje) {
                    return mensaje;
                }
                return `Error: Debe tener al menos ${longitud} caracteres.`;
            }

            return true;
        });
    };

    validar.max = (longitud: number, mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const str = valor as string;

            if (str.length > longitud) {
                if (mensaje) {
                    return mensaje;
                }
                return `Error: No puede superar los ${longitud} caracteres.`;
            }

            return true;
        });
    };

    validar.exact = (longitud: number, mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const str = valor as string;

            if (str.length !== longitud) {
                if (mensaje) {
                    return mensaje;
                }
                return `Error: Debe tener exactamente ${longitud} caracteres.`;
            }

            return true;
        });
    };

    validar.onlyLetters = (mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const str = valor as string;

            if (!/^[a-zA-Z]+$/.test(str)) {
                if (mensaje) {
                    return mensaje;
                }
                return 'Error: Solo se permiten letras.';
            }

            return true;
        });
    };

    validar.onlyNumbers = (mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const str = valor as string;

            if (!/^[0-9]+$/.test(str)) {
                if (mensaje) {
                    return mensaje;
                }
                return 'Error: Solo se permiten números.';
            }

            return true;
        });
    };

    validar.alphanumeric = (mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const str = valor as string;

            if (!/^[a-zA-Z0-9]+$/.test(str)) {
                if (mensaje) {
                    return mensaje;
                }
                return 'Error: Solo se permiten letras y números.';
            }

            return true;
        });
    };

    validar.regex = (expresion: RegExp, mensaje: string) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const str = valor as string;

            if (!expresion.test(str)) {
                return mensaje;
            }

            return true;
        });
    };



    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_String;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/


export type { Interface_Validadores_String };
export const Validadores_String = Build_Validadores_String();