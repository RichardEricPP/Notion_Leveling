// --- gameLogic.js ---
// Contiene la lógica principal del juego: bucle, combate, generación de niveles y estado.
// Adaptado de la versión funcional en 0.Game

// --- IMPORTS ---
import { player, updateStats, checkLevelUp, createPlayerSprite, createMinionSprite } from './player.js';
import * as ui from './ui.js';
import { monsters, chests, sprites, loadedImages, loadSprites } from './enemies.js';
import { gearList, skills } from './data.js';

// --- EXPORTS (Game State Variables) ---
export let currentFloor = 1;
export const maxFloors = 4;
export const mapWidth = 50, mapHeight = 50; // Increased map size
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
    Space: false, KeyE: false, KeyI: false, KeyY: false, KeyO: false, KeyR: false,
    Digit1: false, Digit2: false, Digit3: false
};
export let screenShake = 0;

// --- EXPORTS (Game Mechanics Variables) ---
export let projectiles = [];
export let damageTexts = [];
export let criticalHitEffects = [];
export let warMaceShockwave = null;
export let skillCooldowns = {};
export const fixedProjectileSpeed = 0.15;

let lastMoveTime = 0;
let lastAttackTime = 0;
const monsterAttackInterval = 1000; // Default monster attack speed in ms

