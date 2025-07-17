import json
import os

import openai
from dotenv import load_dotenv

from agents.chat_agent import ChatAgent
from communication.lib.prompts import INIT_DIAGNOSTIC_PROMPT
from communication.lib.response import USER_GREETING
from lex.extractor import Extractor
from lex.lib.regex import ANAMNESIS_REGEX
from lex.parsers.anamnesis_parser import AnamnesisParser
from verification.verifier import Verifier

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')  # Or hardcode your key here

# Define Workers
agent = ChatAgent(INIT_DIAGNOSTIC_PROMPT, use_offline=True)
verifier = Verifier(use_offline=True)
extractor = Extractor()
parser = AnamnesisParser()


def main():
    print(USER_GREETING.value)
    first_question = agent.start_conversation('To get started, can you tell me what symptoms or concerns brought you in today?')
    print(f'\n🤖 Nurse:\n{first_question}')

    while True:
        print('\n📝 Your response:')
        user_input = input('> ')

        # Verify user input
        if not verifier.verify(agent.history[-1]['content'], user_input):
            print('⚠️ That response seems unrelated or inappropriate. Please rephrase.')
            continue

        response = agent.send_user_input(user_input)
        print('\n🤖 Nurse:')
        print(response)

        if '<DIAGNOSIS DONE>' in response:
            anamnesis_str = extractor.extract(response, ANAMNESIS_REGEX)
            anamnesis_dict = parser.parse(anamnesis_str)
            with open('anamnesis.json', 'w') as f:
                json.dump(anamnesis_dict, f, indent=2)
            print('\n✅ Anamnesis saved to `anamnesis.json`')
            break


if __name__ == '__main__':
    main()
