const character = {
    name: "Héroe Anónimo",
    level: 1,
    health: 100,
    attack: 10,
    defense: 5,
    equipped: {
        helmet: "iron_helmet",
        armor: "iron_armor",
        gloves: "iron_gloves",
        boots: "iron_boots",
        weapon: "light_sword"
    },
    selectedSkills: []
};

const setBonuses = {
    'Hierro': { def_percent: 0.05, message: "¡Bonificación de Conjunto de Hierro: +5% Defensa!" },
    'Caballero': { maxHp_percent: 0.05, message: "¡Bonificación de Conjunto de Caballero: +5% HP Máximo!" },
    'Demonio': { atk_percent: 0.07, message: "¡Bonificación de Conjunto de Demonio: +7% Ataque!" },
    'León': { def_percent: 0.05, evasion_flat: 0.02, message: "¡Bonificación de Conjunto de León: +5% Defensa, +2% Evasión!" },
    'Asesinato': { critical_flat: 0.03, evasion_flat: 0.05, message: "¡Bonificación de Conjunto de Asesinato: +3% Crítico, +5% Evasión!" },
    'Noble': { maxHp_flat: 5, evasion_flat: 0.05, message: "¡Bonificación de Conjunto Noble: +5 HP Máximo, +5% Evasión!" },
    'Mago': { xpGain_percent: 0.10, maxHp_percent: 0.05, atkSpd_percent: 0.03, message: "¡Bonificación de Conjunto de Mago: +10% XP, +5% HP Máximo, +3% Velocidad de Ataque!" },
    'Caos': { atk_percent: 0.02, spd_percent: 0.05, critical_flat: 0.03, message: "¡Bonificación de Conjunto de Caos: +2% Ataque, +5% Velocidad, +3% Crítico!" }
};

const setPrefixToNameMap = {
    'iron': 'Hierro',
    'knight': 'Caballero',
    'demon': 'Demonio',
    'lion': 'León',
    'assassination': 'Asesinato',
    'noble': 'Noble',
    'mage': 'Mago',
    'chaos': 'Caos'
};

