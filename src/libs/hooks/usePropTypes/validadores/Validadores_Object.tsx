// Validadores_Object.tsx
import type { Type_Validadores_Response_Basic } from './Types';
import type { Interface_Validadores } from './Validadores';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// Tipo para esquema de validación de objeto
export type SchemaForObject = {
    [key: string]: Interface_Validadores[keyof Interface_Validadores];
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Object {
    /**
     * Valida que el valor sea un objeto válido.
     * @param valor - Valor a validar.
     * @returns true si es un objeto válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el valor no sea null ni undefined.
     * @returns Función de validación.
     */
    required(): Interface_Validadores_Object;

    /**
     * Permite que el objeto tenga más claves que las definidas en el esquema.
     * @returns Función de validación.
     */
    allowExtra(): Interface_Validadores_Object;

    /**
     * Permite que el objeto tenga menos claves que las definidas en el esquema.
     * @returns Función de validación.
     */
    allowLess(): Interface_Validadores_Object;

    /**
     * Valida que el objeto cumpla con un esquema específico.
     * @param schema - Esquema de validación basado en otros validadores.
     * @returns Función de validación.
     */
    scheme(schema: SchemaForObject): Interface_Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Object(): Interface_Validadores_Object {
    let config = { allowExtra: false, allowLess: false };



    /* MAIN -------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'object' || valor === null) {
            return 'Error: El valor proporcionado no es un objeto válido.';
        }
        return true;
    };



    /* CHAINABLE UTILITY ------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    function chainable(
        fn: (valor: unknown) => Type_Validadores_Response_Basic
    ): Interface_Validadores_Object {
        return Object.assign(fn, {
            required: validar.required,
            allowExtra: validar.allowExtra,
            allowLess: validar.allowLess,
            scheme: validar.scheme,
        }) as Interface_Validadores_Object;
    }



    /* CHAINED METHODS --------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.required = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            if (valor === null || valor === undefined) {
                return 'Error: Este campo es requerido.';
            }
            return true;
        });
    };

    validar.allowExtra = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            // Verificar si ya se usó allowLess
            if (config.allowLess) {
                throw new Error('No puedes usar .allowLess() y .allowExtra() al mismo tiempo');
            }
            config = { allowExtra: true, allowLess: false };
            return true;
        });
    };

    validar.allowLess = () => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            // Verificar si ya se usó allowExtra
            if (config.allowExtra) {
                throw new Error('No puedes usar .allowExtra() y .allowLess() al mismo tiempo');
            }
            config = { allowExtra: false, allowLess: true };
            return true;
        });
    };

    validar.scheme = (schema: SchemaForObject) => {
        return chainable((valor: unknown): Type_Validadores_Response_Basic => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const obj = valor as Record<string, any>;

            // Validar cada campo del esquema
            for (const key in schema) {
                const validator = schema[key];

                // Si el campo no existe en los datos y no se permite faltar
                if (!(key in obj)) {
                    if (!config.allowLess) {
                        return `Error: El campo "${key}" es obligatorio.`;
                    }
                    continue;
                }

                // Validar recursivamente si el campo es un validador
                if (typeof validator === 'function') {
                    const validationFn = validator as (value: unknown) => Type_Validadores_Response_Basic;
                    const validationResult = validationFn(obj[key]);
                    if (typeof validationResult === 'string') { return `Error: El campo "${key}" no es válido. ${validationResult}` };
                }
            }

            // Validar si hay campos extra y no se permite
            if (!config.allowExtra && !config.allowLess) {
                const schemaKeys = Object.keys(schema);
                const dataKeys = Object.keys(obj);
                const extraKeys = dataKeys.filter((key) => !schemaKeys.includes(key));
                if (extraKeys.length > 0) {
                    return `Error: Los siguientes campos no son permitidos: ${extraKeys.join(', ')}`;
                }
            }

            return true;
        });
    };



    /* RETURN -----------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export const Validadores_Object = Build_Validadores_Object();