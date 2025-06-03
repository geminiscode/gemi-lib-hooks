// Validadores.tsx
import { Consts_Validadores } from "./Constants";
import { Interface_Validadores, Type_Validador_Elemento, Type_Validador_Elemento_Response } from "./Types";
import { Validadores_Array } from "./Validadores_Array";
import { Validadores_BigInt } from "./Validadores_BigInt";
import { Validadores_Boolean } from "./Validadores_Boolean";
import { Validadores_InstanceOf } from "./Validadores_InstanceOf";
import { Validadores_Number } from "./Validadores_Number";
import { Validadores_Object } from "./Validadores_Object";
import { Validadores_String } from "./Validadores_String";
import { Validadores_Symbol } from "./Validadores_Symbol";



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
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export type { Interface_Validadores, Type_Validador_Elemento, Type_Validador_Elemento_Response };
export default Validadores;