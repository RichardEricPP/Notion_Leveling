// --- player.js ---
// Contiene la definición del objeto `player` y todas las funciones que gestionan su estado.

// --- IMPORTS ---
import { gearList, skills, setBonuses } from './data.js';
import { showMessage } from './ui.js';

// --- EXPORTS ---

/**
 * El objeto principal que contiene todos los datos y el estado del jugador.
 */
export let player = {
    tileX: 1,
    tileY: 1,
    hp: 100,
    maxHp: 100,
    atk: 5, 
    def: 5, 
    spd: 4, 
    xp: 0,
    level: 1,
    skillPoints: 0,
    inventory: [], 
    equipped: { 
        helmet: null, 
        armor: null, 
        gloves: null, 
        boots: null, 
        weapon: null, 
        habilidad1: null, 
        habilidad2: null, 
        habilidad3: null  
    },
    unlockedSkills: [], 
    permanentlyLearnedSkills: [], 
    hasKey: false,
    facingDirection: 'right', 
    hitFrame: 0, 
    doorOpened: false, 
    lastHitTime: 0,
    invulnerabilityTime: 500,
    isAttacking: false,
    attackAnimFrame: 0,
    attackAnimDuration: 8, // Duración de la animación de ataque en frames
    attackLungeDistance: 10, // Distancia de la estocada durante el ataque
    attackDirectionX: 0,
    attackDirectionY: 0,
    skillUsageThisFloor: {},
    enemiesDefeatedThisRun: 0,
    isSlowed: false,
    slowEndTime: 0,
    potionsBoughtTotal: 0,
    isStealthed: false,
    stealthEndTime: 0, 
    nextHitCritical: false,
    isInvincible: false,
    invincibleEndTime: 0,
    isSpeedBoosted: false,
    speedBoostEndTime: 0,
    luckBoostEndTime: 0,
    secondWindUsedThisRun: false, 
    baseSpd: 4, 
    baseAtk: 5, 
    baseDef: 5, 
    criticalChanceBonus: 0.05,
    celestialBookCritCounter: 0, 
    hasMiniShield: false, 
    miniShieldHP: 0, 
    miniShieldMaxHP: 0, 
    miniShieldCooldownEnd: 0, 
    darkRayEnemiesDefeated: 0,
    hitsSinceLastSoulExtraction: 0,
    walkAnimFrame: 0,
    isMoving: false,
    walkAnimCounter: 0,
    walkAnimSpeed: 3 
};

/**
 * Almacena el nombre del conjunto de bonificación activo actualmente.
 */
export let activeSetBonusName = null;

/**
 * Guarda los datos clave del jugador en el Local Storage del navegador.
 */
export function savePlayerDataToLocalStorage() {
    const dataToSave = {
        hp: player.hp,
        maxHp: player.maxHp,
        atk: player.atk,
        def: player.def,
        spd: player.spd,
        xp: player.xp,
        level: player.level,
        skillPoints: player.skillPoints,
        inventory: player.inventory.map(item => ({ name: item.name, type: item.type })), 
        equipped: {}, 
        permanentlyLearnedSkills: player.permanentlyLearnedSkills,
        enemiesDefeatedThisRun: player.enemiesDefeatedThisRun,
        baseSpd: player.baseSpd,
        baseAtk: player.baseAtk,
        baseDef: player.baseDef,
        criticalChanceBonus: player.criticalChanceBonus,
        stealthActive: player.stealthActive, 
        stealthStatMultiplier: player.stealthStatMultiplier 
    };
    for (const slot in player.equipped) {
        if (player.equipped[slot]) {
            if (slot.startsWith('habilidad')) {
                dataToSave.equipped[slot] = player.equipped[slot]; 
            } else {
                dataToSave.equipped[slot] = { name: player.equipped[slot].name, type: player.equipped[slot].type };
            }
        } else {
            dataToSave.equipped[slot] = null;
        }
    }
    localStorage.setItem('dungeonCrawlerPlayerData', JSON.stringify(dataToSave));
}

/**
 * Carga los datos del jugador desde el Local Storage, o inicializa con valores por defecto.
 */
