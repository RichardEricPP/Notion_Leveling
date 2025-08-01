// --- gameLogic.js ---
// Contiene la lógica principal del juego: bucle, combate, generación de niveles y estado.
// Adaptado de la versión funcional en 0.Game

// --- IMPORTS ---
import { player, updateStats, checkLevelUp, createPlayerSprite, createMinionSprite, activeSetBonusName } from './player.js';
import * as ui from './ui.js';
import { monsters, chests, sprites, loadedImages, loadSprites } from './enemies.js';
import { gearList, skills } from './data.js';
import { playMusic, gameCanvas } from './ui.js';

// --- EXPORTS (Game State Variables) ---
export let currentFloor = 1;
export const maxFloors = 4;
export const mapWidth = 40, mapHeight = 40; // Reduced map size for shorter corridors
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
const monsterAttackInterval = 1000; // Default monster attack speed in ms

// --- Projectile Class ---
export class Projectile {
    constructor(x, y, dx, dy, type, owner = 'player', damage = 0, isCritical = false, maxRangeTiles = 1, speedMultiplier = 1) {
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
    // Generate enemy and environmental sprite data URLs
    loadSprites(); 

    // Generate player sprite data URL
    sprites.player = createPlayerSprite();

    const allSpriteKeys = Object.keys(sprites);
    let loadedCount = 0;
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
                    // Create minion sprite after player sprite is loaded
                    sprites.minion = createMinionSprite(loadedImages.player);
                    imagesToLoad++; // Increment total count for minion
                    const minionImg = new Image();
                    minionImg.src = sprites.minion;
                    minionImg.onload = () => {
                        loadedImages.minion = minionImg;
                        checkAllLoaded();
                    };
                    minionImg.onerror = () => {
                        console.error(`Failed to load minion sprite`);
                        checkAllLoaded();
                    };
                }
                checkAllLoaded();
            };
            img.onerror = () => {
                console.error(`Failed to load sprite: ${key}`);
                checkAllLoaded(); // Still call checkAllLoaded even on error
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
        baseSpd: 4, baseAtk: 5, baseDef: 5,
        criticalChanceBonus: 0.05,
        invulnerabilityTime: 0,
        darkRayEnemiesDefeated: 0,
        hitsSinceLastSoulExtraction: 0,
        _furyEffectApplied: false,
        secondWindUsedThisRun: false
    });

    revealedMap = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(false));

    

    updateStats(); 
    player.hp = player.maxHp; 
    revealMapAroundPlayer(); 

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
    tryMove(0,0); // Simulate a move to reveal the starting room
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

    if (warMaceShockwave) {
        warMaceShockwave.life--;
        if (warMaceShockwave.life <= 0) {
            warMaceShockwave = null;
        }
    }

    if (screenShake > 0) {
        screenShake--;
    }

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
                const projectileDamage = p.damage;
                takeDamage(monster, projectileDamage, p.isCritical, 'player');
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
    if (!ui.isInventoryOpen && !ui.isSkillMenuOpen && !ui.isEquipmentOpen) {
        const currentTime = timestamp;
        monsters.forEach(m => {
            if (!m.lastMoveTime) m.lastMoveTime = 0;
            if (!m.lastAttackTime) m.lastAttackTime = 0;

            if (m.isFrozen && currentTime > m.frozenEndTime) m.isFrozen = false;
            if (m.isWeakened && currentTime > m.weaknessEndTime) m.isWeakened = false;
            if (m.isAttackSlowed && currentTime > m.attackSlowEndTime) m.isAttackSlowed = false;
            if (m.isFrozen) return;

            if (m.isAttackingPlayer) {
                m.attackAnimFrame++;
                if (m.attackAnimFrame >= m.attackAnimDuration) {
                    m.isAttackingPlayer = false;
                    m.attackAnimFrame = 0;
                }
            }

            const bossCenter = m.type === 'finalBoss' ? { x: m.tileX + 0.5, y: m.tileY + 0.5 } : { x: m.tileX, y: m.tileY };
            const distanceToPlayer = getDistance(bossCenter.x, bossCenter.y, player.tileX, player.tileY);
            const canSeePlayer = hasLineOfSight(m, player);

            // State transitions
            switch (m.state) {
                case 'PATROL':
                    if (canSeePlayer && distanceToPlayer < m.aggroRange) {
                        m.state = 'CHASE';
                        m.lastKnownPlayerPosition = { x: player.tileX, y: player.tileY };
                        monsters.forEach(otherMonster => {
                            if (otherMonster !== m && otherMonster.state === 'PATROL' && getDistance(m.tileX, m.tileY, otherMonster.tileX, otherMonster.tileY) < 5) {
                                otherMonster.state = 'CHASE';
                                otherMonster.lastKnownPlayerPosition = { x: player.tileX, y: player.tileY };
                            }
                        });
                    }
                    break;
                case 'CHASE':
                    if (!canSeePlayer) {
                        m.state = 'SEARCH';
                    } else if (distanceToPlayer <= m.attackRange) {
                        m.state = 'ATTACK';
                    } else {
                        m.lastKnownPlayerPosition = { x: player.tileX, y: player.tileY };
                    }
                    break;
                case 'ATTACK':
                    if (distanceToPlayer > m.attackRange) {
                        m.state = 'CHASE';
                    }
                    break;
                case 'SEARCH':
                    if (canSeePlayer) {
                        m.state = 'CHASE';
                    } else if (m.tileX === m.lastKnownPlayerPosition.x && m.tileY === m.lastKnownPlayerPosition.y) {
                        m.state = 'PATROL';
                    }
                    break;
            }

            // --- Final Boss Ability Usage ---
            if (m.type === 'finalBoss') {
                // Use Web Shot
                if (currentTime - (m.abilityCooldowns.webShot || 0) > 4000 && distanceToPlayer > 2) {
                    const dx = player.tileX - bossCenter.x;
                    const dy = player.tileY - bossCenter.y;
                    projectiles.push(new Projectile(bossCenter.x, bossCenter.y, dx, dy, 'web', 'monster', m.atk * 0.5, false, 5));
                    ui.showMessage("¡La Araña Jefe lanza una telaraña!");
                    m.abilityCooldowns.webShot = currentTime;
                }
                // Use Summon
                if (currentTime - (m.abilityCooldowns.summon || 0) > 8000) {
                    let spawned = 0;
                    for (let i = 0; i < 15 && spawned < 4; i++) { // Try up to 15 times
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
                    }
                }
            }

            // --- Movement and Attack Logic ---
            // Attack
            const attackSpeed = m.isAttackSlowed ? m.attackSpeed * 1.5 : m.attackSpeed;
            if (m.state === 'ATTACK' && currentTime - m.lastAttackTime > attackSpeed) {
                if (currentTime - player.lastHitTime > (player.invulnerabilityTime || 0)) {
                    takeDamage(player, m.atk, false, 'monster');
                    player.lastHitTime = currentTime;
                    m.isAttackingPlayer = true;
                    m.attackAnimFrame = 0;
                    m.attackDirectionX = Math.sign(player.tileX - m.tileX);
                    m.attackDirectionY = Math.sign(player.tileY - m.tileY);
                    m.lastAttackTime = currentTime;
                }
            } 
            // Movement
            else if (currentTime - m.lastMoveTime > m.moveSpeed) {
                let moved = false;
                switch (m.state) {
                    case 'PATROL':
                        const moves = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
                        const move = moves[Math.floor(Math.random() * moves.length)];
                        const newX = m.tileX + move.x;
                        const newY = m.tileY + move.y;
                        if (isPassable(newX, newY, false, m)) {
                            m.tileX = newX;
                            m.tileY = newY;
                            moved = true;
                        }
                        break;
                    case 'CHASE':
                    case 'SEARCH':
                        let targetPos = (m.state === 'CHASE') ? findOptimalAttackPosition(m, player) : m.lastKnownPlayerPosition;
                        if (!targetPos) {
                            targetPos = m.lastKnownPlayerPosition;
                        }
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
                    m.lastMoveTime = currentTime;
                }
            }
        });
    }
}

