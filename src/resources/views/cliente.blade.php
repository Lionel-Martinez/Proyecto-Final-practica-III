<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="ulicel-user-role" content="{{ auth()->user()->role }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $customer->first_name }} {{ $customer->last_name }} — Ulicel</title>

    <link rel="stylesheet" href="/css/menu principal.css">
    <link rel="stylesheet" href="/css/Clientes.css">

    <style>
        .client-detail-page {
            max-width: 1100px;
        }

        .client-back {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            margin-bottom: 1.5rem;
            color: #6b7280;
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 700;
        }

        .client-back:hover {
            color: #14161a;
        }

        .client-back svg {
            width: 1rem;
            height: 1rem;
        }

        .client-profile {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 0.9rem;
            padding: 1.5rem;
            box-shadow: 0 8px 25px rgba(16, 24, 40, 0.05);
        }

        .client-profile-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
            padding-bottom: 1.3rem;
            border-bottom: 1px solid #ececec;
        }

        .client-profile-title {
            margin: 0 0 0.35rem;
            font-size: 1.45rem;
            font-weight: 800;
            color: #14161a;
        }

        .client-profile-dni {
            color: #6b7280;
            font-size: 0.88rem;
        }

        .client-profile-balance {
            text-align: right;
        }

        .client-profile-balance-label {
            display: block;
            margin-bottom: 0.2rem;
            color: #8b8f97;
            font-size: 0.76rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .client-profile-balance-value {
            font-size: 1.15rem;
            font-weight: 800;
            color: #14161a;
        }

        .client-profile-balance-value.pending {
            color: #b80f22;
        }

        .client-info-grid {
nano resources/views/cliente.blade.php            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.2rem 2rem;
            padding-top: 1.5rem;
        }

        .client-info-item {
            min-width: 0;
        }

        .client-info-label {
            display: block;
            margin-bottom: 0.3rem;
            color: #8b8f97;
            font-size: 0.76rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .client-info-value {
            color: #14161a;
            font-size: 0.92rem;
            word-break: break-word;
        }

        .client-section {
            margin-top: 1.5rem;
        }

        .client-section-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 0.8rem;
        }

        .client-section-head h2 {
            margin: 0;
            font-size: 1rem;
            font-weight: 800;
        }

        .client-empty-section {
            padding: 1.4rem;
            border: 1px dashed #dcdfe4;
            border-radius: 0.7rem;
            color: #8b8f97;
            background: #fff;
            font-size: 0.88rem;
        }

        .device-card {
            padding: 1rem 1.1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.7rem;
            background: #fff;
        }

        .device-card-main {
            display: flex;
            align-items: center;
            gap: 0.9rem;
        }

        .device-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.7rem;
            height: 2.7rem;
            flex: 0 0 2.7rem;
            border-radius: 0.65rem;
            background: #f3f4f6;
            font-size: 1.25rem;
        }

        .device-card h3 {
            margin: 0 0 0.2rem;
            font-size: 0.95rem;
            font-weight: 800;
            color: #14161a;
        }

        .device-type,
        .device-imei {
            margin: 0.15rem 0 0;
            color: #6b7280;
            font-size: 0.82rem;
        }

        .device-imei {
            color: #8b8f97;
        }

        .device-add-btn {
            border: 0;
            border-radius: 0.55rem;
            padding: 0.55rem 0.85rem;
            background: #14161a;
            color: #fff;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
        }

        .device-add-btn:hover {
            opacity: 0.9;
        }

.device-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.device-modal.hidden {
    display: none;
}

.device-modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
}

.device-modal-content {
    position: relative;
    width: min(520px, 100%);
    padding: 1.5rem;
    background: #fff;
    border-radius: 0.9rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.device-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.device-modal-eyebrow {
    margin: 0 0 0.25rem;
    color: #8b8f97;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.device-modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
}

.device-modal-close {
    border: 0;
    background: transparent;
    color: #6b7280;
    font-size: 1.7rem;
    line-height: 1;
    cursor: pointer;
}

.device-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.device-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.device-form-group label {
    color: #4b5563;
    font-size: 0.78rem;
    font-weight: 700;
}

.device-form-group input,
.device-form-group select {
    width: 100%;
    box-sizing: border-box;
    padding: 0.7rem 0.75rem;
    border: 1px solid #dcdfe4;
    border-radius: 0.55rem;
    background: #fff;
    color: #14161a;
    font: inherit;
    outline: none;
}

.device-form-group input:focus,
.device-form-group select:focus {
    border-color: #14161a;
}

.device-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.7rem;
    margin-top: 1.5rem;
}

.device-cancel-btn,
.device-save-btn {
    border: 0;
    border-radius: 0.55rem;
    padding: 0.65rem 0.9rem;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
}

.device-cancel-btn {
    background: #f1f2f4;
    color: #4b5563;
}

.device-save-btn {
    background: #14161a;
    color: #fff;
}

