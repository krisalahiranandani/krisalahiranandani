import os
import shutil

base_dir = "/Users/vikasyewle/Desktop/krisalahiranandani/public/everlyn"
renders_dir = os.path.join(base_dir, "renders")

# Define moves as a mapping of source -> target
moves = {
    f"{base_dir}/page2_img7.jpeg": f"{base_dir}/hero/hero_exterior.jpeg",
    f"{renders_dir}/page_14_render.png": f"{base_dir}/masterplan/master_layout.png",
    f"{renders_dir}/page_15_render.png": f"{base_dir}/masterplan/master_layout_legend.png",
    f"{renders_dir}/page_19_render.png": f"{base_dir}/floorplans/tower_a_b_c_plan.png",
    f"{renders_dir}/page_21_render.png": f"{base_dir}/floorplans/tower_d_plan.png",
    f"{renders_dir}/page_23_render.png": f"{base_dir}/floorplans/tower_e_plan.png",
    f"{renders_dir}/page_25_render.png": f"{base_dir}/floorplans/unit_plan_1.png",
    f"{renders_dir}/page_26_render.png": f"{base_dir}/floorplans/unit_plan_2.png",
    f"{renders_dir}/page_27_render.png": f"{base_dir}/floorplans/unit_plan_3.png",
    f"{base_dir}/page2_img10.jpeg": f"{base_dir}/gallery/clubhouse_exterior.jpeg",
    f"{base_dir}/page2_img8.jpeg": f"{base_dir}/gallery/lounge_interior.jpeg",
    f"{base_dir}/page1_img10.jpeg": f"{base_dir}/gallery/elevation_1.jpeg",
    f"{base_dir}/page1_img11.jpeg": f"{base_dir}/gallery/elevation_2.jpeg",
    f"{base_dir}/page1_img6.jpeg": f"{base_dir}/gallery/elevation_3.jpeg",
    f"{base_dir}/page1_img9.jpeg": f"{base_dir}/gallery/elevation_4.jpeg",
    f"{base_dir}/page7_img1.jpeg": f"{base_dir}/gallery/amenity_1.jpeg",
    f"{base_dir}/page7_img10.jpeg": f"{base_dir}/gallery/amenity_2.jpeg",
    f"{base_dir}/page5_img2.png": f"{base_dir}/masterplan/everland_layout.png",
}

for src, dest in moves.items():
    if os.path.exists(src):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.move(src, dest)
        print(f"Moved {src} to {dest}")
    else:
        print(f"Source not found: {src}")
