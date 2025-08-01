export const gearList = [
    // Potions
    { name: 'Poción de Vida Pequeña', type: 'potion', heal: 25 },
    { name: 'Poción de Vida Mediana', type: 'potion', heal: 50 },
    { name: 'Poción de Vida Grande', type: 'potion', heal: 100 },
    // Gear
    { name: 'Casco de Hierro', type: 'helmet', def: 3, set: 'Hierro' },
    { name: 'Casco de Caballero', type: 'helmet', def: 5, spd: 2, set: 'Caballero' },
    { name: 'Casco de Demonio', type: 'helmet', def: 7, atk: 3, set: 'Demonio' },
    { name: 'Casco de León', type: 'helmet', def: 8, set: 'León' },
    { name: 'Casco de Asesinato', type: 'helmet', spd: 4, critical: 0.03, set: 'Asesinato' }, 
    { name: 'Casco Noble', type: 'helmet', def: 4, set: 'Noble' },
    { name: 'Casco de Mago', type: 'helmet', def: 3, set: 'Mago' },
    { name: 'Armadura de Hierro', type: 'armor', def: 6, set: 'Hierro' },
    { name: 'Armadura de Caballero', type: 'armor', def: 8, spd: 2, set: 'Caballero' },
    { name: 'Armadura de Demonio', type: 'armor', def: 10, atk: 4, set: 'Demonio' },
    { name: 'Armadura de León', type: 'armor', def: 9, set: 'León' },
    { name: 'Armadura de Asesinato', type: 'armor', spd: 6, critical: 0.04, set: 'Asesinato' }, 
    { name: 'Armadura Noble', type: 'armor', def: 7, set: 'Noble' },
    { name: 'Armadura de Mago', type: 'armor', def: 5, set: 'Mago' },
    { name: 'Guantes de Hierro', type: 'gloves', atk: 3, set: 'Hierro' },
    { name: 'Guantes de Caballero', type: 'gloves', atk: 4, def: 1, set: 'Caballero' },
    { name: 'Guantes de Demonio', type: 'gloves', atk: 6, spd: 2, set: 'Demonio' },
    { name: 'Guantes de León', type: 'gloves', atk: 5, set: 'León' },
    { name: 'Guantes de Asesinato', type: 'gloves', critical: 0.05, spd: 3, set: 'Asesinato' }, 
    { name: 'Guantes de Noble', type: 'gloves', atk: 3, set: 'Noble' },
    { name: 'Guantes de Mago', type: 'gloves', spd: 2, set: 'Mago' },
    { name: 'Botas de Hierro', type: 'boots', spd: 3, set: 'Hierro' },
    { name: 'Botas de Caballero', type: 'boots', spd: 5, def: 1, set: 'Caballero' },
    { name: 'Botas de Demonio', type: 'boots', spd: 7, atk: 2, set: 'Demonio' },
    { name: 'Botas de León', type: 'boots', spd: 8, set: 'León' },
    { name: 'Botas de Asesinato', type: 'boots', spd: 9, set: 'Asesinato' },
    { name: 'Botas de Noble', type: 'boots', spd: 4, set: 'Noble' },
    { name: 'Botas de Mago', type: 'boots', spd: 6, set: 'Mago' },
    { name: 'Escudo Colosal', type: 'weapon', def: 10, set: 'Hierro', attackSpeed: 250 }, 
    { name: 'Maza de Guerra', type: 'weapon', atk: 9, set: 'Caballero', attackSpeed: 250 },
    { name: 'Espada de Luz', type: 'weapon', atk: 7, spd: 3, set: 'Demonio', attackSpeed: 150 },
    { name: 'Libro Celestial', type: 'weapon', atk: 5, spd: 4, set: 'Mago', attackSpeed: 250 }, 
    { name: 'Rayo de Oscuridad', type: 'weapon', atk: 7, critical: 0.03, set: 'Asesinato', attackSpeed: 250 }, 
    { name: 'Daga de Poder', type: 'weapon', atk: 6, spd: 4, set: 'Asesinato', attackSpeed: 800 },
    { name: 'Arco del Bosque', type: 'weapon', atk: 6, critical: 0.04, set: 'León', attackSpeed: 250 }, 
    { name: 'Guadaña Helada', type: 'weapon', atk: 8, set: 'Noble', attackSpeed: 250 },
];

export const skills = [
    { name: 'Sigilo', type: 'active', effect: 'Te vuelves uno con las sombras, imperceptible para los monstruos durante 10 segundos.', cooldown: 15000 },
    { name: 'Golpe Crítico', type: 'active', effect: 'El siguiente golpe que asestes será un 100% más devastador.', cooldown: 5000 },
    { name: 'Teletransportación', type: 'active', effect: 'Desplázate instantáneamente a un punto seguro del mapa sin enemigos.', cooldown: 10000 },
    { name: 'Invocar', type: 'active', effect: 'Manifiesta un súbdito leal con el 75% de tus estadísticas.', cooldown: 20000 },
    { name: 'Regeneración', type: 'active', effect: 'Restaura el 75% de tu salud máxima al instante.', cooldown: 10000 },
    { name: 'Velocidad', type: 'active', effect: 'Incrementa tu velocidad de movimiento en un 25% durante 10 segundos.', cooldown: 8000 },
    { name: 'Invencible', type: 'active', effect: 'Te vuelves inmune a todo daño durante 4 segundos.', cooldown: 25000 },
    { name: 'Rayo de Hielo', type: 'active', effect: 'Congela a todos los enemigos cercanos durante 5 segundos.', cooldown: 12000 },
    { name: 'Suerte', type: 'active', effect: 'Aumenta tu probabilidad de asestar un golpe crítico en un 25% durante 10 segundos.', cooldown: 15000 },
    { name: 'Debilidad', type: 'active', effect: 'Reduce la resistencia de los enemigos cercanos en un 25% durante 8 segundos.', cooldown: 10000 },
    { name: 'Tormenta de Cuchillas', type: 'active', effect: 'Lanzas cuchillos en todas las direcciones. Daño: 50% del ataque base por cuchillo.', cooldown: 0 }, 
    { name: 'Segundo Aliento', type: 'passive', effect: 'Una vez por partida, si mueres, revives automáticamente con 25% de salud.', cooldown: 0 } 
];


export const setBonuses = {
    'Hierro': { def_percent: 0.10, message: "¡Bonificación de Conjunto de Hierro: +10% Defensa!" },
    'Caballero': { maxHp_percent: 0.10, message: "¡Bonificación de Conjunto de Caballero: +10% HP Máximo!" },
    'Demonio': { atk_percent: 0.15, message: "¡Bonificación de Conjunto de Demonio: +15% Ataque!" },
    'León': { atk_flat: 10, def_flat: 5, message: "¡Bonificación de Conjunto de León: +10 Ataque, +5 Defensa!" },
    'Asesinato': { spd_percent: 0.10, critical_flat: 0.05, message: "¡Bonificación de Conjunto de Asesinato: +10% Velocidad, +5% Crítico!" },
    'Noble': { goldFind_percent: 0.15, maxHp_flat: 5, message: "¡Bonificación de Conjunto Noble: +15% Oro Encontrado, +5 HP Máximo!" },
    'Mago': { xpGain_percent: 0.20, maxHp_percent: 0.10, message: "¡Bonificación de Conjunto de Mago: +20% XP, +10% HP Máximo!" }
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