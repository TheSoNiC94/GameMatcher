// --- MATCH LOCAL ENTRE DOIS AMIGOS ---
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app-container');
  app.innerHTML = `
    <div class="bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Game Matcher</h1>
      <p class="mb-6">Partilha este ecrã com o teu amigo! Cada um faz swipe (Gosto/Não Gosto) e quando ambos gostarem do mesmo jogo, aparece um match.</p>
      <div id="game-card" class="mb-6"></div>
      <div class="flex gap-4 mb-6">
        <button id="like-btn" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Gosto</button>
        <button id="dislike-btn" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">Não Gosto</button>
      </div>
      <div id="match-result" class="mt-6"></div>
      <div id="progress" class="text-gray-400 mt-2"></div>
      <div id="matches-list" class="mt-6"></div>
    </div>
  `;

  let currentGameIndex = 0;
  let likesA = [];
  let likesB = [];
  let turn = 'A'; // Alterna entre A e B
  let matches = [];

  const gameCard = document.getElementById('game-card');
  const likeBtn = document.getElementById('like-btn');
  const dislikeBtn = document.getElementById('dislike-btn');
  const matchResult = document.getElementById('match-result');
  const progress = document.getElementById('progress');
  const matchesList = document.getElementById('matches-list');

  function showGame() {
    if (currentGameIndex >= games.length) {
      gameCard.innerHTML = `<div class='text-white text-center'>Fim da lista de jogos!</div>`;
      likeBtn.disabled = true;
      dislikeBtn.disabled = true;
      progress.textContent = '';
      return;
    }
    const game = games[currentGameIndex];
    gameCard.innerHTML = `
      <div class="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
        <img src="${game.image}" alt="${game.name}" class="mb-4 rounded-lg" style="max-width:300px;">
        <h2 class="text-xl font-bold text-white mb-2">${game.name}</h2>
        <p class="text-gray-300 text-center">${game.description}</p>
        <div class="mt-4 text-sm text-teal-300">Jogador atual: <strong>${turn === 'A' ? 'A' : 'B'}</strong></div>
      </div>
    `;
    progress.textContent = `Jogo ${currentGameIndex + 1} de ${games.length}`;
  }

  function updateMatchesList() {
    if (matches.length === 0) {
      matchesList.innerHTML = '<p class="text-gray-500 text-center">Ainda não há matches...</p>';
      return;
    }
    matchesList.innerHTML = '<h3 class="text-lg font-bold text-teal-400 mb-2">Matches:</h3>';
    matches.forEach(gameId => {
      const game = games.find(g => g.id === gameId);
      if (game) {
        matchesList.innerHTML += `<div class='bg-gray-700 p-3 rounded-lg mb-2 flex items-center'><p class='font-semibold text-teal-400'>${game.name}</p></div>`;
      }
    });
  }

  function checkMatch(gameId) {
    if (likesA.includes(gameId) && likesB.includes(gameId) && !matches.includes(gameId)) {
      matches.push(gameId);
      matchResult.innerHTML = `<div class='bg-green-600 p-4 rounded text-white text-center'><strong>Match!</strong> Ambos gostaram de <span class='font-bold'>${games.find(g => g.id === gameId).name}</span> 🎮</div>`;
      updateMatchesList();
      setTimeout(() => { matchResult.innerHTML = ''; }, 2500);
    }
  }

  likeBtn.addEventListener('click', () => {
    const gameId = games[currentGameIndex].id;
    if (turn === 'A') {
      likesA.push(gameId);
      turn = 'B';
      showGame();
    } else {
      likesB.push(gameId);
      checkMatch(gameId);
      turn = 'A';
      currentGameIndex++;
      showGame();
    }
  });

  dislikeBtn.addEventListener('click', () => {
    if (turn === 'A') {
      turn = 'B';
      showGame();
    } else {
      turn = 'A';
      currentGameIndex++;
      showGame();
    }
  });

  showGame();
  updateMatchesList();
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
