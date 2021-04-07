from aqt.fields import FieldDialog
from aqt.qt import QPushButton, QPlainTextEdit, qconnect
from aqt.utils import getText

from anki.hooks import wrap
from .utils import grid_areas


prompt = """
Setting grid areas.
Fields are indexed by "f<n>",  for example "f1" for first field,  or "f2" for second field.
The following example will make f1 occupy the first row,  f2 and f3 the second and f4 in the bottom row:

f1 f1 f1
f2 f2 f3
f4 f4 f4

Make sure to use *all field identifiers*.  For example,  if you have 5 fields,  you should use f1 to f5.
Make sure to use the same amount of field identifiers per row.
Delete everything for grid columns by default.
""".strip()


class QAnkiTextEdit(QPlainTextEdit):
    def text(self):
        return self.toPlainText()

    def setText(self, text):
        self.setPlainText(text)


def process_grid_areas(text: str) -> str:
    return text.strip()


def add_grids_button(self):
    self.gridButton = QPushButton("Grid")
    grid_areas.model = self.model

    def set_grid_areas():
        text, success = getText(
            title="Grid Fields",
            prompt=prompt,
            default=grid_areas.value,
            edit=QAnkiTextEdit(),
        )

        if success:
            grid_areas.value = process_grid_areas(text)

    qconnect(self.gridButton.clicked, set_grid_areas)

    self.form.verticalLayout_3.insertWidget(
        self.form.verticalLayout_3.count() - 1,
        self.gridButton,
    )


def init_fields():
    # setupSignals is called before executing QDialog
    FieldDialog.setupSignals = wrap(FieldDialog.setupSignals, add_grids_button, "after")
