// --- gameLogic.js ---
// Contiene la lógica principal del juego: bucle, combate, generación de niveles y estado.

// --- IMPORTS ---
import { player, updateStats, checkLevelUp, createPlayerSprite, createMinionSprite } from './player.js';
import * as ui from './ui.js';
import { monsters, chests, sprites, loadedImages, loadSprites } from './enemies.js';
import { gearList, skills } from './data.js';
import { playMusic, gameCanvas } from './ui.js';

// --- EXPORTS (Game State Variables) ---
export let currentFloor = 1;
export const maxFloors = 4;
export const mapWidth = 40, mapHeight = 40;
export const tileSize = 50;
export let map = Array(mapHeight).fill().map(() => Array(mapWidth).fill(0));
export let stairLocation = { x: -1, y: -1, active: false, type: 4 };
export let selectedDifficulty = 'medio';
export let gameStarted = false;
export let gameOver = false;
export let lastGameScore = 0;
export let lastEnemiesDefeated = 0;
export let finalOutcomeMessage = "";
export let finalOutcomeMessageLine2 = "";
export let keys = {
    ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false,
    KeyA: false, KeyD: false, KeyW: false, KeyS: false,
    Space: false, KeyE: false, KeyI: false, KeyY: false, KeyR: false,
    Digit1: false, Digit2: false, Digit3: false
};
export let screenShake = 0;
export let revealedMap;

// --- EXPORTS (Game Mechanics Variables) ---
export let projectiles = [];
export let damageTexts = [];
export let criticalHitEffects = [];
export let warMaceShockwave = null;
export let skillCooldowns = {};
export const fixedProjectileSpeed = 0.15;

let lastMoveTime = 0;
let lastAttackTime = 0;

// --- Projectile Class ---
export class Projectile {
    constructor(x, y, dx, dy, type, owner = 'player', damage = 0, isCritical = false, maxRangeTiles = 5, speedMultiplier = 1) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude > 0) {
            this.dx = (dx / magnitude) * fixedProjectileSpeed * speedMultiplier;
            this.dy = (dy / magnitude) * fixedProjectileSpeed * speedMultiplier;
        } else {
            this.dx = 0;
            this.dy = 0;
        }
        this.type = type;
        this.owner = owner;
        this.damage = damage;
        this.isCritical = isCritical;
        this.maxRangeTiles = maxRangeTiles;
        this.distanceTraveled = 0;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.distanceTraveled = Math.sqrt(Math.pow(this.x - this.initialX, 2) + Math.pow(this.y - this.initialY, 2));
        return this.distanceTraveled <= this.maxRangeTiles;
    }
}

async function loadAllSprites() {
    loadSprites();
    sprites.player = createPlayerSprite();
    const allSpriteKeys = Object.keys(sprites);
    return new Promise(resolve => {
        let imagesToLoad = Object.keys(sprites).length;
        if (imagesToLoad === 0) {
            resolve();
            return;
        }
        const checkAllLoaded = () => {
            if (Object.keys(loadedImages).length === imagesToLoad) {
                resolve();
            }
        };
        Object.keys(sprites).forEach(key => {
            const img = new Image();
            img.src = sprites[key];
            img.onload = () => {
                loadedImages[key] = img;
                if (key === 'player') {
                    sprites.minion = createMinionSprite(loadedImages.player);
                    imagesToLoad++;
                    const minionImg = new Image();
                    minionImg.src = sprites.minion;
                    minionImg.onload = () => {
                        loadedImages.minion = minionImg;
                        checkAllLoaded();
                    };
                    minionImg.onerror = () => checkAllLoaded();
                }
                checkAllLoaded();
            };
            img.onerror = () => checkAllLoaded();
        });
    });
}

// --- Core Game Functions ---
export async function setDifficultyAndStart(difficulty, startFloor = 1, baseLevel = 1) {
    selectedDifficulty = difficulty;
    const savedEquipped = { ...player.equipped };
    const savedInventory = [ ...player.inventory];
    const savedSkills = [ ...player.permanentlyLearnedSkills];

    Object.assign(player, {
        tileX: 1, tileY: 1, hp: 100, maxHp: 100,
        atk: 5, def: 5, spd: 4, xp: 0, level: baseLevel, skillPoints: 0,
        inventory: savedInventory,
        equipped: savedEquipped,
        permanentlyLearnedSkills: savedSkills,
        hasKey: false, facingDirection: 'right',
        hitFrame: 0, doorOpened: false, lastHitTime: 0,
        isAttacking: false, attackAnimFrame: 0,
        skillUsageThisFloor: {},
        enemiesDefeatedThisRun: 0,
        isSlowed: false, slowEndTime: 0,
        potionsBoughtTotal: 0,
        isStealthed: false, stealthEndTime: 0,
        isInvincible: false, invincibleEndTime: 0,
        isSpeedBoosted: false, speedBoostEndTime: 0,
        luckBoostEndTime: 0,
        baseSpd: 4, baseAtk: 5, baseDef: 5,
        criticalChanceBonus: 0.05,
        invulnerabilityTime: 500,
        darkRayEnemiesDefeated: 0,
        hitsSinceLastSoulExtraction: 0,
        _furyEffectApplied: false,
        secondWindUsedThisRun: false
    });

    revealedMap = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(false));
    updateStats();
    player.hp = player.maxHp;
    projectiles.length = 0;
    damageTexts.length = 0;
    criticalHitEffects.length = 0;
    Object.keys(skillCooldowns).forEach(key => skillCooldowns[key] = 0);
    currentFloor = startFloor;
    stairLocation.active = false;
    monsters.length = 0;
    chests.length = 0;
    gameStarted = true;
    gameOver = false;

    await generateFloor();
    revealMapAroundPlayer();
    await loadAllSprites();
    
    ui.difficultyScreen.style.display = 'none';
    ui.gameCanvas.style.display = 'block';
    ui.minimapCanvas.style.display = 'block';
    ui.equipmentMenu.style.display = 'none';
    const minimapTileSize = 5;
    ui.minimapCanvas.width = mapWidth * minimapTileSize;
    ui.minimapCanvas.height = mapHeight * minimapTileSize;

    requestAnimationFrame(gameLoop);
}

