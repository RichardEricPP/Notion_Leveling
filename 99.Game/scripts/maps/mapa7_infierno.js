export const mapaInfierno = {
    nombre: "Puertas del Infierno",
    maxFloors: 26,
    tileset: "assets/mapa_1.png",
    atlas: "assets/mapa_1.json",
    enemigos: [
        { tipo: 'diablillo', cantidad: { min: 10, max: 20 } },
        { tipo: 'perro_infernal', cantidad: { min: 5, max: 10 } },
        { tipo: 'demonio', cantidad: 1, dropsKey: true },
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
        '../2.Music/99. Bozz.mp3',
    ]
};