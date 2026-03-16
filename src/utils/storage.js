const PB_KEY = 'typeflow_personal_bests';

export function loadPersonalBests() {
  try {
    const raw = localStorage.getItem(PB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePersonalBest(duration, wpm) {
  const pbs = loadPersonalBests();
  if (!pbs[duration] || wpm > pbs[duration]) {
    pbs[duration] = wpm;
    try {
      localStorage.setItem(PB_KEY, JSON.stringify(pbs));
    } catch {}
    return true;
  }
  return false;
}

export function getPersonalBest(duration) {
  const pbs = loadPersonalBests();
  return pbs[duration] ?? null;
}