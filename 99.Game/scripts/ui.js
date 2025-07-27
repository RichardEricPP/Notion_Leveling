// --- ui.js ---
// Contiene toda la lógica para manipular el DOM, actualizar la interfaz de usuario y dibujar en el canvas.

// --- IMPORTS ---
import { player, activeSetBonusName, updateStats } from './player.js';
import { skills, gearList, setBonuses, equipmentSlotsOrder, equipmentSlotNames } from './data.js';
import { monsters, chests, loadedImages, sprites } from './enemies.js';
import { 
    gameStarted, gameOver, keys, lastGameScore, lastEnemiesDefeated, finalOutcomeMessage, 
    finalOutcomeMessageLine2, projectiles, damageTexts, criticalHitEffects, warMaceShockwave, 
    screenShake, map, mapWidth, mapHeight, tileSize, stairLocation, skillCooldowns, currentFloor, 
    // Se importarán funciones de lógica para ser llamadas desde los manejadores de eventos
    useItem, learnSkill, equipItem, equipSkill, activateSkill 
} from './gameLogic.js';


// --- EXPORTS ---

// --- State Variables for UI ---
export let isInventoryOpen = false;
export let isSkillMenuOpen = false;
export let isEquipmentOpen = false; 
let selectedIndex = 0;
let selectedSkillIndex = 0;
let selectedEquipmentSlotIndex = 0; 

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
export function drawStairs(x,y) { if(loadedImages.stairs && loadedImages.stairs.complete) ctx.drawImage(loadedImages.stairs, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#704214'; ctx.fillRect(x,y,tileSize,tileSize);}}

function drawPlayer(x, y) {
    let drawX = x;
    let drawY = y;

    if (player.isAttacking) {
        const progress = player.attackAnimFrame / player.attackAnimDuration; 
        let lunge = 0;
        if (progress < 0.5) { 
            lunge = player.attackLungeDistance * (progress / 0.5);
        } else { 
            lunge = player.attackLungeDistance * ((1 - progress) / 0.5);
        }

        if (player.facingDirection === 'right') drawX += lunge;
        else if (player.facingDirection === 'left') drawX -= lunge;
        else if (player.facingDirection === 'up') drawY -= lunge;
        else if (player.facingDirection === 'down') drawY += lunge;
    }

    if (loadedImages.player && loadedImages.player.complete) {
        ctx.drawImage(loadedImages.player, 0,0,64,64, drawX, drawY, tileSize, tileSize);
    } else { 
        ctx.fillStyle = 'blue'; ctx.fillRect(drawX, drawY, tileSize, tileSize);
    }

    if (player.hitFrame > 0) { 
        ctx.save();
        ctx.globalAlpha = 0.5 + (player.hitFrame / 10) * 0.3; 
        ctx.fillStyle = 'red'; 
        ctx.fillRect(drawX, drawY, tileSize, tileSize); 
        ctx.restore();
        player.hitFrame--; 
    }
    const currentTime = Date.now();
    if (currentTime - player.lastHitTime < player.invulnerabilityTime) { 
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(currentTime / 100) * 0.2; 
        ctx.fillStyle = 'rgba(100, 100, 255, 0.7)'; 
        ctx.beginPath();
        ctx.arc(drawX + tileSize/2, drawY + tileSize/2, tileSize/2 + 3, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    if (player.isSlowed && currentTime < player.slowEndTime) {
        ctx.fillStyle = 'rgba(0, 100, 255, 0.3)'; 
        ctx.fillRect(drawX, drawY, tileSize, tileSize);
    }
    if (player.isInvincible && currentTime < player.invincibleEndTime) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)'; 
        ctx.fillRect(drawX, drawY, tileSize, tileSize);
    }
    if (player.stealthActive && currentTime < player.stealthEndTime) { 
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; 
        ctx.fillRect(drawX, drawY, tileSize, tileSize);
    }

    if (player.hasMiniShield && player.miniShieldHP > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; 
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(drawX + tileSize / 2, drawY + tileSize / 2, tileSize / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; 
        ctx.fill();

        const shieldHealthPercent = player.miniShieldHP / player.miniShieldMaxHP;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(drawX + 5, drawY - 15, tileSize - 10, 5);
        ctx.fillStyle = shieldHealthPercent > 0.5 ? 'rgba(0,255,255,0.7)' : shieldHealthPercent > 0.25 ? 'rgba(255,255,0,0.7)' : 'rgba(255,0,0,0.7)';
        ctx.fillRect(drawX + 5, drawY - 15, (tileSize - 10) * shieldHealthPercent, 5);

        ctx.restore();
    }

    const healthPercent = player.hp / player.maxHp;
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(drawX+5, drawY-10, tileSize-10, 5);
    ctx.fillStyle = healthPercent > 0.5 ? 'rgba(0,255,0,0.7)' : healthPercent > 0.25 ? 'rgba(255,255,0,0.7)' : 'rgba(255,0,0,0.7)';
    ctx.fillRect(drawX+5, drawY-10, (tileSize-10)*healthPercent, 5);
}

function drawMonster(m, screenX, screenY) {
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
        ctx.drawImage(monsterImage, 0,0,64,64, screenX, screenY, drawWidth, drawHeight);
        
    } else { 
        ctx.fillStyle = m.type === 'duende' ? '#5C6B00' : (m.type === 'lobo' ? '#8C0000' : (m.type === 'final-arachnid-boss' ? '#3A1E00' : (m.type === 'spiderling' ? '#4A2A05' : 'gray'))); 
        ctx.fillRect(screenX, screenY, tileSize * (m.width || 1), tileSize * (m.height || 1));
        
    }
    if (m.hitFrame > 0) { ctx.fillStyle = 'rgba(255,0,0,0.5)'; ctx.fillRect(screenX, screenY, tileSize * (m.width || 1), tileSize * (m.height || 1)); }
    if (m.isFrozen && Date.now() < m.frozenEndTime) {
        ctx.fillStyle = 'rgba(0, 191, 255, 0.3)'; 
        ctx.fillRect(screenX, screenY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }
    if (m.isWeakened && Date.now() < m.weaknessEndTime) {
        ctx.fillStyle = 'rgba(128, 0, 128, 0.3)'; 
        ctx.fillRect(screenX, screenY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }
    if (m.isBleeding && Date.now() < m.bleedingEndTime) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; 
        ctx.fillRect(screenX, screenY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }
    if (m.isAttackSlowed && Date.now() < m.attackSlowEndTime) {
        ctx.fillStyle = 'rgba(135, 206, 235, 0.3)'; 
        ctx.fillRect(screenX, screenY, tileSize * (m.width || 1), tileSize * (m.height || 1));
    }

    const healthPercentMonster = m.hp / m.maxHp; 
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(screenX+5, screenY-10, tileSize-10, 5);
    ctx.fillStyle = healthPercentMonster > 0.5 ? 'rgba(0,255,0,0.7)' : healthPercentMonster > 0.25 ? 'rgba(255,255,0,0.7)' : 'rgba(255,0,0,0.7)';
    ctx.fillRect(screenX+5, screenY-10, (tileSize-10)*healthPercentMonster, 5);
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
        }
        ctx.restore(); 
    });
}

function drawDamageTexts(offsetX, offsetY) {
    damageTexts.forEach(text => {
        text.y += text.velY;
        text.life--;

        const screenX = text.x * tileSize - offsetX + tileSize / 2;
        const screenY = text.y * tileSize - offsetY;

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

    warMaceShockwave.life--;
    if (warMaceShockwave.life <= 0) {
        warMaceShockwave = null;
        return;
    }

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

export function drawMap() {
    const offsetX = Math.max(0, Math.min(player.tileX * tileSize - gameCanvas.width / 2 + tileSize / 2, mapWidth * tileSize - gameCanvas.width));
    const offsetY = Math.max(0, Math.min(player.tileY * tileSize - gameCanvas.height / 2 + tileSize / 2, mapHeight * tileSize - gameCanvas.height));
    const startX = Math.floor(offsetX / tileSize);
    const endX = Math.min(mapWidth - 1, Math.ceil((offsetX + gameCanvas.width) / tileSize));
    const startY = Math.floor(offsetY / tileSize);
    const endY = Math.min(mapHeight - 1, Math.ceil((offsetY + gameCanvas.height) / tileSize));

    let shakeOffsetX = 0, shakeOffsetY = 0;
    if (screenShake > 0) {
        shakeOffsetX = (Math.random() - 0.5) * screenShake * 2; 
        shakeOffsetY = (Math.random() - 0.5) * screenShake * 2;
        screenShake--;
    }
    ctx.fillStyle = '#2a1f15'; ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.save(); ctx.translate(shakeOffsetX, shakeOffsetY);

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            const screenX = x * tileSize - offsetX; const screenY = y * tileSize - offsetY;
            if (map[y] && map[y][x] !== undefined) { 
                if (map[y][x] === 0) drawWall(screenX, screenY);
                else if (map[y][x] === 1) drawFloor(screenX, screenY);
                else if (map[y][x] === 2) { drawFloor(screenX, screenY); drawChest(screenX, screenY); }
                else if (map[y][x] === stairLocation.type && stairLocation.active) { 
                    drawFloor(screenX, screenY); 
                    drawStairs(screenX, screenY);
                }
                else { 
                    drawFloor(screenX, screenY);
                }
            } else { 
                drawFloor(screenX, screenY);
            }
        }
    }
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
            ctx.fillText("Haz Completado la Mazmorra", gameCanvas.width/2, gameCanvas.height/2 - 70);
            ctx.fillText("Haz superado la clase E", gameCanvas.width/2, gameCanvas.height/2 - 40);
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

            if (map[y][x] === 0) { 
                minimapCtx.fillStyle = '#333';
            } else if (map[y][x] === 1) { 
                minimapCtx.fillStyle = '#888';
            } else if (map[y][x] === 2) { 
                minimapCtx.fillStyle = '#FFD700'; 
            } else if (map[y][x] === stairLocation.type && stairLocation.active) { 
                minimapCtx.fillStyle = '#00FFFF'; 
            }
            minimapCtx.fillRect(miniX, miniY, minimapTileSize, minimapTileSize);
        }
    }

    minimapCtx.fillStyle = 'blue';
    minimapCtx.fillRect(player.tileX * minimapTileSize, player.tileY * minimapTileSize, minimapTileSize, minimapTileSize);

    monsters.forEach(m => { 
        if (m.isMinion) { 
            minimapCtx.fillStyle = 'cyan';
        } else {
            minimapCtx.fillStyle = 'red';
        }
        minimapCtx.fillRect(m.tileX * minimapTileSize, m.tileY * minimapTileSize, minimapTileSize * (m.width || 1), minimapTileSize * (m.height || 1));
    });
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
            const cooldownRemaining = Math.max(0, (skillCooldowns[equippedSkill.name] - currentTime));
            if (equippedSkill.cooldown === 0) { 
                skillText += " (Pasiva)";
                textColor = '#00008B'; 
            } else if (player.skillUsageThisFloor[equippedSkill.name]) { 
                skillText += " (Usado)";
                textColor = '#909090'; 
            } else if (cooldownRemaining > 0) { 
                skillText += ` (${(cooldownRemaining/1000).toFixed(1)}s)`;
                textColor = '#666'; 
            } else { 
                skillText += ` [${index + 1}]`; 
                textColor = '#008000'; 
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
            statusText = isEquippedInSlot ? ' (Activa)' : ' (Desbloqueada)';
            if (skill.cooldown !== 0 && player.skillUsageThisFloor[skill.name]) { 
                li.classList.add('skill-used');
            }
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
            const allSkills = skills.filter(s => s.type === 'active'); // Use all skills from data.js
            const currentSkillIndex = equippedSkillName ? allSkills.findIndex(s => s.name === equippedSkillName) : -1;
            
            let displaySkillName = equippedSkillName ? equippedSkillName : '(Ninguna)';
            if (allSkills.length > 0) {
                displaySkillName += ` (${currentSkillIndex + 1}/${allSkills.length})`;
            }
            itemNameSpan.textContent = `${equipmentSlotNames[slotType]}: ${displaySkillName}`;
        } else { 
            const item = player.equipped[slotType];
            const allItemsForSlot = player.inventory.filter(g => g.type === slotType); // Use all gear from data.js
            const currentItemIndex = item ? allItemsForSlot.findIndex(g => g.name === item.name) : -1;

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
            if (allItemsForSlot.length > 0) {
                displayItemName += ` (${currentItemIndex + 1}/${allItemsForSlot.length})`;
            }
            itemNameSpan.textContent = `${equipmentSlotNames[slotType]}: ${displayItemName}${statsText}`;
        }
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
    } else if (e.code === 'KeyO' || e.code === 'Escape') {
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
    dungeon: '../2.Music/1. - Solo LevelingSymphonicSuite Lv.1.mp3',
    boss: '../2.Music/99. Bozz.mp3',
    equipmentOpen: '../2.Music/98. System.mp3'
};
let currentMusic = new Audio();
let currentTrackName = '';

export function playMusic(trackName) {
    if (currentTrackName === trackName) return;
    currentTrackName = trackName;
    currentMusic.pause();
    currentMusic.src = musicTracks[trackName];
    currentMusic.loop = true;
    currentMusic.volume = 0.3;
    
}

// --- Initial Setup ---

export function showDifficultyScreen() {
    difficultyScreen.style.display = 'flex';
    gameCanvas.style.display = 'none';
    minimapCanvas.style.display = 'none';
    equipmentMenu.style.display = 'none';
}
