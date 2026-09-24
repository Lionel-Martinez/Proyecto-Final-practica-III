(function () {
    const root = document.getElementById('oa-root');
    const API_URL = root?.dataset.apiUrl;
    const tbody = document.getElementById('oa-table-body');
    const showing = document.getElementById('oa-showing');

    let ORDERS = [];
    let currentEstado = 'todos';
    let currentSearch = '';

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    const ESTADOS = {
        recibido: { label: 'Pendiente', clase: 'estado-pendiente' },
        en_reparacion: { label: 'En Progreso', clase: 'estado-progreso' },
        listo: { label: 'Lista p/retiro', clase: 'estado-listo' },
    };

    function formatFecha(iso) {
        if (!iso) return 'Sin fecha';
        return new Date(iso).toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
        });
    }

    async function load() {
        if (!API_URL) return;

        try {
            const response = await fetch(API_URL, { headers: { 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('No se pudieron cargar las órdenes.');

            ORDERS = await response.json();
            render();

        } catch (error) {
            console.error(error);
            tbody.innerHTML = `<tr class="oa-empty"><td colspan="7">No se pudieron cargar las órdenes.</td></tr>`;
        }
    }

    function getFiltered() {
        const q = currentSearch.trim().toLowerCase();

        return ORDERS.filter((o) => {
            const matchesEstado = currentEstado === 'todos'
                || (currentEstado === 'urgente' ? o.priority === 'urgente' : o.status === currentEstado);

            const matchesSearch = !q
                || String(o.id).includes(q)
                || o.cliente.toLowerCase().includes(q)
                || o.equipo.toLowerCase().includes(q);

            return matchesEstado && matchesSearch;
        });
    }

    function render() {
        const filtered = getFiltered();

        if (!filtered.length) {
            tbody.innerHTML = `<tr class="oa-empty"><td colspan="7">No encontramos órdenes con ese criterio.</td></tr>`;
        } else {
            tbody.innerHTML = filtered.map((o) => {
                const estado = ESTADOS[o.status] ?? { label: o.status, clase: 'estado-pendiente' };
                const esUrgente = o.priority === 'urgente';

                return `
                    <tr class="${esUrgente ? 'is-urgente' : ''}">
                        <td><span class="oa-order-chip">#${o.id}</span></td>
                        <td>${escapeHtml(o.cliente)}</td>
                        <td>${escapeHtml(o.equipo)}</td>
                        <td>${escapeHtml(o.tecnico)}</td>
                        <td><span class="prioridad-tag ${esUrgente ? 'is-urgente' : 'is-normal'}">${esUrgente ? '⚠ Urgente' : 'Normal'}</span></td>
                        <td><span class="estado-pill ${estado.clase}"><span class="dot"></span>${estado.label}</span></td>
                        <td>${formatFecha(o.received_at)}</td>
                    </tr>
                `;
            }).join('');
        }

        showing.textContent = `${filtered.length} ${filtered.length === 1 ? 'orden' : 'órdenes'}`;
    }

    document.getElementById('search-input')?.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        render();
    });

    document.getElementById('status-toggle')?.addEventListener('click', (event) => {
        const chip = event.target.closest('.status-chip');
        if (!chip) return;

        document.querySelectorAll('.status-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        currentEstado = chip.dataset.estado;
        render();
    });

    load();
})();
