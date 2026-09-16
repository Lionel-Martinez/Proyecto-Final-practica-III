const page = document.querySelector('.proveedores-page');

const API_URL = page?.dataset.apiUrl;

const suppliersContainer = document.getElementById(
    'suppliers-container'
);

const addSupplierButton = document.getElementById(
    'add-supplier-btn'
);

const supplierModal = document.getElementById(
    'supplier-modal'
);

const supplierModalClose = document.getElementById(
    'supplier-modal-close'
);

const supplierModalCancel = document.getElementById(
    'supplier-modal-cancel'
);

const supplierForm = document.getElementById(
    'supplier-form'
);


function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


async function loadSuppliers() {
    if (!suppliersContainer || !API_URL) {
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
                'No se pudieron cargar los proveedores.'
            );
        }

        const suppliers = await response.json();

        renderSuppliers(suppliers);

    } catch (error) {
        console.error(error);

        suppliersContainer.innerHTML = `
            <div class="client-empty-section">
                No se pudieron cargar los proveedores.
            </div>
        `;
    }
}


function renderSuppliers(suppliers) {
    if (!suppliers.length) {
        suppliersContainer.innerHTML = `
            <div class="client-empty-section">
                No hay proveedores registrados.
            </div>
        `;

        return;
    }

    suppliersContainer.innerHTML = suppliers.map(supplier => `
        <article class="supplier-card">

            <div class="supplier-info">

                <h3>
                    ${escapeHtml(supplier.name)}
                </h3>

                <p>
                    Contacto:
                    ${escapeHtml(supplier.contact_name)}
                </p>

                <p>
                    Teléfono:
                    ${escapeHtml(supplier.phone)}
                </p>

                <p>
                    Email:
                    ${escapeHtml(supplier.email)}
                </p>

                <p>
                    Dirección:
                    ${escapeHtml(supplier.address)}
                </p>

            </div>

        </article>
    `).join('');
}


function openSupplierModal() {
    if (!supplierModal) {
        return;
    }

    supplierForm?.reset();

    supplierModal.hidden = false;
}


function closeSupplierModal() {
    if (!supplierModal) {
        return;
    }

    supplierModal.hidden = true;
}


addSupplierButton?.addEventListener(
    'click',
    openSupplierModal
);


supplierModalClose?.addEventListener(
    'click',
    closeSupplierModal
);


supplierModalCancel?.addEventListener(
    'click',
    closeSupplierModal
);


supplierModal?.addEventListener(
    'click',
    event => {
        if (event.target === supplierModal) {
            closeSupplierModal();
        }
    }
);


supplierForm?.addEventListener(
    'submit',
    async event => {
        event.preventDefault();

        if (!API_URL || !supplierForm) {
            return;
        }

        const formData = new FormData(supplierForm);

        const data = {
            name: formData.get('name'),
            contact_name: formData.get('contact_name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
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
                console.error(
                    'Error al guardar proveedor:',
                    result
                );

                return;
            }

            closeSupplierModal();
            supplierForm.reset();

            await loadSuppliers();

        } catch (error) {
            console.error(
                'No se pudo guardar el proveedor:',
                error
            );
        }
    }
);


loadSuppliers();
