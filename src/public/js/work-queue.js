(function () {
    const board = document.getElementById('board');
    const API_URL = board?.dataset.apiUrl;

    const colPendiente = document.getElementById('col-pendiente');
    const colProgreso = document.getElementById('col-progreso');
    const colEntregada = document.getElementById('col-entregada');

    let ORDERS = [];
    let ordenSeleccionada = null;

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

    function formatFecha(iso) {
        if (!iso) return 'Sin fecha';
        return new Date(iso).toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
        });
    }

    async function loadBoard() {
        if (!API_URL) return;

        try {
            const response = await fetch(API_URL, { headers: { 'Accept': 'application/json' } });

            if (!response.ok) throw new Error('No se pudo cargar la cola de trabajo.');

            ORDERS = await response.json();
            renderBoard();

        } catch (error) {
            console.error(error);
            colPendiente.innerHTML = `<p class="board-empty">No se pudo cargar la cola de trabajo.</p>`;
        }
    }

    function renderBoard() {
        const grupos = { pendiente: [], progreso: [], entregada: [] };

        ORDERS.forEach((order) => grupos[order.columna]?.push(order));

        renderColumna(colPendiente, grupos.pendiente, 'pendiente');
        renderColumna(colProgreso, grupos.progreso, 'progreso');
        renderColumna(colEntregada, grupos.entregada, 'entregada');

        document.getElementById('count-pendiente').textContent = grupos.pendiente.length;
        document.getElementById('count-progreso').textContent = grupos.progreso.length;
        document.getElementById('count-entregada').textContent = grupos.entregada.length;
    }

        function renderColumna(container, orders, columna) {
        if (!orders.length) {
            container.innerHTML = `<p class="board-empty">Sin órdenes acá por ahora.</p>`;
            return;
        }

        container.innerHTML = orders.map((order) => {
            const esUrgente = order.priority === 'urgente';
            const esListo = order.status === 'listo';
            const esEntregado = order.status === 'entregado';

            let flag = '';
            if (columna === 'pendiente' && esUrgente) {
                flag = `<span class="job-flag"><span class="dot"></span>Urgente</span>`;
            } else if (columna === 'progreso') {
                flag = `<span class="job-flag is-progress">En progreso</span>`;
            } else if (esListo) {
                flag = `<span class="job-flag is-progress">Pendiente de retiro</span>`;
            } else if (esEntregado) {
                flag = `<span class="job-flag is-done">Entregada</span>`;
            }

            let botonPrincipal = '';
            if (columna === 'pendiente') {
                botonPrincipal = `<button type="button" class="start-btn" data-action="iniciar" data-order-id="${order.id}">Iniciar reparación</button>`;
            } else if (columna === 'progreso') {
                botonPrincipal = `<button type="button" class="start-btn" data-action="listo" data-order-id="${order.id}">Marcar como listo</button>`;
            } else if (esListo) {
                botonPrincipal = `<button type="button" class="start-btn" data-action="entregar" data-order-id="${order.id}">Confirmar entrega</button>`;
            } else {
                botonPrincipal = `<button type="button" class="start-btn" disabled>Entregada</button>`;
            }

            const botonCancelar = (columna === 'pendiente' || columna === 'progreso')
                ? `<button type="button" class="cancel-btn" data-action="cancelar" data-order-id="${order.id}">Cancelar orden</button>`
                : '';

            return `
                <article class="job-card status-${columna} priority-${escapeHtml(order.priority)}">
                    <div class="job-card-head">
                        <span class="job-order-chip">#${order.id}</span>
                        ${flag}
                    </div>
                    <h3>${escapeHtml(order.cliente)}</h3>
                    <p class="falla">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 1 1 5.4-5.4z"></path></svg>
                        ${escapeHtml(order.equipo)} — ${escapeHtml(order.reported_problem)}
                    </p>
                    <div class="job-card-foot">
                        <span class="job-date">Ingreso: ${formatFecha(order.received_at)}</span>
                        ${botonPrincipal}
                        ${botonCancelar}
                    </div>
                </article>
            `;
        }).join('');
    }

        board?.addEventListener('click', async (event) => {
        const btn = event.target.closest('[data-action]');
        if (!btn) return;

        const orderId = Number(btn.dataset.orderId);
        const order = ORDERS.find((o) => o.id === orderId);

        if (btn.dataset.action === 'iniciar') {
            await cambiarEstadoSimple(order, btn, 'iniciar', 'PUT', 'Iniciando...', 'Iniciar reparación');
        } else if (btn.dataset.action === 'listo') {
            await cambiarEstadoSimple(order, btn, 'listo', 'PUT', 'Guardando...', 'Marcar como listo');
        } else if (btn.dataset.action === 'cancelar') {
            if (confirm(`¿Cancelar la orden #${order.id}? El equipo se devuelve al cliente sin reparar.`)) {
                await cambiarEstadoSimple(order, btn, 'cancelar', 'POST', 'Cancelando...', 'Cancelar orden');
            }
        } else if (btn.dataset.action === 'entregar') {
            abrirModalEntrega(order);
        }
    });

    async function cambiarEstadoSimple(order, btn, accion, metodo, textoCargando, textoOriginal) {
        btn.disabled = true;
        btn.textContent = textoCargando;

        try {
            const response = await fetch(`${API_URL}/${order.id}/${accion}`, {
                method: metodo,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'No se pudo actualizar la orden.');

            await loadBoard();

        } catch (error) {
            console.error(error);
            alert(error.message);
            btn.disabled = false;
            btn.textContent = textoOriginal;
        }
    }

    const overlay = document.getElementById('finalize-overlay');
    const modalOrderId = document.getElementById('modal-order-id');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');

    const dropzone = document.getElementById('modal-dropzone');
    const photoInput = document.getElementById('modal-photo-input');
    const dropzoneEmpty = document.getElementById('modal-dropzone-empty');
    const dropzonePreview = document.getElementById('modal-dropzone-preview');
    const dropzoneRemove = document.getElementById('modal-dropzone-remove');

    function abrirModalEntrega(order) {
        ordenSeleccionada = order;
        modalOrderId.textContent = `#${order.id}`;
        resetDropzone();
        overlay.hidden = false;
    }

    function cerrarModalEntrega() {
        overlay.hidden = true;
        ordenSeleccionada = null;
    }

    function resetDropzone() {
        photoInput.value = '';
        dropzonePreview.hidden = true;
        dropzoneEmpty.hidden = false;
        dropzoneRemove.hidden = true;
    }

    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            dropzonePreview.src = e.target.result;
            dropzonePreview.hidden = false;
            dropzoneEmpty.hidden = true;
            dropzoneRemove.hidden = false;
        };
        reader.readAsDataURL(file);
    }

    dropzone.addEventListener('click', (e) => {
        if (e.target !== dropzoneRemove) photoInput.click();
    });

    photoInput.addEventListener('change', () => {
        if (photoInput.files[0]) showPreview(photoInput.files[0]);
    });

    ['dragenter', 'dragover'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
    });

    ['dragleave', 'drop'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('drag-over'); });
    });

    dropzone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            photoInput.files = e.dataTransfer.files;
            showPreview(file);
        }
    });

    dropzoneRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        resetDropzone();
    });

    modalClose.addEventListener('click', cerrarModalEntrega);
    modalCancel.addEventListener('click', cerrarModalEntrega);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrarModalEntrega(); });

    modalConfirm.addEventListener('click', async () => {
        if (!ordenSeleccionada) return;

        if (!photoInput.files[0]) {
            alert('La foto de entrega es obligatoria.');
            return;
        }

        modalConfirm.disabled = true;
        modalConfirm.querySelector('.modal-confirm-label').textContent = 'Guardando...';

        const formData = new FormData();
        formData.append('foto', photoInput.files[0]);

        try {
            const response = await fetch(`${API_URL}/${ordenSeleccionada.id}/entregar`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    throw new Error(Object.values(result.errors).flat().join('\n'));
                }
                throw new Error(result.message || 'No se pudo confirmar la entrega.');
            }

            cerrarModalEntrega();
            await loadBoard();

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            modalConfirm.disabled = false;
            modalConfirm.querySelector('.modal-confirm-label').textContent = 'Confirmar entrega';
        }
    });

    loadBoard();
})();
