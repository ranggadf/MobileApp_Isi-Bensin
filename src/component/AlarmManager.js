import { createAudioPlayer } from "expo-audio";

let player = null;
let stopTimer = null;

export async function playAlarm() {
  try {
    // hentikan alarm lama kalau masih ada
    await stopAlarm();

    player = createAudioPlayer(
      require("../../assets/notif.mp3")
    );

    player.loop = true;

    player.play();

    // otomatis berhenti setelah 30 detik
    stopTimer = setTimeout(async () => {
      await stopAlarm();
    }, 30000);

  } catch (e) {
    console.log("PLAY ALARM ERROR:", e);
  }
}

export async function stopAlarm() {
  try {

    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }

    if (player) {
      player.pause();
      player.remove();
      player = null;
    }

  } catch (e) {
    console.log("STOP ALARM ERROR:", e);
  }
}