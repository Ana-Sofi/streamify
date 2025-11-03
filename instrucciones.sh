# Situate bajo la carpeta de tu proyecto
cd ~/streamify

# Deshace cambios locales sobre archivos existentes, los archivos nuevos que hayas creado estan a salvo
git restore . 

# Si tienes cambios sobre archivos existentes que quieras guardar para despues
# entonces corre
git checkout -b backup # Crea una rama para guardar tus cambios
git add . # Indicas que quieres guardar todos los archivos del CWD (current working directory)
git commit -m "Estoy guardando mis cambios" # Le pones un mensajito a tu guardado

git checkout main # Regresas a la rama principal
git pull # Actualiza tu repositorio

# En este punto te recomiendo borrar tu esquema de base de datos y volverlo a
# cargar, te hice un sql que carga datos de prueba

# El siguiente comando para eliminar el esquema te va a pedir contrasena
psql -h localhost -p 5432 -U sofi -W -d streamify -c "DROP SCHEMA streamify CASCADE;"

pnpm run -C server build # Transpila el typescript a javascript
pnpm run -C server database:create # Vuelve a crear el esquema pero con la version actualizada
pnpm run -C server database:seed # Carga los datos de prueba a tu esquema
pnpm run -C server start:dev # Arranca tu servidor de express
pnpm run -C frontend start:dev # Arranca tu servidor de react

# Si quieres checar el sql que crea los datos de prueba checa
# server/src/config/sql/streamify-seeds.sql
