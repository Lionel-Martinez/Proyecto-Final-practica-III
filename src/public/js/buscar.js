(function () {
    const input = document.getElementById('buscar-input');
    const API_URL = input?.dataset.apiUrl;
    const contenedor = document.getElementById('buscar-resultados');

    const ICONS = {
        cliente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        orden: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"></path></svg>',
        repuesto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
    };

    const ESTADO_LABEL = {
        recibido: 'Pendiente',
        en_reparacion: 'En Progreso',
        listo: 'Lista p/retiro',
        entregado: 'Entregada',
        cancelado: 'Cancelada',
    };

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    let debounceTimer = null;

    input?.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => buscar(input.value), 300);
    });

    async function buscar(query) {
        const q = query.trim();

        if (!q) {
            contenedor.innerHTML = `<p class="buscar-empty">Empezá a escribir para buscar en todo el sistema.</p>`;
            return;
        }

        try {
            const response = await fetch(`${API_URL}?q=${encodeURIComponent(q)}`, {
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) throw new Error('No se pudo buscar.');

            const data = await response.json();
            render(data, q);

        } catch (error) {
            console.error(error);
            contenedor.innerHTML = `<p class="buscar-empty">No se pudo completar la búsqueda.</p>`;
        }
    }

    function render(data, query) {
        const { clientes, ordenes, repuestos } = data;

        if (!clientes.length && !ordenes.length && !repuestos.length) {
            contenedor.innerHTML = `<p class="buscar-empty">Sin resultados para "${escapeHtml(query)}".</p>`;
            return;
        }

        let html = '';

        if (clientes.length) {
            html += `
                <div class="buscar-grupo">
                    <p class="buscar-grupo-title">Clientes <span class="count">${clientes.length}</span></p>
                    ${clientes.map((c) => `
                        <a class="buscar-resultado" href="/clientes/${c.id}">
                            <span class="buscar-icon">${ICONS.cliente}</span>
                            <span class="buscar-texto">
                                <strong>${escapeHtml(c.nombre)}</strong>
                                <span>${escapeHtml(c.dni || 'Sin DNI')} · ${escapeHtml(c.telefono || 'Sin teléfono')}</span>
                            </span>
                        </a>
                    `).join('')}
                </div>
            `;
        }

        if (ordenes.length) {
            html += `
                <div class="buscar-grupo">
                    <p class="buscar-grupo-title">Órdenes <span class="count">${ordenes.length}</span></p>
                    ${ordenes.map((o) => `
                        <a class="buscar-resultado" href="/clientes/${o.customer_id ?? ''}">
                            <span class="buscar-icon">${ICONS.orden}</span>
                            <span class="buscar-texto">
                                <strong>Orden #${o.id} — ${escapeHtml(o.cliente)}</strong>
                                <span>${escapeHtml(o.equipo)} · ${escapeHtml(o.problema)}</span>
                            </span>
                            <span class="buscar-badge badge-${escapeHtml(o.status)}">${ESTADO_LABEL[o.status] ?? o.status}</span>
                        </a>
                    `).join('')}
                </div>
            `;
        }

        if (repuestos.length) {
            html += `
                <div class="buscar-grupo">
                    <p class="buscar-grupo-title">Repuestos <span class="count">${repuestos.length}</span></p>
                    ${repuestos.map((r) => `
                        <a class="buscar-resultado" href="/repuestos">
                            <span class="buscar-icon">${ICONS.repuesto}</span>
                            <span class="buscar-texto">
                                <strong>${escapeHtml(r.nombre)}</strong>
                                <span>SKU: ${escapeHtml(r.sku)} · ${escapeHtml(r.categoria)} · Stock: ${r.stock}</span>
                            </span>
                        </a>
                    `).join('')}
                </div>
            `;
        }

        contenedor.innerHTML = html;
    }
})();
