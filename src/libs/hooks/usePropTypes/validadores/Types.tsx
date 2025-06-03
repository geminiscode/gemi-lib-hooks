//Types.tsx
/**
 *  -   En este archivo se definen los tipos de validadores que se utilizan en la librería de validación de propiedades.
 *  -   Estos tipos son utilizados para definir la estructura de los validadores y asegurar que se cumplan las 
 *  expectativas de entrada y salida.
 */
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



// Definición de respuesta para los validadores
export type Type_Validadores_Response_Basic = true | string;

// Tipo para cada campo del esquema: string | number | boolean, etc.
export type Type_Validador_Elemento = Interface_Validadores[keyof Interface_Validadores];

// Tipo para cada validacion de esquema que genere una respuesta
export type Type_Validador_Elemento_Response = string | undefined;



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// Interfaz para validar funciones que pueden recibir 1 o 2 argumentos
export interface Type_Validadores {
    // Versión básica: solo valor
    (valor: unknown): Type_Validadores_Response_Basic;

    // Versión extendida: valor + esquema u otro dato
    (valor: unknown, esquema: any): Type_Validadores_Response_Basic;
}

// Interfaz para conjunto de validaciones
export interface Interface_Validadores {
    string: typeof Validadores_String & { type: typeof Consts_Validadores.types.string };
    number: typeof Validadores_Number & { type: typeof Consts_Validadores.types.number };
    bigint: typeof Validadores_BigInt & { type: typeof Consts_Validadores.types.bigint };
    boolean: typeof Validadores_Boolean & { type: typeof Consts_Validadores.types.boolean };
    symbol: typeof Validadores_Symbol & { type: typeof Consts_Validadores.types.symbol };
    array: typeof Validadores_Array & { type: typeof Consts_Validadores.types.array };
    instanceof: typeof Validadores_InstanceOf & { type: typeof Consts_Validadores.types.instanceof };
    object: typeof Validadores_Object & { type: typeof Consts_Validadores.types.object };
}