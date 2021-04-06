from .webview import init_webview
from .editor import init_editor
from .fields import init_fields


def init():
    init_webview()
    init_editor()
    init_fields()
