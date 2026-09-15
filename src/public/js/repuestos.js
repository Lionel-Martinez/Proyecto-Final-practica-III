const page = document.querySelector('.repuestos-page');

const API_URL = page?.dataset.apiUrl;

const partsContainer = document.getElementById('parts-container');

const addPartButton = document.getElementById('add-part-btn');
const partModal = document.getElementById('part-modal');
const partModalClose = document.getElementById('part-modal-close');
const partModalCancel = document.getElementById('part-modal-cancel');
const partForm = document.getElementById('part-form');

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

    partsContainer.innerHTML = parts.map(part => `
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

            </div>

        </article>
    `).join('');
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

addPartButton?.addEventListener('click', openPartModal);

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
        const response = await fetch(API_URL, {
            method: 'POST',
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
            console.error('Error al crear repuesto:', result);
            return;
        }

        closePartModal();

        partForm.reset();

        await loadParts();

    } catch (error) {
        console.error(
            'No se pudo crear el repuesto:',
            error
        );
    }
});

loadParts();
