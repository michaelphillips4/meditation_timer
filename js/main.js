
const stagesListElement = document.getElementById("stagesList");
const timerElement = document.getElementById("timer");
const nameElement = document.getElementById("name");
const stopButtonElement = document.getElementById("button-stop");
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

const _chime = new Audio("../gong.mp3");

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
  _chime.play();
  _chime.pause();
  stopButtonElement.classList.remove("hide");
  setWakeLock();
  startSession();
};

// Stops the meditation
const stop = () => {
  clearInterval(this._timer);
  displayTimer("");
  releaseWakeLock();
};

// Play the gong sound
const chime = () => _chime.play();

// Display the timer message
const displayTimer = (value) => (timerElement.innerHTML = value);

// creates the timer info message
const timeStateMessage = (time, sectionIndex, stages) =>
  `<p>Current Section : ${sectionIndex + 1} (${stages[sectionIndex]} min)</p> 
   <p>Total Time : ${(Math.floor(time / 60)).toString().padStart(2, '0')}:
            ${(time % 60).toString().padStart(2, '0')}</p>`;


// Get the stages for the meditation
const getStages = () => [...document.querySelectorAll(".time-range")].map((e) =>
  parseInt(e.value)
);


// Run meditation sections
const startSession = () => {
  const stages = getStages();
  const totalTime = stages.reduce((x, y) => x + y, 0);

  let time = 0;
  let sectionIndex = 0;
  let sectionTime = parseInt(stages[sectionIndex]);

  this._timer = setInterval(() => {
    time++;

    displayTimer(timeStateMessage(time, sectionIndex, stages));

    if (time === (sectionTime * 60)) {
      sectionIndex++;
      sectionTime += parseInt(stages[sectionIndex]);
      //section ended
      chime();
    }
    if (time >= (totalTime * 60)) {
      displayTimer("finished ");
      // finished
      chime();
      stop();
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
  for (const duration of item.stages) {
    addSection(duration);
  }
  showMeditation();
}

// Add a new section to the meditation
const addSection = (duration) => {
  const li = document.createElement("li");
  li.classList.add("section");
  const section = document.createElement("time-section")
  li.appendChild(section);
  stagesListElement.appendChild(li);
  section.querySelector(".time-range").value = duration;
  section.querySelector(".section-time").innerHTML = duration;
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
  addSection(10);
}

// List the saved items in the saved list
// and add a load and remove button to each item
const listSavedItems = (items) => {
  let out = "";
  let i = 0;
  for (const item of items) {
    out += `<li class="saved-item"> 
           <a href="#" onclick=load(${i})>Load</a> 
           Name : ${item.name} (${item.stages.join("mins,")}mins).
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
  addSectionButton.addEventListener("click", () => addSection(10));
  createButtonElement.addEventListener("click", () => createMeditation());
  startButtonElement.addEventListener("click", () => start());
  stopButtonElement.addEventListener("click", () => stop());
  saveButtonElement.addEventListener("click", () => save());
}

// Initialize the app
const init = () => {
  addHandlers();
  loadPage();
  console.log("page loaded.")
}

// Initialize the app
init();