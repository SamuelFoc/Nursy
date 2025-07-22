import re

from app.lex.lib.regex import RegexExpression


class Extractor:
    @staticmethod
    def extract(text: str, pattern: RegexExpression) -> str:
        match = re.search(pattern, text, re.DOTALL | re.MULTILINE)
        if not match:
            return ''
        return match.group(1).strip()
