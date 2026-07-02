// --- enemies.js ---
// Contiene las definiciones de los enemigos, sus sprites y la lógica de carga de imágenes.




// --- EXPORTS ---



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
    
    ctx.save();
    // Scale and center the 64x80 SVG coordinates into the 64x64 canvas
    ctx.translate(6.4, 0);
    ctx.scale(0.8, 0.8);
    
    const goblinRects = [
        [20, 76, 24, 2, "#1a1a1a"],
        [22, 74, 20, 2, "#1a1a1a", 0.6],
        [12, 58, 4, 2, "#1e8449"],
        [10, 56, 4, 2, "#1e8449"],
        [8, 54, 4, 2, "#1e8449"],
        [8, 52, 3, 2, "#1e8449"],
        [10, 50, 2, 2, "#1e8449"],
        [24, 64, 6, 4, "#1e8449"],
        [24, 68, 6, 6, "#3e2723"],
        [24, 74, 6, 2, "#1a1a1a"],
        [36, 64, 6, 4, "#1e8449"],
        [36, 68, 6, 6, "#3e2723"],
        [36, 74, 6, 2, "#1a1a1a"],
        [24, 42, 20, 22, "#1e8449"],
        [26, 44, 16, 18, "#27ae60"],
        [24, 42, 20, 4, "#3e2723"],
        [30, 42, 8, 4, "#5d4037"],
        [32, 43, 4, 2, "#7f8c8d"],
        [24, 58, 20, 3, "#3e2723"],
        [32, 57, 4, 4, "#7f8c8d"],
        [33, 58, 2, 2, "#2c3e50"],
        [24, 61, 4, 4, "#4e342e"],
        [30, 61, 4, 4, "#4e342e"],
        [36, 61, 4, 4, "#4e342e"],
        [28, 63, 2, 3, "#4e342e"],
        [34, 63, 2, 3, "#4e342e"],
        [18, 44, 6, 4, "#1e8449"],
        [14, 48, 6, 4, "#1e8449"],
        [12, 52, 4, 4, "#1e8449"],
        [10, 54, 4, 4, "#145a32"],
        [10, 54, 2, 2, "#1e8449"],
        [44, 42, 6, 4, "#1e8449"],
        [50, 36, 6, 6, "#1e8449"],
        [54, 30, 4, 6, "#1e8449"],
        [54, 28, 4, 4, "#145a32"],
        [54, 28, 2, 2, "#1e8449"],
        [56, 16, 4, 12, "#7f8c8d"],
        [57, 18, 2, 8, "#95a5a6"],
        [58, 20, 1, 4, "#ecf0f1"],
        [56, 20, 1, 1, "#2c3e50"],
        [56, 22, 1, 1, "#2c3e50"],
        [56, 24, 1, 1, "#2c3e50"],
        [54, 28, 8, 2, "#5a4a3a"],
        [56, 30, 4, 8, "#3e2723"],
        [57, 32, 2, 1, "#5d4037"],
        [57, 34, 2, 1, "#5d4037"],
        [57, 36, 2, 1, "#5d4037"],
        [55, 38, 6, 2, "#5a4a3a"],
        [28, 40, 8, 2, "#1e8449"],
        [26, 38, 12, 4, "#5d4037"],
        [28, 40, 2, 2, "#3e2723"],
        [34, 40, 2, 2, "#3e2723"],
        [24, 18, 20, 20, "#27ae60"],
        [26, 20, 16, 16, "#58d68d"],
        [28, 14, 2, 4, "#c0392b"],
        [30, 12, 2, 6, "#c0392b"],
        [32, 10, 2, 8, "#c0392b"],
        [34, 10, 2, 8, "#c0392b"],
        [36, 12, 2, 6, "#c0392b"],
        [38, 14, 2, 4, "#c0392b"],
        [30, 10, 2, 2, "#e74c3c"],
        [34, 8, 2, 2, "#e74c3c"],
        [36, 10, 2, 2, "#e74c3c"],
        [20, 22, 4, 8, "#27ae60"],
        [18, 24, 4, 6, "#27ae60"],
        [16, 26, 4, 4, "#1e8449"],
        [18, 28, 2, 2, "#58d68d"],
        [44, 22, 4, 8, "#27ae60"],
        [46, 24, 4, 6, "#27ae60"],
        [48, 26, 4, 4, "#1e8449"],
        [48, 28, 2, 2, "#58d68d"],
        [16, 30, 2, 2, "#7f8c8d"],
        [50, 30, 2, 2, "#7f8c8d"],
        [26, 24, 16, 6, "#1e8449"],
        [28, 26, 12, 4, "#145a32"],
        [26, 26, 8, 2, "#0a2e1a"],
        [34, 26, 8, 2, "#0a2e1a"],
        [28, 30, 4, 2, "#f1c40f"],
        [36, 30, 4, 2, "#f1c40f"],
        [29, 30, 2, 2, "#000"],
        [37, 30, 2, 2, "#000"],
        [29, 30, 1, 1, "#fff"],
        [37, 30, 1, 1, "#fff"],
        [32, 34, 4, 2, "#1e8449"],
        [33, 33, 2, 1, "#58d68d"],
        [24, 32, 3, 3, "#58d68d", 0.4],
        [41, 32, 3, 3, "#58d68d", 0.4],
        [28, 38, 12, 1, "#0a2e1a"],
        [30, 39, 1, 2, "#ecf0f1"],
        [37, 39, 1, 2, "#ecf0f1"],
        [32, 39, 2, 1, "#bdc3c7"],
        [35, 39, 2, 1, "#bdc3c7"],
        [24, 28, 2, 1, "#7b241c", 0.6],
        [25, 29, 1, 2, "#7b241c", 0.6],
        [16, 48, 4, 2, "#3e2723"],
        [50, 38, 4, 2, "#3e2723"]
    ];
    
    for (const r of goblinRects) {
        ctx.fillStyle = r[4];
        ctx.globalAlpha = r[5] !== undefined ? r[5] : 1.0;
        ctx.fillRect(r[0], r[1], r[2], r[3]);
    }
    
    ctx.restore();
    return canvas.toDataURL();
}

