import type { Type_Validadores, Type_Validadores_Response_Basic } from './Types';
import { Interface_Validadores } from './Validadores';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// Tipo para cada campo del esquema: string | number | boolean, etc.
type Interface_Validador_Elemento = Interface_Validadores[keyof Interface_Validadores];

// Esquema de validación: { clave: validador }
type ObjectSchema = Record<string, Interface_Validador_Elemento>;



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Config {
    /**
     * Permite que el objeto tenga menos campos que los definidos en el esquema.
     * @default false
     */
    allowLess?: boolean;

    /**
     * Permite que el objeto tenga más campos que los definidos en el esquema.
     * @default false
     */
    allowMore?: boolean;
}

interface Interface_Validadores_Object {
    /**
     * Valida que el valor sea un objeto y cumpla con el esquema proporcionado.
     * @param valor - Valor a validar.
     * @param esquema - Esquema de validación.
     * @returns true si el objeto cumple con el esquema, sino un mensaje de error.
     */
    (valor: unknown, esquema: ObjectSchema): Type_Validadores_Response_Basic;

    /**
     * Permite que el objeto tenga menos campos que los definidos en el esquema.
     * @returns Función de validación.
     */
    allowLessFields(): Interface_Validadores_Object;

    /**
     * Permite que el objeto tenga más campos que los definidos en el esquema.
     * @returns Función de validación.
     */
    allowMoreFields(): Interface_Validadores_Object;

    /**
     * Configura el validador con opciones adicionales.
     * @param config - Configuración adicional.
     * @returns Función de validación.
     */
    __config(config: Config): Interface_Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Object(): Interface_Validadores_Object {



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown, esquema: ObjectSchema): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'object' || valor === null) {
            return 'Error: El valor proporcionado no es un objeto válido.';
        }

        const obj = valor as Record<string, unknown>;
        const schemaKeys = new Set(Object.keys(esquema));
        const objKeys = Object.keys(obj);

        // Obtener configuración actual
        const config = baseValidator.__internalConfig || {};

        // Validar campos obligatorios según el esquema
        for (const [key, validator] of Object.entries(esquema)) {
            if (!(key in obj)) {
                if (!config.allowLess) {
                    return `Error: El campo "${key}" es requerido pero está faltando.`;
                }
            } else {
                const result = validator(obj[key], esquema);
                if (typeof result === 'string') {
                    return `Error en el campo "${key}": ${result}`;
                }
            }
        }

        // Verificar si hay campos extras (no definidos en el esquema)
        if (!config.allowMore) {
            for (const key of objKeys) {
                if (!schemaKeys.has(key)) {
                    return `Error: El campo "${key}" no está permitido en este esquema.`;
                }
            }
        }

        return true;
    };

    const baseValidator = validar as Interface_Validadores_Object & {
        __internalConfig?: Config;
    };

    baseValidator.__internalConfig = {
        allowLess: false,
        allowMore: false,
    };



    /*CHAINABLED BUILDER ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown, esquema: ObjectSchema) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Object {
        return Object.assign(fn, {
            allowLessFields: validar.allowLessFields,
            allowMoreFields: validar.allowMoreFields,
        }) as Interface_Validadores_Object;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.allowLessFields = () => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            allowLess: true,
        };
        return baseValidator;
    };

    validar.allowMoreFields = () => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            allowMore: true,
        };
        return baseValidator;
    };


    validar.__config = (config: Config): Interface_Validadores_Object => {
        baseValidator.__internalConfig = {
            ...baseValidator.__internalConfig,
            ...config,
        };
        return baseValidator;
    };

    

    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores_Object };
export const Validadores_Object = Build_Validadores_Object();