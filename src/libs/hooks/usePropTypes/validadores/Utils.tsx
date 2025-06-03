import { Interface_Validadores, Type_Validador_Elemento, Type_Validador_Elemento_Response } from "./Validadores";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*METHODS ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// Función para obtener el tipo del validador
export function getValidatorType(validator: Type_Validador_Elemento): Type_Validador_Elemento_Response {
    if ('type' in validator) {
      return (validator as { type: string }).type;
    }
    return undefined;
}

/* Función para validar si es o no un validador */
export function isValidValidators(schemas: Interface_Validadores[keyof Interface_Validadores][] | Interface_Validadores[keyof Interface_Validadores]): Type_Validador_Elemento_Response {
    const schemasArray = Array.isArray(schemas) ? schemas : [schemas];
    const types = schemasArray.map(getValidatorType);

    //validar que los validadores sean válidos
    if (types.some(type => type === undefined)) {
        //indicar cual es el validador inválido especificando su posición y nombre
        const invalidIndex = types.findIndex(type => type === undefined);
        // obtener el nombre del validador inválido
        const invalidValidatorName = schemasArray[invalidIndex]?.name || 'desconocido';
        // retornar un mensaje de error indicando el validador inválido
        return `Error: El validador en la posición [${invalidIndex}] (${invalidValidatorName}) no es válido.`;
    }

    return undefined;
}