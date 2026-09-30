<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscar mi orden — Ulicel</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, "Segoe UI", Roboto, sans-serif; background: #f4f5f6; color: #14161a; }
        .wrap { max-width: 26rem; margin: 0 auto; padding: 2.2rem 1.2rem 3rem; }
        .brand { display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-bottom: 1.6rem; }
        .brand img { width: 2rem; height: 2rem; border-radius: 0.4rem; }
        .brand span { font-weight: 800; font-size: 1.1rem; }
        h1 { font-size: 1.15rem; text-align: center; margin: 0 0 0.4rem; }
        .sub { text-align: center; font-size: 0.85rem; color: #6b7280; margin: 0 0 1.4rem; }
        .search-box { display: flex; gap: 0.6rem; margin-bottom: 1.4rem; }
        .search-box input { flex: 1; border: 1px solid #e4e6ea; border-radius: 0.5rem; padding: 0.75rem 0.9rem; font-size: 1rem; outline: none; }
        .search-box input:focus { border-color: #b80f22; }
        .search-box button { border: none; background: #14161a; color: #fff; border-radius: 0.5rem; padding: 0 1.1rem; font-weight: 700; font-size: 0.9rem; cursor: pointer; }
        .search-box button:hover { background: #b80f22; }
        .card { background: #fff; border: 1px solid #ececec; border-radius: 0.8rem; padding: 1.2rem; margin-bottom: 0.8rem; text-decoration: none; color: inherit; display: block; }
        .card strong { display: block; font-size: 0.95rem; }
        .card span { display: block; font-size: 0.8rem; color: #8b8f97; margin-top: 0.2rem; }
        .estado-pill { display: inline-block; margin-top: 0.5rem; font-size: 0.74rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; background: #f4f5f6; color: #6b7280; }
        .msg { text-align: center; color: #8b8f97; font-size: 0.88rem; padding: 1rem 0; }
        .msg.error { color: #b80f22; }
    </style>
</head>
<body>

    <div class="wrap">
        <div class="brand">
            <img src="/img/ulicel-logo.jpeg" alt="Ulicel">
            <span>Ulicel</span>
        </div>

        <h1>¿Perdiste tu código de seguimiento?</h1>
        <p class="sub">Ingresá tu DNI y te mostramos tus reparaciones.</p>

        <div class="search-box">
            <input type="text" id="dni-input" placeholder="Tu DNI" inputmode="numeric">
            <button type="button" id="btn-buscar">Buscar</button>
        </div>

        <div id="resultados"></div>
    </div>

    <script>
        const ESTADOS = {
            recibido: 'Recibido',
            en_reparacion: 'En reparación',
            listo: 'Lista para retirar',
            entregado: 'Entregada',
            cancelado: 'Cancelada',
        };

        const input = document.getElementById('dni-input');
        const resultados = document.getElementById('resultados');

        async function buscar() {
            const dni = input.value.trim();
            if (!dni) return;

            resultados.innerHTML = '<p class="msg">Buscando...</p>';

            try {
                const response = await fetch(`/api/buscar-orden?dni=${encodeURIComponent(dni)}`, {
                    headers: { 'Accept': 'application/json' },
                });
                const data = await response.json();

                if (!data.encontrado) {
                    resultados.innerHTML = '<p class="msg error">No encontramos un cliente con ese DNI.</p>';
                    return;
                }

                if (!data.ordenes.length) {
                    resultados.innerHTML = `<p class="msg">Hola ${data.nombre}, todavía no tenés órdenes registradas.</p>`;
                    return;
                }

                resultados.innerHTML = data.ordenes.map((o) => `
                    <a class="card" href="/seguimiento/${o.tracking_code}">
                        <strong>${o.equipo}</strong>
                        <span>Código: ${o.tracking_code} · Ingreso: ${o.received_at ?? '—'}</span>
                        <span class="estado-pill">${ESTADOS[o.status] ?? o.status}</span>
                    </a>
                `).join('');

            } catch (error) {
                resultados.innerHTML = '<p class="msg error">No se pudo buscar. Probá de nuevo.</p>';
            }
        }

        document.getElementById('btn-buscar').addEventListener('click', buscar);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') buscar(); });
    </script>

</body>
</html>
