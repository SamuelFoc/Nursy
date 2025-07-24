from typing import NewType

RegexExpression = NewType('RegexExpression', str)


ANAMNESIS_REGEX = r'\*\*Anamnesis:\*\*\n+(.*?)\n(?=(\*{2}|$))'

QUESTION_REGEX = r'^(.*?)(?=^\s*---\s*$)'
