// Validadores_Number.tsx
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
     * @returns Función de validación.
     */
    required(): Interface_Validadores_Number;

    /**
     * Valida que el número sea mayor o igual al valor indicado.
     * @param numero - Valor mínimo permitido.
     * @returns Función de validación.
     */
    min(numero: number): Interface_Validadores_Number;

    /**
     * Valida que el número sea menor o igual al valor indicado.
     * @param numero - Valor máximo permitido.
     * @returns Función de validación.
     */
    max(numero: number): Interface_Validadores_Number;

    /**
     * Valida que el número esté dentro del rango especificado.
     * @param min - Límite inferior.
     * @param max - Límite superior.
     * @returns Función de validación.
     */
    between(min: number, max: number): Interface_Validadores_Number;

    /**
     * Valida que el número sea positivo (> 0).
     * @returns Función de validación.
     */
    positive(): Interface_Validadores_Number;

    /**
     * Valida que el número sea negativo (< 0).
     * @returns Función de validación.
     */
    negative(): Interface_Validadores_Number;

    /**
     * Valida que el número sea entero.
     * @returns Función de validación.
     */
    integer(): Interface_Validadores_Number;

    /**
     * Valida que el número sea múltiplo de otro valor.
     * @param divisor - Número por el cual debe ser divisible.
     * @returns Función de validación.
     */
    multipleOf(divisor: number): Interface_Validadores_Number;
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
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Number {
        return Object.assign(fn, {
            required: validar.required,
            min: validar.min,
            max: validar.max,
            between: validar.between,
            positive: validar.positive,
            negative: validar.negative,
            integer: validar.integer,
            multipleOf: validar.multipleOf,
        }) as Interface_Validadores_Number;
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

    validar.min = (numero: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num < numero) {
                return `Error: Debe ser mayor o igual a ${numero}.`;
            }

            return true;
        });
    };

    validar.max = (numero: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num > numero) {
                return `Error: Debe ser menor o igual a ${numero}.`;
            }

            return true;
        });
    };

    validar.between = (min: number, max: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num < min || num > max) {
                return `Error: Debe estar entre ${min} y ${max}.`;
            }

            return true;
        });
    };

    validar.positive = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num <= 0) {
                return 'Error: Debe ser un número positivo.';
            }

            return true;
        });
    };

    validar.negative = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num >= 0) {
                return 'Error: Debe ser un número negativo.';
            }

            return true;
        });
    };

    validar.integer = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (!Number.isInteger(num)) {
                return 'Error: Debe ser un número entero.';
            }

            return true;
        });
    };

    validar.multipleOf = (divisor: number) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const num = valor as number;

            if (num % divisor !== 0) {
                return `Error: Debe ser múltiplo de ${divisor}.`;
            }

            return true;
        });
    };

    

    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Number;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Number };
export const Validadores_Number = Build_Validadores_Number();