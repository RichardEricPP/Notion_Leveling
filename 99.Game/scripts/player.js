// --- player.js ---
// Contiene la definición del objeto `player` y todas las funciones que gestionan su estado.

// --- IMPORTS ---
import { allItems, skills, setBonuses } from './data.js';
import { showMessage } from './ui.js';
import { items } from './equipo.js';

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
    evasion: 0,
    attackSpeedBonus: 0,
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
    lightSwordAttackCount: 0, // Contador de ataques para la Espada de Luz
    isLightSwordSpeedBoosted: false, // Estado de la bonificación de velocidad de la Espada de Luz
    lightSwordSpeedBoostEndTime: 0, // Tiempo de finalización de la bonificación de velocidad
    lightSwordAttackSpeedMultiplier: 1.0, // Multiplicador de velocidad de ataque de la Espada de Luz
    walkAnimFrame: 0,
    isMoving: false,
    walkAnimCounter: 0,
    walkAnimSpeed: 3,
    passiveSkill: null,
    lastRegenTime: 0,
    lastInvinciblePassiveTime: 0
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
        stealthStatMultiplier: player.stealthStatMultiplier,
        passiveSkill: player.passiveSkill
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
 * Obtiene la habilidad inicial según el sprite/personaje seleccionado.
 */
export function getCharacterSkill(frame) {
    const frameKey = (frame || '').toLowerCase();
    if (frameKey.includes('1.png')) return 'summon';       // Sung Jin-woo -> Monarch's Domain -> summon
    if (frameKey.includes('2.png')) return 'regeneration'; // Lee Joohee -> Divine Healing -> regeneration
    if (frameKey.includes('3.png')) return 'invincible';   // Yoo Jin-ho -> Novice Slash -> invincible
    if (frameKey.includes('4.png')) return 'blade_storm';  // Choi Jong-in -> Blazing Inferno -> blade_storm
    if (frameKey.includes('5.png')) return 'speed';        // Esil Radiru -> Demon Dash -> speed
    if (frameKey.includes('6.png')) return 'critical_hit'; // Baek Yoonho -> White Tiger Transformation -> critical_hit
    return null;
}

/**
 * Traduce y personaliza dinámicamente los nombres y descripciones de las habilidades según el personaje elegido.
 */
