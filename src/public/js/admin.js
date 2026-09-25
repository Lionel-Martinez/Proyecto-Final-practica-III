(function () {
    const userList = document.getElementById('user-list');
    const storeUrl = userList?.dataset.storeUrl;
    const destroyBase = userList?.dataset.destroyBase;

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

    function initials(name) {
        return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
    }

    document.getElementById('user-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombreInput = document.getElementById('user-nombre');
        const nombre = nombreInput.value.trim();

        if (!nombre) return;

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    name: nombre,
                    role: document.getElementById('user-rol').value,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'No se pudo crear el usuario.');
                return;
            }

            const li = document.createElement('li');
            li.dataset.userId = result.id;
            li.innerHTML = `
                <span class="user-avatar">${initials(result.name)}</span>
                <span class="user-name">${escapeHtml(result.name)} <span class="user-username">@${escapeHtml(result.username)}</span></span>
                <span class="user-rol-pill rol-${result.role}">${result.role.charAt(0).toUpperCase() + result.role.slice(1)}</span>
                <button type="button" class="user-remove" data-id="${result.id}" aria-label="Quitar usuario">✕</button>
            `;
            userList.appendChild(li);

            document.getElementById('credential-username').textContent = result.username;
            document.getElementById('credential-password').textContent = result.temp_password;
            document.getElementById('credential-overlay').hidden = false;

            nombreInput.value = '';
            nombreInput.focus();

        } catch (error) {
            console.error(error);
            alert('No se pudo crear el usuario.');
        }
    });

    document.getElementById('credential-close')?.addEventListener('click', () => {
        document.getElementById('credential-overlay').hidden = true;
    });

    userList?.addEventListener('click', async (event) => {
        const btn = event.target.closest('.user-remove');
        if (!btn) return;

        if (!confirm('¿Eliminar este usuario? No va a poder volver a loguearse.')) return;

        try {
            const response = await fetch(`${destroyBase}/${btn.dataset.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'No se pudo eliminar el usuario.');
                return;
            }

            btn.closest('li').remove();

        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el usuario.');
        }
    });
})();
