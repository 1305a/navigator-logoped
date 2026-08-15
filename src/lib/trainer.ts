export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function formatTrainerTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function speakRu(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  window.speechSynthesis.speak(utterance);
}

export function playAudioOrSpeak(url: string, fallbackText: string, onDone?: () => void): HTMLAudioElement {
  const audio = new Audio(url);
  const finish = () => onDone?.();
  audio.addEventListener("ended", finish, { once: true });
  audio.addEventListener(
    "error",
    () => {
      speakRu(fallbackText);
      window.setTimeout(finish, 700);
    },
    { once: true },
  );
  void audio.play().catch(() => {
    speakRu(fallbackText);
    window.setTimeout(finish, 700);
  });
  return audio;
}