export function updateSkillNamesBasedOnCharacter(selectedFrame) {
    const frameKey = (selectedFrame || '').toLowerCase();
    
    // Buscar cada habilidad y reestablecer sus valores por defecto en español
    const summonSkill = skills.find(s => s.key === 'summon');
    const regenSkill = skills.find(s => s.key === 'regeneration');
    const invincibleSkill = skills.find(s => s.key === 'invincible');
    const bladeStormSkill = skills.find(s => s.key === 'blade_storm');
    const speedSkill = skills.find(s => s.key === 'speed');
    const critSkill = skills.find(s => s.key === 'critical_hit');

    if (summonSkill) {
        summonSkill.name = 'Invocar';
        summonSkill.effect = 'Manifiesta un súbdito leal con el 75% de tus estadísticas.';
    }
    if (regenSkill) {
        regenSkill.name = 'Regeneración';
        regenSkill.effect = 'Restaura el 75% de tu salud máxima al instante.';
    }
    if (invincibleSkill) {
        invincibleSkill.name = 'Invencible';
        invincibleSkill.effect = 'Te vuelves inmune a todo daño durante 3.5 segundos.';
    }
    if (bladeStormSkill) {
        bladeStormSkill.name = 'Tormenta de Cuchillas';
        bladeStormSkill.effect = 'Lanzas cuchillos en todas las direcciones. Daño: 50% del ataque base por cuchillo.';
    }
    if (speedSkill) {
        speedSkill.name = 'Velocidad';
        speedSkill.effect = 'Incrementa tu velocidad de movimiento en un 50% durante 10 segundos.';
    }
    if (critSkill) {
        critSkill.name = 'Golpe Crítico';
        critSkill.effect = 'El siguiente golpe que asestes será un 100% más devastador.';
    }

    // Reestablecer en equipo.js
    if (items && items.skills) {
        if (items.skills.summon) {
            items.skills.summon.text = 'Invocar';
            items.skills.summon.description = 'Manifiesta un súbdito leal con el 75% de tus estadísticas.';
        }
        if (items.skills.regeneration) {
            items.skills.regeneration.text = 'Regeneración';
            items.skills.regeneration.description = 'Restaura el 75% de tu salud máxima al instante.';
        }
        if (items.skills.invincible) {
            items.skills.invincible.text = 'Invencible';
            items.skills.invincible.description = 'Te vuelves inmune a todo daño durante 4 segundos.';
        }
        if (items.skills.blade_storm) {
            items.skills.blade_storm.text = 'Tormenta de Cuchillas';
            items.skills.blade_storm.description = 'Lanzas cuchillos en todas las direcciones. Daño: 50% del ataque base por cuchillo.';
        }
        if (items.skills.speed) {
            items.skills.speed.text = 'Velocidad';
            items.skills.speed.description = 'Incrementa tu velocidad de movimiento en un 25% durante 10 segundos.';
        }
        if (items.skills.critical_hit) {
            items.skills.critical_hit.text = 'Golpe Crítico';
            items.skills.critical_hit.description = 'El siguiente golpe que asestes será un 100% más devastador.';
        }
    }

    // Aplicar personalización según el personaje seleccionado
    if (frameKey.includes('1.png')) { // Sung Jin-woo -> Dominio del Monarca
        if (summonSkill) {
            summonSkill.name = "Dominio del Monarca";
            summonSkill.effect = "Reanima enemigos derrotados como soldados de las sombras leales.";
        }
        if (items && items.skills && items.skills.summon) {
            items.skills.summon.text = "Dominio del Monarca";
            items.skills.summon.description = "Reanima enemigos derrotados como soldados de las sombras leales.";
        }
    } else if (frameKey.includes('2.png')) { // Lee Joohee -> Curación Divina
        if (regenSkill) {
            regenSkill.name = "Curación Divina";
            regenSkill.effect = "Restaura el 75% de tu salud máxima usando magia divina.";
        }
        if (items && items.skills && items.skills.regeneration) {
            items.skills.regeneration.text = "Curación Divina";
            items.skills.regeneration.description = "Restaura el 75% de tu salud máxima usando magia divina.";
        }
    } else if (frameKey.includes('3.png')) { // Yoo Jin-ho -> Muro de Escudo
        if (invincibleSkill) {
            invincibleSkill.name = "Muro de Escudo";
            invincibleSkill.effect = "Te vuelves inmune a todo daño durante 3.5 segundos protegiéndote con tu escudo.";
        }
        if (items && items.skills && items.skills.invincible) {
            items.skills.invincible.text = "Muro de Escudo";
            items.skills.invincible.description = "Te vuelves inmune a todo daño durante 4 segundos protegiéndote con tu escudo.";
        }
    } else if (frameKey.includes('4.png')) { // Choi Jong-in -> Infierno Abrasador
        if (bladeStormSkill) {
            bladeStormSkill.name = "Infierno Abrasador";
            bladeStormSkill.effect = "Invoca pilares de fuego en todas direcciones. Daño: 50% del ataque base por pilar.";
        }
        if (items && items.skills && items.skills.blade_storm) {
            items.skills.blade_storm.text = "Infierno Abrasador";
            items.skills.blade_storm.description = "Invoca pilares de fuego en todas direcciones. Daño: 50% del ataque base por pilar.";
        }
    } else if (frameKey.includes('5.png')) { // Esil Radiru -> Impulso Demoniaco
        if (speedSkill) {
            speedSkill.name = "Impulso Demoniaco";
            speedSkill.effect = "Desata tu poder de demonio para aumentar tu velocidad en un 50% durante 10 segundos.";
        }
        if (items && items.skills && items.skills.speed) {
            items.skills.speed.text = "Impulso Demoniaco";
            items.skills.speed.description = "Desata tu poder de demonio para aumentar tu velocidad en un 25% durante 10 segundos.";
        }
    } else if (frameKey.includes('6.png')) { // Baek Yoonho -> Transformación de Tigre Blanco
        if (critSkill) {
            critSkill.name = "Transformación de Tigre Blanco";
            critSkill.effect = "Desata el poder de la bestia, garantizando un golpe crítico devastador.";
        }
        if (items && items.skills && items.skills.critical_hit) {
            items.skills.critical_hit.text = "Transformación de Tigre Blanco";
            items.skills.critical_hit.description = "Desata el poder de la bestia, garantizando un golpe crítico devastador.";
        }
    }
}

