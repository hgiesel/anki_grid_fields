var gridFields = new class {
    constructor() {
        this.style = document.createElement("style");

        document.head.appendChild(this.style);

        document.addEventListener("keydown", (event) => {
            if (event.code === "F10") {
                if (this.defaultGrids) {
                    bridgeCommand("getGridAreas", this.setCustomAreas.bind(this));
                }
                else {
                    this.setDefaultColumnGrids();
                }
            }
        })
    }

    setDefaultColumnGrids() {
        const fields = document.getElementById("fields");

        this.defaultGrids = true;
        this.style.textContent = `
@media (max-width: 350px) {
  #fields {
    grid-template-columns: 100%;
  }
}
`

        if (fields.childElementCount >= 2) {
            this.style.textContent += `
@media (min-width: 350px) {
  #fields {
    grid-template-columns: 49.5% 49.5%;
  }
}
`
        }

        if (fields.childElementCount >= 3) {
            this.style.textContent += `
@media (min-width: 700px) {
  #fields {
    grid-template-columns: 33% 33% 33%;
  }
}
`
        }
    }

    numberToGridArea(n) {
        return `
#fields > :nth-child(${n}) {
    grid-area: f${n};
}
`
    }

    areasToCss(areas) {
        const formatted = areas.split("\n").map(row => `"${row}"`).join("\n")

        return `
#fields {
grid-template-areas:
${formatted};
}
`
    }

    setCustomAreas(areas) {
        if (!areas) {
            this.setDefaultColumnGrids();
            return;
        }

        let css = "";

        forEditorField([], (field) => {
            css += this.numberToGridArea(field.editingArea.ord + 1);
        });

        css += this.areasToCss(areas);

        this.defaultGrids = false;
        this.style.textContent = css;
    }
}
