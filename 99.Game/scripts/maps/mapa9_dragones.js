export const mapaDragones = {
    nombre: "Nido de Dragones",
    maxFloors: 35,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    background: "https://picsum.photos/800/600?random=9",
    x: 90, y: 50,
    enemigos: [
        { tipo: 'caballero', cantidad: { min: 10, max: 15 } },
        { tipo: 'dragon_joven', cantidad: { min: 3, max: 5 } },
        { tipo: 'dragon_anciano', cantidad: 1, dropsKey: true },
    ],
    objetos: [
        { nombre: 'Poción de Vida Grande', probabilidad: 1.0, tipo: 'potion', heal: 100 }
    ],
    musica: {
        menu: '../2.Music/99. Bozz.mp3',
        boss: '../2.Music/99. Bozz.mp3',
        equipmentOpen: '../2.Music/98. System.mp3'
    },
    audioDungeon: [
        '../2.Music/10. - [Solo-Leveling]SymphonicSuite-Lv.10.mp3',
    ]
};