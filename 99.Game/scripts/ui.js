// --- ui.js ---
// Contiene toda la lógica para manipular el DOM, actualizar la interfaz de usuario y dibujar en el canvas.

// --- IMPORTS ---
import { player, activeSetBonusName, updateStats } from './player.js';
import { skills, gearList, setBonuses, equipmentSlotsOrder, equipmentSlotNames } from './data.js';
import { monsters, chests, loadedImages, sprites } from './enemies.js';
import { 
    currentFloor, maxFloors, map, stairLocation, selectedDifficulty, 
    gameStarted, gameOver, lastGameScore, lastEnemiesDefeated, 
    finalOutcomeMessage, finalOutcomeMessageLine2, keys, screenShake, 
    revealedMap, projectiles, damageTexts, criticalHitEffects, warMaceShockwave, skillCooldowns, mapWidth, mapHeight, tileSize, iceRayEffects,
    useItem, learnSkill, equipItem, equipSkill, activateSkill, torches
} from './gameLogic.js';


// --- EXPORTS ---

// --- State Variables for UI ---
export let isInventoryOpen = false;
export let isSkillMenuOpen = false;
export let isEquipmentOpen = false; 
export let offsetX = 0; // Export offsetX
export let offsetY = 0; // Export offsetY
let selectedIndex = 0;
let selectedSkillIndex = 0;
let selectedEquipmentSlotIndex = 0; 
let playerBreathAnimCounter = 0; 
let playerWalkAnimCounter = 0; 

// --- DOM Element Selections ---
export const difficultyScreen = document.getElementById('difficultyScreen');
export const gameCanvas = document.getElementById('gameCanvas');
export const minimapCanvas = document.getElementById('minimapCanvas');
export const messageBox = document.getElementById('messageBox');
const inventoryMenu = document.getElementById('inventoryMenu');
const skillMenu = document.getElementById('skillMenu');
export const equipmentMenu = document.getElementById('equipmentMenu');
const equippedSlotsDiv = document.getElementById('equippedSlots');
const equipmentMenuInstructions = document.getElementById('equipmentMenuInstructions');
export const difficultyTitleElement = document.getElementById('difficultyTitle');
export const lastScoreDisplayElement = document.getElementById('lastScoreDisplay');
const ctx = gameCanvas.getContext('2d');
const minimapCtx = minimapCanvas.getContext('2d');

