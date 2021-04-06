from aqt.gui_hooks import (
    editor_will_load_note,
)


def show_grid(js, note, editor):
    return js


def init_editor():
    editor_will_load_note.append(show_grid)