export function gameLoop(timestamp) {
    if (!gameStarted) return;
    if (gameOver) {
        ui.drawMap();
        return;
    }
    updateGame(timestamp);
    ui.drawMap();
    requestAnimationFrame(gameLoop);
}

function updateGame(timestamp) {
    if (player.isAttacking) {
        player.attackAnimFrame++;
        if (player.attackAnimFrame >= player.attackAnimDuration) {
            player.isAttacking = false;
            player.attackAnimFrame = 0;
        }
    }
    const currentTime = Date.now();
    updateStatusEffects(currentTime);
    updateProjectiles();
    updateMonsters(currentTime);
    criticalHitEffects = criticalHitEffects.filter(effect => effect.life > 0);
    damageTexts = damageTexts.filter(text => text.life > 0);
    if (warMaceShockwave) {
        warMaceShockwave.life--;
        if (warMaceShockwave.life <= 0) warMaceShockwave = null;
    }
    if (screenShake > 0) screenShake--;
    if (!ui.isInventoryOpen && !ui.isSkillMenuOpen && !ui.isEquipmentOpen) {
        handlePlayerInput(timestamp);
    }
}

function handlePlayerInput(timestamp) {
    const moveInterval = 1000 / player.spd;
    if (timestamp - lastMoveTime > moveInterval) {
        let moved = false;
        if (keys.ArrowLeft || keys.KeyA) { tryMove(-1, 0); moved = true; }
        else if (keys.ArrowRight || keys.KeyD) { tryMove(1, 0); moved = true; }
        else if (keys.ArrowUp || keys.KeyW) { tryMove(0, -1); moved = true; }
        else if (keys.ArrowDown || keys.KeyS) { tryMove(0, 1); moved = true; }
        if (moved) lastMoveTime = timestamp;
    }
    const attackInterval = player.equipped.weapon?.attackSpeed || 400;
    if (keys.Space && timestamp - lastAttackTime > attackInterval) {
        performAttack();
        lastAttackTime = timestamp;
    }
}

function updateStatusEffects(currentTime) {
    if (player.isSlowed && currentTime > player.slowEndTime) {
        player.isSlowed = false;
        updateStats();
    }
    if (player.stealthActive && currentTime > player.stealthEndTime) {
        player.stealthActive = false;
        updateStats();
    }
    if (player.isInvincible && currentTime > player.invincibleEndTime) {
        player.isInvincible = false;
    }
    if (player.isSpeedBoosted && currentTime > player.speedBoostEndTime) {
        player.isSpeedBoosted = false;
        updateStats();
    }
}

function updateProjectiles() {
    projectiles = projectiles.filter(p => {
        if (!p.update()) return false;
        const tileX = Math.floor(p.x);
        const tileY = Math.floor(p.y);
        if (!isPassable(tileX, tileY, true)) return false;
        if (p.owner === 'player') {
            const monster = getMonsterAt(tileX, tileY);
            if (monster) {
                takeDamage(monster, p.damage, p.isCritical, 'player');
                return false;
            }
        } else { 
            if (tileX === player.tileX && tileY === player.tileY) {
                if (!player.isInvincible) {
                    takeDamage(player, p.damage, false, 'monster');
                    if (p.type === 'web') {
                        player.isSlowed = true;
                        player.slowEndTime = Date.now() + 3000;
                        updateStats();
                        ui.showMessage("¡Has sido ralentizado por una telaraña!");
                    }
                }
                return false;
            }
        }
        return true;
    });
}

