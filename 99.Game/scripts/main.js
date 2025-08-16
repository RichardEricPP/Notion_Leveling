// --- main.js ---
// Punto de entrada principal de la aplicación.
// Configura los event listeners globales y arranca el juego.

// --- IMPORTS ---
import { player, loadPlayerDataFromLocalStorage, savePlayerDataToLocalStorage } from './player.js';
import { resetGame, setDifficultyAndStart, activateSkill, gameOver, gameStarted, keys } from './gameLogic.js';
import { 
    toggleInventory, handleInventoryInput, isInventoryOpen,
    toggleSkillMenu, handleSkillInput, isSkillMenuOpen,
    toggleEquipmentMenu, isEquipmentOpen,
    showMessage, difficultyScreen, gameCanvas, minimapCanvas, equipmentMenu, showDifficultyScreen, playMusic
} from './ui.js';
import { createEquipoHTML } from './equipo.js';

// --- MAIN EXECUTION ---

document.addEventListener('DOMContentLoaded', () => {
    
    loadPlayerDataFromLocalStorage();

    showDifficultyScreen();

    const equipmentContainer = createEquipoHTML(toggleEquipmentMenu, () => {
        savePlayerDataToLocalStorage();
        showMessage("¡Equipo guardado!");
    });
    equipmentMenu.appendChild(equipmentContainer);

    const startGame = (difficulty) => {
        const levelInput = document.getElementById('levelInput');
        const baseLevel = parseInt(levelInput.value, 10) || 1;
        const floorInput = document.getElementById('floorInput');
        const startFloor = parseInt(floorInput.value, 10) || 1;
        setDifficultyAndStart(difficulty, startFloor, baseLevel);
        playMusic('dungeon');
    }

    document.getElementById('btnFacil').addEventListener('click', () => startGame('facil'));
    document.getElementById('btnMedio').addEventListener('click', () => startGame('medio'));
    document.getElementById('btnDificil').addEventListener('click', () => startGame('dificil'));

    document.getElementById('btnEquipment').addEventListener('click', toggleEquipmentMenu);
    
    document.addEventListener('keydown', (e) => {
        if (gameOver) {
            if (e.code === 'KeyR') {
                resetGame();
                showDifficultyScreen();
            }
            return;
        }

        if (isInventoryOpen || isSkillMenuOpen || isEquipmentOpen) {
            if (e.code === 'KeyI' || e.code === 'KeyY' || e.code === 'KeyO' || e.code === 'Escape' ||
                e.code.startsWith('Arrow') || e.code === 'Enter') {
                e.preventDefault(); 
                if (isInventoryOpen) handleInventoryInput(e);
                else if (isSkillMenuOpen) handleSkillInput(e);
            }
            return; 
        }

        if (e.code === 'KeyI') { toggleInventory(); e.preventDefault(); return; }
        if (e.code === 'KeyY') { toggleSkillMenu(); e.preventDefault(); return; }
        

        if (!gameStarted) return;
        
        if (e.code === 'Digit1' && player.equipped.habilidad1) {
            activateSkill(player.equipped.habilidad1);
            e.preventDefault();
            return;
        }
        if (e.code === 'Digit2' && player.equipped.habilidad2) {
            activateSkill(player.equipped.habilidad2);
            e.preventDefault();
            return;
        }
        if (e.code === 'Digit3' && player.equipped.habilidad3) {
            activateSkill(player.equipped.habilidad3);
            e.preventDefault();
            return;
        }

        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
            if (e.code.startsWith('Arrow') || e.code === 'Space' || ['KeyA', 'KeyD', 'KeyW', 'KeyS'].includes(e.code)) {
                e.preventDefault();
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });
});

// --- GLOBAL FUNCTIONS ---

window.addEventListener('beforeunload', savePlayerDataToLocalStorage);