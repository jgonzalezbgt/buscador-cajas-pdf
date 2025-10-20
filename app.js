// CONFIGURACIÓN - REEMPLAZA CON TU URL DE GOOGLE APPS SCRIPT
const API_URL = 'https://script.google.com/macros/s/AKfycbw5p9umEl1JGvULe6iraEXd7FtYZ0lbajIF8uiPySxjin8rKA8elKsQJSyhQtAh4hF7Dg/exec';

async function buscarPDF() {
    const numeroCaja = document.getElementById('numeroCaja').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    if (!numeroCaja) {
        mostrarResultado('Por favor ingresa un número de caja', 'error');
        return;
    }
    
    mostrarResultado('<p>🔍 Buscando en la base de datos...</p>', 'loading');
    
    try {
        // Llamar a tu Google Apps Script
        const response = await fetch(`${API_URL}?numero=${encodeURIComponent(numeroCaja)}`);
        const data = await response.json();
        
        if (data.success && data.resultados && data.resultados.length > 0) {
            let html = `<p>✅ <strong>Encontrado${data.resultados.length > 1 ? 's' : ''}:</strong> ${data.resultados.length} PDF${data.resultados.length > 1 ? 's' : ''}</p>`;
            
            data.resultados.forEach((pdf, index) => {
                html += `
                    <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
                        <p style="margin: 0 0 10px 0;"><strong>📄 ${pdf.nombre}</strong></p>
                        <div>
                            <a href="${pdf.urlDirecta || pdf.url}" target="_blank" class="enlace-pdf" style="margin-right: 10px;">
                                👁️ Ver PDF
                            </a>
                            <a href="${pdf.urlDescarga || pdf.url}" target="_blank" class="enlace-pdf" download>
                                ⬇️ Descargar
                            </a>
                        </div>
                    </div>
                `;
            });
            
            mostrarResultado(html, 'success');
        } else {
            mostrarResultado(`
                <p>❌ No se encontró PDF para: <strong>${numeroCaja}</strong></p>
                <p><small>Verifica el número e intenta nuevamente</small></p>
            `, 'error');
        }
    } catch (error) {
        mostrarResultado(`
            <p>⚠️ Error de conexión</p>
            <p><small>Puede ser por verificación de Google. Intenta:</small></p>
            <p><small>1. <a href="https://drive.google.com/drive/folders/1-KO7zNjuAzLNJ2LurmTQ-rcVX_hwappS" target="_blank">Abrir carpeta manualmente</a></small></p>
            <p><small>2. Usar Ctrl+F para buscar: <strong>${numeroCaja}</strong></small></p>
        `, 'error');
        console.error('Error:', error);
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
});
