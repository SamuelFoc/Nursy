import openai
from openai.types.chat import ChatCompletionSystemMessageParam

from src.agents.chat_agent import Message
from src.communication.communication import Prompt


class VerificationAgent:
    def __init__(self, system_prompt: Prompt, model='gpt-4', temperature=0):
        self.model = model
        self.temperature = temperature
        self.system_prompt = system_prompt

    def verify_input(self, question: Message, input: Message) -> bool:
        response = openai.chat.completions.create(
            model=self.model,
            messages=[ChatCompletionSystemMessageParam(role='system', content=self.system_prompt.eval(question=question.content, user_input=input.content))],
            temperature=self.temperature,
        )

        str_bool = response.choices[0].message.content
        return str_bool == 'True'