export function loadPlayerDataFromLocalStorage() {
    const storedData = localStorage.getItem('dungeonCrawlerPlayerData');
    if (storedData) {
        const loadedPlayer = JSON.parse(storedData);
        Object.assign(player, loadedPlayer);

        // Validate and load equipped items
        for (const slot in loadedPlayer.equipped) {
            if (slot.startsWith('habilidad')) {
                const skillExists = skills.some(s => s.name === loadedPlayer.equipped[slot]);
                player.equipped[slot] = skillExists ? loadedPlayer.equipped[slot] : null;
            } else if (loadedPlayer.equipped[slot]) {
                const fullItem = gearList.find(g => g.name === loadedPlayer.equipped[slot].name);
                player.equipped[slot] = fullItem || null;
            } else {
                player.equipped[slot] = null;
            }
        }

        // Validate and load inventory
        player.inventory = loadedPlayer.inventory
            .map(itemData => gearList.find(g => g.name === itemData.name))
            .filter(item => item !== undefined);

        // Validate permanently learned skills
        // Start with all initial skills
        let currentLearnedSkills = new Set(getInitialSkills());
        // Add skills from loaded data if they still exist
        loadedPlayer.permanentlyLearnedSkills.forEach(skillName => {
            if (skills.some(s => s.name === skillName)) {
                currentLearnedSkills.add(skillName);
            }
        });
        player.permanentlyLearnedSkills = Array.from(currentLearnedSkills);

        // If, after validation, no skills are equipped, set the default ones.
        if (!player.equipped.habilidad1 && !player.equipped.habilidad2 && !player.equipped.habilidad3) {
            const initialSkills = getInitialSkills();
            player.equipped.habilidad1 = initialSkills[0] || null;
            player.equipped.habilidad2 = initialSkills[1] || null;
            player.equipped.habilidad3 = initialSkills[2] || null;
        }

    } else {
        initializeNewPlayer();
    }
}

function initializeNewPlayer() {
    player.inventory = gearList.filter(item => item.type !== 'potion');
    
    // Equip initial gear
    player.equipped.weapon = gearList.find(g => g.name === 'Daga de Poder') || null;
    player.equipped.helmet = gearList.find(g => g.name === 'Casco de Hierro') || null;
    player.equipped.armor = gearList.find(g => g.name === 'Armadura de Hierro') || null;
    player.equipped.gloves = gearList.find(g => g.name === 'Guantes de Hierro') || null;
    player.equipped.boots = gearList.find(g => g.name === 'Botas de Hierro') || null;
    
    // Set initial skills
    const initialSkills = getInitialSkills();
    player.permanentlyLearnedSkills = initialSkills;
    player.equipped.habilidad1 = initialSkills[0] || null;
    player.equipped.habilidad2 = initialSkills[1] || null;
    player.equipped.habilidad3 = initialSkills[2] || null;
}

function getInitialSkills() {
    return ['Sigilo', 'Golpe Crítico', 'Regeneración', 'Segundo Aliento', 'Tormenta de Cuchillas'];
}

/**
 * Calcula y devuelve las bonificaciones de los conjuntos de equipo activos.
 */
