(() => {
  const sourceLinks = [
    ['EBS 초등 5학년 영어', 'https://primary.ebs.co.kr/course/grade/list?orderClsfsSysId=21000023&selStudyPhsCode=34&sort=4&studyPhaseCode=&tab=5s&viewType=image'],
    ['VOA Learning English · Level 1', 'https://learningenglish.voanews.com/p/5644.html'],
    ['Cambridge English · A1–A2', 'https://www.cambridgeenglish.org/learning-english']
  ];
  const words = [
    ['library', '도서관'], ['weather', '날씨'], ['together', '함께'], ['different', '다른'],
    ['favorite', '가장 좋아하는'], ['usually', '보통'], ['healthy', '건강한'], ['important', '중요한'],
    ['weekend', '주말'], ['because', '왜냐하면'], ['practice', '연습하다'], ['friendly', '친절한']
  ];
  const extra = [
    ['I usually ___ English after dinner.', ['practice', 'weather', 'library'], 0, 'usually는 “보통”이야. 뒤에는 행동을 나타내는 말을 넣어 보자.'],
    ['다음 중 이유를 말할 때 쓰는 말은?', ['because', 'together', 'weekend'], 0, 'because는 “왜냐하면”이라는 뜻이야.'],
    ['다음 중 자연스러운 문장은?', ['My friend is friendly.', 'My friend are friendly.', 'My friend friendly.'], 0, 'My friend는 한 명이므로 is가 필요해.'],
    ['“We read together at the library.”의 뜻은?', ['우리는 도서관에서 함께 읽는다.', '우리는 주말에 달린다.', '도서관은 건강하다.'], 0, 'together는 “함께”, at the library는 “도서관에서”야.']
  ];
  const historyKey = 'elementaryQuestionHistory';
  const resultKey = 'elementaryRecap';
  const $ = (s) => document.querySelector(s);
  let selected = [], position = 0, score = 0, answered = false;
  const read = () => { try { return JSON.parse(localStorage.getItem(historyKey)) || []; } catch { return []; } };
  const write = (ids) => localStorage.setItem(historyKey, JSON.stringify(ids));
  function bank() {
    const meaning = words.map(([en, ko]) => ({ id: `meaning-${en}`, q: `“${en}”의 뜻으로 알맞은 것은?`, options: [ko, ...words.filter(x => x[0] !== en).slice(0, 2).map(x => x[1])], answer: 0, hint: `“${en}”를 오늘의 단어 카드에 한 번 더 적어 보자.` }));
    const choose = words.map(([en, ko], i) => ({ id: `choose-${en}`, q: `“${ko}”에 해당하는 영어 단어는?`, options: [en, words[(i + 3) % words.length][0], words[(i + 7) % words.length][0]], answer: 0, hint: '문장 안에서 써 본 단어를 떠올려 봐.' }));
    return [...meaning, ...choose, ...extra.map((x, i) => ({ id: `sentence-${i}`, q: x[0], options: x[1], answer: x[2], hint: x[3] }))];
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
    $('#quiz').close(); $('#summary').textContent = `오늘은 중복 없이 새 문제 4개를 풀어 ${score}개를 맞혔어요. 다음 리캡은 아직 풀지 않은 단어와 문장으로 준비됩니다.`;
    localStorage.setItem(resultKey, JSON.stringify({ score, date: new Date().toISOString() }));
  }
  function addSources() {
    const card = document.createElement('section'); card.className = 'card';
    card.innerHTML = `<p class="eyebrow">LEARNING SOURCES</p><h2>오늘의 확장 영어</h2><p class="small">초4는 초등 5학년 수준을 도전 범위로 삼습니다. 아래 원문 학습은 각 공식 사이트에서 확인하고, 이 앱에서는 별도의 자체 문제를 풉니다.</p><p class="small">${sourceLinks.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join(' &nbsp;·&nbsp; ')}</p>`;
    document.querySelector('.card').after(card);
  }
  $('#start').onclick = () => { if (chooseQuestions()) { position = score = 0; render(); $('#quiz').showModal(); } };
  $('#next').onclick = () => { if (position < 3) { position++; render(); } else finish(); };
  addSources();
})();