export function createWolfSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.save();
    // Scale and center the 96x72 SVG coordinates into the 64x64 canvas
    // 64 / 96 = 2/3 (0.66667)
    // Scaled height is 72 * (2/3) = 48px. Centered vertically: (64 - 48)/2 = 8px.
    ctx.translate(0, 8);
    ctx.scale(2/3, 2/3);
    
    const wolfRects = [
        [16, 68, 64, 2, "#000000"],
        [18, 66, 60, 2, "#000000", 0.6],
        [18, 48, 4, 6, "#660000"],
        [8, 44, 10, 4, "#990000"],
        [10, 40, 12, 4, "#cc0000"],
        [16, 38, 6, 4, "#e60000"],
        [4, 44, 4, 4, "#990000"],
        [2, 40, 4, 6, "#cc0000"],
        [0, 34, 6, 8, "#e60000"],
        [2, 28, 6, 8, "#ff4d4d"],
        [4, 22, 5, 8, "#ff3333"],
        [6, 18, 4, 6, "#cc0000"],
        [4, 16, 2, 4, "#990000"],
        [2, 14, 2, 4, "#ff4d4d"],
        [4, 12, 2, 2, "#ffb3b3"],
        [8, 24, 4, 2, "#ff4d4d"],
        [-2, 30, 4, 2, "#cc0000"],
        [18, 54, 5, 4, "#660000"],
        [18, 58, 5, 8, "#400000"],
        [18, 66, 5, 2, "#260000"],
        [16, 68, 2, 2, "#120000"],
        [19, 68, 2, 2, "#120000"],
        [22, 68, 2, 2, "#120000"],
        [26, 54, 5, 4, "#cc0000"],
        [26, 58, 5, 8, "#990000"],
        [26, 66, 5, 2, "#660000"],
        [24, 68, 2, 2, "#260000"],
        [27, 68, 2, 2, "#260000"],
        [30, 68, 2, 2, "#260000"],
        [22, 36, 38, 20, "#cc0000"],
        [24, 38, 34, 16, "#e60000"],
        [26, 40, 30, 12, "#ff4d4d"],
        [30, 38, 6, 4, "#660000"],
        [38, 38, 6, 4, "#660000"],
        [46, 38, 4, 4, "#660000"],
        [32, 42, 4, 2, "#400000"],
        [40, 42, 4, 2, "#400000"],
        [30, 32, 4, 6, "#ff6666"],
        [32, 28, 2, 4, "#ffb3b3"],
        [38, 34, 6, 4, "#ff1a1a"],
        [40, 30, 2, 6, "#ff4d4d"],
        [46, 32, 4, 6, "#ff6666"],
        [48, 26, 2, 6, "#ffb3b3"],
        [48, 40, 10, 12, "#ff4d4d"],
        [50, 42, 8, 8, "#ff3333"],
        [52, 44, 6, 4, "#ff4d4d"],
        [48, 54, 5, 4, "#660000"],
        [48, 58, 5, 8, "#400000"],
        [48, 66, 5, 2, "#260000"],
        [46, 68, 2, 2, "#120000"],
        [49, 68, 2, 2, "#120000"],
        [52, 68, 2, 2, "#120000"],
        [56, 54, 6, 4, "#cc0000"],
        [56, 58, 6, 8, "#990000"],
        [56, 66, 6, 2, "#660000"],
        [54, 68, 2, 2, "#260000"],
        [57, 68, 2, 2, "#260000"],
        [60, 68, 2, 2, "#260000"],
        [52, 28, 14, 12, "#e60000"],
        [54, 26, 12, 14, "#ff4d4d"],
        [56, 24, 10, 16, "#ff4d4d"],
        [58, 22, 8, 18, "#ff4d4d"],
        [50, 30, 4, 10, "#990000"],
        [66, 30, 4, 10, "#990000"],
        [46, 34, 6, 6, "#660000"],
        [68, 34, 6, 6, "#660000"],
        [42, 38, 6, 4, "#400000"],
        [72, 38, 6, 4, "#400000"],
        [58, 14, 20, 16, "#cc0000"],
        [60, 16, 16, 12, "#e60000"],
        [62, 18, 12, 8, "#ff4d4d"],
        [74, 24, 12, 8, "#cc0000"],
        [76, 26, 10, 6, "#e60000"],
        [78, 28, 8, 4, "#ff4d4d"],
        [82, 28, 6, 4, "#ff4d4d"],
        [88, 28, 4, 3, "#000000"],
        [89, 29, 1, 1, "#120000"],
        [76, 32, 10, 2, "#000000"],
        [78, 33, 6, 1, "#4a0404"],
        [86, 34, 2, 5, "#ff4d4d"],
        [86, 39, 1, 2, "#ff4d4d"],
        [86, 41, 1, 1, "#4a0404"],
        [82, 34, 2, 3, "#cc0000"],
        [82, 37, 1, 1, "#cc0000"],
        [78, 34, 2, 2, "#990000"],
        [84, 30, 1, 2, "#ff4d4d"],
        [80, 31, 1, 1, "#cc0000"],
        [60, 6, 5, 10, "#990000"],
        [61, 8, 3, 8, "#e60000"],
        [62, 10, 1, 6, "#ff4d4d"],
        [60, 4, 2, 2, "#660000"],
        [70, 8, 4, 8, "#660000"],
        [71, 10, 2, 6, "#990000"],
        [70, 6, 2, 2, "#400000"],
        [62, 18, 8, 4, "#990000"],
        [64, 20, 4, 2, "#660000"],
        [68, 20, 6, 4, "#eab308"],
        [69, 21, 4, 3, "#a16207"],
        [70, 21, 2, 2, "#fef08a"],
        [71, 22, 1, 1, "#ffffff"],
        [66, 21, 2, 1, "#facc15"],
        [64, 22, 2, 1, "#facc15", 0.6],
        [66, 18, 6, 2, "#0f172a"],
        [68, 17, 4, 1, "#0f172a"],
        [72, 16, 2, 2, "#0f172a"],
        [64, 24, 2, 6, "#4a0404", 0.8],
        [63, 26, 4, 2, "#4a0404", 0.8],
        [78, 30, 4, 1, "#660000"],
        [80, 28, 4, 1, "#660000"],
        [82, 31, 3, 1, "#660000"],
        [28, 42, 2, 2, "#660000"],
        [36, 46, 4, 1, "#660000"],
        [44, 44, 2, 2, "#660000"]
    ];
    
    for (const r of wolfRects) {
        ctx.fillStyle = r[4];
        ctx.globalAlpha = r[5] !== undefined ? r[5] : 1.0;
        ctx.fillRect(r[0], r[1], r[2], r[3]);
    }
    
    ctx.restore();
    return canvas.toDataURL();
}

