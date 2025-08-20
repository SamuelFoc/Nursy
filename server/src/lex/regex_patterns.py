import re
from typing import NewType

RegexExpression = NewType('RegexExpression', str)


class Extractor:
    @staticmethod
    def extract(text: str, pattern: RegexExpression) -> str:
        match = re.search(pattern, text, re.DOTALL | re.MULTILINE)
        if not match:
            return ''
        return match.group(1).strip()


# --- REGEX EXPRESSIONS ---


QUESTION_REGEX = r'\[Q\]:\s*(.*?)(?=\n\[|$)'

ANAMNESIS_REGEX = r'\[A\]:\s*(\{.*?\})(?=\n\[|$)'

FLAG_REGEX = r'\[F\]:\s*(.*?)(?=\n\[|$)'

DIAGNOSIS_REGEX = r'\[D\]:\s*(.*?)(?=\n\[|$)'

SUGGESTION_REGEX = r'\[S\]:\s*(.*?)(?=\n\[|$)'

END_FLAG_REGEX = r'\[E\]:\s*(.*?)(?=\n\[|$)'
