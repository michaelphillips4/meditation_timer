
const stagesList = document.getElementById("stagesList");

const timerElement = document.getElementById("timer");

const nameElement =  document.getElementById("name");


const _chime = new Audio("section.mp3");

const storageKey = "SeriesTimerKey";

let _timer;

const add = () => addSection(10);

const start = () => {
  _chime.play();
  _chime.pause();
  document.getElementById("button-stop").classList.remove("hide");
  startSession();
};

const stop = () => {
  clearInterval(this._timer);
  displayTimer("");
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
      clearInterval(this._timer);
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
  document.getElementById("meditation").classList.remove("hide");
}

const showSavedMeditations = () => {
  document.getElementById("savedMeditations").classList.remove("hide");
}

const showMeditationControls = () => {
  document.getElementById("run-button").classList.remove("hide");
}

const getSavedItems=()=> JSON.parse(localStorage.getItem(storageKey)) ?? [];

const load = (i) => {
  stagesList.innerHTML = "";
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
  stagesList.appendChild(li);
  section.querySelector(".time-range").value = duration;
  section.querySelector(".section-time").innerHTML = duration;
  document.getElementById("run-buttons").classList.remove("hide");
}

const remove = (i) => {
  const data = JSON.parse(localStorage.getItem(storageKey)) ?? [];
  data.splice(i, 1);
  localStorage.setItem(storageKey, JSON.stringify(data));
  loadPage();
}

const createMeditation =() =>{
  nameElement.value = "";
  stagesList.innerHTML = "";
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
  document.getElementById("saved").innerHTML = out;
}

const loadPage = () => {
  const items = getSavedItems();
  listSavedItems(items);
  if (items.length === 0) {
    createMeditation();
    showMeditation();
    document.getElementById("savedMeditations").classList.add("hide");
  }
  else {
    showSavedMeditations();
    document.getElementById("meditation").classList.add("hide");
  }
}



loadPage();