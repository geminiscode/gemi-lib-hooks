import { describe, it, expect } from 'vitest';
import { Validadores_Number } from '../libs/hooks/usePropTypes/validadores/Validadores_Number';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* VARIABLES ------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const validarNumber = Validadores_Number;
const commonErrorMessage = 'Error: El valor proporcionado no es un número válido.';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* HELPERS --------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const testBuilder = (p_expect: unknown, p_toBe?: unknown) => {
    expect(p_expect).toBeOneOf([commonErrorMessage, p_toBe]);
}



//=================================================================================================
/** ###############################################################################################
 * Este test incluye: 
 * ✅ Validaciones básicas (número válido)
 * ❌ Valores inválidos (string, booleano, null, undefined, objeto, array)
 * 🔁 Métodos encadenados con y sin mensajes personalizados
 * 📏 Casos específicos: positivo, negativo, entero, rango, múltiplo
 * ⚠️ Uso de mensajes por defecto cuando no se especifican 
 ################################################################################################*/
//=================================================================================================



describe('Validadores.number', () => {
    describe('✅ Caso básico: número válido', () => {
        it('debería aceptar un número válido', () => {
            testBuilder(validarNumber(10), true);
        });
    });

    describe('❌ NaN', () => {
        it('debería rechazar NaN', () => {
            testBuilder(validarNumber(NaN));
        });
    });

    describe('❌ String', () => {
        it('debería rechazar un string', () => {
            testBuilder(validarNumber('123'));
        });
    });

    describe('❌ Booleano', () => {
        it('debería rechazar un booleano', () => {
            testBuilder(validarNumber(true));
        });
    });

    describe('❌ Objeto', () => {
        it('debería rechazar un objeto', () => {
            testBuilder(validarNumber({}));
        });
    });

    describe('❌ Array', () => {
        it('debería rechazar un array', () => {
            testBuilder(validarNumber([]));
        });
    });

    describe('❌ null', () => {
        it('debería rechazar null', () => {
            testBuilder(validarNumber(null));
        });
    });

    describe('❌ undefined', () => {
        it('debería rechazar undefined', () => {
            testBuilder(validarNumber(undefined));
        });
    });

    describe('❌ required() + valor null', () => {
        it('debería fallar si se requiere y el valor es null', () => {
            testBuilder(validarNumber.required('Campo requerido')(null), 'Campo requerido');
        });
    });

    describe('❌ required() + valor undefined', () => {
        it('debería fallar si se requiere y el valor es undefined', () => {
            testBuilder(validarNumber.required('Campo requerido')(undefined), 'Campo requerido');
        });
    });

    describe('✅ required()', () => {
        it('debería pasar si el número está presente', () => {
            testBuilder(validarNumber.required()(10), true);
        });
    });

    describe('❌ Menor que min', () => {
        it('debería fallar si el número es menor que el mínimo', () => {
            testBuilder(validarNumber.min(5, 'Mínimo 5')(3), 'Mínimo 5');
        });
    });

    describe('✅ Mayor o igual que min', () => {
        it('debería pasar si el número es mayor o igual al mínimo (igual)', () => {
            testBuilder(validarNumber.min(5)(5), true);
        });
        it('debería pasar si el número es mayor o igual al mínimo (mayor)', () => {
            testBuilder(validarNumber.min(5)(6), true);
        });
    });

    describe('❌ Mayor que max', () => {
        it('debería fallar si el número excede el máximo', () => {
            testBuilder(validarNumber.max(10, 'Máximo 10')(15), 'Máximo 10');
        });
    });

    describe('✅ Menor o igual que max', () => {
        it('debería pasar si el número es menor o igual al máximo (igual)', () => {
            testBuilder(validarNumber.max(10)(10), true);
        });
        it('debería pasar si el número es menor o igual al máximo (menor)', () => {
            testBuilder(validarNumber.max(10)(9), true);
        });
    });

    describe('❌ Fuera del rango between', () => {
        it('debería fallar si el número está fuera del rango especificado (por debajo)', () => {
            testBuilder(validarNumber.between(5, 10, 'Entre 5 y 10')(3), 'Entre 5 y 10');
        });
        it('debería fallar si el número está fuera del rango especificado (por arriba)', () => {
            testBuilder(validarNumber.between(5, 10)(12), 'Error: Debe estar entre 5 y 10.');
        });
    });

    describe('✅ Dentro del rango between', () => {
        it('debería pasar si el número está dentro del rango especificado', () => {
            testBuilder(validarNumber.between(5, 10)(7), true);
        });
    });

    describe('❌ No es positivo', () => {
        it('debería fallar si el número no es positivo (-5)', () => {
            testBuilder(validarNumber.positive('Debe ser positivo')(-5), 'Debe ser positivo');
        });
        it('debería fallar si el número no es positivo (0)', () => {
            testBuilder(validarNumber.positive()(0), 'Error: Debe ser un número positivo.');
        });
    });

    describe('✅ Es positivo', () => {
        it('debería pasar si el número es positivo', () => {
            testBuilder(validarNumber.positive()(1), true);
        });
    });

    describe('❌ No es negativo', () => {
        it('debería fallar si el número no es negativo (5)', () => {
            testBuilder(validarNumber.negative('Debe ser negativo')(5), 'Debe ser negativo');
        });
        it('debería fallar si el número no es negativo (0)', () => {
            testBuilder(validarNumber.negative()(0), 'Error: Debe ser un número negativo.');
        });
    });

    describe('✅ Es negativo', () => {
        it('debería pasar si el número es negativo', () => {
            testBuilder(validarNumber.negative()(-1), true);
        });
    });

    describe('❌ No es entero', () => {
        it('debería fallar si el número no es entero', () => {
            testBuilder(validarNumber.integer('Debe ser entero')(3.5), 'Debe ser entero');
        });
    });

    describe('✅ Es entero', () => {
        it('debería pasar si el número es entero', () => {
            testBuilder(validarNumber.integer()(4), true);
        });
    });

    describe('❌ No es múltiplo', () => {
        it('debería fallar si el número no es múltiplo de 3', () => {
            testBuilder(validarNumber.multipleOf(3, 'Debe ser múltiplo de 3')(4), 'Debe ser múltiplo de 3');
        });
    });

    describe('✅ Es múltiplo', () => {
        it('debería pasar si el número es múltiplo de 3', () => {
            testBuilder(validarNumber.multipleOf(3)(6), true);
        });
    });

    describe('✅ Sin mensaje personalizado en required()', () => {
        it('debería usar mensaje por defecto en required()', () => {
            testBuilder(validarNumber.required()(undefined), 'Error: Este campo es requerido.');
        });
    });

    describe('✅ Sin mensaje personalizado en min()', () => {
        it('debería usar mensaje por defecto en min()', () => {
            testBuilder(validarNumber.min(5)(3), 'Error: Debe ser mayor o igual a 5.');
        });
    });

    describe('✅ Sin mensaje personalizado en max()', () => {
        it('debería usar mensaje por defecto en max()', () => {
            testBuilder(validarNumber.max(10)(20), 'Error: Debe ser menor o igual a 10.');
        });
    });

    describe('✅ Sin mensaje personalizado en between()', () => {
        it('debería usar mensaje por defecto en between()', () => {
            testBuilder(validarNumber.between(1, 5)(10), 'Error: Debe estar entre 1 y 5.');
        });
    });

    describe('✅ Sin mensaje personalizado en positive()', () => {
        it('debería usar mensaje por defecto en positive()', () => {
            testBuilder(validarNumber.positive()(-10), 'Error: Debe ser un número positivo.');
        });
    });

    describe('✅ Sin mensaje personalizado en negative()', () => {
        it('debería usar mensaje por defecto en negative()', () => {
            testBuilder(validarNumber.negative()(10), 'Error: Debe ser un número negativo.');
        });
    });

    describe('✅ Sin mensaje personalizado en integer()', () => {
        it('debería usar mensaje por defecto en integer()', () => {
            testBuilder(validarNumber.integer()(3.14), 'Error: Debe ser un número entero.');
        });
    });

    describe('✅ Sin mensaje personalizado en multipleOf()', () => {
        it('debería usar mensaje por defecto en multipleOf()', () => {
            testBuilder(validarNumber.multipleOf(5)(7), 'Error: Debe ser múltiplo de 5.');
        });
    });

    describe('✅ Encadenamiento múltiple', () => {
        it('debería encadenar validaciones: min + max + positive', () => {
            testBuilder(
                validarNumber
                    .min(1, 'Mínimo 1')
                    .max(100, 'Máximo 100')
                    .positive('Debe ser positivo')(50),
                true
            );
        });
    });

    describe('❌ Encadenamiento fallido', () => {
        it('debería fallar en la primera validación encadenada', () => {
            testBuilder(
                validarNumber
                    .min(10, 'Mínimo 10')
                    .max(100, 'Máximo 100')
                    .positive('Debe ser positivo')(5),
                'Mínimo 10'
            );
        });
    });

    describe('✅ Número muy grande', () => {
        it('debería aceptar números grandes', () => {
            testBuilder(validarNumber(Number.MAX_SAFE_INTEGER), true);
        });
    });

    describe('✅ Número muy pequeño (negativo)', () => {
        it('debería aceptar números negativos grandes', () => {
            testBuilder(validarNumber(-Number.MAX_SAFE_INTEGER), true);
        });
    });
});