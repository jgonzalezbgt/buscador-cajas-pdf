// Configuración - SOLO UN ENLACE
const API_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';

async function buscarPDF() {
    const numeroCaja = document.getElementById('numeroCaja').value.trim().toUpperCase();
    const resultadoDiv = document.getElementById('resultado');
    
    if (!numeroCaja) {
        mostrarResultado('Por favor ingresa un número de caja', 'error');
        return;
    }
    
    mostrarResultado('<p>🔍 Buscando en la base de datos...</p>', 'loading');
    
    try {
        const response = await fetch(`${API_URL}?numero=${encodeURIComponent(numeroCaja)}`);
        const data = await response.json();
        
        if (data.encontrado) {
            mostrarResultado(`
                <p>✅ <strong>PDF encontrado:</strong> ${data.nombre}</p>
                <a href="${data.urlDirecta}" target="_blank" class="enlace-pdf">
                    📄 Descargar Reporte de Inspección
                </a>
                <p><small>También puedes <a href="${data.url}" target="_blank">ver en Google Drive</a></small></p>
            `, 'success');
        } else {
            mostrarResultado(`
                <p>❌ No se encontró: <strong>${numeroCaja}</strong></p>
                <p><small>Verifica el número e intenta nuevamente</small></p>
            `, 'error');
        }
    } catch (error) {
        mostrarResultado(`
            <p>⚠️ Error de conexión</p>
            <p><small>Intenta más tarde</small></p>
        `, 'error');
    }
}

function mostrarResultado(mensaje, tipo) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = mensaje;
    resultadoDiv.className = tipo;
}

document.getElementById('numeroCaja').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') buscarPDF();
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('numeroCaja').focus();
});
