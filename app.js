// CONFIGURACIÓN CON LA NUEVA URL
const API_URL = 'https://script.google.com/macros/s/AKfycbx0_C1Y1RZ0gYc9e7AO6kUAW-ebQreJGYEghZFKt_EYuH5QucjwZU8Y74109xvnakfDWw/exec';

async function buscarPDF() {
    const numeroCaja = document.getElementById('numeroCaja').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    if (!numeroCaja) {
        mostrarResultado('Por favor ingresa un número de caja', 'error');
        return;
    }
    
    mostrarResultado('<p>🔍 Buscando en la base de datos...</p>', 'loading');
    
    try {
        const response = await fetch(`${API_URL}?numero=${encodeURIComponent(numeroCaja)}`);
        const data = await response.json();
        
        console.log('Respuesta completa:', data); // Para debug
        
        if (data.success && data.resultados && data.resultados.length > 0) {
            let html = `<p>✅ <strong>Encontrado${data.resultados.length > 1 ? 's' : ''}:</strong> ${data.resultados.length} PDF${data.resultados.length > 1 ? 's' : ''}</p>`;
            
            data.resultados.forEach((pdf, index) => {
                // URLs corregidas
                const viewUrl = `https://drive.google.com/file/d/${pdf.id}/view`;
                const downloadUrl = `https://drive.google.com/uc?export=download&id=${pdf.id}`;
                
                html += `
                    <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
                        <p style="margin: 0 0 10px 0; font-size: 16px;">
                            <strong>📄 ${pdf.nombre}</strong>
                        </p>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <a href="${viewUrl}" target="_blank" 
                               class="enlace-pdf" 
                               style="background: #0078d4;">
                                👁️ Ver en Drive
                            </a>
                            <a href="${downloadUrl}" target="_blank" 
                               class="enlace-pdf" 
                               style="background: #28a745;"
                               download="${pdf.nombre}">
                                ⬇️ Descargar
                            </a>
                        </div>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                            ID: ${pdf.id}
                        </p>
                    </div>
                `;
            });
            
            mostrarResultado(html, 'success');
        } else {
            mostrarResultado(`
                <p>❌ No se encontró PDF para: <strong>${numeroCaja}</strong></p>
                <p><small>Verifica el número e intenta nuevamente</small></p>
                ${data.error ? `<p><small>Error: ${data.error}</small></p>` : ''}
            `, 'error');
        }
    } catch (error) {
        console.error('Error completo:', error);
        mostrarResultado(`
            <p>⚠️ Error de conexión</p>
            <p><small>Detalles: ${error.message}</small></p>
            <p><a href="https://drive.google.com/drive/folders/1-KO7zNjuAzLNJ2LurmTQ-rcVX_hwappS" 
                  target="_blank" 
                  style="color: #0078d4;">
                📁 Abrir carpeta manualmente
            </a></p>
        `, 'error');
    }
}

function mostrarResultado(mensaje, tipo) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = mensaje;
    resultadoDiv.className = tipo;
}

// Buscar al presionar Enter
document.getElementById('numeroCaja').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarPDF();
    }
});

// Enfocar automáticamente
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('numeroCaja').focus();
    
    // Instrucciones iniciales
    mostrarResultado(`
        <p>🔍 <strong>Buscador de Inspecciones</strong></p>
        <p>Ingresa el número de caja y presiona Buscar</p>
        <p><small>Ejemplos: 913245, G000983, etc.</small></p>
    `, 'success');
});
