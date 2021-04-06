var gridFields = new class {
    constructor() {
        this.style = document.createElement("style");
        this.style.rel = "stylesheet";

        document.head.appendChild(this.style);
        this.setDefaultColumnGrids();
    }

    setDefaultColumnGrids() {
        this.style.textContent = `
@media (max-width: 300px) {
  #fields {
    grid-template-columns: auto;
  }
}

@media (min-width: 300px) {
  #fields {
    grid-template-columns: auto auto;
  }
}

@media (min-width: 700px) {
  #fields {
    grid-template-columns: auto auto auto;
  }
}
`
    }

    numberToGridArea(n) {
        return `
#fields > :nth-child(${n}) {
    grid-area: f${n};
}
`
    }

    setCustomAreas(areas) {
        forEditorFields([], (field) => {
            console.log(field)
        })
    }
}
