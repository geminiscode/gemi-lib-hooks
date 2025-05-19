// Validadores.tsx
import { Validadores_BigInt } from "./Validadores_BigInt";
import { Validadores_Boolean } from "./Validadores_Boolean";
import { Validadores_Null } from "./Validadores_Null";
import { Validadores_Number } from "./Validadores_Number";
import { Validadores_Object } from "./Validadores_Object";
import { Validadores_String } from "./Validadores_String";
import { Validadores_Symbol } from "./Validadores_Symbol";
import { Validadores_Undefined } from "./Validadores_Undefined";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*INTERFACES ------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores {
  string: typeof Validadores_String;
  number: typeof Validadores_Number;
  bigint: typeof Validadores_BigInt;
  boolean: typeof Validadores_Boolean;
  undefined: typeof Validadores_Undefined;
  null: typeof Validadores_Null;
  symbol: typeof Validadores_Symbol;
  object: typeof Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*METHODS ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const Validadores: Interface_Validadores = {
  string: Validadores_String,
  number: Validadores_Number,
  bigint: Validadores_BigInt,
  boolean: Validadores_Boolean,
  undefined: Validadores_Undefined,
  null: Validadores_Null,
  symbol: Validadores_Symbol,
  object: Validadores_Object,
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/


export type { Interface_Validadores };
export default Validadores;