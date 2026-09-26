(function () {
    const root = document.getElementById('cat-root');
    const API_URL = root?.dataset.apiUrl;
    const esAdmin = root?.dataset.esAdmin === '1';
    const tbody = document.getElementById('cat-table-body');

    let SERVICIOS = [];
    let seleccionados = new Set();
    let editingId = null;

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

    const currency = (n) => `$${Number(n ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    async function load() {
        try {
            const response = await fetch(API_URL, { headers: { 'Accept': 'application/json' } });
            if (!response.ok) throw new Error('No se pudieron cargar los servicios.');

            SERVICIOS = await response.json();
            renderCategorias();
            render();

        } catch (error) {
            console.error(error);
            tbody.innerHTML = `<tr class="oa-empty"><td colspan="5">No se pudieron cargar los servicios.</td></tr>`;
        }
    }

    function renderCategorias() {
        const datalist = document.getElementById('cat-categoria-options');
        if (!datalist) return;

        const categorias = [...new Set(SERVICIOS.map((s) => s.category))];
        datalist.innerHTML = categorias.map((c) => `<option value="${escapeHtml(c)}"></option>`).join('');
    }

    function render() {
        const q = (document.getElementById('search-input')?.value ?? '').trim().toLowerCase();

        const filtrados = SERVICIOS.filter((s) =>
            !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
        );

        if (!filtrados.length) {
            tbody.innerHTML = `<tr class="oa-empty"><td colspan="${esAdmin ? 5 : 4}">No hay servicios que coincidan.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtrados.map((s) => `
            <tr>
                <td class="check-cell">
                    <input type="checkbox" class="quote-check" data-id="${s.id}" ${seleccionados.has(s.id) ? 'checked' : ''}>
                </td>
                <td>${escapeHtml(s.name)}</td>
                <td><span class="servicio-categoria-tag">${escapeHtml(s.category)}</span></td>
                <td class="num">${currency(s.reference_price)}</td>
                ${esAdmin ? `
                    <td class="acciones-cell">
                        <button type="button" class="row-action-btn" data-action="editar" data-id="${s.id}">Editar</button>
                        <button type="button" class="row-action-btn danger" data-action="eliminar" data-id="${s.id}">Eliminar</button>
                    </td>
                ` : ''}
            </tr>
        `).join('');
    }

    document.getElementById('search-input')?.addEventListener('input', render);

    tbody.addEventListener('change', (event) => {
        const check = event.target.closest('.quote-check');
        if (!check) return;

        const id = Number(check.dataset.id);
        if (check.checked) seleccionados.add(id); else seleccionados.delete(id);
        renderQuoteBar();
    });

    tbody.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-action]');
        if (!btn) return;

        const servicio = SERVICIOS.find((s) => s.id === Number(btn.dataset.id));

        if (btn.dataset.action === 'editar') abrirModal(servicio);
        if (btn.dataset.action === 'eliminar') eliminarServicio(servicio);
    });

    function renderQuoteBar() {
        const bar = document.getElementById('quote-bar');
        const count = seleccionados.size;

        bar.hidden = count === 0;
        document.getElementById('quote-count').textContent = `${count} servicio${count === 1 ? '' : 's'} seleccionado${count === 1 ? '' : 's'}`;

        const total = SERVICIOS.filter((s) => seleccionados.has(s.id)).reduce((sum, s) => sum + Number(s.reference_price), 0);
        document.getElementById('quote-total').textContent = currency(total);
    }

    document.getElementById('btn-generar-presupuesto')?.addEventListener('click', () => {
        const items = SERVICIOS.filter((s) => seleccionados.has(s.id));
        const cliente = document.getElementById('quote-cliente')?.value.trim() ?? '';

        sessionStorage.setItem('ulicel_presupuesto', JSON.stringify({ items, cliente }));
        window.location.href = '/presupuesto';
    });

    load();

    if (!esAdmin) return;

    const overlay = document.getElementById('servicio-overlay');
    const form = document.getElementById('servicio-form');

    function abrirModal(servicio) {
        form.reset();
        document.querySelectorAll('#servicio-form .field').forEach((f) => f.classList.remove('has-error'));

        editingId = servicio ? servicio.id : null;
        document.getElementById('servicio-modal-title').textContent = servicio ? 'Editar Servicio' : 'Nuevo Servicio';

        if (servicio) {
            document.getElementById('servicio-nombre').value = servicio.name;
            document.getElementById('servicio-categoria').value = servicio.category;
            document.getElementById('servicio-precio').value = servicio.reference_price;
        }

        overlay.hidden = false;
    }

    document.getElementById('btn-nuevo-servicio')?.addEventListener('click', () => abrirModal(null));
    document.getElementById('servicio-modal-close')?.addEventListener('click', () => overlay.hidden = true);
    document.getElementById('servicio-cancel')?.addEventListener('click', () => overlay.hidden = true);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) overlay.hidden = true; });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombreInput = document.getElementById('servicio-nombre');
        const categoriaInput = document.getElementById('servicio-categoria');
        const precioInput = document.getElementById('servicio-precio');
        const precio = parseFloat(precioInput.value.replace(',', '.'));

        let valid = true;
        [
            [nombreInput, !nombreInput.value.trim()],
            [categoriaInput, !categoriaInput.value.trim()],
            [precioInput, isNaN(precio) || precio < 0],
        ].forEach(([input, hasError]) => {
            input.closest('.field').classList.toggle('has-error', hasError);
            if (hasError) valid = false;
        });

        if (!valid) return;

        const payload = {
            name: nombreInput.value.trim(),
            category: categoriaInput.value.trim(),
            reference_price: precio,
        };

        try {
            const url = editingId ? `${API_URL}/${editingId}` : API_URL;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || (result.errors ? Object.values(result.errors).flat().join('\n') : 'No se pudo guardar el servicio.'));
                return;
            }

            overlay.hidden = true;
            await load();

        } catch (error) {
            console.error(error);
            alert('No se pudo guardar el servicio.');
        }
    });

    async function eliminarServicio(servicio) {
        if (!confirm(`¿Eliminar "${servicio.name}" del catálogo?`)) return;

        try {
            const response = await fetch(`${API_URL}/${servicio.id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() },
            });

            if (!response.ok) throw new Error('No se pudo eliminar.');

            seleccionados.delete(servicio.id);
            await load();
            renderQuoteBar();

        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el servicio.');
        }
    }

    document.getElementById('btn-importar-excel')?.addEventListener('click', () => {
        document.getElementById('excel-input').click();
    });

    document.getElementById('excel-input')?.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet);

                const servicios = rows.map((row) => ({
                    name: String(row.Nombre ?? row.nombre ?? '').trim(),
                    category: String(row.Categoría ?? row.categoria ?? row.Categoria ?? '').trim(),
                    reference_price: parseFloat(row.Precio ?? row.precio ?? 0),
                })).filter((s) => s.name && s.category && !isNaN(s.reference_price));

                if (!servicios.length) {
                    alert('No se encontraron filas válidas. Revisá que el Excel tenga columnas Nombre, Categoría y Precio.');
                    return;
                }

                const response = await fetch(`${API_URL}/importar`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                    body: JSON.stringify({ servicios }),
                });

                const result = await response.json();

                if (!response.ok) {
                    alert(result.message || 'No se pudo importar el archivo.');
                    return;
                }

                alert(`Listo: ${result.creados} nuevos, ${result.actualizados} actualizados.`);
                await load();

            } catch (error) {
                console.error(error);
                alert('No se pudo leer el archivo. Verificá el formato.');
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    });

})();
