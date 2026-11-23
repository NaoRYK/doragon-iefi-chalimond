# Doragon

Tienda ficticia de cartas coleccionables de Dragon Ball. Trabajo integrador (IEFI) de Aplicaciones Web 1.

## Qué hace

- Catálogo con filtros, orden, búsqueda y paginación. Los datos se piden a archivos JSON con `fetch`.
- Carrito con cantidades, código de descuento y persistencia en `localStorage`.
- Pago con validaciones en HTML y en JavaScript. El pedido se envía por WhatsApp y se avisa en pantalla.
- Apertura de sobres con sorteo por probabilidades. Las cartas obtenidas se guardan en el inventario.
- Formulario de contacto que funciona sin JavaScript (`action` y `method`) y se valida con JavaScript.

## Estructura

```
index.html, catalogo.html, ...   páginas
css/                             estilos
data/                            datos en JSON
js/datos/                        carga de datos con fetch
js/vistas/                       lógica de cada página
js/componentes/                  piezas de HTML reutilizables
js/utilidades/                   funciones puras y de apoyo
test/                            tests con node:test
```

## Cómo correrlo

```bash
pnpm install
pnpm dev
```

## Tests

```bash
pnpm test
```

Usa el test runner nativo de Node (`node --test`), sin librerías extra.

## Datos de prueba

- Tarjeta: `4242 4242 4242 4242`, vencimiento futuro y CVV de 3 números.
- Código de descuento: `DORAGON10`.
- El número de WhatsApp del negocio es ficticio y está en `data/negocio.json`.
