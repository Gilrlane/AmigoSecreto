const setupDiv = document.getElementById('setup');
const drawSection = document.getElementById('drawSection');
const participantsInput = document.getElementById('participantsInput');
const saveBtn = document.getElementById('saveParticipants');
const currentNameInput = document.getElementById('currentName');
const drawBtn = document.getElementById('drawBtn');
const flipCardDiv = document.getElementById('flipCard');
const cardInner = document.getElementById('cardInner');
const cardBack = document.getElementById('cardBack');
const doneHint = document.getElementById('doneHint');

let participants = [];
let remaining = [];
let assignments = {};

saveBtn.onclick = () => {
  const names = participantsInput.value.split('\n').map(n => n.trim()).filter(Boolean);
  if(names.length < 2) { alert('Adicione pelo menos 2 participantes!'); return; }
  participants = names;
  remaining = [...participants];
  setupDiv.classList.add('hidden');
  drawSection.classList.remove('hidden');
  doneHint.textContent = `Faltam sortear ${remaining.length} participantes.`;
};

drawBtn.onclick = () => {
  const name = currentNameInput.value.trim();
  if(!participants.includes(name)) { alert('Digite um nome válido da lista!'); return; }
  if(assignments[name]) { alert('Você já sorteou seu amigo!'); return; }

  const possible = remaining.filter(n => n !== name);
  if(possible.length === 0) { alert('Todos os amigos já foram sorteados!'); return; }

  const randIndex = Math.floor(Math.random() * possible.length);
  const friend = possible[randIndex];

  assignments[name] = friend;
  remaining = remaining.filter(n => n !== friend);

  cardBack.textContent = friend;
  flipCardDiv.classList.remove('hidden');
  cardInner.classList.remove('flipped');
  doneHint.textContent = `Faltam sortear ${remaining.length} participantes.`;

  currentNameInput.value = '';
};

flipCardDiv.onclick = () => {
  cardInner.classList.toggle('flipped');
  if(remaining.length === 0) {
    doneHint.textContent = 'Todos os amigos já foram sorteados!';
  }
};
// Botão de baixar o resultado final
const downloadBtn = document.createElement('button');
downloadBtn.textContent = 'Baixar arquivo do sorteio';
downloadBtn.style.marginTop = '12px';
drawSection.appendChild(downloadBtn);

downloadBtn.onclick = () => {
  if(Object.keys(assignments).length === 0){
    alert('Nenhum sorteio feito ainda!');
    return;
  }

  let csv = 'Participante,Amigo Secreto\n';
  for(const [giver, receiver] of Object.entries(assignments)){
    csv += `${giver},${receiver}\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'amigo_secreto.csv';
  a.click();
  URL.revokeObjectURL(url);
};
