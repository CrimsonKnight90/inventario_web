import os

def rename_py_to_txt(root_dir="."):
    """
    Recorre recursivamente root_dir y cambia la extensión de todos los archivos .py a .txt,
    excepto los que estén en la lista de exclusiones.
    """
    exclude = {"1.py", "2.py", "3.py"}  # Archivos que NO quieres renombrar

    for folder, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".txt") and file not in exclude:
                old_path = os.path.join(folder, file)

                # splitext devuelve (nombre_sin_ext, ".ext")
                base, ext = os.path.splitext(file)

                # base puede tener puntos, pero splitext garantiza que ext sea SOLO ".py"
                new_file = base + ".py"
                new_path = os.path.join(folder, new_file)

                print(f"Renombrando: {old_path} -> {new_path}")
                os.rename(old_path, new_path)

if __name__ == "__main__":
    rename_py_to_txt(".")
