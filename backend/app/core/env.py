from pathlib import Path
import os
from typing import Optional, Tuple


def load_environment() -> None:
    for path in _environment_file_candidates():
        _load_environment_file(path)


def _environment_file_candidates() -> list[Path]:
    project_root = Path(__file__).resolve().parents[3]
    backend_root = Path(__file__).resolve().parents[2]

    candidates = [
        project_root / ".env",
        backend_root / ".env",
        Path.cwd() / ".env",
    ]

    return list(dict.fromkeys(candidates))


def _load_environment_file(path: Path) -> None:
    if not path.exists():
        return

    for line in path.read_text().splitlines():
        key, value = _parse_environment_line(line)
        if key and key not in os.environ:
            os.environ[key] = value


def _parse_environment_line(line: str) -> Tuple[Optional[str], str]:
    stripped = line.strip()
    if not stripped or stripped.startswith("#") or "=" not in stripped:
        return None, ""

    key, value = stripped.split("=", 1)
    key = key.replace("export ", "", 1).strip()
    value = value.strip().strip('"').strip("'")

    return key, value
