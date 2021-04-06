from aqt.gui_hooks import (
    editor_will_load_note,
)

from .utils import grid_areas


def show_grid(js, note, editor):
    grid_areas.model = note.model()
    value = grid_areas.value

    return f"{js}; gridFields.setCustomAreas(`{value}`); "


def init_editor():
    editor_will_load_note.append(show_grid)
