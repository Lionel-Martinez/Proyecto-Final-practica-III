const customerId = document.body.dataset.customerId;

const API_URL = `/api/clientes/${customerId}/dispositivos`;
const REPAIR_ORDERS_API_URL = `/api/clientes/${customerId}/ordenes`;

const devicesContainer = document.getElementById('devices-container');
const repairOrdersContainer = document.getElementById('repair-orders-container');
const repairOrderDeviceSelect = document.getElementById('repair-order-device');
const repairOrderForm = document.getElementById('repair-order-form');
const repairOrderSaveBtn = document.getElementById('repair-order-save-btn');
const repairOrderModal = document.getElementById('repair-order-modal');
const repairOrderModalOverlay = document.getElementById('repair-order-modal-overlay');
const repairOrderModalClose = document.getElementById('repair-order-modal-close');
const repairOrderCancelBtn = document.getElementById('repair-order-cancel-btn');
const addRepairOrderBtn = document.getElementById('add-repair-order-btn');

const deviceModal = document.getElementById('device-modal');
const deviceModalOverlay = document.getElementById('device-modal-overlay');
const deviceModalClose = document.getElementById('device-modal-close');
const deviceCancelBtn = document.getElementById('device-cancel-btn');
const addDeviceBtn = document.getElementById('add-device-btn');
const deviceForm = document.getElementById('device-form');
const deviceSaveBtn = document.getElementById('device-save-btn');

let editingDeviceId = null;

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

function formatRepairOrderStatus(status) {
    const labels = {
        recibido: 'Recibido',
        en_reparacion: 'En reparación',
        listo: 'Listo',
        entregado: 'Entregado',
        cancelado: 'Cancelado',
    };

    return labels[status] ?? status;
}

function formatRepairOrderPriority(priority) {
    const labels = {
        baja: 'Baja',
        normal: 'Normal',
        urgente: 'Urgente',
    };

    return labels[priority] ?? priority;
}

function renderDevices(devices) {
    if (repairOrderDeviceSelect) {
        repairOrderDeviceSelect.innerHTML = `
            <option value="">
                Seleccioná un dispositivo
            </option>
        `;

        devices.forEach(device => {
            const option = document.createElement('option');

            option.value = device.id;
            option.textContent = `${device.brand} ${device.model}`;

            repairOrderDeviceSelect.appendChild(option);
        });
    }

    if (!devices.length) {
        devicesContainer.innerHTML = `
            <div class="client-empty-section">
                Este cliente todavía no tiene dispositivos registrados.
            </div>
        `;
        return;
    }

    devicesContainer.innerHTML = devices.map(device => `
        <article class="device-card">
            <div class="device-card-main">
                <div class="device-icon">
                    📱
                </div>

                <div class="device-info">
                    <h3>${escapeHtml(device.brand)} ${escapeHtml(device.model)}</h3>

                    <p class="device-type">
                        ${escapeHtml(device.type)}
                    </p>

                    ${
                        device.imei
                            ? `<p class="device-imei">IMEI: ${escapeHtml(device.imei)}</p>`
                            : `<p class="device-imei">Sin IMEI registrado</p>`
                    }
                </div>
            </div>

            <div class="device-actions">
                <button
                    type="button"
                    class="device-edit-btn"
                    data-device-id="${device.id}"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="device-delete-btn"
                    data-device-id="${device.id}"
                >
                    Eliminar
                </button>
            </div>
        </article>
    `).join('');

    document.querySelectorAll('.device-edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const deviceId = Number(button.dataset.deviceId);
            const device = devices.find(item => item.id === deviceId);

            if (device) {
                openDeviceModal(device);
            }
        });
    });

    document.querySelectorAll('.device-delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const deviceId = Number(button.dataset.deviceId);
            deleteDevice(deviceId);
        });
    });
}

async function loadDevices() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron cargar los dispositivos.');
        }

        const devices = await response.json();

        renderDevices(devices);
    } catch (error) {
        console.error(error);

        devicesContainer.innerHTML = `
            <div class="client-empty-section">
                No se pudieron cargar los dispositivos.
            </div>
        `;
    }
}

