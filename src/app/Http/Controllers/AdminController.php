<?php

namespace App\Http\Controllers;

use App\Models\ShopSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AdminController extends Controller
{
    public function index(): View
    {
        abort_unless(auth()->user()->role === 'admin', 403);

        $settings = ShopSetting::current();
        $users = User::orderBy('name')->get();

        return view('admin', compact('settings', 'users'));
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:110'],
            'address' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
        ]);

        ShopSetting::current()->update($validated);

        return back()->with('status', 'Datos del taller guardados.');
    }

    public function storeUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:110'],
            'role' => ['required', 'in:admin,tecnico,mostrador'],
        ]);

        $base = Str::slug($validated['name'], '_');
        $username = $base;
        $i = 1;

        while (User::where('username', $username)->exists()) {
            $username = $base . '_' . $i++;
        }

        $tempPassword = 'Ulicel' . random_int(1000, 9999) . '!';

        $user = User::create([
            'name' => $validated['name'],
            'username' => $username,
            'email' => $username . '@ulicel.local',
            'role' => $validated['role'],
            'password' => Hash::make($tempPassword),
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'role' => $user->role,
            'temp_password' => $tempPassword,
        ], 201);
    }

    public function destroyUser(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'No podés eliminar tu propio usuario.'], 422);
        }

        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Tiene que quedar al menos un administrador.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado.']);
    }
}
