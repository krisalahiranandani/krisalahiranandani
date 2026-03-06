import fitz
import os

pdf_file = "/Users/vikasyewle/Downloads/Everlyn-Floor Plan Booklet.pdf"
output_dir = "/Users/vikasyewle/Desktop/krisalahiranandani/public/everlyn/renders"
os.makedirs(output_dir, exist_ok=True)

# Pages to render (0-indexed)
# Text analysis:
# Page 13: Master Layout
# Page 14: Master Layout Legend
# Page 18: Floor Plans A,B,C
# Page 20: Floor Plans D
# Page 22: Floor Plans E
# Page 24, 25, 26: Unit Plans
pages_to_render = [13, 14, 18, 20, 22, 24, 25, 26]

doc = fitz.open(pdf_file)
zoom_x = 2.0  # horizontal zoom
zoom_y = 2.0  # vertical zoom
mat = fitz.Matrix(zoom_x, zoom_y)

for page_num in pages_to_render:
    if page_num < len(doc):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(matrix=mat)
        output_path = os.path.join(output_dir, f"page_{page_num + 1}_render.png")
        pix.save(output_path)
        print(f"Rendered page {page_num + 1} to {output_path}")

print("Rendering complete.")
