const API_URL = 'https://script.google.com/macros/s/AKfycbyrHeAVSqByHnaJ_YNHbMBil89RJrqT0mMquTAv3wOrOkGRwZOReMtecX_HvNmVAc3XpQ/exec';

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
        
        if (data.success && data.resultados && data.resultados.length > 0) {
            let html = `<p>✅ <strong>Encontrado${data.resultados.length > 1 ? 's' : ''}:</strong> ${data.resultados.length} PDF${data.resultados.length > 1 ? 's' : ''}</p>`;
            
            data.resultados.forEach((pdf) => {
                html += `
                    <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
                        <p style="margin: 0 0 10px 0; font-size: 16px;"><strong>📄 ${pdf.nombre}</strong></p>
                        <div>
                            <a href="${pdf.url}" target="_blank" class="enlace-pdf" style="margin-right: 10px;">
                                👁️ Ver PDF en Drive
                            </a>
                            <a href="${pdf.urlDescarga}" target="_blank" class="enlace-pdf">
                                ⬇️ Descargar PDF
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
            <p><small>Intenta más tarde o usa la búsqueda manual</small></p>
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
