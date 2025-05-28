import { describe, it, expect } from 'vitest';
import { Validadores_String } from '../libs/hooks/usePropTypes/validadores/Validadores_String';



const validarString = Validadores_String;



describe('Validadores.string', () => {

    it('debería aceptar un string válido', () => {
        expect(validarString('hola')).toBe(true);
    });

    it('debería rechazar un número', () => {
        expect(validarString(123)).toBe('Error: El valor proporcionado no es un string.');
    });

    it('debería fallar si se requiere y el valor es vacío', () => {
        expect(validarString.required('Campo requerido')('')).toBe('Campo requerido');
    });

    it('debería fallar si se requiere y el valor es null', () => {
        expect(validarString.required('Campo requerido')(null)).toBeOneOf([
            'Error: El valor proporcionado no es un string.',
            'Campo requerido'
        ]);
    });

    it('debería pasar si el string tiene longitud mínima', () => {
        expect(validarString.min(3, 'Mínimo 3 caracteres')('abcd')).toBe(true);
    });

    it('debería fallar si el string no alcanza la longitud mínima', () => {
        expect(validarString.min(3, 'Mínimo 3 caracteres')('ab')).toBe('Mínimo 3 caracteres');
    });

    it('debería pasar si el string tiene longitud máxima', () => {
        expect(validarString.max(5, 'Máximo 5 caracteres')('abc')).toBe(true);
    });

    it('debería fallar si el string excede la longitud máxima', () => {
        expect(validarString.max(5, 'Máximo 5 caracteres')('abcdef')).toBe('Máximo 5 caracteres');
    });

    it('debería pasar si el string tiene exactamente la longitud especificada', () => {
        const resultado = validarString.exact(4, 'Exactamente 4 caracteres')('test');
        expect(resultado).toBe(true);
    });

    it('debería fallar si el string no tiene la longitud exacta', () => {
        expect(validarString.exact(4, 'Exactamente 4 caracteres')('tes')).toBe('Exactamente 4 caracteres');
    });

    it('debería aceptar solo letras', () => {
        expect(validarString.onlyLetters('Solo letras permitidas')('HolaMundo')).toBe(true);
    });

    it('debería rechazar números o símbolos en onlyLetters', () => {
        expect(validarString.onlyLetters('Solo letras permitidas')('hola123')).toBe('Solo letras permitidas');
    });

    it('debería aceptar solo números como string', () => {
        expect(validarString.onlyNumbers('Solo números permitidos')('123456')).toBe(true);
    });

    it('debería rechazar letras en onlyNumbers', () => {
        expect(validarString.onlyNumbers('Solo números permitidos')('123a')).toBe('Solo números permitidos');
    });

    it('debería aceptar alfanuméricos', () => {
        expect(validarString.alphanumeric('Solo alfanuméricos')('Hola123')).toBe(true);
    });

    it('debería rechazar caracteres especiales en alfanuméricos', () => {
        expect(validarString.alphanumeric('Solo alfanuméricos')('hola#123')).toBe('Solo alfanuméricos');
    });

    it('debería cumplir con una expresión regular', () => {
        const regex = /^[A-Z][a-z]+$/;
        expect(validarString.regex(regex, 'Debe comenzar con mayúscula')('Hola')).toBe(true);
    });

    it('debería fallar si no cumple la expresión regular', () => {
        const regex = /^[A-Z][a-z]+$/;
        expect(validarString.regex(regex, 'Debe comenzar con mayúscula')('hola')).toBe(
            'Debe comenzar con mayúscula'
        );
    });



    



    // ✅ Caso básico: string válido
    it('debería aceptar un string válido', () => {
        expect(validarString('hola')).toBe(true);
    });

    // ❌ Número
    it('debería rechazar un número', () => {
        expect(validarString(123)).toBe('Error: El valor proporcionado no es un string.');
    });

    // ❌ Booleano
    it('debería rechazar un booleano', () => {
        expect(validarString(true)).toBe('Error: El valor proporcionado no es un string.');
    });

    // ❌ Objeto
    it('debería rechazar un objeto', () => {
        expect(validarString({})).toBe('Error: El valor proporcionado no es un string.');
    });

    // ❌ Array
    it('debería rechazar un array', () => {
        expect(validarString([])).toBe('Error: El valor proporcionado no es un string.');
    });

    // ❌ null
    it('debería rechazar null', () => {
        expect(validarString(null)).toBe('Error: El valor proporcionado no es un string.');
    });

    // ❌ undefined
    it('debería rechazar undefined', () => {
        expect(validarString(undefined)).toBe('Error: El valor proporcionado no es un string.');
    });

    // ❌ Vacío
    it('debería fallar si se requiere y el valor es vacío', () => {
        expect(validarString.required('Campo requerido')('')).toBe('Campo requerido');
    });

    // ❌ Espacio en blanco
    it('debería fallar si se requiere y el valor es solo espacios', () => {
        expect(validarString.required('Campo requerido')('   ')).toBe('Campo requerido');
    });

    // ❌ null + required()
    it('debería fallar si se requiere y el valor es null', () => {
        expect(validarString.required('Campo requerido')(null)).toBeOneOf([
            'Error: El valor proporcionado no es un string.',
            'Campo requerido',
        ]);
    });

    // ✅ Longitud mínima
    it('debería pasar si el string tiene longitud mínima', () => {
        expect(validarString.min(3, 'Mínimo 3 caracteres')('abcd')).toBe(true);
    });

    // ❌ Menor que min
    it('debería fallar si el string no alcanza la longitud mínima', () => {
        expect(validarString.min(3, 'Mínimo 3 caracteres')('ab')).toBe('Mínimo 3 caracteres');
    });

    // ✅ Longitud máxima
    it('debería pasar si el string tiene longitud máxima', () => {
        expect(validarString.max(5, 'Máximo 5 caracteres')('abc')).toBe(true);
    });

    // ❌ Mayor que max
    it('debería fallar si el string excede la longitud máxima', () => {
        expect(validarString.max(5, 'Máximo 5 caracteres')('abcdef')).toBe('Máximo 5 caracteres');
    });

    // ✅ Longitud exacta
    it('debería pasar si el string tiene exactamente la longitud especificada', () => {
        const resultado = validarString.exact(4, 'Exactamente 4 caracteres')('test');
        expect(resultado).toBe(true);
    });

    // ❌ No coincide exact
    it('debería fallar si el string no tiene la longitud exacta', () => {
        expect(validarString.exact(4, 'Exactamente 4 caracteres')('tes')).toBe('Exactamente 4 caracteres');
    });

    // ✅ Solo letras
    it('debería aceptar solo letras', () => {
        expect(validarString.onlyLetters('Solo letras permitidas')('HolaMundo')).toBe(true);
    });

    // ❌ Letras con números
    it('debería rechazar números o símbolos en onlyLetters', () => {
        expect(validarString.onlyLetters('Solo letras permitidas')('hola123')).toBe('Solo letras permitidas');
    });

    // ✅ Solo números como string
    it('debería aceptar solo números como string', () => {
        expect(validarString.onlyNumbers('Solo números permitidos')('123456')).toBe(true);
    });

    // ❌ Números con letra
    it('debería rechazar letras en onlyNumbers', () => {
        expect(validarString.onlyNumbers('Solo números permitidos')('123a')).toBe('Solo números permitidos');
    });

    // ✅ Alfanumérico
    it('debería aceptar alfanuméricos', () => {
        expect(validarString.alphanumeric('Solo alfanuméricos')('Hola123')).toBe(true);
    });

    // ❌ Con símbolo
    it('debería rechazar caracteres especiales en alfanuméricos', () => {
        expect(validarString.alphanumeric('Solo alfanuméricos')('hola#123')).toBe('Solo alfanuméricos');
    });

    // ✅ Regex correcto
    it('debería cumplir con una expresión regular', () => {
        const regex = /^[A-Z][a-z]+$/;
        expect(validarString.regex(regex, 'Debe comenzar con mayúscula')('Hola')).toBe(true);
    });

    // ❌ Regex incorrecto
    it('debería fallar si no cumple la expresión regular', () => {
        const regex = /^[A-Z][a-z]+$/;
        expect(validarString.regex(regex, 'Debe comenzar con mayúscula')('hola')).toBe(
            'Debe comenzar con mayúscula'
        );
    });

    // ✅ Cadena muy larga
    it('debería aceptar una cadena muy larga', () => {
        const cadenaLarga = 'a'.repeat(1000000); // 1 millón de caracteres
        expect(validarString(cadenaLarga)).toBe(true);
    });

    // ✅ Unicode
    it('debería aceptar caracteres Unicode', () => {
        expect(validarString('ñáéíóú¿?¡!')).toBe(true);
    });

    // ✅ Encadenamiento múltiple
    it('debería encadenar validaciones: min + max + onlyLetters', () => {
        const resultado = validarString
            .min(3, 'Mínimo 3')
            .max(10, 'Máximo 10')
            .onlyLetters('Solo letras')('Test');

        expect(resultado).toBe(true);
    });

    // ❌ Encadenamiento fallido
    it('debería fallar en la primera validación encadenada', () => {
        const resultado = validarString
            .min(3, 'Mínimo 3')
            .max(10, 'Máximo 10')
            .onlyLetters('Solo letras')('T3st');

        expect(resultado).toBe('Solo letras');
    });

    // ✅ Sin mensaje personalizado (mensaje por defecto)
    it('debería usar mensaje por defecto en required()', () => {
        const resultado = validarString.required('Error: Este campo es requerido.')('');
        expect(resultado).toBe('Error: Este campo es requerido.');
    });

    // ✅ Sin mensaje personalizado en min()
    it('debería usar mensaje por defecto en min()', () => {
        const resultado = validarString.min(5)('abc');
        expect(resultado).toBe('Error: Debe tener al menos 5 caracteres.');
    });
});