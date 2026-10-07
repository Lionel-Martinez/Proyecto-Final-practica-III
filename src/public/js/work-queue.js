(function () {
    const board = document.getElementById('board');
    const API_URL = board?.dataset.apiUrl;


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
            document.getElementById('board-months').innerHTML = `<p class="board-empty">No se pudo cargar la cola de trabajo.</p>`;
        }
    }

    function renderBoard() {
    const contenedor = document.getElementById('board-months');

    if (!contenedor) {
        return;
    }

    if (!ORDERS.length) {
        contenedor.innerHTML = `
            <p class="board-empty">
                No hay órdenes en la cola de trabajo.
            </p>
        `;
        return;
    }

    const meses = new Map();

    ORDERS.forEach((order) => {
        const mes = order.mes_ingreso || 'sin-fecha';

        if (!meses.has(mes)) {
            meses.set(mes, []);
        }

        meses.get(mes).push(order);
    });

    contenedor.innerHTML = [...meses.entries()]
        .sort(([mesA], [mesB]) => mesB.localeCompare(mesA))
        .map(([mes, orders]) => renderMes(mes, orders))
        .join('');
}

function nombreMes(clave) {
    if (clave === 'sin-fecha') {
        return 'Sin fecha de ingreso';
    }

    const [anio, mes] = clave.split('-');

    const fecha = new Date(Number(anio), Number(mes) - 1, 1);

    return fecha.toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
    }).replace(/^./, (letra) => letra.toUpperCase());
}

function renderGrupoMes(orders, columna) {
    const meses = agruparPorMes(orders);

    return [...meses.entries()]
        .sort(([mesA], [mesB]) => mesB.localeCompare(mesA))
        .map(([mes, ordenes]) => {
            return `
                <section class="board-month">
                    <h3 class="board-month-title">${escapeHtml(nombreMes(mes))}</h3>
                    <div class="board-month-body">
                        ${ordenes.map((order) => renderOrden(order, columna)).join('')}
                    </div>
                </section>
            `;
        })
        .join('');
}

function renderColumna(container, orders, columna) {
    if (!orders.length) {
        container.innerHTML = `<p class="board-empty">Sin órdenes acá por ahora.</p>`;
        return;
    }

    if (columna !== 'entregada') {
        container.innerHTML = renderGrupoMes(orders, columna);
        return;
    }

    const situaciones = {
        retiro_pendiente: {
            titulo: '🟢 Listos — retiro pendiente',
            ordenes: [],
        },
        entregado: {
            titulo: '🔵 Entregados',
            ordenes: [],
        },
        olvidada: {
            titulo: '🔴 Olvidados',
            ordenes: [],
        },
    };

    orders.forEach((order) => {
        if (situaciones[order.situacion]) {
            situaciones[order.situacion].ordenes.push(order);
        }
    });

    container.innerHTML = Object.values(situaciones)
        .filter((grupo) => grupo.ordenes.length)
        .map((grupo) => `
            <section class="board-situation">
                <h3 class="board-situation-title">${grupo.titulo}</h3>
                <div class="board-situation-body">
                    ${renderGrupoMes(grupo.ordenes, 'entregada')}
                </div>
            </section>
        `)
        .join('');

    if (!container.innerHTML) {
        container.innerHTML = `<p class="board-empty">Sin órdenes acá por ahora.</p>`;
    }
}

function renderBoard() {
    const contenedor = document.getElementById('board-months');

    if (!contenedor) {
        return;
    }

    if (!ORDERS.length) {
        contenedor.innerHTML = `
            <p class="board-empty">
                No hay órdenes en la cola de trabajo.
            </p>
        `;
        return;
    }

    const meses = new Map();

    ORDERS.forEach((order) => {
        const mes = order.mes_ingreso || 'sin-fecha';

        if (!meses.has(mes)) {
            meses.set(mes, []);
        }

        meses.get(mes).push(order);
    });

    contenedor.innerHTML = [...meses.entries()]
        .sort(([mesA], [mesB]) => mesB.localeCompare(mesA))
        .map(([mes, orders]) => renderMes(mes, orders))
        .join('');
}

function nombreMes(clave) {
    if (clave === 'sin-fecha') {
        return 'Sin fecha de ingreso';
    }

    const [anio, mes] = clave.split('-');

    const fecha = new Date(
        Number(anio),
        Number(mes) - 1,
        1
    );

    return fecha.toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
    }).replace(/^./, (letra) => letra.toUpperCase());
}

