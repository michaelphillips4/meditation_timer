class TimeSectionComponent extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById("time-section-template");
        const clone = template.content.cloneNode(true);

        const timeElement = clone.querySelector(".section-time");
        const sectionLabelElement = clone.querySelector("label");
        const rangeElement = clone.querySelector(".time-range");
        const removeButton = clone.querySelector(".section-remove");
        
        const sectionCount = document.querySelectorAll(".section").length
        
        const inputName = `section-range-${sectionCount}`;  

        rangeElement.id =  inputName;
        sectionLabelElement.htmlFor = inputName;

           
        rangeElement.addEventListener(
            "input",
            (event) => (timeElement.innerText = event.target.value)
        );
        removeButton.addEventListener("click", (event) => {
            event.target.parentElement.closest("li").remove();
        });

        this.innerHTML = "";
        this.appendChild(clone);
    }
}

customElements.define("time-section", TimeSectionComponent);