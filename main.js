
const stagesList = document.getElementById("stagesList");

const timerElement = document.getElementById("timer");

const _chime = new Audio("section.mp3");

let _timer;

const add = () => {

  const li = document.createElement("li");
  li.appendChild(document.createElement("time-section"));
  stagesList.appendChild(li);
  document.getElementById("run-buttons").classList.remove("hide");
};

const start = () => {
  _chime.play();
  _chime.pause();
  document.getElementById("stop-button").classList.remove("hide");
  startSession();
};

const stop = () => {
  clearInterval(this._timer);
  displayTimer("");
};

const chime = () => {
   _chime.play();
};

const displayTimer = (value) => (timerElement.innerHTML = value);

const timeStateMessage = (time,sectionIndex,stages)=>
{
  const m =  Math.floor(time / 60);
  const s = time % 60;

   return `Section ${sectionIndex + 1} - 
       Duration ${stages[sectionIndex]} min - 
       Time ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  

}



const startSession = () => {
  const stages = [...document.querySelectorAll(".time-range")].map((e) =>
    parseInt(e.value)
  );
  const totalTime = stages.reduce((x, y) => x + y, 0) ;

  let time = 0;
  let sectionIndex = 0;
  let sectionTime = parseInt(stages[sectionIndex]);

  this._timer = setInterval(() => {
    time++;
   
    displayTimer(timeStateMessage(time,sectionIndex,stages));
       
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
 