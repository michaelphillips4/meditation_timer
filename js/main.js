
const stagesListElement = document.getElementById("stagesList");
const timerElement = document.getElementById("timer");
const nameElement = document.getElementById("name");
const stopButtonElement = document.getElementById("button-stop");
const pauseButtonElement = document.getElementById("button-pause");
const startButtonElement = document.getElementById("button-start");
const saveButtonElement = document.getElementById("button-save");
const meditationElement = document.getElementById("meditation");
const runButtonsElement = document.getElementById("run-buttons");
const savedMeditationsElement = document.getElementById("savedMeditations");
const savedListElement = document.getElementById("savedList");
const addSectionButton = document.getElementById("addSectionButton");
const createButtonElement = document.getElementById("button-create");

const storageKey = "SeriesTimerKey";
let _timer;
let wakeLock = null;
let paused = false
let _chime = new Audio("../sounds/gong.mp3");

// Request permission to use the wake lock API
// This is used to stop the screen from sleeping
const setWakeLock = () => {
  if ("wakeLock" in navigator) {
    navigator.wakeLock.request("screen").then((lock) => {
      wakeLock = lock;
      console.log("Wake Lock is active");
    });
  }
}

// Release the wake lock when the session is stopped
// This is used to stop the screen from sleeping
// and to stop the timer
const releaseWakeLock = () => {
  wakeLock?.release().then(() => {
    console.log("Wake Lock is released");
    wakeLock = null;
  })
}

// Starts the meditation
const start = () => {
  stopButtonElement.classList.remove("hide");
  pauseButtonElement.classList.remove("hide");
  setWakeLock();
  runMeditation();
};

// Stops the meditation
const stop = (message) => {
  clearInterval(this._timer);
  displayTimerValues(message);
  releaseWakeLock();
};

// load the chime sound
const loadChime = (sound) => {
  _chime = new Audio(`../sounds/${sound}`);
  // hack for safari - where sounds are not played without user interaction this seems to work.
   _chime.play();
  _chime.pause();
}

// Display the timer message
const displayTimerValues = (value) => (timerElement.innerHTML = value);

// creates the timer info message
const timeStateMessage = (time, sectionIndex, stages) => {
  const totalTime = stages.reduce((x, y) => x + parseInt(y.duration), 0);

  return `<p>Current Section <b>${sectionIndex + 1}</b> of ${stages.length} Duration ${stages[sectionIndex].duration} min</p> 
   <p>Total Meditation Time <b>${formatTime(time / 60)}:${formatTime(time % 60)}</b> of ${totalTime} mins</p>`
};

const formatTime = (timeValue) => Math.floor(timeValue).toString().padStart(2, '0');

// Get the stages for the meditation
const getStages = () => [...document.querySelectorAll(".time-range")].map((e) => {
  return {
    sound: e.parentElement.querySelector("select").value,
    duration: parseInt(e.value)
  }
}
);


// Run meditation sections
const runMeditation = () => {
  const stages = getStages();
  const totalTime = stages.reduce((x, y) => x + y.duration, 0);

  let currentTotalSeconds = 0;
  let sectionIndex = 0;
  let nextSectionEnd = parseInt(stages[sectionIndex].duration);
  
  loadChime(stages[sectionIndex].sound);

  this._timer = setInterval(() => {

    if (!paused) {
      currentTotalSeconds++;

      displayTimerValues(timeStateMessage(currentTotalSeconds, sectionIndex, stages));

      if (currentTotalSeconds === (nextSectionEnd * 60)) {
        // section ended
        _chime.play();
        if (sectionIndex < (stages.length - 1)) {
          sectionIndex++;
          nextSectionEnd += parseInt(stages[sectionIndex].duration);
         // loadChime(stages[sectionIndex].sound);
        }
      }
      if (currentTotalSeconds >= (totalTime * 60)) {

        // finished
        _chime.play();
        stop("Meditation Finished.");
      }
    }
  }, 1000);
};

// Save the meditation session
// Save the name and stages to local storage
// and reload the page
const save = () => {
  const itemData = {};
  itemData.name = nameElement.value;
  itemData.stages = getStages();
  const data = getSavedItems();
  data.push(itemData);
  localStorage.setItem(storageKey, JSON.stringify(data));
  loadPage();
}

// Show the meditation section/element
const showMeditation = () => {
  meditationElement.classList.remove("hide");
}

// Show the saved meditations section/element
const showSavedMeditations = () => {
  savedMeditationsElement.classList.remove("hide");
}

// Show the meditation section/element
const showMeditationControls = () => {
  runButtonsElement.classList.remove("hide");
}

// Get the saved items from local storage
const getSavedItems = () => JSON.parse(localStorage.getItem(storageKey)) ?? [];


// Load the saved items from local storage
// and set the name and stages
const load = (i) => {
  stagesListElement.innerHTML = "";
  const items = getSavedItems();
  const item = items[i];
  nameElement.value = item.name;
  for (const stage of item.stages) {
    lastSetValue = stage.duration;
    chimeSound = stage.sound;
    addSection();
  }
  showMeditation();
}

// Add a new section to the meditation
const addSection = () => {
  const li = document.createElement("li");
  li.classList.add("section");
  const section = document.createElement("time-section")
  li.appendChild(section);
  stagesListElement.appendChild(li);
  runButtonsElement.classList.remove("hide");
}

// Remove a section from the meditation
const remove = (i) => {
  const data = JSON.parse(localStorage.getItem(storageKey)) ?? [];
  data.splice(i, 1);
  localStorage.setItem(storageKey, JSON.stringify(data));
  loadPage();
}

// Create a new meditation 
const createMeditation = () => {
  nameElement.value = "";
  stagesListElement.innerHTML = "";
  showMeditation();
  addSection();
}

// List the saved items in the saved list
// and add a load and remove button to each item
const listSavedItems = (items) => {
  let out = "";
  let i = 0;
  for (const item of items) {
    out += `<li class="saved-item"> 
           <a href="#" onclick=load(${i})>Load</a> 
           Name : ${item.name} (${item.stages.map(e => e.duration).join("mins,")}mins).
           <i class="fa fa-trash section-remove right" onclick=remove(${i})></i> 
           </li>`;
    i++;
  }
  savedListElement.innerHTML = out;
}

// Load the saved items from local storage
const loadPage = () => {
  const items = getSavedItems();
  listSavedItems(items);
  if (items.length === 0) {
    createMeditation();
    showMeditation();
    savedMeditationsElement.classList.add("hide");
  }
  else {
    showSavedMeditations();
    meditationElement.classList.add("hide");
  }
}

// Add event handlers to the buttons
const addHandlers = () => {
  addSectionButton.addEventListener("click", () => addSection());
  createButtonElement.addEventListener("click", () => createMeditation());
  startButtonElement.addEventListener("click", () => start());
  stopButtonElement.addEventListener("click", () => stop(""));
  saveButtonElement.addEventListener("click", () => save());
  pauseButtonElement.addEventListener("click", () => {
    paused = !paused;
    if (paused) {
      pauseButtonElement.innerHTML = "<i class='fa fa-pause'></i> Resume";
    } else {
      pauseButtonElement.innerHTML = "<i class='fa fa-pause'></i> Pause";
    }
  });
}

// Initialize the app
const init = () => {
  addHandlers();
  loadPage();
  //console.log("page loaded.")
}

// Initialize the app
init();