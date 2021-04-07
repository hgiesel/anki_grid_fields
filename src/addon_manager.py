from typing import Optional

from aqt import mw
from aqt.addons import AddonsDialog
from aqt.gui_hooks import addons_dialog_will_show

from ..gui.settings import Settings

from .utils import (
    toggle_mode,
    toggle_zoom,
)


def set_settings(
    toggle_mode_shortcut: str,
    toggle_zoom_shortcut: str,
):
    toggle_mode.value = toggle_mode_shortcut
    toggle_zoom.value = toggle_zoom_shortcut


addons_current: Optional[AddonsDialog] = None


def save_addons_window(addons):
    global addons_current
    addons_current = addons


def show_settings():
    dialog = Settings(addons_current, set_settings)

    dialog.setupUi(
        toggle_mode.value,
        toggle_zoom.value,
    )
    return dialog.open()


def init_addon_manager():
    addons_dialog_will_show.append(save_addons_window)
    mw.addonManager.setConfigAction(__name__, show_settings)
