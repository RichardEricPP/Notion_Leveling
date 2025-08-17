export const mapaOgros = {
    nombre: "Fortaleza de los Ogros",
    maxFloors: 18,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    enemigos: [
        { tipo: 'ogro', cantidad: { min: 10, max: 15 } },
        { tipo: 'lobo', cantidad: { min: 5, max: 10 } },
        { tipo: 'rey_ogro', cantidad: 1, dropsKey: true },
    ],
    objetos: [
        { nombre: 'Poción de Vida Grande', probabilidad: 0.8, tipo: 'potion', heal: 100 },
        { nombre: 'Poción de Vida Mediana', probabilidad: 0.2, tipo: 'potion', heal: 50 }
    ],
    musica: {
        menu: '../2.Music/98. System.mp3',
        boss: '../2.Music/99. Bozz.mp3',
        equipmentOpen: '../2.Music/98. System.mp3'
    },
    audioDungeon: [
        '../2.Music/8. - [Solo-Leveling]SymphonicSuite-Lv.8.mp3',
    ]
};