(function () {
    const raw = sessionStorage.getItem('ulicel_presupuesto');
    const data = raw ? JSON.parse(raw) : null;
        sessionStorage.removeItem('ulicel_presupuesto');

    const currency = (n) => `$${Number(n ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (!data || !data.items || !data.items.length) {
        document.getElementById('items-body').innerHTML = `<tr><td colspan="2" class="empty-note">No hay servicios seleccionados. Volvé a la Lista de Precios y elegí al menos uno.</td></tr>`;
        document.getElementById('btn-imprimir').disabled = true;
        document.getElementById('btn-whatsapp').style.pointerEvents = 'none';
        document.getElementById('btn-whatsapp').style.opacity = '0.5';
        return;
    }

    const folio = 'PRE-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 900 + 100);

    document.getElementById('doc-folio').textContent = folio;
    document.getElementById('p-cliente').textContent = data.cliente || 'Consumidor final';
    document.getElementById('p-fecha').textContent = new Date().toLocaleDateString('es-AR');

    document.getElementById('items-body').innerHTML = data.items.map((item) => `
        <tr>
            <td>${escapeHtml(item.name)}</td>
            <td class="num">${currency(item.reference_price)}</td>
        </tr>
    `).join('');

    const total = data.items.reduce((sum, item) => sum + Number(item.reference_price), 0);
    document.getElementById('p-total').textContent = currency(total);

    document.getElementById('btn-imprimir').addEventListener('click', () => window.print());

    const textoWhatsapp = [
        `*Presupuesto Ulicel* (${folio})`,
        `Cliente: ${data.cliente || 'Consumidor final'}`,
        '',
        ...data.items.map((item) => `• ${item.name}: ${currency(item.reference_price)}`),
        '',
        `Total: ${currency(total)}`,
        '',
        'Válido por 7 días. El valor final puede variar según diagnóstico técnico.',
    ].join('\n');

    document.getElementById('btn-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(textoWhatsapp)}`;
})();
