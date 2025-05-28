// Validadores_Number.tsx
import { Consts_Validadores } from "./Constants";
import { Type_Validadores_Response_Basic } from "./Types";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Number {
    /**
     * Valida que el valor sea un número.
     * @param valor - Valor a validar.
     * @returns true si es un número válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor no sea null ni undefined.
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    required(mensaje?: string): Interface_Validadores_Number;

    /**
     * Valida que el número sea mayor o igual al valor indicado.
     * @param numero - Valor mínimo permitido.
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    min(numero: number, mensaje?: string): Interface_Validadores_Number;

    /**
     * Valida que el número sea menor o igual al valor indicado.
     * @param numero - Valor máximo permitido.
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    max(numero: number, mensaje?: string): Interface_Validadores_Number;

    /**
     * Valida que el número esté dentro del rango especificado.
     * @param min - Límite inferior.
     * @param max - Límite superior.
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    between(min: number, max: number, mensaje?: string): Interface_Validadores_Number;

    /**
     * Valida que el número sea positivo (> 0).
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    positive(mensaje?: string): Interface_Validadores_Number;

    /**
     * Valida que el número sea negativo (< 0).
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    negative(mensaje?: string): Interface_Validadores_Number;

    /**
     * Valida que el número sea entero.
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    integer(mensaje?: string): Interface_Validadores_Number;

    /**
     * Valida que el número sea múltiplo de otro valor.
     * @param divisor - Número por el cual debe ser divisible.
     * @param mensaje - Mensaje de error personalizado (opcional).
     * @returns Función de validación.
     */
    multipleOf(divisor: number, mensaje?: string): Interface_Validadores_Number;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.number;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Number(): Interface_Validadores_Number {



    /*MAIN --------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'number' || isNaN(valor)) {
            return 'Error: El valor proporcionado no es un número válido.';
        }
        return true;
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Number {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            // Primero valida que sea un número
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

            min: (numero: number, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const num = valor as number;
                    if (num < numero) {
                        return mensaje || `Error: Debe ser mayor o igual a ${numero}.`;
                    }

                    return true;
                }),

            max: (numero: number, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const num = valor as number;
                    if (num > numero) {
                        return mensaje || `Error: Debe ser menor o igual a ${numero}.`;
                    }

                    return true;
                }),

            between: (min: number, max: number, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const num = valor as number;
                    if (num < min || num > max) {
                        return mensaje || `Error: Debe estar entre ${min} y ${max}.`;
                    }

                    return true;
                }),

            positive: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const num = valor as number;
                    if (num <= 0) {
                        return mensaje || 'Error: Debe ser un número positivo.';
                    }

                    return true;
                }),

            negative: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const num = valor as number;
                    if (num >= 0) {
                        return mensaje || 'Error: Debe ser un número negativo.';
                    }

                    return true;
                }),

            integer: (mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const num = valor as number;
                    if (!Number.isInteger(num)) {
                        return mensaje || 'Error: Debe ser un número entero.';
                    }

                    return true;
                }),

            multipleOf: (divisor: number, mensaje?: string) =>
                chainable((valor) => {
                    const result = combinedValidator(valor);
                    if (typeof result === 'string') return result;

                    const num = valor as number;
                    if (num % divisor !== 0) {
                        return mensaje || `Error: Debe ser múltiplo de ${divisor}.`;
                    }

                    return true;
                }),
            type: Consts_Validadores.types.number,
        }) as Interface_Validadores_Number;
    }



    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    // -- no apply



    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chainable(validar) as Interface_Validadores_Number;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Number };
export const Validadores_Number = Build_Validadores_Number();