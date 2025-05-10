
const stagesListElement = document.getElementById("stagesList");
const timerElement = document.getElementById("timer");
const nameElement =  document.getElementById("name");
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

const _chime = new Audio("section.mp3");

const setWakeLock = () => {
  if ("wakeLock" in navigator) {
  navigator.wakeLock.request("screen").then((lock) => {
    wakeLock = lock;
    console.log("Wake Lock is active");
  });
}
}

const releaseWakeLock = () => {
  wakeLock?.release().then(() => {
    console.log("Wake Lock is released");
    wakeLock = null;
  })
}

const start = () => {
  _chime.play();
  _chime.pause();
  stopButtonElement.classList.remove("hide");
  setWakeLock();
  startSession();
};

const stop = () => {
  clearInterval(this._timer);
  displayTimer("");
  releaseWakeLock();
};

const chime = () => _chime.play();

const displayTimer = (value) => (timerElement.innerHTML = value);

const timeStateMessage = (time, sectionIndex, stages) =>
  `<p>Current Section : ${sectionIndex + 1} (${stages[sectionIndex]} min)</p> 
   <p>Total Time : ${(Math.floor(time / 60)).toString().padStart(2, '0')}:
            ${(time % 60).toString().padStart(2, '0')}</p>`;

const getStages = () => [...document.querySelectorAll(".time-range")].map((e) =>
  parseInt(e.value)
);

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

const save = () => {
  const itemData = {};
  itemData.name = nameElement.value;
  itemData.stages = getStages();
  const data = getSavedItems();
  data.push(itemData);
  localStorage.setItem(storageKey, JSON.stringify(data));
  loadPage();
}

const showMeditation = () => {
  meditationElement.classList.remove("hide");
}

const showSavedMeditations = () => {
  savedMeditationsElement.classList.remove("hide");
}

const showMeditationControls = () => {
  runButtonsElement.classList.remove("hide");
}

const getSavedItems=()=> JSON.parse(localStorage.getItem(storageKey)) ?? [];

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

const remove = (i) => {
  const data = JSON.parse(localStorage.getItem(storageKey)) ?? [];
  data.splice(i, 1);
  localStorage.setItem(storageKey, JSON.stringify(data));
  loadPage();
}

const createMeditation =() =>{
  nameElement.value = "";
  stagesListElement.innerHTML = "";
  showMeditation();
  addSection(10);
}

const listSavedItems = (items) =>{
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

const addHandlers =()=>{
  addSectionButton.addEventListener("click",()=>addSection(10));
  createButtonElement.addEventListener("click", ()=> createMeditation());
  startButtonElement.addEventListener("click",()=> start());
  stopButtonElement.addEventListener("click",()=> stop());
  saveButtonElement.addEventListener("click",()=> save());
}


const init = ()=>{
addHandlers();
loadPage();
console.log("page loaded.")
} 

init();