function updateMonsters(currentTime) {
    if (ui.isInventoryOpen || ui.isSkillMenuOpen || ui.isEquipmentOpen) return;

    monsters.forEach(m => {
        if (!m.lastActionTime) m.lastActionTime = 0;

        if (m.isFrozen && currentTime > m.frozenEndTime) m.isFrozen = false;
        if (m.isWeakened && currentTime > m.weaknessEndTime) m.isWeakened = false;
        if (m.isAttackSlowed && currentTime > m.attackSlowEndTime) m.isAttackSlowed = false;
        if (m.isFrozen) return;

        if (m.hitFrame > 0) m.hitFrame--;

        if (m.isAttackingPlayer) {
            m.attackAnimFrame++;
            if (m.attackAnimFrame >= m.attackAnimDuration) {
                m.isAttackingPlayer = false;
                m.attackAnimFrame = 0;
            }
        }

        const bossCenter = (m.type === 'finalBoss') ? { x: m.tileX + 0.5, y: m.tileY + 0.5 } : { x: m.tileX, y: m.tileY };
        const distanceToPlayer = getDistance(bossCenter.x, bossCenter.y, player.tileX, player.tileY);
        const canSeePlayer = hasLineOfSight(m, player);

        // State transitions
        switch (m.state) {
            case 'PATROL':
                if (canSeePlayer && distanceToPlayer < m.aggroRange) {
                    m.state = 'CHASE';
                    m.lastKnownPlayerPosition = { x: player.tileX, y: player.tileY };
                }
                break;
            case 'CHASE':
                if (!canSeePlayer) m.state = 'SEARCH';
                else if (distanceToPlayer <= m.attackRange) {
                    m.state = 'ATTACK';
                    m.lastActionTime = 0; // Reset action timer for immediate attack
                } else {
                    m.lastKnownPlayerPosition = { x: player.tileX, y: player.tileY };
                }
            case 'ATTACK':
                if (distanceToPlayer > m.attackRange) m.state = 'CHASE';
                break;
            case 'SEARCH':
                if (canSeePlayer) m.state = 'CHASE';
                else if (m.tileX === m.lastKnownPlayerPosition?.x && m.tileY === m.lastKnownPlayerPosition?.y) m.state = 'PATROL';
                break;
        }

        const actionInterval = (m.state === 'ATTACK') ? m.attackSpeed : m.moveSpeed;
        if (currentTime - m.lastActionTime < actionInterval) return;

        let actionTaken = false;

        // --- Final Boss Special Abilities ---
        if (m.type === 'finalBoss' && (m.state === 'ATTACK' || m.state === 'CHASE')) {
            if (currentTime - (m.abilityCooldowns.webShot || 0) > 3500 && distanceToPlayer > 2 && canSeePlayer) {
                const dx = player.tileX - bossCenter.x;
                const dy = player.tileY - bossCenter.y;
                projectiles.push(new Projectile(bossCenter.x, bossCenter.y, dx, dy, 'web', 'monster', m.atk * 0.5, false, 5));
                ui.showMessage("¡La Araña Jefe lanza una telaraña!");
                m.abilityCooldowns.webShot = currentTime;
                actionTaken = true;
            } else if (currentTime - (m.abilityCooldowns.summon || 0) > 7000) {
                let spawned = 0;
                for (let i = 0; i < 15 && spawned < 4; i++) {
                    let spawnX = m.tileX + (Math.floor(Math.random() * 7) - 3);
                    let spawnY = m.tileY + (Math.floor(Math.random() * 7) - 3);
                    if (isPassable(spawnX, spawnY)) {
                        monsters.push(createMonster('spiderling', spawnX, spawnY, currentFloor));
                        spawned++;
                    }
                }
                if (spawned > 0) {
                    ui.showMessage(`¡La Araña Jefe ha invocado ${spawned} mini-arañas!`);
                    m.abilityCooldowns.summon = currentTime;
                    actionTaken = true;
                }
            }
        }

        // --- Attack Action ---
        if (!actionTaken && m.state === 'ATTACK') {
            if (distanceToPlayer <= m.attackRange) { // Check if player is still in range
                if (currentTime - player.lastHitTime > (player.invulnerabilityTime || 0)) {
                    takeDamage(player, m.atk, false, 'monster');
                    player.lastHitTime = currentTime;
                    m.isAttackingPlayer = true;
                    m.attackAnimFrame = 0;
                    m.attackDirectionX = Math.sign(player.tileX - m.tileX);
                    m.attackDirectionY = Math.sign(player.tileY - m.tileY);
                    actionTaken = true;
                }
            }
        } 
        // --- Movement Action ---
        else if (!actionTaken && (m.state === 'CHASE' || m.state === 'SEARCH' || m.state === 'PATROL')) {
            let moved = false;
            switch (m.state) {
                case 'PATROL':
                    const moves = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
                    const move = moves[Math.floor(Math.random() * moves.length)];
                    if (isPassable(m.tileX + move.x, m.tileY + move.y, false, m)) {
                        m.tileX += move.x;
                        m.tileY += move.y;
                        moved = true;
                    }
                    break;
                case 'CHASE':
                case 'SEARCH':
                    let targetPos = (m.state === 'CHASE') ? findOptimalAttackPosition(m, player) : m.lastKnownPlayerPosition;
                    if (!targetPos) targetPos = m.lastKnownPlayerPosition;
                    if (!targetPos) break;

                    const dx = targetPos.x - m.tileX;
                    const dy = targetPos.y - m.tileY;
                    if (dx === 0 && dy === 0) break;

                    const moveX = Math.sign(dx);
                    const moveY = Math.sign(dy);

                    const potentialMoves = [];
                    if (moveX !== 0) potentialMoves.push({ x: m.tileX + moveX, y: m.tileY });
                    if (moveY !== 0) potentialMoves.push({ x: m.tileX, y: m.tileY + moveY });
                    if (moveX !== 0 && moveY !== 0) potentialMoves.push({ x: m.tileX + moveX, y: m.tileY + moveY });

                    for (const pMove of potentialMoves) {
                        if (isPassable(pMove.x, pMove.y, false, m)) {
                            m.tileX = pMove.x;
                            m.tileY = pMove.y;
                            moved = true;
                            break;
                        }
                    }
                    break;
            }
            if (moved) {
                actionTaken = true;
            }
        }

        if (actionTaken) {
            m.lastActionTime = currentTime;
        }
    });
}

