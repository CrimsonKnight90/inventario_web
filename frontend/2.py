import os

# Extensiones que queremos restaurar
TARGET_SUFFIXES = {
    ".js.txt": ".js",
    ".jsx.txt": ".jsx",
    ".css.txt": ".css",
}

# Carpeta a excluir
EXCLUDE_DIR = "node_modules"


def restore_files(root_dir):
    for current_path, dirs, files in os.walk(root_dir):
        # Excluir node_modules
        if EXCLUDE_DIR in current_path.split(os.sep):
            continue

        for file in files:
            for suffix, original_ext in TARGET_SUFFIXES.items():
                if file.endswith(suffix):
                    old_path = os.path.join(current_path, file)
                    new_name = file[: -len(suffix)] + original_ext
                    new_path = os.path.join(current_path, new_name)

                    os.rename(old_path, new_path)
                    print(f"Restaurado: {old_path} -> {new_path}")
                    break


if __name__ == "__main__":
    ROOT = os.path.abspath(".")  # Carpeta actual
    restore_files(ROOT)
    print("✅ Restauración completada (excluyendo node_modules)")
