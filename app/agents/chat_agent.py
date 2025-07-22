import openai
from app.communication.communication import Prompt


class ChatAgent:
    def __init__(self, system_prompt: Prompt, model: str = 'gpt-4', temperature: float = 0.3, use_offline: bool = False):
        self.model = model
        self.temperature = temperature
        self.history = [{'role': 'system', 'content': system_prompt.eval()}]
        self.use_offline = use_offline

    def start_conversation(self, first_message: str):
        self.history.append({'role': 'assistant', 'content': first_message})
        return first_message

    def send_user_input(self, user_input: str) -> str:
        self.history.append({'role': 'user', 'content': user_input})
        response = self._mock_response() if self.use_offline else self._call_openai()
        self.history.append({'role': 'assistant', 'content': response})
        return response

    def _call_openai(self) -> str:
        response = openai.chat.completions.create(
            model=self.model,
            messages=self.history,
            temperature=self.temperature,
        )
        return response.choices[0].message.content

    def _mock_response(self) -> str:
        return '<Response>'  # Dummy placeholder
