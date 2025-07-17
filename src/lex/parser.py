from abc import ABC
from abc import abstractmethod


class Parser(ABC):
    @abstractmethod
    def parse(self) -> dict:
        pass