function renderMes(mes, orders) {
    const grupos = {
        pendiente: [],
        en_reparacion: [],
        retiro_pendiente: [],
        entregado: [],
        olvidada: [],
    };

    orders.forEach((order) => {
        if (order.status === 'recibido') {
            grupos.pendiente.push(order);
        } else if (order.status === 'en_reparacion') {
            grupos.en_reparacion.push(order);
        } else if (order.situacion === 'retiro_pendiente') {
            grupos.retiro_pendiente.push(order);
        } else if (order.situacion === 'entregado') {
            grupos.entregado.push(order);
        } else if (order.situacion === 'olvidada') {
            grupos.olvidada.push(order);
        }
    });

    const total = orders.length;

    const situaciones = [
        {
            clave: 'pendiente',
            titulo: '🟡 Pendientes',
            orders: grupos.pendiente,
        },
        {
            clave: 'en_reparacion',
            titulo: '🔧 En reparación',
            orders: grupos.en_reparacion,
        },
        {
            clave: 'retiro_pendiente',
            titulo: '🟢 Listos — retiro pendiente',
            orders: grupos.retiro_pendiente,
        },
        {
            clave: 'entregado',
            titulo: '🔵 Entregados',
            orders: grupos.entregado,
        },
        {
            clave: 'olvidada',
            titulo: '🔴 Olvidados',
            orders: grupos.olvidada,
        },
    ];

    const contenido = situaciones
        .filter((grupo) => grupo.orders.length)
        .map((grupo) => `
            <section class="month-situation month-situation-${grupo.clave}">
                <h3 class="month-situation-title">
                    <span>${grupo.titulo}</span>
                    <span class="month-situation-count">${grupo.orders.length}</span>
                </h3>

                <div class="month-situation-orders">
                    ${grupo.orders
                        .map((order) => renderOrden(order, grupo.clave))
                        .join('')}
                </div>
            </section>
        `)
        .join('');

    return `
        <details class="board-month" open>
            <summary class="board-month-head">
                <span class="board-month-title">
                    ${escapeHtml(nombreMes(mes))}
                </span>

                <span class="board-month-count">
                    ${total}
                </span>
            </summary>

            <div class="board-month-content">
                ${contenido}
            </div>
        </details>
    `;
}

function renderOrden(order, situacion) {
    const esUrgente = order.priority === 'urgente';
    const esListo = order.status === 'listo';
    const esEntregado = order.status === 'entregado';

    let flag = '';

    if (situacion === 'olvidada') {
        flag = `
            <span class="job-flag is-forgotten">
                Olvidada
            </span>
        `;
    } else if (situacion === 'pendiente' && esUrgente) {
        flag = `
            <span class="job-flag">
                <span class="dot"></span>
                Urgente
            </span>
        `;
    } else if (situacion === 'en_reparacion') {
        flag = `
            <span class="job-flag is-progress">
                En reparación
            </span>
        `;
    } else if (esListo) {
        flag = `
            <span class="job-flag is-progress">
                Pendiente de retiro
            </span>
        `;
    } else if (esEntregado) {
        flag = `
            <span class="job-flag is-done">
                Entregada
            </span>
        `;
    }

    let botonPrincipal = '';

    if (situacion === 'pendiente') {
        botonPrincipal = `
            <button
                type="button"
                class="start-btn"
                data-action="iniciar"
                data-order-id="${order.id}"
            >
                Iniciar reparación
            </button>
        `;
    } else if (situacion === 'en_reparacion') {
        botonPrincipal = `
            <button
                type="button"
                class="start-btn"
                data-action="listo"
                data-order-id="${order.id}"
            >
                Marcar como listo
            </button>
        `;
    } else if (esListo) {
        botonPrincipal = `
            <button
                type="button"
                class="start-btn"
                data-action="entregar"
                data-order-id="${order.id}"
            >
                Confirmar entrega
            </button>
        `;
    } else {
        botonPrincipal = `
            <button
                type="button"
                class="start-btn"
                disabled
            >
                Entregada
            </button>
        `;
    }

    const botonCancelar = (
        situacion === 'pendiente'
        || situacion === 'en_reparacion'
    )
        ? `
            <button
                type="button"
                class="cancel-btn"
                data-action="cancelar"
                data-order-id="${order.id}"
            >
                Cancelar orden
            </button>
        `
        : '';

    const dias = Number(order.dias_desde_ingreso ?? 0);

    let antiguedad;

    if (dias === 0) {
        antiguedad = 'Hoy';
    } else if (dias === 1) {
        antiguedad = 'Hace 1 día';
    } else {
        antiguedad = `Hace ${dias} días`;
    }

    return `
        <article class="job-card status-${escapeHtml(situacion)} priority-${escapeHtml(order.priority)}">
            <div class="job-card-head">
                <span class="job-order-chip">#${order.id}</span>
                ${flag}
            </div>

            <h3>${escapeHtml(order.cliente)}</h3>

            <p class="falla">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 1 1 5.4-5.4z"></path>
                </svg>

                ${escapeHtml(order.equipo)}
                —
                ${escapeHtml(order.reported_problem)}
            </p>

            <div class="job-card-foot">
                <span class="job-date">
                    Ingreso: ${formatFecha(order.received_at)}
                    · ${antiguedad}
                </span>

                ${botonPrincipal}
                ${botonCancelar}
            </div>
        </article>
    `;
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
