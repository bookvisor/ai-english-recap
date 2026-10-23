const profiles = {
  elementary: { name: '초4 영어 탐험가', focus: '음식과 취향', focusText: '단어를 문장으로 말하고, 좋아하는 음식을 설명해 봐요.', report: '문장으로 표현하는 힘이 좋아지고 있어요.', detail: '단어 뜻을 잘 기억하고 있으며, 좋아하는 음식을 설명하는 문장을 자연스럽게 만들었습니다. 철자가 헷갈린 단어만 짧게 다시 확인해 주세요.', strength: '문장 만들기', weak: 'favorite 철자', mission: '5분 단어 카드', greeting: '준비됐어? 이번 주 배운 내용 중 가장 기억나는 것부터 가볍게 말해 보자.', questions: [
    ['“delicious”의 뜻으로 알맞은 것은?', ['맛있는', '배고픈', '메뉴'], 0, '음식을 먹고 “맛있다!”라고 할 때 쓰는 말이야.'],
    ['빈칸에 알맞은 말은? I ___ pizza.', ['like', 'likes', 'liking'], 0, '주어가 I일 때는 동사 원형을 써 볼까?'],
    ['좋아하는 이유를 말할 때 알맞은 연결어는?', ['because', 'but', 'or'], 0, '“왜냐하면”이라는 뜻의 단어를 떠올려 봐.'],
    ['“My favorite food is pasta.”를 자연스럽게 해석하면?', ['내가 가장 좋아하는 음식은 파스타야.', '나는 파스타를 만들고 있어.', '파스타는 아주 배고파.'], 0, 'favorite는 ‘가장 좋아하는’이라는 뜻이야.']
  ]},
  middle: { name: '중2 영어 전략가', focus: '문장 성분과 시제', focusText: '문장의 근거를 찾고, 어법 실수를 줄여 봐요.', report: '정답의 근거를 설명하는 힘이 자라고 있어요.', detail: '핵심 문법의 개념은 안정적입니다. 문장을 끝까지 읽으며 주어와 시제를 확인하면 실수가 더 줄어들겠습니다.', strength: '문법 근거 찾기', weak: '시제 단서 확인', mission: '어법 5문항', greeting: '이번에는 답보다 근거가 중요해. 선택한 이유를 한 번 생각해 보고 시작하자.', questions: [
    ['다음 문장의 빈칸에 알맞은 것은? She ___ to school yesterday.', ['go', 'went', 'goes'], 1, 'yesterday는 과거를 알려 주는 중요한 단서야.'],
    ['다음 중 어법상 알맞은 문장은?', ['He don’t like coffee.', 'He doesn’t likes coffee.', 'He doesn’t like coffee.'], 2, 'doesn’t 뒤의 동사는 어떤 형태가 와야 할까?'],
    ['“The book that I bought was interesting.”에서 that이 가리키는 것은?', ['I', 'book', 'interesting'], 1, 'that 앞에 있는 명사를 선행사라고 해.'],
    ['문맥상 알맞은 접속사는? I was tired, ___ I finished my homework.', ['but', 'because', 'so'], 0, '피곤했지만 숙제를 끝낸 두 상황의 관계를 생각해 봐.']
  ]}
};
let current = 'elementary', index = 0, correct = 0, selected = null;
const $ = (s) => document.querySelector(s);
const dialog = $('#sessionDialog');
const timeline = [['0–5분','워밍업'],['5–12분','단어'],['12–23분','핵심 점검'],['23–30분','오답 정리']];
$('#timeline').innerHTML = timeline.map(([time, title]) => `<div class="time-step">${time}<b>${title}</b></div>`).join('');
$('#today').textContent = new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date());

function updateProfile() {
  const p = profiles[current];
  document.querySelectorAll('.student-card').forEach(c => c.classList.toggle('selected', c.dataset.student === current));
  $('#sessionTitle').textContent = `${p.name}의 30분`;
  $('#focusTitle').textContent = p.focus; $('#focusText').textContent = p.focusText;
  $('#coachMessage').innerHTML = `<span class="coach-icon">✦</span><p><b>준비됐어?</b><br />${p.greeting}</p>`;
  $('#reportStudent').textContent = `${p.name} · 이번 주`;
  $('#reportHeadline').textContent = p.report; $('#reportText').textContent = p.detail;
  $('#strength').textContent = p.strength; $('#weakness').textContent = p.weak; $('#mission').textContent = p.mission;
}
document.querySelectorAll('.student-card').forEach(card => card.addEventListener('click', () => { current = card.dataset.student; updateProfile(); }));

