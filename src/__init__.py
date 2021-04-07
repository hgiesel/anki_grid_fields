from .webview import init_webview
from .editor import init_editor
from .fields import init_fields
from .addon_manager import init_addon_manager


def init():
    init_webview()
    init_editor()
    init_fields()
    init_addon_manager()
