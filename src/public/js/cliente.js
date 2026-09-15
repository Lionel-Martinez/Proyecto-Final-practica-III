const customerId = document.body.dataset.customerId;
const API_URL = `/api/clientes/${customerId}/dispositivos`;

const devicesContainer = document.getElementById('devices-container');

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

function renderDevices(devices) {
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
addDeviceBtn?.addEventListener('click', openDeviceModal);
deviceModalClose?.addEventListener('click', closeDeviceModal);
deviceCancelBtn?.addEventListener('click', closeDeviceModal);
deviceModalOverlay?.addEventListener('click', closeDeviceModal);
deviceForm?.addEventListener('submit', createDevice);

loadDevices();
