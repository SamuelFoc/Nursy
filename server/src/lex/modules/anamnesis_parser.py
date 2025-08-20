import json
import re
from dataclasses import dataclass
from typing import Any

from src.lex.regex_patterns import ANAMNESIS_REGEX
from src.lex.regex_patterns import DIAGNOSIS_REGEX
from src.lex.regex_patterns import END_FLAG_REGEX
from src.lex.regex_patterns import FLAG_REGEX
from src.lex.regex_patterns import QUESTION_REGEX
from src.lex.regex_patterns import SUGGESTION_REGEX
from src.lex.regex_patterns import Extractor


@dataclass
class ParsedBlocks:
    question: str = ''
    flag: str | None = None
    diagnosis: str | None = None
    suggestion: str | None = None
    _anamnesis: str | None = None
    _end: str | None = None

    @property
    def anamnesis(self) -> dict[str, Any] | None:
        if not self._anamnesis:
            return None
        try:
            return json.loads(self._anamnesis)
        except json.JSONDecodeError:
            try:
                return json.loads(self._anamnesis.strip().strip('`'))
            except Exception:
                return None

    @property
    def end(self) -> bool | None:
        if self._end is None:
            return None
        v = self._end.strip().lower()
        if v in ('true', 'yes', '1'):
            return True
        if v in ('false', 'no', '0'):
            return False


class RegexParser:
    def parse(self, text: str) -> ParsedBlocks:
        raw = text.strip()
        # If no tags at all, treat whole thing as [Q] to avoid UX dead-ends.
        has_any_tag = bool(re.search(r'^\s*\[[QFAISE]\]:', raw, re.MULTILINE))
        if not has_any_tag:
            return ParsedBlocks(q=raw)

        return ParsedBlocks(
            question=Extractor.extract(raw, QUESTION_REGEX),
            flag=Extractor.extract(raw, FLAG_REGEX) or None,
            diagnosis=Extractor.extract(raw, DIAGNOSIS_REGEX) or None,
            suggestion=Extractor.extract(raw, SUGGESTION_REGEX) or None,
            _anamnesis=Extractor.extract(raw, ANAMNESIS_REGEX) or None,
            _end=Extractor.extract(raw, END_FLAG_REGEX) or None,
        )