function openDeviceModal(device = null) {
    editingDeviceId = device ? device.id : null;

    if (device) {
        document.getElementById('device-type').value = device.type;
        document.getElementById('device-brand').value = device.brand;
        document.getElementById('device-model').value = device.model;
        document.getElementById('device-imei').value = device.imei ?? '';

        deviceSaveBtn.textContent = 'Guardar cambios';
    } else {
        resetDeviceForm();

        deviceSaveBtn.textContent = 'Guardar dispositivo';
    }

    deviceModal.classList.remove('hidden');

    document.getElementById('device-type')?.focus();
}

function closeDeviceModal() {
    deviceModal.classList.add('hidden');
}

async function createRepairOrder(event) {
    event.preventDefault();

    const deviceId = repairOrderDeviceSelect?.value;
    const reportedProblem = document.getElementById('repair-order-problem')?.value.trim();
    const priority = document.getElementById('repair-order-priority')?.value;
    const entryNotes = document.getElementById('repair-order-notes')?.value.trim();

    if (!deviceId || !reportedProblem) {
        alert('Seleccioná un dispositivo e indicá el problema reportado.');
        return;
    }

    repairOrderSaveBtn.disabled = true;
    repairOrderSaveBtn.textContent = 'Creando...';

    try {
        const response = await fetch(REPAIR_ORDERS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                device_id: deviceId,
                reported_problem: reportedProblem,
                priority: priority,
                entry_notes: entryNotes || null,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            throw new Error(
                data.message || 'No se pudo crear la orden de reparación.'
            );
        }

        closeRepairOrderModal();
        repairOrderForm?.reset();

        await loadRepairOrders();

    } catch (error) {
        console.error(error);
        alert(error.message);
    } finally {
        repairOrderSaveBtn.disabled = false;
        repairOrderSaveBtn.textContent = 'Crear orden';
    }
}

function resetDeviceForm() {
    deviceForm.reset();
}

async function deleteDevice(deviceId) {
    const confirmed = confirm(
        '¿Estás seguro de que querés eliminar este dispositivo?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${deviceId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo eliminar el dispositivo.'
            );
        }

        await loadDevices();
    } catch (error) {
        console.error(error);

        alert(error.message);
    }
}

async function createDevice(event) {
    event.preventDefault();

    const payload = {
        type: document.getElementById('device-type').value.trim(),
        brand: document.getElementById('device-brand').value.trim(),
        model: document.getElementById('device-model').value.trim(),
        imei: document.getElementById('device-imei').value.trim() || null,
    };

    const isEditing = editingDeviceId !== null;

    const url = isEditing
        ? `${API_URL}/${editingDeviceId}`
        : API_URL;

    const method = isEditing ? 'PUT' : 'POST';

    deviceSaveBtn.disabled = true;

    deviceSaveBtn.textContent = isEditing
        ? 'Guardando cambios...'
        : 'Guardando...';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 422 && data.errors) {
                const messages = Object.values(data.errors)
                    .flat()
                    .join('\n');

                throw new Error(messages);
            }

            throw new Error(
                data.message || 'No se pudo guardar el dispositivo.'
            );
        }

        editingDeviceId = null;

        closeDeviceModal();
        resetDeviceForm();

        await loadDevices();
    } catch (error) {
        console.error(error);

        alert(error.message);
    } finally {
        deviceSaveBtn.disabled = false;
        deviceSaveBtn.textContent = 'Guardar dispositivo';
    }
}