export function applySetBonuses() {
    let currentFullSetDetected = null;
    const equippedSetCounts = {};
    const requiredSlotsForFullSet = ['helmet', 'armor', 'gloves', 'boots']; 

    requiredSlotsForFullSet.forEach(slot => {
        if (player.equipped[slot] && player.equipped[slot].set) {
            const setName = player.equipped[slot].set;
            equippedSetCounts[setName] = (equippedSetCounts[setName] || 0) + 1;
        }
    });

    for (const setName in equippedSetCounts) {
        if (equippedSetCounts[setName] === requiredSlotsForFullSet.length) {
            currentFullSetDetected = setName;
            break; 
        }
    }

    if (currentFullSetDetected && currentFullSetDetected !== activeSetBonusName) {
        const bonus = setBonuses[currentFullSetDetected];
        if (bonus) {
            showMessage(bonus.message);
        }
    }
    activeSetBonusName = currentFullSetDetected; 

    const bonusesToApply = {
        atk_flat: 0, def_flat: 0, maxHp_flat: 0, critical_flat: 0,
        atk_percent: 0, def_percent: 0, maxHp_percent: 0, spd_percent: 0, goldFind_percent: 0, xpGain_percent: 0
    };

    if (activeSetBonusName) {
        const bonus = setBonuses[activeSetBonusName];
        if (bonus) {
            if (bonus.atk_flat) bonusesToApply.atk_flat = bonus.atk_flat;
            if (bonus.def_flat) bonusesToApply.def_flat = bonus.def_flat;
            if (bonus.maxHp_flat) bonusesToApply.maxHp_flat = bonus.maxHp_flat;
            if (bonus.critical_flat) bonusesToApply.critical_flat = bonus.critical_flat;

            if (bonus.atk_percent) bonusesToApply.atk_percent = bonus.atk_percent;
            if (bonus.def_percent) bonusesToApply.def_percent = bonus.def_percent;
            if (bonus.maxHp_percent) bonusesToApply.maxHp_percent = bonus.maxHp_percent;
            if (bonus.spd_percent) bonusesToApply.spd_percent = bonus.spd_percent;
            if (bonus.goldFind_percent) bonusesToApply.goldFind_percent = bonus.goldFind_percent;
            if (bonus.xpGain_percent) bonusesToApply.xpGain_percent = bonus.xpGain_percent;
        }
    }
    return bonusesToApply;
}

/**
 * Recalcula todas las estadísticas del jugador basándose en el nivel, equipo y bonificaciones.
 */
export function updateStats() {
    player.atk = player.baseAtk + (player.level - 1) * 2; // +2 ATK per level
    player.def = player.baseDef + (player.level - 1) * 1; // +1 DEF per level
    player.spd = player.baseSpd; 
    player.maxHp = 100 + (player.level - 1) * 20;
    player.criticalChanceBonus = 0.05; // Reset critical chance to base

    const currentTime = Date.now();
    if (player.luckBoostEndTime && currentTime < player.luckBoostEndTime) {
        player.criticalChanceBonus += 0.25;
    }

    // Preserve passive skill states
    const currentFuryActive = player.furyActive;
    const currentSoulExtractionActive = player.soulExtractionActive;

    player.hasMiniShield = false;
    player.miniShieldHP = 0;
    player.miniShieldMaxHP = 0;

    for (const slot in player.equipped) {
        const item = player.equipped[slot];
        if (item && !slot.startsWith('habilidad')) {
            if (item.atk) player.atk += item.atk;
            if (item.def) player.def += item.def;
            if (item.spd) player.spd += item.spd * 0.2; 
            if (item.hp) player.maxHp += item.hp;
            if (item.critical) player.criticalChanceBonus += item.critical;
        }
    }

    const currentSetBonuses = applySetBonuses();

    player.atk += (currentSetBonuses.atk_flat || 0);
    player.def += (currentSetBonuses.def_flat || 0);
    player.maxHp += (currentSetBonuses.maxHp_flat || 0);
    player.criticalChanceBonus += (currentSetBonuses.critical_flat || 0);

    if (currentSetBonuses.atk_percent) player.atk *= (1 + currentSetBonuses.atk_percent);
    if (currentSetBonuses.def_percent) player.def *= (1 + currentSetBonuses.def_percent);
    if (currentSetBonuses.maxHp_percent) player.maxHp *= (1 + currentSetBonuses.maxHp_percent);
    if (currentSetBonuses.spd_percent) player.spd *= (1 + currentSetBonuses.spd_percent);

    if (player.isSpeedBoosted && currentTime < player.speedBoostEndTime) {
        player.spd *= 1.5; 
    }

    player.hp = Math.min(player.hp, player.maxHp);
    if (player.isSlowed && currentTime < player.slowEndTime) {
        player.spd *= 0.5;
    }

    player.hp = Math.min(player.hp, player.maxHp);
    
    // La llamada a loadSprites() se elimina de aquí para evitar dependencias circulares.
    // Debe ser llamada desde gameLogic.js después de llamar a updateStats().
}

/**
 * Comprueba si el jugador tiene suficiente XP para subir de nivel y aplica los cambios.
 */
export function checkLevelUp() {
    const xpNeeded = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500]; 
    while (player.level < xpNeeded.length && player.xp >= xpNeeded[player.level]) {
        player.level++; 
        player.skillPoints++;
        showMessage(`¡Subiste al Nivel ${player.level}!`);
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.10); 
    }
    updateStats(); 
}

