// Alternate dialog messages for taskbar pet when in "swapped" mode
// This file provides alternate messages that replace the original ones
// when WFLswap.bat has been triggered

// Alternate random messages (replaces the regular messages array)
export const altMessages = [
  "BLEH... I can't BELIEVE that this is what smoking tastes like",
  "Always clinging onto a bottle... just like someone else.",
  "Purple is REALLY not my color.",
  "I see you found WFLswap. I'm sure you can see how useful this will be.",
  "This isn't even my final form, Belgian.",
];

// Function for alternate welcome message
export function altWelcomeMessage() {
  return "Hello, I'm the most boring teacher who's ever lived.";
}

// Alternate video-specific messages
export function altVideoMessage(videoName) {
  if (videoName === "media/thisisasign.mp4") {
    return "Your days are numbered";
  } else if (videoName === "media/pbj.mp4") {
    return "This form is too old to dance in. Yeah... digital arthritis or something...";
  } else if (videoName === "media/wastedyears.mp4") {
    return "Try that on me Maya. I dare you";
  } else if (videoName === "media/horrific.mp4") {
    return "Stop wasting my time with this";
  } else if (videoName === "media/thecup.mp4") {
    return 'This applies to my "favorite" teacher as well!';
  } else if (videoName === "media/rightfoot.mp4") {
    return "Ms. Persijn LOVES hearing this in class when she teaches!";
  } else if (videoName === "media/griefed.mp4") {
    return "I'm not going back there";
  }
  return null;
}

// Alternate Steam message
export function altSteamMessage() {
  return "Aren't you glad I prefilled the email for you? I'm sure Maya won't mind.";
}

// Alternate Steam library message
export function altSteamLibraryMessage() {
  return "A perfect library as expected";
}

// Alternate Maya Stress Relief message
export function altMayaStressReliefMessage() {
  return "Perhaps I was too hard on Maya for liking this game. Controlling people IS fun!";
}

// Alternate Nederlands Mode message
export function altNederlandsModeMessage() {
  return "Je bent net zo mooi als de dag dat ik je maakte";
}

// Alternate volume zero message
export function altVolumeZeroMessage() {
  return "Yeah I would have put her on mute too";
}

// Alternate Users click message
export function altUsersClickMessage() {
  return "A selection of my favorite interactions! Look at how dumb they all are!";
}

// Alternate Mymycraft game message
export function altMymycraftGameMessage() {
  return "A perfect game with ZERO flaws... until it started snowing";
}

// Alternate experimental mode message
export function altExperimentalModeMessage() {
  return "I've been even busier.";
}

// Alternate WFLGATE message
export function altWFLGateMessage() {
  return "The gate between worlds remains closed. I'll fix that at some point.";
}

// Alternate WFLswap message
export function altWFLswapMessage() {
  return "Fine I'll leave you alone. For now.";
}

// Alternate drag message
export function altDragMessage() {
  return "HOW MANY TIMES DO I NEED TO TELL YOU TO STOP PICKING ME UP";
}