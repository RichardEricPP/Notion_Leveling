export const mapaDesierto = {
    nombre: "Desierto de las Sombras",
    maxFloors: 22,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    background: "https://picsum.photos/800/600?random=6",
    x: 60, y: 50,
    enemigos: [
        { tipo: 'skeleton', cantidad: { min: 15, max: 25 } },
        { tipo: 'gusano_arena', cantidad: { min: 3, max: 6 } },
        { tipo: 'rey_gusano', cantidad: 1, dropsKey: true },
    ],
    objetos: [
        { nombre: 'Poción de Vida Mediana', probabilidad: 0.5, tipo: 'potion', heal: 50 },
        { nombre: 'Poción de Vida Grande', probabilidad: 0.5, tipo: 'potion', heal: 100 }
    ],
    musica: {
        menu: '../2.Music/98. System.mp3',
        boss: '../2.Music/99. Bozz.mp3',
        equipmentOpen: '../2.Music/98. System.mp3'
    },
    audioDungeon: [
        '../2.Music/9. - [Solo-Leveling]SymphonicSuite-Lv.9.mp3',
    ]
};