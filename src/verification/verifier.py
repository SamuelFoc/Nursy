from agents.verification_agent import VerificationAgent


class Verifier:
    def __init__(self, use_offline: bool = False):
        self.agent = VerificationAgent(use_offline=use_offline)

    def verify(self, question: str, user_input: str) -> bool:
        result = self.agent.verify_input(question, user_input)
        return result.lower() == 'true'
