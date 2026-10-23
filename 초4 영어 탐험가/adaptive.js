(() => {
  const course = [
    { unit: '필수 영단어: 학교와 일상', words: 'classroom, teacher, homework, usually', hard: '단어를 보고 뜻을 말한 뒤, 짧은 문장으로 바꿔 봐요' },
    { unit: '듣기: 사람과 하루 일과', words: 'wake up, breakfast, after, before', hard: '시간 순서와 누구의 행동인지 듣고 찾아 봐요' },
    { unit: '영독해: 짧은 정보 글', words: 'important, different, favorite, together', hard: '글에서 가장 중요한 문장을 찾아 봐요' },
    { unit: '장소와 길 안내', words: 'library, hospital, across, next to', hard: '장소를 설명하는 전치사를 그림과 연결해 봐요' },
    { unit: '말하기·쓰기: 나를 소개하기', words: 'want to, because, helpful, future', hard: 'because를 사용해 이유가 있는 3문장을 완성해 봐요' }
  ];
  const stateKey = 'elementaryAdaptiveState';
  const resultKey = 'elementaryRecap';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };

  function apply(stage, note = '') {
    const lesson = course[stage];
    document.querySelector('#unit').value = lesson.unit;
    document.querySelector('#words').value = lesson.words;
    document.querySelector('#hard').value = lesson.hard;
    document.querySelectorAll('.card h2')[0].textContent = `이번 목표 · ${lesson.unit}`;
    if (note) document.querySelector('#summary').textContent = `${note} 다음 리캡은 “${lesson.unit}” 단원과 핵심단어 ${lesson.words.split(',').slice(0, 2).join(',')}로 준비했어요.`;
  }
  function syncResult() {
    const result = read(resultKey, null);
    const state = read(stateKey, { stage: 0, processedAt: null });
    if (!result || result.date === state.processedAt) return apply(state.stage);
    let stage = state.stage, note;
    if (result.score >= 3 && stage < course.length - 1) { stage++; note = `이번 리캡에서 ${result.score}/4점을 받았어요. 다음 단계로 한 걸음 나아갑니다!`; }
    else if (result.score <= 1 && stage > 0) { stage--; note = `이번에는 기초를 한 번 더 단단히 다져 볼게요. 이전 단계로 잠시 돌아갑니다.`; }
    else note = result.score >= 3 ? `아주 좋아요. 지금 단계의 표현을 한 번 더 익혀 자신감으로 만들어 봐요.` : `조금만 더 연습하면 다음 단계로 갈 준비가 됩니다.`;
    localStorage.setItem(stateKey, JSON.stringify({ stage, processedAt: result.date }));
    apply(stage, note);
  }
  document.querySelector('#next').addEventListener('click', () => setTimeout(syncResult, 0));
  syncResult();
})();
