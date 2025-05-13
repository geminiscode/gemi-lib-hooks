// Validadores.tsx
import { Type_Validadores_Response_Basic } from "./Types";
import { Validadores_Array } from "./Validadores_Array";
import { Validadores_Boolean } from "./Validadores_Boolean";
import { Validadores_Number } from "./Validadores_Number";
import { Schema, Validadores_Shape } from "./Validadores_Shape";
import { Validadores_String } from "./Validadores_String";



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*INTERFACES ------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores {
  string: typeof Validadores_String;
  number: typeof Validadores_Number;
  boolean: typeof Validadores_Boolean;
  shape<T extends Interface_Validadores>(
    schema: Schema<T>
  ): (valor: unknown) => Type_Validadores_Response_Basic | Record<keyof T, string>;
  array: typeof Validadores_Array;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*METHODS ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const Validadores: Interface_Validadores = {
  string: Validadores_String,
  number: Validadores_Number,
  boolean: Validadores_Boolean,
  shape: Validadores_Shape.shape,
  array: Validadores_Array,
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORT ----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/


export type { Interface_Validadores };
export default Validadores;