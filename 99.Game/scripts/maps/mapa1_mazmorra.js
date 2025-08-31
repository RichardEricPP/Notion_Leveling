export const mapaMazmorra = {
    nombre: "Mazmorra de las Pruebas",
    maxFloors: 5,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    background: "https://picsum.photos/800/600?random=1",
    x: 10, y: 50,
    enemigos: [
        { tipo: 'duende', cantidad: { min: 6, max: 12 } },
        { tipo: 'lobo', cantidad: { min: 2, max: 5 } },
        { tipo: 'skeleton', cantidad: { min: 3, max: 6 } },
        { tipo: 'boss', cantidad: 1, dropsKey: true },
        { tipo: 'miniBoss', cantidad: 1, dropsKey: false }
    ],
    objetos: [
        { nombre: 'Poción de Vida Pequeña', probabilidad: 0.5, tipo: 'potion', heal: 25 },
        { nombre: 'Poción de Vida Mediana', probabilidad: 0.3, tipo: 'potion', heal: 50 },
        { nombre: 'Poción de Vida Grande', probabilidad: 0.2, tipo: 'potion', heal: 100 }
    ],
    musica: {
        menu: '../2.Music/98. System.mp3',
        boss: '../2.Music/99. Bozz.mp3',
        equipmentOpen: '../2.Music/98. System.mp3'
    },
    audioDungeon: [
        '../2.Music/1. - Solo LevelingSymphonicSuite Lv.1.mp3',
        '../2.Music/10. - [Solo-Leveling]SymphonicSuite-Lv.10.mp3',
        '../2.Music/2. - [Solo-Leveling]SymphonicSuite-Lv.2 - OST_AnimeOriginal.mp3',
        '../2.Music/3. - [Solo-Leveling]SymphonicSuite-Lv.3.mp3',
        '../2.Music/4. - [Solo-Leveling]SymphonicSuite-Lv.4.mp3',
        '../2.Music/5. - [Solo-Leveling]SymphonicSuite-Lv.5.mp3',
        '../2.Music/6. - [Solo-Leveling]SymphonicSuite-Lv.6 - OST_AnimeOriginal.mp3',
        '../2.Music/7. - [Solo-Leveling]SymphonicSuite-Lv.7 - OST_AnimeOriginal.mp3',
        '../2.Music/8. - [Solo-Leveling]SymphonicSuite-Lv.8.mp3',
        '../2.Music/9. - [Solo-Leveling]SymphonicSuite-Lv.9.mp3'
    ]
};