// --- Drawing Functions ---
export function drawFloor(x, y) { if(loadedImages.floor && loadedImages.floor.complete) ctx.drawImage(loadedImages.floor, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#aaa'; ctx.fillRect(x,y,tileSize,tileSize);}}
export function drawWall(x, y) { if(loadedImages.wall && loadedImages.wall.complete) ctx.drawImage(loadedImages.wall, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#555'; ctx.fillRect(x,y,tileSize,tileSize);}}
export function drawChest(x, y) { if(loadedImages.chest && loadedImages.chest.complete) ctx.drawImage(loadedImages.chest, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#8B4513'; ctx.fillRect(x,y,tileSize,tileSize);}}
export function drawStairs(x,y) { 
    if(loadedImages.stairs && loadedImages.stairs.complete) ctx.drawImage(loadedImages.stairs, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#704214'; ctx.fillRect(x,y,tileSize,tileSize);}}

export function drawTorch(x, y) {
    if(loadedImages.torch && loadedImages.torch.complete) {
        ctx.drawImage(loadedImages.torch, 0,0,64,64, x, y, tileSize, tileSize);
    } else {
        ctx.fillStyle = 'orange';
        ctx.fillRect(x + tileSize / 2 - 5, y + tileSize / 2 - 15, 10, 30);
    }
}

function drawPlayer(x, y) {
    const sizeMultiplier = 1.15; // Aumenta el tamaño del jugador en un 15%
    const playerWidth = tileSize * sizeMultiplier;
    const playerHeight = tileSize * sizeMultiplier;

    // Centra el sprite más grande en la casilla original
    let drawX = x - (playerWidth - tileSize) / 2;
    let drawY = y - (playerHeight - tileSize) / 2;

    // La animación de ataque (estocada) se mantiene
    if (player.isAttacking) {
        const progress = player.attackAnimFrame / player.attackAnimDuration;
        let lunge = 0;
        if (progress < 0.5) {
            lunge = player.attackLungeDistance * (progress / 0.5);
        } else {
            lunge = player.attackLungeDistance * ((1 - progress) / 0.5);
        }
        drawX += lunge * player.attackDirectionX;
        drawY += lunge * player.attackDirectionY;
    }

    // Dibuja el sprite del jugador
    if (loadedImages.player && loadedImages.player.complete) {
        // Usa 70x70 como el tamaño de la fuente, que es el tamaño real del canvas del sprite
        ctx.drawImage(loadedImages.player, 0, 0, 70, 70, drawX, drawY, playerWidth, playerHeight);
    } else {
        // Fallback si la imagen no se carga
        ctx.fillStyle = 'blue'; 
        ctx.fillRect(drawX, drawY, playerWidth, playerHeight);
    }

    // Dibuja los efectos visuales (golpe, estados, etc.) sobre el jugador
    if (player.hitFrame > 0) {
        ctx.save();
        ctx.globalAlpha = 0.5 + (player.hitFrame / 10) * 0.3;
        ctx.fillStyle = 'red';
        ctx.fillRect(drawX, drawY, playerWidth, playerHeight);
        ctx.restore();
        player.hitFrame--;
    }
    const currentTime = Date.now();
    if (player.isSlowed && currentTime < player.slowEndTime) {
        ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
        ctx.fillRect(drawX, drawY, playerWidth, playerHeight);
    }
    if (player.isInvincible && currentTime < player.invincibleEndTime) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.fillRect(drawX, drawY, playerWidth, playerHeight);
    }
    if (player.isStealthed && currentTime < player.stealthEndTime) {
        ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
        ctx.fillRect(drawX, drawY, playerWidth, playerHeight);
    }

    // Dibuja la barra de vida sobre el jugador
    const healthPercent = player.hp / player.maxHp;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; 
    ctx.fillRect(drawX + 5, drawY - 10, playerWidth - 10, 5);
    ctx.fillStyle = healthPercent > 0.5 ? 'rgba(0,255,0,0.7)' : healthPercent > 0.25 ? 'rgba(255,255,0,0.7)' : 'rgba(255,0,0,0.7)';
    ctx.fillRect(drawX + 5, drawY - 10, (playerWidth - 10) * healthPercent, 5);
}

function drawMonster(m, screenX, screenY) {
    let drawX = screenX;
    let drawY = screenY;

    if (m.isAttackingPlayer) {
        const progress = m.attackAnimFrame / m.attackAnimDuration;
        let lunge = 0;
        if (progress < 0.5) {
            lunge = m.attackLungeDistance * (progress / 0.5);
        } else {
            lunge = m.attackLungeDistance * ((1 - progress) / 0.5);
        }

        if (m.attackDirectionX > 0) drawX += lunge;
        else if (m.attackDirectionX < 0) drawX -= lunge;
        if (m.attackDirectionY > 0) drawY += lunge;
        else if (m.attackDirectionY < 0) drawY -= lunge;
    }

    let monsterImage;
    if (m.type === 'duende') monsterImage = loadedImages.duende; 
    else if (m.type === 'lobo') monsterImage = loadedImages.lobo;
    else if (m.type === 'skeleton') monsterImage = loadedImages.skeleton;
    else if (m.type === 'miniBoss') monsterImage = loadedImages.miniBoss;
    else if (m.type === 'boss') monsterImage = loadedImages.boss;
    else if (m.type === 'finalBoss') monsterImage = loadedImages.finalBoss; 
    else if (m.type === 'spiderling') monsterImage = loadedImages.spiderling;
    else if (m.type === 'minion') { 
        monsterImage = loadedImages.minion; 
    }

    if (monsterImage && monsterImage.complete) {
        let drawWidth = tileSize * (m.width || 1);
        let drawHeight = tileSize * (m.height || 1);
        ctx.drawImage(monsterImage, 0,0,64,64, drawX, drawY, drawWidth, drawHeight);
        
    } else { 
        ctx.fillStyle = m.type === 'duende' ? '#5C6B00' : (m.type === 'lobo' ? '#8C0000' : (m.type === 'finalBoss' ? '#3A1E00' : (m.type === 'spiderling' ? '#4A2A05' : 'gray'))); 
        ctx.fillRect(drawX, drawY, tileSize * (m.width || 1), tileSize * (m.height || 1));
        
    }
    if (m.hitFrame > 0) { ctx.fillStyle = 'rgba(255,0,0,0.5)'; ctx.fillRect(drawX, drawY, tileSize * (m.width || 1), tileSize * (m.height || 1)); }
    if (m.isFrozen && Date.now() < m.frozenEndTime) {
        ctx.fillStyle = 'rgba(0, 191, 255, 0.3)'; 
        ctx.fillRect(drawX, drawY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }
    if (m.isWeakened && Date.now() < m.weaknessEndTime) {
        ctx.fillStyle = 'rgba(128, 0, 128, 0.3)'; 
        ctx.fillRect(drawX, drawY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }
    if (m.isBleeding && Date.now() < m.bleedingEndTime) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; 
        ctx.fillRect(drawX, drawY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }
    if (m.isAttackSlowed && Date.now() < m.attackSlowEndTime) {
        ctx.fillStyle = 'rgba(135, 206, 235, 0.3)'; 
        ctx.fillRect(drawX, drawY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }

    const healthPercentMonster = m.hp / m.maxHp; 
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(drawX+5, drawY-10, tileSize-10, 5);
    ctx.fillStyle = healthPercentMonster > 0.5 ? 'rgba(0,255,0,0.7)' : healthPercentMonster > 0.25 ? 'rgba(255,255,0,0.7)' : 'rgba(255,0,0,0.7)';
    ctx.fillRect(drawX+5, drawY-10, (tileSize-10)*healthPercentMonster, 5);
}

function drawProjectiles(offsetX, offsetY) {
    projectiles.forEach(proj => {
        const screenX = proj.x * tileSize - offsetX;
        const screenY = proj.y * tileSize - offsetY;
        
        ctx.save();
        ctx.translate(screenX + tileSize / 2, screenY + tileSize / 2); 

        let rotationAngle = 0;
        if (proj.type === 'arrow' || proj.type === 'web' || proj.type === 'dark_ray' || proj.type === 'celestial_ray') { 
            rotationAngle = Math.atan2(proj.dy, proj.dx);
        }
        ctx.rotate(rotationAngle);

        if (proj.type === 'fireball') {
            ctx.fillStyle = 'rgba(255, 50, 0, 0.8)'; ctx.beginPath();
            ctx.arc(0, 0, tileSize/3, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(255, 165, 0, 0.6)';
            for(let i=0; i<3; i++) { 
                const angle = Math.random() * Math.PI * 2; const dist = Math.random() * tileSize/3; 
                ctx.beginPath();
                ctx.arc(Math.cos(angle)*dist, Math.sin(angle)*dist, tileSize/8, 0, Math.PI*2); 
                ctx.fill();
            }
        } else if (proj.type === 'web') {
            const animationProgress = proj.distanceTraveled / proj.maxRangeTiles;
            const currentRadius = animationProgress * tileSize * 0.7; 
            const alpha = 1 - animationProgress; 

            ctx.fillStyle = `rgba(200, 200, 200, ${alpha * 0.7})`; 
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = `rgba(220, 220, 220, ${alpha})`;
            ctx.lineWidth = 1 + animationProgress * 2; 
            for(let i=0; i< 5; i++){
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(i * Math.PI * 2 / 5) * currentRadius, Math.sin(i * Math.PI * 2 / 5) * currentRadius);
                ctx.stroke();
            }
        } else if (proj.type === 'arrow') {
            ctx.fillStyle = '#8B4513'; 
            ctx.fillRect(-2, -10, 4, 20); 
            ctx.beginPath(); 
            ctx.moveTo(0, -10);
            ctx.lineTo(-5, -5);
            ctx.lineTo(5, -5);
            ctx.closePath();
            ctx.fill();
        } else if (proj.type === 'dark_ray') {
            ctx.fillStyle = 'rgba(138, 43, 226, 0.8)'; 
            ctx.fillRect(-5, -5, 10, 10); 
            const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 15);
            glow.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
            glow.addColorStop(1, 'rgba(138, 43, 226, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
        } else if (proj.type === 'celestial_ray') { 
            const rayLength = tileSize * 1.5;
            const rayWidth = tileSize * 0.15;
            const glowRadius = tileSize * 0.8;

            ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
            ctx.fillRect(-rayWidth / 2, -rayLength / 2, rayWidth, rayLength);

            const glow = ctx.createRadialGradient(0, 0, rayWidth / 4, 0, 0, glowRadius);
            glow.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
            glow.addColorStop(0.5, 'rgba(255, 255, 0, 0.4)');
            glow.addColorStop(1, 'rgba(255, 255, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < 3; i++) {
                const sparkX = (Math.random() - 0.5) * rayWidth * 2;
                const sparkY = (Math.random() - 0.5) * rayLength * 2;
                const sparkSize = Math.random() * 3 + 1;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (proj.type === 'ice_ray') {
            ctx.fillStyle = 'rgba(173, 216, 230, 0.8)'; // Light blue
            ctx.fillRect(-10, -2, 20, 4);
            const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 15);
            glow.addColorStop(0, 'rgba(173, 216, 230, 0.8)');
            glow.addColorStop(1, 'rgba(173, 216, 230, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
        } else if (proj.type === 'blade') { // Drawing for 'blade' projectiles
            // Draw the blade (gold)
            ctx.fillStyle = '#FFD700'; // Gold color
            ctx.fillRect(-7, -1.5, 14, 3); // Blade: longer and thinner
            // Draw the handle (brown)
            ctx.fillStyle = '#8B4513'; // SaddleBrown color
            ctx.fillRect(-7, -2.5, 3, 5); // Handle: shorter and wider, attached to one end
        }
        ctx.restore(); 
    });
}

function drawDamageTexts(offsetX, offsetY) {
    damageTexts.forEach(text => {
        text.y += text.velY;
        text.life--;

        const screenX = text.x * tileSize - offsetX + tileSize / 2;
        const screenY = text.y * tileSize - offsetY + tileSize / 2;

        const alpha = Math.min(1, text.life / 60);
        ctx.font = `bold ${text.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.lineWidth = 3;
        ctx.strokeText(text.text, screenX, screenY);

        let finalColor = text.color;
        if (text.color.startsWith('#')) {
            let r = parseInt(text.color.slice(1, 3), 16), g = parseInt(text.color.slice(3, 5), 16), b = parseInt(text.color.slice(5, 7), 16);
            finalColor = `rgba(${r},${g},${b},${alpha})`;
        } else if (text.color.startsWith('rgb(')) {
            finalColor = text.color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        } else if (text.color.startsWith('rgba(')) {
            finalColor = text.color.replace(/,\s*\d?\.?\d*\)/, `, ${alpha})`);
        }
        ctx.fillStyle = finalColor;

        ctx.fillText(text.text, screenX, screenY);
    });
}

function drawCriticalHitEffects(offsetX, offsetY) {
    criticalHitEffects.forEach(effect => {
        if (!effect) return;
        effect.life--;
        const monsterScreenX = effect.x * tileSize - offsetX;
        const monsterScreenY = effect.y * tileSize - offsetY;
        ctx.save();
        ctx.strokeStyle = `rgba(255,0,0, ${effect.life/15})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(monsterScreenX + tileSize/2, monsterScreenY + tileSize/2);
        const particleX = monsterScreenX + tileSize/2 + (Math.random()-0.5)*20;
        const particleY = monsterScreenY + tileSize/2 + (Math.random()-0.5)*10;
        ctx.lineTo(particleX, particleY); ctx.stroke();
        const gradient = ctx.createRadialGradient(monsterScreenX+tileSize/2, monsterScreenY+tileSize/2,0, monsterScreenX+tileSize/2, monsterScreenY+tileSize/2, effect.size/3);
        gradient.addColorStop(0, `rgba(255,0,0,${effect.life/30})`); gradient.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(monsterScreenX+tileSize/2, monsterScreenY+tileSize/2, effect.size/3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    });
}

function drawWarMaceShockwave(offsetX, offsetY) {
    if (!warMaceShockwave) return;

    const centerX = warMaceShockwave.x * tileSize - offsetX + tileSize / 2;
    const centerY = warMaceShockwave.y * tileSize - offsetY + tileSize / 2;
    const radius = (1 - warMaceShockwave.life / 15) * tileSize * 1.5; 
    const alpha = warMaceShockwave.life / 15;

    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`; 
    ctx.lineWidth = 5 * alpha; 
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

function drawIceRayEffects(offsetX, offsetY) {
    iceRayEffects.forEach(effect => {
        if (!effect) return;
        effect.life--;
        const playerScreenX = effect.x * tileSize - offsetX;
        const playerScreenY = effect.y * tileSize - offsetY;
        const radius = (1 - effect.life / 30) * tileSize * effect.radius;
        const alpha = effect.life / 30;

        ctx.save();
        ctx.strokeStyle = `rgba(173, 216, 230, ${alpha})`;
        ctx.lineWidth = 3 * alpha;
        ctx.beginPath();
        ctx.arc(playerScreenX + tileSize / 2, playerScreenY + tileSize / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

export function drawMap() {
    offsetX = Math.max(0, Math.min(player.tileX * tileSize - gameCanvas.width / 2 + tileSize / 2, mapWidth * tileSize - gameCanvas.width));
    offsetY = Math.max(0, Math.min(player.tileY * tileSize - gameCanvas.height / 2 + tileSize / 2, mapHeight * tileSize - gameCanvas.height));
    const startX = Math.floor(offsetX / tileSize);
    const endX = Math.min(mapWidth - 1, Math.ceil((offsetX + gameCanvas.width) / tileSize));
    const startY = Math.floor(offsetY / tileSize);
    const endY = Math.min(mapHeight - 1, Math.ceil((offsetY + gameCanvas.height) / tileSize));

    let shakeOffsetX = 0, shakeOffsetY = 0;
    if (screenShake > 0) {
        shakeOffsetX = (Math.random() - 0.5) * screenShake * 2; 
        shakeOffsetY = (Math.random() - 0.5) * screenShake * 2;
        
    }
    ctx.fillStyle = '#2a1f15'; ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.save(); ctx.translate(shakeOffsetX, shakeOffsetY);

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            const screenX = x * tileSize - offsetX; const screenY = y * tileSize - offsetY;
            if (map[y] && map[y][x] !== undefined) { 
                if (map[y][x] === 0) drawWall(screenX, screenY);
                else drawFloor(screenX, screenY);

                if (map[y][x] === 2) { drawChest(screenX, screenY); }

                if (x === stairLocation.x && y === stairLocation.y && stairLocation.active) { 
                    drawStairs(screenX, screenY);
                }
            } else { 
                drawFloor(screenX, screenY);
            }
        }
    }
    // Dibujar antorchas
    torches.forEach(torch => {
        const screenX = torch.x * tileSize - offsetX;
        const screenY = torch.y * tileSize - offsetY;
        drawTorch(screenX, screenY);
    });
    monsters.forEach(m => {
        const screenX = m.tileX * tileSize - offsetX; const screenY = m.tileY * tileSize - offsetY;
        drawMonster(m, screenX, screenY);
    });
    const playerScreenX = player.tileX * tileSize - offsetX;
    const playerScreenY = player.tileY * tileSize - offsetY;
    drawPlayer(playerScreenX, playerScreenY); 
    drawProjectiles(offsetX, offsetY);
    drawCriticalHitEffects(offsetX, offsetY); 
    drawDamageTexts(offsetX, offsetY); 
    drawWarMaceShockwave(offsetX, offsetY); 
    drawIceRayEffects(offsetX, offsetY);

    ctx.restore(); 
    drawHUD(); 
    drawMinimap(); 

    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
        ctx.textAlign = 'center';
        
        if (player.hp <= 0) { 
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.fillText(finalOutcomeMessage, gameCanvas.width/2, gameCanvas.height/2 - 60);
        } else { 
            ctx.fillStyle = '#00BFFF'; 
            ctx.font = '26px Arial'; 
            ctx.fillText(finalOutcomeMessage, gameCanvas.width/2, gameCanvas.height/2 - 70);
            ctx.fillText(finalOutcomeMessageLine2, gameCanvas.width/2, gameCanvas.height/2 - 40);
        }

        ctx.fillStyle = 'white'; 
        ctx.font = '24px Arial';
        ctx.fillText(`Puntuación: ${lastGameScore}`, gameCanvas.width/2, gameCanvas.height/2);
        ctx.fillText(`Enemigos Derrotados: ${lastEnemiesDefeated}`, gameCanvas.width/2, gameCanvas.height/2 + 30);
        ctx.font = '20px Arial';
        ctx.fillText('Presiona R para volver al menú', gameCanvas.width/2, gameCanvas.height/2 + 70);
    }
}

function drawMinimap() {
    const minimapTileSize = 5; 
    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const miniX = x * minimapTileSize;
            const miniY = y * minimapTileSize;

            if (revealedMap[y][x]) { // Only draw if the tile has been revealed
                if (map[y][x] === 0) { 
                    minimapCtx.fillStyle = '#333';
                } else if (map[y][x] === 1) { 
                    minimapCtx.fillStyle = '#888';
                } else if (map[y][x] === 2) { 
                    minimapCtx.fillStyle = '#FFD700'; 
                }
                minimapCtx.fillRect(miniX, miniY, minimapTileSize, minimapTileSize);

                // Draw stairs on top if active and revealed
                if (x === stairLocation.x && y === stairLocation.y && stairLocation.active) { 
                    minimapCtx.fillStyle = '#00FF00'; // Bright Green
                    minimapCtx.fillRect(miniX, miniY, minimapTileSize, minimapTileSize);
                }
            } else {
                // Draw unrevealed areas as black or a dark color
                minimapCtx.fillStyle = '#000';
                minimapCtx.fillRect(miniX, miniY, minimapTileSize, minimapTileSize);
            }
        }
    }

    // Always draw player and monsters if they are in a revealed area
    minimapCtx.fillStyle = 'blue';
    minimapCtx.fillRect(player.tileX * minimapTileSize, player.tileY * minimapTileSize, minimapTileSize, minimapTileSize);

    monsters.forEach(m => { 
        if (revealedMap[m.tileY][m.tileX]) { // Only draw monster if its tile is revealed
            if (m.isMinion) { 
                minimapCtx.fillStyle = 'cyan';
            } else {
                minimapCtx.fillStyle = 'red';
            }
            minimapCtx.fillRect(m.tileX * minimapTileSize, m.tileY * minimapTileSize, minimapTileSize * (m.width || 1), minimapTileSize * (m.height || 1));
        }
    });

    // Always draw the stairs if they are active, regardless of being revealed
    if (stairLocation.active) {
        minimapCtx.fillStyle = '#00FF00'; // Bright Green
        minimapCtx.fillRect(stairLocation.x * minimapTileSize, stairLocation.y * minimapTileSize, minimapTileSize, minimapTileSize);
    }
}

function drawHUD() {
    ctx.fillStyle = 'rgba(244,228,188,0.7)'; ctx.fillRect(gameCanvas.width-170, 10, 160, 210);
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2; ctx.strokeRect(gameCanvas.width-170, 10, 160, 210);
    
    ctx.fillStyle = '#000'; ctx.font = '14px Georgia'; ctx.textAlign = 'left';
    const startX = gameCanvas.width - 162; let yPos = 30;
    ctx.fillText(`Piso Actual: ${currentFloor}`, startX, yPos); yPos+=18; 
    ctx.fillText(`HP: ${Math.floor(player.hp)}/${Math.floor(player.maxHp)}`, startX, yPos); yPos+=18; 
    ctx.fillText(`ATK: ${Math.floor(player.atk)}`, startX, yPos); yPos+=18; 
    const defReduction = Math.min(75, player.def * 0.03); 
    ctx.fillText(`DEF: ${Math.floor(player.def)} (${(defReduction * 100).toFixed(0)}%)`, startX, yPos); yPos+=18; 
    ctx.fillText(`Nivel: ${player.level} (XP: ${player.xp})`, startX, yPos); yPos+=18;
    
    ctx.fillText('Habilidades:', startX, yPos); yPos+=18;
    ctx.font = '12px Georgia'; const currentTime = Date.now();
    
    const skillSlots = ['habilidad1', 'habilidad2', 'habilidad3'];
    skillSlots.forEach((slot, index) => {
        const equippedSkillName = player.equipped[slot];
        const equippedSkill = skills.find(s => s.name === equippedSkillName);
        let skillText = equippedSkill ? equippedSkill.name : '(Ninguna)';
        let textColor = '#666'; 
        
        if (equippedSkill) {
            if (equippedSkill.name === 'Segundo Aliento') {
                skillText += player.secondWindUsedThisRun ? ' (Usada)' : ' (Equipada)';
                textColor = player.secondWindUsedThisRun ? '#909090' : '#00008B';
            } else {
                const cooldownRemaining = Math.max(0, (skillCooldowns[equippedSkill.name] - currentTime));
                let durationEndTime = 0;
                let minion = monsters.find(m => m.isMinion);
                switch(equippedSkill.name) {
                    case 'Sigilo': durationEndTime = player.stealthEndTime; break;
                    case 'Invencible': durationEndTime = player.invincibleEndTime; break;
                    case 'Velocidad': durationEndTime = player.speedBoostEndTime; break;
                    case 'Suerte': durationEndTime = player.luckBoostEndTime; break;
                    case 'Invocar': if (minion) durationEndTime = minion.expirationTime; break;
                }
                const durationRemaining = Math.max(0, (durationEndTime - currentTime));

                if (durationRemaining > 0) {
                    skillText += ` (${(durationRemaining/1000).toFixed(1)}s)`;
                    textColor = '#008000'; // Green for active duration
                } else if (player.skillUsageThisFloor[equippedSkill.name]) {
                    skillText += " (Usada)";
                    textColor = '#909090';
                } else { 
                    skillText += ` [${index + 1}]`; 
                    textColor = '#008000'; 
                }
            }
        }
        ctx.fillStyle = textColor;
        ctx.fillText(skillText, startX, yPos); yPos+=16;
    });

    yPos += 5; 
    ctx.fillStyle = '#000';
    ctx.font = '13px Georgia';
    if (activeSetBonusName) {
        const bonus = setBonuses[activeSetBonusName];
        ctx.fillText(`Conjunto: ${activeSetBonusName}`, startX, yPos); yPos += 16;
        ctx.fillText(`Bonificación: ${bonus.message.split(': ')[1]}`, startX, yPos);
    } else {
        ctx.fillText('Conjunto Activo: Ninguno', startX, yPos);
    }
}

// --- UI Interaction Functions ---
export function showMessage(message) {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 2000); 
    }
}

export function toggleInventory() {
    isInventoryOpen = !isInventoryOpen;
    if(isInventoryOpen) {
        isSkillMenuOpen = false; 
        isEquipmentOpen = false;
    }
    inventoryMenu.style.display = isInventoryOpen ? 'block' : 'none';
    skillMenu.style.display = 'none'; 
    equipmentMenu.style.display = 'none'; 
    if (isInventoryOpen) updateInventoryDisplay();
}

function updateInventoryDisplay() {
    const gearUl = document.getElementById('gearList'); gearUl.innerHTML = '';
    player.inventory.forEach((gear, i) => { 
        const li = document.createElement('li');
        
        let statsText = '';
        if(gear.type === 'potion') statsText = ` (Cura: ${gear.heal||0})`;
        else { 
            const stats = [];
            if (gear.atk) stats.push(`ATK: ${Math.floor(gear.atk)}`);
            if (gear.def) stats.push(`DEF: ${Math.floor(gear.def)}`); 
            if (gear.spd) stats.push(`SPD: ${gear.spd.toFixed(1)}`); 
            if (gear.critical) stats.push(`CRIT: ${(gear.critical*100).toFixed(0)}%`);
            statsText = stats.length > 0 ? ` (${stats.join(', ')})` : '';
        }

        li.textContent = `${gear.name}${statsText}`;
        
        let isEquipped = false;
        for (const slot in player.equipped) {
            if (player.equipped[slot] && player.equipped[slot].name === gear.name) {
                isEquipped = true;
                break;
            }
        }

        if (isEquipped) {
            li.classList.add('inventory-equipped');
        } else {
            li.classList.add('inventory-unequipped');
        }

        if (i === selectedIndex) li.classList.add('selected');
        gearUl.appendChild(li);
    });
}

export function handleInventoryInput(e) {
    e.preventDefault(); e.stopPropagation();
    if (e.code === 'ArrowUp') selectedIndex = Math.max(0, selectedIndex - 1);
    else if (e.code === 'ArrowDown') selectedIndex = Math.min(player.inventory.length - 1, selectedIndex + 1);
    else if (e.code === 'Enter' && player.inventory.length > 0) {
        const item = player.inventory[selectedIndex];
        // NOTIFICA a la lógica del juego en lugar de ejecutarla aquí
        // La función useItem deberá ser creada en gameLogic.js
        useItem(item);
    } else if (e.code === 'KeyI' || e.code === 'Escape') {
        toggleInventory(); 
    }
    updateInventoryDisplay();
}

export function toggleSkillMenu() {
    isSkillMenuOpen = !isSkillMenuOpen;
    if(isSkillMenuOpen) {
        isInventoryOpen = false; 
        isEquipmentOpen = false; 
    }
    skillMenu.style.display = isSkillMenuOpen ? 'block' : 'none';
    inventoryMenu.style.display = 'none'; 
    equipmentMenu.style.display = 'none'; 
    if (isSkillMenuOpen) updateSkillDisplay();
}

function updateSkillDisplay() {
    document.getElementById('skillPoints').textContent = player.skillPoints;
    const skillUl = document.getElementById('skillList'); skillUl.innerHTML = '';
    skills.forEach((skill, i) => {
        const li = document.createElement('li');
        let statusClass = 'locked';
        let statusText = '';
        
        const isEquippedInSlot = player.equipped.habilidad1 === skill.name || 
                                 player.equipped.habilidad2 === skill.name || 
                                 player.equipped.habilidad3 === skill.name;

        if (player.permanentlyLearnedSkills.includes(skill.name)) {
            statusClass = 'unlocked'; 
            statusText = isEquippedInSlot ? ' (Equipada)' : ' (Desbloqueada)';
        } else if (player.skillPoints >= skill.cost && (!skill.prereq || player.permanentlyLearnedSkills.includes(skill.prereq))) {
            statusClass = 'available';
            statusText = ' (Desbloquear)';
        } else {
            statusClass = 'locked';
            statusText = ' (Bloqueada)'; 
        }

        li.textContent = `${skill.name} - ${skill.effect}${statusText}`;
        li.className = statusClass;
        
        if (isEquippedInSlot) {
            li.classList.add('skill-equipped');
        }

        if (i === selectedSkillIndex) li.classList.add('selected'); 
        skillUl.appendChild(li);
    });
}

export function handleSkillInput(e) {
    e.preventDefault(); e.stopPropagation();
    if (e.code === 'ArrowUp') selectedSkillIndex = Math.max(0, selectedSkillIndex - 1);
    else if (e.code === 'ArrowDown') selectedSkillIndex = Math.min(skills.length - 1, selectedSkillIndex + 1);
    else if (e.code === 'Enter') {
        const skill = skills[selectedSkillIndex];
        // NOTIFICA a la lógica del juego
        // La función learnSkill deberá ser creada en gameLogic.js
        learnSkill(skill);
    } else if (e.code === 'KeyY' || e.code === 'Escape') toggleSkillMenu();
    updateSkillDisplay();
}

export function toggleEquipmentMenu() {
    isEquipmentOpen = !isEquipmentOpen;
    if (isEquipmentOpen) {
        isInventoryOpen = false;
        isSkillMenuOpen = false;
        difficultyScreen.style.display = 'none';
        equipmentMenu.style.display = 'block';
        playMusic('equipmentOpen');
    } else {
        difficultyScreen.style.display = 'flex';
        equipmentMenu.style.display = 'none';
    }
    if (isEquipmentOpen) updateEquipmentDisplay();
}

function updateEquipmentDisplay() {
    equippedSlotsDiv.innerHTML = '';
    equipmentMenuInstructions.textContent = ""; 

    equipmentSlotsOrder.forEach((slotType, i) => {
        const div = document.createElement('div');
        div.classList.add('equipment-slot-row');
        if (i === selectedEquipmentSlotIndex) {
            div.classList.add('selected');
        }

        const leftButton = document.createElement('button');
        leftButton.classList.add('nav-button', 'left-arrow');
        leftButton.textContent = '<';
        leftButton.dataset.direction = 'left';
        leftButton.dataset.slotType = slotType;
        div.appendChild(leftButton);

        const itemNameSpan = document.createElement('span');
        if (slotType.startsWith('habilidad')) { 
            const equippedSkillName = player.equipped[slotType];
            const allSkills = skills; // Use all skills from data.js
            const currentSkillIndex = equippedSkillName ? allSkills.findIndex(s => s.name === equippedSkillName) : -1;
            
            let displaySkillName = equippedSkillName ? equippedSkillName : '(Ninguna)';
            itemNameSpan.textContent = `${equipmentSlotNames[slotType]}: ${displaySkillName}`;
        } else { 
            const item = player.equipped[slotType];
            let statsText = '';
            if (item) {
                const stats = [];
                if (item.atk) stats.push(`ATK: ${Math.floor(item.atk)}`);
                if (item.def) stats.push(`DEF: ${Math.floor(item.def)}`); 
                if (item.spd) stats.push(`SPD: ${item.spd.toFixed(1)}`); 
                if (item.hp) stats.push(`HP: ${Math.floor(item.hp)}`); 
                if (item.critical) stats.push(`CRIT: ${(item.critical*100).toFixed(0)}%`);
                statsText = stats.length > 0 ? ` (${stats.join(', ')})` : '';
            }
            let displayItemName = item ? item.name : '(Vacío)';
            itemNameSpan.textContent = `${equipmentSlotNames[slotType]}: ${displayItemName}${statsText}`;
        }
        itemNameSpan.style.textAlign = 'center';
        itemNameSpan.style.flexGrow = '1';
        div.appendChild(itemNameSpan);

        const rightButton = document.createElement('button');
        rightButton.classList.add('nav-button', 'right-arrow');
        rightButton.textContent = '>';
        rightButton.dataset.direction = 'right';
        rightButton.dataset.slotType = slotType;
        div.appendChild(rightButton);

        equippedSlotsDiv.appendChild(div);
    });
}


export function handleEquipmentInput(e) {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (e.code === 'ArrowUp') selectedEquipmentSlotIndex = Math.max(0, selectedEquipmentSlotIndex - 1);
    else if (e.code === 'ArrowDown') selectedEquipmentSlotIndex = Math.min(equipmentSlotsOrder.length - 1, selectedEquipmentSlotIndex + 1);
    else if (e.code === 'ArrowLeft') {
        const currentSlotType = equipmentSlotsOrder[selectedEquipmentSlotIndex];
        navigateEquipment(currentSlotType, 'left');
    } else if (e.code === 'ArrowRight') {
        const currentSlotType = equipmentSlotsOrder[selectedEquipmentSlotIndex];
        navigateEquipment(currentSlotType, 'right');
    } else if (e.code === 'Escape') {
        toggleEquipmentMenu(); 
        return;
    }
    updateEquipmentDisplay();
}

function navigateEquipment(slotType, direction) {
    if (slotType.startsWith('habilidad')) {
        equipSkill(slotType, direction);
    } else {
        equipItem(slotType, direction);
    }
    updateEquipmentDisplay();
}

// Event listener para los botones de navegación de equipo
equippedSlotsDiv.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('nav-button')) {
        const direction = target.dataset.direction;
        const slotType = target.dataset.slotType;
        navigateEquipment(slotType, direction);
    }
});


// --- Music and Sound ---
const musicTracks = {
    menu: '../2.Music/98. System.mp3',
    boss: '../2.Music/99. Bozz.mp3',
    equipmentOpen: '../2.Music/98. System.mp3'
};

const audioDungeon = [
    '../2.Music/1. - Solo LevelingSymphonicSuite Lv.1.mp3',
    '../2.Music/10. - [Solo-Leveling]SymphonicSuite-Lv.10.mp3',
    '../2.Music/2. - [Solo-Leveling]SymphonicSuite-Lv.2 - OST_AnimeOriginal.mp3',
    '../2.Music/3. - [Solo-Leveling]SymphonicSuite-Lv.3.mp3',
    '../2.Music/4. - [Solo-Leveling]SymphonicSuite-Lv.4.mp3',
    '../2.Music/5. - [Solo-Leveling]SymphonicSuite-Lv.5.mp3',
    '../2.Music/6. - [Solo-Leveling]SymphonicSuite-Lv.6 - OST_AnimeOriginal.mp3',
    '../2.Music/7. - [Solo-Leveling]SymphonicSuite-Lv.7 - OST_AnimeOriginal.mp3',
    '../2.Music/8. - [Solo-Leveling]SymphonicSuite-Lv.8.mp3',
    '../2.Music/9. - [Solo-Leveling]SymphonicSuite-Lv.9.mp3'
];

let currentMusic = new Audio();
let currentTrackName = '';
let dungeonMusicTimeout;
let isDungeonMusicPlaying = false; // New flag

function playRandomDungeonMusic() {
    if (currentTrackName !== 'dungeon') return; // Safety check, should not be hit if logic is correct

    const randomIndex = Math.floor(Math.random() * audioDungeon.length);
    const nextTrack = audioDungeon[randomIndex];
    
    currentMusic.src = nextTrack;
    currentMusic.volume = 0.3;
    currentMusic.play().catch(error => {
        if (error.name !== 'AbortError') {
            console.error("Error playing music:", error);
        }
    });

    currentMusic.onended = function() {
        playRandomDungeonMusic();
    };
}

export function playMusic(trackName) {
    // If the requested track is already playing, do nothing (unless it's dungeon and we want to restart it, but that's not the current requirement)
    if (currentTrackName === trackName) {
        // Special handling for dungeon music: if it's already playing, don't restart it unless explicitly needed.
        // For now, assume we don't want to restart it if it's already playing.
        if (trackName === 'dungeon' && isDungeonMusicPlaying) {
            return;
        }
        // For other tracks, if it's the same track, just return.
        if (trackName !== 'dungeon') {
            return;
        }
    }

    // Stop any currently playing music
    if (!currentMusic.paused) {
        currentMusic.pause();
    }
    currentMusic.onended = null; // Clear previous onended handler
    if (dungeonMusicTimeout) {
        clearTimeout(dungeonMusicTimeout);
        dungeonMusicTimeout = null;
    }

    currentTrackName = trackName;

    if (trackName === 'dungeon') {
        isDungeonMusicPlaying = true; // Set flag when starting dungeon music
        playRandomDungeonMusic();
    } else if (trackName === 'equipmentOpen') {
        if (currentTrackName === trackName && !currentMusic.paused) {
            return; // Already playing, do nothing
        }
        isDungeonMusicPlaying = false; // Clear flag for other music types
        currentMusic.src = musicTracks[trackName];
        currentMusic.loop = false; // Play only once
        currentMusic.volume = 0.3;
        currentMusic.play().catch(error => {
            if (error.name !== 'AbortError') {
                console.error("Error playing music:", error);
            }
        });
    } else {
        isDungeonMusicPlaying = false; // Clear flag for other music types
        currentMusic.src = musicTracks[trackName];
        currentMusic.loop = true;
        currentMusic.volume = 0.3;
        currentMusic.play().catch(error => {
            if (error.name !== 'AbortError') {
                console.error("Error playing music:", error);
            }
        });
    }
} // Added to force refresh

// --- Initial Setup ---

export function showDifficultyScreen() {
    difficultyScreen.style.display = 'flex';
    gameCanvas.style.display = 'none';
    minimapCanvas.style.display = 'none';
    equipmentMenu.style.display = 'none';
}

// New: Mouse tracking
let mouseX = 0;
let mouseY = 0;

gameCanvas.addEventListener('mousemove', (e) => {
    const rect = gameCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Export mouseX and mouseY for gameLogic to use
export { mouseX, mouseY };