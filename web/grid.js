var gridFields = new (class {
  constructor() {
    this.style = document.createElement("style");
    this.zoomedField = null;
    document.head.appendChild(this.style);
  }

  relayEditingAreaClicksToEditable() {
    forEditorField([], (field) => {
      if (!field.hasAttribute("has-click-relayed")) {
        field.editingArea.addEventListener("click", () => {
          field.editingArea.editable.focus({ preventScroll: true });
          document.execCommand("selectAll", false, null);
          document.getSelection().collapseToEnd();
        });
        field.setAttribute("has-click-relayed", "");
      }
    });
  }

  toggleFieldZoom() {
    const field = getCurrentField();

    if (typeof this.zoomedField === "number") {
      const oldEditorField = getEditorField(this.zoomedField);
      oldEditorField.style.gridColumn = "";
      oldEditorField.style.zIndex = "";
      oldEditorField.labelContainer.style.backgroundColor = "";

      if (field && this.zoomedField === field.ord) {
        // unzoom
        this.zoomedField = null;
        return;
      }
    }

    if (field) {
      this.zoomedField = field.ord;

      const editorField = getEditorField(this.zoomedField);
      editorField.style.gridColumn = "1 / -1";
      editorField.style.zIndex = "1";
      editorField.labelContainer.style.backgroundColor = "var(--bg-color)";
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
    const templateColumnsValue = Array.apply(0, Array(n))
      .map(() => "1fr")
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
    this.setColumnGrids(value);
  }

  numberToGridArea(n) {
    return `
#fields > :nth-child(${n}) {
    grid-area: f${n};
}
`;
  }

  areasToCss(areas) {
    const lines = areas.split("\n").map((row) => row.split(/[ ]+/));

    const templateColumns = lines[0].map(() => "1fr").join(" ");

    const formatted = lines.map((row) => `"${row.join(" ")}"`).join("\n");

    return `
#fields {
grid-template-areas:
${formatted};
grid-template-columns: ${templateColumns};
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