function renderQuestion() {
  const q = profiles[current].questions[index]; selected = null;
  $('#dialogLabel').textContent = `${profiles[current].name.toUpperCase()} · RECAP`;
  $('#questionNumber').textContent = `${String(index + 1).padStart(2, '0')} / 04`;
  $('#question').textContent = q[0]; $('#hint').textContent = ''; $('#feedback').textContent = '';
  $('#progressBar').style.width = `${(index + 1) * 25}%`; $('#nextQuestion').disabled = true;
  $('#nextQuestion').innerHTML = index === 3 ? '결과 보기 <span>→</span>' : '다음 <span>→</span>';
  $('#answers').innerHTML = q[1].map((answer, i) => `<button class="answer" data-index="${i}">${answer}</button>`).join('');
  document.querySelectorAll('.answer').forEach(btn => btn.addEventListener('click', chooseAnswer));
}
function chooseAnswer(e) {
  if (selected !== null) return;
  selected = Number(e.currentTarget.dataset.index); const q = profiles[current].questions[index]; const isCorrect = selected === q[2];
  document.querySelectorAll('.answer').forEach((btn, i) => { if (i === q[2]) btn.classList.add('correct'); if (i === selected && !isCorrect) btn.classList.add('wrong'); btn.disabled = true; });
  if (isCorrect) { correct++; $('#feedback').textContent = '좋아! 근거까지 기억해 두자.'; } else { $('#feedback').textContent = '괜찮아. 힌트를 보고 정답을 확인해 보자.'; $('#hint').textContent = `힌트 · ${q[3]}`; }
  $('#nextQuestion').disabled = false;
}
$('#startSession').addEventListener('click', () => { index = 0; correct = 0; renderQuestion(); dialog.showModal(); });
$('#nextQuestion').addEventListener('click', () => { if (index < 3) { index++; renderQuestion(); } else { dialog.close(); finishSession(); } });
$('#closeDialog').addEventListener('click', () => dialog.close());
function finishSession() { const p = profiles[current]; $('#coachMessage').innerHTML = `<span class="coach-icon">✓</span><p><b>오늘의 리캡 완료!</b><br />${correct}/4 문제를 확인했어. ${correct >= 3 ? '잘했어. 다음 주에도 이 감각을 이어 가자!' : '틀린 부분은 다음 주에 한 번 더 가볍게 볼 거야.'}</p>`; $('#reviewCount').textContent = `${4 - correct || 1}개`; $('#reportText').textContent = `${p.detail} 오늘 리캡에서는 4문제 중 ${correct}문제를 정확히 확인했습니다.`; localStorage.setItem('recapProgress', JSON.stringify({current, correct, date: new Date().toISOString()})); }
$('#resetSession').addEventListener('click', () => { $('#coachMessage').innerHTML = `<span class="coach-icon">✦</span><p><b>준비됐어?</b><br />${profiles[current].greeting}</p>`; });
$('#studyForm').addEventListener('submit', (e) => { e.preventDefault(); const data = { unit: $('#unit').value, words: $('#words').value, grammar: $('#grammar').value, difficulty: $('#difficulty').value }; localStorage.setItem(`weeklyPrep-${current}`, JSON.stringify(data)); $('#focusTitle').textContent = data.unit || profiles[current].focus; $('#focusText').textContent = data.difficulty ? `이번 주에는 “${data.difficulty}”를 특히 다시 살펴봐요.` : profiles[current].focusText; const btn = e.submitter; btn.textContent = '저장됐어요 ✓'; setTimeout(() => btn.textContent = '이번 주 자료 저장하기', 1800); });
$('#copyReport').addEventListener('click', async () => { const text = `${$('#reportStudent').textContent}\n${$('#reportHeadline').textContent}\n${$('#reportText').textContent}\n잘한 점: ${$('#strength').textContent} / 다시 보기: ${$('#weakness').textContent} / 다음 미션: ${$('#mission').textContent}`; try { await navigator.clipboard.writeText(text); $('#copyReport').textContent = '복사됨 ✓'; } catch { $('#copyReport').textContent = '복사할 수 없어요'; } setTimeout(() => $('#copyReport').textContent = '요약 복사', 1800); });
updateProfile();
