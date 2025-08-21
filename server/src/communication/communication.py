from dataclasses import dataclass


@dataclass
class Prompt:
    template: str
    purpose: str = None

    def eval(self, **context) -> str:
        if not context:
            return self.template
        try:
            return self.template.format(**context)
        except KeyError as e:
            missing = e.args[0]
            raise ValueError(f"Missing context value for: '{missing}'") from e


@dataclass
class CombinedPrompt:
    prompts: list[Prompt]
    purpose: str

    def eval(self) -> str:
        evaluated_prompts = [prompt.eval() for prompt in self.prompts]
        return '\n\n'.join(evaluated_prompts)


@dataclass
class Response:
    value: str
    purpose: str = None

    def eval(self) -> str:
        return self.value