async function generateFloor() {
            map = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(0)); 
            stairLocation = { x: -1, y: -1, active: false, type: 4 };
            Object.keys(player.skillUsageThisFloor).forEach(key => delete player.skillUsageThisFloor[key]);
            monsters.length = 0; // Changed from monsters = [];
            revealedMap = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(false));

            var hpMultiplier = 1.0; 
            var atkMultiplier = 1.0;

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
                stairLocation.x = player.tileX;
                stairLocation.y = player.tileY; 

                const bossSpawnX = arenaX + Math.floor(arenaWidth / 2) -1; 
                const bossSpawnY = arenaY + 1;
                
                let finalBossBaseHp = 350; let finalBossBaseAtk = 70;
                let fbHp = Math.floor(finalBossBaseHp * (1 + (currentFloor - 1) * 0.6) * hpMultiplier);
                let fbAtk = Math.floor(finalBossBaseAtk * (1 + (currentFloor - 1) * 0.4) * atkMultiplier);
                monsters.push(createMonster('finalBoss', bossSpawnX, bossSpawnY, currentFloor));
                for(let r=0; r<2; r++) { for(let c=0; c<2; c++) { map[bossSpawnY+r][bossSpawnX+c] = 1;}}

            } else { 
                const rooms = [];
                const numRooms = Math.floor(Math.random() * 3) + 8; 
                const minRoomSize = 5; // Adjusted from 4
                const maxRoomSize = 8; // Adjusted from 7

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
                            if(newRoom.x < otherRoom.x + otherRoom.w && newRoom.x + newRoom.w > otherRoom.x && // Adjusted for shorter corridors
                                newRoom.y < otherRoom.y + otherRoom.h && newRoom.y + newRoom.h > otherRoom.y){ // Adjusted for shorter corridors
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
                            // Ensure coordinates are within map bounds before setting to 1
                            if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
                                map[y][x] = 1;
                            }
                        }
                    }
                });

                for (let i = 0; i < rooms.length - 1; i++) { 
                    carvePathBetweenRooms(rooms[i], rooms[i+1]);
                }
                if (rooms.length > 1) { 
                    for(let i = 1; i < rooms.length; i++){ 
                            carvePathBetweenRooms(rooms[0], rooms[i]);
                    }
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
            await loadAllSprites(); // Changed from loadSprites()

            if (monsters.some(m => m.type === 'finalBoss')) { // Changed type to finalBoss
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

function hasLineOfSight(monster, target) {
    let x0 = monster.tileX;
    let y0 = monster.tileY;
    if (monster.type === 'finalBoss') {
        x0 = monster.tileX + 0.5;
        y0 = monster.tileY + 0.5;
    }
    const x1 = target.tileX;
    const y1 = target.tileY;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        if (Math.floor(x0) === x1 && Math.floor(y0) === y1) {
            return true;
        }
        if (map[Math.floor(y0)][Math.floor(x0)] === 0) { // Wall
            return false;
        }

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function findOptimalAttackPosition(monster, target) {
    const attackPositions = [];
    const monsterWidth = monster.width || 1;
    const monsterHeight = monster.height || 1;

    for (let y = -monsterHeight; y <= 1; y++) {
        for (let x = -monsterWidth; x <= 1; x++) {
            if (x >= 0 && x < monsterWidth && y >= 0 && y < monsterHeight) continue;

            const tileX = target.tileX + x;
            const tileY = target.tileY + y;
            if (isPassable(tileX, tileY, false, monster)) {
                let isOccupied = false;
                for (const other of monsters) {
                    if (other !== monster && other.tileX === tileX && other.tileY === tileY) {
                        isOccupied = true;
                        break;
                    }
                }
                if (!isOccupied) {
                    attackPositions.push({ x: tileX, y: tileY });
                }
            }
        }
    }

    attackPositions.sort((a, b) => {
        const distA = getDistance(monster.tileX, monster.tileY, a.x, a.y);
        const distB = getDistance(monster.tileX, monster.tileY, b.x, b.y);
        return distA - distB;
    });

    return attackPositions[0] || null;
}

function createMonster(type, x, y, floor) {
    let monster = {
        tileX: x, tileY: y, type: type, isMinion: false,
        hp: 0, maxHp: 0, atk: 0, def: 0, spd: 0, xp: 0,
        moveSpeed: 100, attackSpeed: 1000, aggroRange: 5, attackRange: 1.5,
        lastMoveTime: 0, lastAttackTime: 0, hitFrame: 0,
        isFrozen: false, frozenEndTime: 0,
        isWeakened: false, weaknessEndTime: 0,
        isBleeding: false, bleedingEndTime: 0,
        isAttackSlowed: false, attackSlowEndTime: 0,
        isAttackingPlayer: false, attackAnimFrame: 0, attackAnimDuration: 7, attackLungeDistance: 12.5,
        attackDirectionX: 0, attackDirectionY: 0,
        isFirstAttack: true, // New property
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
            monster.def = Math.floor((2 + floor * 1) * floorMultiplier);
            monster.xp = 10 + floor * 2;
            monster.moveSpeed = 450;
            monster.attackSpeed = 1000;
            monster.attackAnimDuration = 8; // Faster attack
            monster.attackLungeDistance = 10; // Shorter lunge
            break;
        case 'lobo':
            monster.maxHp = Math.floor((30 + floor * 6) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((8 + floor * 3) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((3 + floor * 1.5) * floorMultiplier);
            monster.xp = 15 + floor * 3;
            monster.moveSpeed = 350;
            monster.attackSpeed = 800;
            monster.attackAnimDuration = 6; // Very fast attack
            monster.attackLungeDistance = 15; // Medium lunge
            break;
        case 'skeleton':
            monster.maxHp = Math.floor((40 + floor * 8) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((10 + floor * 4) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((5 + floor * 2) * floorMultiplier);
            monster.xp = 20 + floor * 4;
            monster.moveSpeed = 600;
            monster.attackSpeed = 1200;
            monster.attackAnimDuration = 10; // Slower attack
            monster.attackLungeDistance = 8; // Shorter lunge
            break;
        case 'miniBoss':
            monster.maxHp = Math.floor((100 + floor * 10) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((15 + floor * 5) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((10 + floor * 3) * floorMultiplier);
            monster.xp = 100 + floor * 10;
            monster.moveSpeed = 700;
            monster.attackSpeed = 900;
            monster.attackAnimDuration = 12; // Slower, more impactful
            monster.attackLungeDistance = 20; // Longer lunge
            break;
        case 'boss':
            monster.maxHp = Math.floor((200 + floor * 20) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((25 + floor * 8) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((15 + floor * 5) * floorMultiplier);
            monster.xp = 300 + floor * 20;
            monster.moveSpeed = 400; // Reduced from 100
            monster.attackSpeed = 1000;
            monster.attackAnimDuration = 15; // Very slow, very impactful
            monster.attackLungeDistance = 25; // Very long lunge
            break;
        case 'finalBoss':
            monster.width = 2;
            monster.height = 2;
            monster.maxHp = Math.floor((350 + floor * 30) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((70 + floor * 10) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((20 + floor * 5) * floorMultiplier);
            monster.xp = 5000;
            monster.moveSpeed = 800;
            monster.attackSpeed = 1000;
            monster.attackAnimDuration = 18;
            monster.attackLungeDistance = 30;
            monster.attackRange = 2.5; // Increased range to account for size
            monster.aggroRange = 10;
            monster.abilityCooldowns = { webShot: 0, summon: 0 };
            break;
        case 'spiderling':
            monster.maxHp = Math.floor((15 + floor * 2) * hpMultiplier * floorMultiplier);
            monster.atk = Math.floor((7 + floor * 1) * atkMultiplier * floorMultiplier);
            monster.def = Math.floor((1 + floor * 0.5) * floorMultiplier);
            monster.xp = 8 + floor * 1;
            monster.moveSpeed = 300;
            monster.attackSpeed = 700;
            monster.attackAnimDuration = 5; // Quick, small lunge
            monster.attackLungeDistance = 8;
            break;
        case 'minion':
            // Minions inherit player stats, so their attack animation will be based on player's
            monster.attackAnimDuration = player.attackAnimDuration;
            monster.attackLungeDistance = player.attackLungeDistance;
            break;
    }
    monster.hp = monster.maxHp;
    
    return monster;
}

function spawnChests(spawnLocations) {
    let numChestsToSpawn;
    if (selectedDifficulty === 'facil') {
        numChestsToSpawn = 3;
    } else if (selectedDifficulty === 'medio') {
        numChestsToSpawn = Math.floor(Math.random() * 3) + 1; // 1 to 3 chests
    } else if (selectedDifficulty === 'dificil') {
        numChestsToSpawn = Math.floor(Math.random() * 3); // 0 to 2 chests
    }

    const smallPotion = gearList.find(item => item.name === 'Poción de Vida Pequeña');
    const mediumPotion = gearList.find(item => item.name === 'Poción de Vida Mediana');
    const largePotion = gearList.find(item => item.name === 'Poción de Vida Grande');

    const getWeightedRandomPotion = () => {
        let potionsPool = [];
        if (selectedDifficulty === 'facil') {
            potionsPool = [
                ...Array(1).fill(smallPotion),
                ...Array(2).fill(mediumPotion),
                ...Array(5).fill(largePotion) 
            ];
        } else if (selectedDifficulty === 'medio') {
            potionsPool = [
                ...Array(2).fill(smallPotion),
                ...Array(3).fill(mediumPotion),
                ...Array(2).fill(largePotion) 
            ];
        } else if (selectedDifficulty === 'dificil') {
            potionsPool = [
                ...Array(5).fill(smallPotion),
                ...Array(2).fill(mediumPotion),
                ...Array(1).fill(largePotion) 
            ];
        }
        return potionsPool[Math.floor(Math.random() * potionsPool.length)];
    };

    for (let i = spawnLocations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [spawnLocations[i], spawnLocations[j]] = [spawnLocations[j], spawnLocations[i]];
    }

    for (let i = 0; i < numChestsToSpawn && i < spawnLocations.length; i++) {
        const loc = spawnLocations[i];
        if (map[loc.y][loc.x] === 1) {
            map[loc.y][loc.x] = 2;
            const potion = getWeightedRandomPotion();
            chests.push({ tileX: loc.x, tileY: loc.y, opened: false, item: potion });
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
        revealMapAroundPlayer();
    }
}

function revealMapAroundPlayer() {
    const tilesToReveal = [];
    const px = player.tileX;
    const py = player.tileY;

    // Always reveal player's current tile
    tilesToReveal.push({ x: px, y: py });

    switch (player.facingDirection) {
        case 'up':
            tilesToReveal.push({ x: px, y: py - 1 });
            tilesToReveal.push({ x: px, y: py - 2 });
            tilesToReveal.push({ x: px - 1, y: py - 1 });
            tilesToReveal.push({ x: px + 1, y: py - 1 });
            tilesToReveal.push({ x: px - 1, y: py - 2 });
            tilesToReveal.push({ x: px + 1, y: py - 2 });
            break;
        case 'down':
            tilesToReveal.push({ x: px, y: py + 1 });
            tilesToReveal.push({ x: px, y: py + 2 });
            tilesToReveal.push({ x: px - 1, y: py + 1 });
            tilesToReveal.push({ x: px + 1, y: py + 1 });
            tilesToReveal.push({ x: px - 1, y: py + 2 });
            tilesToReveal.push({ x: px + 1, y: py + 2 });
            break;
        case 'left':
            tilesToReveal.push({ x: px - 1, y: py });
            tilesToReveal.push({ x: px - 2, y: py });
            tilesToReveal.push({ x: px - 1, y: py - 1 });
            tilesToReveal.push({ x: px - 1, y: py + 1 });
            tilesToReveal.push({ x: px - 2, y: py - 1 });
            tilesToReveal.push({ x: px - 2, y: py + 1 });
            break;
        case 'right':
            tilesToReveal.push({ x: px + 1, y: py });
            tilesToReveal.push({ x: px + 2, y: py });
            tilesToReveal.push({ x: px + 1, y: py - 1 });
            tilesToReveal.push({ x: px + 1, y: py + 1 });
            tilesToReveal.push({ x: px + 2, y: py - 1 });
            tilesToReveal.push({ x: px + 2, y: py + 1 });
            break;
    }

    tilesToReveal.forEach(tile => {
        if (tile.x >= 0 && tile.x < mapWidth && tile.y >= 0 && tile.y < mapHeight) {
            revealedMap[tile.y][tile.x] = true;
        }
    });
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

        if (Math.abs(dx) > Math.abs(dy)) {
            player.facingDirection = dx > 0 ? 'right' : 'left';
        } else {
            player.facingDirection = dy > 0 ? 'down' : 'up';
        }
    } else {
        // Default attack direction if no monster is near
        switch (player.facingDirection) {
            case 'up':
                player.attackDirectionX = 0;
                player.attackDirectionY = -1;
                break;
            case 'down':
                player.attackDirectionX = 0;
                player.attackDirectionY = 1;
                break;
            case 'left':
                player.attackDirectionX = -1;
                player.attackDirectionY = 0;
                break;
            case 'right':
                player.attackDirectionX = 1;
                player.attackDirectionY = 0;
                break;
        }
    }

    player.isAttacking = true;
    player.attackAnimFrame = 0;

    const equippedWeapon = player.equipped.weapon;
    let targetTiles = [];
    let projectileType = null;
    let projectileRange = 1;

    if (equippedWeapon) {
                switch (equippedWeapon.name) {
                    case 'Arco del Bosque':
                        projectileType = 'arrow';
                        projectileRange = 3;
                        break;
                    case 'Rayo de Oscuridad':
                        projectileType = 'dark_ray';
                        projectileRange = 3;
                        break;
                    case 'Libro Celestial':
                        projectileType = 'celestial_ray'; 
                        projectileRange = 3;
                        break;
                    case 'Maza de Guerra':
                        if (player.facingDirection === 'right') {
                            targetTiles.push({ x: player.tileX + 1, y: player.tileY });
                            targetTiles.push({ x: player.tileX + 1, y: player.tileY - 1 });
                            targetTiles.push({ x: player.tileX + 1, y: player.tileY + 1 });
                        } else if (player.facingDirection === 'left') {
                            targetTiles.push({ x: player.tileX - 1, y: player.tileY });
                            targetTiles.push({ x: player.tileX - 1, y: player.tileY - 1 });
                            targetTiles.push({ x: player.tileX - 1, y: player.tileY + 1 });
                        } else if (player.facingDirection === 'up') {
                            targetTiles.push({ x: player.tileX, y: player.tileY - 1 });
                            targetTiles.push({ x: player.tileX - 1, y: player.tileY - 1 });
                            targetTiles.push({ x: player.tileX + 1, y: player.tileY - 1 });
                        } else if (player.facingDirection === 'down') {
                            targetTiles.push({ x: player.tileX, y: player.tileY + 1 });
                            targetTiles.push({ x: player.tileX - 1, y: player.tileY + 1 });
                            targetTiles.push({ x: player.tileX + 1, y: player.tileY + 1 });
                        }
                        break;
                    default: 
                        if (player.facingDirection === 'right') targetTiles.push({ x: player.tileX + 1, y: player.tileY });
                        else if (player.facingDirection === 'left') targetTiles.push({ x: player.tileX - 1, y: player.tileY });
                        else if (player.facingDirection === 'up') targetTiles.push({ x: player.tileX, y: player.tileY - 1 });
                        else if (player.facingDirection === 'down') targetTiles.push({ x: player.tileX, y: player.tileY + 1 });
                        break;
                }
            } else { 
                if (player.facingDirection === 'right') targetTiles.push({ x: player.tileX + 1, y: player.tileY });
                else if (player.facingDirection === 'left') targetTiles.push({ x: player.tileX - 1, y: player.tileY });
                else if (player.facingDirection === 'up') targetTiles.push({ x: player.tileX, y: player.tileY - 1 });
                else if (player.facingDirection === 'down') targetTiles.push({ x: player.tileX, y: player.tileY + 1 });
            }

            let monstersHit = [];
            if (!projectileType) { 
                for (const targetCoord of targetTiles) {
                    const monster = monsters.find(m => !m.isMinion && (m.width && m.height ? (targetCoord.x >= m.tileX && targetCoord.x < m.tileX + m.width && targetCoord.y >= m.tileY && targetCoord.y < m.tileY + m.height) : (m.tileX === targetCoord.x && m.tileY === targetCoord.y)));
                    if (monster && !monstersHit.includes(monster)) {
                        monstersHit.push(monster);
                        if (equippedWeapon && equippedWeapon.name === 'Maza de Guerra' && monstersHit.length >= 2) {
                            break; 
                        }
                    }
                }
            }
            
            const offsetX = Math.max(0, Math.min(player.tileX*tileSize - gameCanvas.width/2 + tileSize/2, mapWidth*tileSize - gameCanvas.width));
            const offsetY = Math.max(0, Math.min(player.tileY*tileSize - gameCanvas.height/2 + tileSize/2, mapHeight*tileSize - gameCanvas.height));
            const playerScreenX = player.tileX * tileSize - offsetX;
            const playerScreenY = player.tileY * tileSize - offsetY;

            if (projectileType) { 
                let dx = 0, dy = 0;
                if (nearestMonster) {
                    dx = nearestMonster.tileX - player.tileX;
                    dy = nearestMonster.tileY - player.tileY;
                } else {
                    if (player.facingDirection === 'right') dx = 1;
                    else if (player.facingDirection === 'left') dx = -1;
                    else if (player.facingDirection === 'up') dy = -1;
                    else if (player.facingDirection === 'down') dy = 1;
                }
                
                let isCriticalProjectile = Math.random() < (0.05 + player.criticalChanceBonus);
                if (player.luckBoostEndTime > Date.now()) {
                    isCriticalProjectile = isCriticalProjectile || (Math.random() < 0.05);
                }

                if (equippedWeapon.name === 'Libro Celestial') {
                    player.celestialBookCritCounter++;
                    if (player.celestialBookCritCounter >= 10) {
                        isCriticalProjectile = true;
                        player.celestialBookCritCounter = 0;
                        ui.showMessage("¡Libro Celestial: Golpe Crítico garantizado!");
                    }
                }
                
                projectiles.push(new Projectile(player.tileX, player.tileY, dx, dy, projectileType, 'player', player.atk, isCriticalProjectile, projectileRange, projectileType === 'dark_ray' ? 0.5 : 1));
            }

            monstersHit.forEach(monsterToAttack => {
                let isCritical = Math.random() < (0.05 + player.criticalChanceBonus); 
                if (player.luckBoostEndTime > Date.now()) { 
                    isCritical = isCritical || (Math.random() < 0.05); 
                }

                const damageMultiplier = isCritical ? 2 : 1;
                let damage = Math.floor(player.atk * damageMultiplier);

                if (player.nextHitCritical) { 
                    damage *= 1.5;
                    player.nextHitCritical = false; 
                }
                
                if (monsterToAttack.isWeakened && Date.now() < monsterToAttack.weaknessEndTime) {
                    damage *= 1.05; 
                }

                takeDamage(monsterToAttack, damage, isCritical, 'player');

                if (equippedWeapon) {
                    const currentTime = Date.now();
                    if (equippedWeapon.name === 'Guadaña Helada') {
                        monsterToAttack.isAttackSlowed = true;
                        monsterToAttack.attackSlowEndTime = currentTime + 3000; 
                        ui.showMessage(`Guadaña Helada: ${monsterToAttack.type} ralentizado.`);
                    } else if (equippedWeapon.name === 'Daga de Poder') {
                        const bleedChance = 0.25; 
                        if (Math.random() < bleedChance) {
                            monsterToAttack.isBleeding = true;
                            monsterToAttack.bleedingDamagePerTick = Math.floor(player.atk * 0.05); 
                            monsterToAttack.bleedingTickInterval = 1000; 
                            monsterToAttack.bleedingNextTickTime = currentTime + monsterToAttack.bleedingTickInterval;
                            monsterToAttack.bleedingEndTime = currentTime + 5000; 
                            ui.showMessage(`Daga de Poder: ${monsterToAttack.type} está sangrando.`);
                        }
                    } else if (equippedWeapon.name === 'Maza de Guerra' && monstersHit.length >= 2) {
                        warMaceShockwave = { x: player.tileX, y: player.tileY, life: 15 }; 
                    }
                }

                if (monsterToAttack.hp <= 0) {
                    let xpGained = monsterToAttack.xp;
                    if (activeSetBonusName === 'Mago' && setBonuses.Mago.xpGain_percent) {
                        xpGained = Math.floor(xpGained * (1 + setBonuses.Mago.xpGain_percent));
                    }
                    player.xp += xpGained;

                    player.enemiesDefeatedThisRun++; 
                    
                    if (isCritical) {
                        const healthRecovered = Math.floor(monsterToAttack.maxHp * 0.05); 
                        if (healthRecovered > 0) { 
                            player.hp = Math.min(player.maxHp, player.hp + healthRecovered); 
                            damageTexts.push({ 
                                x: playerScreenX + tileSize/2, y: playerScreenY - 5, 
                                text: `+${healthRecovered} HP`,
                                color: '#00ff00', 
                                size: 14, life: 30, velY: -1
                            });
                        }
                    }

                    if (equippedWeapon && equippedWeapon.name === 'Rayo de Oscuridad') {
                        player.darkRayEnemiesDefeated++;
                        if (player.darkRayEnemiesDefeated >= 10) {
                            const healedAmount = Math.floor(player.maxHp * 0.05); 
                            if (healedAmount > 0) { 
                                player.hp = Math.min(player.maxHp, player.hp + healedAmount);
                                ui.showMessage("¡Rayo de Oscuridad: ¡5% HP recuperado!");
                            }
                            player.darkRayEnemiesDefeated = 0;
                        }
                    }

                    checkLevelUp();
                    
                    const monsterIndex = monsters.indexOf(monsterToAttack);
                    if (monsterIndex > -1) {
                        monsters.splice(monsterIndex, 1);
                    }

                    const remainingMonsters = monsters.filter(m => !m.isMinion);
                    
                    if (monsterToAttack.type === 'finalBoss') {
                        gameOver = true;
                        finalOutcomeMessage = "¡Has derrotado al Jefe Final!";
                        finalOutcomeMessageLine2 = "¡Has completado la Mazmorra!";
                        lastGameScore = calculateScore();
                        lastEnemiesDefeated = player.enemiesDefeatedThisRun;
                    } else if (remainingMonsters.length === 0) {
                        stairLocation.active = true;
                    ui.showMessage("¡Todos los monstruos derrotados! Las escaleras han aparecido.");
                    }
                }
            });
}

function openChest(chest) {
    if (chest.opened) return;
    chest.opened = true;
    map[chest.tileY][chest.tileX] = 1;
    if (chest.item) {
        if (chest.item.type === 'potion') {
            const oldHp = player.hp;
            const healedAmount = chest.item.heal || 0;
            player.hp = Math.min(player.maxHp, player.hp + healedAmount);
            const actualHealedAmount = player.hp - oldHp;
            if (actualHealedAmount > 0) {
                damageTexts.push({
                    text: `+${Math.floor(actualHealedAmount)} HP`,
                    x: player.tileX,
                    y: player.tileY,
                    life: 60,
                    color: '#4CAF50',
                    size: 20,
                    velY: -0.01
                });
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
    const monsterWidth = monster ? monster.width || 1 : 1;
    const monsterHeight = monster ? monster.height || 1 : 1;

    for (let i = 0; i < monsterWidth; i++) {
        for (let j = 0; j < monsterHeight; j++) {
            const checkX = x + i;
            const checkY = y + j;

            if (checkY < 0 || checkY >= mapHeight || checkX < 0 || checkX >= mapWidth) {
                return false;
            }
            if (map[checkY] && (map[checkY][checkX] === 1 || map[checkY][checkX] === 2)) {
                if (forProjectiles) continue;
                if (checkX === player.tileX && checkY === player.tileY) {
                    return false;
                }
                if (monsters.some(m => m !== monster && m.tileX === checkX && m.tileY === checkY)) {
                    return false;
                }
            } else {
                return false;
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
        if (player.miniShieldHP <= 0) {
            ui.showMessage("¡Tu mini escudo se ha roto!");
        }
    }

    if (actualDamage > 0) {
        target.hp -= actualDamage;
    }

    if (attackerType === 'player' && player.soulExtractionActive) {
        player.hitsSinceLastSoulExtraction = (player.hitsSinceLastSoulExtraction || 0) + 1;
        if (player.hitsSinceLastSoulExtraction >= 5) {
            const hpRecovered = Math.floor(player.maxHp * 0.05);
            if (hpRecovered > 0) {
                player.hp = Math.min(player.maxHp, player.hp + hpRecovered);
                damageTexts.push({
                    text: `+${hpRecovered} HP`,
                    x: player.tileX,
                    y: player.tileY - 0.5,
                    life: 60,
                    color: '#00ff00',
                    size: 18,
                    velY: -0.5
                });
            }
            player.hitsSinceLastSoulExtraction = 0;
        }
    }

    let damageColor = attackerType === 'player' ? (isCritical ? '#ff0000' : '#ffffff') : '#ff0000';
    damageTexts.push({
        text: Math.floor(actualDamage).toString(),
        x: target.tileX,
        y: target.tileY,
        life: 30,
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
            life: 30,
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
            const secondWindSkill = skills.find(s => s.name === 'Segundo Aliento');
            const isSecondWindEquipped = player.equipped.habilidad1 === 'Segundo Aliento' ||
                                         player.equipped.habilidad2 === 'Segundo Aliento' ||
                                         player.equipped.habilidad3 === 'Segundo Aliento';

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
            
            const xpGain = target.xp || 10;
            player.xp += xpGain;
            player.enemiesDefeatedThisRun++;
            checkLevelUp();
            
            const monsterIndex = monsters.indexOf(target);
            if (monsterIndex > -1) {
                monsters.splice(monsterIndex, 1);
            }

            const remainingMonsters = monsters.filter(m => !m.isMinion);
            
            if (target.type === 'finalBoss') {
                gameOver = true;
                finalOutcomeMessage = "¡Has derrotado al Jefe Final!";
                finalOutcomeMessageLine2 = "¡Has completado la Mazmorra!";
                lastGameScore = calculateScore();
                lastEnemiesDefeated = player.enemiesDefeatedThisRun;
            } else if (remainingMonsters.length === 0) {
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

    if (skill.type === 'passive') {
        ui.showMessage(`Esta habilidad (${skill.name}) es pasiva y se activa automáticamente al equiparla.`);
        return;
    }

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
            player.stealthEndTime = currentTime + 10000; 
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
            } while ((map[newY][newX] !== 1 || monsters.some(m => m.tileX === newX && m.tileY === newY)) && attempts < 100); 
            if (map[newY][newX] === 1 && !monsters.some(m => m.tileX === newX && m.tileY === newY)) {
                player.tileX = newX;
                player.tileY = newY;
                ui.showMessage("¡Teletransportación exitosa!");
            } else {
                ui.showMessage("No se pudo teletransportar a un lugar seguro.");
            }
            break;
        case 'Invocar':
            const minionHp = Math.floor(player.maxHp * 0.75);
            const minionAtk = Math.floor(player.atk * 0.75);
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
            const healedAmount = Math.floor(player.maxHp * 0.75);
            player.hp = Math.min(player.maxHp, player.hp + healedAmount);
            damageTexts.push({
                text: `+${Math.floor(healedAmount)}`,
                x: player.tileX,
                y: player.tileY,
                life: 60,
                color: '#00ff00',
                size: 20,
                velY: -0.01
            });
            ui.showMessage(`¡Has regenerado ${healedAmount} HP!`);
            break;
        case 'Velocidad':
            player.isSpeedBoosted = true;
            player.speedBoostEndTime = currentTime + 10000; 
            player.spd *= 1.25; 
            ui.showMessage("¡Velocidad aumentada!");
            break;
        case 'Invencible':
            player.isInvincible = true;
            player.invincibleEndTime = currentTime + 4000; 
            ui.showMessage("¡Eres invencible!");
            break;
        case 'Rayo de Hielo':
            monsters.filter(m => !m.isMinion && Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY) <= 3).forEach(m => {
                m.isFrozen = true;
                m.frozenEndTime = currentTime + 5000; 
                ui.showMessage(`¡${m.type} ha sido congelado!`);
            });
            if (!monsters.some(m => !m.isMinion && Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY) <= 3)) {
                ui.showMessage("No hay enemigos cerca para congelar.");
            }
            break;
        case 'Suerte':
            player.luckBoostEndTime = currentTime + 10000; 
            player.criticalChanceBonus += 0.25; // Aumenta la probabilidad de crítico en 25%
            ui.showMessage("¡Tu suerte ha aumentado!");
            updateStats(); // Recalcula las estadísticas para aplicar el bonus
            break;
        case 'Debilidad':
            monsters.filter(m => !m.isMinion && Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY) <= 3).forEach(m => {
                m.isWeakened = true;
                m.weaknessEndTime = currentTime + 8000; 
                m.def *= 0.75; // Reduce la defensa en un 25%
                ui.showMessage(`¡${m.type} ha sido debilitado!`);
            });
            if (!monsters.some(m => !m.isMinion && Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY) <= 3)) {
                ui.showMessage("No hay enemigos cerca para debilitar.");
            }
            break;
        case 'Tormenta de Cuchillas':
            const bladeDamage = Math.max(1, Math.floor(player.baseAtk * 0.5));
            const directions = [
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // Cardinal
                { dx: 1, dy: 1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: -1 }  // Diagonal
            ];
            directions.forEach(dir => {
                projectiles.push(new Projectile(player.tileX, player.tileY, dir.dx, dir.dy, 'blade', 'player', bladeDamage, false, 7, 0.2)); // Increased range to 7, decreased speed to 0.2
            });
            ui.showMessage("¡Has desatado una Tormenta de Cuchillas!");
            break;
        case 'Segundo Aliento': 
            ui.showMessage("Esta habilidad (Segundo Aliento) es pasiva y se activa automáticamente al equiparla.");
            break;
    }
    if (skill.cooldown > 0) {
        skillCooldowns[skill.name] = currentTime + skill.cooldown;
    }
    // Mark active skills as used for this floor if they have a cooldown or are single-use
    if (skill.type === 'active') { 
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
    console.log(`Attempting to equip skill for slot: ${slotType}, direction: ${direction}`);
    const availableSkillsForSlot = skills.filter(s => player.permanentlyLearnedSkills.includes(s.name));
    // Add a null option to the end of the available skills list
    const allPossibleSkills = [...availableSkillsForSlot, { name: null }];
    console.log("All possible skills for slot:", allPossibleSkills.map(s => s.name));

    const equippedSkillName = player.equipped[slotType];
    const currentIndex = allPossibleSkills.findIndex(s => s.name === equippedSkillName);

    let nextIndex = currentIndex;
    let foundUniqueSkill = false;
    let attempts = 0;
    const maxAttempts = allPossibleSkills.length; // Max attempts is the number of possible skills

    do {
        if (direction === 'right') {
            nextIndex = (nextIndex + 1) % allPossibleSkills.length;
        } else { // 'left'
            nextIndex = (nextIndex - 1 + allPossibleSkills.length) % allPossibleSkills.length;
        }

        const potentialSkill = allPossibleSkills[nextIndex];
        const potentialSkillName = potentialSkill.name;

        // Check if the potential skill is already equipped in other slots
        let isAlreadyEquippedInOtherSlot = false;
        if (potentialSkillName !== null) {
            if (slotType !== 'habilidad1' && player.equipped.habilidad1 === potentialSkillName) {
                isAlreadyEquippedInOtherSlot = true;
            }
            if (slotType !== 'habilidad2' && player.equipped.habilidad2 === potentialSkillName) {
                isAlreadyEquippedInOtherSlot = true;
            }
            if (slotType !== 'habilidad3' && player.equipped.habilidad3 === potentialSkillName) {
                isAlreadyEquippedInOtherSlot = true;
            }
        }

        if (!isAlreadyEquippedInOtherSlot) {
            foundUniqueSkill = true;
        }
        attempts++;
    } while (!foundUniqueSkill && attempts < maxAttempts);

    player.equipped[slotType] = allPossibleSkills[nextIndex].name;

    console.log(`Equipped skill for ${slotType}: ${allPossibleSkills[nextIndex].name}`);

    updateStats();
}

export function resetGame() {
    gameOver = false;
    gameStarted = false;
}