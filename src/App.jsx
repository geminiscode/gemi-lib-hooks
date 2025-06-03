import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Consts_Validadores } from './libs/hooks/usePropTypes/validadores/Constants'
import Validadores from './libs/hooks/usePropTypes/validadores/Validadores'


import React, { useEffect, useRef } from 'react';

const SwitchProGamepad = () => {
    const [gamepadState, setGamepadState] = useState(null);
    const rafId = useRef(null);

    // Mapeo de botones según tu descripción
    const buttonMap = {
        0: 'B',
        1: 'A',
        2: 'Y',
        3: 'X',
        4: 'L',
        5: 'R',
        6: 'ZL',
        7: 'ZR',
        8: 'SELECT / -',
        9: 'START / +',
        10: 'Analógico Izq.',
        11: 'Analógico Der.',
        12: 'HOME',
        13: 'SCREEN CAPTURE',
    };

    // Umbral para considerar movimiento significativo
    const AXIS_THRESHOLD = 0.5;

    const processGamepad = () => {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];

        if (gp) {
            const pressedButtons = [];

            // Detectar botones presionados
            for (let i = 0; i < gp.buttons.length; i++) {
                const button = gp.buttons[i];
                if (button.pressed || button.value > 0.1) {
                    pressedButtons.push({
                        index: i,
                        name: buttonMap[i] || 'Desconocido',
                        value: button.value.toFixed(2),
                    });
                }
            }

            // Interpretar movimiento del eje 0 como D-Pad
            const axes = gp.axes;
            const dpadDirections = [];

            const leftX = axes[0]; // Eje 0 (D-Pad emulado)
            const leftY = axes[1]; // Eje 1 (Joystick izquierdo vertical)

            if (leftX < -AXIS_THRESHOLD) dpadDirections.push('D-Pad Izquierda');
            if (leftX > AXIS_THRESHOLD) dpadDirections.push('D-Pad Derecha');
            if (leftY < -AXIS_THRESHOLD) dpadDirections.push('D-Pad Arriba');
            if (leftY > AXIS_THRESHOLD) dpadDirections.push('D-Pad Abajo');

            setGamepadState({
                buttons: pressedButtons,
                dpad: dpadDirections,
                axes: [
                    { name: 'Eje D-Pad', value: axes[0].toFixed(2) },
                    { name: 'Eje Izq. Vertical', value: axes[1].toFixed(2) },
                    { name: 'Eje Izq. Horizontal', value: axes[2].toFixed(2) },
                    { name: 'Eje Der. Vertical', value: axes[3].toFixed(2) },
                    { name: 'Eje Der. Horizontal', value: axes[4].toFixed(2) },
                ],
            });
        }

        rafId.current = requestAnimationFrame(processGamepad);
    };

    useEffect(() => {
        const start = () => {
            rafId.current = requestAnimationFrame(processGamepad);
        };

        window.addEventListener('gamepadconnected', (e) => {
            console.log('Mando conectado:', e.gamepad);
            start();
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Mando desconectado:', e.gamepad);
            cancelAnimationFrame(rafId.current);
            setGamepadState(null);
        });

        return () => {
            cancelAnimationFrame(rafId.current);
        };
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>🎮 Estado del Mando</h2>
            {!gamepadState ? (
                <p>Conecta tu mando Switch Pro...</p>
            ) : (
                <>
                    <h3>🟢 Botones presionados:</h3>
                    {gamepadState.buttons.length > 0 ? (
                        <ul>
                            {gamepadState.buttons.map((btn, idx) => (
                                <li key={idx}>
                                    <strong>{btn.name}</strong> (Índice: {btn.index}) - Valor: {btn.value}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Ningún botón presionado.</p>
                    )}

                    <h3>🧭 D-Pad (detectado vía eje 0):</h3>
                    {gamepadState.dpad.length > 0 ? (
                        <ul>
                            {gamepadState.dpad.map((dir, idx) => (
                                <li key={idx}>{dir}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay dirección activa.</p>
                    )}

                    <h3>🕹️ Ejes (Joysticks):</h3>
                    <ul>
                        {gamepadState.axes.map((axis, idx) => (
                            <li key={idx}>
                                {axis.name}: {axis.value}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};


const GameCanvas = () => {
    const canvasRef = useRef(null);
    const gameLoopRef = useRef(null);

    // Estado del juego
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    // Datos del jugador
    const player = {
        x: 50,
        y: 0,
        width: 40,
        height: 40,
        velocityY: 0,
        gravity: 0.8,
        jumpStrength: -12,
        onGround: false,
    };

    // Obstáculos
    const obstacles = useRef([]);

    // Detección de salto desde el mando
    const jumpPressedRef = useRef(false);
    const lastJumpButtonPressed = useRef(false);

    const lastStartButtonPressed = useRef(false);
    const shouldRestart = useRef(false);


    // Umbral para detectar si se está en el suelo
    const GROUND_Y = 260;

    // Mapeo del botón A (índice 1)
    const buttonMap = {
        1: 'A',
    };

    // Procesar entrada del mando
    const processGamepad = () => {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];

        if (gp) {
            for (let i = 0; i < gp.buttons.length; i++) {
                const button = gp.buttons[i];
                if (buttonMap[i]) {
                    const isPressed = button.pressed || button.value > 0.1;

                    if (i === 1) { // Botón A
                        if (isPressed && !lastJumpButtonPressed.current) {
                            jumpPressedRef.current = true;
                        }
                        lastJumpButtonPressed.current = isPressed;
                    }


                    if (i === 9) { // Botón START
                        const isPressed = button.pressed || button.value > 0.1;

                        if (isPressed && !lastStartButtonPressed.current) {
                            shouldRestart.current = true;
                        }
                        lastStartButtonPressed.current = isPressed;
                    }
                }
            }
        }

        requestAnimationFrame(processGamepad);
    };

    // Loop principal del juego
    const gameLoop = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gravedad y movimiento del jugador
        player.velocityY += player.gravity;
        player.y += player.velocityY;

        // Suelo
        if (player.y >= GROUND_Y) {
            player.y = GROUND_Y;
            player.velocityY = 0;
            player.onGround = true;
        } else {
            player.onGround = false;
        }

        // Salto
        if (jumpPressedRef.current && player.onGround) {
            player.velocityY = player.jumpStrength;
            jumpPressedRef.current = false; // ✅ Ahora sí reseteamos correctamente
        }

        // Dibujar jugador
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Generar obstáculos
        if (Math.random() < 0.02) {
            obstacles.current.push({
                x: canvas.width,
                y: GROUND_Y,
                width: 20,
                height: 40,
                speed: 4,
            });
        }

        if (shouldRestart.current) {
            // Reiniciar variables
            player.y = 0;
            player.velocityY = 0;
            obstacles.current = [];
            setScore(0);
            setGameOver(false);
            shouldRestart.current = false;
            player.onGround = true;
            return; // Salta este frame para reiniciar limpiamente
        }

        // Actualizar y dibujar obstáculos
        ctx.fillStyle = 'red';
        obstacles.current.forEach((obstacle, index) => {
            obstacle.x -= obstacle.speed;

            // Dibujar
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Colisión
            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            ) {
                cancelAnimationFrame(gameLoopRef.current);
                setGameOver(true);
            }

            // Eliminar obstáculo fuera de pantalla
            if (obstacle.x + obstacle.width < 0) {
                obstacles.current.splice(index, 1);
                setScore(prev => prev + 1);
            }
        });

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    // Iniciar detección del mando
    useEffect(() => {
        window.addEventListener('gamepadconnected', () => {
            console.log('Mando conectado');
            requestAnimationFrame(processGamepad);
        });

        requestAnimationFrame(processGamepad);

        return () => {
            window.removeEventListener('gamepadconnected', () => { });
        };
    }, []);

    // Iniciar juego al montar el componente
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 600;
        canvas.height = 300;

        gameLoopRef.current = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(gameLoopRef.current);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
            <h2>🎮 Juego Runner con Mando Switch</h2>
            <p>Presiona el botón <strong>A</strong> para saltar.</p>
            <canvas ref={canvasRef} style={{ border: '1px solid #000', display: 'block', margin: '0 auto' }} />
            <p>Puntaje: <strong>{score}</strong></p>
            {gameOver && <h3 style={{ color: 'red' }}>💥 ¡Juego Terminado!</h3>}
        </div>
    );
};


const PlatformerGame = () => {
    const canvasRef = useRef(null);
    const gameLoopRef = useRef(null);

    // Estado del juego
    const [gameOver, setGameOver] = useState(false);
    const [maxHeight, setMaxHeight] = useState(0); // Altura máxima alcanzada


    // Suelo base
    const GROUND_Y = 260; // 👈 AQUÍ ESTÁ LA CORRECCIÓN

    // Datos del jugador
    const player = {
        x: 280,
        y: 0,
        width: 40,
        height: 40,
        velocityX: 0,
        velocityY: 0,
        speed: 3,
        gravity: 0.8,
        jumpStrength: -15,
        onGround: false,
    };

    // Plataformas dinámicas
    const platforms = useRef([
        { x: 100, y: 200, width: 200, height: 10 },
        { x: 350, y: 150, width: 150, height: 10 },
        { x: 100, y: 100, width: 200, height: 10 },
        { x: 350, y: 50, width: 150, height: 10 },
    ]);

    // Estados del mando
    const jumpPressedRef = useRef(false);
    const lastJumpButtonPressed = useRef(false);

    const lastStartButtonPressed = useRef(false);
    const shouldRestart = useRef(false);

    // Mapeo de botones
    const buttonMap = {
        1: 'A',
        9: 'START',
    };

    // Configuración de scroll/cámara
    const cameraY = useRef(0); // Desplazamiento de la cámara
    const lowestYBeforeGameOver = 100; // Límite de caída

    // Procesar entrada del mando
    const processGamepad = () => {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];

        if (gp) {
            for (let i = 0; i < gp.buttons.length; i++) {
                const button = gp.buttons[i];
                if (buttonMap[i]) {
                    const isPressed = button.pressed || button.value > 0.1;

                    if (i === 1) { // Botón A
                        if (isPressed && !lastJumpButtonPressed.current) {
                            jumpPressedRef.current = true;
                        }
                        lastJumpButtonPressed.current = isPressed;
                    }

                    if (i === 9) { // Botón START
                        const isPressed = button.pressed || button.value > 0.1;
                        if (isPressed && !lastStartButtonPressed.current) {
                            shouldRestart.current = true;
                        }
                        lastStartButtonPressed.current = isPressed;
                    }
                }
            }
        }

        requestAnimationFrame(processGamepad);
    };

    // Loop principal del juego
    const gameLoop = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Obtener input del joystick izquierdo (eje 0)
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];
        let moveX = 0;

        if (gp) {
            moveX = gp.axes[0]; // Eje X del joystick izquierdo
        }

        // Aplicar movimiento horizontal
        player.velocityX = moveX * player.speed;
        player.x += player.velocityX;

        // Limitar al ancho del canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        // Gravedad y movimiento vertical
        player.velocityY += player.gravity;
        player.y += player.velocityY;

        // Colisión con el suelo y plataformas
        let grounded = false;

        // Suelo base
        if (player.y >= GROUND_Y) {
            player.y = GROUND_Y;
            player.velocityY = 0;
            grounded = true;
        }

        // Plataformas
        platforms.current.forEach((platform) => {
            if (
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height < platform.y + 5 &&
                player.y + player.height + player.velocityY >= platform.y
            ) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                grounded = true;
            }
        });

        if (grounded) player.onGround = true;
        else player.onGround = false;

        // Salto
        if (jumpPressedRef.current && player.onGround) {
            player.velocityY = player.jumpStrength;
            jumpPressedRef.current = false;
        }

        // Calcular altura máxima
        const currentHeight = Math.floor(-player.y);
        if (currentHeight > maxHeight) {
            setMaxHeight(currentHeight);
        }

        // Scroll de la pantalla si subimos mucho
        const viewHeight = canvas.height;
        if (player.y < viewHeight / 2 && player.velocityY < 0) {
            const diff = player.y - (player.y - (viewHeight / 2));
            cameraY.current -= diff;
            player.y -= diff;

            // Mover todas las plataformas hacia abajo
            platforms.current.forEach(p => p.y -= diff);

            // Generar nuevas plataformas arriba
            generatePlatformsAbove(player.y);
        }

        // Si cae demasiado, termina el juego
        if (player.y > lowestYBeforeGameOver) {
            cancelAnimationFrame(gameLoopRef.current);
            setGameOver(true);
        }

        // Dibujar jugador
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y - cameraY.current, player.width, player.height);

        // Dibujar plataformas
        ctx.fillStyle = 'green';
        platforms.current.forEach(platform => {
            ctx.fillRect(
                platform.x,
                platform.y - cameraY.current,
                platform.width,
                platform.height
            );
        });

        // Dibujar suelo base
        ctx.fillStyle = 'green';
        ctx.fillRect(0, GROUND_Y + player.height - cameraY.current, canvas.width, 10);

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    // Generar nuevas plataformas por encima
    const generatePlatformsAbove = (minY) => {
        const canvas = canvasRef.current;
        const topY = minY - canvas.height;

        while (true) {
            const newY = platforms.current[platforms.current.length - 1].y - 60;
            if (newY < topY) break;

            const newX = Math.random() * (canvas.width - 150);
            const newWidth = 100 + Math.random() * 100;

            platforms.current.push({
                x: newX,
                y: newY,
                width: newWidth,
                height: 10,
            });
        }
    };

    // Iniciar detección del mando
    useEffect(() => {
        window.addEventListener('gamepadconnected', () => {
            console.log('Mando conectado');
            requestAnimationFrame(processGamepad);
        });

        requestAnimationFrame(processGamepad);

        return () => {
            window.removeEventListener('gamepadconnected', () => { });
        };
    }, []);

    // Iniciar juego al montar el componente
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 600;
        canvas.height = 300;

        gameLoopRef.current = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(gameLoopRef.current);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
            <h2>🎮 Juego de Plataformas Infinitas</h2>
            <p>Muevete con el joystick izquierdo y salta con el botón <strong>A</strong></p>
            <canvas ref={canvasRef} style={{ border: '1px solid #000', display: 'block', margin: '0 auto' }} />
            <p>Altura máxima alcanzada: <strong>{maxHeight}px</strong></p>
            {gameOver && (
                <>
                    <h3 style={{ color: 'red' }}>💥 ¡Caíste!</h3>
                    <p>Presiona START para reiniciar</p>
                </>
            )}
        </div>
    );
};


function App() {
    const [count, setCount] = useState(0)

    const validateUser = Validadores.object.shape({
        id: Validadores.number.required(),
        nombre: Validadores.string.min(3),
        email: Validadores.string,
    }).requiredKeys(['id', 'nombre']);

    console.log(validateUser({ id: 123, nombre: 'Ana' })); // true ✅
    console.log(validateUser({ nombre: 'Ana' })); // Error ❌ (falta "id")
    console.log(validateUser({ id: 123 })); // Error ❌ (falta "nombre")
    console.log(validateUser({ id: 123, nombre: 'Ana', edad: 30 })); // Error ❌ (clave no permitida)


    return <PlatformerGame />;

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}



export default App