async function generateFloor() {
    map = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(0));
    stairLocation = { x: -1, y: -1, active: false, type: 4 };
    Object.keys(player.skillUsageThisFloor).forEach(key => delete player.skillUsageThisFloor[key]);
    monsters.length = 0;
    revealedMap = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(false));

    var hpMultiplier = 1.0, atkMultiplier = 1.0;
    if (selectedDifficulty === 'facil') { hpMultiplier = 0.6; atkMultiplier = 0.7; }
    else if (selectedDifficulty === 'dificil') { hpMultiplier = 1.5; atkMultiplier = 1.35; }

    if (currentFloor === maxFloors) {
        const arenaWidth = 15, arenaHeight = 15;
        const arenaX = Math.floor((mapWidth - arenaWidth) / 2);
        const arenaY = Math.floor((mapHeight - arenaHeight) / 2);
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) map[y][x] = 0;
        }
        for (let y = arenaY; y < arenaY + arenaHeight; y++) {
            for (let x = arenaX; x < arenaX + arenaWidth; x++) map[y][x] = 1;
        }
        player.tileX = arenaX + Math.floor(arenaWidth / 2);
        player.tileY = arenaY + arenaHeight - 2;
        stairLocation.x = player.tileX;
        stairLocation.y = player.tileY;
        const bossSpawnX = arenaX + Math.floor(arenaWidth / 2) - 1;
        const bossSpawnY = arenaY + 1;
        monsters.push(createMonster('finalBoss', bossSpawnX, bossSpawnY, currentFloor));
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 2; c++) map[bossSpawnY + r][bossSpawnX + c] = 1;
        }
    } else {
        const rooms = [];
        const numRooms = Math.floor(Math.random() * 3) + 8;
        const minRoomSize = 5, maxRoomSize = 8;
        for (let i = 0; i < numRooms; i++) {
            let roomW, roomH, roomX, roomY, newRoom, overlaps;
            let attempts = 0;
            do {
                roomW = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
                roomH = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
                roomX = Math.floor(Math.random() * (mapWidth - roomW - 2)) + 1;
                roomY = Math.floor(Math.random() * (mapHeight - roomH - 2)) + 1;
                newRoom = { x: roomX, y: roomY, w: roomW, h: roomH, centerX: roomX + Math.floor(roomW / 2), centerY: roomY + Math.floor(roomH / 2) };
                overlaps = rooms.some(otherRoom => newRoom.x < otherRoom.x + otherRoom.w && newRoom.x + newRoom.w > otherRoom.x && newRoom.y < otherRoom.y + otherRoom.h && newRoom.y + newRoom.h > otherRoom.y);
                attempts++;
            } while (overlaps && attempts < 50);
            if (!overlaps) rooms.push(newRoom);
        }
        if (rooms.length === 0) {
            rooms.push({ x: Math.floor(mapWidth / 2) - 3, y: Math.floor(mapHeight / 2) - 3, w: 7, h: 7, centerX: Math.floor(mapWidth / 2), centerY: Math.floor(mapHeight / 2) });
        }
        rooms.forEach(room => {
            for (let y = room.y; y < room.y + room.h; y++) {
                for (let x = room.x; x < room.x + room.w; x++) {
                    if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) map[y][x] = 1;
                }
            }
        });
        for (let i = 0; i < rooms.length - 1; i++) {
            carvePathBetweenRooms(rooms[i], rooms[i + 1]);
        }
        player.tileX = rooms[0].centerX;
        player.tileY = rooms[0].centerY;
        let stairRoom = rooms[rooms.length - 1];
        stairLocation.x = stairRoom.centerX;
        stairLocation.y = stairRoom.centerY;
        player.hasKey = false;
        player.doorOpened = false;
        const monsterSpawnLocations = [];
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                if (map[y][x] === 1 && !(x === player.tileX && y === player.tileY)) {
                    monsterSpawnLocations.push({ x, y });
                }
            }
        }
        const placeMonster = (type, dropsKey = false) => {
            if (monsterSpawnLocations.length === 0) return;
            let spawnIndex = Math.floor(Math.random() * monsterSpawnLocations.length);
            let loc = monsterSpawnLocations.splice(spawnIndex, 1)[0];
            const monster = createMonster(type, loc.x, loc.y, currentFloor);
            if (dropsKey) monster.dropsKey = true;
            monsters.push(monster);
        };
        for (let i = 0; i < 6 + (currentFloor - 1) * 2; i++) placeMonster('duende');
        for (let i = 0; i < 2 + currentFloor; i++) placeMonster('lobo');
        for (let i = 0; i < 3 + Math.floor((currentFloor - 1) * 1.5); i++) placeMonster('skeleton');
        if (rooms.length > 1) {
            // Place the main boss (Golem), which drops the key
            placeMonster('boss', true);
            // Place the mini-boss (White Wolf) as well
            placeMonster('miniBoss', false);
        }
        chests.length = 0;
        spawnChests(monsterSpawnLocations);
    }
    await loadAllSprites();
    playMusic(monsters.some(m => m.type === 'finalBoss') ? 'boss' : 'dungeon');
}

function carvePathBetweenRooms(room1, room2) {
    const x1 = room1.centerX, y1 = room1.centerY;
    const x2 = room2.centerX, y2 = room2.centerY;
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) map[y1][x] = 1;
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) map[y][x2] = 1;
}

function hasLineOfSight(monster, target) {
    let x0 = monster.tileX, y0 = monster.tileY;
    if (monster.width > 1 || monster.height > 1) {
        x0 += (monster.width - 1) / 2;
        y0 += (monster.height - 1) / 2;
    }
    const x1 = target.tileX, y1 = target.tileY;
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy, e2;
    while (true) {
        if (Math.floor(x0) === Math.floor(x1) && Math.floor(y0) === Math.floor(y1)) return true;
        if (map[Math.floor(y0)][Math.floor(x0)] === 0) return false;
        e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
    }
}

