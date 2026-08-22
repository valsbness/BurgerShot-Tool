# Sincronización entre dispositivos

## Estado actual
La app v5 funciona sin servidor y guarda la información con `localStorage`. Eso significa que los datos NO se comparten automáticamente entre un iPhone y una computadora.

## Cómo se puede hacer después
Se recomienda Supabase para guardar en la nube:
- trabajadores
- facturas
- propinas
- convenios
- cambios y eliminaciones

Con Realtime, cuando un jefe agregue o elimine una factura, los demás dispositivos pueden actualizarse sin recargar.

## Pasos
1. Crear un proyecto gratuito en Supabase.
2. Ejecutar `supabase-schema.sql` en SQL Editor.
3. Copiar `supabase-config.example.js` a `supabase-config.js`.
4. Colocar la URL y la anon key del proyecto.
5. Conectar el módulo de sincronización al `script.js`.

La aplicación puede conservar un modo local como respaldo cuando no haya conexión.

## Seguridad
El PIN actual de la aplicación es un bloqueo de interfaz. Si los pagos van a ser realmente confidenciales, la autorización debe validarse también en Supabase/FiveM, no solamente en JavaScript del navegador.
