export const mapaCueva = {
    nombre: "Cueva de los Goblins",
    maxFloors: 7,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    background: "https://picsum.photos/800/600?random=2",
    x: 20, y: 50,
    enemigos: [
        { tipo: 'lobo', cantidad: { min: 8, max: 15 } },
        { tipo: 'spiderling', cantidad: { min: 5, max: 10 } },
        { tipo: 'finalBoss', cantidad: 1, dropsKey: true },
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
        '../2.Music/7. - [Solo-Leveling]SymphonicSuite-Lv.7 - OST_AnimeOriginal.mp3',
        '../2.Music/8. - [Solo-Leveling]SymphonicSuite-Lv.8.mp3',
    ]
};