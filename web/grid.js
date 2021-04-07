var gridFields = new (class {
  constructor() {
    this.style = document.createElement("style");
    this.zoomedField = null;
    document.head.appendChild(this.style);
  }

  toggleFieldZoom() {
    const field = getCurrentField();

    if (typeof this.zoomedField === "number") {
      getEditorField(this.zoomedField).style.gridColumn = "";

      if (field && this.zoomedField === field.ord) {
        // unzoom
        this.zoomedField = null;
        return;
      }
    }

    if (field) {
      this.zoomedField = field.ord;
      getEditorField(this.zoomedField).style.gridColumn = "1 / -1";
    }
  }

  toggleGridFieldsMode() {
    if (this.defaultGrids) {
      bridgeCommand("getGridAreas", this.setCustomAreas.bind(this));
    } else {
      const colCount = document.getElementById("colCount");
      this.setColumnGrids(colCount.value);
    }
  }

  setupColCount() {
    const colCount = document.getElementById("colCount");
    colCount.addEventListener("change", this.setColumnGridsEvent.bind(this));
  }

  getFieldsTemplateColumnsCss(n) {
    const baseValue = 99 / n;
    const templateColumnsValue = Array.apply(0, Array(n))
      .map((_) => `${baseValue}%`)
      .join(" ");

    return `
#fields {
    grid-template-columns: ${templateColumnsValue};
}
`;
  }

  setDefaultColumnGrids() {
    const fields = document.getElementById("fields");

    this.defaultGrids = true;
    this.style.textContent = `
@media (max-width: 350px) { ${this.getFieldsTemplateColumnsCss(1)} }
`;

    if (fields.childElementCount >= 2) {
      this.style.textContent += `
@media (min-width: 350px) { ${this.getFieldsTemplateColumnsCss(2)} }
`;
    }

    if (fields.childElementCount >= 3) {
      this.style.textContent += `
@media (min-width: 700px) { ${this.getFieldsTemplateColumnsCss(3)} }
`;
    }

    if (fields.childElementCount >= 4) {
      this.style.textContent += `
@media (min-width: 1050px) { ${this.getFieldsTemplateColumnsCss(3)} }
`;
    }
  }

  setColumnGrids(value) {
    this.defaultGrids = true;

    switch (value) {
      case 0:
        bridgeCommand("getGridAreas", this.setCustomAreas.bind(this));
        break;
      default:
        this.style.textContent = this.getFieldsTemplateColumnsCss(value);
        break;
    }
  }

  setColumnGridsEvent(event) {
    const value = Number(event.currentTarget.value);
    console.log(value);
    this.setColumnGrids(value);
    console.log(this.style.textContent);
  }

  numberToGridArea(n) {
    return `
#fields > :nth-child(${n}) {
    grid-area: f${n};
}
`;
  }

  areasToCss(areas) {
    const formatted = areas
      .split("\n")
      .map((row) => `"${row}"`)
      .join("\n");

    return `
#fields {
grid-template-areas:
${formatted};
}
`;
  }

  setCustomAreas(areas) {
    if (!areas) {
      const colCount = document.getElementById("colCount");
      this.setColumnGrids(colCount.value);
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
})();
