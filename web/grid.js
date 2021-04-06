var gridFields = new class {
    constructor() {
        this.style = document.createElement("style");

        document.head.appendChild(this.style);
    }

    setDefaultColumnGrids() {
        const fields = document.getElementById("fields");

        this.style.textContent = `
@media (max-width: 300px) {
  #fields {
    grid-template-columns: 1fr;
  }
}
`

        if (fields.childElementCount >= 2) {
            this.style.textContent += `
@media (min-width: 300px) {
  #fields {
    grid-template-columns: 1fr 1fr;
  }
}
`
        }

        if (fields.childElementCount >= 3) {
            this.style.textContent += `
@media (min-width: 700px) {
  #fields {
    grid-template-columns: 1fr 1fr 1fr;
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
        let css = "";

        forEditorField([], (field) => {
            css += this.numberToGridArea(field.editingArea.ord + 1);
        });

        css += this.areasToCss(areas);

        this.style.textContent = css;
    }
}
