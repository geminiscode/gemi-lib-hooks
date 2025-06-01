// Validadores.tsx
import { Consts_Validadores } from "./Constants";
import { Validadores_Array } from "./Validadores_Array";
import { Validadores_BigInt } from "./Validadores_BigInt";
import { Validadores_Boolean } from "./Validadores_Boolean";
import { Validadores_InstanceOf } from "./Validadores_InstanceOf";
import { Validadores_Number } from "./Validadores_Number";
import { Validadores_Object } from "./Validadores_Object";
import { Validadores_String } from "./Validadores_String";
import { Validadores_Symbol } from "./Validadores_Symbol";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* TYPES ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/




// Tipo para cada campo del esquema: string | number | boolean, etc.
type Type_Validador_Elemento = Interface_Validadores[keyof Interface_Validadores];

type Type_Validador_Elemento_Response = string | undefined;



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*INTERFACES ------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores {
    string: typeof Validadores_String & { type: typeof Consts_Validadores.types.string };
    number: typeof Validadores_Number & { type: typeof Consts_Validadores.types.number };
    bigint: typeof Validadores_BigInt & { type: typeof Consts_Validadores.types.bigint };
    boolean: typeof Validadores_Boolean & { type: typeof Consts_Validadores.types.boolean };
    symbol: typeof Validadores_Symbol & { type: typeof Consts_Validadores.types.symbol };
    array: typeof Validadores_Array & { type: typeof Consts_Validadores.types.array };
    instanceof: typeof Validadores_InstanceOf & { type: typeof Consts_Validadores.types.instanceof };
    object: typeof Validadores_Object & { type: typeof Consts_Validadores.types.object };
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*MAIN ------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const Validadores: Interface_Validadores = {
    string: Validadores_String,
    number: Validadores_Number,
    bigint: Validadores_BigInt,
    boolean: Validadores_Boolean,
    symbol: Validadores_Symbol,
    array: Validadores_Array,
    instanceof: Validadores_InstanceOf,
    object: Validadores_Object,
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*METHODS ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// Función para obtener el tipo del validador
function getValidatorType(validator: Type_Validador_Elemento): Type_Validador_Elemento_Response {
    if ('type' in validator) {
      return (validator as { type: string }).type;
    }
    return undefined;
}

function isValidValidators(schemas: Interface_Validadores[keyof Interface_Validadores][] | Interface_Validadores[keyof Interface_Validadores]): Type_Validador_Elemento_Response {
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



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export { getValidatorType, isValidValidators };
export type { Interface_Validadores, Type_Validador_Elemento, Type_Validador_Elemento_Response };
export default Validadores;