export function createWhiteWolfSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.save();
    // Scale and center the 96x72 SVG coordinates into the 64x64 canvas
    // 64 / 96 = 2/3 (0.66667)
    // Scaled height is 72 * (2/3) = 48px. Centered vertically: (64 - 48)/2 = 8px.
    ctx.translate(0, 8);
    ctx.scale(2/3, 2/3);
    
    const wolfRects = [
        [16, 68, 64, 2, "#000000"],
        [18, 66, 60, 2, "#000000", 0.6],
        [18, 48, 4, 6, "#94a3b8"],
        [8, 44, 10, 4, "#cbd5e1"],
        [10, 40, 12, 4, "#e2e8f0"],
        [16, 38, 6, 4, "#f1f5f9"],
        [4, 44, 4, 4, "#cbd5e1"],
        [2, 40, 4, 6, "#e2e8f0"],
        [0, 34, 6, 8, "#f1f5f9"],
        [2, 28, 6, 8, "#ffffff"],
        [4, 22, 5, 8, "#f8fafc"],
        [6, 18, 4, 6, "#e2e8f0"],
        [4, 16, 2, 4, "#cbd5e1"],
        [2, 14, 2, 4, "#ffffff"],
        [4, 12, 2, 2, "#e0f2fe"],
        [8, 24, 4, 2, "#ffffff"],
        [-2, 30, 4, 2, "#e2e8f0"],
        [18, 54, 5, 4, "#94a3b8"],
        [18, 58, 5, 8, "#64748b"],
        [18, 66, 5, 2, "#475569"],
        [16, 68, 2, 2, "#334155"],
        [19, 68, 2, 2, "#334155"],
        [22, 68, 2, 2, "#334155"],
        [26, 54, 5, 4, "#e2e8f0"],
        [26, 58, 5, 8, "#cbd5e1"],
        [26, 66, 5, 2, "#94a3b8"],
        [24, 68, 2, 2, "#475569"],
        [27, 68, 2, 2, "#475569"],
        [30, 68, 2, 2, "#475569"],
        [22, 36, 38, 20, "#e2e8f0"],
        [24, 38, 34, 16, "#f1f5f9"],
        [26, 40, 30, 12, "#ffffff"],
        [30, 38, 6, 4, "#94a3b8"],
        [38, 38, 6, 4, "#94a3b8"],
        [46, 38, 4, 4, "#94a3b8"],
        [32, 42, 4, 2, "#64748b"],
        [40, 42, 4, 2, "#64748b"],
        [30, 32, 4, 6, "#bae6fd"],
        [32, 28, 2, 4, "#e0f2fe"],
        [38, 34, 6, 4, "#7dd3fc"],
        [40, 30, 2, 6, "#ffffff"],
        [46, 32, 4, 6, "#bae6fd"],
        [48, 26, 2, 6, "#e0f2fe"],
        [48, 40, 10, 12, "#ffffff"],
        [50, 42, 8, 8, "#f8fafc"],
        [52, 44, 6, 4, "#ffffff"],
        [48, 54, 5, 4, "#94a3b8"],
        [48, 58, 5, 8, "#64748b"],
        [48, 66, 5, 2, "#475569"],
        [46, 68, 2, 2, "#334155"],
        [49, 68, 2, 2, "#334155"],
        [52, 68, 2, 2, "#334155"],
        [56, 54, 6, 4, "#e2e8f0"],
        [56, 58, 6, 8, "#cbd5e1"],
        [56, 66, 6, 2, "#94a3b8"],
        [54, 68, 2, 2, "#475569"],
        [57, 68, 2, 2, "#475569"],
        [60, 68, 2, 2, "#475569"],
        [52, 28, 14, 12, "#f1f5f9"],
        [54, 26, 12, 14, "#ffffff"],
        [56, 24, 10, 16, "#ffffff"],
        [58, 22, 8, 18, "#ffffff"],
        [50, 30, 4, 10, "#cbd5e1"],
        [66, 30, 4, 10, "#cbd5e1"],
        [46, 34, 6, 6, "#94a3b8"],
        [68, 34, 6, 6, "#94a3b8"],
        [42, 38, 6, 4, "#64748b"],
        [72, 38, 6, 4, "#64748b"],
        [58, 14, 20, 16, "#e2e8f0"],
        [60, 16, 16, 12, "#f1f5f9"],
        [62, 18, 12, 8, "#ffffff"],
        [74, 24, 12, 8, "#e2e8f0"],
        [76, 26, 10, 6, "#f1f5f9"],
        [78, 28, 8, 4, "#ffffff"],
        [82, 28, 6, 4, "#ffffff"],
        [88, 28, 4, 3, "#000000"],
        [89, 29, 1, 1, "#334155"],
        [76, 32, 10, 2, "#000000"],
        [78, 33, 6, 1, "#7f1d1d"],
        [86, 34, 2, 5, "#ffffff"],
        [86, 39, 1, 2, "#ffffff"],
        [86, 41, 1, 1, "#dc2626"],
        [82, 34, 2, 3, "#e2e8f0"],
        [82, 37, 1, 1, "#e2e8f0"],
        [78, 34, 2, 2, "#cbd5e1"],
        [84, 30, 1, 2, "#ffffff"],
        [80, 31, 1, 1, "#e2e8f0"],
        [60, 6, 5, 10, "#cbd5e1"],
        [61, 8, 3, 8, "#f1f5f9"],
        [62, 10, 1, 6, "#ffffff"],
        [60, 4, 2, 2, "#94a3b8"],
        [70, 8, 4, 8, "#94a3b8"],
        [71, 10, 2, 6, "#cbd5e1"],
        [70, 6, 2, 2, "#64748b"],
        [62, 18, 8, 4, "#cbd5e1"],
        [64, 20, 4, 2, "#94a3b8"],
        [68, 20, 6, 4, "#dc2626"],
        [69, 21, 4, 3, "#7f1d1d"],
        [70, 21, 2, 2, "#fca5a5"],
        [71, 22, 1, 1, "#ffffff"],
        [66, 21, 2, 1, "#ef4444"],
        [64, 22, 2, 1, "#ef4444", 0.5],
        [66, 18, 6, 2, "#0f172a"],
        [68, 17, 4, 1, "#0f172a"],
        [72, 16, 2, 2, "#0f172a"],
        [64, 24, 2, 6, "#991b1b", 0.6],
        [63, 26, 4, 2, "#991b1b", 0.6],
        [78, 30, 4, 1, "#94a3b8"],
        [80, 28, 4, 1, "#94a3b8"],
        [82, 31, 3, 1, "#94a3b8"],
        [28, 42, 2, 2, "#94a3b8"],
        [36, 46, 4, 1, "#94a3b8"],
        [44, 44, 2, 2, "#94a3b8"]
    ];
    
    for (const r of wolfRects) {
        ctx.fillStyle = r[4];
        ctx.globalAlpha = r[5] !== undefined ? r[5] : 1.0;
        ctx.fillRect(r[0], r[1], r[2], r[3]);
    }
    
    ctx.restore();
    return canvas.toDataURL();
}

