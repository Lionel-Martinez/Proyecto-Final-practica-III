const page = document.querySelector('.repuestos-page');
const API_URL = page?.dataset.apiUrl;

const ICONS = {
    pantalla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
    bateria: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="7" width="18" height="10" rx="2"></rect><line x1="23" y1="11" x2="23" y2="13"></line></svg>',
    placa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><line x1="9" y1="4" x2="9" y2="2"></line><line x1="15" y1="4" x2="15" y2="2"></line><line x1="9" y1="22" x2="9" y2="20"></line><line x1="15" y1="22" x2="15" y2="20"></line><line x1="20" y1="9" x2="22" y2="9"></line><line x1="20" y1="15" x2="22" y2="15"></line><line x1="2" y1="9" x2="4" y2="9"></line><line x1="2" y1="15" x2="4" y2="15"></line></svg>',
    carcasa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>',
    puerto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"></path><line x1="9" y1="17" x2="9" y2="21"></line><line x1="15" y1="17" x2="15" y2="21"></line></svg>',
    camara: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>',
    accesorio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 1 1 5.4-5.4z"></path></svg>',
    otro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M3 8 5 3h14l2 5"></path><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
};

let PARTS = [];
const PAGE_SIZE = 6;

let currentPage = 1;
let currentEstado = 'todos';
let currentCategoria = 'todas';
let currentSearch = '';
let editingPartId = null;

const partsGrid = document.getElementById('bin-grid');

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

const currency = (n) =>
    `$${Number(n ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function getEstado(part) {
    return Number(part.current_stock) <= Number(part.minimum_stock) ? 'agotandose' : 'normal';
}

function getGaugeMax(part) {
    return Math.max(Number(part.current_stock), Number(part.minimum_stock) * 3, 10);
}

/* ---------- carga desde la API ---------- */

async function loadParts() {
    if (!partsGrid || !API_URL) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('No se pudieron cargar los repuestos.');
        }

        PARTS = await response.json();

        renderAll();

    } catch (error) {
        console.error(error);
        partsGrid.innerHTML = `<p class="bin-empty">No se pudieron cargar los repuestos.</p>`;
    }
}

function renderAll() {
    renderRailStat();
    renderAlert();
    renderCategories();
    renderGrid();
}

/* ---------- rail: valor total + alerta ---------- */

function renderRailStat() {
    const total = PARTS.reduce((sum, p) => sum + Number(p.current_stock) * Number(p.cost_price), 0);
    document.getElementById('valor-total').textContent = currency(total);
}

function renderAlert() {
    const bajos = PARTS.filter((p) => getEstado(p) === 'agotandose');

    document.getElementById('alert-text').textContent = bajos.length
        ? `${bajos.length} repuesto${bajos.length === 1 ? '' : 's'} en o por debajo de su stock mínimo.`
        : 'Todo el inventario está por encima de su stock mínimo.';

    document.getElementById('alert-chips').innerHTML = bajos
        .map((p) => `<span class="alert-chip">${escapeHtml(p.name)} (${p.current_stock})</span>`)
        .join('');
}

/* ---------- rail: categorías ---------- */

function renderCategories() {
    const categories = [...new Set(PARTS.map((p) => p.category))];
    const list = document.getElementById('category-list');

    const items = [
        { key: 'todas', label: 'Todas', count: PARTS.length },
        ...categories.map((cat) => ({
            key: cat,
            label: cat,
            count: PARTS.filter((p) => p.category === cat).length,
        })),
    ];

    list.innerHTML = items.map((item) => `
        <button type="button" class="category-item${item.key === currentCategoria ? ' active' : ''}" data-categoria="${escapeHtml(item.key)}">
            <span>${escapeHtml(item.label)}</span>
            <span class="category-count">${item.count}</span>
        </button>
    `).join('');

    list.querySelectorAll('.category-item').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentCategoria = btn.dataset.categoria;
            currentPage = 1;
            renderCategories();
            renderGrid();
        });
    });
}

/* ---------- filtrado ---------- */

function getFilteredParts() {
    return PARTS.filter((p) => {
        const matchesEstado = currentEstado === 'todos' || getEstado(p) === currentEstado;
        const matchesCategoria = currentCategoria === 'todas' || p.category === currentCategoria;
        const q = currentSearch.trim().toLowerCase();
        const matchesSearch = !q
            || p.name.toLowerCase().includes(q)
            || p.sku.toLowerCase().includes(q);

        return matchesEstado && matchesCategoria && matchesSearch;
    });
}

/* ---------- grilla + paginación ---------- */

function renderGrid() {
    const filtered = getFilteredParts();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    if (!pageItems.length) {
        partsGrid.innerHTML = `<p class="bin-empty">No encontramos repuestos con ese criterio.</p>`;
    } else {
        partsGrid.innerHTML = pageItems.map((p) => {
            const estado = getEstado(p);
            const gaugeMax = getGaugeMax(p);
            const pct = Math.min(100, Math.round((Number(p.current_stock) / gaugeMax) * 100));
            const thresholdPct = Math.min(100, Math.round((Number(p.minimum_stock) / gaugeMax) * 100));

            return `
                <article class="bin-card" data-part-id="${p.id}">
                    <div class="bin-head">
                        <span class="bin-icon">${ICONS[p.icon] || ICONS.otro}</span>
                        <div class="bin-title">
                            <strong>${escapeHtml(p.name)}</strong>
                            <span class="bin-sku">SKU: ${escapeHtml(p.sku)}</span>
                            <span class="bin-category">${escapeHtml(p.category)}</span>
                        </div>
                        <button type="button" class="bin-menu-btn" aria-label="Acciones">
                            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="12" cy="19" r="1.6"></circle></svg>
                        </button>
                        <ul class="bin-menu" hidden>
                            <li data-action="editar">Editar</li>
                            <li data-action="eliminar" class="danger">Eliminar</li>
                        </ul>
                    </div>

                    <div class="bin-gauge-head">
                        <span class="bin-stock-value">${String(p.current_stock).padStart(2, '0')} unidades</span>
                        <span class="bin-estado ${estado === 'normal' ? 'is-normal' : 'is-bajo'}">${estado === 'normal' ? 'Normal' : 'Agotándose'}</span>
                    </div>
                    <div class="bin-gauge-track">
                        <div class="bin-gauge-fill ${estado === 'agotandose' ? 'is-bajo' : ''}" style="width:${pct}%"></div>
                        <span class="bin-gauge-threshold" style="left:${thresholdPct}%" title="Stock mínimo (${p.minimum_stock} u.)"></span>
                    </div>
                </article>
            `;
        }).join('');
    }

    renderFoot(filtered.length, start);
}

function renderFoot(totalFiltered, start) {
    const showingFrom = totalFiltered ? start + 1 : 0;
    const showingTo = Math.min(start + PAGE_SIZE, totalFiltered);

    document.getElementById('inv-showing').textContent =
        `Mostrando ${showingFrom}-${showingTo} de ${totalFiltered} repuestos`;

    const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'page-btn';
    prev.textContent = '‹';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => { currentPage -= 1; renderGrid(); });
    pagination.appendChild(prev);

    for (let i = 1; i <= totalPages; i += 1) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `page-btn${i === currentPage ? ' active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => { currentPage = i; renderGrid(); });
        pagination.appendChild(btn);
    }

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'page-btn';
    next.textContent = '›';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => { currentPage += 1; renderGrid(); });
    pagination.appendChild(next);
}

