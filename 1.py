import os
import re

# Carpetas y archivos a ignorar (como si fuera un .gitignore básico)
IGNORE_DIRS = {
    "node_modules", "dist", "build", ".git", ".idea", ".vscode",
    "__pycache__", ".pytest_cache", ".mypy_cache", ".DS_Store"
}
IGNORE_FILES = {
    ".gitignore", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    ".env", ".env.local"
}

OUTPUT_FILE = "estructura_proyecto.txt"

# Regex para ignorar archivos tipo 1.py, 2.py, 3.py, etc.
IGNORE_REGEX = re.compile(r"^\d+\.py$")


def should_ignore_dir(dirname: str) -> bool:
    """Ignora directorios por nombre exacto o si parecen entornos virtuales."""
    if dirname in IGNORE_DIRS:
        return True
    # Ignorar cualquier carpeta que empiece con 'venv' o 'env'
    if dirname.lower().startswith(("venv", "env")):
        return True
    return False


def should_ignore_file(filename: str) -> bool:
    """Ignora archivos listados o que coincidan con el patrón numérico .py"""
    if filename in IGNORE_FILES:
        return True
    if IGNORE_REGEX.match(filename):
        return True
    return False


def write_tree(root_dir, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        for current_path, dirs, files in os.walk(root_dir):
            # Filtrar directorios ignorados
            dirs[:] = [d for d in dirs if not should_ignore_dir(d)]

            # Calcular nivel de indentación
            level = current_path.replace(root_dir, "").count(os.sep)
            indent = "    " * level

            # Escribir carpeta
            folder_name = os.path.basename(current_path) or root_dir
            f.write(f"{indent}{folder_name}/\n")

            # Escribir archivos
            sub_indent = "    " * (level + 1)
            for file in files:
                if not should_ignore_file(file):
                    f.write(f"{sub_indent}{file}\n")


if __name__ == "__main__":
    ROOT = os.path.abspath(".")  # Carpeta actual
    write_tree(ROOT, OUTPUT_FILE)
    print(f"Estructura guardada en {OUTPUT_FILE}")
