"""Carvi - convert reviewed raw PNGs to the WebP files the site serves.

img/cars/raw/{id}.png  ->  img/cars/{id}.webp  (1024px wide, q82)

Run:  python tools/convert-car-images.py
Requires Pillow:  pip install pillow
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  pip install pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "img", "cars", "raw")
OUT = os.path.join(ROOT, "img", "cars")
WIDTH = 1024

if not os.path.isdir(RAW):
    sys.exit("nothing to convert: img/cars/raw/ does not exist")

done = skipped = 0
for fn in sorted(os.listdir(RAW)):
    if not fn.lower().endswith(".png"):
        continue
    car_id = os.path.splitext(fn)[0]
    dst = os.path.join(OUT, car_id + ".webp")
    src = os.path.join(RAW, fn)
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        skipped += 1
        continue
    img = Image.open(src).convert("RGB")
    if img.width > WIDTH:
        img = img.resize((WIDTH, round(img.height * WIDTH / img.width)), Image.LANCZOS)
    img.save(dst, "WEBP", quality=82)
    print(f"{car_id}.webp  ({os.path.getsize(dst) // 1024} KB)")
    done += 1

print(f"\nConverted {done}, up-to-date {skipped}.")
print("Commit the .webp files; raw PNGs stay local (gitignored).")
