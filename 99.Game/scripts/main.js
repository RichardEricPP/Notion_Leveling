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

    let selectedMapId = 1;
    let currentMapIndex = 0;

    const mapBackground = document.getElementById('mapBackground');
    const prevMapBtn = document.getElementById('prevMap');
    const nextMapBtn = document.getElementById('nextMap');

    // Populate map list
    for (const mapId in todosLosMapas) {
        const map = todosLosMapas[mapId];
        const mapButton = document.createElement('button');
        mapButton.textContent = map.nombre;
        mapButton.dataset.mapId = mapId;
        mapButton.addEventListener('click', () => {
            selectedMapId = mapId;
            mapSelectionScreen.style.display = 'none';
            difficultyScreen.style.display = 'flex';
        });
        mapList.appendChild(mapButton);
    }

    const mapButtons = mapList.querySelectorAll('button');
    const numMaps = mapButtons.length;
    const angle = 360 / numMaps;
    const radius = 350; // Adjust as needed

    function updateMapSelection() {
        const rotateY = -currentMapIndex * angle;
        mapList.style.transform = `rotateY(${rotateY}deg)`;

        mapButtons.forEach((button, index) => {
            const buttonAngle = index * angle;
            button.style.transform = `rotateY(${buttonAngle}deg) translateZ(${radius}px)`;
            if (index === currentMapIndex) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        const mapIds = Object.keys(todosLosMapas);
        const mapId = mapIds[currentMapIndex];
        const map = todosLosMapas[mapId];
        
        mapBackground.style.backgroundImage = `url(${map.background})`;
        
        selectedMapId = mapId;
        const floorInput = document.getElementById('floorInput');
        floorInput.max = map.maxFloors;
        floorInput.value = 1;
    }

    prevMapBtn.addEventListener('click', () => {
        currentMapIndex = (currentMapIndex - 1 + numMaps) % numMaps;
        updateMapSelection();
    });

    nextMapBtn.addEventListener('click', () => {
        currentMapIndex = (currentMapIndex + 1) % numMaps;
        updateMapSelection();
    });

    updateMapSelection();

    document.getElementById('btnFacil').addEventListener('click', () => startGame('facil', selectedMapId));
    document.getElementById('btnMedio').addEventListener('click', () => startGame('medio', selectedMapId));
    document.getElementById('btnDificil').addEventListener('click', () => startGame('dificil', selectedMapId));

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