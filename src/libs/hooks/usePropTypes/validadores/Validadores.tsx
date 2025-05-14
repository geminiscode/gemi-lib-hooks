// Validadores.tsx
import { Validadores_Boolean } from "./Validadores_Boolean";
import { Validadores_Number } from "./Validadores_Number";
import { Validadores_Object } from "./Validadores_Object";
import { Validadores_String } from "./Validadores_String";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*INTERFACES ------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores {
  string: typeof Validadores_String;
  number: typeof Validadores_Number;
  boolean: typeof Validadores_Boolean;
  object: typeof Validadores_Object;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*METHODS ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const Validadores: Interface_Validadores = {
  string: Validadores_String,
  number: Validadores_Number,
  boolean: Validadores_Boolean,
  object: Validadores_Object,
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/


export type { Interface_Validadores };
export default Validadores;