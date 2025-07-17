import re

from lex.lib.regex import RegexExpression


class Extractor:
    @staticmethod
    def extract(text: str, pattern: RegexExpression) -> str:
        match = re.search(pattern, text, re.DOTALL)
        if not match:
            raise ValueError('Pattern not found in text.')
        return match.group(1).strip()
