// Validadores.tsx
import { Consts_Validadores } from "./Constants";
import { Validadores_Array } from "./Validadores_Array";
import { Validadores_BigInt } from "./Validadores_BigInt";
import { Validadores_Boolean } from "./Validadores_Boolean";
import { Validadores_InstanceOf } from "./Validadores_InstanceOf";
import { Validadores_Null } from "./Validadores_Null";
import { Validadores_Number } from "./Validadores_Number";
import { Validadores_String } from "./Validadores_String";
import { Validadores_Symbol } from "./Validadores_Symbol";
import { Validadores_Undefined } from "./Validadores_Undefined";



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
    undefined: typeof Validadores_Undefined & { type: typeof Consts_Validadores.types.undefined };
    null: typeof Validadores_Null & { type: typeof Consts_Validadores.types.null };
    symbol: typeof Validadores_Symbol & { type: typeof Consts_Validadores.types.symbol };
    array: typeof Validadores_Array & { type: typeof Consts_Validadores.types.array };
    instanceof: typeof Validadores_InstanceOf & { type: typeof Consts_Validadores.types.instanceof };
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*MAIN ------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const Validadores: Interface_Validadores = {
    string: Validadores_String,
    number: Validadores_Number,
    bigint: Validadores_BigInt,
    boolean: Validadores_Boolean,
    undefined: Validadores_Undefined,
    null: Validadores_Null,
    symbol: Validadores_Symbol,
    array: Validadores_Array,
    instanceof: Validadores_InstanceOf,
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



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export { getValidatorType };
export type { Interface_Validadores, Type_Validador_Elemento, Type_Validador_Elemento_Response };
export default Validadores;