const items = {
    helmet: {
        none: { src: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", text: "Sin Casco", icon: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", description: "" },
        iron_helmet: { src: "https://images4.imagebam.com/de/34/f4/ME13HPW6_o.png", text: "Casco de Hierro", icon: "https://images4.imagebam.com/de/34/f4/ME13HPW6_o.png", description: "+3 Defensa" },
        knight_helmet: { src: "https://images4.imagebam.com/6a/d9/a9/ME13I0DH_o.png", text: "Casco de Caballero", icon: "https://images4.imagebam.com/6a/d9/a9/ME13I0DH_o.png", description: "+1 Velocidad, <br> +3 Defensa" },
        demon_helmet: { src: "https://images4.imagebam.com/f6/3b/ef/ME13I0KE_o.png", text: "Casco de Demonio", icon: "https://images4.imagebam.com/f6/3b/ef/ME13I0KE_o.png", description: "+1 Vel. de Ataque, <br> +1 Ataque, <br> +3 Defensa" },
        lion_helmet: { src: "https://images4.imagebam.com/b2/83/86/ME13I0UX_o.png", text: "Casco de León", icon: "https://images4.imagebam.com/b2/83/86/ME13I0UX_o.png", description: "+5 Defensa, <br> +1 Evasión" },
        assassination_helmet: { src: "https://images4.imagebam.com/ad/d7/7b/ME13I0V3_o.png", text: "Casco de Asesinato", icon: "https://images4.imagebam.com/ad/d7/7b/ME13I0V3_o.png", description: "+2 Velocidad, <br> +2 Crítico, <br> +1 Evasión" },
        noble_helmet: { src: "https://images4.imagebam.com/a1/b6/79/ME13I0V9_o.png", text: "Casco de Noble", icon: "https://images4.imagebam.com/a1/b6/79/ME13I0V9_o.png", description: "+3 Defensa, <br> +2 Evasión" },
        mage_helmet: { src: "https://images4.imagebam.com/00/b1/f6/ME13I0VF_o.png", text: "Casco de Mago", icon: "https://images4.imagebam.com/00/b1/f6/ME13I0VF_o.png", description: "+2 Ataque, <br> +4 Defensa" },
        chaos_helmet: { src: "https://images4.imagebam.com/8f/9e/3b/ME14R47M_o.png", text: "Casco del Caos", icon: "https://images4.imagebam.com/8f/9e/3b/ME14R47M_o.png", description: "+4 Defensa, <br> +3 Crítico" }
    },
    armor: {
        none: { src: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", text: "Sin Armadura", icon: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", description: "" },
        iron_armor: { src: "https://images4.imagebam.com/6b/9a/7f/ME13HTTA_o.png", text: "Armadura de Hierro", icon: "https://images4.imagebam.com/6b/9a/7f/ME13HTTA_o.png", description: "+6 Defensa" },
        knight_armor: { src: "https://images4.imagebam.com/eb/b9/a2/ME13I0DG_o.png", text: "Armadura de Caballero", icon: "https://images4.imagebam.com/eb/b9/a2/ME13I0DG_o.png", description: "+1 Velocidad, <br> +4 Defensa, <br> +1 Evasión" },
        demon_armor: { src: "https://images4.imagebam.com/71/32/e7/ME13I0KH_o.png", text: "Armadura de Demonio", icon: "https://images4.imagebam.com/71/32/e7/ME13I0KH_o.png", description: "+1 Vel. de Ataque, <br> +2 Ataque, <br> +3 Defensa" },
        lion_armor: { src: "https://images4.imagebam.com/11/ea/74/ME13I0UY_o.png", text: "Armadura de León", icon: "https://images4.imagebam.com/11/ea/74/ME13I0UY_o.png", description: "+4 Defensa, <br> +1 Evasión" },
        assassination_armor: { src: "https://images4.imagebam.com/98/18/8c/ME13I0V4_o.png", text: "Armadura de Asesinato", icon: "https://images4.imagebam.com/98/18/8c/ME13I0V4_o.png", description: "+2 Velocidad, <br> +2 Crítico, <br> +2 Evasión" },
        noble_armor: { src: "https://images4.imagebam.com/50/8e/7b/ME13I0VA_o.png", text: "Armadura de Noble", icon: "https://images4.imagebam.com/50/8e/7b/ME13I0VA_o.png", description: "+7 Defensa, <br> +3 Evasión" },
        mage_armor: { src: "https://images4.imagebam.com/38/46/40/ME13I0VG_o.png", text: "Armadura de Mago", icon: "https://images4.imagebam.com/38/46/40/ME13I0VG_o.png", description: "+3 Ataque, <br> +3 Defensa, <br> +2 Evasión" },
        chaos_armor: { src: "https://images4.imagebam.com/42/d7/c5/ME14R47L_o.png", text: "Armadura del Caos", icon: "https://images4.imagebam.com/42/d7/c5/ME14R47L_o.png", description: "+2 Vel. de Ataque, <br> +4 Ataque, <br> +3 Defensa" }
    },
    gloves: {
        none: { src: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", text: "Sin Guantes", icon: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", description: "" },
        iron_gloves: { src: "https://images4.imagebam.com/2e/ca/1f/ME13HTQA_o.png", text: "Guantes de Hierro", icon: "https://images4.imagebam.com/2e/ca/1f/ME13HTQA_o.png", description: "+3 Ataque" },
        knight_gloves: { src: "https://images4.imagebam.com/cc/c5/5e/ME13I0DI_o.png", text: "Guantes de Caballero", icon: "https://images4.imagebam.com/cc/c5/5e/ME13I0DI_o.png", description: "+1 Vel. de Ataque, <br> +2 Ataque, <br> +1 Defensa" },
        demon_gloves: { src: "https://images4.imagebam.com/52/eb/91/ME13I0KJ_o.png", text: "Guantes de Demonio", icon: "https://images4.imagebam.com/52/eb/91/ME13I0KJ_o.png", description: "+1 Velocidad, <br> +1 Vel. de Ataque, <br> +3 Ataque" },
        lion_gloves: { src: "https://images4.imagebam.com/28/54/49/ME13I0V0_o.png", text: "Guantes de León", icon: "https://images4.imagebam.com/28/54/49/ME13I0V0_o.png", description: "+1 Vel. de Ataque, <br> +5 Ataque" },
        assassination_gloves: { src: "https://images4.imagebam.com/a3/a6/35/ME13I0V7_o.png", text: "Guantes de Asesinato", icon: "https://images4.imagebam.com/a3/a6/35/ME13I0V7_o.png", description: "+2 Vel. de Ataque, <br> +3 Ataque, <br> +2 Crítico" },
        noble_gloves: { src: "https://images4.imagebam.com/ca/68/8b/ME13I0VD_o.png", text: "Guantes de Noble", icon: "https://images4.imagebam.com/ca/68/8b/ME13I0VD_o.png", description: "+3 Ataque, <br> +2 Crítico" },
        mage_gloves: { src: "https://images4.imagebam.com/2c/29/01/ME13I0VH_o.png", text: "Guantes de Mago", icon: "https://images4.imagebam.com/2c/29/01/ME13I0VH_o.png", description: "+2 Velocidad, <br> +2 Ataque, <br> +1 Evasión" },
        chaos_gloves: { src: "https://images4.imagebam.com/6a/24/b3/ME14R47K_o.png", text: "Guantes del Caos", icon: "https://images4.imagebam.com/6a/24/b3/ME14R47K_o.png", description: "+3 Ataque, <br> +3 Crítico" }
    },
    boots: {
        none: { src: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", text: "Sin Botas", icon: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", description: "" },
        iron_boots: { src: "https://images4.imagebam.com/37/09/04/ME13HTNB_o.png", text: "Botas de Hierro", icon: "https://images4.imagebam.com/37/09/04/ME13HTNB_o.png", description: "+3 Velocidad" },
        knight_boots: { src: "https://images4.imagebam.com/39/47/40/ME13I0DF_o.png", text: "Botas de Caballero", icon: "https://images4.imagebam.com/39/47/40/ME13I0DF_o.png", description: "+2 Velocidad, <br> +1 Defensa, <br> +1 Evasión" },
        demon_boots: { src: "https://images4.imagebam.com/cb/f1/65/ME13I0KL_o.png", text: "Botas de Demonio", icon: "https://images4.imagebam.com/cb/f1/65/ME13I0KL_o.png", description: "+3 Velocidad, <br> +1 Ataque" },
        lion_boots: { src: "https://images4.imagebam.com/91/fd/2b/ME13I0V1_o.png", text: "Botas de León", icon: "https://images4.imagebam.com/91/fd/2b/ME13I0V1_o.png", description: "+4 Velocidad, <br> +1 Evasión" },
        assassination_boots: { src: "https://images4.imagebam.com/14/2c/da/ME13I0V8_o.png", text: "Botas de Asesinato", icon: "https://images4.imagebam.com/14/2c/da/ME13I0V8_o.png", description: "+4 Velocidad, <br> +2 Evasión" },
        noble_boots: { src: "https://images4.imagebam.com/4b/e5/f8/ME13I0VE_o.png", text: "Botas de Noble", icon: "https://images4.imagebam.com/4b/e5/f8/ME13I0VE_o.png", description: "+4 Velocidad, <br> +2 Evasión" },
        mage_boots: { src: "https://images4.imagebam.com/2b/b5/d3/ME13I0VI_o.png", text: "Botas de Mago", icon: "https://images4.imagebam.com/2b/b5/d3/ME13I0VI_o.png", description: "+6 Velocidad, <br> +3 Ataque" },
        chaos_boots: { src: "https://images4.imagebam.com/e2/0e/57/ME14R47J_o.png", text: "Botas del Caos", icon: "https://images4.imagebam.com/e2/0e/57/ME14R47J_o.png", description: "+3 Ataque, <br> +2 Defensa, <br> +3 Crítico" }
    },
    weapon: {
        none: { src: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", text: "Sin Arma", icon: "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png", description: "", lore: "" },
        light_sword: { src: "https://images4.imagebam.com/ca/a7/f7/ME13I1SR_o.png", text: "Espada de Luz", icon: "https://images4.imagebam.com/ca/a7/f7/ME13I1SR_o.png", description: "+3 Ataque, <br> +1 Velocidad, <br> +1 Vel. de Ataque", lore: "Una hoja que brilla con la luz del alba, rápida y certera." },
        frozen_scythe: { src: "https://images4.imagebam.com/f0/da/a7/ME13I1SW_o.png", text: "Guadaña Helada", icon: "https://images4.imagebam.com/f0/da/a7/ME13I1SW_o.png", description: "+4 Ataque, <br> +1 Vel. de Ataque, <br> +1 Evasión", lore: "Forjada en el corazón de un glaciar, cada corte congela el alma del enemigo." },
        power_dagger: { src: "https://images4.imagebam.com/61/cc/e7/ME13I1SU_o.png", text: "Daga de Poder", icon: "https://images4.imagebam.com/61/cc/e7/ME13I1SU_o.png", description: "+4 Ataque, <br> +1 Velocidad, <br> +1 Crítico", lore: "Pequeña pero letal, busca los puntos débiles con una precisión mortal." },
        forest_bow: { src: "https://images4.imagebam.com/b9/79/dc/ME13I1SV_o.png", text: "Arco del Bosque", icon: "https://images4.imagebam.com/b9/79/dc/ME13I1SV_o.png", description: "+5 Ataque, <br> +1 Crítico, <br> +1 Vel. de Ataque", lore: "Hecho de la madera de un árbol milenario, sus flechas nunca yerran el blanco." },
        colossal_shield: { src: "https://images4.imagebam.com/91/32/4f/ME13I1SP_o.png", text: "Escudo Colosal", icon: "https://images4.imagebam.com/91/32/4f/ME13I1SP_o.png", description: "+5 Defensa, <br> +2 Evasión", lore: "Un muro inamovible que protege de los golpes más devastadores." },
        celestial_book: { src: "https://images4.imagebam.com/cd/bf/f2/ME13I1SS_o.png", text: "Libro Celestial", icon: "https://images4.imagebam.com/cd/bf/f2/ME13I1SS_o.png", description: "+4 Ataque, <br> +2 Velocidad, <br> +2 Vel. de Ataque", lore: "Contiene hechizos arcanos que desatan el poder de las estrellas." },
        war_mace: { src: "https://images4.imagebam.com/ae/e5/90/ME13I1SQ_o.png", text: "Maza de Guerra", icon: "https://images4.imagebam.com/ae/e5/90/ME13I1SQ_o.png", description: "+7 Ataque, <br> +1 Vel. de Ataque", lore: "Pesada y contundente, aplasta armaduras y huesos por igual." },
        darkness_ray: { src: "https://images4.imagebam.com/74/c2/3a/ME13I1ST_o.png", text: "Rayo de Oscuridad", icon: "https://images4.imagebam.com/74/c2/3a/ME13I1ST_o.png", description: "+5 Ataque, <br> +2 Crítico, <br> +1 Vel. de Ataque", lore: "Un fragmento de la noche misma, corrompe todo lo que toca." }
    },
    skills: {
        stealth: { src: "https://images4.imagebam.com/b5/e0/51/ME13J7QB_o.png", text: "Sigilo", icon: "https://images4.imagebam.com/b5/e0/51/ME13J7QB_o.png", description: "Te vuelves uno con las sombras, imperceptible para los monstruos durante 7 segundos." },
        critical_hit: { src: "https://images4.imagebam.com/8e/e4/d7/ME13J7QC_o.png", text: "Golpe Crítico", icon: "https://images4.imagebam.com/8e/e4/d7/ME13J7QC_o.png", description: "El siguiente golpe que asestes será un 100% más devastador." },
        teleportation: { src: "https://images4.imagebam.com/9d/ef/8f/ME13J7QD_o.png", text: "Teletransportación", icon: "https://images4.imagebam.com/9d/ef/8f/ME13J7QD_o.png", description: "Desplázate instantáneamente a un punto seguro del mapa sin enemigos." },
        summon: { src: "https://images4.imagebam.com/84/38/a5/ME13J7QF_o.png", text: "Invocar", icon: "https://images4.imagebam.com/84/38/a5/ME13J7QF_o.png", description: "Manifiesta un súbdito leal con el 75% de tus estadísticas." },
        ice_ray: { src: "https://images4.imagebam.com/ea/39/04/ME13J7QK_o.png", text: "Rayo de Hielo", icon: "https://images4.imagebam.com/ea/39/04/ME13J7QK_o.png", description: "Congela a todos los enemigos cercanos durante 5 segundos." },
        regeneration: { src: "https://images4.imagebam.com/07/7b/1b/ME13J7QG_o.png", text: "Regeneración", icon: "https://images4.imagebam.com/07/7b/1b/ME13J7QG_o.png", description: "Restaura el 75% de tu salud máxima al instante." },
        speed: { src: "https://images4.imagebam.com/b4/77/6f/ME13J7QH_o.png", text: "Velocidad", icon: "https://images4.imagebam.com/b4/77/6f/ME13J7QH_o.png", description: "Incrementa tu velocidad de movimiento en un 25% durante 10 segundos." },
        invincible: { src: "https://images4.imagebam.com/6d/5d/02/ME13J7QJ_o.png", text: "Invencible", icon: "https://images4.imagebam.com/6d/5d/02/ME13J7QJ_o.png", description: "Te vuelves inmune a todo daño durante 4 segundos." },
        weakness: { src: "https://images4.imagebam.com/c3/e7/67/ME13J7QM_o.png", text: "Debilidad", icon: "https://images4.imagebam.com/c3/e7/67/ME13J7QM_o.png", description: "Reduce la resistencia de los enemigos cercanos en un 25% durante 8 segundos." },
        blade_storm: { src: "https://images4.imagebam.com/44/a4/49/ME13J7QO_o.png", text: "Tormenta de Cuchillas", icon: "https://images4.imagebam.com/44/a4/49/ME13J7QO_o.png", description: "Lanzas cuchillos en todas las direcciones. Daño: 50% del ataque base por cuchillo." },
        luck: { src: "https://images4.imagebam.com/cc/45/2c/ME13J7QL_o.png", text: "Suerte", icon: "https://images4.imagebam.com/cc/45/2c/ME13J7QL_o.png", description: "Aumenta tu probabilidad de asestar un golpe crítico en un 25% durante 10 segundos." },
        second_wind: { src: "https://images4.imagebam.com/e7/9b/a4/ME13J7QP_o.png", text: "Segundo Aliento", icon: "https://images4.imagebam.com/e7/9b/a4/ME13J7QP_o.png", description: "Una vez por partida, si mueres, revives automáticamente con 25% de salud." }
    }
};

function createEquipoHTML(onBack, onSave) {
    const container = document.createElement('div');
    container.className = "container mx-auto bg-gray-700 p-8 rounded-2xl shadow-2xl max-w-6xl w-full border border-gray-600";
    container.innerHTML = `
        <h1 class="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
            Equipación
        </h1>

        <div class="flex flex-col md:flex-row justify-center items-start gap-8 mb-10">

            <!-- Left Equipped Items Column -->
            <div id="equipped-left-column" class="flex flex-col gap-6 p-4 bg-gray-800 rounded-2xl shadow-inner border border-gray-600 w-full md:w-1/4 items-center">
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Casco</span>
                    <img id="equippedHelmetIcon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Casco" class="w-24 h-24 rounded-lg object-contain">
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Armadura</span>
                    <img id="equippedArmorIcon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Armadura" class="w-24 h-24 rounded-lg object-contain">
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Guantes</span>
                    <img id="equippedGlovesIcon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Guantes" class="w-24 h-24 rounded-lg object-contain">
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Botas</span>
                    <img id="equippedBootsIcon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Botas" class="w-24 h-24 rounded-lg object-contain">
                </div>
            </div>

            <!-- Character Display Area (Middle) -->
            <div class="flex flex-col items-center w-full md:w-1/2">
                <div class="bg-gray-800 p-6 rounded-2xl flex items-center justify-center relative shadow-inner border border-gray-600 overflow-hidden w-full max-w-sm" style="min-height: 400px;">
                    <!-- Base Character Image -->
                    <img id="characterBase" src="https://images4.imagebam.com/48/06/a5/ME13HPUO_o.png" alt="Base del Personaje" class="character-layer z-10">
                </div>
                <!-- Action Buttons -->
                <div class="mt-6 w-full max-w-sm flex justify-between gap-4">
                    <button id="backButton" class="w-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75">
                        Regresar
                    </button>
                    <button id="saveButton" class="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                        Guardar
                    </button>
                </div>
                <!-- Set Bonus Display Area -->
                <div id="setBonusDisplay" class="mt-4 p-3 text-center text-lg font-semibold text-cyan-300 bg-gray-800 rounded-lg w-full max-w-sm min-h-[50px] flex items-center justify-center border border-cyan-500/50 shadow-lg">
                    <!-- El mensaje de bonificación aparecerá aquí -->
                </div>
            </div>

            <!-- Right Equipped Items and Skills Column -->
            <div id="equipped-right-column" class="flex flex-col gap-6 p-4 bg-gray-800 rounded-2xl shadow-inner border border-gray-600 w-full md:w-1/4 items-center">
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Arma</span>
                    <img id="equippedWeaponIcon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Arma" class="w-24 h-24 rounded-lg object-contain">
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Habilidad 1</span>
                    <img id="equippedSkill1Icon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Habilidad 1" class="w-24 h-24 rounded-lg object-contain">
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Habilidad 2</span>
                    <img id="equippedSkill2Icon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Habilidad 2" class="w-24 h-24 rounded-lg object-contain">
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-sm text-blue-200 mb-1">Habilidad 3</span>
                    <img id="equippedSkill3Icon" src="https://images4.imagebam.com/39/36/7b/ME13I00A_o.png" alt="Icono de Habilidad 3" class="w-24 h-24 rounded-lg object-contain">
                </div>
            </div>
        </div>

        <!-- Inventory/Equipment Controls (Below Character) -->
        <div class="bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-600">
            <div class="flex flex-col gap-8">
                <!-- Helmet Section -->
                <div class="bg-gray-700 p-6 rounded-2xl shadow-inner border border-gray-600 w-full">
                    <h3 class="text-xl font-semibold mb-4 text-blue-300 text-center">Cascos</h3>
                    <div id="helmet-buttons" class="grid grid-cols-4 gap-4 justify-items-center">
                    </div>
                </div>

                <!-- Armor Section -->
                <div class="bg-gray-700 p-6 rounded-2xl shadow-inner border border-gray-600 w-full">
                    <h3 class="text-xl font-semibold mb-4 text-blue-300 text-center">Armaduras</h3>
                    <div id="armor-buttons" class="grid grid-cols-4 gap-4 justify-items-center">
                    </div>
                </div>

                <!-- Gloves Section -->
                <div class="bg-gray-700 p-6 rounded-2xl shadow-inner border border-gray-600 w-full">
                    <h3 class="text-xl font-semibold mb-4 text-blue-300 text-center">Guantes</h3>
                    <div id="gloves-buttons" class="grid grid-cols-4 gap-4 justify-items-center">
                    </div>
                </div>

                <!-- Boots Section -->
                <div class="bg-gray-700 p-6 rounded-2xl shadow-inner border border-gray-600 w-full">
                    <h3 class="text-xl font-semibold mb-4 text-blue-300 text-center">Botas</h3>
                    <div id="boots-buttons" class="grid grid-cols-4 gap-4 justify-items-center">
                    </div>
                </div>

                <!-- Weapon Section -->
                <div class="bg-gray-700 p-6 rounded-2xl shadow-inner border border-gray-600 w-full">
                    <h3 class="text-xl font-semibold mb-4 text-blue-300 text-center">Armas</h3>
                    <div id="weapon-buttons" class="grid grid-cols-4 gap-4 justify-items-center">
                    </div>
                </div>

                <!-- Skills Section -->
                <div class="bg-gray-700 p-6 rounded-2xl shadow-inner border border-gray-600 w-full">
                    <h3 class="text-xl font-semibold mb-4 text-blue-300 text-center">Habilidades</h3>
                    <div id="skills-buttons" class="grid grid-cols-4 gap-4 justify-items-center">
                    </div>
                </div>
            </div>
        </div>
    `;

    const messageBox = document.createElement('div');
    messageBox.id = "messageBox";
    messageBox.className = "fixed bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300 ease-in-out transform scale-0 opacity-0";
    messageBox.textContent = "¡Item equipado!";
    container.appendChild(messageBox);

    function createButton(item, slot) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = "flex flex-col items-center";

        const button = document.createElement('button');
        button.className = "item-button card-container";
        button.dataset.slot = slot;
        button.dataset.item = item;
        button.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${items[slot][item].icon}" alt="" class="w-20 h-20 rounded-lg object-contain">
                </div>
                <div class="card-back">
                    <p class="text-xs text-center p-1">${items[slot][item].description}</p>
                </div>
            </div>
        `;

        const span = document.createElement('span');
        span.className = "text-sm text-center mt-2 text-white";
        span.textContent = items[slot][item].text;

        buttonWrapper.appendChild(button);
        buttonWrapper.appendChild(span);

        return buttonWrapper;
    }

    const slots = ['helmet', 'armor', 'gloves', 'boots', 'weapon', 'skills'];
    slots.forEach(slot => {
        const buttonsContainer = container.querySelector(`#${slot}-buttons`);
        if (buttonsContainer) {
            for (const item in items[slot]) {
                if (item !== 'none') {
                    const button = createButton(item, slot);
                    buttonsContainer.appendChild(button);
                }
            }
        }
    });

    const equippedHelmetIcon = container.querySelector('#equippedHelmetIcon');
    const equippedArmorIcon = container.querySelector('#equippedArmorIcon');
    const equippedGlovesIcon = container.querySelector('#equippedGlovesIcon');
    const equippedBootsIcon = container.querySelector('#equippedBootsIcon');
    const equippedWeaponIcon = container.querySelector('#equippedWeaponIcon');
    const equippedSkill1Icon = container.querySelector('#equippedSkill1Icon');
    const equippedSkill2Icon = container.querySelector('#equippedSkill2Icon');
    const equippedSkill3Icon = container.querySelector('#equippedSkill3Icon');
    const skillIconElements = [equippedSkill1Icon, equippedSkill2Icon, equippedSkill3Icon];
    const itemButtons = container.querySelectorAll('.item-button');
    const backButton = container.querySelector('#backButton');
    const saveButton = container.querySelector('#saveButton');
    const emptyIconUrl = "https://images4.imagebam.com/39/36/7b/ME13I00A_o.png";
    const setBonusDisplay = container.querySelector('#setBonusDisplay');

    function checkAndApplySetBonus() {
        const eq = character.equipped;
        
        if (eq.helmet === 'none' || eq.armor === 'none' || eq.gloves === 'none' || eq.boots === 'none') {
            setBonusDisplay.textContent = "";
            return;
        }

        const helmetSet = eq.helmet.split('_')[0];
        const armorSet = eq.armor.split('_')[0];
        const glovesSet = eq.gloves.split('_')[0];
        const bootsSet = eq.boots.split('_')[0];

        if (helmetSet && helmetSet === armorSet && helmetSet === glovesSet && helmetSet === bootsSet) {
            const setName = setPrefixToNameMap[helmetSet];
            if (setName && setBonuses[setName]) {
                setBonusDisplay.textContent = setBonuses[setName].message;
            }
        } else {
            setBonusDisplay.textContent = "";
        }
    }

    function updateCharacterDisplay() {
        equippedHelmetIcon.src = items.helmet[character.equipped.helmet].icon;
        highlightSelectedItem('helmet', character.equipped.helmet);
        equippedArmorIcon.src = items.armor[character.equipped.armor].icon;
        highlightSelectedItem('armor', character.equipped.armor);
        equippedGlovesIcon.src = items.gloves[character.equipped.gloves].icon;
        highlightSelectedItem('gloves', character.equipped.gloves);
        equippedBootsIcon.src = items.boots[character.equipped.boots].icon;
        highlightSelectedItem('boots', character.equipped.boots);
        equippedWeaponIcon.src = items.weapon[character.equipped.weapon].icon;
        highlightSelectedItem('weapon', character.equipped.weapon);

        for (let i = 0; i < 3; i++) {
            if (character.selectedSkills[i]) {
                skillIconElements[i].src = items.skills[character.selectedSkills[i]].icon;
            } else {
                skillIconElements[i].src = emptyIconUrl;
            }
        }
        highlightSelectedSkills();
        checkAndApplySetBonus();
    }

    function highlightSelectedItem(slot, selectedItem) {
        const slotButtons = container.querySelectorAll(`#${slot}-buttons .item-button`);
        slotButtons.forEach(button => {
            if (button.dataset.item === selectedItem) {
                button.classList.add('selected', 'flipped');
                 if (slot === 'weapon' && selectedItem !== 'none') {
                    const cardBack = button.querySelector('.card-back p');
                    cardBack.innerHTML = items.weapon[selectedItem].lore;
                }
            } else {
                button.classList.remove('selected', 'flipped');
            }
        });
    }

    function highlightSelectedSkills() {
        const skillButtons = container.querySelectorAll('#skills-buttons .item-button');
        skillButtons.forEach(button => {
            const skillName = button.dataset.item;
            if (character.selectedSkills.includes(skillName)) {
                button.classList.add('selected', 'flipped');
            } else {
                button.classList.remove('selected', 'flipped');
            }
        });
    }

    function showMessage(message) {
        messageBox.textContent = message;
        messageBox.style.display = 'block';
        messageBox.classList.remove('scale-0', 'opacity-0');
        messageBox.classList.add('scale-100', 'opacity-100');

        setTimeout(() => {
            messageBox.classList.remove('scale-100', 'opacity-100');
            messageBox.classList.add('scale-0', 'opacity-0');
            messageBox.addEventListener('transitionend', function handler() {
                messageBox.style.display = 'none';
                messageBox.removeEventListener('transitionend', handler);
            });
        }, 2000);
    }

    itemButtons.forEach(button => {
        const slot = button.dataset.slot;
        const item = button.dataset.item;

        if (slot === 'weapon') {
            button.addEventListener('mouseenter', () => {
                if (character.equipped.weapon !== item) {
                    const cardBack = button.querySelector('.card-back p');
                    cardBack.innerHTML = items.weapon[item].description; // Show stats
                    button.classList.add('flipped');
                }
            });

            button.addEventListener('mouseleave', () => {
                if (character.equipped.weapon !== item) {
                    button.classList.remove('flipped');
                }
            });

            button.addEventListener('click', () => {
                if (character.equipped.weapon === item) {
                    // Deselect if clicking the same weapon
                    character.equipped.weapon = 'none';
                    showMessage(`¡${items.weapon[item].text} desequipado!`);
                } else {
                    // Select the new weapon
                    character.equipped.weapon = item;
                    showMessage(`¡${items.weapon[item].text} equipado!`);
                }
                updateCharacterDisplay();
            });

        } else { // For armor, skills, etc.
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('selected')) {
                    button.classList.add('flipped');
                }
            });
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('selected')) {
                    button.classList.remove('flipped');
                }
            });

            button.addEventListener('click', () => {
                if (slot === 'skills') {
                    toggleSkill(item);
                } else { // Armor, helmet, boots, gloves
                    if (character.equipped[slot] === item) {
                        character.equipped[slot] = 'none';
                        showMessage(`¡${items[slot][item].text} desequipado!`);
                    } else {
                        character.equipped[slot] = item;
                        showMessage(`¡${items[slot][item].text} equipado!`);
                    }
                }
                updateCharacterDisplay();
            });
        }
    });

    function toggleSkill(skillName) {
        const index = character.selectedSkills.indexOf(skillName);
        if (index > -1) {
            character.selectedSkills.splice(index, 1);
            showMessage(`¡${items.skills[skillName].text} deseleccionado!`);
        } else {
            if (character.selectedSkills.length < 3) {
                character.selectedSkills.push(skillName);
                showMessage(`¡${items.skills[skillName].text} seleccionado!`);
            } else {
                showMessage("¡Máximo de 3 habilidades seleccionadas!");
            }
        }
    }

    backButton.addEventListener('click', onBack);

    saveButton.addEventListener('click', onSave);

    document.addEventListener('DOMContentLoaded', updateCharacterDisplay);

    return container;
}

export { createEquipoHTML, character, items, setBonuses };