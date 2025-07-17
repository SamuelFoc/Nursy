from dataclasses import dataclass
from dataclasses import field


@dataclass
class Prompt:
    template: str
    purpose: str = None
    context: dict[str, str] = field(default_factory=dict)

    def set_context(self, **kwargs):
        self.context.update(kwargs)

    def render(self) -> str:
        if not self.context:
            return self.template
        try:
            return self.template.format(**self.context)
        except KeyError as e:
            missing = e.args[0]
            raise ValueError(f"Missing context value for: '{missing}'") from e

    def reset_context(self):
        self.context.clear()


@dataclass
class Response:
    value: str
    purpose: str = None
