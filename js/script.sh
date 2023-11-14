#!/bin/bash

# # Inicia gateway.js en una nueva terminal
# gnome-terminal --tab --title="Gateway" -- bash -c "node gateway.js"

# # Inicia mock_ascensor.js en una nueva terminal
# gnome-terminal --tab --title="Mock Ascensor" -- bash -c "node mock_ascensor.js"

# # Inicia mock_permisos.js en una nueva terminal
# gnome-terminal --tab --title="Mock Permisos" -- bash -c "node mock_permisos.js"

# # Inicia selector_pisos.js en una nueva terminal
# gnome-terminal --tab --title="Selector Pisos" -- bash -c "node selector_pisos.js"
open -a Terminal "node gateway.js"
open -a Terminal "node mock_ascensor.js"
open -a Terminal "node mock_permisos.js"
open -a Terminal "node selector_pisos.js"