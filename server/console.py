import json
import os
from datetime import datetime

import openai
from dotenv import load_dotenv
from server.src.lex.lexer import Extractor
from server.src.lex.regex_patterns import ANAMNESIS_REGEX
from server.src.lex.regex_patterns import QUESTION_REGEX

from src.agents.chat_agent import ChatAgent
from src.agents.verification_agent import VerificationAgent
from src.communication.lib.prompts import ANSWER_VERIFICATION_PROMPT
from src.communication.lib.prompts import DIAGNOSTIC_PROMPT
from src.communication.lib.response import USER_GREETING
from src.lex.parsers.anamnesis_parser import AnamnesisParser

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')  # Or hardcode your key here

# Define Agents
chat_agent = ChatAgent(DIAGNOSTIC_PROMPT)
verification_agent = VerificationAgent(ANSWER_VERIFICATION_PROMPT)

extractor = Extractor()
parser = AnamnesisParser()


def main():
    print(USER_GREETING.eval())
    first_question = chat_agent.start_conversation('To get started, can you tell me what symptoms or concerns brought you in today?')
    print(f'\n🤖 Nurse:\n{first_question}')

    while True:
        print('\n📝 Your response:')
        user_input = input('> ')

        if not verification_agent.verify_input(chat_agent.history[-1]['content'], user_input):
            print('⚠️ That response seems unrelated or inappropriate. Please rephrase.')
            continue

        response = chat_agent.send_user_input(user_input)
        question = extractor.extract(response, QUESTION_REGEX)
        if '<LIFE THREATENING SITUATION>' in response:
            print('🤖 Nurse: 🚨 ATTENTION MODE 🚨')
        else:
            print('\n🤖 Nurse:')
        print(question)

        if '<DIAGNOSIS DONE>' in response:
            anamnesis_str = extractor.extract(response, ANAMNESIS_REGEX)
            anamnesis_dict = parser.parse(anamnesis_str)
            time_stamp = datetime.now().strftime('%d_%m_%Y-%H:%M:%S')
            with open(f'patients/anamnesis-{time_stamp}.json', 'w') as f:
                json.dump(anamnesis_dict, f, indent=2)
            print('\n✅ Anamnesis saved to `anamnesis.json`')
            break


if __name__ == '__main__':
    main()