function findOptimalAttackPosition(monster, target) {
    const attackPositions = [];
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            if (x === 0 && y === 0) continue;
            const tileX = target.tileX + x;
            const tileY = target.tileY + y;
            if (isPassable(tileX, tileY, false, monster)) {
                attackPositions.push({ x: tileX, y: tileY });
            }
        }
    }
    attackPositions.sort((a, b) => getDistance(monster.tileX, monster.tileY, a.x, a.y) - getDistance(monster.tileX, monster.tileY, b.x, b.y));
    return attackPositions.find(pos => !monsters.some(m => m !== monster && m.tileX === pos.x && m.tileY === pos.y)) || null;
}

function createMonster(type, x, y, floor) {
    let monster = {
        tileX: x, tileY: y, type: type, isMinion: false,
        hp: 0, maxHp: 0, atk: 0, def: 0, spd: 0, xp: 0,
        moveSpeed: 1000, attackSpeed: 1000, aggroRange: 5, attackRange: 1.5,
        lastActionTime: 0, hitFrame: 0,
        isFrozen: false, frozenEndTime: 0,
        isWeakened: false, weaknessEndTime: 0,
        isBleeding: false, bleedingEndTime: 0,
        isAttackSlowed: false, attackSlowEndTime: 0,
        isAttackingPlayer: false, attackAnimFrame: 0, attackAnimDuration: 7, attackLungeDistance: 12.5,
        attackDirectionX: 0, attackDirectionY: 0,
        state: 'PATROL',
        lastKnownPlayerPosition: null
    };

    let hpMultiplier = 1.0, atkMultiplier = 1.0;
    if (selectedDifficulty === 'facil') { hpMultiplier = 0.7; atkMultiplier = 0.8; }
    else if (selectedDifficulty === 'dificil') { hpMultiplier = 1.4; atkMultiplier = 1.2; }
    const floorMultiplier = 1 + (floor - 1) * 0.25;

    switch (type) {
        case 'duende':
            monster.maxHp = Math.floor((20 + floor * 4) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((5 + floor * 2) * atkMultiplier * floorMultiplier);
            monster.moveSpeed = 450;
            break;
        case 'lobo':
            monster.maxHp = Math.floor((30 + floor * 6) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((8 + floor * 3) * atkMultiplier * floorMultiplier);
            monster.moveSpeed = 350;
            monster.attackSpeed = 800;
            break;
        case 'skeleton':
            monster.maxHp = Math.floor((40 + floor * 8) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((10 + floor * 4) * atkMultiplier * floorMultiplier);
            monster.moveSpeed = 600;
            monster.attackSpeed = 1200;
            break;
        case 'miniBoss':
            monster.maxHp = Math.floor((100 + floor * 10) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((15 + floor * 5) * atkMultiplier * floorMultiplier);
            monster.moveSpeed = 700;
            monster.attackSpeed = 900;
            break;
        case 'boss':
            monster.maxHp = Math.floor((200 + floor * 20) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((35 + floor * 8) * atkMultiplier * floorMultiplier);
            monster.moveSpeed = 800;
            monster.attackSpeed = 1100;
            monster.aggroRange = 10;
            monster.attackRange = 1.5;
            monster.xp = 500;
            break;
        case 'finalBoss':
            monster.width = 2;
            monster.height = 2;
            monster.maxHp = Math.floor((350 + floor * 30) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((70 + floor * 10) * atkMultiplier * floorMultiplier);
            monster.moveSpeed = 800;
            monster.attackSpeed = 900;
            monster.attackRange = 2.5;
            monster.aggroRange = 12;
            monster.abilityCooldowns = { webShot: 0, summon: 0 };
            break;
        case 'spiderling':
            monster.maxHp = Math.floor((15 + floor * 2) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((7 + floor * 1) * atkMultiplier * floorMultiplier);
            monster.moveSpeed = 300;
            monster.attackSpeed = 700;
            break;
    }
    monster.hp = monster.maxHp;
    return monster;
}

function spawnChests(spawnLocations) {
    let numChestsToSpawn = selectedDifficulty === 'facil' ? 3 : selectedDifficulty === 'medio' ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 3);
    const smallPotion = gearList.find(item => item.name === 'Poción de Vida Pequeña');
    const mediumPotion = gearList.find(item => item.name === 'Poción de Vida Mediana');
    const largePotion = gearList.find(item => item.name === 'Poción de Vida Grande');
    const getWeightedRandomPotion = () => {
        let potionsPool = selectedDifficulty === 'facil' ? [smallPotion, mediumPotion, mediumPotion, largePotion, largePotion, largePotion] : selectedDifficulty === 'medio' ? [smallPotion, smallPotion, mediumPotion, mediumPotion, largePotion] : [smallPotion, smallPotion, smallPotion, mediumPotion];
        return potionsPool[Math.floor(Math.random() * potionsPool.length)];
    };
    for (let i = 0; i < numChestsToSpawn && spawnLocations.length > 0; i++) {
        const spawnIndex = Math.floor(Math.random() * spawnLocations.length);
        const loc = spawnLocations.splice(spawnIndex, 1)[0];
        map[loc.y][loc.x] = 2;
        chests.push({ tileX: loc.x, tileY: loc.y, opened: false, item: getWeightedRandomPotion() });
    }
}

function tryMove(dx, dy) {
    const newX = player.tileX + dx;
    const newY = player.tileY + dy;
    if (dx === -1) player.facingDirection = 'left';
    if (dx === 1) player.facingDirection = 'right';
    if (dy === -1) player.facingDirection = 'up';
    if (dy === 1) player.facingDirection = 'down';
    if (newX === stairLocation.x && newY === stairLocation.y && stairLocation.active) {
        handleFloorTransition();
        return;
    }
    const chest = getChestAt(newX, newY);
    if (chest) openChest(chest);
    if (isPassable(newX, newY)) {
        player.tileX = newX;
        player.tileY = newY;
        revealMapAroundPlayer();
    }
}

function revealMapAroundPlayer() {
    const px = player.tileX, py = player.tileY;
    for (let y = py - 2; y <= py + 2; y++) {
        for (let x = px - 2; x <= px + 2; x++) {
            if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
                revealedMap[y][x] = true;
            }
        }
    }
}

async function handleFloorTransition() {
    if (currentFloor >= maxFloors) {
        gameOver = true;
        finalOutcomeMessage = "¡Mazmorra completada!";
        lastGameScore = calculateScore();
        lastEnemiesDefeated = player.enemiesDefeatedThisRun;
        return;
    }
    currentFloor++;
    player.skillUsageThisFloor = {};
    await generateFloor();
    ui.showMessage(`Has llegado al piso ${currentFloor}.`);
}

function performAttack() {
    let nearestMonster = null;
    let minDistance = Infinity;
    monsters.forEach(monster => {
        const distance = getDistance(player.tileX, player.tileY, monster.tileX, monster.tileY);
        if (distance < minDistance) {
            minDistance = distance;
            nearestMonster = monster;
        }
    });

    if (nearestMonster) {
        const dx = nearestMonster.tileX - player.tileX;
        const dy = nearestMonster.tileY - player.tileY;
        player.attackDirectionX = Math.sign(dx);
        player.attackDirectionY = Math.sign(dy);
        if (Math.abs(dx) > Math.abs(dy)) player.facingDirection = dx > 0 ? 'right' : 'left';
        else player.facingDirection = dy > 0 ? 'down' : 'up';
    } else {
        switch (player.facingDirection) {
            case 'up': player.attackDirectionX = 0; player.attackDirectionY = -1; break;
            case 'down': player.attackDirectionX = 0; player.attackDirectionY = 1; break;
            case 'left': player.attackDirectionX = -1; player.attackDirectionY = 0; break;
            case 'right': player.attackDirectionX = 1; player.attackDirectionY = 0; break;
        }
    }

    player.isAttacking = true;
    player.attackAnimFrame = 0;

    const equippedWeapon = player.equipped.weapon;
    let projectileType = null;
    let projectileRange = 1;

    if (equippedWeapon) {
        switch (equippedWeapon.name) {
            case 'Arco del Bosque': projectileType = 'arrow'; projectileRange = 3; break;
            case 'Rayo de Oscuridad': projectileType = 'dark_ray'; projectileRange = 3; break;
            case 'Libro Celestial': projectileType = 'celestial_ray'; projectileRange = 3; break;
        }
    }

    if (projectileType) {
        let dx = player.attackDirectionX, dy = player.attackDirectionY;
        let isCritical = Math.random() < (0.05 + player.criticalChanceBonus);
        if (player.nextAttackIsCritical) {
            isCritical = true;
            player.nextAttackIsCritical = false;
        }
        projectiles.push(new Projectile(player.tileX, player.tileY, dx, dy, projectileType, 'player', player.atk, isCritical, projectileRange));
    } else {
        let targetTiles = [];
        if (player.facingDirection === 'right') targetTiles.push({ x: player.tileX + 1, y: player.tileY });
        else if (player.facingDirection === 'left') targetTiles.push({ x: player.tileX - 1, y: player.tileY });
        else if (player.facingDirection === 'up') targetTiles.push({ x: player.tileX, y: player.tileY - 1 });
        else if (player.facingDirection === 'down') targetTiles.push({ x: player.tileX, y: player.tileY + 1 });

        if (equippedWeapon && equippedWeapon.name === 'Maza de Guerra') {
            if (player.facingDirection === 'right') {
                targetTiles.push({ x: player.tileX + 1, y: player.tileY - 1 });
                targetTiles.push({ x: player.tileX + 1, y: player.tileY + 1 });
            } else if (player.facingDirection === 'left') {
                targetTiles.push({ x: player.tileX - 1, y: player.tileY - 1 });
                targetTiles.push({ x: player.tileX - 1, y: player.tileY + 1 });
            } else if (player.facingDirection === 'up') {
                targetTiles.push({ x: player.tileX - 1, y: player.tileY - 1 });
                targetTiles.push({ x: player.tileX + 1, y: player.tileY - 1 });
            } else if (player.facingDirection === 'down') {
                targetTiles.push({ x: player.tileX - 1, y: player.tileY + 1 });
                targetTiles.push({ x: player.tileX + 1, y: player.tileY + 1 });
            }
        }

        let monstersHit = [];
        for (const targetCoord of targetTiles) {
            const monster = getMonsterAt(targetCoord.x, targetCoord.y);
            if (monster && !monstersHit.includes(monster)) {
                monstersHit.push(monster);
            }
        }

        monstersHit.forEach(monsterToAttack => {
            let isCritical = Math.random() < (0.05 + player.criticalChanceBonus);
            if (player.nextAttackIsCritical) {
                isCritical = true;
                player.nextAttackIsCritical = false;
            }
            takeDamage(monsterToAttack, player.atk, isCritical, 'player');

            if (equippedWeapon) {
                const currentTime = Date.now();
                if (equippedWeapon.name === 'Guadaña Helada') {
                    monsterToAttack.isAttackSlowed = true;
                    monsterToAttack.attackSlowEndTime = currentTime + 3000;
                } else if (equippedWeapon.name === 'Daga de Poder') {
                    if (Math.random() < 0.25) {
                        monsterToAttack.isBleeding = true;
                        monsterToAttack.bleedingEndTime = currentTime + 5000;
                    }
                } else if (equippedWeapon.name === 'Maza de Guerra' && monstersHit.length >= 2) {
                    warMaceShockwave = { x: player.tileX, y: player.tileY, life: 15 };
                }
            }
        });
    }
}

function openChest(chest) {
    if (chest.opened) return;
    chest.opened = true;
    map[chest.tileY][chest.tileX] = 1;
    if (chest.item) {
        if (chest.item.type === 'potion') {
            const oldHp = player.hp;
            player.hp = Math.min(player.maxHp, player.hp + (chest.item.heal || 0));
            const actualHealedAmount = player.hp - oldHp;
            if (actualHealedAmount > 0) {
                damageTexts.push({ text: `+${Math.floor(actualHealedAmount)} HP`, x: player.tileX, y: player.tileY, life: 60, color: '#4CAF50', size: 20, velY: -0.01 });
            }
        } else {
            player.inventory.push(chest.item);
        }
        ui.showMessage(`Has encontrado: ${chest.item.name}`);
    }
}

function getChestAt(x, y) {
    return chests.find(chest => chest.tileX === x && chest.tileY === y);
}

function isPassable(x, y, forProjectiles = false, monster = null) {
    const monsterWidth = monster ? (monster.width || 1) : 1;
    const monsterHeight = monster ? (monster.height || 1) : 1;

    for (let i = 0; i < monsterWidth; i++) {
        for (let j = 0; j < monsterHeight; j++) {
            const checkX = x + i;
            const checkY = y + j;

            if (checkY < 0 || checkY >= mapHeight || checkX < 0 || checkX >= mapWidth || map[checkY][checkX] === 0) {
                return false;
            }

            if (!forProjectiles) {
                if (checkX === player.tileX && checkY === player.tileY) return false;
                if (monsters.some(m => {
                    if (m === monster) return false;
                    const mWidth = m.width || 1;
                    const mHeight = m.height || 1;
                    return checkX >= m.tileX && checkX < m.tileX + mWidth && checkY >= m.tileY && checkY < m.tileY + mHeight;
                })) {
                    return false;
                }
            }
        }
    }
    return true;
}

function getMonsterAt(x, y) {
    return monsters.find(m => {
        const mWidth = m.width || 1;
        const mHeight = m.height || 1;
        return x >= m.tileX && x < m.tileX + mWidth && y >= m.tileY && y < m.tileY + mHeight;
    });
}

function takeDamage(target, damage, isCritical, attackerType = 'player') {
    const defenseReduction = Math.min(0.75, (target.def || 0) * 0.03);
    let actualDamage = Math.max(1, Math.floor(damage * (1 - defenseReduction)));

    if (target === player && player.hasMiniShield && player.miniShieldHP > 0) {
        const damageAbsorbed = Math.min(player.miniShieldHP, actualDamage);
        player.miniShieldHP -= damageAbsorbed;
        actualDamage -= damageAbsorbed;
        if (player.miniShieldHP <= 0) ui.showMessage("¡Tu mini escudo se ha roto!");
    }

    if (actualDamage > 0) target.hp -= actualDamage;

    damageTexts.push({ text: Math.floor(actualDamage).toString(), x: target.tileX, y: target.tileY, life: 30, color: isCritical ? '#ff0000' : '#ffffff', size: isCritical ? 24 : 18, velY: -0.01 });

    if (isCritical && attackerType === 'player') {
        criticalHitEffects.push({ x: target.tileX, y: target.tileY, life: 15, size: 50 });
    }
    
    if (target === player) {
        player.hitFrame = 8;
        player.lastHitTime = Date.now();
    } else {
        target.hitFrame = 5;
    }

    if (target.hp <= 0) {
        if (target === player) {
            const secondWindSkill = skills.find(s => s.name === 'Segundo Aliento');
            const isSecondWindEquipped = [player.equipped.habilidad1, player.equipped.habilidad2, player.equipped.habilidad3].includes('Segundo Aliento');
            if (isSecondWindEquipped && !player.secondWindUsedThisRun) {
                player.hp = Math.floor(player.maxHp * 0.25);
                player.secondWindUsedThisRun = true;
                ui.showMessage("¡Segundo Aliento! Has revivido con 25% de salud.");
                return;
            }
            gameOver = true;
            finalOutcomeMessage = "¡Has sido derrotado!";
            lastGameScore = calculateScore();
            lastEnemiesDefeated = player.enemiesDefeatedThisRun;
        } else {
            player.xp += target.xp || 10;
            player.enemiesDefeatedThisRun++;
            checkLevelUp();
            const monsterIndex = monsters.indexOf(target);
            if (monsterIndex > -1) monsters.splice(monsterIndex, 1);
            if (target.type === 'finalBoss') {
                gameOver = true;
                finalOutcomeMessage = "¡Has derrotado al Jefe Final!";
                finalOutcomeMessageLine2 = "¡Has completado la Mazmorra!";
                lastGameScore = calculateScore();
                lastEnemiesDefeated = player.enemiesDefeatedThisRun;
            } else if (monsters.filter(m => !m.isMinion).length === 0) {
                stairLocation.active = true;
                ui.showMessage("¡Todos los monstruos derrotados! Las escaleras han aparecido.");
            }
        }
    }
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function calculateScore() {
    return player.enemiesDefeatedThisRun * 10 + player.level * 100 + currentFloor * 50;
}

export function activateSkill(skillName) {
    const skill = skills.find(s => s.name === skillName);
    if (!skill || skill.type === 'passive') return;

    const currentTime = Date.now();
    if (skillCooldowns[skillName] && skillCooldowns[skillName] > currentTime) {
        // La habilidad está en enfriamiento, no se hace nada y no se muestra mensaje.
        return;
    }

    let skillUsed = false;
    switch (skillName) {
        case 'Sigilo':
            player.isStealthed = true;
            player.stealthEndTime = currentTime + 10000;
            updateStats();
            ui.showMessage("¡Sigilo activado!");
            skillUsed = true;
            break;
        case 'Golpe Crítico':
            player.nextAttackIsCritical = true;
            ui.showMessage("¡El próximo ataque será crítico!");
            skillUsed = true;
            break;
        case 'Teletransportación':
            let safe = false;
            let attempts = 0;
            while (!safe && attempts < 100) {
                let tx = Math.floor(Math.random() * mapWidth);
                let ty = Math.floor(Math.random() * mapHeight);
                if (isPassable(tx, ty) && !getMonsterAt(tx, ty)) {
                    player.tileX = tx;
                    player.tileY = ty;
                    safe = true;
                    ui.showMessage("¡Teletransportación!");
                    revealMapAroundPlayer();
                }
                attempts++;
            }
            if (safe) skillUsed = true;
            break;
        case 'Invocar':
            const spawnX = player.tileX - 1;
            const spawnY = player.tileY;
            if (isPassable(spawnX, spawnY, false, null)) {
                const minion = createMonster('minion', spawnX, spawnY, currentFloor);
                minion.state = 'CHASE';
                minion.lastKnownPlayerPosition = { x: player.tileX, y: player.tileY };
                monsters.push(minion);
                ui.showMessage("¡Súbdito invocado!");
                skillUsed = true;
            } else {
                ui.showMessage("No hay espacio para invocar.");
            }
            break;
        case 'Regeneración':
            const healAmount = player.maxHp * 0.75;
            const oldHp = player.hp;
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            const actualHealed = player.hp - oldHp;
            damageTexts.push({ text: `+${Math.floor(actualHealed)}`, x: player.tileX, y: player.tileY, life: 60, color: '#4CAF50', size: 20, velY: -0.01 });
            ui.showMessage("¡Salud restaurada!");
            skillUsed = true;
            break;
        case 'Velocidad':
            player.isSpeedBoosted = true;
            player.speedBoostEndTime = currentTime + 10000;
            updateStats();
            ui.showMessage("¡Velocidad aumentada!");
            skillUsed = true;
            break;
        case 'Invencible':
            player.isInvincible = true;
            player.invincibleEndTime = currentTime + 4000;
            ui.showMessage("¡Invencible!");
            skillUsed = true;
            break;
        case 'Rayo de Hielo':
            monsters.forEach(m => {
                if (getDistance(player.tileX, player.tileY, m.tileX, m.tileY) < 5) {
                    m.isFrozen = true;
                    m.frozenEndTime = currentTime + 5000;
                }
            });
            ui.showMessage("¡Enemigos congelados!");
            skillUsed = true;
            break;
        case 'Suerte':
            player.luckBoostEndTime = currentTime + 10000;
            updateStats();
            ui.showMessage("¡Suerte aumentada!");
            skillUsed = true;
            break;
        case 'Debilidad':
            monsters.forEach(m => {
                if (getDistance(player.tileX, player.tileY, m.tileX, m.tileY) < 6) {
                    m.isWeakened = true;
                    m.weaknessEndTime = currentTime + 8000;
                }
            });
            ui.showMessage("¡Enemigos debilitados!");
            skillUsed = true;
            break;
        case 'Tormenta de Cuchillas':
            const bladeDirections = [
                {dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1},
                {dx: 1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: 1}, {dx: -1, dy: -1}
            ];
            bladeDirections.forEach(dir => {
                projectiles.push(new Projectile(
                    player.tileX, player.tileY, dir.dx, dir.dy, 'blade', 'player',
                    player.atk * 0.5, false, 4
                ));
            });
            skillUsed = true;
            break;
    }

    if (skillUsed) {
        if (skill.cooldown > 0) {
            skillCooldowns[skill.name] = currentTime + skill.cooldown;
        }
    }
}

export function useItem(item) {
    const itemIndex = player.inventory.findIndex(i => i.name === item.name);
    if (itemIndex === -1) return;
    if (item.type === 'potion') {
        if (player.hp < player.maxHp) {
            const oldHp = player.hp;
            player.hp = Math.min(player.maxHp, player.hp + (item.heal || 0));
            ui.showMessage(`Usaste ${item.name} y recuperaste ${Math.floor(player.hp - oldHp)} HP.`);
            player.inventory.splice(itemIndex, 1);
            updateStats();
        } else {
            ui.showMessage("Tu vida ya está al máximo.");
        }
    } else {
        equipItem(item.type, null, item);
    }
}

export function learnSkill(skill) {
    if (player.permanentlyLearnedSkills.includes(skill.name)) {
        ui.showMessage("Esta habilidad ya está desbloqueada.");
    } else if (player.skillPoints >= skill.cost) {
        player.skillPoints -= skill.cost;
        player.permanentlyLearnedSkills.push(skill.name);
        ui.showMessage(`¡Habilidad '${skill.name}' desbloqueada!`);
    } else {
        ui.showMessage("No tienes suficientes puntos de habilidad.");
    }
}

export function equipItem(slotType, direction, specificItem = null) {
    // Logic to equip items
    updateStats();
    loadSprites();
}

export function equipSkill(slotType, direction) {
    // Logic to equip skills
    updateStats();
}

export function resetGame() {
    gameOver = false;
    gameStarted = false;
}