function renderRepairOrders(orders) {
    if (!repairOrdersContainer) {
        return;
    }

    if (!orders.length) {
        repairOrdersContainer.innerHTML = `
            <div class="client-empty-section">
                Este cliente todavía no tiene órdenes de reparación.
            </div>
        `;
        return;
    }

    repairOrdersContainer.innerHTML = orders.map(order => `
        <article class="repair-order-card">
            <div class="repair-order-main">
                <div class="repair-order-info">
                    <h3>
                        Orden #${order.id}
                    </h3>

                    <p>
                        ${escapeHtml(
                            order.dispositivo
                                ? `${order.dispositivo.marca} ${order.dispositivo.modelo}`
                                : 'Dispositivo no disponible'
                        )}
                    </p>

                    <p>
                        Problema:
                        ${escapeHtml(order.reported_problem)}
                    </p>
                    ${
                        order.entry_photo_path
                            ? `
                                <a href="/storage/${escapeHtml(order.entry_photo_path)}" target="_blank" rel="noopener">
                                    <img
                                        src="/storage/${escapeHtml(order.entry_photo_path)}"
                                        alt="Foto de ingreso"
                                        class="repair-order-photo"
                                    >
                                </a>
                            `
                            : ''
                    }
                    ${
                        order.entry_notes
                            ? `
                                <p>
                                    Notas:
                                    ${escapeHtml(order.entry_notes)}
                                </p>
                            `
                            : ''
                    }
                    ${
                        order.technical_diagnosis
                            ? `
                                <p>
                                    Diagnóstico:
                                    ${escapeHtml(order.technical_diagnosis)}
                                </p>
                            `
                            : ''
                    }
                    <p>
                        Ingreso:
                        ${escapeHtml(
                            order.received_at
                            ? new Date(order.received_at).toLocaleString('es-AR')
                            : 'Sin fecha'
                        )}
                    </p>
                </div>

                <div class="repair-order-status">

                    <label>
                        Estado
                        <select
                            class="repair-order-status-select"
                            data-order-id="${order.id}"
                        >
                            <option
                                value="recibido"
                                ${order.status === 'recibido' ? 'selected' : ''}
                        >
                                Recibido
                            </option>

                            <option
                            value="en_reparacion"
                            ${order.status === 'en_reparacion' ? 'selected' : ''}
                        >
                            En reparación
                            </option>

                            <option
                                value="listo"
                                ${order.status === 'listo' ? 'selected' : ''}
                        >
                                Listo
                            </option>

                            <option
                                value="entregado"
                                ${order.status === 'entregado' ? 'selected' : ''}
                        >
                                Entregado
                            </option>

                            <option
                                value="cancelado"
                                ${order.status === 'cancelado' ? 'selected' : ''}
                        >
                                Cancelado
                            </option>
                        </select>
                    </label>

                    <span>
                        ${escapeHtml(formatRepairOrderPriority(order.priority))}
                    </span>

</div>
            </div>
        </article>
    `).join('');
    document.querySelectorAll('.repair-order-status-select').forEach(select => {
        select.addEventListener('change', () => {
            const orderId = Number(select.dataset.orderId);
            const newStatus = select.value;

            updateRepairOrderStatus(orderId, newStatus);
        });
    });
}


async function loadRepairOrders() {
    if (!repairOrdersContainer) {
        return;
    }

    try {
        const response = await fetch(REPAIR_ORDERS_API_URL, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                'No se pudieron cargar las órdenes de reparación.'
            );
        }

        const orders = await response.json();

        renderRepairOrders(orders);
    } catch (error) {
        console.error(error);

        repairOrdersContainer.innerHTML = `
            <div class="client-empty-section">
                No se pudieron cargar las órdenes de reparación.
            </div>
        `;
    }
}

async function updateRepairOrderStatus(orderId, status) {
    try {
        const response = await fetch(
            `${REPAIR_ORDERS_API_URL}/${orderId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    status: status,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'No se pudo actualizar el estado.'
            );
        }

        await loadRepairOrders();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function openRepairOrderModal() {
    repairOrderModal?.classList.remove('hidden');
}

function closeRepairOrderModal() {
    repairOrderModal?.classList.add('hidden');
}

addDeviceBtn?.addEventListener('click', openDeviceModal);
deviceModalClose?.addEventListener('click', closeDeviceModal);
deviceCancelBtn?.addEventListener('click', closeDeviceModal);
deviceModalOverlay?.addEventListener('click', closeDeviceModal);
deviceForm?.addEventListener('submit', createDevice);

addRepairOrderBtn?.addEventListener('click', openRepairOrderModal);
repairOrderModalClose?.addEventListener('click', closeRepairOrderModal);
repairOrderCancelBtn?.addEventListener('click', closeRepairOrderModal);
repairOrderModalOverlay?.addEventListener('click', closeRepairOrderModal);
repairOrderForm?.addEventListener('submit', createRepairOrder);

loadDevices();
loadRepairOrders();