export function createPlayerSprite(options = {}) {
    const { pose = 'idle', frame = 0 } = options;

    const finalSize = 70; // The desired final size
    const baseSize = 96;  // The size the drawing logic is based on

    const canvas = document.createElement('canvas');
    canvas.width = finalSize;
    canvas.height = finalSize;
    const ctx = canvas.getContext('2d');

    // Calculate the scale factor
    const scaleFactor = finalSize / baseSize;
    ctx.scale(scaleFactor, scaleFactor);

    // Paleta de colores
    const hairColor = '#1a1a1a';
    const skinColor = '#f2d3b8';
    const eyeColor = '#9400D3'; 
    const shirtColor = '#cccccc';
    const coatColor = '#2a2a2a';
    const pantsColor = '#222222';
    const shoesColor = '#111111';
    const facialDetailColor = '#4a2e2a';
    const armorColor = '#7f8c8d';
    const armorHighlightColor = '#bdc3c7';
    const armorShineColor = '#f0f0f0';
    const armorShadowColor = '#596263';

    // Parámetros de animación
    let leg1_X_offset = 0;
    let leg2_X_offset = 0;
    let body_Y_offset = 0;
    let arm1_Y_offset = 0;
    let arm2_Y_offset = 0;

    // ==========================================================================
    // INICIO: LÓGICA DE ANIMACIÓN DE CAMINAR Y BRAZOS
    // ==========================================================================
    if (pose === 'walk') {
        // --- Animación del Cuerpo y Piernas (8 fotogramas) ---
        const walkCycleBody = [0, 1, 2, 3, 2, 1, 0, 1]; // Rebote más suave
        const walkCycleLegs = [0, 4, 8, 4, 0, -4, -8, -4]; // Aumenta el recorrido de las piernas
        body_Y_offset = walkCycleBody[frame % 8];
        leg1_X_offset = walkCycleLegs[frame % 8];
        leg2_X_offset = walkCycleLegs[(frame + 4) % 8]; // Desfase de 4 fotogramas para la otra pierna

        // --- Animación de los Brazos al Caminar (8 fotogramas) ---
        const walkCycleArms = [0, -1, -2, -1, 0, 1, 2, 1]; // Movimiento de brazos más suave
        arm1_Y_offset = walkCycleArms[frame % 8];
        arm2_Y_offset = walkCycleArms[(frame + 4) % 8]; // Desfase para el brazo opuesto
    }


    const cx = baseSize / 2;
    const cy = baseSize / 2;

    // --- Dibujo del personaje ---
    ctx.clearRect(0, 0, baseSize, baseSize);

    // Piernas más cortas y anchas para una proporción cuadrada
    ctx.fillStyle = pantsColor;
    ctx.fillRect(cx - 14 + leg1_X_offset, cy + 22 + body_Y_offset, 12, 12);
    ctx.fillRect(cx + 2 + leg2_X_offset, cy + 22 + body_Y_offset, 12, 12);
    
    // Botas
    ctx.fillStyle = armorColor;
    ctx.fillRect(cx - 15 + leg1_X_offset, cy + 34 + body_Y_offset, 14, 10);
    ctx.fillRect(cx + 1 + leg2_X_offset, cy + 34 + body_Y_offset, 14, 10);
    ctx.fillStyle = armorHighlightColor;
    ctx.fillRect(cx - 15 + leg1_X_offset, cy + 34 + body_Y_offset, 14, 3);
    ctx.fillStyle = armorShineColor;
    ctx.fillRect(cx - 13 + leg1_X_offset, cy + 35 + body_Y_offset, 4, 1);

    // Torso más ancho y corto
    ctx.fillStyle = shirtColor;
    ctx.fillRect(cx - 18, cy - 8 + body_Y_offset, 36, 30);

    // Pechera ajustada
    ctx.fillStyle = armorShadowColor;
    ctx.fillRect(cx - 16, cy - 8 + body_Y_offset, 32, 30);
    ctx.fillStyle = armorColor;
    ctx.fillRect(cx - 14, cy - 7 + body_Y_offset, 28, 28);
    ctx.fillStyle = armorHighlightColor;
    ctx.fillRect(cx - 14, cy - 7 + body_Y_offset, 28, 4);
    ctx.fillStyle = armorShineColor;
    ctx.fillRect(cx - 12, cy - 6 + body_Y_offset, 5, 2);
    ctx.fillStyle = armorShadowColor;
    ctx.fillRect(cx - 4, cy + 3 + body_Y_offset, 8, 8);
    ctx.fillStyle = eyeColor; 
    ctx.fillRect(cx - 3, cy + 4 + body_Y_offset, 6, 6);
    
    // Brazos (piel)
    ctx.fillStyle = skinColor;
    ctx.fillRect(cx - 24, cy + body_Y_offset + arm1_Y_offset, 8, 13);
    ctx.fillRect(cx + 16, cy + body_Y_offset + arm2_Y_offset, 8, 13);
    
    // Guanteletes con detalles
    ctx.fillStyle = armorShadowColor;
    ctx.fillRect(cx - 27, cy + 12 + body_Y_offset + arm1_Y_offset, 14, 12);
    ctx.fillRect(cx + 13, cy + 12 + body_Y_offset + arm2_Y_offset, 14, 12);
    ctx.fillStyle = armorColor;
    ctx.fillRect(cx - 26, cy + 13 + body_Y_offset + arm1_Y_offset, 12, 10);
    ctx.fillRect(cx + 14, cy + 13 + body_Y_offset + arm2_Y_offset, 12, 10);
    ctx.fillStyle = armorHighlightColor;
    ctx.fillRect(cx - 26, cy + 13 + body_Y_offset + arm1_Y_offset, 12, 3);
    ctx.fillRect(cx + 14, cy + 13 + body_Y_offset + arm2_Y_offset, 12, 3);
    ctx.fillStyle = armorShineColor;
    ctx.fillRect(cx - 25, cy + 14 + body_Y_offset + arm1_Y_offset, 4, 1);
    ctx.fillRect(cx + 21, cy + 14 + body_Y_offset + arm2_Y_offset, 4, 1);

    // Hombreras con detalles
    ctx.fillStyle = armorShadowColor;
    ctx.fillRect(cx - 27, cy - 11 + body_Y_offset + arm1_Y_offset, 12, 16);
    ctx.fillRect(cx + 15, cy - 11 + body_Y_offset + arm2_Y_offset, 12, 16);
    ctx.fillStyle = armorColor;
    ctx.fillRect(cx - 26, cy - 10 + body_Y_offset + arm1_Y_offset, 10, 14);
    ctx.fillRect(cx + 16, cy - 10 + body_Y_offset + arm2_Y_offset, 10, 14);
    ctx.fillStyle = armorHighlightColor;
    ctx.fillRect(cx - 26, cy - 10 + body_Y_offset + arm1_Y_offset, 10, 3);
    ctx.fillRect(cx + 16, cy - 10 + body_Y_offset + arm2_Y_offset, 10, 3);
    ctx.fillStyle = armorShineColor;
    ctx.fillRect(cx - 25, cy - 9 + body_Y_offset + arm1_Y_offset, 4, 1);
    ctx.fillRect(cx + 21, cy - 9 + body_Y_offset + arm2_Y_offset, 4, 1);

    // Cabeza ajustada
    ctx.fillStyle = skinColor;
    ctx.fillRect(cx - 12, cy - 29 + body_Y_offset, 24, 22);

    // Ojos
    ctx.fillStyle = eyeColor;
    ctx.fillRect(cx - 7, cy - 23 + body_Y_offset, 4, 4);
    ctx.fillRect(cx + 3, cy - 23 + body_Y_offset, 4, 4);

    // Boca
    ctx.fillStyle = facialDetailColor;
    ctx.fillRect(cx - 2, cy - 14 + body_Y_offset, 4, 1);

    // Pelo
    ctx.fillStyle = hairColor;
            ctx.fillRect(cx - 16, cy - 36 + body_Y_offset, 32, 11);  
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 29 + body_Y_offset);
    ctx.lineTo(cx - 13, cy - 21 + body_Y_offset);
    ctx.lineTo(cx - 9, cy - 29 + body_Y_offset);
    ctx.lineTo(cx - 5, cy - 19 + body_Y_offset);
    ctx.lineTo(cx - 1, cy - 29 + body_Y_offset);
    ctx.lineTo(cx + 4, cy - 21 + body_Y_offset);
    ctx.lineTo(cx + 8, cy - 29 + body_Y_offset);
    ctx.lineTo(cx + 12, cy - 23 + body_Y_offset);
    ctx.lineTo(cx + 16, cy - 29 + body_Y_offset);
    ctx.closePath();
    ctx.fill();

    // Casco
    ctx.fillStyle = armorColor;
    ctx.fillRect(cx - 16, cy - 36 + body_Y_offset, 32, 7);
    ctx.fillRect(cx - 16, cy - 30 + body_Y_offset, 4, 15);
    ctx.fillRect(cx + 12, cy - 30 + body_Y_offset, 4, 15);
    ctx.fillStyle = armorHighlightColor;
    ctx.fillRect(cx - 16, cy - 36 + body_Y_offset, 32, 3);
    ctx.fillStyle = armorShineColor;
    ctx.fillRect(cx - 10, cy - 35 + body_Y_offset, 5, 1);

    return canvas.toDataURL();
}

