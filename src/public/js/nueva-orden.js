(function () {
    const form = document.getElementById('wizard-form');
    const panels = document.querySelectorAll('.wizard-panel');
    const railSteps = document.querySelectorAll('.rail-step');
    const contextCards = document.querySelectorAll('[data-context]');
    const progressFill = document.getElementById('progress-fill');
    const progressLabel = document.getElementById('progress-label');
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');

    const stepLabels = {
        1: 'Paso 1 de 4 — Datos del cliente',
        2: 'Paso 2 de 4 — Datos del equipo',
        3: 'Paso 3 de 4 — Foto y checklist',
        4: 'Paso 4 de 4 — Revisión final',
    };

    let currentStep = 1;
    let maxStepReached = 1;
    let clienteExistenteId = null;

    function goToStep(step) {
        currentStep = step;

        panels.forEach((panel) => {
            panel.classList.toggle('active', Number(panel.dataset.panel) === step);
        });

        railSteps.forEach((rail) => {
            const railStep = Number(rail.dataset.step);
            rail.classList.toggle('active', railStep === step);
            rail.classList.toggle('done', railStep < step);
        });

        contextCards.forEach((card) => {
            card.hidden = Number(card.dataset.context) !== step;
        });

        progressFill.style.width = `${(step / 4) * 100}%`;
        progressLabel.textContent = stepLabels[step];

        btnBack.hidden = step === 1;
        btnNext.innerHTML = step === 4
            ? 'Registrar orden'
            : `Continuar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

        if (step === 4) {
            fillReview();
        }
    }

    function markError(input, hasError) {
        const field = input.closest('.field');
        if (!field) return;
        field.classList.toggle('has-error', hasError);
        if (hasError) {
            field.classList.add('shake');
            setTimeout(() => field.classList.remove('shake'), 320);
        }
    }

    function validateStep(step) {
        let valid = true;

        if (step === 1) {
            const nombre = document.getElementById('nombre');
            const hasError = !nombre.value.trim();
            markError(nombre, hasError);
            if (hasError) valid = false;
        }

        if (step === 2) {
            ['marca', 'modelo', 'problema'].forEach((id) => {
                const input = document.getElementById(id);
                const hasError = !input.value.trim();
                markError(input, hasError);
                if (hasError) valid = false;
            });
        }

        return valid;
    }

    function fillReview() {
        document.getElementById('review-nombre').textContent =
            document.getElementById('nombre').value.trim() || '—';

        document.getElementById('review-dni').textContent =
            'DNI: ' + (document.getElementById('dni').value.trim() || 'sin registrar');

        document.getElementById('review-contacto').textContent =
            document.getElementById('contacto').value.trim() || 'Sin contacto';

        const tipoSelect = document.getElementById('tipo');
        const tipoLabel = tipoSelect.options[tipoSelect.selectedIndex].text;
        const marca = document.getElementById('marca').value.trim();
        const modelo = document.getElementById('modelo').value.trim();

        document.getElementById('review-equipo').textContent =
            `${tipoLabel}: ${marca} ${modelo}`.trim();

        document.getElementById('review-problema').textContent =
            document.getElementById('problema').value.trim() || '—';

        const checked = Array.from(document.querySelectorAll('#checklist input:checked'))
            .map((c) => c.value);

        document.getElementById('review-checklist').textContent = checked.length
            ? checked.join(', ')
            : 'Sin observaciones marcadas.';

        document.getElementById('review-foto').textContent = photoInput.files.length
            ? 'Foto adjunta correctamente.'
            : 'Sin foto adjunta.';
    }

    btnNext.addEventListener('click', () => {
        if (currentStep < 4) {
            if (!validateStep(currentStep)) return;

            maxStepReached = Math.max(maxStepReached, currentStep + 1);
            goToStep(currentStep + 1);
        } else {
            form.submit();
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) goToStep(currentStep - 1);
    });

    railSteps.forEach((rail) => {
        rail.addEventListener('click', () => {
            const step = Number(rail.dataset.step);
            if (step <= maxStepReached) goToStep(step);
        });
    });

    /* ---------- búsqueda por DNI ---------- */

    const dniInput = document.getElementById('dni');
    const nombreInput = document.getElementById('nombre');
    const contactoInput = document.getElementById('contacto');
    const clienteStatus = document.getElementById('cliente-status');
    const historyChip = document.getElementById('history-chip');

    dniInput.addEventListener('blur', async () => {
        const dni = dniInput.value.trim();
        clienteExistenteId = null;

        if (!dni) {
            clienteStatus.hidden = true;
            historyChip.hidden = true;
            return;
        }

        try {
            const response = await fetch(`${window.ULICEL_ORDER_URLS.buscarCliente}?dni=${encodeURIComponent(dni)}`, {
                headers: { 'Accept': 'application/json' },
            });

            const data = await response.json();

            if (data.encontrado) {
                clienteExistenteId = data.cliente.id;
                nombreInput.value = data.cliente.nombre;
                contactoInput.value = data.cliente.telefono || data.cliente.email || '';

                clienteStatus.hidden = false;
                clienteStatus.classList.add('success');
                clienteStatus.textContent = 'Cliente encontrado — se completaron sus datos automáticamente.';

                if (data.cliente.visitas_previas > 0) {
                    historyChip.hidden = false;
                    historyChip.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 16 14"></polyline></svg> ${data.cliente.visitas_previas} orden(es) previa(s)`;
                } else {
                    historyChip.hidden = true;
                }
            } else {
                clienteStatus.hidden = false;
                clienteStatus.classList.remove('success');
                clienteStatus.textContent = 'Cliente nuevo — se creará al registrar la orden.';
                historyChip.hidden = true;
            }
        } catch (error) {
            console.error(error);
        }
    });

    /* ---------- foto: dropzone ---------- */

    const dropzone = document.getElementById('dropzone');
    const photoInput = document.getElementById('photo-input');
    const dropzoneEmpty = document.getElementById('dropzone-empty');
    const dropzonePreview = document.getElementById('dropzone-preview');
    const dropzoneRemove = document.getElementById('dropzone-remove');

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

    dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            photoInput.click();
        }
    });

    photoInput.addEventListener('change', () => {
        if (photoInput.files[0]) showPreview(photoInput.files[0]);
    });

    ['dragenter', 'dragover'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
        });
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
        photoInput.value = '';
        dropzonePreview.hidden = true;
        dropzoneEmpty.hidden = false;
        dropzoneRemove.hidden = true;
    });

    goToStep(1);
})();
