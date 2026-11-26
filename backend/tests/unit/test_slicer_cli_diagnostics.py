"""Regression tests for preserving OrcaSlicer's specific CLI failure reason."""

from backend.app.api.routes.library import (
    _SLICER_REJECTION_MARKER,
    _slicer_rejection_message,
)


def _sidecar_error(result_message: str, cli_log: str) -> str:
    return (
        f"{_SLICER_REJECTION_MARKER} {result_message}: Slicer process failed (exit code 1)"
        f"\nstdout: {cli_log}"
    )


def test_generic_orca_cli_slicing_error_uses_the_specific_error_log_line():
    error = _sidecar_error(
        "Failed slicing the model. Please verify the slicing of all plates on Orca Slicer before uploading.",
        "[2026-11-26 12:00:00] [error] run 1234: Object is outside the printable area",
    )

    assert _slicer_rejection_message(error) == "Object is outside the printable area"


def test_specific_slicer_result_message_remains_authoritative():
    error = _sidecar_error(
        "Plate 1: Cool Plate does not support filament 1",
        "[2026-11-26 12:00:00] [error] run 1234: Generic slicer diagnostic",
    )

    assert _slicer_rejection_message(error) == "Plate 1: Cool Plate does not support filament 1"


def test_bambu_studio_invalid_preset_placeholder_still_uses_cli_diagnostic():
    error = _sidecar_error(
        "The input preset file is invalid and can not be parsed.",
        "[2026-11-26 12:00:00] [error] run 1234: Filament preset is not compatible with printer",
    )

    assert _slicer_rejection_message(error) == "Filament preset is not compatible with printer"
