from typing import Any

from aqt import mw


class ProfileConfig:
    """Can be used for profile-specific settings"""

    def __init__(self, keyword: str, default: Any):
        self.keyword = keyword
        self.default = default

    @property
    def value(self) -> Any:
        return mw.pm.profile.get(self.keyword, self.default)

    @value.setter
    def value(self, new_value: Any):
        mw.pm.profile[self.keyword] = new_value

    def remove(self):
        try:
            del mw.pm.profile[self.keyword]
        except KeyError:
            # same behavior as Collection.remove_config
            pass


toggle_mode = ProfileConfig("gridFieldsToggleMode", "F12")
toggle_zoom = ProfileConfig("gridFieldsToggleZoom", "Shift+F12")


class ModelConfig:
    """Can be used for model-specific settings"""

    def __init__(self, keyword: str, default: Any):
        self.keyword = keyword
        self.default = default

    @property
    def model_id(self) -> int:
        return self.model["id"]

    @model_id.setter
    def model_id(self, model_id: int):
        self.model = mw.col.models.get(model_id)

    @property
    def model_name(self) -> str:
        return self.model["name"]

    @model_name.setter
    def model_name(self, model_name: str):
        model_id = mw.col.models.id_for_name(model_name)
        self.model = mw.col.models.get(model_id)

    @property
    def value(self) -> Any:
        return self.model[self.keyword] if self.keyword in self.model else self.default

    @value.setter
    def value(self, new_value: Any):
        self.model[self.keyword] = new_value

    def remove(self):
        try:
            del self.model[self.keyword]
        except KeyError:
            # same behavior as Collection.remove_config
            pass


# grid areas, if empty string, use auto columns
grid_areas = ModelConfig("gridFieldsGridAreas", "")