/**
 * Carga los datos del jugador desde el Local Storage, o inicializa con valores por defecto.
 */
export function loadPlayerDataFromLocalStorage() {
    const storedData = localStorage.getItem('dungeonCrawlerPlayerData');
    if (storedData) {
        const loadedPlayer = JSON.parse(storedData);
        Object.assign(player, loadedPlayer);

        // Ensure inventory is always up-to-date with the master gear list
        player.inventory = loadedPlayer.inventory.map(item => allItems.find(aItem => aItem.name === item.name)).filter(Boolean);

        // Validate and load equipped items
        for (const slot in loadedPlayer.equipped) {
            if (slot.startsWith('habilidad')) {
                const skillExists = skills.some(s => s.key === loadedPlayer.equipped[slot]);
                player.equipped[slot] = skillExists ? loadedPlayer.equipped[slot] : null;
            } else if (loadedPlayer.equipped[slot]) {
                const fullItem = allItems.find(aItem => aItem.name === loadedPlayer.equipped[slot].name);
                player.equipped[slot] = fullItem || null;
            } else {
                player.equipped[slot] = null;
            }
        }

        // Validate permanently learned skills
        let currentLearnedSkills = new Set(getInitialSkillKeys());
        if (loadedPlayer.permanentlyLearnedSkills) {
            loadedPlayer.permanentlyLearnedSkills.forEach(skillKey => {
                if (skills.some(s => s.key === skillKey)) {
                    currentLearnedSkills.add(skillKey);
                }
            });
        }

        // Aplicar la habilidad inicial del personaje del menú como pasiva
        const selectedFrame = localStorage.getItem('selectedCharacterFrame');
        const charSkill = getCharacterSkill(selectedFrame);
        if (charSkill) {
            player.passiveSkill = charSkill;
        } else {
            player.passiveSkill = loadedPlayer.passiveSkill || null;
        }

        // Limpiar la habilidad pasiva de las ranuras activas
        if (player.passiveSkill) {
            if (player.equipped.habilidad1 === player.passiveSkill) player.equipped.habilidad1 = null;
            if (player.equipped.habilidad2 === player.passiveSkill) player.equipped.habilidad2 = null;
            if (player.equipped.habilidad3 === player.passiveSkill) player.equipped.habilidad3 = null;
        }

        player.permanentlyLearnedSkills = Array.from(currentLearnedSkills);

        // Asegurar que cada ranura de habilidad activa tenga una habilidad válida diferente a la pasiva
        const initialSkills = getInitialSkillKeys().filter(s => s !== player.passiveSkill);
        if (!player.equipped.habilidad1) {
            player.equipped.habilidad1 = initialSkills.find(s => s !== player.equipped.habilidad2 && s !== player.equipped.habilidad3) || null;
        }
        if (!player.equipped.habilidad2) {
            player.equipped.habilidad2 = initialSkills.find(s => s !== player.equipped.habilidad1 && s !== player.equipped.habilidad3) || null;
        }
        if (!player.equipped.habilidad3) {
            player.equipped.habilidad3 = initialSkills.find(s => s !== player.equipped.habilidad1 && s !== player.equipped.habilidad2) || null;
        }

        // Actualizar los nombres e info de habilidades según el personaje
        updateSkillNamesBasedOnCharacter(selectedFrame);

    } else {
        initializeNewPlayer();
    }
}

