// --- main.js ---
// Punto de entrada principal de la aplicación.
// Configura los event listeners globales y arranca el juego.

// --- IMPORTS ---
import { player, loadPlayerDataFromLocalStorage, savePlayerDataToLocalStorage, updateStats } from './player.js';
import { resetGame, setDifficultyAndStart, activateSkill, gameOver, gameStarted, keys } from './gameLogic.js';
import { 
    toggleInventory, handleInventoryInput, isInventoryOpen,
    toggleSkillMenu, handleSkillInput, isSkillMenuOpen,
    toggleEquipmentMenu, isEquipmentOpen,
    showMessage, difficultyScreen, gameCanvas, minimapCanvas, equipmentMenu, showDifficultyScreen, playMusic
} from './ui.js';
import { createEquipoHTML, character, items } from './equipo.js';
import { todosLosMapas } from './maps/index.js';
import { allItems } from './data.js';

// --- MAIN EXECUTION ---

document.addEventListener('DOMContentLoaded', () => {
    
    const mapSelectionScreen = document.getElementById('mapSelectionScreen');
    const mapList = document.getElementById('mapList');
    const btnSelectMap = document.getElementById('btnSelectMap');
    const btnReturnToDifficultyFromMapSelection = document.getElementById('btnReturnToDifficultyFromMapSelection');

    loadPlayerDataFromLocalStorage();

    showDifficultyScreen();

    const equipmentContainer = createEquipoHTML(toggleEquipmentMenu, () => {
        const equippedItemKeys = {
            helmet: character.equipped.helmet,
            armor: character.equipped.armor,
            gloves: character.equipped.gloves,
            boots: character.equipped.boots,
            weapon: character.equipped.weapon,
        };

        const findItemByName = (slot, key) => {
            if (!key || key === 'none') return null;
            const itemName = items[slot][key]?.text;
            if (!itemName) return null;
            return allItems.find(item => item.name === itemName) || null;
        };

        player.equipped.helmet = findItemByName('helmet', equippedItemKeys.helmet);
        player.equipped.armor = findItemByName('armor', equippedItemKeys.armor);
        player.equipped.gloves = findItemByName('gloves', equippedItemKeys.gloves);
        player.equipped.boots = findItemByName('boots', equippedItemKeys.boots);
        player.equipped.weapon = findItemByName('weapon', equippedItemKeys.weapon);

        player.equipped.habilidad1 = character.selectedSkills[0] || null;
        player.equipped.habilidad2 = character.selectedSkills[1] || null;
        player.equipped.habilidad3 = character.selectedSkills[2] || null;
        
        updateStats();
        savePlayerDataToLocalStorage();
        showMessage("¡Equipo guardado!");
    });
    equipmentMenu.appendChild(equipmentContainer);

    const startGame = (difficulty, mapId) => {
        const levelInput = document.getElementById('levelInput');
        const baseLevel = parseInt(levelInput.value, 10) || 1;
        const startFloor = parseInt(floorInput.value, 10) || 1;
        setDifficultyAndStart(difficulty, startFloor, baseLevel, mapId);
        playMusic('dungeon');
    }

    // Populate map list
    for (const mapId in todosLosMapas) {
        const map = todosLosMapas[mapId];
        const mapButton = document.createElement('button');
        mapButton.textContent = map.nombre;
        mapButton.addEventListener('click', () => {
            mapSelectionScreen.style.display = 'none';
            difficultyScreen.style.display = 'flex';
            // This is a placeholder for difficulty selection for the chosen map
            startGame('facil', mapId);
        });
        mapList.appendChild(mapButton);
    }

    document.getElementById('btnFacil').addEventListener('click', () => startGame('facil', 1));
    document.getElementById('btnMedio').addEventListener('click', () => startGame('medio', 1));
    document.getElementById('btnDificil').addEventListener('click', () => startGame('dificil', 1));

    document.getElementById('btnEquipment').addEventListener('click', toggleEquipmentMenu);

    btnSelectMap.addEventListener('click', () => {
        difficultyScreen.style.display = 'none';
        mapSelectionScreen.style.display = 'block';
    });

    btnReturnToDifficultyFromMapSelection.addEventListener('click', () => {
        mapSelectionScreen.style.display = 'none';
        difficultyScreen.style.display = 'flex';
    });
    
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