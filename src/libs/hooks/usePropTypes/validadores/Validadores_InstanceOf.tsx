// Validadores_InstanceOf.tsx
import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_InstanceOf {
    /**
     * Establece el valor a validar.
     * @param valor - Valor a comprobar.
     * @returns Objeto con métodos de validación encadenados.
     */
    valor(valor: unknown): Interface_Validadores_InstanceOf_Chain;

    /**
     * Tipo de validador.
     */
    type: typeof Consts_Validadores.types.instanceof;
}

interface Interface_Validadores_InstanceOf_Chain {
    /**
     * Valida que el valor sea una instancia de la clase especificada.
     *
     * @example
     * ```ts
     * Validadores_InstanceOf.valor(new Date()).instanceOf(Date); // true
     * Validadores_InstanceOf.valor(Promise.resolve()).instanceOf(Promise); // true
     * ```
     *
     * @param clase - Clase esperada (ej. Date, Promise, etc.)
     * @returns Resultado de la validación (`true` o mensaje de error).
     */
    instanceOf<T>(clase: new (...args: any[]) => T): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor NO sea una instancia de la clase especificada.
     *
     * @example
     * ```ts
     * Validadores_InstanceOf.valor(new Date()).notInstanceOf(String); // true
     * Validadores_InstanceOf.valor([]).notInstanceOf(Array); // false
     * ```
     *
     * @param clase - Clase esperada.
     * @returns Resultado de la validación (`true` o mensaje de error).
     */
    notInstanceOf<T>(clase: new (...args: any[]) => T): Type_Validadores_Response_Basic;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_InstanceOf(): Interface_Validadores_InstanceOf {
    let valorInterno: unknown = undefined;



    /*MAIN --------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const chain = {
        valor(valor: unknown) {
            valorInterno = valor;
            return chainMethods;
        },
        type: Consts_Validadores.types.instanceof,
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const chainMethods: Interface_Validadores_InstanceOf_Chain = {
        instanceOf(clase) {
            const className = clase.name || 'Clase desconocida';
            if (valorInterno instanceof clase) {
                return true;
            }
            const receivedType =
                valorInterno != null
                    ? valorInterno.constructor?.name || typeof valorInterno
                    : typeof valorInterno;
            return `Error: El valor debe ser una instancia de ${className}, pero se recibió un valor de tipo ${receivedType}.`;
        },

        notInstanceOf(clase) {
            const className = clase.name || 'Clase desconocida';
            if (!(valorInterno instanceof clase)) {
                return true;
            }
            return `Error: El valor NO debe ser una instancia de ${className}.`;
        },
    };

    

    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chain;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_InstanceOf, Interface_Validadores_InstanceOf_Chain };
export const Validadores_InstanceOf = Build_Validadores_InstanceOf();