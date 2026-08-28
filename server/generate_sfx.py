import wave
import math
import struct
import os

def create_click(filename="public/assets/click.wav", sample_rate=44100):
    duration = 0.07
    num_samples = int(duration * sample_rate)
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        for i in range(num_samples):
            t = i / sample_rate
            env = math.exp(-t * 110)
            val = math.sin(2 * math.pi * 2200 * t) * env
            sample = int(val * 32767 * 0.8)
            wav.writeframesraw(struct.pack('<h', max(-32767, min(32767, sample))))

def create_whoosh(filename="public/assets/whoosh.wav", sample_rate=44100):
    duration = 0.3
    num_samples = int(duration * sample_rate)
    import random
    random.seed(42)
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        for i in range(num_samples):
            t = i / sample_rate
            progress = t / duration
            freq = 250 + 550 * math.sin(math.pi * progress)
            env = math.sin(math.pi * progress) ** 2
            noise = (random.random() * 2 - 1) * 0.4
            tone = math.sin(2 * math.pi * freq * t) * 0.4
            val = (tone + noise) * env * 0.5
            sample = int(val * 32767)
            wav.writeframesraw(struct.pack('<h', max(-32767, min(32767, sample))))

def create_marker_stroke(filename="public/assets/marker_sfx.wav", sample_rate=44100):
    duration = 0.35
    num_samples = int(duration * sample_rate)
    import random
    random.seed(123)
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        for i in range(num_samples):
            t = i / sample_rate
            progress = t / duration
            env = math.sin(math.pi * progress)
            noise = (random.random() * 2 - 1) * 0.35
            tone = math.sin(2 * math.pi * 1100 * t) * 0.2
            val = (tone + noise) * env * 0.4
            sample = int(val * 32767)
            wav.writeframesraw(struct.pack('<h', max(-32767, min(32767, sample))))

def create_brand_outro_chime(filename="public/assets/outro_sfx.wav", sample_rate=44100):
    # Pristine 3-note broadcast logo chime (C5 -> E5 -> G5) + sparkling harmonic decay
    duration = 3.2
    num_samples = int(duration * sample_rate)
    
    notes = [
        {"freq": 523.25, "start": 0.0, "decay": 3.0},   # C5
        {"freq": 659.25, "start": 0.22, "decay": 2.8},  # E5
        {"freq": 783.99, "start": 0.44, "decay": 2.6},  # G5
        {"freq": 1046.50, "start": 0.66, "decay": 2.3}, # C6 bell shimmer
    ]
    
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = i / sample_rate
            val = 0.0
            
            for n in notes:
                if t >= n["start"]:
                    dt = t - n["start"]
                    env = math.exp(-dt * 2.2)
                    # Fundamental + soft octave overtone
                    tone = math.sin(2 * math.pi * n["freq"] * dt) * 0.7 + \
                           math.sin(2 * math.pi * n["freq"] * 2.0 * dt) * 0.25 + \
                           math.sin(2 * math.pi * n["freq"] * 3.0 * dt) * 0.1
                    val += tone * env
            
            val = max(-1.0, min(1.0, val * 0.45))
            sample = int(val * 32767)
            wav.writeframesraw(struct.pack('<hh', sample, sample))

def create_cinematic_news_beat(filename="public/assets/news_beat.wav", duration=65.0, sample_rate=44100):
    # Professional subtle pulsing bass, steady 120 bpm news tension rhythm
    num_samples = int(duration * sample_rate)
    bpm = 120
    beat_interval = 60.0 / bpm  # 0.5 sec
    
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = i / sample_rate
            beat_phase = (t % beat_interval) / beat_interval
            
            # Subtle low sub-bass pulse (55Hz / 110Hz) on each beat
            sub_env = math.exp(-beat_phase * 7)
            sub_bass = (math.sin(2 * math.pi * 55 * t) + 0.5 * math.sin(2 * math.pi * 110 * t)) * sub_env * 0.35
            
            # Soft hi-hat tick on 1/8 notes
            eighth_phase = (t % (beat_interval / 2)) / (beat_interval / 2)
            tick_env = math.exp(-eighth_phase * 35)
            import random
            tick = (random.random() * 2 - 1) * tick_env * 0.04
            
            # Ambient synth pad chord
            chord = (math.sin(2 * math.pi * 174.61 * t) + math.sin(2 * math.pi * 207.65 * t) + math.sin(2 * math.pi * 261.63 * t)) * 0.05
            
            val = sub_bass + tick + chord
            val = max(-1.0, min(1.0, val * 0.42))
            sample = int(val * 32767)
            wav.writeframesraw(struct.pack('<hh', sample, sample))

if __name__ == "__main__":
    os.makedirs("public/assets", exist_ok=True)
    create_click()
    create_whoosh()
    create_marker_stroke()
    create_brand_outro_chime()
    create_cinematic_news_beat()
    print("Clean audio and outro SFX generated successfully.")
