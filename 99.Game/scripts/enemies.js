// --- enemies.js ---
// Contiene las definiciones de los enemigos, sus sprites y la lógica de carga de imágenes.




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

export function createWhiteWolfSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const bodyMain = '#F0F0F0'; 
    const furLight = '#FFFFFF';   
    const shadowGrey = '#D0D0D0'; 
    const eyeColor = '#ADD8E6'; 
    const clawColor = '#555555'; 
    const highlightWhite = '#E0E0E0'; 
    ctx.fillStyle = bodyMain;
    ctx.beginPath();
    ctx.moveTo(10, 40); 
    ctx.quadraticCurveTo(0, 35, 8, 25); 
    ctx.quadraticCurveTo(15, 30, 10, 40); 
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = furLight;
    ctx.beginPath();
    ctx.moveTo(11, 38); 
    ctx.quadraticCurveTo(3, 34, 9, 28); 
    ctx.quadraticCurveTo(14, 32, 11, 38);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = shadowGrey;
    ctx.beginPath(); ctx.ellipse(18, 48, 6, 12, -0.25 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(46, 48, 6, 12, 0.25 * Math.PI, 0, Math.PI * 2); ctx.fill();  
    
    ctx.fillStyle = bodyMain;
    ctx.beginPath(); ctx.ellipse(25, 50, 7, 13, -0.1 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(39, 50, 7, 13, 0.1 * Math.PI, 0, Math.PI * 2); ctx.fill();  
    ctx.fillStyle = bodyMain;
    ctx.beginPath();
    ctx.ellipse(32, 40, 20, 14, 0, 0, Math.PI * 2); 
    ctx.fill();
    
    ctx.fillStyle = furLight;
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
    ctx.fillStyle = highlightWhite; 
    ctx.beginPath();
    ctx.ellipse(54, 26, 6, 3, -0.1 * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = shadowGrey; 
    ctx.beginPath();
    ctx.ellipse(59, 23, 3.5, 2.5, -0.1 * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = shadowGrey;
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
export function createGolemMiniBossSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Define colors
    const darkStone = '#424242';
    const mediumStone = '#616161';
    const lightStone = '#9E9E9E';
    const neonBlue = '#00FFFF';

    // Body - segmented large stone
    ctx.fillStyle = mediumStone;
    ctx.fillRect(15, 25, 34, 35); // Main body
    ctx.fillStyle = darkStone;
    ctx.fillRect(15, 25, 34, 5); // Top segment
    ctx.fillRect(15, 35, 34, 5); // Middle segment
    ctx.fillRect(15, 45, 34, 5); // Bottom segment

    // Head - segmented stone
    ctx.fillStyle = mediumStone;
    ctx.fillRect(22, 10, 20, 18); // Head base
    ctx.fillStyle = darkStone;
    ctx.fillRect(22, 10, 20, 4); // Head top segment

    // Arms - segmented stone
    ctx.fillStyle = mediumStone;
    ctx.fillRect(5, 30, 10, 25); // Left arm
    ctx.fillRect(49, 30, 10, 25); // Right arm
    ctx.fillStyle = darkStone;
    ctx.fillRect(5, 30, 10, 5); // Left arm top segment
    ctx.fillRect(49, 30, 10, 5); // Right arm top segment

    // Legs - segmented stone
    ctx.fillStyle = mediumStone;
    ctx.fillRect(20, 60, 10, 15); // Left leg
    ctx.fillRect(34, 60, 10, 15); // Right leg
    ctx.fillStyle = darkStone;
    ctx.fillRect(20, 60, 10, 3); // Left leg top segment
    ctx.fillRect(34, 60, 10, 3); // Right leg top segment

    // Neon blue eyes
    ctx.fillStyle = neonBlue;
    ctx.shadowColor = neonBlue;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(28, 18, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(36, 18, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Neon blue glowing cracks/lines on body
    ctx.strokeStyle = neonBlue;
    ctx.lineWidth = 2;
    ctx.shadowColor = neonBlue;
    ctx.shadowBlur = 5;

    ctx.beginPath();
    ctx.moveTo(20, 30);
    ctx.lineTo(18, 32);
    ctx.lineTo(22, 38);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(44, 30);
    ctx.lineTo(46, 32);
    ctx.lineTo(42, 38);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(32, 40);
    ctx.lineTo(30, 42);
    ctx.lineTo(34, 48);
    ctx.stroke();

    ctx.shadowBlur = 0;

    return canvas.toDataURL();
}
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
export function createFloorSprite() {
    if (sprites.floor) return sprites.floor;
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const x = c.getContext('2d');

    // Base color with a darker, more dungeon-like gradient
    const gradient = x.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#4A4A4A'); // Darker grey
    gradient.addColorStop(1, '#2A2A2A'); // Even darker grey
    x.fillStyle = gradient;
    x.fillRect(0, 0, 64, 64);

    // Grid lines with more pronounced shadows and highlights for depth
    x.lineWidth = 1.5; // Slightly thicker lines
    for (let y = 0; y < 64; y += 16) {
        // Shadow for horizontal lines (bottom-right offset)
        x.strokeStyle = '#1A1A1A'; 
        x.beginPath();
        x.moveTo(0, y + 1.5);
        x.lineTo(64, y + 1.5);
        x.stroke();
        // Highlight for horizontal lines (top-left offset)
        x.strokeStyle = '#6A6A6A'; 
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(64, y);
        x.stroke();
    }
    for (let X = 0; X < 64; X += 16) {
        // Shadow for vertical lines (bottom-right offset)
        x.strokeStyle = '#1A1A1A'; 
        x.beginPath();
        x.moveTo(X + 1.5, 0);
        x.lineTo(X + 1.5, 64);
        x.stroke();
        // Highlight for vertical lines (top-left offset)
        x.strokeStyle = '#6A6A6A'; 
        x.beginPath();
        x.moveTo(X, 0);
        x.lineTo(X, 64);
        x.stroke();
    }

    // Random details (cracks, etc.) - adjust color to fit darker theme
    x.strokeStyle = '#3A3A3A'; // Darker for cracks
    const p = [
        { x: 12, y: 15, l: 10, a: 0.5 }, { x: 32, y: 24, l: 8, a: 1.2 },
        { x: 48, y: 40, l: 12, a: 2.1 }, { x: 20, y: 52, l: 9, a: 3.6 },
        { x: 52, y: 8, l: 11, a: 5.2 }
    ];
    for (const k of p) {
        x.beginPath();
        x.moveTo(k.x, k.y);
        x.lineTo(k.x + Math.cos(k.a) * k.l, k.y + Math.sin(k.a) * k.l);
        x.stroke();
    }
    return c.toDataURL();
}

export function createChestSprite() { const c = document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle = '#8B4513';x.fillRect(12,20,40,30);x.fillStyle = '#A0522D';x.fillRect(12,20,40,10);x.fillStyle = '#555';x.fillRect(12,30,40,4);x.fillRect(12,40,40,4);x.fillStyle = '#FFD700';x.fillRect(28,28,8,8);x.fillStyle = '#000';x.beginPath();x.arc(32,32,2,0,Math.PI*2);x.fill();x.fillStyle = 'rgba(255,255,255,0.2)';x.fillRect(14,22,36,2);return c.toDataURL(); }

export function createTorchSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Palo de la antorcha
    ctx.fillStyle = '#8B4513'; // Marrón
    ctx.fillRect(30, 30, 4, 20); // Base del palo

    // Llama de la antorcha (simple)
    ctx.fillStyle = '#FFD700'; // Amarillo dorado
    ctx.beginPath();
    ctx.moveTo(32, 28); // Punta superior
    ctx.lineTo(28, 35); // Esquina inferior izquierda
    ctx.lineTo(36, 35); // Esquina inferior derecha
    ctx.closePath();
    ctx.fill();

    // Pequeño brillo alrededor de la llama
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 15);
    gradient.addColorStop(0, 'rgba(255, 165, 0, 0.5)'); // Naranja brillante
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0)'); // Transparente
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 15, 0, Math.PI * 2);
    ctx.fill();

    return canvas.toDataURL();
}

export function createMonster(type, tileX, tileY, floor, dropsKey = false) {
    const floorMultiplier = 1 + (floor - 1) * 0.2;
    let monster = {
        type: type,
        tileX: tileX,
        tileY: tileY,
        hp: 0,
        maxHp: 0,
        atk: 0,
        spd: 1,
        xp: 0,
        dropsKey: dropsKey,
        lastMoveTime: 0,
        lastAttackTime: 0,
        hitFrame: 0,
        isAttacking: false,
        attackAnimFrame: 0,
        attackAnimDuration: 5,
        attackDirectionX: 0,
        attackDirectionY: 0,
        moveSpeed: 1000, // Slower base speed
        attackSpeed: 1500,
        attackRange: 1.5,
        aggroRange: 5,
        lastKnownTargetPosition: null,
        isFrozen: false,
        frozenEndTime: 0,
        abilityCooldowns: {},
    };

    switch (type) {
        case 'duende':
            monster.hp = monster.maxHp = Math.floor(20 * floorMultiplier);
            monster.atk = Math.floor(5 * floorMultiplier);
            monster.xp = 10;
            break;
        case 'lobo':
            monster.hp = monster.maxHp = Math.floor(30 * floorMultiplier);
            monster.atk = Math.floor(8 * floorMultiplier);
            monster.spd = 1.5;
            monster.xp = 15;
            monster.moveSpeed = 700;
            break;
        case 'skeleton':
            monster.hp = monster.maxHp = Math.floor(25 * floorMultiplier);
            monster.atk = Math.floor(10 * floorMultiplier);
            monster.xp = 20;
            break;
        case 'miniBoss':
            monster.hp = monster.maxHp = Math.floor(100 * floorMultiplier);
            monster.atk = Math.floor(20 * floorMultiplier);
            monster.spd = 1.2;
            monster.xp = 100;
            monster.dropsKey = true;
            monster.attackRange = 2;
            monster.aggroRange = 8;
            break;
        case 'boss':
            monster.hp = monster.maxHp = Math.floor(200 * floorMultiplier);
            monster.atk = Math.floor(35 * floorMultiplier);
            monster.spd = 0.8;
            monster.xp = 500;
            monster.attackRange = 1.5;
            monster.aggroRange = 10;
            break;
        case 'finalBoss':
             monster.hp = monster.maxHp = Math.floor(350 * (1 + (floor - 1) * 0.6));
             monster.atk = Math.floor(70 * (1 + (floor - 1) * 0.4));
             monster.spd = 0.7;
             monster.xp = 5000;
             monster.width = 2;
             monster.height = 2;
             monster.moveSpeed = 800;
             monster.attackSpeed = 1000;
             monster.attackRange = 1.5;
             monster.aggroRange = 8;
             break;
        case 'spiderling':
            monster.hp = monster.maxHp = Math.floor(15 * floorMultiplier);
            monster.atk = Math.floor(10 * floorMultiplier);
            monster.spd = 2;
            monster.xp = 5;
            monster.moveSpeed = 500;
            break;
        case 'minion':
            monster.isMinion = true;
            monster.hp = monster.maxHp = 50 + Math.floor(player.level * 2);
            monster.atk = 10 + Math.floor(player.atk * 0.3);
            monster.spd = player.spd * 0.8;
            monster.xp = 0;
            monster.moveSpeed = 500;
            monster.attackSpeed = 1200;
            monster.aggroRange = 10;
            break;
    }
    return monster;
}






export function loadSprites() {
    // Create all sprite data URLs first
    if (!sprites.duende) sprites.duende = createDuendeSprite();
    if (!sprites.lobo) sprites.lobo = createWolfSprite();
    if (!sprites.skeleton) sprites.skeleton = createSkeletonSprite();
    if (!sprites.miniBoss) {
        sprites.miniBoss = createWhiteWolfSprite();
    }
    if (!sprites.boss) sprites.boss = createGolemMiniBossSprite();
    if (!sprites.finalBoss) sprites.finalBoss = createArachnidBossSprite();
    if (!sprites.spiderling) sprites.spiderling = createSpiderlingSprite();
    sprites.floor = './assets/dungeon_floor.jpg'; // Use the image directly
    sprites.wall_up = './assets/wall_up.jpg';
    sprites.wall_down = './assets/wall_down.jpg';
    sprites.wall_left = './assets/wall_left.jpg';
    sprites.wall_right = './assets/wall_right.jpg';
    if (!sprites.chest) sprites.chest = createChestSprite();
    if (!sprites.stairs) sprites.stairs = createStairsSprite();
    if (!sprites.torch) sprites.torch = createTorchSprite();
}