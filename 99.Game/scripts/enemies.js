// --- enemies.js ---
// Contiene las definiciones de los enemigos, sus sprites y la lógica de carga de imágenes.

// --- IMPORTS ---


// --- EXPORTS ---

/**
 * Array que contendrá las instancias de los monstruos activos en el piso actual.
 */
export let monsters = [];

/**
 * Array que contendrá las instancias de los cofres en el piso actual.
 */
export let chests = [];

/**
 * Objeto para almacenar las imágenes de los sprites generadas como Data URLs.
 */
export const sprites = {}; 

/**
 * Objeto para almacenar las instancias de Imagen cargadas para ser dibujadas en el canvas.
 */
export const loadedImages = {}; 

// --- Sprite Creation Functions ---

export function createDuendeSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2E7D32'; 
    ctx.beginPath();
    ctx.moveTo(32, 8); 
    ctx.lineTo(20, 28); 
    ctx.lineTo(44, 28); 
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1B5E20'; 
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#66BB6A'; 
    ctx.beginPath();
    ctx.ellipse(32, 30, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#66BB6A';
    ctx.beginPath(); 
    ctx.moveTo(19, 25); ctx.lineTo(13, 20); ctx.lineTo(19, 30); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#4CAF50'; ctx.stroke(); 
    ctx.beginPath(); 
    ctx.moveTo(45, 25); ctx.lineTo(51, 20); ctx.lineTo(45, 30); ctx.closePath(); ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FDD835'; 
    ctx.beginPath(); ctx.ellipse(27, 29, 4, 5, -0.1 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(37, 29, 4, 5, 0.1 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
    ctx.fillStyle = '#000'; 
    ctx.beginPath(); ctx.arc(27, 30, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(37, 30, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#388E3C'; 
    ctx.fillRect(22, 38, 20, 18);
    ctx.strokeStyle = '#2E7D32';
    ctx.strokeRect(22, 38, 20, 18);
    ctx.fillStyle = '#757575'; 
    ctx.beginPath();
    ctx.moveTo(40, 40); ctx.lineTo(45, 35); ctx.lineTo(47, 37); ctx.lineTo(42, 42);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4E342E'; 
    ctx.fillRect(41, 41, 3, 5);
    return canvas.toDataURL();
}

export function createWolfSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const bodyMain = '#B71C1C'; 
    const furRed = '#D32F2F';   
    const shadowRed = '#7F0000'; 
    const eyeColor = '#FF4500'; 
    const clawColor = '#212121'; 
    const highlightRed = '#E57373'; 
    ctx.fillStyle = bodyMain;
    ctx.beginPath();
    ctx.moveTo(10, 40); 
    ctx.quadraticCurveTo(0, 35, 8, 25); 
    ctx.quadraticCurveTo(15, 30, 10, 40); 
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = furRed;
    ctx.beginPath();
    ctx.moveTo(11, 38); 
    ctx.quadraticCurveTo(3, 34, 9, 28); 
    ctx.quadraticCurveTo(14, 32, 11, 38);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = shadowRed;
    ctx.beginPath(); ctx.ellipse(18, 48, 6, 12, -0.25 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(46, 48, 6, 12, 0.25 * Math.PI, 0, Math.PI * 2); ctx.fill();  
    
    ctx.fillStyle = bodyMain;
    ctx.beginPath(); ctx.ellipse(25, 50, 7, 13, -0.1 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(39, 50, 7, 13, 0.1 * Math.PI, 0, Math.PI * 2); ctx.fill();  
    ctx.fillStyle = bodyMain;
    ctx.beginPath();
    ctx.ellipse(32, 40, 20, 14, 0, 0, Math.PI * 2); 
    ctx.fill();
    
    ctx.fillStyle = furRed;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(18 + i * 7, 30); 
        ctx.lineTo(21 + i * 7, 22 - Math.random()*3); 
        ctx.lineTo(24 + i * 7, 30);
        ctx.closePath();
        ctx.fill();
    }
    ctx.fillStyle = bodyMain;
    ctx.beginPath();
    ctx.ellipse(50, 29, 13, 9, -0.1 * Math.PI, 0, Math.PI * 2); 
    ctx.fill();
    ctx.fillStyle = highlightRed; 
    ctx.beginPath();
    ctx.ellipse(54, 26, 6, 3, -0.1 * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = shadowRed; 
    ctx.beginPath();
    ctx.ellipse(59, 23, 3.5, 2.5, -0.1 * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = shadowRed;
    ctx.beginPath(); 
    ctx.moveTo(43, 20); ctx.lineTo(39, 8); ctx.lineTo(47, 17); ctx.closePath(); ctx.fill();
    ctx.beginPath(); 
    ctx.moveTo(57, 20); ctx.lineTo(53, 8); ctx.lineTo(61, 17); ctx.closePath(); ctx.fill();
    
    ctx.fillStyle = eyeColor;
    ctx.shadowColor = eyeColor;
    ctx.shadowBlur = 5;
    ctx.beginPath(); ctx.ellipse(46, 28, 3.5, 2.5, 0,0, Math.PI*2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(55, 28, 3.5, 2.5, 0,0, Math.PI*2); ctx.fill(); 
    ctx.shadowBlur = 0; 
    ctx.fillStyle = clawColor;
    ctx.beginPath(); ctx.moveTo(20,59); ctx.lineTo(18,63); ctx.lineTo(22,61); ctx.closePath(); ctx.fill(); 
    ctx.beginPath(); ctx.moveTo(34,59); ctx.lineTo(32,63); ctx.lineTo(36,61); ctx.closePath(); ctx.fill(); 
    
    return canvas.toDataURL();
}

export function createSkeletonSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#f0f0f0';x.fillRect(28,24,8,24);x.fillRect(20,32,24,4);x.fillRect(20,38,24,4);x.beginPath();x.ellipse(32,16,10,12,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(28,14,3,4,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(36,14,3,4,0,0,Math.PI*2);x.fill();x.fillStyle = '#f0f0f0';x.beginPath();x.ellipse(32,22,8,4,0,0,Math.PI);x.fill();x.strokeStyle = '#000';x.lineWidth = 1;x.beginPath();x.moveTo(24,22);x.lineTo(40,22);x.stroke();x.fillStyle = '#f0f0f0';x.fillRect(16,32,12,4);x.fillRect(36,32,12,4);x.fillRect(24,48,4,12);x.fillRect(36,48,4,12);x.fillStyle = '#a0a0a0';x.fillRect(48,28,12,2);x.fillStyle = '#8b4513';x.fillRect(44,27,4,4); return c.toDataURL(); }
export function createMiniBossSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#ff6600';x.beginPath();x.ellipse(32,32,20,24,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,16,14,12,0,0,Math.PI*2);x.fill();x.fillStyle = '#ffff00';x.beginPath();x.ellipse(26,14,4,4,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(38,14,4,4,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(26,14,2,2,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(38,14,2,2,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,22,8,4,0,0,Math.PI);x.fill();x.fillStyle = '#8b4513';x.beginPath();x.moveTo(22,10);x.lineTo(18,2);x.lineTo(26,8);x.fill();x.beginPath();x.moveTo(42,10);x.lineTo(46,2);x.lineTo(38,8);x.fill();x.fillStyle = '#8b4513';x.fillRect(48,28,4,16);x.fillStyle = '#a0a0a0';x.beginPath();x.moveTo(52,28);x.lineTo(60,22);x.lineTo(60,34);x.lineTo(52,28);x.fill(); return c.toDataURL(); }
export function createBossSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#990000';x.fillRect(12,12,40,40);x.fillStyle = '#cc0000';x.beginPath();x.ellipse(32,20,16,10,0,0,Math.PI*2);x.fill();x.fillStyle = '#ffff00';x.beginPath();x.ellipse(24,18,5,5,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(40,18,5,5,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(24,18,2,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(40,18,2,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,26,10,4,0,0,Math.PI);x.fill();x.fillStyle = '#fff';for(let i=0;i<5;i++){x.beginPath();x.moveTo(24+i*4,26);x.lineTo(26+i*4,26);x.lineTo(25+i*4,30);x.fill();}x.fillStyle = '#660000';x.fillRect(12,32,40,4);x.fillRect(12,42,40,4);x.fillStyle = '#000';x.fillRect(52,20,4,24);x.fillStyle = '#a0a0a0';x.beginPath();x.moveTo(54,12);x.lineTo(60,20);x.lineTo(48,20);x.fill(); return c.toDataURL(); }
export function createArachnidBossSprite() { 
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64; 
    const ctx = canvas.getContext('2d');
    const bodyColor = '#3A1E00'; 
    const legColor = '#2A1B00';
    const eyeColor = '#FF0000'; 
    const highlightColor = '#5C3601';
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(32, 32, 20, 15, 0, 0, Math.PI * 2); 
    ctx.fill();
    ctx.fillStyle = highlightColor;
    ctx.beginPath();
    ctx.ellipse(32, 30, 18, 12, 0, 0, Math.PI * 2); 
    ctx.fill();
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(32, 18, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = eyeColor;
    ctx.beginPath(); ctx.arc(28, 17, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(36, 17, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(25, 21, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(39, 21, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(32, 22, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = legColor;
    ctx.lineWidth = 6;
    const legSegments = (startX, startY, midX, midY, endX, endY) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.stroke();
    };
    legSegments(25, 30, 10, 20, 5, 10);
    legSegments(22, 35, 5, 35, 0, 38);
    legSegments(22, 40, 5, 45, 0, 50);
    legSegments(25, 45, 10, 55, 5, 60);
    legSegments(39, 30, 54, 20, 59, 10);
    legSegments(42, 35, 59, 35, 64, 38);
    legSegments(42, 40, 59, 45, 64, 50);
    legSegments(39, 45, 54, 55, 59, 60);
    
    return canvas.toDataURL();
}
export function createSpiderlingSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const bodyColor = '#4A2A05'; 
    const legColor = '#3B2304';
    const eyeColor = '#FF4500';
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(32, 32, 8, 6, 0, 0, Math.PI * 2); 
    ctx.fill();
    ctx.fillStyle = eyeColor;
    ctx.beginPath(); ctx.arc(29, 30, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(35, 30, 2, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = legColor;
    ctx.lineWidth = 3;
    const leg = (sx, sy, mx, my, ex, ey) => { ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(mx,my,ex,ey); ctx.stroke();};
    leg(28,32, 20,28, 15,25); leg(27,34, 18,34, 13,34); leg(27,36, 18,38, 13,40); leg(28,38, 20,42, 15,45);
    leg(36,32, 44,28, 49,25); leg(37,34, 46,34, 51,34); leg(37,36, 46,38, 51,40); leg(36,38, 44,42, 49,45);
    return canvas.toDataURL();
}

export function createStairsSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4A3B31'; 
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(8 + i * 8, 8 + i * 8, 48 - i * 16, 8);
    }
    ctx.strokeStyle = '#3A2F28';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.strokeRect(8 + i * 8, 8 + i * 8, 48 - i * 16, 8);
    }
    const gradient = ctx.createRadialGradient(32, 48, 5, 32, 48, 15);
    gradient.addColorStop(0, 'rgba(100, 100, 200, 0.6)');
    gradient.addColorStop(1, 'rgba(100, 100, 200, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 32, 64, 32);
    return canvas.toDataURL();
}
export function createFloorSprite() { if (sprites.floor) return sprites.floor; const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle='#aaa';x.fillRect(0,0,64,64);x.strokeStyle='#888';x.lineWidth=1;for(let y=8;y<64;y+=16){x.beginPath();x.moveTo(0,y);x.lineTo(64,y);x.stroke();}for(let X=8;X<64;X+=16){x.beginPath();x.moveTo(X,0);x.lineTo(X,64);x.stroke();}x.strokeStyle='#777';const p=[{x:12,y:15,l:10,a:0.5},{x:32,y:24,l:8,a:1.2},{x:48,y:40,l:12,a:2.1},{x:20,y:52,l:9,a:3.6},{x:52,y:8,l:11,a:5.2}];for(const k of p){x.beginPath();x.moveTo(k.x,k.y);x.lineTo(k.x+Math.cos(k.a)*k.l,k.y+Math.sin(k.a)*k.l);x.stroke();}return c.toDataURL(); }
export function createWallSprite() { if (sprites.wall) return sprites.wall; const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle='#555';x.fillRect(0,0,64,64);x.strokeStyle='#333';x.lineWidth=2;for(let y=16;y<64;y+=16){x.beginPath();x.moveTo(0,y);x.lineTo(64,y);x.stroke();}for(let r=0;r<4;r++){const o=r%2===0?0:16;for(let X=o;X<64;X+=32){x.beginPath();x.moveTo(X,r*16);x.lineTo(X,r*16+16);x.stroke();}}x.fillStyle='#444';const d=[{x:10,y:8,r:1.5},{x:25,y:12,r:2},{x:40,y:7,r:1.2},{x:55,y:10,r:1.8},{x:15,y:22,r:1.3},{x:30,y:26,r:2.2},{x:48,y:24,r:1.7},{x:8,y:38,r:1.9},{x:22,y:42,r:1.4},{x:38,y:40,r:2.1},{x:52,y:44,r:1.6},{x:12,y:56,r:1.8},{x:28,y:58,r:1.5},{x:44,y:54,r:2},{x:58,y:60,r:1.7},{x:18,y:5,r:1.3},{x:34,y:32,r:1.9},{x:50,y:18,r:1.4},{x:5,y:48,r:2.2},{x:60,y:36,r:1.6}];for(const k of d){x.beginPath();x.arc(k.x,k.y,k.r,0,Math.PI*2);x.fill();}return c.toDataURL(); }
export function createChestSprite() { const c = document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle = '#8B4513';x.fillRect(12,20,40,30);x.fillStyle = '#A0522D';x.fillRect(12,20,40,10);x.fillStyle = '#555';x.fillRect(12,30,40,4);x.fillRect(12,40,40,4);x.fillStyle = '#FFD700';x.fillRect(28,28,8,8);x.fillStyle = '#000';x.beginPath();x.arc(32,32,2,0,Math.PI*2);x.fill();x.fillStyle = 'rgba(255,255,255,0.2)';x.fillRect(14,22,36,2);return c.toDataURL(); }





export function loadSprites() {
    // Create all sprite data URLs first
    if (!sprites.duende) sprites.duende = createDuendeSprite();
    if (!sprites.lobo) sprites.lobo = createWolfSprite();
    if (!sprites.skeleton) sprites.skeleton = createSkeletonSprite();
    if (!sprites.miniBoss) {
        sprites.miniBoss = createMiniBossSprite();
    }
    if (!sprites.boss) sprites.boss = createBossSprite();
    if (!sprites.finalBoss) sprites.finalBoss = createArachnidBossSprite();
    if (!sprites.spiderling) sprites.spiderling = createSpiderlingSprite();
    if (!sprites.floor) sprites.floor = createFloorSprite();
    if (!sprites.wall) sprites.wall = createWallSprite();
    if (!sprites.chest) sprites.chest = createChestSprite();
    if (!sprites.stairs) sprites.stairs = createStairsSprite();
}