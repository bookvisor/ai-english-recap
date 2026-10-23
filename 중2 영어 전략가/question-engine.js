(() => {
  const sourceLinks = [
    ['EBS 중학 영어 · 중2', 'https://mid.ebs.co.kr/course/subject/list?clsfsSysId=22000018&orderClsfsSysId=22000011&studyPhaseCode=&tab=eng&viewType=image'],
    ['VOA Learning English · Intermediate', 'https://learningenglish.voanews.com/'],
    ['Cambridge English · B1–B2', 'https://www.cambridgeenglish.org/learning-english']
  ];
  const signals = [
    ['already', '이미'], ['recently', '최근에'], ['since', '~부터'], ['for', '~동안'], ['yet', '아직'], ['ever', '한 번이라도'],
    ['yesterday', '어제'], ['last week', '지난주'], ['ago', '~전에'], ['during', '~동안'], ['however', '그러나'], ['therefore', '그러므로']
  ];
  const grammar = [
    ['Jina ___ already finished her project.', ['has', 'have', 'did'], 0, 'Jina는 한 명이므로 has를 사용해.'],
    ['I ___ my cousin yesterday.', ['have met', 'met', 'has met'], 1, 'yesterday는 끝난 과거의 시점이야.'],
    ['We have lived here ___ 2023.', ['since', 'for', 'ago'], 0, '시작 시점 앞에는 since를 사용해.'],
    ['My brother has studied English ___ three years.', ['since', 'for', 'during'], 1, '기간 앞에는 for를 사용해.'],
    ['다음 중 어법상 알맞은 문장은?', ['She has went home.', 'She has gone home.', 'She have gone home.'], 1, '현재완료는 has/have + 과거분사 형태야.'],
    ['문맥상 알맞은 연결어는? It was raining. ___, we played outside.', ['However', 'Therefore', 'Because'], 0, '앞뒤 상황이 반대일 때 However를 사용해.']
  ];
  const historyKey = 'middleQuestionHistory';
  const resultKey = 'middleRecap';
  const $ = (s) => document.querySelector(s);
  let selected = [], position = 0, score = 0, answered = false;
  const read = () => { try { return JSON.parse(localStorage.getItem(historyKey)) || []; } catch { return []; } };
  const write = (ids) => localStorage.setItem(historyKey, JSON.stringify(ids));
  function bank() {
    const vocab = signals.map(([en, ko], i) => ({ id: `meaning-${i}`, q: `“${en}”의 뜻으로 알맞은 것은?`, options: [ko, signals[(i + 3) % signals.length][1], signals[(i + 7) % signals.length][1]], answer: 0, hint: '문장 안에서 시간·논리 관계를 알려 주는 표현을 찾아 봐.' }));
    const reading = [
      ['Students have shared books they already read with classmates.', '학급의 책 나눔 활동'],
      ['The club has met every Friday since March.', '3월부터 계속된 동아리 활동'],
      ['The bus was late; therefore, Mina arrived after class began.', '버스 지연의 결과'],
      ['The weather was cold. However, the runners finished the race.', '추운 날씨에도 경주를 마침']
    ].map(([text, answer], i) => ({ id: `reading-${i}`, q: `글의 중심 내용으로 알맞은 것은? “${text}”`, options: [answer, '새 물건을 사는 방법', '학교 급식표'], answer: 0, hint: '누가 무엇을 했는지 한 문장으로 요약해 봐.' }));
    return [...vocab, ...grammar.map((x, i) => ({ id: `grammar-${i}`, q: x[0], options: x[1], answer: x[2], hint: x[3] })), ...reading];
  }
  function chooseQuestions() {
    const used = read(), available = bank().filter(q => !used.includes(q.id));
    if (available.length < 4) { alert('이번 단계의 새 문제를 모두 풀었어요. 다음 단원으로 넘어가거나 부모님이 새 학습 자료를 추가해 주세요.'); return false; }
    selected = available.sort(() => Math.random() - .5).slice(0, 4); return true;
  }
  function render() {
    const q = selected[position]; answered = false;
    $('#bar').style.width = `${(position + 1) * 25}%`; $('#number').textContent = `${position + 1} / 4`;
    $('#question').textContent = q.q; $('#hint').textContent = ''; $('#next').disabled = true;
    $('#next').textContent = position === 3 ? '결과 보기 →' : '다음 →';
    $('#answers').innerHTML = q.options.map((x, i) => `<button class="answer" data-i="${i}">${x}</button>`).join('');
    document.querySelectorAll('.answer').forEach(b => b.onclick = () => answer(Number(b.dataset.i)));
  }
  function answer(i) {
    if (answered) return; answered = true; const q = selected[position], ok = i === q.answer;
    document.querySelectorAll('.answer').forEach((b, n) => { b.disabled = true; if (n === q.answer) b.classList.add('ok'); if (n === i && !ok) b.classList.add('no'); });
    if (ok) score++; else $('#hint').textContent = `힌트 · ${q.hint}`; $('#next').disabled = false;
  }
  function finish() {
    const used = [...read(), ...selected.map(q => q.id)]; write([...new Set(used)]);
    $('#quiz').close(); $('#summary').textContent = `오늘은 중복 없이 새 문제 4개를 풀어 ${score}개를 맞혔습니다. 다음 리캡은 아직 풀지 않은 어휘·문법·독해 문제로 준비됩니다.`;
    localStorage.setItem(resultKey, JSON.stringify({ score, date: new Date().toISOString() }));
  }
  function addSources() {
    const card = document.createElement('section'); card.className = 'card';
    card.innerHTML = `<p class="eyebrow">LEARNING SOURCES</p><h2>오늘의 확장 영어</h2><p class="small">중2 영어의 듣기·어휘·문법·독해 영역을 연결합니다. 아래 원문 학습은 각 공식 사이트에서 확인하고, 이 앱에서는 별도의 자체 문제를 풉니다.</p><p class="small">${sourceLinks.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join(' &nbsp;·&nbsp; ')}</p>`;
    document.querySelector('.card').after(card);
  }
  $('#start').onclick = () => { if (chooseQuestions()) { position = score = 0; render(); $('#quiz').showModal(); } };
  $('#next').onclick = () => { if (position < 3) { position++; render(); } else finish(); };
  addSources();
})();
