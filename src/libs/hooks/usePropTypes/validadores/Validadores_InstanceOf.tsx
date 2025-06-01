// Validadores_InstanceOf.tsx
import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_InstanceOf {
    /**
     * Valida que el valor sea una instancia de una clase específica.
     * @param valor - Valor a validar.
     * @returns true si es válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Establece la clase esperada para la validación.
     * @param clase - Clase a comparar (ej. Date, Promise).
     * @param mensaje - Mensaje opcional si falla la validación.
     * @returns Función de validación encadenable.
     */
    instanceOf<T>(clase: new (...args: any[]) => T, mensaje?: string): Interface_Validadores_InstanceOf;

    /**
     * Establece la clase prohibida para la validación.
     * @param clase - Clase a excluir (ej. String, Array).
     * @param mensaje - Mensaje opcional si falla la validación.
     * @returns Función de validación encadenable.
     */
    notInstanceOf<T>(clase: new (...args: any[]) => T, mensaje?: string): Interface_Validadores_InstanceOf;

    /**
     * Tipo de validador.
     */
    type: typeof Consts_Validadores.types.instanceof;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_InstanceOf(): Interface_Validadores_InstanceOf {



    /*MAIN --------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (valor === null || valor === undefined) {
            return 'Error: El valor no puede ser null ni undefined.';
        }
        return true;
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        nuevaValidacion: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_InstanceOf {
        const combinedValidator = (valor: unknown): Type_Validadores_Response_Basic => {
            // Primero valida que no sea null/undefined
            const baseResult = validar(valor);
            if (typeof baseResult === 'string') return baseResult;

            // Luego aplica la nueva regla
            return nuevaValidacion(valor);
        };

        return Object.assign(combinedValidator, {
            instanceOf: createInstanceOfMethod(combinedValidator),
            notInstanceOf: createNotInstanceOfMethod(combinedValidator),
            type: Consts_Validadores.types.instanceof,
        }) as Interface_Validadores_InstanceOf;
    }



    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function createInstanceOfMethod(
        combinedValidator: (valor: unknown) => Type_Validadores_Response_Basic
    ): <T>(clase: new (...args: any[]) => T, mensaje?: string) => Interface_Validadores_InstanceOf {
        return function <T>(
            clase: new (...args: any[]) => T,
            mensaje?: string
        ): Interface_Validadores_InstanceOf {
            return chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;

                const className = clase.name || 'Clase desconocida';
                const receivedType = valor?.constructor?.name || typeof valor;

                if (!(valor instanceof clase)) {
                    return mensaje || `Error: El valor debe ser una instancia de ${className}, pero se recibió un valor de tipo ${receivedType}.`;
                }

                return true;
            });
        };
    }

    function createNotInstanceOfMethod(
        combinedValidator: (valor: unknown) => Type_Validadores_Response_Basic
    ): <T>(clase: new (...args: any[]) => T, mensaje?: string) => Interface_Validadores_InstanceOf {
        return function <T>(
            clase: new (...args: any[]) => T,
            mensaje?: string
        ): Interface_Validadores_InstanceOf {
            return chainable((valor) => {
                const result = combinedValidator(valor);
                if (typeof result === 'string') return result;

                const className = clase.name || 'Clase desconocida';

                if (valor instanceof clase) {
                    return mensaje || `Error: El valor NO debe ser una instancia de ${className}.`;
                }

                return true;
            });
        };
    }


    
    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chainable(validar) as Interface_Validadores_InstanceOf;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_InstanceOf };
export const Validadores_InstanceOf = Build_Validadores_InstanceOf();