export const allItems = [
    // Potions
    { name: 'Poción de Vida Pequeña', type: 'potion', heal: 25 },
    { name: 'Poción de Vida Mediana', type: 'potion', heal: 50 },
    { name: 'Poción de Vida Grande', type: 'potion', heal: 100 },
    // Gear
    // --- Cascos (Helmets) ---
    { name: 'Casco de Hierro', type: 'helmet', def: 3, set: 'Hierro', color: '#A9A9A9' },
    { name: 'Casco de Caballero', type: 'helmet', spd: 1, def: 3, set: 'Caballero', color: '#708090' },
    { name: 'Casco de Demonio', type: 'helmet', attackSpeedBonus: 1, atk: 1, def: 3, set: 'Demonio', color: '#8B0000' },
    { name: 'Casco de León', type: 'helmet', def: 5, evasion: 0.01, set: 'León', color: '#A0522D' },
    { name: 'Casco de Asesinato', type: 'helmet', spd: 2, critical: 0.02, evasion: 0.01, set: 'Asesinato', color: '#004953' },
    { name: 'Casco Noble', type: 'helmet', def: 3, evasion: 0.02, set: 'Noble', color: '#EAE0C8' },
    { name: 'Casco de Mago', type: 'helmet', atk: 2, def: 4, set: 'Mago', color: '#FFFFFF' },
    { name: 'Casco del Caos', type: 'helmet', def: 4, critical: 0.03, set: 'Caos', color: '#800080' },

    // --- Armaduras (Armor) ---
    { name: 'Armadura de Hierro', type: 'armor', def: 6, set: 'Hierro', color: '#A9A9A9' },
    { name: 'Armadura de Caballero', type: 'armor', spd: 1, def: 4, evasion: 0.01, set: 'Caballero', color: '#708090' },
    { name: 'Armadura de Demonio', type: 'armor', attackSpeedBonus: 1, atk: 2, def: 3, set: 'Demonio', color: '#8B0000' },
    { name: 'Armadura de León', type: 'armor', def: 4, evasion: 0.01, set: 'León', color: '#A0522D' },
    { name: 'Armadura de Asesinato', type: 'armor', spd: 2, critical: 0.02, evasion: 0.02, set: 'Asesinato', color: '#004953' },
    { name: 'Armadura Noble', type: 'armor', def: 7, evasion: 0.03, set: 'Noble', color: '#EAE0C8' },
    { name: 'Armadura de Mago', type: 'armor', atk: 3, def: 3, evasion: 0.02, set: 'Mago', color: '#FFFFFF' },
    { name: 'Armadura del Caos', type: 'armor', attackSpeedBonus: 2, atk: 4, def: 3, set: 'Caos', color: '#800080' },

    // --- Guantes (Gloves) ---
    { name: 'Guantes de Hierro', type: 'gloves', atk: 3, set: 'Hierro', color: '#A9A9A9' },
    { name: 'Guantes de Caballero', type: 'gloves', attackSpeedBonus: 1, atk: 2, def: 1, set: 'Caballero', color: '#708090' },
    { name: 'Guantes de Demonio', type: 'gloves', spd: 1, attackSpeedBonus: 1, atk: 3, set: 'Demonio', color: '#8B0000' },
    { name: 'Guantes de León', type: 'gloves', attackSpeedBonus: 1, atk: 5, set: 'León', color: '#A0522D' },
    { name: 'Guantes de Asesinato', type: 'gloves', attackSpeedBonus: 2, atk: 3, critical: 0.02, set: 'Asesinato', color: '#004953' },
    { name: 'Guantes de Noble', type: 'gloves', atk: 3, critical: 0.02, set: 'Noble', color: '#EAE0C8' },
    { name: 'Guantes de Mago', type: 'gloves', spd: 2, atk: 2, evasion: 0.01, set: 'Mago', color: '#FFFFFF' },
    { name: 'Guantes del Caos', type: 'gloves', atk: 3, critical: 0.03, set: 'Caos', color: '#800080' },

    // --- Botas (Boots) ---
    { name: 'Botas de Hierro', type: 'boots', spd: 3, set: 'Hierro', color: '#A9A9A9' },
    { name: 'Botas de Caballero', type: 'boots', spd: 2, def: 1, evasion: 0.01, set: 'Caballero', color: '#708090' },
    { name: 'Botas de Demonio', type: 'boots', spd: 3, atk: 1, set: 'Demonio', color: '#8B0000' },
    { name: 'Botas de León', type: 'boots', spd: 4, evasion: 0.01, set: 'León', color: '#A0522D' },
    { name: 'Botas de Asesinato', type: 'boots', spd: 4, evasion: 0.02, set: 'Asesinato', color: '#004953' },
    { name: 'Botas de Noble', type: 'boots', spd: 4, evasion: 0.02, set: 'Noble', color: '#EAE0C8' },
    { name: 'Botas de Mago', type: 'boots', spd: 6, atk: 3, set: 'Mago', color: '#FFFFFF' },
    { name: 'Botas del Caos', type: 'boots', atk: 3, def: 2, critical: 0.03, set: 'Caos', color: '#800080' },

    // --- Armas (Weapons) ---
    { name: 'Espada de Luz', type: 'weapon', atk: 3, spd: 1, attackSpeedBonus: 1, attackSpeed: 400, color: '#8B0000' },
    { name: 'Guadaña Helada', type: 'weapon', atk: 4, evasion: 0.01, attackSpeedBonus: 1, attackSpeed: 400, color: '#EAE0C8' },
    { name: 'Daga de Poder', type: 'weapon', atk: 4, spd: 1, critical: 0.01, attackSpeed: 400, color: '#004953' },
    { name: 'Arco del Bosque', type: 'weapon', atk: 5, critical: 0.01, attackSpeedBonus: 1, attackSpeed: 400, color: '#A0522D' },
    { name: 'Escudo Colosal', type: 'weapon', def: 5, evasion: 0.02, attackSpeed: 400, color: '#A9A9A9' },
    { name: 'Libro Celestial', type: 'weapon', atk: 4, spd: 2, attackSpeedBonus: 2, attackSpeed: 400, color: '#4169E1' },
    { name: 'Maza de Guerra', type: 'weapon', atk: 7, attackSpeedBonus: 1, attackSpeed: 400, color: '#B0C4DE' },
    { name: 'Rayo de Oscuridad', type: 'weapon', atk: 5, critical: 0.02, attackSpeedBonus: 1, attackSpeed: 400, color: '#004953' }
];

