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
    attackAnimDuration: 7, 
    attackLungeDistance: 12.5, // 50 / 4 (tileSize / 4)
    skillUsageThisFloor: {},
    enemiesDefeatedThisRun: 0,
    isSlowed: false,
    slowEndTime: 0,
    potionsBoughtTotal: 0,
    isStealthed: false,
    stealthEndTime: 0,
    stealthActive: false, 
    stealthStatMultiplier: 1.0, 
    nextHitCritical: false,
    isInvincible: false,
    invincibleEndTime: 0,
    isSpeedBoosted: false,
    speedBoostEndTime: 0,
    luckBoostEndTime: 0,
    soulExtractionActive: false,
    furyActive: false, 
    baseSpd: 4, 
    baseAtk: 5, 
    baseDef: 5, 
    criticalChanceBonus: 0.05,
    celestialBookCritCounter: 0, 
    hasMiniShield: false, 
    miniShieldHP: 0, 
    miniShieldMaxHP: 0, 
    miniShieldCooldownEnd: 0, 
    darkRayEnemiesDefeated: 0 
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
        const validSkills = loadedPlayer.permanentlyLearnedSkills.filter(skillName => 
            skills.some(s => s.name === skillName)
        );
        player.permanentlyLearnedSkills = validSkills.length > 0 ? validSkills : getInitialSkills();

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
    return ['Sigilo', 'Golpe Crítico', 'Regeneración'];
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
    player.atk = player.baseAtk;
    player.def = player.baseDef;
    player.spd = player.baseSpd; 
    player.maxHp = 100 + (player.level - 1) * 20;
     

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

    const currentTime = Date.now();
    if (player.isSpeedBoosted && currentTime < player.speedBoostEndTime) {
        player.spd *= 1.5; 
    }
    if (player.furyActive && player.hp <= player.maxHp * 0.25) {
        player.atk *= 2;
    }
    if (player.stealthActive && currentTime < player.stealthEndTime) {
        player.atk = Math.floor(player.atk * player.stealthStatMultiplier);
        player.def = Math.floor(player.def * player.stealthStatMultiplier);
        player.spd = player.spd * player.stealthStatMultiplier;
    }
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
        player.hp = player.maxHp; 
    }
    updateStats(); 
}

/**
 * Crea dinámicamente el sprite del jugador como una imagen Data URL, basándose en el equipo actual.
 * @returns {string} La imagen del sprite del jugador como Data URL.
 */
