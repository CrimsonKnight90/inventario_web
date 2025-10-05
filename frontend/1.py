import os

# Extensiones que queremos convertir
TARGET_EXTENSIONS = {".js", ".jsx", ".css"}

# Carpeta a excluir
EXCLUDE_DIR = "node_modules"


def convert_files(root_dir):
    for current_path, dirs, files in os.walk(root_dir):
        # Excluir node_modules
        if EXCLUDE_DIR in current_path.split(os.sep):
            continue

        for file in files:
            name, ext = os.path.splitext(file)
            if ext in TARGET_EXTENSIONS:
                old_path = os.path.join(current_path, file)
                new_path = os.path.join(current_path, file + ".txt")

                # Renombrar archivo
                os.rename(old_path, new_path)
                print(f"Renombrado: {old_path} -> {new_path}")


if __name__ == "__main__":
    ROOT = os.path.abspath(".")  # Carpeta actual
    convert_files(ROOT)
    print("✅ Conversión completada (excluyendo node_modules)")
