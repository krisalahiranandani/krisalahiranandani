import os
import re
from PIL import Image

def optimize_images_to_webp(root_dir, max_width=1600):
    total_old_size = 0
    total_new_size = 0
    count = 0
    
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext in [".jpeg", ".jpg", ".png", ".webp"]:
                filepath = os.path.join(dirpath, filename)
                webp_path = os.path.splitext(filepath)[0] + ".webp"
                
                try:
                    img = Image.open(filepath)
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    
                    # Resize if too large (1600px width is perfect for retina web without massive payloads)
                    if img.width > max_width:
                        ratio = max_width / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

                    old_size = os.path.getsize(filepath)
                    
                    # Save highly optimized webp
                    # quality 75 is visually identical for web but shrinks sizes dramatically
                    img.save(webp_path, "WEBP", quality=75, method=6)
                    
                    new_size = os.path.getsize(webp_path)
                    
                    total_old_size += old_size
                    total_new_size += new_size
                    count += 1
                    
                    if filepath != webp_path:
                        print(f"Converted: {filename} -> {os.path.basename(webp_path)} | {old_size/1024:.0f}KB -> {new_size/1024:.0f}KB")
                        # Delete the original unoptimized file to save space and deploy time
                        os.remove(filepath)
                    else:
                        print(f"Re-compressed WebP: {filename} -> {new_size/1024:.0f}KB")

                except Exception as e:
                    print(f"Error handling {filename}: {e}")
                    
    print(f"\nOptimization Complete for {count} images.")
    print(f"Total size reduced from {total_old_size / (1024*1024):.2f} MB down to {total_new_size / (1024*1024):.2f} MB")

# Run compression on the entire assets folder
optimize_images_to_webp("public/everlyn")

# Automatically rewrite any references in the HTML to point to the new WebP files
html_path = "index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Refactor all image extensions inside 'public/everlyn/' to '.webp'
new_html_content = re.sub(
    r'(public/everlyn/[^"\'\s]+)\.(?:jpg|jpeg|png)',
    r'\1.webp',
    html_content,
    flags=re.IGNORECASE
)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(new_html_content)

print(f"\nHTML successfully updated to point to high-speed WebP payloads.")
