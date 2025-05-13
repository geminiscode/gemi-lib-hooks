// Validadores.tsx
import { Validadores_Boolean } from "./Validadores_Boolean";
import { Validadores_Number } from "./Validadores_Number";
import { Validadores_String } from "./Validadores_String";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*INTERFACES ------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores {
  string: typeof Validadores_String;
  number: typeof Validadores_Number;
  boolean: typeof Validadores_Boolean;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*METHODS ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const Validadores: Interface_Validadores = {
  string: Validadores_String,
  number: Validadores_Number,
  boolean: Validadores_Boolean,
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default Validadores;