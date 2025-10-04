import os
import re

def normalize_filenames(root_dir="."):
    """
    Recorre recursivamente root_dir y corrige nombres de archivos
    que tengan puntos repetidos antes de la extensión.
    Ejemplo: 'script..txt' -> 'script.txt'
    """
    for folder, _, files in os.walk(root_dir):
        for file in files:
            base, ext = os.path.splitext(file)

            # Reemplaza secuencias de puntos repetidos por un solo punto
            clean_base = re.sub(r"\.+", ".", base)

            # Elimina punto final si quedó pegado antes de la extensión
            clean_base = clean_base.rstrip(".")

            new_file = clean_base + ext
            if new_file != file:
                old_path = os.path.join(folder, file)
                new_path = os.path.join(folder, new_file)
                print(f"Corrigiendo: {old_path} -> {new_path}")
                os.rename(old_path, new_path)

if __name__ == "__main__":
    normalize_filenames(".")
