const symbols = ["🏺", "⚡", "👑", "🌿", "🪙"];
const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
];
const spinButton = document.getElementById("spinButton");
const result = document.getElementById("result");
const balanceDisplay = document.getElementById("balance");
const betInput = document.getElementById("bet");
const betDisplay = document.getElementById("betDisplay");
const jackpotDisplay = document.getElementById("jackpot");
const muteButton = document.getElementById("muteButton");

// Sound effects
const spinSound = new Audio("slotspin.mp3");
const winSound = new Audio("cash-register-purchase-87313.mp3");
const loseSound = new Audio("080047_lose_funny_retro_video-game-80925.mp3");
<<<<<<< HEAD
const freeSpinSound = new Audio("freespin.mp3");
=======
const freeSpinSound = new Audio("freespin.mp3"); 
>>>>>>> 77eee2089ddd7c2ca67a6813f06b9940dd081cc6

let balance = 100;
let jackpot = 500;
let isMuted = false;
let winCount = 0;
let freeSpins = 0;

// Initialize event listeners
function initEventListeners() {
  betInput.addEventListener("input", updateBetDisplay);
  muteButton.addEventListener("click", toggleMute);
  spinButton.addEventListener("click", spinReels);
}

// Update bet amount display
function updateBetDisplay() {
  betDisplay.textContent = betInput.value;
}

// Mute/unmute sounds
function toggleMute() {
  isMuted = !isMuted;
  muteButton.textContent = isMuted ? "🔇" : "🔊";
}

// Spin the reels
function spinReels() {
  let betAmount = parseInt(betInput.value);

  // Check if there are free spins available
  if (freeSpins > 0) {
    betAmount = 0;
    freeSpins--;
    result.textContent = "You have a free spin!";
    if (!isMuted) freeSpinSound.play();
  } else {
    // Validate bet amount
    if (betAmount < 1 || betAmount > balance) {
      result.textContent = "Invalid bet amount!";
      return;
    }

    // Deduct bet amount and increase jackpot
    balance -= betAmount;
    jackpot += betAmount;
  }

  balanceDisplay.textContent = balance;
  jackpotDisplay.textContent = jackpot;

  // Clear the result display
  result.textContent = "";

  // Play spin sound for 1 second
  if (!isMuted) {
    playSound(spinSound, 1000);
  }

  // Start spin animation
  startSpinAnimation();

  // Stop animation and set final symbols after spin
  setTimeout(stopSpinAnimation.bind(null, betAmount), 1000);
}

// Play sound for a specified duration
function playSound(sound, duration) {
  sound.play();
  setTimeout(() => {
    sound.pause();
    sound.currentTime = 0;
  }, duration);
}

// Start spin animation
function startSpinAnimation() {
  reels.forEach((reel) => {
    reel.classList.add("spinning");
    reel.classList.remove("stopped");
    reel.innerHTML = `<span>${symbols.join("</span><span>")}</span>`;
  });
}

// Stop spin animation and determine result
function stopSpinAnimation(betAmount) {
  reels.forEach((reel) => {
    reel.classList.remove("spinning");
    reel.classList.add("stopped");
    const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    reel.innerHTML = `<span>${finalSymbol}</span>`;
  });

  const outcomes = reels.map((reel) => reel.textContent);
  let winnings = 0;
  let bonusMessage = "";

  // Determine win conditions
  if (new Set(outcomes).size === 1) {
    // Jackpot win
    winnings = jackpot;
    jackpot = 500;
    displayResult(
      `🏆 JACKPOT! You win ${winnings} drachmas.`,
      "You're a hero of Olympus!"
    );
    winCount++;
    if (!isMuted) winSound.play();
  } else if (new Set(outcomes).size === 2) {
    // Partial win
    winnings = betAmount * 2;
    displayResult(`You win ${winnings} drachmas!`);
    if (!isMuted) winSound.play();
  } else {
    // Loss
    displayResult("Better luck next time.", getMotivationalQuote());
    if (!isMuted) loseSound.play();
  }

  // Chance for free spin
  if (Math.random() < 0.1) {
    freeSpins++;
    result.innerHTML += `<div class="bonus">🎉 You won a free spin!</div>`;
  }

  // Update balance and jackpot
  balance += winnings;
  balanceDisplay.textContent = balance;
  jackpotDisplay.textContent = jackpot;
}

// Display result with optional bonus message
function displayResult(message, bonusMessage = "") {
  result.innerHTML = message;
  if (bonusMessage) {
    result.innerHTML += `<div class="bonus">${bonusMessage}</div>`;
  }
}

// Get a random motivational quote
function getMotivationalQuote() {
  const motivationalQuotes = [
    "Don't give up! Success is near!",
    "Every setback is a setup for a comeback.",
    "Keep trying, the jackpot is just around the corner!",
    "The gods favor the brave. Keep going!",
  ];
  return `<div class="motivation">${
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  }</div>`;
}

// Initialize the game
function initGame() {
  balanceDisplay.textContent = balance;
  jackpotDisplay.textContent = jackpot;
  initEventListeners();
}

// Start the game
initGame();