export function createMinionSprite(playerImage) {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(playerImage, 0, 0);
    
    ctx.globalCompositeOperation = 'source-atop'; 
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    ctx.globalCompositeOperation = 'source-over'; 
    
    ctx.shadowColor = 'rgba(50, 50, 50, 0.7)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height); 
    ctx.shadowBlur = 0;
    return canvas.toDataURL();
}

export function updatePlayerStats() { /* TODO: Implement */ }
export function calculatePlayerDamage() { return player.atk; }
export function calculatePlayerDefense() { return player.def; }
export function calculatePlayerCritChance() { return 0; }
export function calculatePlayerCritDamage() { return 0; }
export function calculatePlayerAttackSpeed() { return 0; }
export function calculatePlayerMovementSpeed() { return player.spd; }
export function calculatePlayerMaxHealth() { return player.maxHp; }
export function calculatePlayerHealthRegen() { return 0; }
export function calculatePlayerGoldFind() { return 0; }
export function calculatePlayerXPBonus() { return 0; }
export function calculatePlayerPotionEffectiveness() { return 0; }
export function calculatePlayerSkillCooldownReduction() { return 0; }
export function calculatePlayerSkillDamageBonus() { return 0; }
export function calculatePlayerSkillDurationBonus() { return 0; }
export function calculatePlayerSkillRangeBonus() { return 0; }
export function calculatePlayerSkillAreaBonus() { return 0; }
export function calculatePlayerSkillResourceCostReduction() { return 0; }
export function calculatePlayerSkillResourceGenerationBonus() { return 0; }
export function calculatePlayerSkillCastSpeed() { return 0; }
export function calculatePlayerSkillCritChance() { return 0; }
export function calculatePlayerSkillCritDamage() { return 0; }
export function calculatePlayerSkillEffectDuration() { return 0; }
export function calculatePlayerSkillEffectArea() { return 0; }
export function calculatePlayerSkillEffectRange() { return 0; }
export function calculatePlayerSkillEffectPower() { return 0; }
export function calculatePlayerSkillEffectResourceCost() { return 0; }
export function calculatePlayerSkillEffectResourceGeneration() { return 0; }
export function calculatePlayerSkillEffectCastSpeed() { return 0; }
export function calculatePlayerSkillEffectCritChance() { return 0; }
export function calculatePlayerSkillEffectCritDamage() { return 0; }
export function calculatePlayerSkillEffectDurationBonus() { return 0; }
export function calculatePlayerSkillEffectAreaBonus() { return 0; }
export function calculatePlayerSkillEffectRangeBonus() { return 0; }
export function calculatePlayerSkillEffectPowerBonus() { return 0; }
export function calculatePlayerSkillEffectResourceCostReductionBonus() { return 0; }
export function calculatePlayerSkillEffectResourceGenerationBonus() { return 0; }
export function calculatePlayerSkillEffectCastSpeedBonus() { return 0; }
export function calculatePlayerSkillEffectCritChanceBonus() { return 0; }
export function calculatePlayerSkillEffectCritDamageBonus() { return 0; }