export const skills = [
    { key: 'stealth', name: 'Sigilo', type: 'active', effect: 'Durante 7s, eres imperceptible y tu velocidad de ataque es de 0.85 por segundo.' },
    { key: 'critical_hit', name: 'Golpe Crítico', type: 'active', effect: 'El siguiente golpe que asestes será un 100% más devastador.' },
    { key: 'teleportation', name: 'Teletransportación', type: 'active', effect: 'Desplázate instantáneamente a un punto seguro del mapa sin enemigos.' },
    { key: 'summon', name: 'Invocar', type: 'active', effect: 'Manifiesta un súbdito leal con el 75% de tus estadísticas.' },
    { key: 'regeneration', name: 'Regeneración', type: 'active', effect: 'Restaura el 75% de tu salud máxima al instante.' },
    { key: 'speed', name: 'Velocidad', type: 'active', effect: 'Incrementa tu velocidad de movimiento en un 50% durante 10 segundos.' },
    { key: 'invincible', name: 'Invencible', type: 'active', effect: 'Te vuelves inmune a todo daño durante 3.5 segundos.' },
    { key: 'ice_ray', name: 'Rayo de Hielo', type: 'active', effect: 'Congela a todos los enemigos cercanos durante 5 segundos.' },
    { key: 'luck', name: 'Suerte', type: 'active', effect: 'Aumenta tu probabilidad de asestar un golpe crítico en un 25% durante 10 segundos.' },
    { key: 'weakness', name: 'Debilidad', type: 'active', effect: 'Reduce la resistencia de los enemigos cercanos en un 20% durante 8 segundos.' },
    { key: 'blade_storm', name: 'Tormenta de Cuchillas', type: 'active', effect: 'Lanzas cuchillos en todas las direcciones. Daño: 50% del ataque base por cuchillo.' }, 
    { key: 'second_wind', name: 'Segundo Aliento', type: 'active', effect: 'Una vez por partida, si mueres, revives automáticamente con 25% de salud.' } 
];


export const setBonuses = {
    'Hierro': { def_percent: 0.10, message: "¡Bonificación de Conjunto de Hierro: +10% Defensa!" },
    'Caballero': { maxHp_percent: 0.10, message: "¡Bonificación de Conjunto de Caballero: +10% HP Máximo!" },
    'Demonio': { atk_percent: 0.15, message: "¡Bonificación de Conjunto de Demonio: +15% Ataque!" },
    'León': { atk_flat: 10, def_flat: 5, message: "¡Bonificación de Conjunto de León: +10 Ataque, +5 Defensa!" },
    'Asesinato': { spd_percent: 0.10, critical_flat: 0.05, message: "¡Bonificación de Conjunto de Asesinato: +10% Velocidad, +5% Crítico!" },
    'Noble': { goldFind_percent: 0.15, maxHp_flat: 5, message: "¡Bonificación de Conjunto Noble: +15% Oro Encontrado, +5 HP Máximo!" },
    'Mago': { xpGain_percent: 0.20, maxHp_percent: 0.10, message: "¡Bonificación de Conjunto de Mago: +20% XP, +10% HP Máximo!" },
    'Caos': { atk_percent: 0.20, spd_percent: 0.15, message: "¡Bonificación de Conjunto de Caos: +20% Ataque, +15% Velocidad!" }
};

export const equipmentSlotNames = {
    'helmet': 'Casco',
    'armor': 'Armadura',
    'gloves': 'Guantes',
    'boots': 'Botas',
    'weapon': 'Arma',
    'habilidad1': 'Habilidad 1',
    'habilidad2': 'Habilidad 2',
    'habilidad3': 'Habilidad 3'
};

export const equipmentSlotsOrder = ['helmet', 'armor', 'gloves', 'boots', 'weapon', 'habilidad1', 'habilidad2', 'habilidad3'];