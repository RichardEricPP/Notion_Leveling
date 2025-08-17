export const mapaHormigas = {
    nombre: "Túnel de las Hormigas",
    maxFloors: 30,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    enemigos: [
        { tipo: 'hormiga_obrera', cantidad: { min: 20, max: 30 } },
        { tipo: 'hormiga_soldado', cantidad: { min: 10, max: 15 } },
        { tipo: 'reina_hormiga', cantidad: 1, dropsKey: true },
    ],
    objetos: [
        { nombre: 'Poción de Vida Pequeña', probabilidad: 0.5, tipo: 'potion', heal: 25 },
        { nombre: 'Poción de Vida Mediana', probabilidad: 0.5, tipo: 'potion', heal: 50 }
    ],
    musica: {
        menu: '../2.Music/98. System.mp3',
        boss: '../2.Music/99. Bozz.mp3',
        equipmentOpen: '../2.Music/98. System.mp3'
    },
    audioDungeon: [
        '../2.Music/7. - [Solo-Leveling]SymphonicSuite-Lv.7 - OST_AnimeOriginal.mp3',
    ]
};