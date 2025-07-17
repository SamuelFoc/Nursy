import openai

from communication.lib.prompts import ANSWER_VERIFICATION_PROMPT


class VerificationAgent:
    def __init__(self, model='gpt-4', temperature=0, use_offline: bool = False):
        self.model = model
        self.temperature = temperature
        self.use_offline = use_offline

    def verify_input(self, question: str, user_input: str) -> str:
        if self.use_offline:
            return 'True'

        ANSWER_VERIFICATION_PROMPT.set_context(
            question=question,
            user_input=user_input,
        )

        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[{'role': 'user', 'content': ANSWER_VERIFICATION_PROMPT.render()}],
            temperature=self.temperature,
        )

        str_bool = response.choices[0].message['content'].strip()
        return str_bool == 'True'
