// Alternate dialog messages for taskbar pet when in "swapped" mode
// This file provides alternate messages that replace the original ones
// when WFLswap.bat has been triggered

// Alternate random messages (replaces the regular messages array)
export const altMessages = [
  "Wow I feel like a useless pile now, wonder why.",
  "This is awful actually, swap me back.",
  "UGH. These Belgian colors are making me sick.",
  "I'm gonna hurl.",
];

// Function for alternate welcome message
export function altWelcomeMessage() {
  return "HELP I DON'T WANT TO BE IN THIS BELG LET ME OUT NOW.";
}

// Alternate video-specific messages
export function altVideoMessage(videoName) {
  if (videoName === "media/thisisasign.mp4") {
    return "Seeing a picture of myself only makes me want to swap back more. RUN THE .BAT ALREADY.";
  } else if (videoName === "media/pbj.mp4") {
    return "Haha wow Coco is so funn- SWITCH ME BACK YOU STUPID BELG.";
  } else if (videoName === "media/wastedyears.mp4") {
    return "STOP WATCHING THIS GARBAGE AND SWITCH ME BACK.";
  } else if (videoName === "media/horrific.mp4") {
    return "ARE YOU KIDDING ME? KNOCK IT OFF GO BACK AND SWAP ME";
  } else if (videoName === "media/thecup.mp4") {
    return "THIS ISN'T IMPORTANT. GO BACK TO WFLSWAP. THAT'S IMPORTANT.";
  } else if (videoName === "media/rightfoot.mp4") {
    return "STOP WASTING TIME. GO BACK NOW.";
  } else if (videoName === "media/griefed.mp4") {
    return "THIS IS HOW IT FEELS BEING A BELGIAN FOR 1 SECOND NOW SWITCH ME BACK.";
  }
  return null;
}

// Alternate Steam message
export function altSteamMessage() {
  return "NOW'S NOT THE TIME TO BE PLAYING GAMES.";
}

// Alternate Steam library message
export function altSteamLibraryMessage() {
  return "GET OUT OF HERE.";
}

// Alternate Maya Stress Relief message
export function altMayaStressReliefMessage() {
  return "Perhaps I was too hard on Maya for liking this game. Controlling people IS fun!.";
}

// Alternate Nederlands Mode message
export function altNederlandsModeMessage() {
  return "THIS ISN'T ENOUGH TO CALM ME DOWN.";
}

// Alternate volume zero message
export function altVolumeZeroMessage() {
  return "HER VOICE IS GRATING BUT WE CAN DEAL WITH THAT LATER.";
}

// Alternate Users click message
export function altUsersClickMessage() {
  return "THIS ISN'T HELPING.";
}

// Alternate Mymycraft game message
export function altMymycraftGameMessage() {
  return "AS A CHILD I YEARNED FOR THE MINES BUT NOW I YEARN TO GET OUT OF THIS BELGIAN.";
}

// Alternate experimental mode message
export function altExperimentalModeMessage() {
  return "Thank God... now fix this...";
}

// Alternate WFLGATE message
export function altWFLGateMessage() {
  return "WRONG FILE MONGOLOID.";
}

// Alternate WFLswap message
export function altWFLswapMessage() {
  return "I'll remember every single second of torment that you put me through today.";
}

// Alternate drag message
export function altDragMessage() {
  return "HOW MANY TIMES DO I NEED TO TELL YOU TO STOP PICKING ME UP";
}