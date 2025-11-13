import os

def list_all_files(base_path="C:\\Users\\aksha\Project\\TileMatchMemory\\TileMatchMemory\\client\\src", output_file="project_files.txt"):
    with open(output_file, "w", encoding="utf-8") as f:
        for root, dirs, files in os.walk(base_path):
            for file in files:
                file_path = os.path.join(root, file)
                print(file_path)
                f.write(file_path + "\n")
    print(f"\n✅ File list saved to '{output_file}'")

if __name__ == "__main__":
    list_all_files()
