import re

from lex.parser import Parser


class AnamnesisParser(Parser):
    def parse(self, text: str) -> dict[str, str]:
        lines = text.splitlines()
        anamnesis = {}
        for line in lines:
            match = re.match(r'\*\s*(.+?):\s*(.*)', line)
            if match:
                key = match.group(1).strip()
                value = match.group(2).strip()
                anamnesis[key] = value
        return anamnesis