export function createPlayerSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const setColors = {
        'Hierro': { main: '#607d8b', detail: '#b0bec5' },
        'Caballero': { main: '#b71c1c', detail: '#ef9a9a' },
        'Demonio': { main: '#1a237e', detail: '#ffd700' },
        'León': { main: '#4A2F1B', detail: '#FFD700' }, 
        'Asesinato': { main: '#006064', detail: '#9c27b0' },
        'Noble': { main: '#212121', detail: '#ffd700' },
        'Mago': { main: '#eceff1', detail: '#ffd700' }
    };

    const defaultPartColors = {
        body: '#2c3e50',
        helmet: '#1a252f', 
        arm: '#2c3e50', 
        leg: '#2c3e50', 
        detail: '#7f8c8d', 
        skin: '#ffd29c',
        eyes: '#000'
    };

    let currentFullSetDetected = null;
    const fullSetPieces = ['helmet', 'armor', 'gloves', 'boots']; 
    const equippedSetNames = [];

    fullSetPieces.forEach(slot => {
        if (player.equipped[slot] && player.equipped[slot].set) {
            equippedSetNames.push(player.equipped[slot].set);
        }
    });

    if (equippedSetNames.length === fullSetPieces.length && new Set(equippedSetNames).size === 1) {
        currentFullSetDetected = equippedSetNames[0];
    }

    let torsoColor = defaultPartColors.body;
    let headColor = defaultPartColors.helmet;
    let armColor = defaultPartColors.arm;
    let legColor = defaultPartColors.leg;
    let detailColor = defaultPartColors.detail;
    let drawHood = true;

    if (currentFullSetDetected) {
        const set = setColors[currentFullSetDetected];
        torsoColor = set.main;
        headColor = set.main; 
        armColor = set.main;
        legColor = set.main;
        detailColor = set.detail;
        drawHood = false;
    } else {
        if (player.equipped.armor && player.equipped.armor.set) {
            torsoColor = setColors[player.equipped.armor.set].main;
            detailColor = setColors[player.equipped.armor.set].detail; 
        }
        if (player.equipped.helmet && player.equipped.helmet.set) {
            headColor = setColors[player.equipped.helmet.set].main;
            drawHood = false; 
        }
        if (player.equipped.gloves && player.equipped.gloves.set) {
            armColor = setColors[player.equipped.gloves.set].main;
        }
        if (player.equipped.boots && player.equipped.boots.set) {
            legColor = setColors[player.equipped.boots.set].main;
        }
    }
    
    ctx.fillStyle = torsoColor; 
    ctx.fillRect(16, 16, 32, 32); 

    if (drawHood) {
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.moveTo(20, 20); ctx.lineTo(18, 10); ctx.lineTo(46, 10); 
        ctx.lineTo(44, 20); ctx.lineTo(38, 22); ctx.lineTo(32, 24); 
        ctx.lineTo(26, 22); ctx.closePath(); ctx.fill();
        ctx.fillStyle = defaultPartColors.skin;
        ctx.fillRect(26, 13, 12, 7); 
        ctx.fillStyle = defaultPartColors.eyes;
        ctx.fillRect(28, 15, 2, 2); 
        ctx.fillRect(34, 15, 2, 2); 
    } else { 
        ctx.fillStyle = headColor;
        ctx.fillRect(20, 8, 24, 12); 
        ctx.fillStyle = detailColor;
        ctx.fillRect(22, 10, 20, 2); 
        ctx.fillStyle = defaultPartColors.skin;
        ctx.fillRect(24, 12, 16, 8); 
        ctx.fillStyle = defaultPartColors.eyes;
        ctx.fillRect(28, 14, 2, 2); ctx.fillRect(34, 14, 2, 2);
    }
    
    ctx.fillStyle = armColor;
    ctx.fillRect(8, 24, 10, 16); 
    ctx.strokeStyle = detailColor;
    ctx.lineWidth = 2; 
    ctx.strokeRect(8, 24, 10, 16);

    ctx.fillStyle = legColor;
    ctx.fillRect(20, 48, 10, 12); ctx.fillRect(34, 48, 10, 12); 
    ctx.fillStyle = detailColor;
    ctx.fillRect(20, 52, 10, 2); ctx.fillRect(34, 52, 10, 2);
    if (player.equipped.weapon) {
        switch (player.equipped.weapon.name) {
            case 'Daga de Poder': 
                ctx.fillStyle = '#333';
                ctx.fillRect(48, 20, 4, 12);
                ctx.fillStyle = '#ADD8E6';
                ctx.beginPath();
                ctx.moveTo(50, 12);
                ctx.lineTo(46, 20);
                ctx.lineTo(54, 20);
                ctx.closePath();
                ctx.fill();
                break;
            case 'Maza de Guerra': 
                ctx.fillStyle = '#8B4513'; ctx.fillRect(48, 16, 4, 16);
                ctx.fillStyle = '#50C878';
                ctx.beginPath(); ctx.arc(50, 14, 8, 0, Math.PI * 2); ctx.fill(); 
                ctx.fillStyle = '#FFD700';
                ctx.beginPath(); ctx.arc(50, 14, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#408040';
                ctx.beginPath(); ctx.moveTo(46, 8); ctx.lineTo(50, 2); ctx.lineTo(54, 8); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(46, 20); ctx.lineTo(50, 26); ctx.lineTo(54, 20); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(42, 14); ctx.lineTo(48, 10); ctx.lineTo(48, 18); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(58, 14); ctx.lineTo(52, 10); ctx.lineTo(52, 18); ctx.closePath(); ctx.fill();
                break;
            case 'Espada de Luz': 
                ctx.fillStyle = '#ADD8E6'; ctx.fillRect(48, 16, 14, 6);
                ctx.fillStyle = '#FFFFFF'; ctx.fillRect(46, 20, 18, 2);
                ctx.fillStyle = '#4682B4'; ctx.fillRect(44, 22, 6, 8);
                break;
            case 'Libro Celestial': 
                ctx.fillStyle = '#D3D3D3'; ctx.fillRect(48, 16, 12, 16);
                ctx.fillStyle = '#FFD700'; ctx.fillRect(46, 18, 2, 12);
                ctx.fillStyle = '#FFD700'; ctx.fillRect(58, 18, 2, 12);
                ctx.fillStyle = '#FFFFFF'; ctx.font = '10px Arial'; ctx.fillText('L', 52, 26);
                break;
            case 'Rayo de Oscuridad':
                ctx.fillStyle = '#8A2BE2'; ctx.fillRect(48, 18, 16, 6);
                ctx.fillStyle = '#4B0082'; ctx.fillRect(44, 16, 6, 10);
                const darkGlow = ctx.createRadialGradient(56, 21, 2, 56, 21, 15);
                darkGlow.addColorStop(0, 'rgba(138, 43, 226, 0.8)'); 
                darkGlow.addColorStop(0.5, 'rgba(75, 0, 130, 0.5)');
                darkGlow.addColorStop(1, 'rgba(75, 0, 130, 0)');
                ctx.fillStyle = darkGlow; ctx.fillRect(38, 10, 36, 22); 
                break;
            case 'Arco del Bosque':
                ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(50, 25, 10, Math.PI * 0.7, Math.PI * 1.3, true); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(50, 15); ctx.lineTo(50, 35); ctx.stroke();
                ctx.fillStyle = '#228B22'; ctx.beginPath(); ctx.arc(50, 15, 3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(50, 35, 3, 0, Math.PI * 2); ctx.fill();
                break;
            case 'Guadaña Helada':
                ctx.fillStyle = '#A9A9A9'; ctx.fillRect(48, 16, 4, 16);
                ctx.fillStyle = '#87CEEB'; ctx.beginPath(); ctx.moveTo(52, 16); ctx.lineTo(60, 12); ctx.lineTo(60, 24); ctx.lineTo(52, 28); ctx.fill();
                break;
            case 'Escudo Colosal':
                ctx.fillStyle = '#87CEEB'; ctx.fillRect(35, 10, 25, 25);
                ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(47.5, 22.5, 7, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#36454F'; ctx.lineWidth = 2; ctx.strokeRect(35, 10, 25, 25);
                break;
            default: ctx.fillStyle = '#d0d0d0'; ctx.fillRect(48, 20, 12, 4); ctx.fillStyle = '#ffd700'; ctx.fillRect(44, 18, 6, 8);
        }
    } else { ctx.fillStyle = '#d0d0d0'; ctx.fillRect(48, 20, 12, 4); ctx.fillStyle = '#ffd700'; ctx.fillRect(44, 18, 6, 8); }
    
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1; 
    ctx.strokeRect(16, 16, 32, 32);
    ctx.strokeRect(20, 8, 24, 12);
    ctx.strokeRect(20, 48, 10, 12);
    ctx.strokeRect(34, 48, 10, 12);
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