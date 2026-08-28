import asyncio
import os
import edge_tts

VOICES = [
    {"id": "en-US-GuyNeural", "name": "Guy (American - Energetic News Anchor)", "gender": "Male", "tags": "News, Viral, Fast"},
    {"id": "en-US-ChristopherNeural", "name": "Christopher (American - Authoritative Broadcaster)", "gender": "Male", "tags": "Deep, Formal, News"},
    {"id": "en-US-AndrewNeural", "name": "Andrew (American - Modern Tech & Finance Host)", "gender": "Male", "tags": "Natural, Confident"},
    {"id": "en-US-EricNeural", "name": "Eric (American - High Energy Presenter)", "gender": "Male", "tags": "Fast, Engaging"},
    {"id": "en-US-BrianNeural", "name": "Brian (American - Deep Documentary Narration)", "gender": "Male", "tags": "Deep, Serious"},
    {"id": "en-US-RogerNeural", "name": "Roger (American - Wall Street Analyst)", "gender": "Male", "tags": "Mature, Financial"},
    {"id": "en-US-SteffanNeural", "name": "Steffan (American - Dynamic Storyteller)", "gender": "Male", "tags": "Conversational"},
    {"id": "en-GB-RyanNeural", "name": "Ryan (British - BBC Style News Anchor)", "gender": "Male", "tags": "British, Formal"},
    {"id": "en-GB-ThomasNeural", "name": "Thomas (British - Refined Financial Host)", "gender": "Male", "tags": "British, Smooth"},
    {"id": "en-US-AriaNeural", "name": "Aria (American - Breaking News Female Host)", "gender": "Female", "tags": "Female, News, Crisp"},
    {"id": "en-US-AvaNeural", "name": "Ava (American - Expressive Female Presenter)", "gender": "Female", "tags": "Female, Modern"},
    {"id": "en-US-JennyNeural", "name": "Jenny (American - Clear Narrative Host)", "gender": "Female", "tags": "Female, Friendly"},
    {"id": "en-US-EmmaNeural", "name": "Emma (American - Business & Tech Reporter)", "gender": "Female", "tags": "Female, Confident"},
    {"id": "en-IN-PrabhatNeural", "name": "Prabhat (Indian English - News Presenter)", "gender": "Male", "tags": "Indian, Clear"},
    {"id": "en-IN-NeerjaNeural", "name": "Neerja (Indian English - Expressive Host)", "gender": "Female", "tags": "Indian, Female"},
    {"id": "en-AU-WilliamMultilingualNeural", "name": "William (Australian - News Host)", "gender": "Male", "tags": "Australian, Natural"}
]

SAMPLE_TEXT = "Big Breaking Wire: Bringing you fast, breaking market news and world developments."

async def generate_samples():
    output_dir = "public/audio/samples"
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Generating preview audio samples for {len(VOICES)} open source neural voices...")
    
    for v in VOICES:
        out_file = os.path.join(output_dir, f"{v['id']}.mp3")
        if not os.path.exists(out_file):
            print(f"Generating sample for {v['id']}...")
            communicate = edge_tts.Communicate(SAMPLE_TEXT, v['id'], rate="+8%")
            await communicate.save(out_file)
    
    print("All voice preview samples generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate_samples())
