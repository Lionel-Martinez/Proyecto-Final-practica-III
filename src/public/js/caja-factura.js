(function () {
    const URLS = window.ULICEL_CAJA_URLS;
    let TRANSACTIONS = [];
    let CUSTOMERS = [];
    let currentSearch = '';

    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    const currency = (n) =>
        `$${Number(n ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    /* ---------- carga inicial ---------- */

    async function loadTransactions() {
        try {
            const response = await fetch(URLS.transacciones, { headers: { 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('No se pudieron cargar las transacciones.');

            const data = await response.json();
            TRANSACTIONS = data.transacciones;

            document.getElementById('stat-hoy').textContent = currency(data.stats.cobrado_hoy);
            document.getElementById('stat-mes').textContent = currency(data.stats.cobrado_mes);
            document.getElementById('stat-cantidad').textContent = data.stats.transacciones;

            renderMetodos(data.por_metodo);
            renderTabla();

        } catch (error) {
            console.error(error);
            document.getElementById('tx-tbody').innerHTML = `<tr class="oa-empty"><td colspan="7">No se pudieron cargar las transacciones.</td></tr>`;
        }
    }

    function renderMetodos(porMetodo) {
        const list = document.getElementById('metodos-list');
        const metodos = Object.keys(porMetodo);

        if (!metodos.length) {
            list.innerHTML = `<li class="metodos-empty">Sin datos todavía.</li>`;
            return;
        }

        list.innerHTML = metodos.map((metodo) => {
            const info = porMetodo[metodo];
            return `
                <li>
                    <div class="metodo-row-head">
                        <strong>${escapeHtml(metodo)}</strong>
                        <span>${currency(info.total)}</span>
                    </div>
                    <div class="metodo-bar-track">
                        <div class="metodo-bar-fill" style="width:${info.porcentaje}%"></div>
                    </div>
                </li>
            `;
        }).join('');
    }

    function renderTabla() {
        const tbody = document.getElementById('tx-tbody');
        const q = currentSearch.trim().toLowerCase();

        const filtradas = TRANSACTIONS.filter((t) =>
            !q || t.cliente.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)
        );

        if (!filtradas.length) {
            tbody.innerHTML = `<tr class="oa-empty"><td colspan="7">No hay transacciones registradas.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtradas.map((t) => `
            <tr>
                <td>${escapeHtml(t.code)}</td>
                <td>${escapeHtml(t.cliente)}</td>
                <td>${t.orden_id ? '#' + t.orden_id : '—'}</td>
                <td>${escapeHtml(t.method)}</td>
                <td>${new Date(t.fecha).toLocaleDateString('es-AR')}</td>
                <td class="num">${currency(t.amount)}</td>
                <td>
                    <a class="pdf-link" href="/api/transacciones/${t.id}/pdf" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        PDF
                    </a>
                </td>
            </tr>
        `).join('');
    }

    document.getElementById('search-input')?.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderTabla();
    });

    /* ---------- modal: registrar cobro ---------- */

    const overlay = document.getElementById('tx-overlay');
    const form = document.getElementById('tx-form');
    const clienteSelect = document.getElementById('tx-cliente');
    const ordenSelect = document.getElementById('tx-orden');
    const montoInput = document.getElementById('tx-monto');
    const metodoSelect = document.getElementById('tx-metodo');
    const saveBtn = document.getElementById('tx-save');

    async function loadCustomersIntoSelect() {
        if (CUSTOMERS.length) return;

        const response = await fetch(URLS.clientes, { headers: { 'Accept': 'application/json' } });
        CUSTOMERS = await response.json();

        clienteSelect.innerHTML = '<option value="">Seleccioná un cliente</option>' +
            CUSTOMERS.map((c) => `<option value="${c.id}">${escapeHtml(c.nombre)}</option>`).join('');
    }

    clienteSelect.addEventListener('change', async () => {
        const customerId = clienteSelect.value;

        if (!customerId) {
            ordenSelect.innerHTML = '<option value="">Elegí un cliente primero</option>';
            ordenSelect.disabled = true;
            return;
        }

        ordenSelect.disabled = false;
        ordenSelect.innerHTML = '<option value="">Cargando órdenes...</option>';

        try {
            const response = await fetch(`/api/clientes/${customerId}/ordenes`, { headers: { 'Accept': 'application/json' } });
            const ordenes = await response.json();

            if (!ordenes.length) {
                ordenSelect.innerHTML = '<option value="">Este cliente no tiene órdenes</option>';
                return;
            }

            ordenSelect.innerHTML = '<option value="">Sin orden asociada</option>' +
                ordenes.map((o) => `<option value="${o.id}">#${o.id} — ${escapeHtml(o.reported_problem).slice(0, 40)}</option>`).join('');

        } catch (error) {
            console.error(error);
            ordenSelect.innerHTML = '<option value="">No se pudieron cargar las órdenes</option>';
        }
    });

    function abrirModal() {
        form.reset();
        document.querySelectorAll('#tx-form .field').forEach((f) => f.classList.remove('has-error'));
        ordenSelect.innerHTML = '<option value="">Elegí un cliente primero</option>';
        ordenSelect.disabled = true;
        loadCustomersIntoSelect();
        overlay.hidden = false;
    }

    function cerrarModal() {
        overlay.hidden = true;
    }

    document.getElementById('btn-nuevo-cobro')?.addEventListener('click', abrirModal);
    document.getElementById('tx-modal-close')?.addEventListener('click', cerrarModal);
    document.getElementById('tx-cancel')?.addEventListener('click', cerrarModal);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) cerrarModal(); });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        let valid = true;

        [
            [clienteSelect, !clienteSelect.value],
            [montoInput, !montoInput.value || Number(montoInput.value) <= 0],
        ].forEach(([el, hasError]) => {
            el.closest('.field').classList.toggle('has-error', hasError);
            if (hasError) valid = false;
        });

        if (!valid) return;

        saveBtn.disabled = true;
        saveBtn.textContent = 'Guardando...';

        try {
            const response = await fetch(URLS.transacciones, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    customer_id: Number(clienteSelect.value),
                    repair_order_id: ordenSelect.value ? Number(ordenSelect.value) : null,
                    amount: Number(montoInput.value),
                    method: metodoSelect.value,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'No se pudo registrar el cobro.');
            }

            cerrarModal();
            await loadTransactions();

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Registrar cobro';
        }
    });

    loadTransactions();
})();
