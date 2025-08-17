export const mapaArquitecto = {
    nombre: "Trono del Arquitecto",
    maxFloors: 50,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    enemigos: [
        { tipo: 'constructor', cantidad: { min: 10, max: 20 } },
        { tipo: 'golem', cantidad: { min: 5, max: 10 } },
        { tipo: 'el_arquitecto', cantidad: 1, dropsKey: true },
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
        '../2.Music/98. System.mp3',
    ]
};