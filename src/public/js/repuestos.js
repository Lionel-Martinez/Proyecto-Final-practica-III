const page = document.querySelector('.repuestos-page');

const API_URL = page?.dataset.apiUrl;

const partsContainer = document.getElementById('parts-container');

const addPartButton = document.getElementById('add-part-btn');
const partModal = document.getElementById('part-modal');
const partModalClose = document.getElementById('part-modal-close');
const partModalCancel = document.getElementById('part-modal-cancel');
const partForm = document.getElementById('part-form');
const partModalTitle = document.getElementById('part-modal-title');

let editingPartId = null;

const partSkuInput = document.getElementById('part-sku');
const partNameInput = document.getElementById('part-name');
const partStockInput = document.getElementById('part-stock');
const partMinimumStockInput = document.getElementById('part-minimum-stock');
const partCostInput = document.getElementById('part-cost');
const partSaleInput = document.getElementById('part-sale');


function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function formatMoney(value) {
    return Number(value ?? 0).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
    });
}


async function loadParts() {
    if (!partsContainer || !API_URL) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                'No se pudieron cargar los repuestos.'
            );
        }

        const parts = await response.json();

        renderParts(parts);

    } catch (error) {
        console.error(error);

        partsContainer.innerHTML = `
            <div class="client-empty-section">
                No se pudieron cargar los repuestos.
            </div>
        `;
    }
}


function renderParts(parts) {
    if (!parts.length) {
        partsContainer.innerHTML = `
            <div class="client-empty-section">
                No hay repuestos registrados.
            </div>
        `;

        return;
    }

    partsContainer.innerHTML = parts.map(part => {
        const stockLow =
            Number(part.current_stock) <= Number(part.minimum_stock);

        return `
            <article class="part-card">

                <div class="part-info">

                    <h3>
                        ${escapeHtml(part.name)}
                    </h3>

                    <p>
                        SKU:
                        ${escapeHtml(part.sku)}
                    </p>

                    <p>
                        Stock:
                        ${escapeHtml(part.current_stock)}
                    </p>

                    <p>
                        Stock mínimo:
                        ${escapeHtml(part.minimum_stock)}
                    </p>

                    ${stockLow ? `
                        <p class="part-stock-low">
                            ⚠ Stock bajo
                        </p>
                    ` : ''}

                </div>

                <div class="part-prices">

                    <p>
                        Costo:
                        ${formatMoney(part.cost_price)}
                    </p>

                    <p>
                        Venta:
                        ${formatMoney(part.sale_price)}
                    </p>

                    <button
                        type="button"
                        class="part-edit-btn"
                        data-part-id="${part.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="part-delete-btn"
                        data-part-id="${part.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </article>
        `;
    }).join('');
}


function openPartModal() {
    if (!partModal) {
        return;
    }

    partModal.hidden = false;
}


function closePartModal() {
    if (!partModal) {
        return;
    }

    partModal.hidden = true;
}


function openAddPartModal() {
    editingPartId = null;

    partForm?.reset();

    if (partModalTitle) {
        partModalTitle.textContent = 'Agregar repuesto';
    }

    openPartModal();
}


addPartButton?.addEventListener('click', openAddPartModal);


async function openEditPartModal(partId) {
    if (!API_URL || !partForm) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${partId}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                'No se pudo cargar el repuesto.'
            );
        }

        const part = await response.json();

        editingPartId = part.id;

        partSkuInput.value = part.sku ?? '';
        partNameInput.value = part.name ?? '';
        partStockInput.value = part.current_stock ?? 0;
        partMinimumStockInput.value = part.minimum_stock ?? 0;
        partCostInput.value = part.cost_price ?? 0;
        partSaleInput.value = part.sale_price ?? 0;

        if (partModalTitle) {
            partModalTitle.textContent = 'Editar repuesto';
        }

        openPartModal();

    } catch (error) {
        console.error(
            'No se pudo cargar el repuesto:',
            error
        );
    }
}


partsContainer?.addEventListener('click', async event => {

    const editButton = event.target.closest('.part-edit-btn');

    if (editButton) {
        const partId = editButton.dataset.partId;

        await openEditPartModal(partId);

        return;
    }

    const deleteButton = event.target.closest('.part-delete-btn');

    if (!deleteButton) {
        return;
    }

    const partId = deleteButton.dataset.partId;

    const confirmed = window.confirm(
        '¿Seguro que querés eliminar este repuesto?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${partId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content'),
            },
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(
                'Error al eliminar repuesto:',
                result
            );

            return;
        }

        await loadParts();

    } catch (error) {
        console.error(
            'No se pudo eliminar el repuesto:',
            error
        );
    }
});


partModalClose?.addEventListener('click', closePartModal);

partModalCancel?.addEventListener('click', closePartModal);


partModal?.addEventListener('click', event => {
    if (event.target === partModal) {
        closePartModal();
    }
});


partForm?.addEventListener('submit', async event => {
    event.preventDefault();

    if (!API_URL || !partForm) {
        return;
    }

    const formData = new FormData(partForm);

    const data = {
        sku: formData.get('sku'),
        name: formData.get('name'),
        current_stock: Number(formData.get('current_stock')),
        minimum_stock: Number(formData.get('minimum_stock')),
        cost_price: Number(formData.get('cost_price')),
        sale_price: Number(formData.get('sale_price')),
    };

    try {
        const url = editingPartId
            ? `${API_URL}/${editingPartId}`
            : API_URL;

        const method = editingPartId
            ? 'PUT'
            : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content'),
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(
                'Error al guardar repuesto:',
                result
            );

            return;
        }

        closePartModal();

        partForm.reset();

        editingPartId = null;

        await loadParts();

    } catch (error) {
        console.error(
            'No se pudo guardar el repuesto:',
            error
        );
    }
});


loadParts();
