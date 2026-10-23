(() => {
  const course = [
    { unit: '어휘·문법: 문장 속 시제 단서', words: 'recently, already, during, experience', hard: '시간 부사와 동사 형태를 근거로 시제를 판단해요' },
    { unit: '문법: 조동사와 문장 정확성', words: 'should, must, might, suggest', hard: '조동사 뒤 동사원형과 문장의 의미 차이를 설명해요' },
    { unit: '독해: 중심 내용과 세부 정보', words: 'purpose, effect, detail, contrast', hard: '각 문단의 핵심을 한 문장으로 요약해요' },
    { unit: '듣기: 상황·의도 파악', words: 'reservation, appointment, available, instead', hard: '듣기 전 선택지를 보고 필요한 정보를 예측해요' },
    { unit: '쓰기: 근거 있는 의견 문단', words: 'opinion, reason, example, therefore', hard: '의견·이유·예시가 있는 4문장 문단을 작성해요' }
  ];
  const stateKey = 'middleAdaptiveState';
  const resultKey = 'middleRecap';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };

  function apply(stage, note = '') {
    const lesson = course[stage];
    document.querySelector('#unit').value = lesson.unit;
    document.querySelector('#words').value = lesson.words;
    document.querySelector('#hard').value = lesson.hard;
    document.querySelectorAll('.card h2')[0].textContent = `이번 목표 · ${lesson.unit}`;
    if (note) document.querySelector('#summary').textContent = `${note} 다음 리캡은 “${lesson.unit}” 단원과 핵심단어 ${lesson.words.split(',').slice(0, 2).join(',')}를 중심으로 진행합니다.`;
  }
  function syncResult() {
    const result = read(resultKey, null);
    const state = read(stateKey, { stage: 0, processedAt: null });
    if (!result || result.date === state.processedAt) return apply(state.stage);
    let stage = state.stage, note;
    if (result.score >= 3 && stage < course.length - 1) { stage++; note = `이번 리캡에서 ${result.score}/4점을 받았습니다. 다음 문법 단계로 진행합니다.`; }
    else if (result.score <= 1 && stage > 0) { stage--; note = `핵심 개념을 한 번 더 다지기 위해 이전 단계로 돌아갑니다.`; }
    else note = result.score >= 3 ? `현재 단계의 응용 문제를 한 번 더 풀어 정확도를 굳히겠습니다.` : `다음 단계 전에 현재 개념의 근거를 한 번 더 확인하겠습니다.`;
    localStorage.setItem(stateKey, JSON.stringify({ stage, processedAt: result.date }));
    apply(stage, note);
  }
  document.querySelector('#next').addEventListener('click', () => setTimeout(syncResult, 0));
  syncResult();
})();
