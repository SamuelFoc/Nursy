import openai
import asyncio
from typing import AsyncGenerator
from communication.communication import Prompt


class ChatAgent:
    def __init__(self, system_prompt: Prompt, model: str = 'gpt-4', temperature: float = 0.3):
        self.model = model
        self.temperature = temperature
        self.history = [{'role': 'system', 'content': system_prompt.eval()}]
        self._lock = asyncio.Lock()
        self._is_generating = False

    def start_conversation(self, first_message: str) -> str:
        if self._is_generating:
            raise RuntimeError("Agent is currently generating a response. Please wait.")
        self.history.append({'role': 'assistant', 'content': first_message})
        return first_message

    async def send_user_input(self, user_input: str) -> AsyncGenerator[str, None]:
        """Send user input and return an async generator for streaming response."""
        if self._is_generating:
            raise RuntimeError("Agent is currently generating a response. Please wait.")
            
        async with self._lock:
            self._is_generating = True
            try:
                self.history.append({'role': 'user', 'content': user_input})
                async for chunk in self._call_openai_stream():
                    yield chunk
            finally:
                self._is_generating = False

    async def _call_openai_stream(self) -> AsyncGenerator[str, None]:
        """Streaming OpenAI call that yields chunks and updates history."""
        response_content = ""
        
        stream = openai.chat.completions.create(
            model=self.model,
            messages=self.history,
            temperature=self.temperature,
            stream=True,
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                response_content += content
                yield content
        
        # Add complete response to history after streaming is done
        self.history.append({'role': 'assistant', 'content': response_content})

    def get_conversation_history(self) -> list:
        """Get the current conversation history."""
        if self._is_generating:
            raise RuntimeError("Agent is currently generating a response. Please wait.")
        return [msg for msg in self.history if msg['role'] != 'system']

    def clear_history(self, keep_system_prompt: bool = True) -> None:
        """Clear conversation history, optionally keeping the system prompt."""
        if self._is_generating:
            raise RuntimeError("Agent is currently generating a response. Please wait.")
            
        if keep_system_prompt and self.history:
            self.history = [self.history[0]]  # Keep only system prompt
        else:
            self.history = []
    
    @property
    def is_generating(self) -> bool:
        """Check if the agent is currently generating a response."""
        return self._is_generating
