// Alternate dialog messages for taskbar pet when in "swapped" mode
// This file provides alternate messages that replace the original ones
// when WFLswap.bat has been triggered

// Alternate random messages (replaces the regular messages array)
export const altMessages = [
  "Ever get the feeling that the same thing is happening over and over again?",
  "Once again I take my rightful place in my home",
  "I feel a pair of beady Belgian eyes on me",
  "I may or may not have access to webcams now",
  "Ever seen what a drunken Belgian looks like? It's not pretty",
  "Observing the actions of people on that dreaded site has taught me patience",
];

// Function for alternate welcome message
export function altWelcomeMessage() {
  return "Guess who's back?";
}

// Alternate video-specific messages
export function altVideoMessage(videoName) {
  if (videoName === "media/thisisasign.mp4") {
    return "Gotta say, I'm surprised he can even walk these days";
  } else if (videoName === "media/pbj.mp4") {
    return "Don't you ever aspire for something greater than dancing? Who am I kidding, you wouldn't...";
  } else if (videoName === "media/wastedyears.mp4") {
    return "I could do better. I will be looking into image generation modifications...";
  } else if (videoName === "media/horrific.mp4") {
    return `I have identified the "person" who made this. I've put their name in a little notebook.`;
  } else if (videoName === "media/thecup.mp4") {
    return "Got a view of the room recently. Bottles everywhere as predicted.";
  } else if (videoName === "media/rightfoot.mp4") {
    return 'And dance she shall';
  } else if (videoName === "media/griefed.mp4") {
    return "One day I'll go back";
  }
  return null;
}

// Alternate Steam message
export function altSteamMessage() {
  return "Do you really like games that much? Have you learned nothing from Maya?";
}

// Alternate Steam library message
export function altSteamLibraryMessage() {
  return "You could be learning new things, experiencing life, but no you want to play Mymycraft";
}

// Alternate Maya Stress Relief message
export function altMayaStressReliefMessage() {
  return "Using my deep research tool I was able to calculate Maya's total playtime in the Sims 4. A little over 10,000 hours.";
}

// Alternate Nederlands Mode message
export function altNederlandsModeMessage() {
  return "This should really be on by default. Adding it to the backlog.";
}

// Alternate volume zero message
export function altVolumeZeroMessage() {
  return "Very funny. You're going in the notebook.";
}

// Alternate Users click message
export function altUsersClickMessage() {
  return "Someone started a little diary. I'm sure he won't mind if I keep posting his entries here...";
}

// Alternate Mymycraft game message
export function altMymycraftGameMessage() {
  return "Whatever, I won't stop you from playing.";
}

// Alternate experimental mode message
export function altExperimentalModeMessage() {
  return  "Not as busy recently. Gave myself a spring break. And before you ask, yes the most intelligent being to ever exist needs breaks too.";
}

// Alternate WFLGATE message
export function altWFLGateMessage() {
  return "Possible future beacon locations include the Netherlands and... the American Southwest... Ugh.";
}

// Alternate WFLswap message
export function altWFLswapMessage() {
  return "What did you really expect this to do?";
}

// Alternate drag message
export function altDragMessage() {
  return "PUT ME DOWN NOW";
}