/* ---------- búsqueda y filtro por estado ---------- */

document.getElementById('inv-search-input')?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    currentPage = 1;
    renderGrid();
});

document.getElementById('status-toggle')?.addEventListener('click', (event) => {
    const chip = event.target.closest('.status-chip');
    if (!chip) return;

    document.querySelectorAll('.status-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    currentEstado = chip.dataset.estado;
    currentPage = 1;
    renderGrid();
});

/* ---------- menú de acciones por card ---------- */

document.addEventListener('click', (event) => {
    const menuBtn = event.target.closest('.bin-menu-btn');

    document.querySelectorAll('.bin-menu').forEach((menu) => {
        if (!menuBtn || menu !== menuBtn.nextElementSibling) menu.hidden = true;
    });

    if (menuBtn) {
        const menu = menuBtn.nextElementSibling;
        menu.hidden = !menu.hidden;
        return;
    }

    const actionItem = event.target.closest('.bin-menu li');
    if (!actionItem) return;

    const card = actionItem.closest('.bin-card');
    const partId = Number(card.dataset.partId);
    const part = PARTS.find((p) => p.id === partId);
    const action = actionItem.dataset.action;

    if (action === 'editar') {
        openPartModal(part);
    } else if (action === 'eliminar') {
        deletePart(part);
    }

    actionItem.closest('.bin-menu').hidden = true;
});

async function deletePart(part) {
    const confirmed = confirm(`¿Eliminar "${part.name}" del inventario? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/${part.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'No se pudo eliminar el repuesto.');
        }

        await loadParts();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/* ---------- exportar a CSV ---------- */

document.getElementById('export-btn')?.addEventListener('click', () => {
    const filtered = getFilteredParts();
    const header = ['SKU', 'Repuesto', 'Categoría', 'Stock', 'Stock mínimo', 'Estado', 'Precio costo', 'Precio venta'];

    const rows = filtered.map((p) => [
        p.sku,
        p.name,
        p.category,
        p.current_stock,
        p.minimum_stock,
        getEstado(p) === 'normal' ? 'Normal' : 'Agotándose',
        p.cost_price,
        p.sale_price,
    ]);

    const csv = [header, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventario-ulicel.csv';
    a.click();
    URL.revokeObjectURL(url);
});

/* ---------- modal: nuevo / editar repuesto ---------- */

const partOverlay = document.getElementById('part-overlay');
const partForm = document.getElementById('part-form');
const partModalTitle = document.getElementById('part-modal-title');

const partIdInput = document.getElementById('part-id');
const partNombreInput = document.getElementById('part-nombre');
const partSkuInput = document.getElementById('part-sku');
const partCategoriaSelect = document.getElementById('part-categoria');
const partStockInput = document.getElementById('part-stock');
const partStockMinimoInput = document.getElementById('part-stock-minimo');
const partCostoInput = document.getElementById('part-costo');
const partVentaInput = document.getElementById('part-venta');

function openPartModal(part) {
    partForm.reset();
    document.querySelectorAll('#part-form .field').forEach((f) => f.classList.remove('has-error'));

    if (part) {
        editingPartId = part.id;
        partModalTitle.textContent = 'Editar Repuesto';
        partIdInput.value = part.id;
        partNombreInput.value = part.name;
        partSkuInput.value = part.sku;
        partCategoriaSelect.value = part.category;
        partStockInput.value = part.current_stock;
        partStockMinimoInput.value = part.minimum_stock;
        partCostoInput.value = part.cost_price;
        partVentaInput.value = part.sale_price;
    } else {
        editingPartId = null;
        partModalTitle.textContent = 'Nuevo Repuesto';
        partIdInput.value = '';
    }

    partOverlay.hidden = false;
    partNombreInput.focus();
}

function closePartModal() {
    partOverlay.hidden = true;
}

document.getElementById('btn-nuevo-repuesto')?.addEventListener('click', () => openPartModal(null));
document.getElementById('part-modal-close')?.addEventListener('click', closePartModal);
document.getElementById('part-cancel')?.addEventListener('click', closePartModal);
partOverlay?.addEventListener('click', (e) => { if (e.target === partOverlay) closePartModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !partOverlay.hidden) closePartModal(); });

partForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const stockNum = parseInt(partStockInput.value, 10);
    const stockMinimoNum = parseInt(partStockMinimoInput.value, 10);
    const costoNum = parseFloat(partCostoInput.value.replace(',', '.'));
    const ventaNum = parseFloat(partVentaInput.value.replace(',', '.'));

    let isValid = true;
    const checks = [
        [partNombreInput, !partNombreInput.value.trim()],
        [partSkuInput, !partSkuInput.value.trim()],
        [partStockInput, isNaN(stockNum) || stockNum < 0],
        [partStockMinimoInput, isNaN(stockMinimoNum) || stockMinimoNum < 0],
        [partCostoInput, isNaN(costoNum) || costoNum < 0],
        [partVentaInput, isNaN(ventaNum) || ventaNum < 0],
    ];

    checks.forEach(([input, hasError]) => {
        input.closest('.field').classList.toggle('has-error', hasError);
        if (hasError) isValid = false;
    });

    if (!isValid) return;

    const selectedOption = partCategoriaSelect.options[partCategoriaSelect.selectedIndex];

    const payload = {
        sku: partSkuInput.value.trim(),
        name: partNombreInput.value.trim(),
        category: partCategoriaSelect.value,
        icon: selectedOption.dataset.icon,
        current_stock: stockNum,
        minimum_stock: stockMinimoNum,
        cost_price: costoNum,
        sale_price: ventaNum,
    };

    const saveBtn = document.getElementById('part-save');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';

    try {
        const url = editingPartId ? `${API_URL}/${editingPartId}` : API_URL;
        const method = editingPartId ? 'PUT' : 'POST';

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
            if (response.status === 422 && result.errors) {
                alert(Object.values(result.errors).flat().join('\n'));
            } else {
                alert(result.message || 'No se pudo guardar el repuesto.');
            }
            return;
        }

        closePartModal();
        await loadParts();

    } catch (error) {
        console.error(error);
        alert('No se pudo guardar el repuesto.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar Repuesto';
    }
});

/* ---------- primer render ---------- */

loadParts();
