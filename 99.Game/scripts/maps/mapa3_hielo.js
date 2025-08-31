export const mapaHielo = {
    nombre: "Caverna Helada",
    maxFloors: 10,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    background: "https://picsum.photos/800/600?random=3",
    x: 30, y: 50,
    enemigos: [
        { tipo: 'skeleton', cantidad: { min: 8, max: 15 } },
        { tipo: 'lobo_hielo', cantidad: { min: 5, max: 10 } },
        { tipo: 'yeti', cantidad: 1, dropsKey: false },
        { tipo: 'golem_hielo', cantidad: 1, dropsKey: true },
    ],
    objetos: [
        { nombre: 'Poción de Vida Mediana', probabilidad: 0.6, tipo: 'potion', heal: 50 },
        { nombre: 'Poción de Vida Grande', probabilidad: 0.4, tipo: 'potion', heal: 100 }
    ],
    musica: {
        menu: '../2.Music/98. System.mp3',
        boss: '../2.Music/99. Bozz.mp3',
        equipmentOpen: '../2.Music/98. System.mp3'
    },
    audioDungeon: [
        '../2.Music/6. - [Solo-Leveling]SymphonicSuite-Lv.6 - OST_AnimeOriginal.mp3',
    ]
};