#!/bin/bash
echo "Corriendo migraciones..."
flask db upgrade
echo "Iniciando Flask..."
python app.py