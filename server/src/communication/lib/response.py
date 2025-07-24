from api.communication.communication import Response

USER_GREETING = Response(
    purpose='Explain the process of information retrieval to the end user.',
    value="""Hello, I'm your virtual nurse.

    I'm here to help collect important information about your current health and how you're feeling. This will help your doctor better understand your condition and improve your diagnosis.
    You DON’T need to provide any personal information like your name or ID. Just describe your current state and what brought you to the doctor today.
    I’ll ask you a few short questions about your symptoms and how you're feeling. Once we're done, I’ll summarize the information for your doctor.
    """,
)