@media (max-width: 640px) {
    .device-form-grid {
        grid-template-columns: 1fr;
    }

    .device-modal-actions {
        flex-direction: column-reverse;
    }

    .device-cancel-btn,
    .device-save-btn {
        width: 100%;
    }
}

        @media (max-width: 640px) {
            .client-profile-head {
                flex-direction: column;
            }

            .client-profile-balance {
                text-align: left;
            }

            .client-info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body data-customer-id="{{ $customer->id }}">

<header>
    <div class="izquierda">
        <div class="brand">
            <img src="/img/ulicel-logo.jpeg" alt="Ulicel Logo" class="logo">
            <span class="name">Ulicel</span>
        </div>
    </div>

    <div class="derecha">
        <a href="#" class="icons-header" aria-label="Buscar">
            <img src="/img/menu principal/search.svg" alt="buscar">
        </a>

        <a href="#" class="icons-header" aria-label="Ayuda">
            <img src="/img/menu principal/question.svg" alt="ayuda">
        </a>

        <a href="#" class="icons-header" aria-label="Notificaciones">
            <img src="/img/menu principal/notification.svg" alt="notificaciones">
        </a>

        <div class="user-block">
            <img src="/img/ulicel-logo.jpeg" alt="img-user" class="user">
            <span class="role-badge">
                {{ ucfirst(auth()->user()->role) }}
            </span>
        </div>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="icons-header" aria-label="Cerrar sesión">
                Salir
            </button>
        </form>
    </div>
</header>

<main id="main" class="main-full">

    <div class="launcher-layout">

        <div class="launcher-main client-detail-page">

            <div class="launcher-head">
                <p class="launcher-eyebrow">Gestión CRM</p>
                <h1>Ficha del cliente</h1>
                <p>Información y actividad asociada al cliente.</p>
            </div>

            <a href="{{ route('clientes.index') }}" class="client-back">
                <svg viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Volver a clientes
            </a>

            <section class="client-profile">

                <div class="client-profile-head">

                    <div>
                        <h2 class="client-profile-title">
                            {{ trim($customer->first_name . ' ' . $customer->last_name) }}
                        </h2>

                        <span class="client-profile-dni">
                            DNI: {{ $customer->dni ?: 'Sin DNI' }}
                        </span>
                    </div>

                    <div class="client-profile-balance">
                        <span class="client-profile-balance-label">
                            Saldo pendiente
                        </span>

                        <span class="client-profile-balance-value {{ $customer->outstanding_balance > 0 ? 'pending' : '' }}">
                            ${{ number_format($customer->outstanding_balance, 2, ',', '.') }}
                        </span>
                    </div>

                </div>

                <div class="client-info-grid">

                    <div class="client-info-item">
                        <span class="client-info-label">Teléfono</span>
                        <span class="client-info-value">
                            {{ $customer->phone ?: 'Sin teléfono' }}
                        </span>
                    </div>

                    <div class="client-info-item">
                        <span class="client-info-label">Email</span>
                        <span class="client-info-value">
                            {{ $customer->email ?: 'Sin email' }}
                        </span>
                    </div>

                    <div class="client-info-item">
                        <span class="client-info-label">Dirección</span>
                        <span class="client-info-value">
                            {{ $customer->address ?: 'Sin dirección' }}
                        </span>
                    </div>

                    <div class="client-info-item">
                        <span class="client-info-label">Cliente desde</span>
                        <span class="client-info-value">
                            {{ $customer->created_at?->format('d/m/Y') ?: '—' }}
                        </span>
                    </div>

                </div>

            </section>

            <section class="client-section">

                <div class="client-section-head">
                    <h2>Dispositivos</h2>

                    <button type="button" id="add-device-btn" class="device-add-btn">
                    + Agregar dispositivo
                    </button>
                </div>

                <div id="devices-container">
                    <div class="client-empty-section">
                    Cargando dispositivos...
                    </div>
                </div>

            </section>

            <section class="client-section">

                <div class="client-section-head">
                    <h2>Órdenes de reparación</h2>
                </div>

                <div class="client-empty-section">
                    Este cliente todavía no tiene órdenes de reparación.
                </div>

            </section>

        </div>

    </div>
<div id="device-modal" class="device-modal hidden">

    <div class="device-modal-overlay" id="device-modal-overlay"></div>

    <div class="device-modal-content">

        <div class="device-modal-header">
            <div>
                <p class="device-modal-eyebrow">Cliente</p>
                <h2>Agregar dispositivo</h2>
            </div>

            <button
                type="button"
                id="device-modal-close"
                class="device-modal-close"
                aria-label="Cerrar"
            >
                ×
            </button>
        </div>

        <form id="device-form">

            <div class="device-form-grid">

                <div class="device-form-group">
                    <label for="device-type">Tipo</label>

                    <select id="device-type" name="type" required>
                        <option value="">Seleccionar tipo</option>
                        <option value="Celular">Celular</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Notebook">Notebook</option>
                        <option value="PC">PC</option>
                        <option value="Smartwatch">Smartwatch</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <div class="device-form-group">
                    <label for="device-brand">Marca</label>

                    <input
                        type="text"
                        id="device-brand"
                        name="brand"
                        maxlength="50"
                        required
                    >
                </div>

                <div class="device-form-group">
                    <label for="device-model">Modelo</label>

                    <input
                        type="text"
                        id="device-model"
                        name="model"
                        maxlength="80"
                        required
                    >
                </div>

                <div class="device-form-group">
                    <label for="device-imei">IMEI</label>

                    <input
                        type="text"
                        id="device-imei"
                        name="imei"
                        maxlength="30"
                        inputmode="numeric"
                        placeholder="Opcional"
                    >
                </div>

            </div>

            <div class="device-modal-actions">

                <button
                    type="button"
                    id="device-cancel-btn"
                    class="device-cancel-btn"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    id="device-save-btn"
                    class="device-save-btn"
                >
                    Guardar dispositivo
                </button>

            </div>

        </form>

    </div>

</div>
</main>

<script src="/js/cliente.js"></script>
</body>
</html>
