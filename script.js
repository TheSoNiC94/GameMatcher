// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, arrayUnion, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAYINl_MecM2DwaySLwV0rtO33lGkTlEOQ",
    authDomain: "gamematch-ba11a.firebaseapp.com",
    projectId: "gamematch-ba11a",
    storageBucket: "gamematch-ba11a.appspot.com",
    messagingSenderId: "429035520068",
    appId: "1:429035520068:web:default"
};
const appId = 'gamematch-ba11a';

// Inicialização do Firebase
let app;
if (Object.keys(firebaseConfig).length > 0 && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
} else {
    console.warn("Firebase configuration is incomplete. Check your environment variables.");
    app = null;
}

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

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

// --- ESTADO DA APLICAÇÃO ---
let currentUser = null;
let currentSessionId = null;
let sessionData = null;
let unsubscribeSession = null;
let isProcessing = false;

// --- ELEMENTOS DO DOM ---
const connectionScreen = document.getElementById('connection-screen');
const mainScreen = document.getElementById('main-screen');
const userIdInput = document.getElementById('user-id');
const friendIdInput = document.getElementById('friend-id');
const startButton = document.getElementById('start-button');
const copyIdButton = document.getElementById('copy-id-button');
const copyFeedback = document.getElementById('copy-feedback');
const connectionStatus = document.getElementById('connection-status');
const gameCardContainer = document.getElementById('game-card-container');
const likeButton = document.getElementById('like-button');
const dislikeButton = document.getElementById('dislike-button');
const matchedGamesList = document.getElementById('matched-games-list');
const matchModal = document.getElementById('match-modal');
const matchedGameName = document.getElementById('matched-game-name');
const matchedGameImage = document.getElementById('matched-game-image');
const closeMatchModalButton = document.getElementById('close-match-modal');

// --- LÓGICA DE AUTENTICAÇÃO ---
async function initializeAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            userIdInput.value = user.uid || 'A gerar ID...';
            startButton.disabled = false;
            connectionStatus.textContent = "";
        } else {
            userIdInput.value = 'A gerar ID...';
        }
    });

    try {
        startButton.disabled = true;
        connectionStatus.textContent = "A autenticar...";
        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (token) {
            await signInWithCustomToken(auth, token);
        } else {
            await signInAnonymously(auth);
        }
    } catch (error) {
        console.error("Erro na autenticação:", error);
        connectionStatus.textContent = "Falha na autenticação.";
    }
}

initializeAuth();

// --- FUNÇÕES PRINCIPAIS ---

// Copiar o ID do utilizador para a área de transferência
copyIdButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(userIdInput.value);
        copyFeedback.style.opacity = '1';
        setTimeout(() => { copyFeedback.style.opacity = '0'; }, 2000);
    } catch (err) {
        copyFeedback.textContent = 'Erro ao copiar!';
        copyFeedback.style.opacity = '1';
        setTimeout(() => { copyFeedback.style.opacity = '0'; copyFeedback.textContent = 'Copiado!'; }, 2000);
    }
});

// Iniciar a sessão de matching
startButton.addEventListener('click', async () => {
    const friendId = friendIdInput.value.trim();
    if (!friendId || !currentUser) {
        connectionStatus.textContent = "Por favor, insere o ID do teu amigo.";
        return;
    }
    if (friendId === currentUser.uid) {
        connectionStatus.textContent = "Não podes jogar contigo mesmo!";
        return;
    }

    startButton.disabled = true;
    connectionStatus.textContent = "A conectar...";

    const sessionUsers = [currentUser.uid, friendId].sort();
    currentSessionId = `${sessionUsers[0]}-${sessionUsers[1]}`;
    
    const sessionRef = doc(db, "sessions", currentSessionId);

    try {
        const sessionSnap = await getDoc(sessionRef);
        if (!sessionSnap.exists()) {
            // Criar uma nova sessão se não existir
            await setDoc(sessionRef, {
                users: sessionUsers,
                [`likes_${currentUser.uid}`]: [],
                [`likes_${friendId}`]: [],
                matches: [],
                currentGameIndex: 0,
                createdAt: new Date()
            });
        }
        
        // Começar a ouvir as atualizações da sessão
        listenToSession(sessionRef);

    } catch (error) {
        console.error("Erro ao iniciar a sessão:", error);
        connectionStatus.textContent = "Erro ao conectar. Tenta novamente.";
        startButton.disabled = false;
    }
});

// Ouvir as atualizações da sessão em tempo real
function listenToSession(sessionRef) {
    unsubscribeSession = onSnapshot(sessionRef, (doc) => {
        if (doc.exists()) {
            const oldSessionData = sessionData;
            sessionData = doc.data();

            // Mudar para o ecrã principal na primeira vez que os dados são carregados
            if (connectionScreen.style.display !== 'none') {
                connectionScreen.style.display = 'none';
                mainScreen.style.display = 'block';
            }
            
            updateUI(oldSessionData);
        }
    });
}

