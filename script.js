// Global Constants
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
// Global Variables
var pattern = [2,2,4,3,2,1,2,4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.4;
var guessCounter = 0;

// Staring and Stopping Game
function startGame()
{
  // initialize game variables
  progress = 0;
  gamePlaying = true;
  
  // swap start and stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  // play clue(s)
  playClueSequence();
}

function stopGame()
{
  // switch game play off
  gamePlaying = false;
  
  // swap stop and start buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis
const freqMap = 
      {
        1: 261.6,
        2: 329.6,
        3: 392,
        4: 525
      }
function playTone(btn, len)
{
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05, 0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function()
            {stopTone()}, len)
}
function startTone(btn)
{
  if(!tonePlaying)
    {
      context.resume()
      o.frequency.value = freqMap[btn]
      g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
      context.resume()
      tonePlaying = true
    }
}
function stopTone()
{
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
  tonePlaying = false
}

// Page Initializer
// Initialize Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)

// Lighting and Clearing Buttons
function lightButton(btn)
{
  document.getElementById("button" + btn).classList.add("lit")
}
function clearButton(btn)
{
  document.getElementById("button" + btn).classList.remove("lit")
}

// Playing Clues
function playSingleClue(btn)
{
  if(gamePlaying)
    {
      lightButton(btn);
      playTone(btn, clueHoldTime);
      setTimeout(clearButton, clueHoldTime, btn);
    }
}
function playClueSequence()
{
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime;
  for(let i = 0; i < progress; i++)
    {
      console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
      setTimeout(playSingleClue, delay, pattern[i])
      delay += clueHoldTime
      delay += cluePauseTime;
    }
}

// Winning or Losing
function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
}
function winGame()
{
  stopGame();
  alert("Game Over. You won!")
}

// Handling Guesses
function guess(btn)
{
  console.log("user guessed: " + btn);
  if(!gamePlaying)
    {return;}
  if(btn == pattern[guessCounter])
    {
      // correct guess
      if(guessCounter == progress)
        {
          // check for next turn or end of game
          if(progress == pattern.length - 1)
            {
              // end of game
              winGame();
            }
          else
            {
              // next turn
              progress++;
              playClueSequence();
            }
        }
      else
        {
          // continue current turn
          guessCounter++;
        }
    }
  else
    {
      // incorrect guess
      loseGame();
    }
}