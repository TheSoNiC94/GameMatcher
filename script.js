// Interface simples para GitHub Pages
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app-container');
  app.innerHTML = `
    <div class="bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold mb-4">Game Matcher</h1>
      <p class="mb-6">Encontra o jogo perfeito para jogar com o teu amigo!</p>
      <button id="find-game" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
        Encontrar Jogo
      </button>
      <div id="result" class="mt-6"></div>
    </div>
  `;

  document.getElementById('find-game').addEventListener('click', () => {
    // Exemplo de resultado
    document.getElementById('result').innerHTML = `
      <div class="bg-green-600 p-4 rounded">
        <strong>Jogo sugerido:</strong> Rocket League 🚗⚽
      </div>
    `;
  });
});

// --- DADOS DOS JOGOS ---
const games = [
    { id: 'it_takes_two', name: 'It Takes Two', description: 'Uma aventura de plataforma cooperativa criada exclusivamente para dois jogadores.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=It+Takes+Two' },
    { id: 'overcooked_2', name: 'Overcooked! 2', description: 'Cozinha caótica para até quatro jogadores. Comunicação é a chave!', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Overcooked!+2' },
    { id: 'stardew_valley', name: 'Stardew Valley', description: 'Cria a quinta dos teus sonhos com amigos neste RPG de simulação de quinta.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Stardew+Valley' },
    { id: 'baldurs_gate_3', name: "Baldur's Gate 3", description: 'Um RPG da nova geração, passado no mundo de Dungeons and Dragons.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Baldur\'s+Gate+3' },
    { id: 'helldivers_2', name: 'Helldivers 2', description: 'Junta-te aos Helldivers para lutar pela liberdade numa galáxia hostil neste shooter cooperativo.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Helldivers+2' },
    { id: 'lethal_company', name: 'Lethal Company', description: 'Um jogo de terror cooperativo sobre recolher sucata de luas industrializadas e abandonadas.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Lethal+Company' },
    { id: 'deep_rock_galactic', name: 'Deep Rock Galactic', description: 'Anões espaciais, ambientes destrutíveis, cavernas geradas processualmente e hordas de alienígenas.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Deep+Rock+Galactic' },
    { id: 'portal_2', name: 'Portal 2', description: 'Um quebra-cabeças cooperativo aclamado pela crítica com uma história envolvente e desafios de portais.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Portal+2' },
    { id: 'a_way_out', name: 'A Way Out', description: 'Uma aventura exclusivamente cooperativa onde jogas como um de dois prisioneiros a tentar fugir da prisão.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=A+Way+Out' },
    { id: 'sea_of_thieves', name: 'Sea of Thieves', description: 'Vive a vida de pirata num mundo aberto partilhado, navegando, lutando e explorando com a tua tripulação.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Sea+of+Thieves' },
    { id: 'valheim', name: 'Valheim', description: 'Um jogo de sobrevivência e exploração brutal para 1-10 jogadores, passado num purgatório gerado processualmente.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Valheim' },
    { id: 'minecraft', name: 'Minecraft', description: 'Explora, constrói e sobrevive num mundo de blocos infinito. Joga sozinho ou com amigos.', image: 'https://placehold.co/400x300/1a202c/99f6e4?text=Minecraft' },
    // ... (restante lista dos jogos) ...
];


// --- UI LOCAL PARA GITHUB PAGES ---
// Mostra um jogo aleatório da lista ao clicar no botão
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app-container');
  app.innerHTML = `
    <div class="bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold mb-4">Game Matcher</h1>
      <p class="mb-6">Encontra o jogo perfeito para jogar com o teu amigo!</p>
      <button id="find-game" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
        Encontrar Jogo
      </button>
      <div id="result" class="mt-6"></div>
    </div>
  `;

  document.getElementById('find-game').addEventListener('click', () => {
    // Escolhe um jogo aleatório da lista
    const game = games[Math.floor(Math.random() * games.length)];
    document.getElementById('result').innerHTML = `
      <div class="bg-green-600 p-4 rounded">
        <strong>Jogo sugerido:</strong> ${game.name} <br>
        <img src="${game.image}" alt="${game.name}" style="max-width:300px; margin-top:10px; border-radius:8px;">
        <p class="mt-2 text-white">${game.description}</p>
      </div>
    `;
  });
});
