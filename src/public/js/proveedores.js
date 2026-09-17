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

const supplierModalTitle = document.getElementById(
    'supplier-modal-title'
);

let editingSupplierId = null;


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

                <button
                    type="button"
                    class="supplier-edit-btn"
                    data-supplier-id="${supplier.id}"
                >
                Editar
                </button>

                <button
                    type="button"
                    class="supplier-delete-btn"
                    data-supplier-id="${supplier.id}"
                >
                    Eliminar
                </button>

            </div>

        </article>
    `).join('');
}


function openSupplierModal() {
    if (!supplierModal) {
        return;
    }

    supplierForm?.reset();

    editingSupplierId = null;

    if (supplierModalTitle) {
        supplierModalTitle.textContent = 'Agregar proveedor';
    }

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


async function openEditSupplierModal(supplierId) {
    if (!API_URL || !supplierForm) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${supplierId}`,
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                'No se pudo cargar el proveedor.'
            );
        }

        const supplier = await response.json();

        editingSupplierId = supplier.id;

        supplierForm.elements.name.value =
            supplier.name ?? '';

        supplierForm.elements.contact_name.value =
            supplier.contact_name ?? '';

        supplierForm.elements.phone.value =
            supplier.phone ?? '';

        supplierForm.elements.email.value =
            supplier.email ?? '';

        supplierForm.elements.address.value =
            supplier.address ?? '';

        if (supplierModalTitle) {
            supplierModalTitle.textContent =
                'Editar proveedor';
        }

        supplierModal.hidden = false;

    } catch (error) {
        console.error(
            'No se pudo cargar el proveedor:',
            error
        );
    }
}


suppliersContainer?.addEventListener(
    'click',
    async event => {
        const editButton = event.target.closest(
            '.supplier-edit-btn'
        );

        if (editButton) {
            const supplierId =
                editButton.dataset.supplierId;

            await openEditSupplierModal(supplierId);

            return;
        }

        const deleteButton = event.target.closest(
            '.supplier-delete-btn'
        );

        if (!deleteButton) {
            return;
        }

        const supplierId =
            deleteButton.dataset.supplierId;

        const confirmed = window.confirm(
            '¿Seguro que querés eliminar este proveedor?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${supplierId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector(
                                'meta[name="csrf-token"]'
                            )
                            ?.getAttribute('content'),
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error(
                    'Error al eliminar proveedor:',
                    result
                );

                return;
            }

            await loadSuppliers();

        } catch (error) {
            console.error(
                'No se pudo eliminar el proveedor:',
                error
            );
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

        const formData = new FormData(
            supplierForm
        );

        const data = {
            name: formData.get('name'),
            contact_name: formData.get('contact_name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
        };

        try {
            const url = editingSupplierId
                ? `${API_URL}/${editingSupplierId}`
                : API_URL;

            const method = editingSupplierId
                ? 'PUT'
                : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document
                        .querySelector(
                            'meta[name="csrf-token"]'
                        )
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

            editingSupplierId = null;

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
