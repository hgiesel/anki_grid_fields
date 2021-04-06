from aqt import mw
from aqt.editor import Editor

from aqt.gui_hooks import (
    webview_will_set_content,
)


mw.addonManager.setWebExports(__name__, r"(web|icons)/.*\.(js|css|png)")


def number_to_field_name_css(fieldno: int) -> str:
    return f"""
#fields > :nth-child({fieldno}) {{
    grid-area: f{fieldno};
}}
"""

def load_grid_js(webcontent, context):
    if not isinstance(context, Editor):
        return

    addon_package = context.mw.addonManager.addonFromModule(__name__)
    base_path = f"/_addons/{addon_package}/web"

    webcontent.css.append(f"{base_path}/grid.css")
    webcontent.js.append(f"{base_path}/grid.js")


def init_webview():
    webview_will_set_content.append(load_grid_js)
