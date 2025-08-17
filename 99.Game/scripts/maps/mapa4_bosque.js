export const mapaBosque = {
    nombre: "Bosque de los Elfos Oscuros",
    maxFloors: 14,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    enemigos: [
        { tipo: 'duende', cantidad: { min: 10, max: 20 } },
        { tipo: 'lobo', cantidad: { min: 5, max: 10 } },
        { tipo: 'treant', cantidad: 1, dropsKey: true },
    ],
    objetos: [
        { nombre: 'Poción de Vida Pequeña', probabilidad: 0.7, tipo: 'potion', heal: 25 },
        { nombre: 'Poción de Vida Mediana', probabilidad: 0.3, tipo: 'potion', heal: 50 }
    ],
    musica: {
        menu: '../2.Music/98. System.mp3',
        boss: '../2.Music/99. Bozz.mp3',
        equipmentOpen: '../2.Music/98. System.mp3'
    },
    audioDungeon: [
        '../2.Music/1. - Solo LevelingSymphonicSuite Lv.1.mp3',
    ]
};