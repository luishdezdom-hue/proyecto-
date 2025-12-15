import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCw, RefreshCw, Trophy, LayoutGrid, CheckCircle2 } from 'lucide-react';

type GameType = 'MENU' | 'PACMAN' | 'TETRIS' | 'WORD_SEARCH' | 'CROSSWORD';

// --- TETRIS UTILS ---
const TETRIS_ROWS = 20;
const TETRIS_COLS = 10;
const TETROMINOS = {
    I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-600' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
    O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-600' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' }
};

const TetrisGame = () => {
    const [grid, setGrid] = useState(Array(TETRIS_ROWS).fill(Array(TETRIS_COLS).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [activePiece, setActivePiece] = useState<any>(null);
    const [activePos, setActivePos] = useState({ x: 0, y: 0 });
    const gameLoopRef = useRef<number | null>(null);

    const createPiece = () => {
        const types = 'IJLOSTZ';
        const type = types[Math.floor(Math.random() * types.length)] as keyof typeof TETROMINOS;
        const piece = TETROMINOS[type];
        return { ...piece, type };
    };

    const checkCollision = (pieceGrid: number[][], offset: {x: number, y: number}) => {
        for (let y = 0; y < pieceGrid.length; y++) {
            for (let x = 0; x < pieceGrid[y].length; x++) {
                if (pieceGrid[y][x] !== 0) {
                    const newY = y + offset.y;
                    const newX = x + offset.x;
                    if (newY >= TETRIS_ROWS || newX < 0 || newX >= TETRIS_COLS || (newY >= 0 && grid[newY][newX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const mergePiece = () => {
        const newGrid = grid.map(row => [...row]);
        activePiece.shape.forEach((row: number[], y: number) => {
            row.forEach((val: number, x: number) => {
                if (val !== 0) {
                    const newY = y + activePos.y;
                    const newX = x + activePos.x;
                    if (newY >= 0 && newY < TETRIS_ROWS && newX >= 0 && newX < TETRIS_COLS) {
                        newGrid[newY][newX] = 1; // Simplification: just store 1 for occupied
                    }
                }
            });
        });

        // Clear lines
        let linesCleared = 0;
        const clearedGrid = newGrid.filter(row => {
            if (row.every(cell => cell !== 0)) {
                linesCleared++;
                return false;
            }
            return true;
        });

        while (clearedGrid.length < TETRIS_ROWS) {
            clearedGrid.unshift(Array(TETRIS_COLS).fill(0));
        }

        setGrid(clearedGrid);
        setScore(prev => prev + (linesCleared * 100));
        spawnPiece();
    };

    const spawnPiece = () => {
        const piece = createPiece();
        const startPos = { x: Math.floor(TETRIS_COLS / 2) - 1, y: 0 };
        if (checkCollision(piece.shape, startPos)) {
            setGameOver(true);
        } else {
            setActivePiece(piece);
            setActivePos(startPos);
        }
    };

    const move = (dirX: number, dirY: number) => {
        if (!activePiece || gameOver) return;
        if (!checkCollision(activePiece.shape, { x: activePos.x + dirX, y: activePos.y + dirY })) {
            setActivePos(prev => ({ x: prev.x + dirX, y: prev.y + dirY }));
        } else if (dirY > 0) {
            mergePiece();
        }
    };

    const rotate = () => {
        if (!activePiece || gameOver) return;
        const rotated = activePiece.shape[0].map((_: any, index: number) => activePiece.shape.map((row: any[]) => row[index]).reverse());
        if (!checkCollision(rotated, activePos)) {
            setActivePiece({ ...activePiece, shape: rotated });
        }
    };

    useEffect(() => {
        spawnPiece();
        return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
    }, []);

    useEffect(() => {
        if (gameOver) {
             if (gameLoopRef.current) clearInterval(gameLoopRef.current);
             return;
        }
        gameLoopRef.current = window.setInterval(() => move(0, 1), 1000);
        return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
    }, [activePiece, activePos, gameOver, grid]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) return;
            if (e.key === 'ArrowLeft') move(-1, 0);
            if (e.key === 'ArrowRight') move(1, 0);
            if (e.key === 'ArrowDown') move(0, 1);
            if (e.key === 'ArrowUp') rotate();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activePiece, activePos, gameOver, grid]);

    const displayGrid = grid.map(row => [...row]);
    if (activePiece && !gameOver) {
        activePiece.shape.forEach((row: number[], y: number) => {
            row.forEach((val: number, x: number) => {
                if (val !== 0) {
                    const newY = y + activePos.y;
                    const newX = x + activePos.x;
                    if (newY >= 0 && newY < TETRIS_ROWS && newX >= 0 && newX < TETRIS_COLS) {
                        displayGrid[newY][newX] = 2;
                    }
                }
            });
        });
    }

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 flex justify-between w-64 text-slate-800 font-bold">
                <span>Score: {score}</span>
                {gameOver && <span className="text-red-500">GAME OVER</span>}
            </div>
            <div className="bg-slate-900 p-1 border-4 border-slate-700 rounded-lg">
                {displayGrid.map((row, y) => (
                    <div key={y} className="flex">
                        {row.map((cell, x) => (
                            <div 
                                key={x} 
                                className={`w-6 h-6 border border-slate-800/20 
                                    ${cell === 0 ? 'bg-slate-800' : 
                                      cell === 1 ? 'bg-slate-400' : 
                                      activePiece?.color || 'bg-white'}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            
            {/* On-screen Controls for Tetris */}
            <div className="mt-6 w-full max-w-xs grid grid-cols-3 gap-3">
                <div className="col-start-1 flex justify-center">
                    <button 
                        onClick={() => move(-1, 0)} 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="col-start-2 flex justify-center">
                     <button 
                        onClick={rotate} 
                        className="bg-[#FF8FE9] hover:bg-[#ff76e5] text-white p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                        <RotateCw className="w-6 h-6" />
                    </button>
                </div>
                <div className="col-start-3 flex justify-center">
                    <button 
                        onClick={() => move(1, 0)} 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
                <div className="col-start-2 flex justify-center">
                    <button 
                        onClick={() => move(0, 1)} 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                        <ArrowDown className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="mt-4 text-xs text-slate-500 text-center">
                Usa los botones o el teclado para jugar.
            </div>

            {gameOver && (
                <button onClick={() => { setGrid(Array(TETRIS_ROWS).fill(Array(TETRIS_COLS).fill(0))); setScore(0); setGameOver(false); spawnPiece(); }} className="mt-4 bg-[#FF8FE9] text-white px-4 py-2 rounded font-bold">Reiniciar</button>
            )}
        </div>
    );
};

// --- PACMAN UTILS ---
const PACMAN_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,3,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,0,1,1,2,1,1,2,1],
    [1,2,2,2,2,1,0,0,0,1,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const PacmanGame = () => {
    const [grid, setGrid] = useState<number[][]>(JSON.parse(JSON.stringify(PACMAN_MAP)));
    const [pacman, setPacman] = useState({ x: 7, y: 5 });
    const [ghost, setGhost] = useState({ x: 7, y: 7 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const directionRef = useRef({ x: 0, y: 0 });

    const movePacman = () => {
        if (gameOver || win) return;
        
        const nextX = pacman.x + directionRef.current.x;
        const nextY = pacman.y + directionRef.current.y;

        if (grid[nextY] && grid[nextY][nextX] !== 1) {
            setPacman({ x: nextX, y: nextY });
            
            if (grid[nextY][nextX] === 2) {
                const newGrid = [...grid];
                newGrid[nextY] = [...newGrid[nextY]];
                newGrid[nextY][nextX] = 0;
                setGrid(newGrid);
                setScore(s => s + 10);
            }
        }
    };

    const moveGhost = () => {
        if (gameOver || win) return;
        const moves = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
        const validMoves = moves.filter(m => {
            const nx = ghost.x + m.x;
            const ny = ghost.y + m.y;
            return grid[ny] && grid[ny][nx] !== 1;
        });
        
        if (validMoves.length > 0) {
            const move = validMoves[Math.floor(Math.random() * validMoves.length)];
            setGhost(prev => ({ x: prev.x + move.x, y: prev.y + move.y }));
        }
    };

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            movePacman();
            moveGhost();
        }, 300);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [pacman, ghost, gameOver, win]);

    useEffect(() => {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            setGameOver(true);
        }
        let dots = 0;
        grid.forEach(row => row.forEach(cell => { if(cell===2) dots++ }));
        if (dots === 0) setWin(true);
    }, [pacman, ghost, grid]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if(e.key === 'ArrowUp') directionRef.current = {x:0, y:-1};
            if(e.key === 'ArrowDown') directionRef.current = {x:0, y:1};
            if(e.key === 'ArrowLeft') directionRef.current = {x:-1, y:0};
            if(e.key === 'ArrowRight') directionRef.current = {x:1, y:0};
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const setDirection = (x: number, y: number) => {
        directionRef.current = { x, y };
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 text-slate-800 font-bold">Score: {score}</div>
            {gameOver && <div className="text-red-500 font-bold mb-2">¡GAME OVER!</div>}
            {win && <div className="text-green-500 font-bold mb-2">¡GANASTE!</div>}
            
            <div className="bg-black p-2 rounded-lg">
                {grid.map((row, y) => (
                    <div key={y} className="flex">
                        {row.map((cell, x) => {
                            let content = null;
                            if (pacman.x === x && pacman.y === y) content = <div className="w-4 h-4 bg-yellow-400 rounded-full" />;
                            else if (ghost.x === x && ghost.y === y) content = <div className="w-4 h-4 bg-red-500 rounded-t-full" />;
                            else if (cell === 2) content = <div className="w-1.5 h-1.5 bg-pink-300 rounded-full" />;
                            
                            return (
                                <div key={x} className={`w-6 h-6 flex items-center justify-center ${cell === 1 ? 'bg-blue-900 border border-blue-800' : ''}`}>
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            {/* On-screen Controls for Pacman */}
            <div className="mt-6 flex flex-col items-center gap-2">
                <button 
                    onClick={() => setDirection(0, -1)} 
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setDirection(-1, 0)} 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={() => setDirection(0, 1)} 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                        <ArrowDown className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={() => setDirection(1, 0)} 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-4 rounded-xl shadow-sm active:translate-y-1 transition-all"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

             <button onClick={() => { 
                 setGrid(JSON.parse(JSON.stringify(PACMAN_MAP))); 
                 setPacman({x:7,y:5}); 
                 setGhost({x:7,y:7}); 
                 setScore(0); 
                 setGameOver(false); 
                 setWin(false);
                 directionRef.current = {x:0, y:0};
             }} className="mt-4 bg-[#FF8FE9] text-white px-4 py-2 rounded font-bold">Reiniciar</button>
        </div>
    );
};

// --- WORD SEARCH UTILS ---
const CAREER_WORDS_MAP = {
  "Ingeniería en TIC'S": ['JAVA', 'REACT', 'DATOS', 'REDES', 'NUBE', 'WEB'],
  "Ingeniería Industrial": ['CALIDAD', 'PROCESO', 'LEAN', 'SIGMA', 'PLANTA', 'NORMA'],
  "Licenciatura en Derecho": ['LEY', 'JUEZ', 'AMPARO', 'CIVIL', 'PENAL', 'JUSTICIA']
};

const GRID_SIZE = 10;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const WordSearchGame = () => {
    const [career, setCareer] = useState<keyof typeof CAREER_WORDS_MAP | null>(null);
    const [grid, setGrid] = useState<string[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selectedCells, setSelectedCells] = useState<{r:number, c:number}[]>([]);
    
    const generateGrid = useCallback(() => {
        if (!career) return;
        const words = CAREER_WORDS_MAP[career];
        const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
        
        let currentRow = 0;
        words.forEach(word => {
             if (currentRow < GRID_SIZE) {
                 // Simple horizontal placement
                 const startCol = Math.floor(Math.random() * (GRID_SIZE - word.length));
                 for(let i=0; i<word.length; i++) {
                     newGrid[currentRow][startCol + i] = word[i];
                 }
                 currentRow += Math.floor(Math.random() * 2) + 1; 
             }
        });
        
        // Fill empty
        for(let r=0; r<GRID_SIZE; r++) {
            for(let c=0; c<GRID_SIZE; c++) {
                if(newGrid[r][c] === '') newGrid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
            }
        }
        setGrid(newGrid);
        setFoundWords([]);
        setSelectedCells([]);
    }, [career]);

    useEffect(() => {
        if (career) {
            generateGrid();
        }
    }, [career, generateGrid]);

    const handleCellClick = (r: number, c: number) => {
        const alreadySelected = selectedCells.find(cell => cell.r === r && cell.c === c);
        let newSelection;
        if(alreadySelected) {
            newSelection = selectedCells.filter(cell => cell.r !== r || cell.c !== c);
        } else {
            newSelection = [...selectedCells, {r, c}];
        }
        setSelectedCells(newSelection);
        checkWord(newSelection);
    };

    const checkWord = (selection: {r:number, c:number}[]) => {
        if (!career) return;
        const sorted = [...selection].sort((a,b) => (a.r - b.r) || (a.c - b.c));
        const word = sorted.map(cell => grid[cell.r][cell.c]).join('');
        
        if (CAREER_WORDS_MAP[career].includes(word) && !foundWords.includes(word)) {
            setFoundWords(prev => [...prev, word]);
            setSelectedCells([]); 
        }
    };

    const isCellSelected = (r: number, c: number) => selectedCells.some(cell => cell.r === r && cell.c === c);
    
    if (!career) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Selecciona tu carrera:</h3>
                {Object.keys(CAREER_WORDS_MAP).map(c => (
                    <button 
                        key={c}
                        onClick={() => setCareer(c as keyof typeof CAREER_WORDS_MAP)}
                        className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl shadow-sm hover:bg-[#FF8FE9] hover:text-white transition-all w-full max-w-xs font-semibold"
                    >
                        {c}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
             <div className="flex justify-between w-full mb-4 px-2 items-center">
                <button onClick={() => setCareer(null)} className="text-xs text-slate-500 hover:text-[#FF8FE9] underline">Cambiar carrera</button>
                <span className="text-sm font-bold text-[#FF8FE9]">{career}</span>
             </div>

             <div className="flex flex-wrap justify-center gap-2 mb-4">
                 {CAREER_WORDS_MAP[career].map(w => (
                     <span key={w} className={`px-2 py-1 rounded text-xs font-bold ${foundWords.includes(w) ? 'bg-green-100 text-green-700 line-through' : 'bg-slate-100'}`}>
                         {w}
                     </span>
                 ))}
             </div>
             
             <div className="grid grid-cols-10 gap-1 bg-white p-2 rounded-lg border border-slate-200 shadow-sm select-none">
                 {grid.map((row, r) => (
                     row.map((char, c) => (
                         <button 
                            key={`${r}-${c}`}
                            onClick={() => handleCellClick(r, c)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-mono font-bold text-sm rounded transition-colors
                                ${isCellSelected(r, c) ? 'bg-[#FF8FE9] text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}
                            `}
                         >
                             {char}
                         </button>
                     ))
                 ))}
             </div>
             {foundWords.length === CAREER_WORDS_MAP[career].length && <div className="mt-4 text-green-600 font-bold text-xl animate-bounce">¡Felicidades!</div>}
             <button onClick={generateGrid} className="mt-6 flex items-center text-slate-500 hover:text-[#FF8FE9]">
                 <RefreshCw className="w-4 h-4 mr-2" /> Reiniciar
             </button>
        </div>
    );
};

// --- CROSSWORD UTILS ---
const CROSSWORD_DATA = {
    "Ingeniería en TIC'S": {
        width: 8, height: 8,
        words: [
            { word: "JAVA", clue: "Lenguaje de programación de alto nivel", start: {x: 0, y: 0}, dir: 'H' },
            { word: "JSON", clue: "Formato ligero de datos", start: {x: 0, y: 0}, dir: 'V' },
            { word: "NUBE", clue: "Servicios a través de Internet", start: {x: 3, y: 0}, dir: 'H' }
        ]
    },
    "Ingeniería Industrial": {
        width: 8, height: 8,
        words: [
            { word: "LEAN", clue: "Metodología de manufactura esbelta", start: {x: 0, y: 0}, dir: 'V' },
            { word: "LOTE", clue: "Cantidad de productos producidos", start: {x: 0, y: 0}, dir: 'H' },
            { word: "NORMA", clue: "Regla que se debe seguir", start: {x: 3, y: 0}, dir: 'H' }
        ]
    },
    "Licenciatura en Derecho": {
        width: 8, height: 8,
        words: [
            { word: "JUEZ", clue: "Autoridad pública que sirve en un tribunal", start: {x: 0, y: 0}, dir: 'V' },
            { word: "JUSTICIA", clue: "Principio moral de dar a cada uno lo que le corresponde", start: {x: 0, y: 0}, dir: 'H' },
            { word: "ZONA", clue: "Superficie acotada", start: {x: 3, y: 0}, dir: 'H' }
        ]
    }
};

const CrosswordGame = () => {
    const [career, setCareer] = useState<keyof typeof CROSSWORD_DATA | null>(null);
    const [gridValues, setGridValues] = useState<Record<string, string>>({});
    const [solved, setSolved] = useState(false);

    const handleInputChange = (x: number, y: number, val: string) => {
        if (val.length > 1) return;
        const key = `${x},${y}`;
        setGridValues(prev => ({...prev, [key]: val.toUpperCase()}));
    };

    const checkSolution = () => {
        if (!career) return;
        const data = CROSSWORD_DATA[career];
        let correct = true;
        
        data.words.forEach(w => {
            for(let i=0; i<w.word.length; i++) {
                const cx = w.dir === 'H' ? w.start.x + i : w.start.x;
                const cy = w.dir === 'H' ? w.start.y : w.start.y + i;
                const val = gridValues[`${cx},${cy}`];
                if (val !== w.word[i]) correct = false;
            }
        });
        
        if (correct) setSolved(true);
    };

    if (!career) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Selecciona tu carrera:</h3>
                {Object.keys(CROSSWORD_DATA).map(c => (
                    <button 
                        key={c}
                        onClick={() => { setCareer(c as any); setGridValues({}); setSolved(false); }}
                        className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl shadow-sm hover:bg-[#FF8FE9] hover:text-white transition-all w-full max-w-xs font-semibold"
                    >
                        {c}
                    </button>
                ))}
            </div>
        );
    }

    const data = CROSSWORD_DATA[career];
    // Build active cells map
    const activeCells = new Set<string>();
    data.words.forEach(w => {
        for(let i=0; i<w.word.length; i++) {
            const cx = w.dir === 'H' ? w.start.x + i : w.start.x;
            const cy = w.dir === 'H' ? w.start.y : w.start.y + i;
            activeCells.add(`${cx},${cy}`);
        }
    });

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-4 px-2 items-center">
                <button onClick={() => setCareer(null)} className="text-xs text-slate-500 hover:text-[#FF8FE9] underline">Cambiar carrera</button>
                <span className="text-sm font-bold text-[#FF8FE9]">{career}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Grid */}
                <div className="bg-slate-900 p-2 rounded-lg shadow-lg">
                    {Array.from({length: data.height}).map((_, y) => (
                        <div key={y} className="flex">
                            {Array.from({length: data.width}).map((_, x) => {
                                const isActive = activeCells.has(`${x},${y}`);
                                return (
                                    <div key={`${x}-${y}`} className={`w-8 h-8 sm:w-10 sm:h-10 border border-slate-700 ${isActive ? 'bg-white' : 'bg-slate-800'}`}>
                                        {isActive && (
                                            <input 
                                                type="text" 
                                                maxLength={1}
                                                className="w-full h-full text-center font-bold text-slate-900 uppercase focus:outline-none focus:bg-pink-50"
                                                value={gridValues[`${x},${y}`] || ''}
                                                onChange={(e) => handleInputChange(x, y, e.target.value)}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Clues */}
                <div className="max-w-xs">
                    <h4 className="font-bold text-slate-800 mb-2">Pistas:</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        {data.words.map((w, i) => (
                            <li key={i}>
                                <span className="font-bold text-[#FF8FE9]">{w.dir === 'H' ? 'Horiz' : 'Vert'}:</span> {w.clue}
                            </li>
                        ))}
                    </ul>
                    
                    <button 
                        onClick={checkSolution}
                        className="mt-6 w-full bg-[#FF8FE9] hover:bg-[#ff76e5] text-white font-bold py-2 rounded-lg transition-colors"
                    >
                        Verificar
                    </button>
                    {solved && <div className="mt-4 text-green-600 font-bold text-center flex items-center justify-center"><CheckCircle2 className="w-5 h-5 mr-1"/> ¡Correcto!</div>}
                </div>
            </div>
        </div>
    );
};

export const GamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('MENU');

  if (activeGame === 'MENU') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 mr-4 text-[#FF8FE9]" />
            Zona de Juegos
          </h2>
          <p className="text-slate-500 mt-3 text-lg">Relájate un momento entre clases con estos clásicos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tetris Card */}
            <div 
                onClick={() => setActiveGame('TETRIS')}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-slate-100 group text-center"
            >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF8FE9] transition-colors">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2.5 h-2.5 bg-purple-500"></div><div className="w-2.5 h-2.5 bg-purple-500"></div>
                        <div className="w-2.5 h-2.5 bg-purple-500"></div><div className="w-2.5 h-2.5 bg-transparent"></div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Tetris</h3>
                <p className="text-sm text-slate-500">El clásico de acomodar bloques.</p>
            </div>

            {/* Pacman Card */}
            <div 
                onClick={() => setActiveGame('PACMAN')}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-slate-100 group text-center"
            >
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF8FE9] transition-colors">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full relative">
                        <div className="absolute right-0 top-1/2 -mt-3 w-3 h-3 bg-yellow-100 transform rotate-45"></div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Pac-Man</h3>
                <p className="text-sm text-slate-500">Escapa de los fantasmas.</p>
            </div>

            {/* Word Search Card */}
            <div 
                onClick={() => setActiveGame('WORD_SEARCH')}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-slate-100 group text-center"
            >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF8FE9] transition-colors">
                    <span className="font-mono text-2xl font-bold text-blue-500 group-hover:text-white">ABC</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Sopa de Letras</h3>
                <p className="text-sm text-slate-500">Encuentra palabras de tu carrera.</p>
            </div>

            {/* Crossword Card */}
            <div 
                onClick={() => setActiveGame('CROSSWORD')}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-slate-100 group text-center"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF8FE9] transition-colors">
                    <LayoutGrid className="w-8 h-8 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Crucigrama</h3>
                <p className="text-sm text-slate-500">Desafía tu conocimiento académico.</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
            onClick={() => setActiveGame('MENU')}
            className="flex items-center text-slate-500 hover:text-[#FF8FE9] font-bold mb-8 transition-colors"
        >
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Menú
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 min-h-[500px] flex justify-center">
            {activeGame === 'TETRIS' && <TetrisGame />}
            {activeGame === 'PACMAN' && <PacmanGame />}
            {activeGame === 'WORD_SEARCH' && <WordSearchGame />}
            {activeGame === 'CROSSWORD' && <CrosswordGame />}
        </div>
    </div>
  );
};