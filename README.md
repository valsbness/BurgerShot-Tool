# BurgerShot Calculator — v5

Calculadora y administrador de BurgerShot para GTA V / FiveM Roleplay.

## Incluye
- Calculadora con precios del menú.
- Descuentos de 5% y 10%.
- 4 combos: Hamburguesa, Nuggets, Alitas y Burrito.
- Combos: 5×5 = $1,200; 25×25 = $6,000; 50×50 = $12,000; 100×100 = $24,000.
- Cantidades grandes: escribir 1,000 calcula 1,000 × 1,000 usando la misma proporción.
- Resumen de combos con total normal, total con 5% y total con 10%.
- Pago semanal protegido para jefes.
- Carpetas de trabajadores, hasta 100 facturas y 100 propinas por trabajador.
- 40% de facturas + 100% de propinas.
- Eliminar carpetas protegido por PIN.
- Convenios visibles para todos; agregar/eliminar protegido por PIN.
- Datos locales guardados en el navegador.
- Logo original proporcionado por el usuario incluido en `assets/logo-burgershot-original.jpeg`.
- Estética espacial con estrellas, azul oscuro, rojo y dorado.

## Precios base
Hamburguesa 200; Cubo de Alitas 200; Burrito 200; Nuggets 200; Cola-Shot 100; Helado 100; Papitas Fritas 100; Cajita Infantil 400; Cajita Médicos/Policías 250.

## PIN actuales
- Pago semanal: `2580`
- Administración de convenios: `7744`

Cámbialos en `script.js` en `ACCESS_CODES`.

## Importante sobre varios dispositivos
La versión actual guarda los datos en `localStorage`, por lo que cada teléfono/computadora tiene su propia copia.

Para que iPhone, computadora y otros dispositivos vean exactamente los mismos trabajadores, facturas, propinas y convenios, hace falta una base de datos en la nube. Esta entrega deja documentada la integración recomendada en `SYNC_SETUP.md` y el esquema de Supabase en `supabase-schema.sql`.

## GitHub Pages
Sube `index.html`, `style.css`, `script.js`, `README.md`, `SYNC_SETUP.md`, `supabase-schema.sql`, `supabase-config.example.js` y la carpeta `assets/` a la raíz del repositorio.

En GitHub: Settings → Pages → Deploy from a branch → `main` → `/(root)`.

## Assets
`assets/logo-burgershot-original.jpeg` es el banner/logo original proporcionado en la conversación. Los archivos de menú originales no estaban presentes dentro del paquete v4 disponible; por eso v5 muestra los precios en tarjetas y no inventa imágenes de menú que no fueron entregadas.

## Combos 5×5
La sección Combos maneja una sola caja de combo. El encargado elige el tipo de comida (Hamburguesas, Nuggets, Cubo de Alitas o Burritos) y la cantidad base. La bebida se ajusta automáticamente a la misma cantidad. El precio base es $1,200 por 5×5 y se escala proporcionalmente. El resumen muestra el total normal, el total con 5% y el total con 10% de descuento.