// --- Projectile Class ---
export class Projectile {
    constructor(x, y, dx, dy, type, owner = 'player', damage = 0, isCritical = false, maxRangeTiles = 1) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude > 0) {
            this.dx = (dx / magnitude) * fixedProjectileSpeed;
            this.dy = (dy / magnitude) * fixedProjectileSpeed;
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
    // Generate enemy and environmental sprite data URLs
    loadSprites(); 

    // Generate player sprite data URL
    sprites.player = createPlayerSprite();

    const allSpriteKeys = Object.keys(sprites);
    let loadedCount = 0;
    const totalImages = allSpriteKeys.length;

    if (totalImages === 0) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        allSpriteKeys.forEach(key => {
            const img = new Image();
            img.src = sprites[key];
            img.onload = () => {
                loadedImages[key] = img;
                loadedCount++;
                if (key === 'player') {
                    // Create minion sprite after player sprite is loaded
                    sprites.minion = createMinionSprite(loadedImages.player);
                    const minionImg = new Image();
                    minionImg.src = sprites.minion;
                    minionImg.onload = () => {
                        loadedImages.minion = minionImg;
                        // Check if all images (including minion) are loaded
                        if (Object.keys(loadedImages).length === totalImages + 1) { // +1 for minion
                            resolve();
                        }
                    };
                    minionImg.onerror = () => {
                        console.error(`Failed to load minion sprite`);
                        if (Object.keys(loadedImages).length === totalImages + 1) {
                            resolve();
                        }
                    };
                } else if (loadedCount === totalImages) {
                    resolve();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load sprite: ${key}`);
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve(); 
                }
            };
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
        soulExtractionActive: false, furyActive: false,
        baseSpd: 4, baseAtk: 5, baseDef: 5,
        criticalChanceBonus: 0.05,
        invulnerabilityTime: 0,
    });

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
        requestAnimationFrame(gameLoop);
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
    updateProjectiles(currentTime);
    updateMonsters(timestamp);
    criticalHitEffects = criticalHitEffects.filter(effect => effect.life > 0);
    damageTexts = damageTexts.filter(text => text.life > 0);

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

function updateProjectiles(currentTime) {
    projectiles = projectiles.filter(p => {
        if (!p.update()) return false;

        const tileX = Math.floor(p.x);
        const tileY = Math.floor(p.y);

        if (!isPassable(tileX, tileY, true)) { // Allow projectiles to hit walls
            return false;
        }

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
                        player.slowEndTime = currentTime + 3000;
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

function updateMonsters(timestamp) {
    // Monster AI - only move monsters when player is not in menus
    if (!ui.isInventoryOpen && !ui.isSkillMenuOpen && !ui.isEquipmentOpen) { // Added ui.isEquipmentOpen
        const currentTime = timestamp; // Use consistent timestamp
        monsters.forEach(m => {
            if (!m.lastMoveTime) m.lastMoveTime = 0;
            if (!m.lastAttackTime) m.lastAttackTime = 0; // Initialize lastAttackTime for monsters

            // --- STATUS EFFECT UPDATES ---
            if (m.isFrozen && currentTime > m.frozenEndTime) m.isFrozen = false;
            if (m.isWeakened && currentTime > m.weaknessEndTime) m.isWeakened = false;
            if (m.isAttackSlowed && currentTime > m.attackSlowEndTime) m.isAttackSlowed = false;
            if (m.isFrozen) return; // Skip turn if frozen

            // --- BOSS ABILITIES ---
            const distanceToPlayer = getDistance(player.tileX, player.tileY, m.tileX, m.tileY);
            if (m.type === 'finalBoss') {
                if (currentTime - (m.abilityCooldowns.webShot || 0) > 10000 && distanceToPlayer > 1) {
                    const dx = player.tileX - m.tileX;
                    const dy = player.tileY - m.tileY;
                    projectiles.push(new Projectile(m.tileX, m.tileY, dx, dy, 'web', 'monster', m.atk * 0.5, false, 5));
                    ui.showMessage("¡La Araña Jefe lanza una telaraña!");
                    m.abilityCooldowns.webShot = currentTime;
                }
                if (currentTime - (m.abilityCooldowns.summon || 0) > 15000 && distanceToPlayer <= 5) {
                    let spawned = false;
                    for (let i = 0; i < 2; i++) {
                        let spawnX, spawnY, attempts = 0;
                        do {
                            spawnX = m.tileX + (Math.floor(Math.random() * 3) - 1);
                            spawnY = m.tileY + (Math.floor(Math.random() * 3) - 1);
                            attempts++;
                        } while ((!isPassable(spawnX, spawnY) || (spawnX === m.tileX && spawnY === m.tileY)) && attempts < 10);
                        
                        if (isPassable(spawnX, spawnY)) {
                            monsters.push({ type: 'spiderling', hp: 20, maxHp: 20, atk: 10, spd: 2.5, tileX: spawnX, tileY: spawnY, xp: 15, lastMoveTime: 0, hitFrame: 0, lastAttackTime: 0, isMinion: false, attackRange: 1.5, aggroRange: 8, moveSpeed: 400, attackSpeed: 1200 });
                            spawned = true;
                        }
                    }
                    if (spawned) {
                        ui.showMessage("¡La Araña Jefe ha invocado mini-arañas!");
                        m.abilityCooldowns.summon = currentTime;
                    }
                }
            }

            // --- TARGET SELECTION ---
            let target = null;
            if (m.isMinion) {
                let nearestEnemy = null;
                let minDist = Infinity;
                monsters.filter(e => !e.isMinion && e !== m).forEach(enemy => {
                    const dist = getDistance(m.tileX, m.tileY, enemy.tileX, enemy.tileY);
                    if (dist < minDist) {
                        minDist = dist;
                        nearestEnemy = enemy;
                    }
                });
                target = nearestEnemy;
            } else {
                const potentialTargets = monsters.filter(ally => ally.isMinion);
                if (!player.stealthActive) {
                    potentialTargets.push(player);
                }

                if (potentialTargets.length > 0) {
                    let nearestTarget = null;
                    let minDist = Infinity;
                    potentialTargets.forEach(pTarget => {
                        const dist = getDistance(m.tileX, m.tileY, pTarget.tileX, pTarget.tileY);
                        if (dist < minDist) {
                            minDist = dist;
                            nearestTarget = pTarget;
                        }
                    });
                    target = nearestTarget;
                }
            }

            if (!target) return;

            const attackSpeed = m.isAttackSlowed ? m.attackSpeed * 1.5 : m.attackSpeed;

            // --- ATTACK LOGIC ---
            if (distanceToPlayer <= m.attackRange) {
                console.log(`Monster ${m.type} at (${m.tileX}, ${m.tileY}) is in attack range. Distance: ${distanceToPlayer.toFixed(2)}`);
                if (currentTime - m.lastAttackTime > attackSpeed) {
                    console.log(`Monster ${m.type} attacking! Attack Speed: ${attackSpeed}`);
                    // Only apply damage if player is not invulnerable
                    if (currentTime - player.lastHitTime > (player.invulnerabilityTime || 0)) {
                        takeDamage(player, m.atk, false, 'monster'); // Use existing takeDamage function
                        player.lastHitTime = currentTime; // Update player's last hit time
                    }
                    m.lastAttackTime = currentTime; // Update monster's last attack time
                } else {
                    console.log(`Monster ${m.type} attack on cooldown. Time left: ${((attackSpeed - (currentTime - m.lastAttackTime)) / 1000).toFixed(2)}s`);
                }
            }
            // --- MOVEMENT LOGIC ---
            else if (distanceToPlayer < m.aggroRange) {
                console.log(`Monster ${m.type} at (${m.tileX}, ${m.tileY}) is in aggro range but not attack range. Distance: ${distanceToPlayer.toFixed(2)}`);
                if (currentTime - m.lastMoveTime > m.moveSpeed) { // Use monster's moveSpeed
                    console.log(`Monster ${m.type} moving! Move Speed: ${m.moveSpeed}`);
                    const dx = target.tileX - m.tileX;
                    const dy = target.tileY - m.tileY;

                    const moveX = Math.sign(dx);
                    const moveY = Math.sign(dy);

                    const potentialMoves = [];
                    // Prioritize horizontal, then vertical, then diagonal
                    if (moveX !== 0) potentialMoves.push({ x: m.tileX + moveX, y: m.tileY });
                    if (moveY !== 0) potentialMoves.push({ x: m.tileX, y: m.tileY + moveY });
                    if (moveX !== 0 && moveY !== 0) potentialMoves.push({ x: m.tileX + moveX, y: m.tileY + moveY });

                    let moved = false;
                    for (const move of potentialMoves) {
                        if (isPassable(move.x, move.y)) {
                            m.tileX = move.x;
                            m.tileY = move.y;
                            moved = true;
                            break;
                        }
                    }
                    if (!moved) {
                        console.log(`Monster ${m.type} could not find a passable tile to move to.`);
                    }
                    m.lastMoveTime = currentTime;
                } else {
                    console.log(`Monster ${m.type} movement on cooldown. Time left: ${((m.moveSpeed - (currentTime - m.lastMoveTime)) / 1000).toFixed(2)}s`);
                }
            } else {
                console.log(`Monster ${m.type} at (${m.tileX}, ${m.tileY}) is out of aggro range. Distance: ${distanceToPlayer.toFixed(2)}`);
            }
        });
    }
}

async function generateFloor() {
            map = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(0)); 
            stairLocation = { x: -1, y: -1, active: false, type: 4 };
            player.skillUsageThisFloor = {}; 

            let hpMultiplier = 1.0; 
            let atkMultiplier = 1.0;

            if (selectedDifficulty === 'facil') { 
                hpMultiplier = 0.6; 
                atkMultiplier = 0.7; 
            } else if (selectedDifficulty === 'dificil') { 
                hpMultiplier = 1.5; 
                atkMultiplier = 1.35; 
            }

            if (currentFloor === maxFloors) { 
                const arenaWidth = 15; 
                const arenaHeight = 15;
                const arenaX = Math.floor((mapWidth - arenaWidth) / 2);
                const arenaY = Math.floor((mapHeight - arenaHeight) / 2);

                for (let y = 0; y < mapHeight; y++) { 
                    for (let x = 0; x < mapWidth; x++) {
                        map[y][x] = 0;
                    }
                }
                for (let y = arenaY; y < arenaY + arenaHeight; y++) { 
                    for (let x = arenaX; x < arenaX + arenaWidth; x++) {
                        map[y][x] = 1; 
                    }
                    
                }
                player.tileX = arenaX + Math.floor(arenaWidth / 2);
                player.tileY = arenaY + arenaHeight - 2; 

                const bossSpawnX = arenaX + Math.floor(arenaWidth / 2) -1; 
                const bossSpawnY = arenaY + 1;
                
                let finalBossBaseHp = 350; let finalBossBaseAtk = 70;
                let fbHp = Math.floor(finalBossBaseHp * (1 + (currentFloor - 1) * 0.6) * hpMultiplier);
                let fbAtk = Math.floor(finalBossBaseAtk * (1 + (currentFloor - 1) * 0.4) * atkMultiplier);
                monsters.push({ type: 'finalBoss', hp: fbHp, maxHp: fbHp, atk: fbAtk, spd: 0.7, tileX: bossSpawnX, tileY: bossSpawnY, xp: 5000, lastMoveTime: 0, hitFrame: 0, width: 2, height: 2, abilityCooldowns: {webShot:0, summon:0}, lastAttackTime: 0, moveSpeed: 800, attackSpeed: 1000, attackRange: 1.5, aggroRange: 8 }); 
                for(let r=0; r<2; r++) { for(let c=0; c<2; c++) { map[bossSpawnY+r][bossSpawnX+c] = 1;}}

            } else { 
                const rooms = [];
                const numRooms = Math.floor(Math.random() * 3) + 8; 
                const minRoomSize = 4;
                const maxRoomSize = 7; 

                for (let i = 0; i < numRooms; i++) {
                    let roomW, roomH, roomX, roomY;
                    let attempts = 0;
                    let newRoom;
                    let overlaps;

                    do {
                        roomW = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
                        roomH = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
                        roomX = Math.floor(Math.random() * (mapWidth - roomW - 2)) + 1;
                        roomY = Math.floor(Math.random() * (mapHeight - roomH - 2)) + 1;
                        newRoom = { x: roomX, y: roomY, w: roomW, h: roomH, centerX: roomX + Math.floor(roomW/2), centerY: roomY + Math.floor(roomH/2) };
                        
                        overlaps = false;
                        for(const otherRoom of rooms){
                            if(newRoom.x < otherRoom.x + otherRoom.w + 1 && newRoom.x + newRoom.w + 1 > otherRoom.x &&
                                newRoom.y < otherRoom.y + otherRoom.h + 1 && newRoom.y + newRoom.h + 1 > otherRoom.y){
                                overlaps = true;
                                break;
                            }
                        }
                        attempts++;
                    } while (overlaps && attempts < 50); 

                    if (!overlaps || rooms.length < 1) { 
                        rooms.push(newRoom);
                    } else if (i > 0 && attempts >= 50 && rooms.length > 0) {
                        rooms.push(newRoom);
                    }
                }
                
                if (rooms.length === 0) { 
                    rooms.push({
                        x: Math.floor(mapWidth/2) - 3, y: Math.floor(mapHeight/2) - 3, 
                        w: 7, h: 7, 
                        centerX: Math.floor(mapWidth/2), centerY: Math.floor(mapHeight/2)
                    });
                }

                rooms.forEach(room => { 
                    for (let y = room.y; y < room.y + room.h; y++) {
                        for (let x = room.x; x < room.x + room.w; x++) {
                            if (x > 0 && x < mapWidth -1 && y > 0 && y < mapHeight -1) map[y][x] = 1;
                        }
                    }
                });

                for (let i = 0; i < rooms.length - 1; i++) { 
                    carvePathBetweenRooms(rooms[i], rooms[i+1]);
                }

                const playerStartY = rooms[0].centerY;
                const playerStartX = rooms[0].centerX;
                map[playerStartY][playerStartX] = 1; 
                
                const miniBossRoomIndex = rooms.length > 1 ? Math.max(1, Math.floor(rooms.length / 2)) : 0;
                const miniBossY = rooms[miniBossRoomIndex].centerY;
                const miniBossX = rooms[miniBossRoomIndex].centerX;
                map[miniBossY][miniBossX] = 1; 

                const bossRoomIndex = rooms.length -1;
                const bossAreaY = rooms[bossRoomIndex].centerY; 
                const bossAreaX = rooms[bossRoomIndex].centerX;
                map[bossAreaY][bossAreaX] = 1; 

                let stairRoom = rooms.length > 1 ? rooms[rooms.length - (currentFloor === maxFloors -1 ? 2 : 1)] : rooms[0]; 
                if (!stairRoom || (stairRoom.centerX === bossAreaX && stairRoom.centerY === bossAreaY && currentFloor === maxFloors)) { 
                    stairRoom = rooms.find(r => r.centerX !== bossAreaX || r.centerY !== bossAreaY) || rooms[0];
                }
                if (!stairRoom) stairRoom = rooms[0]; 

                stairLocation.x = stairRoom.centerX;
                stairLocation.y = stairRoom.centerY;
                map[stairLocation.y][stairLocation.x] = 1; 

                player.tileX = playerStartX; player.tileY = playerStartY;
                player.hasKey = false; player.doorOpened = false;

                monsters.length = 0;
                const duendeCount = 6 + (currentFloor - 1) * 2; 
                const skeletonCount = 3 + Math.floor((currentFloor - 1) * 1.5);
                const wolfCount = 2 + currentFloor; 

                const monsterSpawnLocations = [];
                for(let y=0; y < mapHeight; y++){ for(let x=0; x < mapWidth; x++){
                    if(map[y][x] === 1 && !(x === playerStartX && y === playerStartY)) {
                        monsterSpawnLocations.push({x,y});
                    }
                }}

                const placeMonster = (type, dropsKey = false) => {
                    if (monsterSpawnLocations.length === 0) return;
                    let spawnIndex = Math.floor(Math.random() * monsterSpawnLocations.length);
                    let loc = monsterSpawnLocations.splice(spawnIndex, 1)[0];
                    if ((loc.x === miniBossX && loc.y === miniBossY) || (loc.x === bossAreaX && loc.y === bossAreaY) || (loc.x === stairLocation.x && loc.y === stairLocation.y)) {
                        if (monsterSpawnLocations.length > 0) placeMonster(type, dropsKey); 
                        return;
                    }
                    const monster = createMonster(type, loc.x, loc.y, currentFloor);
                    if (dropsKey) monster.dropsKey = true;
                    monsters.push(monster); 
                };
                
                for (let i = 0; i < duendeCount; i++) placeMonster('duende');
                for (let i = 0; i < wolfCount; i++) placeMonster('lobo');
                for (let i = 0; i < skeletonCount; i++) placeMonster('skeleton');
                
                monsters.push(createMonster('miniBoss', miniBossX, miniBossY, currentFloor, true));
                
                monsters.push(createMonster('boss', bossAreaX, bossAreaY, currentFloor)); 
                
                chests.length = 0; spawnChests(monsterSpawnLocations); 
            }
            await loadSprites(); 

            if (monsters.some(m => m.type === 'final-arachnid-boss')) {
                playMusic('boss');
            } else {
                playMusic('dungeon');
            }
}

function carvePathBetweenRooms(room1, room2) {
    const x1 = room1.centerX;
    const y1 = room1.centerY;
    const x2 = room2.centerX;
    const y2 = room2.centerY;

    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        map[y1][x] = 1;
    }
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        map[y][x2] = 1;
    }
}



function createMonster(type, x, y, floor) {
    let monster = {
        tileX: x, tileY: y, type: type, isMinion: false,
        hp: 0, maxHp: 0, atk: 0, def: 0, spd: 0, xp: 0,
        moveSpeed: 100, attackSpeed: 1000,         aggroRange: 100, attackRange: 1.5,
        lastMoveTime: 0, lastAttackTime: 0, hitFrame: 0,
        isFrozen: false, frozenEndTime: 0,
        isWeakened: false, weaknessEndTime: 0,
        isBleeding: false, bleedingEndTime: 0,
        isAttackSlowed: false, attackSlowEndTime: 0
    };

    let hpMultiplier = 1.0, atkMultiplier = 1.0;
    if (selectedDifficulty === 'facil') { hpMultiplier = 0.7; atkMultiplier = 0.8; }
    else if (selectedDifficulty === 'dificil') { hpMultiplier = 1.4; atkMultiplier = 1.2; }

    const floorMultiplier = 1 + (floor - 1) * 0.25;

    switch (type) {
        case 'duende':
            monster.maxHp = Math.floor((20 + floor * 4) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((5 + floor * 2) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((2 + floor * 1) * floorMultiplier);
            monster.xp = 10 + floor * 2;
            monster.moveSpeed = 450;
            monster.attackSpeed = 1000;
            break;
        case 'lobo':
            monster.maxHp = Math.floor((30 + floor * 6) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((8 + floor * 3) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((3 + floor * 1.5) * floorMultiplier);
            monster.xp = 15 + floor * 3;
            monster.moveSpeed = 350;
            monster.attackSpeed = 800;
            break;
        case 'skeleton':
            monster.maxHp = Math.floor((40 + floor * 8) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((10 + floor * 4) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((5 + floor * 2) * floorMultiplier);
            monster.xp = 20 + floor * 4;
            monster.moveSpeed = 600;
            monster.attackSpeed = 1200;
            break;
        case 'miniBoss':
            monster.maxHp = Math.floor((100 + floor * 10) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((15 + floor * 5) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((10 + floor * 3) * floorMultiplier);
            monster.xp = 100 + floor * 10;
            monster.moveSpeed = 700;
            monster.attackSpeed = 900;
            break;
        case 'boss':
            monster.maxHp = Math.floor((200 + floor * 20) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((25 + floor * 8) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((15 + floor * 5) * floorMultiplier);
            monster.xp = 300 + floor * 20;
            monster.moveSpeed = 100;
            monster.attackSpeed = 1000;
            break;
    }
    monster.hp = monster.maxHp;
    
    return monster;
}

function spawnChests(spawnLocations) {
    let numChestsToSpawn;
    if (selectedDifficulty === 'facil') {
        numChestsToSpawn = Math.floor(Math.random() * 3) + 1;
    } else if (selectedDifficulty === 'medio') {
        numChestsToSpawn = Math.floor(Math.random() * 2) + 1;
    } else if (selectedDifficulty === 'dificil') {
        numChestsToSpawn = Math.floor(Math.random() * 3);
    }

    for (let i = spawnLocations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [spawnLocations[i], spawnLocations[j]] = [spawnLocations[j], spawnLocations[i]];
    }

    for (let i = 0; i < numChestsToSpawn && i < spawnLocations.length; i++) {
        const loc = spawnLocations[i];
        if (map[loc.y][loc.x] === 1) {
            map[loc.y][loc.x] = 2;
            chests.push({ tileX: loc.x, tileY: loc.y, opened: false });
        }
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
        if (chest) {
            openChest(chest);
        }

    if (isPassable(newX, newY)) {
        player.tileX = newX;
        player.tileY = newY;
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

        if (Math.abs(dx) > Math.abs(dy)) {
            player.facingDirection = dx > 0 ? 'right' : 'left';
        } else {
            player.facingDirection = dy > 0 ? 'down' : 'up';
        }
    }

    player.isAttacking = true;
    player.attackAnimFrame = 0;

    const equippedWeapon = player.equipped.weapon;
    let targetTiles = [];

    if (player.facingDirection === 'right') targetTiles.push({ x: player.tileX + 1, y: player.tileY });
    else if (player.facingDirection === 'left') targetTiles.push({ x: player.tileX - 1, y: player.tileY });
    else if (player.facingDirection === 'up') targetTiles.push({ x: player.tileX, y: player.tileY - 1 });
    else if (player.facingDirection === 'down') targetTiles.push({ x: player.tileX, y: player.tileY + 1 });

    for (const targetCoord of targetTiles) {
        const monster = getMonsterAt(targetCoord.x, targetCoord.y);
        if (monster) {
            let isCritical = player.nextHitCritical || (Math.random() < (player.criticalChanceBonus || 0));
            let damage = player.atk;
            if (isCritical) {
                damage *= 1.5; 
            }
            takeDamage(monster, damage, isCritical, 'player');
            player.nextHitCritical = false;
        }
    }
}

function openChest(chest) {
    if (chest.opened) return;
    chest.opened = true;
    map[chest.tileY][chest.tileX] = 1;
    const potions = gearList.filter(item => item.type === 'potion');
    if (potions.length > 0) {
        const item = potions[Math.floor(Math.random() * potions.length)];
        player.inventory.push(item);
        useItem(item);
    }
}

function getChestAt(x, y) {
    return chests.find(chest => chest.tileX === x && chest.tileY === y);
}

function isPassable(x, y, forProjectiles = false) {
    if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth) {
        return false;
    }
    if (map[y] && (map[y][x] === 1 || map[y][x] === 2)) {
        if (forProjectiles) return true; // Projectiles can fly over entities
        if (x === player.tileX && y === player.tileY) {
            return false;
        }
        if (monsters.some(m => m.tileX === x && m.tileY === y)) {
            return false;
        }
        return true;
    }
    return false;
}

function getMonsterAt(x, y) {
    return monsters.find(m => m.tileX === x && m.tileY === y);
}

function takeDamage(target, damage, isCritical, attackerType = 'player') {
    const defenseReduction = Math.min(0.75, (target.def || 0) * 0.03);
    let actualDamage = Math.max(1, Math.floor(damage * (1 - defenseReduction)));

    if (target === player && player.hasMiniShield && player.miniShieldHP > 0) {
        const damageAbsorbed = Math.min(player.miniShieldHP, actualDamage);
        player.miniShieldHP -= damageAbsorbed;
        actualDamage -= damageAbsorbed;
        if (player.miniShieldHP <= 0) {
            ui.showMessage("¡Tu mini escudo se ha roto!");
        }
    }

    if (actualDamage > 0) {
        target.hp -= actualDamage;
    }

    let damageColor = attackerType === 'player' ? (isCritical ? '#ff0000' : '#ffffff') : '#ff0000';
    damageTexts.push({
        text: Math.floor(actualDamage).toString(),
        x: target.tileX,
        y: target.tileY,
        life: 60,
        color: damageColor,
        size: isCritical ? 24 : 18,
        velY: -0.01
    });

    if (isCritical && attackerType === 'player') {
        criticalHitEffects.push({ x: target.tileX, y: target.tileY, life: 15, size: 50 });
        damageTexts.push({
            text: 'CRÍTICO!',
            x: target.tileX,
            y: target.tileY - 0.5,
            life: 60,
            color: '#ff0000',
            size: 20,
            velY: -0.015
        });
    }
    
    if (target === player) {
        player.hitFrame = 8;
        player.lastHitTime = Date.now();
    }

    if (target.hp <= 0) {
        if (target === player) {
            gameOver = true;
            finalOutcomeMessage = "¡Has sido derrotado!";
            lastGameScore = calculateScore();
            lastEnemiesDefeated = player.enemiesDefeatedThisRun;
        } else {
            
            const xpGain = target.xp || 10;
            player.xp += xpGain;
            player.enemiesDefeatedThisRun++;
            checkLevelUp();
            
            const monsterIndex = monsters.indexOf(target);
            if (monsterIndex > -1) {
                monsters.splice(monsterIndex, 1);
            }

            const remainingMonsters = monsters.filter(m => !m.isMinion);
            
            if (remainingMonsters.length === 0) {
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
    if (!skill) return;
    const isSkillEquipped = player.equipped.habilidad1 === skillName ||
                              player.equipped.habilidad2 === skillName ||
                              player.equipped.habilidad3 === skillName;
    if (player.skillUsageThisFloor[skillName]) {
        ui.showMessage("Ya has usado esta habilidad en este piso.");
        return;
    }
    const currentTime = Date.now();
    if (skillCooldowns[skillName] && skillCooldowns[skillName] > currentTime) {
        ui.showMessage(`Habilidad en enfriamiento. Tiempo restante: ${((skillCooldowns[skill.name] - currentTime) / 1000).toFixed(1)}s`);
        return;
    }
    switch (skillName) {
        case 'Sigilo':
            player.stealthActive = true; 
            player.stealthEndTime = currentTime + 7000; 
            player.stealthStatMultiplier = 0.5;
            updateStats(); 
            ui.showMessage("¡Te has vuelto sigiloso!");
            break;
        case 'Golpe Crítico':
            player.nextHitCritical = true;
            ui.showMessage("¡Tu próximo golpe será crítico!");
            break;
        case 'Teletransportación':
            let newX, newY;
            let attempts = 0;
            do {
                newX = Math.floor(Math.random() * mapWidth);
                newY = Math.floor(Math.random() * mapHeight);
                attempts++;
            } while (map[newY][newX] !== 1 && attempts < 100); 
            if (map[newY][newX] === 1) {
                player.tileX = newX;
                player.tileY = newY;
                ui.showMessage("¡Teletransportación exitosa!");
            } else {
                ui.showMessage("No se pudo teletransportar a un lugar seguro.");
            }
            break;
        case 'Invocar':
            const minionHp = Math.floor(player.maxHp * 0.25);
            const minionAtk = Math.floor(player.atk * 0.25);
            const minionSpd = player.spd * 0.75; 
            
            let spawnX = player.tileX;
            let spawnY = player.tileY;
            let foundSpot = false;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const checkX = player.tileX + dx;
                    const checkY = player.tileY + dy;
                    if (checkX >= 0 && checkX < mapWidth && checkY >= 0 && checkY < mapHeight &&
                        map[checkY][checkX] === 1 &&
                        !monsters.some(m => m.tileX === checkX && m.tileY === checkY)) {
                        spawnX = checkX;
                        spawnY = checkY;
                        foundSpot = true;
                        break;
                    }
                }
                if (foundSpot) break;
            }
            if (foundSpot) {
                monsters.push({ type: 'minion', hp: minionHp, maxHp: minionHp, atk: minionAtk, spd: minionSpd, tileX: spawnX, tileY: spawnY, xp: 0, lastMoveTime: 0, hitFrame: 0, isMinion: true, lastAttackTime: 0, spawnTime: currentTime, duration: 30000 }); 
                ui.showMessage("¡Un súbdito leal ha sido invocado!");
            } else {
                ui.showMessage("No hay espacio para invocar un súbdito.");
            }
            break;
        case 'Regeneración':
            const healedAmount = Math.floor(player.maxHp * 0.5);
            player.hp = Math.min(player.maxHp, player.hp + healedAmount);
            ui.showMessage(`¡Has regenerado ${healedAmount} HP!`);
            break;
        case 'Velocidad':
            player.isSpeedBoosted = true;
            player.speedBoostEndTime = currentTime + 5000; 
            player.spd *= 1.5; 
            ui.showMessage("¡Velocidad aumentada!");
            break;
        case 'Invencible':
            player.isInvincible = true;
            player.invincibleEndTime = currentTime + 3000; 
            ui.showMessage("¡Eres invencible!");
            break;
        case 'Rayo de Hielo':
            let nearestMonster = null;
            let minDist = Infinity;
            monsters.filter(m => !m.isMinion).forEach(m => {
                const dist = Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY);
                if (dist < minDist && dist > 0) { 
                    minDist = dist;
                    nearestMonster = m;
                }
            });
            if (nearestMonster) {
                nearestMonster.isFrozen = true;
                nearestMonster.frozenEndTime = currentTime + 5000; 
                ui.showMessage(`¡${nearestMonster.type} ha sido congelado!`);
            } else {
                ui.showMessage("No hay enemigos cerca para congelar.");
            }
            break;
        case 'Suerte':
            player.luckBoostEndTime = currentTime + 10000; 
            ui.showMessage("¡Tu suerte ha aumentado!");
            break;
        case 'Debilidad':
            monsters.filter(m => !m.isMinion).forEach(m => {
                const dist = Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY);
                if (dist <= 3) { 
                    m.isWeakened = true;
                    m.weaknessEndTime = currentTime + 8000; 
                    ui.showMessage(`¡${m.type} ha sido debilitado!`);
                }
            });
            if (!monsters.some(m => !m.isMinion && Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY) <= 3)) {
                ui.showMessage("No hay enemigos cerca para debilitar.");
            }
            break;
        case 'Furia': 
            player.furyActive = true;
            ui.showMessage("Habilidad Furia activada (pasiva).");
            break;
        case 'Extracción de Almas': 
            player.soulExtractionActive = true;
            ui.showMessage("Habilidad Extracción de Almas activada (pasiva).");
            break;
    }
    if (skill.cooldown > 0) {
        skillCooldowns[skill.name] = currentTime + skill.cooldown;
    }
    if (skill.cooldown !== 0) { 
        player.skillUsageThisFloor[skill.name] = true; 
    }
}

export function useItem(item) {
    const itemIndex = player.inventory.findIndex(i => i.name === item.name);
    if (itemIndex === -1) return;

    if (item.type === 'potion') {
        if (player.hp < player.maxHp) {
            const oldHp = player.hp;
            const healedAmount = item.heal || 0;
            player.hp = Math.min(player.maxHp, player.hp + healedAmount);
            const actualHealedAmount = player.hp - oldHp;
            ui.showMessage(`Usaste ${item.name} y recuperaste ${Math.floor(actualHealedAmount)} HP.`);
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
    if (specificItem) {
        const currentEquipped = player.equipped[slotType];
        if (currentEquipped && currentEquipped.name === specificItem.name) {
            player.equipped[slotType] = null;
        } else {
            player.equipped[slotType] = specificItem;
        }
    } else {
        const inventoryItemsForSlot = player.inventory.filter(item => item.type === slotType);
        const potentialEquipment = [null, ...inventoryItemsForSlot];
        const equippedItem = player.equipped[slotType];
        const currentIndex = equippedItem 
            ? potentialEquipment.findIndex(i => i && i.name === equippedItem.name)
            : 0;

        let nextIndex = currentIndex;
        if (direction === 'right') {
            nextIndex = (currentIndex + 1) % potentialEquipment.length;
        } else if (direction === 'left') {
            nextIndex = (currentIndex - 1 + potentialEquipment.length) % potentialEquipment.length;
        }

        player.equipped[slotType] = potentialEquipment[nextIndex];
    }
    updateStats();
    loadSprites();
}

export function equipSkill(slotType, direction) {
    const availableSkillsForSlot = skills.filter(s => s.type === 'active');
    const equippedSkillName = player.equipped[slotType];
    const currentIndex = equippedSkillName ? availableSkillsForSlot.findIndex(s => s.name === equippedSkillName) : -1;

    let nextIndex = currentIndex + (direction === 'right' ? 1 : -1);

    if (nextIndex >= availableSkillsForSlot.length) {
        nextIndex = -1;
    } else if (nextIndex < -1) {
        nextIndex = availableSkillsForSlot.length - 1;
    }

    player.equipped[slotType] = nextIndex === -1 ? null : availableSkillsForSlot[nextIndex].name;
    updateStats();
}

export function resetGame() {
    gameOver = false;
    gameStarted = false;
}