function initializeNewPlayer() {
    player.inventory = allItems.filter(item => item.type !== 'potion');
    
    // Equip initial gear
    player.equipped.weapon = allItems.find(aItem => aItem.name === 'Daga de Poder') || null;
    player.equipped.helmet = allItems.find(aItem => aItem.name === 'Casco de Hierro') || null;
    player.equipped.armor = allItems.find(aItem => aItem.name === 'Armadura de Hierro') || null;
    player.equipped.gloves = allItems.find(aItem => aItem.name === 'Guantes de Hierro') || null;
    player.equipped.boots = allItems.find(aItem => aItem.name === 'Botas de Hierro') || null;
    
    // Set initial skills
    const initialSkills = getInitialSkillKeys();
    let currentLearnedSkills = new Set(initialSkills);

    // Obtener la habilidad inicial del personaje del menú
    const selectedFrame = localStorage.getItem('selectedCharacterFrame');
    const charSkill = getCharacterSkill(selectedFrame);
    player.passiveSkill = charSkill || null;

    const availableActiveSkills = initialSkills.filter(s => s !== player.passiveSkill);
    player.equipped.habilidad1 = availableActiveSkills[0] || null;
    player.equipped.habilidad2 = availableActiveSkills[1] || null;
    player.equipped.habilidad3 = availableActiveSkills[2] || null;

    player.permanentlyLearnedSkills = Array.from(currentLearnedSkills);

    // Actualizar nombres de habilidades
    updateSkillNamesBasedOnCharacter(selectedFrame);
}

