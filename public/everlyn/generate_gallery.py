import os
import glob

image_dir = "/Users/vikasyewle/Desktop/krisalahiranandani/public/everlyn"
images = glob.glob(os.path.join(image_dir, "*.*"))
images = [img for img in images if not img.endswith('.txt')]
images.sort()

html_content = "<html><head><style>body { font-family: sans-serif; } img { max-width: 300px; height: auto; margin: 10px; border: 1px solid #ccc; }</style></head><body><h1>Extracted Images</h1><div style='display:flex; flex-wrap:wrap;'>"

for img in images:
    filename = os.path.basename(img)
    html_content += f"<div style='margin: 10px; text-align: center;'><img src='{filename}' /><br><span>{filename}</span></div>"

html_content += "</div></body></html>"

with open(os.path.join(image_dir, "gallery.html"), "w") as f:
    f.write(html_content)

print(f"Generated gallery.html with {len(images)} images")
