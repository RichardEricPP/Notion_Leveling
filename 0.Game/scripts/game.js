
        // Ensure these are the very first executable lines in the script
        let isInventoryOpen = false;
        let isSkillMenuOpen = false;
        let isEquipmentOpen = false;
        
        console.log('isInventoryOpen declared:', isInventoryOpen);
        console.log('isSkillMenuOpen declared:', isInventoryOpen);
        console.log('isEquipmentOpen declared:', isEquipmentOpen);


        // Floor system
        let currentFloor = 1;
        const maxFloors = 4; 

        // Map setup
        const mapWidth = 30, mapHeight = 30; 
        const tileSize = 50; 
        let map = Array(mapHeight).fill().map(() => Array(mapWidth).fill(0));
        let stairLocation = { x: -1, y: -1, active: false, type: 4 }; 

        // Difficulty settings
        let selectedDifficulty = 'medio'; 
        let gameStarted = false;
        let hpMultiplier = 1.0;
        let atkMultiplier = 1.0;
        let lastGameScore = 0;
        let lastEnemiesDefeated = 0;
        let finalOutcomeMessage = ""; 
        let finalOutcomeMessageLine2 = "";


        // Gear list definition with item levels and stats
        const gearList = [
            // Potions
            { name: 'Poción de Vida Pequeña', type: 'potion', heal: 25, itemLevel: 1, baseValue: 15, sellPrice: 5 },
            { name: 'Poción de Vida Mediana', type: 'potion', heal: 50, itemLevel: 2, baseValue: 30, sellPrice: 10 },
            { name: 'Poción de Vida Grande', type: 'potion', heal: 100, itemLevel: 3, baseValue: 60, sellPrice: 20 }, 

            // Helmets
            { name: 'Casco de Hierro', type: 'helmet', def: 3, itemLevel: 1, baseValue: 20, set: 'Hierro' },
            { name: 'Casco de Caballero', type: 'helmet', def: 5, spd: 2, itemLevel: 2, baseValue: 40, set: 'Caballero' },
            { name: 'Casco de Demonio', type: 'helmet', def: 7, atk: 3, itemLevel: 3, baseValue: 60, set: 'Demonio' },
            { name: 'Casco de León', type: 'helmet', def: 8, itemLevel: 3, baseValue: 55, set: 'León' },
            { name: 'Casco de Asesinato', type: 'helmet', spd: 4, critical: 0.03, itemLevel: 3, baseValue: 70, set: 'Asesinato' }, 
            { name: 'Casco Noble', type: 'helmet', def: 4, itemLevel: 2, baseValue: 30, set: 'Noble' },
            { name: 'Casco de Mago', type: 'helmet', def: 3, itemLevel: 1, baseValue: 25, set: 'Mago' },

            // Armors
            { name: 'Armadura de Hierro', type: 'armor', def: 6, itemLevel: 1, baseValue: 40, set: 'Hierro' },
            { name: 'Armadura de Caballero', type: 'armor', def: 8, spd: 2, itemLevel: 2, baseValue: 70, set: 'Caballero' },
            { name: 'Armadura de Demonio', type: 'armor', def: 10, atk: 4, itemLevel: 3, baseValue: 100, set: 'Demonio' },
            { name: 'Armadura de León', type: 'armor', def: 9, itemLevel: 3, baseValue: 90, set: 'León' },
            { name: 'Armadura de Asesinato', type: 'armor', spd: 6, critical: 0.04, itemLevel: 3, baseValue: 110, set: 'Asesinato' }, 
            { name: 'Armadura Noble', type: 'armor', def: 7, itemLevel: 2, baseValue: 60, set: 'Noble' },
            { name: 'Armadura de Mago', type: 'armor', def: 5, itemLevel: 1, baseValue: 50, set: 'Mago' },

            // Gloves
            { name: 'Guantes de Hierro', type: 'gloves', atk: 3, itemLevel: 1, baseValue: 15, set: 'Hierro' },
            { name: 'Guantes de Caballero', type: 'gloves', atk: 4, def: 1, itemLevel: 2, baseValue: 30, set: 'Caballero' },
            { name: 'Guantes de Demonio', type: 'gloves', atk: 6, spd: 2, itemLevel: 3, baseValue: 50, set: 'Demonio' },
            { name: 'Guantes de León', type: 'gloves', atk: 5, itemLevel: 3, baseValue: 45, set: 'León' },
            { name: 'Guantes de Asesinato', type: 'gloves', critical: 0.05, spd: 3, itemLevel: 3, baseValue: 60, set: 'Asesinato' }, 
            { name: 'Guantes de Noble', type: 'gloves', atk: 3, itemLevel: 2, baseValue: 25, set: 'Noble' },
            { name: 'Guantes de Mago', type: 'gloves', spd: 2, itemLevel: 1, baseValue: 20, set: 'Mago' },

            // Boots
            { name: 'Botas de Hierro', type: 'boots', spd: 3, itemLevel: 1, baseValue: 20, set: 'Hierro' },
            { name: 'Botas de Caballero', type: 'boots', spd: 5, def: 1, itemLevel: 2, baseValue: 40, set: 'Caballero' },
            { name: 'Botas de Demonio', type: 'boots', spd: 7, atk: 2, itemLevel: 3, baseValue: 60, set: 'Demonio' },
            { name: 'Botas de León', type: 'boots', spd: 8, itemLevel: 3, baseValue: 55, set: 'León' },
            { name: 'Botas de Asesinato', type: 'boots', spd: 9, itemLevel: 3, baseValue: 70, set: 'Asesinato' },
            { name: 'Botas de Noble', type: 'boots', spd: 4, itemLevel: 2, baseValue: 30, set: 'Noble' },
            { name: 'Botas de Mago', type: 'boots', spd: 6, itemLevel: 1, baseValue: 25, set: 'Mago' },

            // Weapons
            { name: 'Escudo Colosal', type: 'weapon', def: 10, itemLevel: 2, baseValue: 80, set: 'Hierro', attackSpeed: 400 }, 
            { name: 'Maza de Guerra', type: 'weapon', atk: 9, itemLevel: 2, baseValue: 75, set: 'Caballero', attackSpeed: 400 },
            { name: 'Espada de Luz', type: 'weapon', atk: 7, spd: 3, itemLevel: 3, baseValue: 90, set: 'Demonio', attackSpeed: 250 },
            { name: 'Libro Celestial', type: 'weapon', atk: 5, spd: 4, itemLevel: 3, baseValue: 85, set: 'Mago', attackSpeed: 400 }, 
            { name: 'Rayo de Oscuridad', type: 'weapon', atk: 7, critical: 0.03, itemLevel: 3, baseValue: 95, set: 'Asesinato', attackSpeed: 400 }, 
            { name: 'Daga de Poder', type: 'weapon', atk: 6, spd: 4, itemLevel: 1, baseValue: 50, set: 'Asesinato', attackSpeed: 400 },
            { name: 'Arco del Bosque', type: 'weapon', atk: 6, critical: 0.04, itemLevel: 2, baseValue: 70, set: 'León', attackSpeed: 400 }, 
            { name: 'Guadaña Helada', type: 'weapon', atk: 8, itemLevel: 2, baseValue: 80, set: 'Noble', attackSpeed: 400 },
        ];

        // Player definition
        let player = {
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
            attackLungeDistance: tileSize / 4,
            skillUsageThisFloor: {},
            enemiesDefeatedThisRun: 0,
            gold: 0, 
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
            criticalChanceBonus: 0,
            celestialBookCritCounter: 0, 
            hasMiniShield: false, 
            miniShieldHP: 0, 
            miniShieldMaxHP: 0, 
            miniShieldCooldownEnd: 0, 
            darkRayEnemiesDefeated: 0 
        };

        const sprites = {}; 
        const loadedImages = {}; 

        // --- Funciones de Creación de Sprites ---
        function createPlayerSprite() {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');

            // Define set-specific colors
            const setColors = {
                'Hierro': { main: '#607d8b', detail: '#b0bec5' },
                'Caballero': { main: '#b71c1c', detail: '#ef9a9a' },
                'Demonio': { main: '#1a237e', detail: '#ffd700' },
                'León': { main: '#4A2F1B', detail: '#FFD700' }, // Changed to dark brown with golden touches for Lion set
                'Asesinato': { main: '#006064', detail: '#9c27b0' },
                'Noble': { main: '#212121', detail: '#ffd700' },
                'Mago': { main: '#eceff1', detail: '#ffd700' }
            };

            // Default colors for individual body parts if no specific item is equipped
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
            // Changed to 4 pieces for set bonus: helmet, armor, gloves, boots
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

            // Initialize colors with defaults
            let torsoColor = defaultPartColors.body;
            let headColor = defaultPartColors.helmet;
            let armColor = defaultPartColors.arm;
            let legColor = defaultPartColors.leg;
            let detailColor = defaultPartColors.detail;
            let drawHood = true;

            if (currentFullSetDetected) {
                // If a full set is detected, all parts take that set's colors
                const set = setColors[currentFullSetDetected];
                torsoColor = set.main;
                headColor = set.main; 
                armColor = set.main;
                legColor = set.main;
                detailColor = set.detail;
                drawHood = false;
            } else {
                // Otherwise, apply individual piece colors
                if (player.equipped.armor && player.equipped.armor.set) {
                    torsoColor = setColors[player.equipped.armor.set].main;
                    // Detail color can be from armor set if armor is equipped
                    detailColor = setColors[player.equipped.armor.set].detail; 
                }
                if (player.equipped.helmet && player.equipped.helmet.set) {
                    headColor = setColors[player.equipped.helmet.set].main;
                    drawHood = false; // No hood if helmet is equipped
                }
                if (player.equipped.gloves && player.equipped.gloves.set) {
                    armColor = setColors[player.equipped.gloves.set].main;
                }
                if (player.equipped.boots && player.equipped.boots.set) {
                    legColor = setColors[player.equipped.boots.set].main;
                }
            }
            
            // Draw Torso (Armor)
            ctx.fillStyle = torsoColor; 
            ctx.fillRect(16, 16, 32, 32); 

            // Draw Head (Helmet or Hood)
            if (drawHood) {
                ctx.fillStyle = headColor; // Hood color
                ctx.beginPath();
                ctx.moveTo(20, 20); ctx.lineTo(18, 10); ctx.lineTo(46, 10); 
                ctx.lineTo(44, 20); ctx.lineTo(38, 22); ctx.lineTo(32, 24); 
                ctx.lineTo(26, 22); ctx.closePath(); ctx.fill();
                ctx.fillStyle = defaultPartColors.skin; // Face color
                ctx.fillRect(26, 13, 12, 7); 
                ctx.fillStyle = defaultPartColors.eyes; // Eye color
                ctx.fillRect(28, 15, 2, 2); 
                ctx.fillRect(34, 15, 2, 2); 
            } else { 
                ctx.fillStyle = headColor; // Helmet color
                ctx.fillRect(20, 8, 24, 12); 
                ctx.fillStyle = detailColor; // Helmet detail
                ctx.fillRect(22, 10, 20, 2); 
                ctx.fillStyle = defaultPartColors.skin; // Face color
                ctx.fillRect(24, 12, 16, 8); 
                ctx.fillStyle = defaultPartColors.eyes; // Eye color
                ctx.fillRect(28, 14, 2, 2); ctx.fillRect(34, 14, 2, 2);
            }
            
            // Draw Arms (Gloves)
            ctx.fillStyle = armColor; // Left arm color
            ctx.fillRect(8, 24, 10, 16); 
            ctx.strokeStyle = detailColor; // Arm detail
            ctx.lineWidth = 2; 
            ctx.strokeRect(8, 24, 10, 16);

            // Draw Legs (Boots)
            ctx.fillStyle = legColor; // Leg color
            ctx.fillRect(20, 48, 10, 12); ctx.fillRect(34, 48, 10, 12); 
            ctx.fillStyle = detailColor; // Leg detail
            ctx.fillRect(20, 52, 10, 2); ctx.fillRect(34, 52, 10, 2);

            // Weapon drawing logic (remains the same)
            if (player.equipped.weapon) {
                switch (player.equipped.weapon.name) {
                    case 'Daga de Poder': 
                        ctx.fillStyle = '#333'; // Handle
                        ctx.fillRect(48, 20, 4, 12);
                        ctx.fillStyle = '#ADD8E6'; // Blade
                        ctx.beginPath();
                        ctx.moveTo(50, 12);
                        ctx.lineTo(46, 20);
                        ctx.lineTo(54, 20);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case 'Maza de Guerra': 
                        ctx.fillStyle = '#8B4513'; ctx.fillRect(48, 16, 4, 16); // Handle
                        ctx.fillStyle = '#50C878'; // Emerald head
                        ctx.beginPath(); ctx.arc(50, 14, 8, 0, Math.PI * 2); ctx.fill(); 
                        ctx.fillStyle = '#FFD700'; // Gold detail
                        ctx.beginPath(); ctx.arc(50, 14, 4, 0, Math.PI * 2); ctx.fill();
                        // Spikes
                        ctx.fillStyle = '#408040'; // Darker emerald for spikes
                        ctx.beginPath(); ctx.moveTo(46, 8); ctx.lineTo(50, 2); ctx.lineTo(54, 8); ctx.closePath(); ctx.fill(); // Top spike
                        ctx.beginPath(); ctx.moveTo(46, 20); ctx.lineTo(50, 26); ctx.lineTo(54, 20); ctx.closePath(); ctx.fill(); // Bottom spike
                        ctx.beginPath(); ctx.moveTo(42, 14); ctx.lineTo(48, 10); ctx.lineTo(48, 18); ctx.closePath(); ctx.fill(); // Left spike
                        ctx.beginPath(); ctx.moveTo(58, 14); ctx.lineTo(52, 10); ctx.lineTo(52, 18); ctx.closePath(); ctx.fill(); // Right spike
                        break;
                    case 'Espada de Luz': 
                        ctx.fillStyle = '#ADD8E6'; ctx.fillRect(48, 16, 14, 6); // Blue blade
                        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(46, 20, 18, 2); // White guard
                        ctx.fillStyle = '#4682B4'; ctx.fillRect(44, 22, 6, 8); // Handle
                        break;
                    case 'Libro Celestial': 
                        ctx.fillStyle = '#D3D3D3'; ctx.fillRect(48, 16, 12, 16); // Lead color book
                        ctx.fillStyle = '#FFD700'; ctx.fillRect(46, 18, 2, 12); // Gold spine
                        ctx.fillStyle = '#FFD700'; ctx.fillRect(58, 18, 2, 12); // Gold spine
                        ctx.fillStyle = '#FFFFFF'; ctx.font = '10px Arial'; ctx.fillText('L', 52, 26);
                        break;
                    case 'Rayo de Oscuridad':
                        ctx.fillStyle = '#8A2BE2'; ctx.fillRect(48, 18, 16, 6); // Purple ray
                        ctx.fillStyle = '#4B0082'; ctx.fillRect(44, 16, 6, 10); // Darker purple base
                        const darkGlow = ctx.createRadialGradient(56, 21, 2, 56, 21, 15);
                        darkGlow.addColorStop(0, 'rgba(138, 43, 226, 0.8)'); 
                        darkGlow.addColorStop(0.5, 'rgba(75, 0, 130, 0.5)');
                        darkGlow.addColorStop(1, 'rgba(75, 0, 130, 0)');
                        ctx.fillStyle = darkGlow; ctx.fillRect(38, 10, 36, 22); 
                        break;
                    case 'Arco del Bosque':
                        ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2; // Brown wood
                        ctx.beginPath(); ctx.arc(50, 25, 10, Math.PI * 0.7, Math.PI * 1.3, true); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(50, 15); ctx.lineTo(50, 35); ctx.stroke();
                        ctx.fillStyle = '#228B22'; ctx.beginPath(); ctx.arc(50, 15, 3, 0, Math.PI * 2); ctx.fill(); // Green leaves
                        ctx.beginPath(); ctx.arc(50, 35, 3, 0, Math.PI * 2); ctx.fill();
                        break;
                    case 'Guadaña Helada':
                        ctx.fillStyle = '#A9A9A9'; ctx.fillRect(48, 16, 4, 16); // Handle
                        ctx.fillStyle = '#87CEEB'; ctx.beginPath(); ctx.moveTo(52, 16); ctx.lineTo(60, 12); ctx.lineTo(60, 24); ctx.lineTo(52, 28); ctx.fill(); // Winter Blue Blade
                        break;
                    case 'Escudo Colosal':
                        ctx.fillStyle = '#87CEEB'; ctx.fillRect(35, 10, 25, 25); // Sky Blue Shield body (made larger)
                        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(47.5, 22.5, 7, 0, Math.PI * 2); ctx.fill(); // Gold Central boss (scaled with shield)
                        ctx.strokeStyle = '#36454F'; ctx.lineWidth = 2; ctx.strokeRect(35, 10, 25, 25);
                        break;
                    default: ctx.fillStyle = '#d0d0d0'; ctx.fillRect(48, 20, 12, 4); ctx.fillStyle = '#ffd700'; ctx.fillRect(44, 18, 6, 8);
                }
            } else { ctx.fillStyle = '#d0d0d0'; ctx.fillRect(48, 20, 12, 4); ctx.fillStyle = '#ffd700'; ctx.fillRect(44, 18, 6, 8); }
            
            // Final outlines (using default black for outlines)
            ctx.strokeStyle = '#000'; ctx.lineWidth = 1; 
            ctx.strokeRect(16, 16, 32, 32); // Torso outline
            ctx.strokeRect(20, 8, 24, 12); // Helmet outline (or top of hood)
            ctx.strokeRect(20, 48, 10, 12); // Left leg outline
            ctx.strokeRect(34, 48, 10, 12); // Right leg outline
            return canvas.toDataURL();
        }
        function createDuendeSprite() {
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
        function createWolfSprite() {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');

            const bodyMain = '#B71C1C'; 
            const furRed = '#D32F2F';   
            const shadowRed = '#7F0000'; 
            const eyeColor = '#FF4500'; 
            const clawColor = '#212121'; 
            const highlightRed = '#E57373'; 

            // Tail (bushy, slightly arched, dark red with highlights)
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


            // Legs (back)
            ctx.fillStyle = shadowRed;
            ctx.beginPath(); ctx.ellipse(18, 48, 6, 12, -0.25 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
            ctx.beginPath(); ctx.ellipse(46, 48, 6, 12, 0.25 * Math.PI, 0, Math.PI * 2); ctx.fill();  
            
            // Legs (front)
            ctx.fillStyle = bodyMain;
            ctx.beginPath(); ctx.ellipse(25, 50, 7, 13, -0.1 * Math.PI, 0, Math.PI * 2); ctx.fill(); 
            ctx.beginPath(); ctx.ellipse(39, 50, 7, 13, 0.1 * Math.PI, 0, Math.PI * 2); ctx.fill();  

            // Body
            ctx.fillStyle = bodyMain;
            ctx.beginPath();
            ctx.ellipse(32, 40, 20, 14, 0, 0, Math.PI * 2); 
            ctx.fill();
            
            // Fur on back (spikes/mane)
            ctx.fillStyle = furRed;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(18 + i * 7, 30); 
                ctx.lineTo(21 + i * 7, 22 - Math.random()*3); 
                ctx.lineTo(24 + i * 7, 30);
                ctx.closePath();
                ctx.fill();
            }

            // Head
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

            // Ears (pointy)
            ctx.fillStyle = shadowRed;
            ctx.beginPath(); 
            ctx.moveTo(43, 20); ctx.lineTo(39, 8); ctx.lineTo(47, 17); ctx.closePath(); ctx.fill();
            ctx.beginPath(); 
            ctx.moveTo(57, 20); ctx.lineTo(53, 8); ctx.lineTo(61, 17); ctx.closePath(); ctx.fill();
            
            // Eyes
            ctx.fillStyle = eyeColor;
            ctx.shadowColor = eyeColor;
            ctx.shadowBlur = 5;
            ctx.beginPath(); ctx.ellipse(46, 28, 3.5, 2.5, 0,0, Math.PI*2); ctx.fill(); 
            ctx.beginPath(); ctx.ellipse(55, 28, 3.5, 2.5, 0,0, Math.PI*2); ctx.fill(); 
            ctx.shadowBlur = 0; 

            // Claws
            ctx.fillStyle = clawColor;
            ctx.beginPath(); ctx.moveTo(20,59); ctx.lineTo(18,63); ctx.lineTo(22,61); ctx.closePath(); ctx.fill(); 
            ctx.beginPath(); ctx.moveTo(34,59); ctx.lineTo(32,63); ctx.lineTo(36,61); ctx.closePath(); ctx.fill(); 
            
            return canvas.toDataURL();
        }
        function createSkeletonSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#f0f0f0';x.fillRect(28,24,8,24);x.fillRect(20,32,24,4);x.fillRect(20,38,24,4);x.beginPath();x.ellipse(32,16,10,12,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(28,14,3,4,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(36,14,3,4,0,0,Math.PI*2);x.fill();x.fillStyle = '#f0f0f0';x.beginPath();x.ellipse(32,22,8,4,0,0,Math.PI);x.fill();x.strokeStyle = '#000';x.lineWidth = 1;x.beginPath();x.moveTo(24,22);x.lineTo(40,22);x.stroke();x.fillStyle = '#f0f0f0';x.fillRect(16,32,12,4);x.fillRect(36,32,12,4);x.fillRect(24,48,4,12);x.fillRect(36,48,4,12);x.fillStyle = '#a0a0a0';x.fillRect(48,28,12,2);x.fillStyle = '#8b4513';x.fillRect(44,27,4,4); return c.toDataURL(); }
        function createMiniBossSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#ff6600';x.beginPath();x.ellipse(32,32,20,24,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,16,14,12,0,0,Math.PI*2);x.fill();x.fillStyle = '#ffff00';x.beginPath();x.ellipse(26,14,4,4,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(38,14,4,4,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(26,14,2,2,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(38,14,2,2,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,22,8,4,0,0,Math.PI);x.fill();x.fillStyle = '#8b4513';x.beginPath();x.moveTo(22,10);x.lineTo(18,2);x.lineTo(26,8);x.fill();x.beginPath();x.moveTo(42,10);x.lineTo(46,2);x.lineTo(38,8);x.fill();x.fillStyle = '#8b4513';x.fillRect(48,28,4,16);x.fillStyle = '#a0a0a0';x.beginPath();x.moveTo(52,28);x.lineTo(60,22);x.lineTo(60,34);x.lineTo(52,28);x.fill(); return c.toDataURL(); }
        function createBossSprite() { const c = document.createElement('canvas'); c.width=64;c.height=64; const x=c.getContext('2d'); x.fillStyle = '#990000';x.fillRect(12,12,40,40);x.fillStyle = '#cc0000';x.beginPath();x.ellipse(32,20,16,10,0,0,Math.PI*2);x.fill();x.fillStyle = '#ffff00';x.beginPath();x.ellipse(24,18,5,5,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(40,18,5,5,0,0,Math.PI*2);x.fill();x.fillStyle = '#000';x.beginPath();x.ellipse(24,18,2,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(40,18,2,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(32,26,10,4,0,0,Math.PI);x.fill();x.fillStyle = '#fff';for(let i=0;i<5;i++){x.beginPath();x.moveTo(24+i*4,26);x.lineTo(26+i*4,26);x.lineTo(25+i*4,30);x.fill();}x.fillStyle = '#660000';x.fillRect(12,32,40,4);x.fillRect(12,42,40,4);x.fillStyle = '#000';x.fillRect(52,20,4,24);x.fillStyle = '#a0a0a0';x.beginPath();x.moveTo(54,12);x.lineTo(60,20);x.lineTo(48,20);x.fill(); return c.toDataURL(); }
        function createArachnidBossSprite() { 
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
            function createSpiderlingSprite() {
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
        function createStairsSprite() {
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
        function createFloorSprite() { if (sprites.floor) return sprites.floor; const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle='#aaa';x.fillRect(0,0,64,64);x.strokeStyle='#888';x.lineWidth=1;for(let y=8;y<64;y+=16){x.beginPath();x.moveTo(0,y);x.lineTo(64,y);x.stroke();}for(let X=8;X<64;X+=16){x.beginPath();x.moveTo(X,0);x.lineTo(X,64);x.stroke();}x.strokeStyle='#777';const p=[{x:12,y:15,l:10,a:0.5},{x:32,y:24,l:8,a:1.2},{x:48,y:40,l:12,a:2.1},{x:20,y:52,l:9,a:3.6},{x:52,y:8,l:11,a:5.2}];for(const k of p){x.beginPath();x.moveTo(k.x,k.y);x.lineTo(k.x+Math.cos(k.a)*k.l,k.y+Math.sin(k.a)*k.l);x.stroke();}return c.toDataURL(); }
        function createWallSprite() { if (sprites.wall) return sprites.wall; const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle='#555';x.fillRect(0,0,64,64);x.strokeStyle='#333';x.lineWidth=2;for(let y=16;y<64;y+=16){x.beginPath();x.moveTo(0,y);x.lineTo(64,y);x.stroke();}for(let r=0;r<4;r++){const o=r%2===0?0:16;for(let X=o;X<64;X+=32){x.beginPath();x.moveTo(X,r*16);x.lineTo(X,r*16+16);x.stroke();}}x.fillStyle='#444';const d=[{x:10,y:8,r:1.5},{x:25,y:12,r:2},{x:40,y:7,r:1.2},{x:55,y:10,r:1.8},{x:15,y:22,r:1.3},{x:30,y:26,r:2.2},{x:48,y:24,r:1.7},{x:8,y:38,r:1.9},{x:22,y:42,r:1.4},{x:38,y:40,r:2.1},{x:52,y:44,r:1.6},{x:12,y:56,r:1.8},{x:28,y:58,r:1.5},{x:44,y:54,r:2},{x:58,y:60,r:1.7},{x:18,y:5,r:1.3},{x:34,y:32,r:1.9},{x:50,y:18,r:1.4},{x:5,y:48,r:2.2},{x:60,y:36,r:1.6}];for(const k of d){x.beginPath();x.arc(k.x,k.y,k.r,0,Math.PI*2);x.fill();}return c.toDataURL(); }
        function createChestSprite() { const c = document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle = '#8B4513';x.fillRect(12,20,40,30);x.fillStyle = '#A0522D';x.fillRect(12,20,40,10);x.fillStyle = '#555';x.fillRect(12,30,40,4);x.fillRect(12,40,40,4);x.fillStyle = '#FFD700';x.fillRect(28,28,8,8);x.fillStyle = '#000';x.beginPath();x.arc(32,32,2,0,Math.PI*2);x.fill();x.fillStyle = 'rgba(255,255,255,0.2)';x.fillRect(14,22,36,2);return c.toDataURL(); }
        
        // New sprite for Minion (Shadow) - now a black version of the player sprite
        // This function now takes the pre-loaded player image as an argument
        function createMinionSprite(playerImage) {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');

            // Draw the already loaded player image onto the minion canvas
            ctx.drawImage(playerImage, 0, 0);
            
            // Apply a filter to make it completely black.
            ctx.globalCompositeOperation = 'source-atop'; 
            ctx.fillStyle = 'rgba(0, 0, 0, 1)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height); 
            ctx.globalCompositeOperation = 'source-over'; 
            
            // Add a subtle dark glow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = 'rgba(50, 50, 50, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, canvas.width, canvas.height); 
            ctx.shadowBlur = 0;

            return canvas.toDataURL();
        }
        // --- Fin de Funciones de Creación de Sprites ---

        function loadSprites() {
            // Create and load player sprite first
            sprites.player = createPlayerSprite();
            loadedImages.player = new Image();
            loadedImages.player.src = sprites.player;
            loadedImages.player.onload = () => {
                // Once player sprite is loaded, then create and load minion sprite
                sprites.minion = createMinionSprite(loadedImages.player); 
                loadedImages.minion = new Image();
                loadedImages.minion.src = sprites.minion;
                loadedImages.minion.onload = () => { /* console.log('minion sprite loaded'); */ };
                loadedImages.minion.onerror = () => { console.error('Error loading minion sprite'); };

                // Load other sprites after player and minion are handled
                for (const key in sprites) {
                    if (key === 'player' || key === 'minion') continue; 
                    if (!loadedImages[key] || sprites[key] !== loadedImages[key].src) {
                        loadedImages[key] = new Image();
                        loadedImages[key].src = sprites[key];
                        loadedImages[key].onload = () => { /* console.log(`${key} sprite loaded`); */ };
                        loadedImages[key].onerror = () => { console.error(`Error loading ${key} sprite`); };
                    }
                }
            };
            loadedImages.player.onerror = () => { console.error('Error loading player sprite'); };

            // Initialize other sprites' data URLs, but their loading into loadedImages happens in the onload of player
            if (!sprites.duende) sprites.duende = createDuendeSprite();
            if (!sprites.lobo) sprites.lobo = createWolfSprite();
            if (!sprites.skeleton) sprites.skeleton = createSkeletonSprite();
            if (!sprites.miniBoss) sprites.miniBoss = createMiniBossSprite();
            if (!sprites.boss) sprites.boss = createBossSprite();
            if (!sprites.finalBoss) sprites.finalBoss = createArachnidBossSprite(); 
            if (!sprites.spiderling) sprites.spiderling = createSpiderlingSprite(); 
            if (!sprites.floor) sprites.floor = createFloorSprite();
            if (!sprites.wall) sprites.wall = createWallSprite();
            if (!sprites.chest) sprites.chest = createChestSprite();
            if (!sprites.stairs) sprites.stairs = createStairsSprite(); 
        }


        let spellEffects = { powerStrike: 0, healingSpell: 0, fireball: 0 }; 
        let projectiles = [];
        let skillCooldowns = {};
        let attackInterval = 400; // Base attack interval
        const fixedProjectileSpeed = 0.15; // Adjusted: 0.15 tiles per frame for slower projectiles

        class Projectile {
            constructor(x, y, dx, dy, type, owner = 'player', damage = 0, isCritical = false, maxRangeTiles = 1) { 
                this.x = x; this.y = y;
                this.initialX = x; 
                this.initialY = y;

                // Normalize dx and dy to ensure consistent speed
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
                
                // Calculate distance traveled from initial point
                this.distanceTraveled = Math.sqrt(Math.pow(this.x - this.initialX, 2) + Math.pow(this.y - this.initialY, 2));

                // Remove projectile if it exceeds max range
                if (this.distanceTraveled > this.maxRangeTiles) {
                    return false;
                }
                return true; 
            }
        }

        // New skill definitions (These are the master definitions for skills)
        const skills = [
            { name: 'Sigilo', cost: 2, prereq: null, effect: 'Te vuelves uno con las sombras, imperceptible para los monstruos durante 7 segundos.', cooldown: 15000 },
            { name: 'Golpe Crítico', cost: 1, prereq: null, effect: 'El siguiente golpe que asestes será un 50% más devastador.', cooldown: 5000 },
            { name: 'Teletransportación', cost: 2, prereq: 'Golpe Crítico', effect: 'Desplázate instantáneamente a un punto aleatorio del mapa.', cooldown: 10000 },
            { name: 'Invocar', cost: 3, prereq: 'Teletransportación', effect: 'Manifiesta un súbdito leal con el 25% de tus estadísticas.', cooldown: 20000 },
            { name: 'Regeneración', cost: 1, prereq: 'Golpe Crítico', effect: 'Restaura el 50% de tu salud máxima al instante.', cooldown: 10000 },
            { name: 'Velocidad', cost: 1, prereq: null, effect: 'Incrementa tu velocidad de movimiento en un 10% durante 5 segundos.', cooldown: 8000 },
            { name: 'Invencible', cost: 3, prereq: 'Regeneración', effect: 'Te vuelves inmune a todo daño durante 3 segundos.', cooldown: 25000 },
            { name: 'Rayo de Hielo', cost: 2, prereq: 'Velocidad', effect: 'Congela a un enemigo en su lugar durante 5 segundos.', cooldown: 12000 },
            { name: 'Suerte', cost: 1, prereq: null, effect: 'Aumenta tu probabilidad de asestar un golpe crítico en un 5% durante 10 segundos.', cooldown: 15000 },
            { name: 'Debilidad', cost: 2, prereq: 'Suerte', effect: 'Reduce la resistencia de los enemigos cercanos en un 5% durante 8 segundos.', cooldown: 10000 },
            { name: 'Furia', cost: 2, prereq: 'Invencible', effect: 'Duplica tu ataque cuando tu salud desciende al 25% o menos (pasiva).', cooldown: 0 }, 
            { name: 'Extracción de Almas', cost: 2, prereq: 'Rayo de Hielo', effect: 'Recupera salud por cada 5 golpes exitosos que asestes (pasiva).', cooldown: 0 } 
        ];

        function activateSkill(skillName) {
            const skill = skills.find(s => s.name === skillName);
            if (!skill) return;

            // Check if the skill is equipped in any of the habilidad slots
            const isSkillEquipped = player.equipped.habilidad1 === skillName ||
                                    player.equipped.habilidad2 === skillName ||
                                    player.equipped.habilidad3 === skillName;
            
            if (!isSkillEquipped) {
                showMessage("Esta habilidad no está equipada en ninguna de tus ranuras activas.");
                return;
            }

            if (player.skillUsageThisFloor[skillName]) {
                showMessage("Ya has usado esta habilidad en este piso.");
                return;
            }
            const currentTime = Date.now();
            if (skillCooldowns[skillName] && skillCooldowns[skillName] > currentTime) {
                showMessage(`Habilidad en enfriamiento. Tiempo restante: ${((skillCooldowns[skill.name] - currentTime) / 1000).toFixed(1)}s`);
                return;
            }

            switch (skillName) {
                case 'Sigilo':
                    player.stealthActive = true; 
                    player.stealthEndTime = currentTime + 7000; 
                    player.stealthStatMultiplier = 0.5; // 50% reduction
                    updateStats(); 
                    showMessage("¡Te has vuelto sigiloso!");
                    break;
                case 'Golpe Crítico':
                    player.nextHitCritical = true;
                    showMessage("¡Tu próximo golpe será crítico!");
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
                        showMessage("¡Teletransportación exitosa!");
                    } else {
                        showMessage("No se pudo teletransportar a un lugar seguro.");
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
                        showMessage("¡Un súbdito leal ha sido invocado!");
                    } else {
                        showMessage("No hay espacio para invocar un súbdito.");
                    }
                    break;
                case 'Regeneración':
                    const healedAmount = Math.floor(player.maxHp * 0.5);
                    player.hp = Math.min(player.maxHp, player.hp + healedAmount);
                    showMessage(`¡Has regenerado ${healedAmount} HP!`);
                    break;
                case 'Velocidad':
                    player.isSpeedBoosted = true;
                    player.speedBoostEndTime = currentTime + 5000; 
                    player.spd *= 1.5; 
                    showMessage("¡Velocidad aumentada!");
                    break;
                case 'Invencible':
                    player.isInvincible = true;
                    player.invincibleEndTime = currentTime + 3000; 
                    showMessage("¡Eres invencible!");
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
                        showMessage(`¡${nearestMonster.type} ha sido congelado!`);
                    } else {
                        showMessage("No hay enemigos cerca para congelar.");
                    }
                    break;
                case 'Suerte':
                    player.luckBoostEndTime = currentTime + 10000; 
                    showMessage("¡Tu suerte ha aumentado!");
                    break;
                case 'Debilidad':
                    monsters.filter(m => !m.isMinion).forEach(m => {
                        const dist = Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY);
                        if (dist <= 3) { 
                            m.isWeakened = true;
                            m.weaknessEndTime = currentTime + 8000; 
                            showMessage(`¡${m.type} ha sido debilitado!`);
                        }
                    });
                    if (!monsters.some(m => !m.isMinion && Math.abs(player.tileX - m.tileX) + Math.abs(player.tileY - m.tileY) <= 3)) {
                        showMessage("No hay enemigos cerca para debilitar.");
                    }
                    break;
                case 'Furia': 
                    player.furyActive = true;
                    showMessage("Habilidad Furia activada (pasiva).");
                    break;
                case 'Extracción de Almas': 
                    player.soulExtractionActive = true;
                    showMessage("Habilidad Extracción de Almas activada (pasiva).");
                    break;
            }
            if (skill.cooldown > 0) {
                skillCooldowns[skill.name] = currentTime + skill.cooldown;
            }
            if (skill.cooldown !== 0) { 
                player.skillUsageThisFloor[skill.name] = true; 
            }
        }

        let monsters = [];
        let chests = [];

        function generateFloor() {
            map = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(0)); 
            stairLocation = { x: -1, y: -1, active: false, type: 4 };
            player.skillUsageThisFloor = {}; 

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
                monsters.push({ type: 'final-arachnid-boss', hp: fbHp, maxHp: fbHp, atk: fbAtk, spd: 0.7, tileX: bossSpawnX, tileY: bossSpawnY, xp: 5000, lastMoveTime: 0, hitFrame: 0, width: 2, height: 2, abilityCooldowns: {webShot:0, summon:0}, lastAttackTime: 0 }); 
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
                const miniBossX = rooms[miniBossRoomIndex].centerX; // Corrected: Use centerX
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

                monsters = [];
                const duendeCount = 6 + (currentFloor - 1) * 2; 
                const skeletonCount = 3 + Math.floor((currentFloor - 1) * 1.5);
                const wolfCount = 2 + currentFloor; 

                const monsterSpawnLocations = [];
                for(let y=0; y < mapHeight; y++){ for(let x=0; x < mapWidth; x++){
                    if(map[y][x] === 1 && !(x === playerStartX && y === playerStartY)) {
                        monsterSpawnLocations.push({x,y});
                    }
                }}

                hpMultiplier = 1.0; 
                atkMultiplier = 1.0;
                if (selectedDifficulty === 'facil') { hpMultiplier = 0.6; atkMultiplier = 0.7; } 
                else if (selectedDifficulty === 'dificil') { hpMultiplier = 1.5; atkMultiplier = 1.35; }


                const placeMonster = (type, baseHp, baseAtk, spd, xp, dropsKey = false) => {
                    if (monsterSpawnLocations.length === 0) return;
                    let spawnIndex = Math.floor(Math.random() * monsterSpawnLocations.length);
                    let loc = monsterSpawnLocations.splice(spawnIndex, 1)[0];
                    if ((loc.x === miniBossX && loc.y === miniBossY) || (loc.x === bossAreaX && loc.y === bossAreaY) || (loc.x === stairLocation.x && loc.y === stairLocation.y)) {
                        if (monsterSpawnLocations.length > 0) placeMonster(type, baseHp, baseAtk, spd, xp, dropsKey); 
                        return;
                    }
                    const mHp = Math.floor(baseHp * (1+(currentFloor-1)*0.5) * hpMultiplier);
                    const mAtk = Math.floor(baseAtk * (1+(currentFloor-1)*0.3) * atkMultiplier);
                    monsters.push({ type, hp: mHp, maxHp: mHp, atk: mAtk, spd, tileX: loc.x, tileY: loc.y, xp, dropsKey, lastMoveTime: 0, hitFrame: 0, lastAttackTime: 0, isMinion: false }); 
                };
                
                for (let i = 0; i < duendeCount; i++) placeMonster('duende', 20, 15, 1.5, 50);
                for (let i = 0; i < wolfCount; i++) placeMonster('lobo', 25, 20, 2.0, 75);
                for (let i = 0; i < skeletonCount; i++) placeMonster('skeleton', 30, 25, 1, 100);
                
                let miniBossBaseHp = 100; let miniBossBaseAtk = 35;
                let mbHp = Math.floor(miniBossBaseHp * (1+(currentFloor-1)*0.5) * hpMultiplier);
                let mbAtk = Math.floor(miniBossBaseAtk * (1+(currentFloor-1)*0.3) * atkMultiplier);
                monsters.push({ type: 'mini-boss', hp: mbHp, maxHp: mbHp, atk: mbAtk, spd: 1.5, tileX: miniBossX, tileY: miniBossY, xp: 250, dropsKey: true, lastMoveTime: 0, hitFrame: 0, lastAttackTime: 0, isMinion: false }); 
                
                let bossBaseHp = 200; let bossBaseAtk = 50;
                let bHp = Math.floor(bossBaseHp * (1+(currentFloor-1)*0.5) * hpMultiplier);
                let bAtk = Math.floor(bossBaseAtk * (1+(currentFloor-1)*0.3) * atkMultiplier);
                monsters.push({ type: 'boss', hp: bHp, maxHp: bHp, atk: bAtk, spd: 1, tileX: bossAreaX, tileY: bossAreaY, xp: 1000, lastMoveTime: 0, hitFrame: 0, lastAttackTime: 0, isMinion: false }); 
                
                chests = []; spawnChests(monsterSpawnLocations); 
            } 
            loadSprites(); 
        }
        
        function carvePathBetweenRooms(room1, room2) { 
            let x1 = room1.centerX; let y1 = room1.centerY;
            let x2 = room2.centerX; let y2 = room2.centerY;

            if (Math.random() > 0.5) { 
                for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                    if(map[y1] && map[y1][x] !== undefined) map[y1][x] = 1;
                }
                for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                    if(map[y] && map[y][x2] !== undefined) map[y][x2] = 1;
                }
            } else { 
                for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                    if(map[y] && map[y][x1] !== undefined) map[y][x1] = 1;
                }
                for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                    if(map[y2] && map[y2][x] !== undefined) map[y2][x] = 1;
                }
            }
        }


        function spawnChests(spawnLocations) { 
            const potionTypes = [
                { name: 'Poción de Vida Pequeña', weight: 60 },
                { name: 'Poción de Vida Mediana', weight: 30 },
                { name: 'Poción de Vida Grande', weight: 10 }
            ];

            const getWeightedRandomPotion = () => {
                let totalWeight = 0;
                for (const potion of potionTypes) {
                    totalWeight += potion.weight;
                }

                let randomNum = Math.random() * totalWeight;
                for (const potion of potionTypes) {
                    if (randomNum < potion.weight) {
                        return gearList.find(g => g.name === potion.name);
                    }
                    randomNum -= potion.weight;
                }
                return gearList.find(g => g.name === 'Poción de Vida Pequeña'); 
            };

            let availableSpawnPoints = [...spawnLocations]; 
            
            let numChestsToSpawn;
            if (selectedDifficulty === 'facil') {
                numChestsToSpawn = Math.floor(Math.random() * 2) + 2; // 2-3 chests
            } else if (selectedDifficulty === 'medio') {
                numChestsToSpawn = Math.floor(Math.random() * 3) + 1; // 1-3 chests
            } else if (selectedDifficulty === 'dificil') {
                numChestsToSpawn = Math.floor(Math.random() * 3); // 0-2 chests
            } else {
                numChestsToSpawn = Math.floor(Math.random() * 3) + 1; // Default to medium
            }

            for (let i = 0; i < numChestsToSpawn; i++) { 
                if (availableSpawnPoints.length === 0) break;

                let spawnIndex = Math.floor(Math.random() * availableSpawnPoints.length);
                let loc = availableSpawnPoints.splice(spawnIndex, 1)[0]; 
                
                if ((loc.x === player.tileX && loc.y === player.tileY) ||
                    (loc.x === stairLocation.x && loc.y === stairLocation.y) ||
                    monsters.some(m => m.tileX === loc.x && m.tileY === loc.y)) {
                    i--; 
                    continue;
                }

                const randomLoot = getWeightedRandomPotion(); 
                
                chests.push({ tileX: loc.x, tileY: loc.y, gear: randomLoot });
                map[loc.y][loc.x] = 2; 
            }
        }
        
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const minimapCanvas = document.getElementById('minimapCanvas');
        const minimapCtx = minimapCanvas.getContext('2d');
        let lastMoveTime = 0;
        let lastAttackTime = 0;
        const monsterAttackInterval = 1000; 
        
        let selectedIndex = 0; 
        let selectedSkillIndex = 0; 
        let selectedEquipmentSlotIndex = 0; 
        let gameOver = false;
        let walkFrame = 0; 
        let keys = {
            ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false,
            KeyA: false, KeyD: false, KeyW: false, KeyS: false,
            Space: false, KeyE: false, KeyI: false, KeyY: false, KeyR: false, KeyO: false,
            Digit1: false, Digit2: false, Digit3: false, Digit4: false, Digit5: false, Digit6: false,
            Digit7: false, Digit8: false, Digit9: false, Digit0: false 
        };
        

        const difficultyScreen = document.getElementById('difficultyScreen');
        const gameCanvas = document.getElementById('gameCanvas');
        const difficultyTitleElement = document.getElementById('difficultyTitle');
        const lastScoreDisplayElement = document.getElementById('lastScoreDisplay');
        const levelInputElement = document.getElementById('levelInput'); 
        const goToFloorButton = document.getElementById('btnGoToFloor');
        const messageBox = document.getElementById('messageBox'); 
        const equipmentMenu = document.getElementById('equipmentMenu'); 
        const btnEquipment = document.getElementById('btnEquipment'); 
        const equippedSlotsDiv = document.getElementById('equippedSlots'); 
        const equipmentMenuInstructions = document.getElementById('equipmentMenuInstructions'); 

        const btnSaveEquipment = document.getElementById('btnSaveEquipment');
        const btnReturnToDifficulty = document.getElementById('btnReturnToDifficulty');

        // Audio elements
        const audioMenu = document.getElementById('audioMenu');
        const audioGameOver = document.getElementById('audioGameOver');
        const audioVictory = document.getElementById('audioVictory');
        const audioFloorUp = document.getElementById('audioFloorUp');
        const audioCriticalHit = document.getElementById('audioCriticalHit');
        const audioChestOpen = document.getElementById('audioChestOpen'); 

        // New audio elements for dungeon tracks
        const dungeonTracks = [
            document.getElementById('audioDungeon1'),
            document.getElementById('audioDungeon2'),
            document.getElementById('audioDungeon3'),
            document.getElementById('audioDungeon4'),
            document.getElementById('audioDungeon5'),
            document.getElementById('audioDungeon6'),
            document.getElementById('audioDungeon7'),
            document.getElementById('audioDungeon8'),
            document.getElementById('audioDungeon9'),
            document.getElementById('audioDungeon10')
        ];
        let currentDungeonTrackIndex = 0; // To cycle through dungeon tracks

        // New audio elements for boss and equipment
        const audioBoss = document.getElementById('audioBoss'); // Now points to DunGeoN.mp3
        const audioEquipmentOpen = document.getElementById('audioEquipmentOpen');

        let currentAudioTrack = null;

        function playMusic(track) {
            let nextTrackElement = null;

            // Pause current track if it's playing
            if (currentAudioTrack) {
                currentAudioTrack.pause();
                currentAudioTrack.currentTime = 0; // Reset to beginning
            }

            switch (track) {
                case 'menu':
                    nextTrackElement = audioMenu;
                    break;
                case 'dungeon':
                    // Play a random dungeon track
                    currentDungeonTrackIndex = Math.floor(Math.random() * dungeonTracks.length);
                    nextTrackElement = dungeonTracks[currentDungeonTrackIndex];
                    break;
                case 'boss':
                    nextTrackElement = audioBoss;
                    break;
                case 'gameOver':
                    nextTrackElement = audioGameOver;
                    break;
                case 'victory':
                    nextTrackElement = audioVictory;
                    break;
                case 'floorUp': 
                    nextTrackElement = audioFloorUp;
                    break;
                case 'criticalHit': 
                    nextTrackElement = audioCriticalHit;
                    break;
                case 'chestOpen': 
                    nextTrackElement = audioChestOpen;
                    break;
                case 'equipmentOpen': // New case for equipment open sound
                    nextTrackElement = audioEquipmentOpen;
                    break;
                default:
                    nextTrackElement = null;
            }

            currentAudioTrack = nextTrackElement;
            if (currentAudioTrack) {
                // For one-shot sounds, reset and play
                if (track === 'floorUp' || track === 'criticalHit' || track === 'chestOpen' || track === 'equipmentOpen' || track === 'gameOver' || track === 'victory') {
                    currentAudioTrack.currentTime = 0; 
                }
                currentAudioTrack.play().catch(e => console.error("Error playing audio:", e));
            }
        }


        // Custom message box for alerts
        function showMessage(message) {
            messageBox.textContent = message;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 2000); 
        }


        document.getElementById('btnFacil').addEventListener('click', () => setDifficultyAndStart('facil'));
        document.getElementById('btnMedio').addEventListener('click', () => setDifficultyAndStart('medio'));
        document.getElementById('btnDificil').addEventListener('click', () => setDifficultyAndStart('dificil'));
        goToFloorButton.addEventListener('click', () => {
            const baseLevel = parseInt(levelInputElement.value); 
            if (baseLevel >= 1) {
                if (!gameStarted) { 
                    setDifficultyAndStart(selectedDifficulty, 1, baseLevel); 
                } else { 
                    player.level = baseLevel;
                    player.baseAtk = 5 + Math.floor((player.level - 1) * 1.5);
                    player.baseDef = 3 + (player.level - 1);
                    player.maxHp = 100 + (player.level - 1) * 20;
                    player.hp = player.maxHp; 
                    updateStats();
                    showMessage(`Nivel del jugador ajustado a ${player.level}.`);
                }
            } else {
                showMessage(`Por favor ingresa un nivel base de 1 o superior.`);
            }
        });

        // Event listener for the new "Equipo" button - accessible before game start
        btnEquipment.addEventListener('click', () => {
            toggleEquipmentMenu();
        });

        btnSaveEquipment.addEventListener('click', () => {
            savePlayerDataToLocalStorage();
            showMessage("¡Equipo guardado!");
        });

        btnReturnToDifficulty.addEventListener('click', () => {
            toggleEquipmentMenu(); 
        });

        // Add a click listener to the difficulty screen to initiate music playback
        difficultyScreen.addEventListener('click', () => {
            // Only play menu music if it's not already playing and the game hasn't started
            if (!gameStarted && currentAudioTrack !== audioMenu) {
                playMusic('menu');
            }
        });


        // Function to save player data to localStorage
        function savePlayerDataToLocalStorage() {
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
                gold: player.gold,
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

        // Function to load player data from localStorage
        function loadPlayerDataFromLocalStorage() {
            const storedData = localStorage.getItem('dungeonCrawlerPlayerData');
            if (storedData) {
                const loadedPlayer = JSON.parse(storedData);
                Object.assign(player, loadedPlayer);
                
                // Re-map equipped items to actual gearList objects, ensuring all properties are present
                for (const slot in loadedPlayer.equipped) {
                    if (slot.startsWith('habilidad')) {
                        player.equipped[slot] = loadedPlayer.equipped[slot]; 
                    } else if (loadedPlayer.equipped[slot]) {
                        const fullItem = gearList.find(g => g.name === loadedPlayer.equipped[slot].name);
                        player.equipped[slot] = fullItem || null; 
                    } else {
                        player.equipped[slot] = null;
                    }
                }

                // Re-map inventory items to actual gearList objects
                player.inventory = loadedPlayer.inventory
                    .map(itemData => gearList.find(g => g.name === itemData.name))
                    .filter(item => item !== undefined); 
                
            } else {
                // Initial starting gear if no saved data exists: Add ALL equipment items to inventory
                player.inventory = gearList.filter(item => item.type !== 'potion'); 
                
                // Set initial equipped items to the first item of each type if available
                player.equipped.weapon = gearList.find(g => g.name === 'Daga de Poder') || null;
                player.equipped.helmet = gearList.find(g => g.name === 'Casco de Hierro') || null;
                player.equipped.armor = gearList.find(g => g.name === 'Armadura de Hierro') || null;
                player.equipped.gloves = gearList.find(g => g.name === 'Guantes de Hierro') || null;
                player.equipped.boots = gearList.find(g => g.name === 'Botas de Hierro') || null;
                
                // Initial permanently learned skills (all skills are "learned" for equipment selection)
                player.permanentlyLearnedSkills = skills.map(s => s.name);
                // Set an initial equipped habilidad
                player.equipped.habilidad1 = 'Sigilo'; 
                player.equipped.habilidad2 = null;
                player.equipped.habilidad3 = null;
            }
        }


        function setDifficultyAndStart(difficulty, startFloor = 1, baseLevel = 1) { 
            selectedDifficulty = difficulty;
            hpMultiplier = 1.0; 
            atkMultiplier = 1.0;
            if (selectedDifficulty === 'facil') { hpMultiplier = 0.6; atkMultiplier = 0.7; } 
            else if (selectedDifficulty === 'dificil') { hpMultiplier = 1.5; atkMultiplier = 1.35; }

            difficultyScreen.style.display = 'none';
            gameCanvas.style.display = 'block'; 
            minimapCanvas.style.display = 'block'; 
            equipmentMenu.style.display = 'none'; 
            
            currentFloor = startFloor; 

            // Re-initialize player stats, but load equipped gear and learned skills
            let tempPlayer = { 
                tileX: 1, tileY: 1, hp: 100, maxHp: 100, 
                atk: 5 + Math.floor((baseLevel - 1) * 1.5), 
                def: 3 + (baseLevel - 1), 
                spd: 4, 
                xp: 0, level: baseLevel, skillPoints: 0, 
                inventory: [], 
                equipped: { 
                    helmet: null, armor: null, gloves: null, boots: null, weapon: null, 
                    habilidad1: null, habilidad2: null, habilidad3: null 
                },
                unlockedSkills: [], 
                permanentlyLearnedSkills: [], 
                hasKey: false, facingDirection: 'right', 
                hitFrame: 0, doorOpened: false, lastHitTime:0, invulnerabilityTime:500,
                isAttacking: false, attackAnimFrame: 0, attackAnimDuration: 7, attackLungeDistance: tileSize / 4,
                skillUsageThisFloor: {},
                enemiesDefeatedThisRun: 0,
                gold: 0,
                isSlowed: false, slowEndTime: 0,
                potionsBoughtTotal: 0,
                isStealthed: false, stealthEndTime: 0,
                stealthActive: false, 
                stealthStatMultiplier: 1.0, 
                nextHitCritical: false,
                isInvincible: false, invincibleEndTime: 0,
                isSpeedBoosted: false, speedBoostEndTime: 0,
                luckBoostEndTime: 0,
                soulExtractionActive: false,
                furyActive: false,
                baseSpd: 4, 
                baseAtk: 5 + Math.floor((baseLevel - 1) * 1.5), 
                baseDef: 3 + (baseLevel - 1), 
                criticalChanceBonus: 0,
                celestialBookCritCounter: 0,
                hasMiniShield: false,
                miniShieldHP: 0,
                miniShieldMaxHP: 0,
                miniShieldCooldownEnd: 0,
                darkRayEnemiesDefeated: 0
            };
            // Preserve equipped items and learned skills from the pre-game setup
            for (const slot in player.equipped) {
                if (slot.startsWith('habilidad')) {
                    tempPlayer.equipped[slot] = player.equipped[slot];
                } else {
                    tempPlayer.equipped[slot] = player.equipped[slot] ? { ...player.equipped[slot] } : null;
                }
            }
            tempPlayer.inventory = player.inventory.map(item => ({ ...item })); 
            tempPlayer.permanentlyLearnedSkills = [...player.permanentlyLearnedSkills]; 
            tempPlayer.skillPoints = player.skillPoints; 

            player = tempPlayer; 
            player.maxHp = 100 + (player.level - 1) * 20; 
            player.hp = player.maxHp; 

            projectiles = [];
            damageTexts = [];
            criticalHitEffects = [];
            skillCooldowns = {};
            skills.forEach(skill => {
                if (skill.cooldown > 0) {
                    skillCooldowns[skill.name] = 0; 
                }
            });

            stairLocation.active = false;
            monsters = [];
            chests = [];

            gameStarted = true;
            gameOver = false; 
            
            generateFloor(); 
            updateStats(); 
            loadSprites(); 
            const minimapTileSize = 5; 
            minimapCanvas.width = mapWidth * minimapTileSize;
            minimapCanvas.height = mapHeight * minimapTileSize;
            
            playMusic('dungeon'); // Start dungeon music
            requestAnimationFrame(gameLoop);
        }


        // Event listeners
        document.addEventListener('keydown', (e) => {
            // Allow navigation in menus even if game hasn't started
            if (isInventoryOpen || isSkillMenuOpen || isEquipmentOpen) {
                if (e.code === 'KeyI' || e.code === 'KeyY' || e.code === 'KeyO' || e.code === 'Escape' ||
                    e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight' ||
                    e.code === 'Enter' || e.code === 'KeyV') {
                    e.preventDefault(); 
                    if (isInventoryOpen) handleInventoryInput(e);
                    else if (isSkillMenuOpen) handleSkillInput(e);
                    else if (isEquipmentOpen) handleEquipmentInput(e);
                    return;
                }
            }

            // Game over state handling
            if (gameOver) {
                 if (e.code === 'KeyR') keys.KeyR = true; 
                 e.preventDefault(); 
                 return;
            }

            // In-game menu toggles
            if (e.code === 'KeyI') { toggleInventory(); e.preventDefault(); return; }
            if (e.code === 'KeyY') { toggleSkillMenu(); e.preventDefault(); return; }
            // Equipment menu is only accessible from difficulty screen
            if (e.code === 'KeyO') { showMessage("El menú de equipo solo se puede acceder desde la pantalla de inicio."); e.preventDefault(); return; }


            // In-game actions (movement, attack, skill activation)
            if (!isInventoryOpen && !isSkillMenuOpen && !isEquipmentOpen) {
                // Allow activation of equipped skills using Digits 1, 2, 3
                if (e.code === 'Digit1' && player.equipped.habilidad1) {
                    activateSkill(player.equipped.habilidad1);
                    e.preventDefault();
                    return;
                } else if (e.code === 'Digit2' && player.equipped.habilidad2) {
                    activateSkill(player.equipped.habilidad2);
                    e.preventDefault();
                    return;
                } else if (e.code === 'Digit3' && player.equipped.habilidad3) {
                    activateSkill(player.equipped.habilidad3);
                    e.preventDefault();
                    return;
                }

                if (keys.hasOwnProperty(e.code)) {
                    keys[e.code] = true;
                    if (e.code === 'Space' || e.code.startsWith('Arrow') || 
                        ['KeyA', 'KeyD', 'KeyW', 'KeyS'].includes(e.code)) {
                        e.preventDefault();
                    }
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (keys.hasOwnProperty(e.code)) {
                if (e.code === 'KeyR' && gameOver) { 
                } else {
                    keys[e.code] = false;
                }
            }
        });

        // --- Funciones de Dibujo ---
        function drawFloor(x, y) { if(loadedImages.floor && loadedImages.floor.complete) ctx.drawImage(loadedImages.floor, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#aaa'; ctx.fillRect(x,y,tileSize,tileSize);}}
        function drawWall(x, y) { if(loadedImages.wall && loadedImages.wall.complete) ctx.drawImage(loadedImages.wall, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#555'; ctx.fillRect(x,y,tileSize,tileSize);}}
        function drawChest(x, y) { if(loadedImages.chest && loadedImages.chest.complete) ctx.drawImage(loadedImages.chest, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#8B4513'; ctx.fillRect(x,y,tileSize,tileSize);}}
        function drawStairs(x,y) { if(loadedImages.stairs && loadedImages.stairs.complete) ctx.drawImage(loadedImages.stairs, 0,0,64,64, x, y, tileSize, tileSize); else { ctx.fillStyle = '#704214'; ctx.fillRect(x,y,tileSize,tileSize);}}


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

            // Draw mini-shield if active
            if (player.hasMiniShield && player.miniShieldHP > 0) {
                ctx.save();
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; 
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(drawX + tileSize / 2, drawY + tileSize / 2, tileSize / 2 + 5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; 
                ctx.fill();

                // Draw mini-shield HP bar
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
            else if (m.type === 'mini-boss') monsterImage = loadedImages.miniBoss;
            else if (m.type === 'boss') monsterImage = loaded.images.boss;
            else if (m.type === 'final-arachnid-boss') monsterImage = loadedImages.finalBoss; 
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
