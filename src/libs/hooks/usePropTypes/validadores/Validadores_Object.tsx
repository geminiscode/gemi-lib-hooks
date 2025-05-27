// Validadores_Object.tsx
import { Consts_Validadores } from './Constants';
import type { Type_Validadores_Response_Basic } from './Types';
import { getValidatorType, Interface_Validadores } from './Validadores';

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/

interface Interface_Config_Object_Property {
    validator: (value: unknown) => Type_Validadores_Response_Basic;
    isRequired: boolean;
}

interface Interface_Config_Object {
    properties?: Record<string, Interface_Config_Object_Property>;
    optional?: boolean;
    allowUnknown?: boolean;
    required?: boolean;
}

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/

interface Interface_Validadores_Object_Chain {
    (valor: unknown): Type_Validadores_Response_Basic;

    shape(
        schema: Record<string, Interface_Validadores[keyof Interface_Validadores]>
    ): Interface_Validadores_Object_Chain;

    allowUnknown(): Interface_Validadores_Object_Chain;
    required(): Interface_Validadores_Object_Chain;
    optional(): Interface_Validadores_Object_Chain;

    type: typeof Consts_Validadores.types.object;
}

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/

function Build_Validadores_Object(): Interface_Validadores_Object_Chain {
    let config: Interface_Config_Object = {
        properties: {},
        optional: false,
        allowUnknown: false,
    };

    const validar = ((valor: unknown): Type_Validadores_Response_Basic => {
        if (config.optional && valor === undefined) return true;
        if (config.required && (valor === undefined || valor === null)) {
            return 'Error: Este campo es requerido.';
        }
        if (typeof valor !== 'object' || Array.isArray(valor) || valor === null) {
            return 'Error: El valor debe ser un objeto.';
        }

        const obj = valor as Record<string, unknown>;

        // Validar propiedades definidas
        for (const key in config.properties) {
            const propConfig = config.properties[key];
            const value = obj[key];

            const result = propConfig.validator(value);

            if (typeof result === 'string') {
                return `Error en propiedad "${key}": ${result}`;
            }
        }

        // Validar propiedades desconocidas
        if (!config.allowUnknown) {
            for (const key in obj) {
                if (!(key in (config.properties || {}))) {
                    return `Error: La propiedad "${key}" no está permitida en este objeto.`;
                }
            }
        }

        return true;
    }) as Interface_Validadores_Object_Chain;

    validar.type = Consts_Validadores.types.object;

    function chainable(fn: (valor: unknown) => Type_Validadores_Response_Basic): Interface_Validadores_Object_Chain {
        return Object.assign(fn, {
            shape: validar.shape,
            allowUnknown: validar.allowUnknown,
            required: validar.required,
            optional: validar.optional,
            type: Consts_Validadores.types.object,
        }) as Interface_Validadores_Object_Chain;
    }

    validar.shape = (schema) => {
        const newProperties: Record<string, Interface_Config_Object_Property> = {};

        for (const key in schema) {
            const validator = schema[key];
            const isRequired = getValidatorType(validator) !== 'undefined';

            newProperties[key] = {
                validator: validator as (value: unknown) => Type_Validadores_Response_Basic,
                isRequired,
            };
        }

        config = {
            ...config,
            properties: {
                ...(config.properties || {}),
                ...newProperties,
            },
        };

        return chainable(validar);
    };

    validar.allowUnknown = () => {
        config = {
            ...config,
            allowUnknown: true,
        };
        return chainable(validar);
    };

    validar.required = () => {
        config = {
            ...config,
            required: true,
            optional: false,
        };
        return chainable(validar);
    };

    validar.optional = () => {
        config = {
            ...config,
            optional: true,
            required: false,
        };
        return chainable(validar);
    };

    return chainable(validar);
}

/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/

export type { Interface_Validadores_Object_Chain };
export const Validadores_Object = Build_Validadores_Object();