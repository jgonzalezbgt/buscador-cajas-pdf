// Configuración - ACTUALIZA CON TU URL DE APPS SCRIPT
const API_URL = 'https://script.google.com/macros/s/ABCDEFG123456/exec';

async function buscarPDF() {
    const numeroCaja = document.getElementById('numeroCaja').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    if (!numeroCaja) {
        mostrarResultado('Por favor ingresa un número de caja', 'error');
        return;
    }
    
    mostrarResultado('<p>🔍 Buscando en archivos...</p>', 'loading');
    
    try {
        const response = await fetch(`${API_URL}?numero=${encodeURIComponent(numeroCaja)}`);
        const data = await response.json();
        
        if (data.success && data.resultados.length > 0) {
            let html = `<p>✅ <strong>Encontrado${data.total > 1 ? 's' : ''}:</strong> ${data.total} resultado${data.total > 1 ? 's' : ''}</p>`;
            
            data.resultados.forEach((pdf, index) => {
                html += `
                    <div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                        <p><strong>📄 ${pdf.nombre}</strong></p>
                        <a href="${pdf.urlDirecta}" target="_blank" class="enlace-pdf" style="margin: 5px;">
                            👁️ Ver PDF
                        </a>
                        <a href="${pdf.urlDescarga}" target="_blank" class="enlace-pdf" style="margin: 5px;">
                            ⬇️ Descargar
                        </a>
                    </div>
                `;
            });
            
            mostrarResultado(html, 'success');
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
        console.error('Error:', error);
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
