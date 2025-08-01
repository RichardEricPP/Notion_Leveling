// --- main.js ---
// Punto de entrada principal de la aplicación.
// Configura los event listeners globales y arranca el juego.

// --- IMPORTS ---
import { player, loadPlayerDataFromLocalStorage, savePlayerDataToLocalStorage } from './player.js';
import { resetGame, setDifficultyAndStart, activateSkill, gameOver, gameStarted, keys } from './gameLogic.js';
import { 
    toggleInventory, handleInventoryInput, isInventoryOpen,
    toggleSkillMenu, handleSkillInput, isSkillMenuOpen,
    toggleEquipmentMenu, handleEquipmentInput, isEquipmentOpen,
    showMessage, difficultyScreen, gameCanvas, minimapCanvas, equipmentMenu, showDifficultyScreen, playMusic
} from './ui.js';

// --- MAIN EXECUTION ---

document.addEventListener('DOMContentLoaded', () => {
    
    loadPlayerDataFromLocalStorage();

    showDifficultyScreen();

    document.getElementById('btnFacil').addEventListener('click', () => { setDifficultyAndStart('facil'); playMusic('dungeon'); });
    document.getElementById('btnMedio').addEventListener('click', () => { setDifficultyAndStart('medio'); playMusic('dungeon'); });
    document.getElementById('btnDificil').addEventListener('click', () => { setDifficultyAndStart('dificil'); playMusic('dungeon'); });

    document.getElementById('btnGoToFloor').addEventListener('click', () => {
        const levelInputElement = document.getElementById('levelInput');
        const baseLevel = parseInt(levelInputElement.value);
        if (baseLevel >= 1) {
            setDifficultyAndStart('medio', 1, baseLevel); 
        } else {
            showMessage('Por favor ingresa un nivel base de 1 o superior.');
        }
    });

    document.getElementById('btnEquipment').addEventListener('click', toggleEquipmentMenu);
    
    document.getElementById('btnSaveEquipment').addEventListener('click', () => {
        savePlayerDataToLocalStorage();
        showMessage("¡Equipo guardado!");
    });

    document.getElementById('btnReturnToDifficulty').addEventListener('click', toggleEquipmentMenu);

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
                else if (isEquipmentOpen) handleEquipmentInput(e);
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