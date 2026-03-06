import fitz
import os
import io
from PIL import Image

pdf_file = "/Users/vikasyewle/Downloads/Everlyn-Floor Plan Booklet.pdf"
output_dir = "/Users/vikasyewle/Desktop/krisalahiranandani/public/everlyn"
os.makedirs(output_dir, exist_ok=True)

# Extract Text
doc = fitz.open(pdf_file)
text = ""
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    text += page.get_text() + "\n--- PAGE " + str(page_num + 1) + " ---\n"
    
with open(os.path.join(output_dir, "extracted_text.txt"), "w") as f:
    f.write(text)

# Extract Images
img_count = 0
for page_num in range(len(doc)):
    page = doc[page_num]
    image_list = page.get_images()
    
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # Only save decent sized images
        if len(image_bytes) > 20000:
            image_name = f"page{page_num+1}_img{image_index}.{image_ext}"
            image_path = os.path.join(output_dir, image_name)
            with open(image_path, "wb") as f_out:
                f_out.write(image_bytes)
            img_count += 1

print(f"Extracted {img_count} images to {output_dir}")
print("Text extraction complete.")
