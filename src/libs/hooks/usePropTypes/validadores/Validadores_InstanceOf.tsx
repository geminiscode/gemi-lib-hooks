import type { Type_Validadores_Response_Basic } from "./Types";
import { Consts_Validadores } from "./Constants";

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



/**
 * Tipo de respuesta del validador.
 */
type ValidatorFunction = (valor: unknown) => Type_Validadores_Response_Basic;



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_InstanceOf {
    /**
     * Valida que el valor sea una instancia de la clase especificada.
     * @param clase - Clase esperada (ej. Date, Promise, etc.)
     * @returns Función de validación.
     */
    <T>(clase: new (...args: any[]) => T): (valor: unknown) => Type_Validadores_Response_Basic;

    /**
     * Valida que el valor NO sea una instancia de la clase especificada.
     */
    not<T>(clase: new (...args: any[]) => T): (valor: unknown) => Type_Validadores_Response_Basic;

    /**
     * Tipo de validador.
     * @returns El tipo de validador.
     */
    type: typeof Consts_Validadores.types.instanceof;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_InstanceOf(): Interface_Validadores_InstanceOf {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar: Interface_Validadores_InstanceOf = function <T>(
        clase: new (...args: any[]) => T
    ): (valor: unknown) => Type_Validadores_Response_Basic {
        return (valor: unknown): Type_Validadores_Response_Basic => {
            const className = clase.name || "Clase desconocida";

            if (valor instanceof clase) {
                return true;
            }

            const receivedType = valor != null ? valor.constructor?.name || typeof valor : typeof valor;
            return `El valor debe ser una instancia de ${className}, pero se recibió un valor de tipo ${receivedType}.`;
        };
    };

    

    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable<T>(
        fn: (clase: new (...args: any[]) => T) => ValidatorFunction
    ): Interface_Validadores_InstanceOf {
        const instance = fn as Interface_Validadores_InstanceOf;
        instance.type = Consts_Validadores.types.instanceof;
        return instance;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.type = Consts_Validadores.types.instanceof;

    validar.not = function <T>(clase: new (...args: any[]) => T) {
        return (valor: unknown): Type_Validadores_Response_Basic => {
            const className = clase.name || "Clase desconocida";

            if (!(valor instanceof clase)) {
                return true;
            }

            return `El valor NO debe ser una instancia de ${className}.`;
        };
    };



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return chainable(validar);
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_InstanceOf };
export const Validadores_InstanceOf = Build_Validadores_InstanceOf();