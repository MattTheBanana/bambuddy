# Bambu Lab H2D 0.4 mm stock presets for Bambuddy

These three self-contained JSONs were generated from the official Bambu Studio BBL profile set, manifest version 02.09.00.89 (BambuStudio master, checked 2026-11-25).

## Files

- `Bambu-Lab-H2D-0.4-nozzle.json` — H2D machine profile with the two 0.4 mm nozzle configuration.
- `0.20mm-Standard-BBL-H2D.json` — official 0.20 mm Standard process profile.
- `Bambu-PLA-Matte-BBL-H2D.json` — official Bambu PLA Matte filament profile for H2D.

The files have their inheritance and include chains expanded into the JSON, and their `inherits` / `include` fields removed. This avoids relying on Bambuddy's Local Profiles importer to find Bambu-specific parent profiles in OrcaSlicer's profile repository.

## Import

In Bambuddy, open **Profiles → Local Profiles → Import** and select all three JSON files together. They should be classified into Printer, Process, and Filament automatically.

## Compatibility notes

- These machine and process presets are for H2D with 0.4 mm nozzles. They are not intended for 0.2, 0.6, or 0.8 mm nozzles.
- This filament is Bambu's stock PLA Matte preset, not a spool-specific flow/pressure-advance calibration.
- Run a small test print and calibrate for the actual filament spool before a production print.

Source: https://github.com/bambulab/BambuStudio/tree/master/resources/profiles
