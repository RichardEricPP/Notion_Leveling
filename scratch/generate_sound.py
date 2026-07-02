import wave
import struct
import math
import os

sample_rate = 44100
duration = 0.5 # seconds
freq1 = 440.0
freq2 = 880.0

out_dir = r'c:\Users\Lenovo\Documents\Notion_Leveling\2.Music\effects'
os.makedirs(out_dir, exist_ok=True)

with wave.open(os.path.join(out_dir, 'synchronize.wav'), 'w') as obj:
    obj.setnchannels(1)
    obj.setsampwidth(2)
    obj.setframerate(sample_rate)
    
    for i in range(int(sample_rate * duration)):
        t = float(i) / sample_rate
        freq = freq1 + (freq2 - freq1) * (t / duration)
        value = int(16000.0 * math.sin(2.0 * math.pi * freq * t))
        data = struct.pack('<h', value)
        obj.writeframesraw(data)
