import openai

from app.communication.communication import Prompt


class VerificationAgent:
    def __init__(self, system_prompt: Prompt, model='gpt-4', temperature=0, use_offline: bool = False):
        self.model = model
        self.temperature = temperature
        self.system_prompt = system_prompt
        self.use_offline = use_offline

    def verify_input(self, question: str, user_input: str) -> str:
        if self.use_offline:
            return 'True'

        response = openai.chat.completions.create(
            model=self.model,
            messages=[{'role': 'user', 'content': self.system_prompt.eval(question=question, user_input=user_input)}],
            temperature=self.temperature,
        )

        str_bool = response.choices[0].message.content
        return str_bool == 'True'