export function createSkeletonSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.save();
    // Scale and center the 96x72 SVG coordinates into the 64x64 canvas
    // 64 / 96 = 2/3 (0.66667)
    // Scaled height is 72 * (2/3) = 48px. Centered vertically: (64 - 48)/2 = 8px.
    ctx.translate(0, 8);
    ctx.scale(2/3, 2/3);

    // --- Sombra Base ---
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(48, 62, 20, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // --- CAPA RASGADA (Fondo) ---
    ctx.fillStyle = "#3b0764";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(40, 24);
    ctx.lineTo(30, 48);
    ctx.lineTo(34, 50);
    ctx.lineTo(36, 44);
    ctx.lineTo(42, 48);
    ctx.lineTo(46, 24);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(56, 24);
    ctx.lineTo(64, 46);
    ctx.lineTo(60, 48);
    ctx.lineTo(58, 40);
    ctx.lineTo(54, 46);
    ctx.lineTo(50, 24);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // --- BRAZO TRASERO (Izquierdo) + ESCUDO ---
    // Hueso del brazo trasero
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(36, 26, 4, 10);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(34, 34, 4, 6);
    
    // Escudo Oxidado y Roto
    ctx.fillStyle = "#334155";
    ctx.fillRect(28, 28, 10, 20);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(26, 30, 14, 2);
    // Óxido / Madera podrida
    ctx.fillStyle = "#78350f";
    ctx.fillRect(30, 32, 6, 14);
    ctx.fillStyle = "#451a03";
    ctx.fillRect(28, 36, 2, 4);
    ctx.fillRect(36, 40, 2, 4);
    // Borde roto del escudo
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(28, 46, 10, 2);
    ctx.fillRect(28, 48, 6, 2);

    // --- PIERNA TRASERA (Izquierda) ---
    // Fémur trasero
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(40, 44, 4, 8); 
    // Rodilla y Tibia trasera
    ctx.fillStyle = "#475569";
    ctx.fillRect(40, 52, 4, 2);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(40, 54, 3, 6); 
    // Pie óseo trasero
    ctx.fillStyle = "#475569";
    ctx.fillRect(38, 60, 6, 2); 

    // --- TORSO (Caja Torácica) ---
    // Columna Vertebral
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(46, 24, 4, 20);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(48, 26, 2, 18); 
    
    // Costillas
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(40, 28, 16, 2);
    ctx.fillRect(38, 32, 20, 2);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(40, 36, 16, 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(42, 40, 12, 2);

    // Pelvis
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(42, 44, 12, 4);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(44, 48, 8, 2);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(46, 46, 4, 2); 

    // --- CABEZA (Calavera) ---
    // Cráneo Base
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(40, 8, 16, 12);
    ctx.fillRect(42, 6, 12, 2);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(42, 20, 12, 4);
    
    // Cuencas de los ojos (Vacías/Oscuras)
    ctx.fillStyle = "#020617";
    ctx.fillRect(42, 12, 4, 4);
    ctx.fillRect(50, 12, 4, 4);
    
    // Magia en los ojos (Puntos púrpuras)
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(43, 13, 2, 2);
    ctx.fillRect(51, 13, 2, 2);
    // Rastro mágico del ojo
    ctx.fillStyle = "#c084fc";
    ctx.fillRect(41, 12, 1, 1);
    ctx.fillRect(54, 12, 1, 1);

    // Hueco nasal
    ctx.fillStyle = "#020617";
    ctx.fillRect(46, 16, 4, 2);
    
    // Dientes de la calavera
    ctx.fillStyle = "#020617";
    ctx.fillRect(43, 21, 2, 2);
    ctx.fillRect(47, 21, 2, 2);
    ctx.fillRect(51, 21, 2, 2);

    // --- PIERNA DELANTERA (Derecha) ---
    // Fémur delantero
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(48, 48, 4, 8); 
    // Rodillera de armadura oxidada
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(46, 56); ctx.lineTo(54, 56); ctx.lineTo(50, 60);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(48, 56, 4, 2);
    // Tibia delantera
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(48, 58, 3, 6); 
    // Pie óseo delantero
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(46, 64, 6, 2); 

    // --- BRAZO DELANTERO (Derecho) + ESPADA ---
    // Hombrera de Armadura Rota
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(52, 24); ctx.lineTo(60, 24); ctx.lineTo(58, 28); ctx.lineTo(52, 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#475569";
    ctx.fillRect(54, 22, 4, 2);
    
    // Hueso del brazo delantero
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(54, 26, 4, 8);
    // Codo
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(54, 34, 4, 2); 
    // Antebrazo extendido
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(56, 36, 6, 4); 

    // Espada Oxidada y Rota
    // Empuñadura
    ctx.fillStyle = "#451a03";
    ctx.fillRect(62, 34, 2, 8);
    // Guarda (Cruz)
    ctx.fillStyle = "#475569";
    ctx.fillRect(60, 32, 6, 2);
    // Hoja de la espada (Apuntando hacia arriba/adelante)
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(62, 18, 2, 14);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(64, 20, 2, 12); 
    // Punta rota de la espada
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(62, 14, 2, 4); 
    ctx.fillRect(64, 16, 2, 2);
    // Muesca de daño en la espada
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(63, 24, 2, 2); 

    // --- DETALLES AMBIENTALES ---
    // Sangre/Lodo en la espada
    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(62, 16, 2, 2);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(64, 26, 1, 2);

    ctx.restore();
    return canvas.toDataURL();
}
export function createMiniBossSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#ff6600';x.beginPath();x.ellipse(32,32,20,24,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,16,14,12,0,0,Math.PI*2);x.fill();x.fillStyle = '#ffff00';x.beginPath();x.ellipse(26,14,4,4,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(38,14,4,4,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(26,14,2,2,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(38,14,2,2,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,22,8,4,0,0,Math.PI);x.fill();x.fillStyle = '#8b4513';x.beginPath();x.moveTo(22,10);x.lineTo(18,2);x.lineTo(26,8);x.fill();x.beginPath();x.moveTo(42,10);x.lineTo(46,2);x.lineTo(38,8);x.fill();x.fillStyle = '#8b4513';x.fillRect(48,28,4,16);x.fillStyle = '#a0a0a0';x.beginPath();x.moveTo(52,28);x.lineTo(60,22);x.lineTo(60,34);x.lineTo(52,28);x.fill(); return c.toDataURL(); }
export function createGolemMiniBossSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.save();
    // Scale and center the 96x72 SVG coordinates into the 64x64 canvas
    // 64 / 96 = 2/3 (0.66667)
    // Scaled height is 72 * (2/3) = 48px. Centered vertically: (64 - 48)/2 = 8px.
    ctx.translate(0, 8);
    ctx.scale(2/3, 2/3);

    // --- Sombra Base ---
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.ellipse(48, 68, 32, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // --- BRAZO TRASERO (Izquierdo) ---
    ctx.fillStyle = "#020617";
    ctx.fillRect(20, 24, 14, 16);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(22, 26, 10, 12);
    // Pinchos en el hombro trasero
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(20, 24);
    ctx.lineTo(16, 18);
    ctx.lineTo(24, 24);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "#020617";
    ctx.fillRect(18, 42, 16, 18);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(20, 44, 12, 14);
    // Puño izquierdo pesado
    ctx.fillStyle = "#020617";
    ctx.fillRect(14, 56, 20, 12);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(16, 58, 16, 8);
    // Energía en el puño
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(16, 60, 2, 4);

    // --- PIERNA TRASERA (Izquierda) ---
    ctx.fillStyle = "#020617";
    ctx.fillRect(32, 48, 14, 16);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(34, 50, 10, 12);
    // Pie izquierdo
    ctx.fillStyle = "#020617";
    ctx.fillRect(30, 64, 16, 4);
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(30, 68);
    ctx.lineTo(34, 64);
    ctx.lineTo(46, 64);
    ctx.lineTo(46, 68);
    ctx.closePath();
    ctx.fill();

    // --- TORSO Y NÚCLEO INESTABLE ---
    // Bloque Principal en forma de V
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(26, 22);
    ctx.lineTo(70, 22);
    ctx.lineTo(62, 48);
    ctx.lineTo(34, 48);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(28, 24);
    ctx.lineTo(68, 24);
    ctx.lineTo(60, 46);
    ctx.lineTo(36, 46);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(32, 24);
    ctx.lineTo(64, 24);
    ctx.lineTo(56, 36);
    ctx.lineTo(40, 36);
    ctx.closePath();
    ctx.fill();
    
    // Placas de armadura rasgadas
    ctx.fillStyle = "#334155";
    ctx.fillRect(32, 26, 8, 6);
    ctx.fillRect(56, 26, 8, 6);

    // Núcleo Cyan Expuesto y Violento
    ctx.fillStyle = "#005f73";
    ctx.beginPath();
    ctx.moveTo(38, 32);
    ctx.lineTo(58, 32);
    ctx.lineTo(52, 46);
    ctx.lineTo(44, 46);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#008ba3";
    ctx.beginPath();
    ctx.moveTo(40, 34);
    ctx.lineTo(56, 34);
    ctx.lineTo(50, 44);
    ctx.lineTo(46, 44);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#00f0ff";
    ctx.beginPath();
    ctx.moveTo(42, 36);
    ctx.lineTo(54, 36);
    ctx.lineTo(49, 42);
    ctx.lineTo(47, 42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(44, 37);
    ctx.lineTo(52, 37);
    ctx.lineTo(49, 40);
    ctx.lineTo(47, 40);
    ctx.closePath();
    ctx.fill();
    
    // Grietas de Energía masivas en el torso
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(44, 32); ctx.lineTo(36, 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(52, 32); ctx.lineTo(60, 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(44, 46); ctx.lineTo(38, 52);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(52, 46); ctx.lineTo(58, 52);
    ctx.stroke();

    // --- CABEZA (Erguida, Afilada y Agresiva) ---
    // Cuello de energía pura
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(42, 16, 12, 6);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(44, 18, 8, 4);

    // Casco / Rostro de Piedra
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(42, 16);
    ctx.lineTo(54, 16);
    ctx.lineTo(56, 6);
    ctx.lineTo(40, 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(44, 14);
    ctx.lineTo(52, 14);
    ctx.lineTo(54, 8);
    ctx.lineTo(42, 8);
    ctx.closePath();
    ctx.fill();

    // Corona de pinchos/roca
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(40, 6); ctx.lineTo(36, 0); ctx.lineTo(44, 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(56, 6); ctx.lineTo(60, 0); ctx.lineTo(52, 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(46, 4); ctx.lineTo(48, -2); ctx.lineTo(50, 4);
    ctx.closePath();
    ctx.fill();
    
    // Ojos en forma de "V" (Agresivos)
    ctx.fillStyle = "#00f0ff";
    ctx.beginPath();
    ctx.moveTo(40, 10); ctx.lineTo(46, 12); ctx.lineTo(42, 14);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(56, 10); ctx.lineTo(50, 12); ctx.lineTo(54, 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(42, 11); ctx.lineTo(44, 12); ctx.lineTo(43, 13);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(54, 11); ctx.lineTo(52, 12); ctx.lineTo(53, 13);
    ctx.closePath();
    ctx.fill();

    // Mandíbula tipo Trituradora
    ctx.fillStyle = "#020617";
    ctx.fillRect(42, 18, 12, 4);
    // Dientes luminosos
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(44, 18, 2, 2);
    ctx.fillRect(50, 18, 2, 2);

    // --- PIERNA DELANTERA (Derecha) ---
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(44, 48, 16, 16);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(46, 50, 12, 14);
    // Rodillera con picos
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(44, 52); ctx.lineTo(40, 56); ctx.lineTo(44, 60);
    ctx.closePath();
    ctx.fill();
    // Pie derecho
    ctx.fillStyle = "#020617";
    ctx.fillRect(42, 64, 20, 6);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(44, 64, 16, 4);
    // Luz en la pata
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(46, 66, 4, 2);

    // --- BRAZO DELANTERO (Derecho - Gigante y Armado) ---
    // Hombrera Exagerada con Picos
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(56, 22); ctx.lineTo(80, 18); ctx.lineTo(76, 32); ctx.lineTo(56, 30);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(58, 24); ctx.lineTo(76, 20); ctx.lineTo(72, 30); ctx.lineTo(58, 28);
    ctx.closePath();
    ctx.fill();

    // Picos afilados saliendo de la hombrera
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(64, 20); ctx.lineTo(66, 8); ctx.lineTo(70, 18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(72, 18); ctx.lineTo(82, 10); ctx.lineTo(76, 18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(78, 22); ctx.lineTo(90, 20); ctx.lineTo(80, 26);
    ctx.closePath();
    ctx.fill();
    
    // Articulación de codo (Neón rebosante)
    ctx.fillStyle = "#005f73";
    ctx.fillRect(62, 32, 12, 8);
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(64, 34, 8, 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(65, 35, 6, 2);

    // Antebrazo Pesado
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(60, 40); ctx.lineTo(76, 40); ctx.lineTo(80, 56); ctx.lineTo(56, 56);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(62, 42); ctx.lineTo(74, 42); ctx.lineTo(76, 54); ctx.lineTo(58, 54);
    ctx.closePath();
    ctx.fill();
    // Armadura del brazo
    ctx.fillStyle = "#334155";
    ctx.fillRect(60, 44, 16, 4);

    // Puño Masivo Listo para Aplastar
    ctx.fillStyle = "#020617";
    ctx.fillRect(54, 56, 28, 12);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(56, 58, 24, 8);
    // Nudillos de piedra oscura
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(56, 64, 6, 6);
    ctx.fillRect(64, 64, 6, 6);
    ctx.fillRect(72, 64, 6, 6);
    // Energía brillando de los nudillos
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(58, 68, 2, 2);
    ctx.fillRect(66, 68, 2, 2);
    ctx.fillRect(74, 68, 2, 2);

    // --- PIEDRAS/ENERGÍA FLOTANTES MÁGICAS ---
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(20, 12); ctx.lineTo(24, 10); ctx.lineTo(26, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(22, 11, 2, 2);

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(84, 36); ctx.lineTo(90, 32); ctx.lineTo(88, 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(86, 36, 2, 2);

    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(30, 58); ctx.lineTo(34, 54); ctx.lineTo(32, 60);
    ctx.closePath();
    ctx.fill();
    
    // Descargas eléctricas sueltas
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(76, 50); ctx.lineTo(82, 48); ctx.lineTo(80, 54);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(28, 32); ctx.lineTo(22, 34); ctx.lineTo(26, 38);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    ctx.restore();
    return canvas.toDataURL();
}
export function createBossSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#990000';x.fillRect(12,12,40,40);x.fillStyle = '#cc0000';x.beginPath();x.ellipse(32,20,16,10,0,0,Math.PI*2);x.fill();x.fillStyle = '#ffff00';x.beginPath();x.ellipse(24,18,5,5,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(40,18,5,5,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(24,18,2,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(40,18,2,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,26,10,4,0,0,Math.PI);x.fill();x.fillStyle = '#fff';for(let i=0;i<5;i++){x.beginPath();x.moveTo(24+i*4,26);x.lineTo(26+i*4,26);x.lineTo(25+i*4,30);x.fill();}x.fillStyle = '#660000';x.fillRect(12,32,40,4);x.fillRect(12,42,40,4);x.fillStyle = '#000';x.fillRect(52,20,4,24);x.fillStyle = '#a0a0a0';x.beginPath();x.moveTo(54,12);x.lineTo(60,20);x.lineTo(48,20);x.fill(); return c.toDataURL(); }

export function createSpiderlingSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const bodyColor = '#0E0B1C'; 
    const legColor = '#0E0B1C';
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








export function createMinotauroSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Sombra Base
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(32, 61, 16, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // --- Pierna Trasera (Izquierda) ---
    ctx.fillStyle = "#1e293b"; ctx.fillRect(34, 44, 6, 13);
    ctx.fillStyle = "#334155"; ctx.fillRect(34, 44, 3, 13);
    ctx.fillStyle = "#e2e8f0"; ctx.fillRect(33, 49, 8, 4);
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(33, 51, 8, 2);
    ctx.fillStyle = "#0f172a"; ctx.fillRect(34, 57, 6, 4);

    // --- Brazo Trasero (Izquierdo) ---
    ctx.fillStyle = "#1e293b"; ctx.fillRect(42, 24, 8, 18);
    ctx.fillStyle = "#334155"; ctx.fillRect(42, 24, 4, 18);
    ctx.fillStyle = "#e2e8f0"; ctx.fillRect(39, 19, 12, 9);
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(39, 25, 12, 3);
    ctx.fillStyle = "#cbd5e1"; ctx.fillRect(43, 38, 6, 6);
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(43, 41, 6, 3);

    // --- Faldón / Taparrabos ---
    ctx.fillStyle = "#0f172a"; ctx.fillRect(23, 38, 16, 16);
    ctx.fillStyle = "#1e293b"; ctx.fillRect(25, 38, 12, 14);
    ctx.fillStyle = "#020617"; ctx.fillRect(27, 38, 2, 14);
    ctx.fillRect(33, 38, 2, 14);

    // --- Pierna Delantera (Derecha) ---
    ctx.fillStyle = "#1e293b"; ctx.fillRect(20, 44, 8, 13);
    ctx.fillStyle = "#334155"; ctx.fillRect(22, 44, 6, 13);
    ctx.fillStyle = "#e2e8f0"; ctx.fillRect(19, 50, 10, 4);
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(19, 52, 10, 2);
    ctx.fillStyle = "#0f172a"; ctx.fillRect(20, 57, 8, 4);

    // --- Torso Robusto ---
    ctx.fillStyle = "#1e293b"; ctx.fillRect(20, 20, 22, 18);
    ctx.fillStyle = "#334155"; ctx.fillRect(22, 22, 18, 16);

    // --- Cinturón Ancho de Placas ---
    ctx.fillStyle = "#451a03"; ctx.fillRect(18, 35, 26, 4);
    ctx.fillStyle = "#e2e8f0"; ctx.fillRect(19, 35, 4, 4);
    ctx.fillRect(25, 35, 4, 4);
    ctx.fillRect(31, 35, 4, 4);
    ctx.fillRect(37, 35, 4, 4);
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(19, 37, 4, 2);
    ctx.fillRect(25, 37, 4, 2);
    ctx.fillRect(31, 37, 4, 2);
    ctx.fillRect(37, 37, 4, 2);

    // --- Correas de Cuero en X ---
    ctx.fillStyle = "#451a03";
    ctx.beginPath(); ctx.moveTo(20, 22); ctx.lineTo(24, 20); ctx.lineTo(42, 34); ctx.lineTo(38, 35); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(42, 22); ctx.lineTo(38, 20); ctx.lineTo(20, 34); ctx.lineTo(24, 35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(29, 26, 3, 3);

    // --- Brazo Delantero (Derecho) ---
    ctx.fillStyle = "#1e293b"; ctx.fillRect(12, 24, 9, 16);
    ctx.fillStyle = "#334155"; ctx.fillRect(14, 24, 7, 16);

    // --- Hombrera Gigante Delantera ---
    ctx.fillStyle = "#e2e8f0"; ctx.fillRect(9, 18, 13, 11);
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(9, 25, 13, 4);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(10, 19, 3, 3);

    // --- Guantelete Delantero ---
    ctx.fillStyle = "#0f172a"; ctx.fillRect(11, 36, 9, 8);
    ctx.fillStyle = "#1e293b"; ctx.fillRect(13, 38, 7, 6);

    // --- CABEZA Y ROSTRO ---
    ctx.fillStyle = "#1e293b"; ctx.fillRect(24, 6, 14, 14);
    ctx.fillStyle = "#334155"; ctx.fillRect(26, 8, 10, 12);
    ctx.fillStyle = "#78350f"; ctx.fillRect(26, 15, 10, 5);
    ctx.fillStyle = "#000000"; ctx.fillRect(27, 17, 2, 2);
    ctx.fillRect(33, 17, 2, 2);
    ctx.fillRect(26, 12, 10, 2);
    ctx.fillStyle = "#dc2626"; ctx.fillRect(27, 12, 2, 1);

    // --- Cuernos ---
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.moveTo(24, 9); ctx.lineTo(14, 7); ctx.lineTo(14, 10); ctx.lineTo(24, 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#d97706";
    ctx.beginPath(); ctx.moveTo(24, 11); ctx.lineTo(14, 9); ctx.lineTo(14, 10); ctx.lineTo(24, 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.moveTo(14, 10); ctx.lineTo(14, 7); ctx.lineTo(12, 3); ctx.lineTo(11, 8); ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.moveTo(38, 9); ctx.lineTo(48, 7); ctx.lineTo(48, 10); ctx.lineTo(38, 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#d97706";
    ctx.beginPath(); ctx.moveTo(38, 11); ctx.lineTo(48, 9); ctx.lineTo(48, 10); ctx.lineTo(38, 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.moveTo(48, 10); ctx.lineTo(48, 7); ctx.lineTo(50, 3); ctx.lineTo(51, 8); ctx.closePath(); ctx.fill();

    // --- ESPADA VOLCÁNICA COLOSAL ---
    ctx.save();
    ctx.translate(16, 38);
    ctx.rotate(-45 * Math.PI / 180);

    // Pomo
    ctx.fillStyle = "#d97706"; ctx.fillRect(-3, -3, 6, 3);
    ctx.fillStyle = "#fef3c7"; ctx.fillRect(-2, -2, 4, 1);

    // Mango
    ctx.fillStyle = "#451a03"; ctx.fillRect(-2, 0, 4, 8);

    // Guarda Cruzada
    ctx.fillStyle = "#0f172a"; ctx.fillRect(-10, 8, 20, 5);
    ctx.fillStyle = "#1e293b"; ctx.fillRect(-8, 9, 16, 3);
    ctx.fillStyle = "#d97706"; ctx.fillRect(-8, 10, 16, 1);

    // Hoja Principal
    ctx.fillStyle = "#0f172a"; ctx.fillRect(-6, 13, 12, 14);

    // Núcleo de magma y runas
    ctx.fillStyle = "#dc2626"; ctx.fillRect(-2, 13, 4, 12);
    ctx.fillStyle = "#fef3c7"; ctx.fillRect(-1, 15, 2, 2);
    ctx.fillRect(-1, 19, 2, 2);
    ctx.fillRect(-1, 23, 2, 2);

    // Filos
    ctx.fillStyle = "#d97706"; ctx.fillRect(-6, 13, 2, 14);
    ctx.fillRect(4, 13, 2, 14);
    ctx.fillStyle = "#fef3c7"; ctx.fillRect(-5, 13, 1, 14);

    // Punta
    ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.moveTo(-6, 27); ctx.lineTo(6, 27); ctx.lineTo(0, 34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.moveTo(-4, 27); ctx.lineTo(4, 27); ctx.lineTo(0, 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fef3c7"; ctx.beginPath(); ctx.moveTo(-2, 27); ctx.lineTo(2, 27); ctx.lineTo(0, 30); ctx.closePath(); ctx.fill();

    ctx.restore();

    // Efectos Ambientales
    ctx.fillStyle = "#fef3c7"; ctx.fillRect(23, 55, 1, 1);
    ctx.fillStyle = "#dc2626"; ctx.fillRect(35, 60, 1, 1);
    ctx.fillStyle = "#d97706"; ctx.fillRect(42, 61, 2, 2);
    ctx.fillRect(18, 57, 2, 2);
    ctx.fillStyle = "#dc2626"; ctx.fillRect(8, 48, 1, 1);

    return canvas.toDataURL();
}

export function createElfSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Sombra Base
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.ellipse(32, 61, 12, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // ================= CAPA (Detrás) =================
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(22, 24, 20, 28);
    ctx.fillStyle = "#075985";
    ctx.fillRect(24, 26, 16, 24);
    ctx.fillStyle = "#0369a1";
    ctx.fillRect(26, 28, 12, 20);
    // Borde plateado de la capa
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(22, 24, 2, 28);
    ctx.fillRect(40, 24, 2, 28);

    // ================= PIERNAS =================
    // Pierna Izquierda
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(26, 46, 4, 12);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(26, 52, 4, 6); // Bota
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(26, 56, 4, 2); // Borde bota
    // Pierna Derecha
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(34, 46, 4, 12);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(34, 52, 4, 6); // Bota
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(34, 56, 4, 2); // Borde bota

    // ================= TORSO =================
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(26, 30, 12, 16);
    ctx.fillStyle = "#334155";
    ctx.fillRect(28, 32, 8, 12);
    // Cinturón
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(26, 40, 12, 3);
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(30, 40, 4, 3); // Hebilla

    // ================= BRAZO TRASERO (Izquierdo, sujeta flecha) =================
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(38, 32, 5, 12);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(38, 38, 5, 6); // Guantelete
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(38, 32, 2, 12); // Sombra brazo

    // ================= CABEZA =================
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(26, 14, 12, 12);
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(28, 16, 8, 10); // Sombra rostro
    
    // Orejas puntiagudas (Elfo clásico)
    // Oreja Izquierda
    ctx.fillStyle = "#e0f2fe";
    ctx.beginPath();
    ctx.moveTo(26, 18); ctx.lineTo(18, 16); ctx.lineTo(18, 20); ctx.lineTo(26, 22);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.moveTo(26, 20); ctx.lineTo(20, 18); ctx.lineTo(20, 20); ctx.lineTo(26, 21);
    ctx.closePath(); ctx.fill();
    // Oreja Derecha
    ctx.fillStyle = "#e0f2fe";
    ctx.beginPath();
    ctx.moveTo(38, 18); ctx.lineTo(46, 16); ctx.lineTo(46, 20); ctx.lineTo(38, 22);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.moveTo(38, 20); ctx.lineTo(44, 18); ctx.lineTo(44, 20); ctx.lineTo(38, 21);
    ctx.closePath(); ctx.fill();

    // Cabello largo plateado/blanco
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(24, 12, 16, 6);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(26, 12, 12, 4);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(22, 16, 4, 10); // Mechón izq
    ctx.fillRect(38, 16, 4, 10); // Mechón der
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(24, 24, 2, 8);
    ctx.fillRect(38, 24, 2, 8);

    // Ojos azules brillantes (Magia arcana)
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(28, 20, 2, 2);
    ctx.fillRect(34, 20, 2, 2);
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(28, 20, 1, 1); // Brillo
    ctx.fillRect(34, 20, 1, 1);

    // ================= BRAZO DELANTERO (Derecho, sujeta arco) =================
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(21, 32, 5, 12);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(21, 38, 5, 6); // Guantelete
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(23, 32, 2, 12); // Sombra

    // ================= ARCO ÉLFICO =================
    ctx.save();
    ctx.translate(14, 28);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.scale(0.9, 0.9);
    // Cuerda del arco
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(9, 2, 1, 28);
    // Curva izquierda
    ctx.fillStyle = "#451a03";
    ctx.fillRect(6, 2, 3, 4);
    ctx.fillRect(5, 6, 3, 6);
    ctx.fillRect(4, 12, 3, 8);
    ctx.fillRect(5, 20, 3, 6);
    ctx.fillRect(6, 26, 3, 4);
    // Curva derecha
    ctx.fillRect(10, 2, 3, 4);
    ctx.fillRect(11, 6, 3, 6);
    ctx.fillRect(12, 12, 3, 8);
    ctx.fillRect(11, 20, 3, 6);
    ctx.fillRect(10, 26, 3, 4);
    // Detalles plateados
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(6, 2, 1, 2);
    ctx.fillRect(11, 2, 1, 2);
    ctx.fillRect(6, 28, 1, 2);
    ctx.fillRect(11, 28, 1, 2);
    ctx.restore();

    // ================= FLECHA ENCANTADA =================
    ctx.save();
    ctx.translate(18, 24);
    ctx.rotate(45 * Math.PI / 180);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 1, 10); // Astil
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(-2, 0); ctx.lineTo(2, 0); ctx.lineTo(0, -3);
    ctx.closePath(); ctx.fill(); // Punta
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(-1, 8, 3, 3); // Pluma
    ctx.restore();

    // ================= EFECTOS MÁGICOS =================
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(14, 50, 1, 1);
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(48, 44, 1, 1);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(52, 56, 2, 2);
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(10, 38, 1, 1);
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(44, 18, 1, 1);

    return canvas.toDataURL();
}

export function createReyElfoCaballoSprite() {
    const svgString = `<svg viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <ellipse cx="32" cy="62" rx="22" ry="2" fill="#000000" opacity="0.6"/>
      <polygon points="46,30 52,34 54,42 50,48 48,42 46,36" fill="#e2e8f0"/>
      <polygon points="48,32 54,38 56,44 52,48 50,44 48,38" fill="#cbd5e1"/>
      <polygon points="44,28 48,28 50,34 46,36" fill="#f8fafc"/>
      <polygon points="42,36 46,36 44,46 42,46" fill="#94a3b8"/>
      <polygon points="42,46 44,46 46,54 44,54" fill="#64748b"/>
      <rect x="44" y="54" width="4" height="4" fill="#64748b"/>
      <rect x="45" y="58" width="4" height="2" fill="#1e293b"/>
      <rect x="22" y="40" width="4" height="10" fill="#94a3b8"/>
      <rect x="22" y="50" width="3" height="8" fill="#64748b"/>
      <rect x="23" y="58" width="4" height="2" fill="#1e293b"/>
      <rect x="36" y="26" width="12" height="12" fill="#e2e8f0"/>
      <rect x="42" y="26" width="6" height="12" fill="#cbd5e1"/>
      <rect x="38" y="26" width="6" height="4" fill="#f8fafc"/>
      <polygon points="36,38 48,38 46,44 38,44" fill="#e2e8f0"/>
      <polygon points="42,38 48,38 46,44 42,44" fill="#cbd5e1"/>
      <rect x="22" y="28" width="14" height="10" fill="#e2e8f0"/>
      <rect x="24" y="34" width="12" height="4" fill="#cbd5e1"/>
      <rect x="14" y="26" width="8" height="14" fill="#e2e8f0"/>
      <rect x="14" y="26" width="4" height="14" fill="#f8fafc"/>
      <polygon points="14,40 22,40 20,44 14,42" fill="#cbd5e1"/>
      <polygon points="12,14 18,14 22,26 14,28" fill="#e2e8f0"/>
      <polygon points="12,14 16,14 20,26 14,28" fill="#f8fafc"/>
      <polygon points="16,14 22,12 24,18 20,24 16,20" fill="#e0f2fe"/>
      <polygon points="18,16 26,14 26,20 22,26" fill="#bae6fd"/>
      <polygon points="4,12 14,10 16,16 6,18" fill="#e2e8f0"/>
      <polygon points="4,12 14,10 14,14 4,16" fill="#f8fafc"/>
      <rect x="2" y="14" width="4" height="4" fill="#cbd5e1"/>
      <rect x="2" y="14" width="2" height="2" fill="#94a3b8"/>
      <rect x="4" y="18" width="6" height="2" fill="#94a3b8"/>
      <rect x="10" y="12" width="2" height="2" fill="#1e3a8a"/>
      <rect x="10" y="12" width="1" height="1" fill="#38bdf8"/>
      <rect x="12" y="6" width="2" height="4" fill="#e2e8f0"/>
      <rect x="10" y="8" width="2" height="4" fill="#cbd5e1"/>
      <polygon points="6,10 12,8 14,12 8,14" fill="#38bdf8"/>
      <polygon points="6,10 10,8 12,12 8,14" fill="#7dd3fc"/>
      <rect x="8" y="10" width="2" height="2" fill="#fbbf24"/>
      <polygon points="12,28 16,28 14,36 10,34" fill="#38bdf8"/>
      <polygon points="12,28 14,28 12,36 10,34" fill="#7dd3fc"/>
      <rect x="12" y="30" width="2" height="4" fill="#fbbf24"/>
      <rect x="24" y="26" width="12" height="4" fill="#1e3a8a"/>
      <rect x="24" y="30" width="12" height="2" fill="#fbbf24"/>
      <rect x="24" y="24" width="4" height="2" fill="#1e40af"/>
      <rect x="34" y="24" width="4" height="2" fill="#1e40af"/>
      <polygon points="26,30 30,30 32,40 28,40" fill="#0f172a"/>
      <rect x="27" y="38" width="6" height="6" fill="#1e293b"/>
      <rect x="27" y="38" width="6" height="2" fill="#fbbf24"/>
      <polygon points="32,16 48,16 52,24 46,32 34,26" fill="#1e3a8a"/>
      <polygon points="32,18 46,18 48,24 44,30 34,24" fill="#1e40af"/>
      <path d="M 32 16 L 48 16 L 52 24 L 46 32" stroke="#fbbf24" stroke-width="2" fill="none"/>
      <rect x="26" y="14" width="8" height="12" fill="#e0f2fe"/>
      <rect x="26" y="14" width="4" height="12" fill="#ffffff"/>
      <rect x="28" y="18" width="4" height="6" fill="#38bdf8"/>
      <rect x="29" y="20" width="2" height="2" fill="#fbbf24"/>
      <rect x="22" y="16" width="6" height="10" fill="#bae6fd"/>
      <rect x="22" y="16" width="6" height="4" fill="#fbbf24"/>
      <rect x="22" y="24" width="4" height="4" fill="#1e293b"/>
      <rect x="26" y="6" width="6" height="8" fill="#e0f2fe"/>
      <rect x="26" y="8" width="2" height="6" fill="#bae6fd"/>
      <polygon points="32,10 36,8 32,12" fill="#e0f2fe"/>
      <rect x="28" y="8" width="2" height="2" fill="#38bdf8"/>
      <rect x="25" y="4" width="8" height="2" fill="#fbbf24"/>
      <rect x="25" y="2" width="2" height="2" fill="#fbbf24"/>
      <rect x="29" y="2" width="2" height="2" fill="#fbbf24"/>
      <rect x="26" y="4" width="1" height="1" fill="#ffffff"/>
      <polygon points="30,4 38,6 40,12 34,14 32,10" fill="#f8fafc"/>
      <polygon points="32,4 40,8 42,14 36,16 32,10" fill="#e2e8f0"/>
      <g transform="translate(24, 26) rotate(-10)">
        <rect x="-1" y="-18" width="2" height="30" fill="#94a3b8"/>
        <rect x="-1" y="-18" width="1" height="30" fill="#e2e8f0"/>
        <rect x="-2" y="12" width="4" height="2" fill="#fbbf24"/>
        <rect x="-3" y="-18" width="6" height="2" fill="#fbbf24"/>
        <rect x="-4" y="-20" width="2" height="4" fill="#f59e0b"/>
        <rect x="2" y="-20" width="2" height="4" fill="#f59e0b"/>
        <polygon points="-3,-18 3,-18 0,-26" fill="#e0f2fe"/>
        <polygon points="-1,-18 1,-18 0,-24" fill="#38bdf8"/>
        <polygon points="-1,-20 1,-20 0,-22" fill="#ffffff"/>
      </g>
      <polygon points="36,36 42,36 40,46 36,46" fill="#e2e8f0"/>
      <polygon points="36,46 40,46 38,56 36,56" fill="#cbd5e1"/>
      <rect x="36" y="56" width="4" height="4" fill="#94a3b8"/>
      <rect x="35" y="60" width="6" height="2" fill="#1e293b"/>
      <rect x="16" y="40" width="6" height="12" fill="#e2e8f0"/>
      <rect x="16" y="40" width="2" height="12" fill="#f8fafc"/>
      <rect x="16" y="52" width="4" height="8" fill="#cbd5e1"/>
      <rect x="15" y="60" width="6" height="2" fill="#1e293b"/>
      <rect x="15" y="50" width="6" height="2" fill="#94a3b8"/>
      <rect x="35" y="46" width="6" height="2" fill="#94a3b8"/>
      <rect x="12" y="58" width="2" height="2" fill="#38bdf8" opacity="0.8"/>
      <rect x="32" y="56" width="1" height="1" fill="#bae6fd"/>
      <rect x="8" y="24" width="2" height="2" fill="#e0f2fe" opacity="0.5"/>
      <rect x="4" y="32" width="1" height="1" fill="#38bdf8"/>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
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
    if (!sprites.finalBoss) sprites.finalBoss = 'araña.png';
    if (!sprites.spiderling) sprites.spiderling = createSpiderlingSprite();
    if (!sprites.minotauro) sprites.minotauro = createMinotauroSprite();
    if (!sprites.elfo_de_nueve) sprites.elfo_de_nueve = createElfSprite();
    if (!sprites.rey_elfo_caballo) sprites.rey_elfo_caballo = createReyElfoCaballoSprite();
}