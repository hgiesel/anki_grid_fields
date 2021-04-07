from aqt.gui_hooks import (
    editor_will_load_note,
    editor_did_init_buttons,
    editor_did_init,
)

from .utils import grid_areas


def show_grid(js, note, editor):
    grid_areas.model = note.model()
    value = grid_areas.value

    return f"{js}; gridFields.setCustomAreas(`{value}`); "


def add_column_number_input(righttopbtns, editor):
    righttopbtns.append(
        """
<label for="colCount">Cols:</label>
<input type="number" value="0" min="0" max="9" name="colCount" id="colCount" />
    """
    )


def init_column_number_input(editor):
    editor.web.eval("gridFields.setupColCount(); ")


def init_editor():
    editor_will_load_note.append(show_grid)
    editor_did_init_buttons.append(add_column_number_input)
    editor_did_init.append(init_column_number_input)