// Atualizar a interface com base nos dados da sessão
function updateUI(oldSessionData) {
    if (!sessionData) return;

    // Verificar novos matches
    const oldMatches = oldSessionData ? oldSessionData.matches : [];
    const newMatches = sessionData.matches.filter(match => !oldMatches.includes(match));
    if (newMatches.length > 0) {
        const lastMatchId = newMatches[newMatches.length - 1];
        const matchedGame = games.find(g => g.id === lastMatchId);
        if (matchedGame) {
            showMatchModal(matchedGame);
        }
    }

    // Atualizar a lista de matches
    updateMatchedList();
    
    // Mostrar o cartão do jogo atual
    displayCurrentGame();
}

// Mostrar o cartão do jogo atual
function displayCurrentGame() {
    const index = sessionData.currentGameIndex;
    if (index >= games.length) {
        showEndOfList();
        return;
    }
    const game = games[index];
    gameCardContainer.innerHTML = `
        <div class="card bg-gray-800 rounded-2xl p-6 shadow-lg w-full h-full flex flex-col justify-between absolute">
            <div>
                <img src="${game.image}" alt="Imagem de ${game.name}" class="w-full h-56 object-cover rounded-lg mb-4" onerror="this.src='https://placehold.co/400x300/1a202c/99f6e4?text=Imagem+N/A'">
                <h2 class="text-2xl font-bold text-white">${game.name}</h2>
            </div>
            <p class="text-gray-400 mt-2">${game.description}</p>
        </div>
    `;
    isProcessing = false;
}

// Mostrar quando a lista de jogos termina
function showEndOfList() {
    gameCardContainer.innerHTML = `
        <div class="card bg-gray-800 rounded-2xl p-6 shadow-lg w-full h-full flex flex-col justify-center items-center text-center">
            <h2 class="text-2xl font-bold text-white">Fim da Lista!</h2>
            <p class="text-gray-400 mt-2">Já viram todos os jogos. Verifiquem os vossos matches abaixo!</p>
        </div>
    `;
    likeButton.disabled = true;
    dislikeButton.disabled = true;
    likeButton.classList.add('opacity-50', 'cursor-not-allowed');
    dislikeButton.classList.add('opacity-50', 'cursor-not-allowed');
}

// Atualizar a lista de jogos com match
function updateMatchedList() {
    matchedGamesList.innerHTML = '';
    if (!sessionData || sessionData.matches.length === 0) {
        matchedGamesList.innerHTML = '<p class="text-gray-500 text-center">Ainda não há matches...</p>';
        return;
    }
    sessionData.matches.forEach(gameId => {
        const game = games.find(g => g.id === gameId);
        if (game) {
            const el = document.createElement('div');
            el.className = 'bg-gray-700 p-3 rounded-lg mb-2 flex items-center';
            el.innerHTML = `<p class="font-semibold text-teal-400">${game.name}</p>`;
            matchedGamesList.appendChild(el);
        }
    });
}

// Lidar com o clique no botão de "Gosto"
likeButton.addEventListener('click', () => handleSwipe(true));

// Lidar com o clique no botão de "Não Gosto"
dislikeButton.addEventListener('click', () => handleSwipe(false));

// Processar a ação de swipe (gosto/não gosto)
async function handleSwipe(isLike) {
    if (isProcessing || !sessionData || sessionData.currentGameIndex >= games.length) return;
    isProcessing = true;
    
    const game = games[sessionData.currentGameIndex];
    const sessionRef = doc(db, "sessions", currentSessionId);
    
    // Animação de remoção do cartão
    const cardElement = gameCardContainer.querySelector('.card');
    if (cardElement) {
        cardElement.classList.add('removing');
    }

    if (isLike) {
        try {
            // Adicionar o "like" ao Firestore
            const userLikesKey = `likes_${currentUser.uid}`;
            await updateDoc(sessionRef, {
                [userLikesKey]: arrayUnion(game.id)
            });

            // Verificar se há um match
            const friendId = sessionData.users.find(id => id !== currentUser.uid);
            const friendLikesKey = `likes_${friendId}`;
            const updatedSessionSnap = await getDoc(sessionRef);
            if (updatedSessionSnap.exists() && updatedSessionSnap.data()[friendLikesKey].includes(game.id)) {
                // É um match!
                await updateDoc(sessionRef, {
                    matches: arrayUnion(game.id)
                });
            }
        } catch (error) {
            console.error("Erro ao dar like:", error);
        }
    }
    
    // Apenas o primeiro utilizador da sessão (por ordem alfabética) atualiza o índice para evitar conflitos
    if (currentUser.uid === sessionData.users[0]) {
         try {
            await updateDoc(sessionRef, {
                currentGameIndex: sessionData.currentGameIndex + 1
            });
         } catch(error) {
             console.error("Erro ao avançar para o próximo jogo:", error);
         }
    }
}

// Mostrar o modal de match
function showMatchModal(game) {
    matchedGameName.textContent = game.name;
    matchedGameImage.src = game.image;
    matchModal.style.display = 'flex';
    const modalContent = matchModal.querySelector('.transform');
    modalContent.classList.remove('scale-95');
    requestAnimationFrame(() => {
        modalContent.classList.add('scale-100');
    });
}

// Fechar o modal de match
closeMatchModalButton.addEventListener('click', () => {
    const modalContent = matchModal.querySelector('.transform');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        matchModal.style.display = 'none';
    }, 200);
});