function getInitialSkillKeys() {
    return ['stealth', 'critical_hit', 'regeneration', 'second_wind', 'blade_storm'];
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
    player.evasion = 0; // Reset evasion to base
    player.attackSpeedBonus = 0; // Reset attack speed bonus to base

    // Apply passive skills stats changes
    if (player.passiveSkill === 'speed') {
        player.spd += 2;
    }
    if (player.passiveSkill === 'critical_hit') {
        player.criticalChanceBonus += 0.20;
    }

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
            if (item.evasion) player.evasion += item.evasion;
            if (item.attackSpeedBonus) player.attackSpeedBonus += item.attackSpeedBonus;
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

    player.lightSwordAttackSpeedMultiplier = 1.0; // Reset to default
    if (player.isLightSwordSpeedBoosted && currentTime < player.lightSwordSpeedBoostEndTime) {
        player.lightSwordAttackSpeedMultiplier = 1.10; // 10% increase in attack speed
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
    const { pose = 'idle', frame = 0, equipped = {}, spritesheet, spriteData } = options;

    // Si el spritesheet o los datos no están listos, devuelve un canvas vacío.
    if (!spritesheet || !spriteData) {
        const canvas = document.createElement('canvas');
        canvas.width = 70;
        canvas.height = 70;
        return canvas.toDataURL();
    }

    const finalSize = 70;
    const canvas = document.createElement('canvas');
    canvas.width = finalSize;
    canvas.height = finalSize;
    const ctx = canvas.getContext('2d');

    // Desplazamientos para la animación de caminar
    let body_Y_offset = 0;
    if (pose === 'walk') {
        const walkCycleBody = [0, 2, 3, 4, 3, 2, 1, 0];
        body_Y_offset = walkCycleBody[frame % 8];
    }

    ctx.clearRect(0, 0, finalSize, finalSize);

    const armorHeight = 30;
    const armorWidth = 41;
    const helmetSize = 32;
    const bootsHeight = 27;
    const bootsWidth = 34;
    const armHeight = 18;
    const armWidth = 5;

    const drawPart = (partName, x, y, dWidth, dHeight) => {
        if (!partName) return; // No dibujar si la parte es nula
        const frameData = spriteData.frames[partName];
        if (spritesheet && spritesheet.complete && frameData) {
            const { frame: { x: sx, y: sy, w: sWidth, h: sHeight }, rotated } = frameData;

            ctx.save();
            // Aplicar el offset de la animación de caminar antes de cualquier transformación
            ctx.translate(0, body_Y_offset);

            if (rotated) {
                // Mover el origen al centro del destino, rotar, y dibujar la imagen rotada
                ctx.translate(x + dWidth / 2, y + dHeight / 2);
                ctx.rotate(-Math.PI / 2); // Rotar -90 grados
                // Dibujar la imagen con ancho/alto intercambiados, centrada en el nuevo origen
                ctx.drawImage(spritesheet, sx, sy, sHeight, sWidth, -dHeight / 2, -dWidth / 2, dHeight, dWidth);
            } else {
                // Dibujar normalmente en la posición x, y
                ctx.drawImage(spritesheet, sx, sy, sWidth, sHeight, x, y, dWidth, dHeight);
            }
            ctx.restore();
        }
    };

    const center_x_armor = (finalSize - armorWidth) / 2;
    const center_x_helmet = (finalSize - helmetSize) / 2;
    const center_x_boots = (finalSize - bootsWidth) / 2;
    const left_arm_x = (finalSize / 2) - 15 - (armWidth / 2);
    const right_arm_x = (finalSize / 2) + 16 - (armWidth / 2);

    // Mapeo de nombres de set a números de sprite
    const setMapping = {
        'Hierro': 1,
        'Caballero': 2,
        'Demonio': 3,
        'León': 4,
        'Asesinato': 5,
        'Noble': 6,
        'Mago': 7,
        'Caos': 8
    };

    const getSpriteName = (type, part) => {
        const item = equipped[part];
        const set = item?.set;
        const number = setMapping[set] || 1; // Por defecto, Hierro (1)
        return `${type}_${number}.png`;
    };

    const helmetSprite = getSpriteName('casco', 'helmet');
    const armorSprite = getSpriteName('armadura', 'armor');
    const bootsSprite = getSpriteName('botas', 'boots');
    const armsSprite = 'brazos_1.png'; // Siempre usar brazos_1 para guantes

    // Replicando el orden de dibujado y capas original para mantener el aspecto visual
    drawPart(bootsSprite, center_x_boots, 40, bootsWidth, bootsHeight);
    drawPart(armorSprite, center_x_armor, 20.5, armorWidth, armorHeight);
    drawPart(armsSprite, left_arm_x, 30.5, armWidth, armHeight); // Izquierdo
    drawPart(armsSprite, right_arm_x, 30.5, armWidth, armHeight); // Derecho
    drawPart(armorSprite, center_x_armor, 22.5, armorWidth, armorHeight);
    drawPart(helmetSprite, center_x_helmet, 0, helmetSize, helmetSize);

    return canvas.toDataURL();
}

export function createMinionSprite(playerSpriteDataUrl) {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Create a temporary image object from the data URL
    const playerImageTemp = new Image();
    playerImageTemp.src = playerSpriteDataUrl;

    // Draw the player image onto the minion canvas. This will happen synchronously.
    // The data URL for the minion is generated immediately.
    // The actual visual representation will be correct once playerImageTemp has loaded.
    ctx.drawImage(playerImageTemp, 0, 0);
    
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

// --- HELPER FUNCTIONS ---

/**
 * Carga el spritesheet del jugador y los datos JSON correspondientes.
 * @returns {Promise<Object>} Una promesa que se resuelve con el spritesheet y los datos del sprite.
 */
export async function loadPlayerSprites() {
    try {
        // Cargar la imagen del spritesheet
        const spritesheetPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("No se pudo cargar el spritesheet de armaduras."));
            img.src = './assets/armaduras.png';
        });

        // Cargar los datos del JSON
        const spriteDataPromise = fetch('./assets/armaduras.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar armaduras.json');
                }
                return response.json();
            });

        // Esperar a que ambas promesas se completen
        const [spritesheet, spriteData] = await Promise.all([spritesheetPromise, spriteDataPromise]);

        return { spritesheet, spriteData };
    } catch (error) {
        console.error("Error al cargar los sprites del jugador:", error);
        // Devolver un objeto vacío o nulo para que el juego pueda continuar sin los sprites
        return { spritesheet: null, spriteData: null };
    }
}