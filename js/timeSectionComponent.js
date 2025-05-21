class TimeSectionComponent extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById("time-section-template");
        const clone = template.content.cloneNode(true);

        const timeElement = clone.querySelector(".section-time");
        const sectionLabelElement = clone.querySelector(".section-range-label");
        const rangeElement = clone.querySelector(".time-range");
        const removeButton = clone.querySelector(".section-remove");
        const soundSelectElement = clone.querySelector(".sound-select");
        const soundSelectLabelElement = clone.querySelector(".sound-select-label");
        const sectionCount = document.querySelectorAll(".section").length

        const inputName = `section-range-${sectionCount}`;

        rangeElement.id = inputName;
        sectionLabelElement.htmlFor = inputName;

        const soundSelectName = `sound-select-${sectionCount}`;

        soundSelectElement.id = soundSelectName;
        soundSelectLabelElement.htmlFor = soundSelectName;
soundSelectElement.value = chimeSound;


        rangeElement.value = lastSetValue;
        timeElement.innerText = lastSetValue;
        sectionLabelElement.htmlFor = inputName;


        rangeElement.addEventListener(
            "input",
            (event) => {
                timeElement.innerText = event.target.value;
                lastSetValue = event.target.value;
            }
        );
        removeButton.addEventListener("click", (event) => {
            event.target.parentElement.closest("li").remove();
        });


    soundSelectElement.addEventListener("change", (event) => {
         const x = new Audio("../sounds/" + event.target.value +".mp3" );
         x.play();
        });

        this.innerHTML = "";
        this.appendChild(clone);
    }
}
let chimeSound = "Bowl";
let lastSetValue = 10; // Default value for the range input this is updated to preserve the last set value
customElements.define("time-section", TimeSectionComponent);