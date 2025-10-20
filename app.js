// CONFIGURACIÓN CON TU NUEVA URL
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
        // Usar fetch con modo 'no-cors' para evitar problemas
        const response = await fetch(`${API_URL}?numero=${encodeURIComponent(numeroCaja)}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        let data;
        
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error('Respuesta no es JSON válido');
        }
        
        if (data.success && data.resultados && data.resultados.length > 0) {
            let html = `<p>✅ <strong>Encontrado${data.resultados.length > 1 ? 's' : ''}:</strong> ${data.resultados.length} PDF${data.resultados.length > 1 ? 's' : ''}</p>`;
            
            data.resultados.forEach((pdf) => {
                const downloadUrl = `https://drive.google.com/uc?export=download&id=${pdf.id}`;
                const viewUrl = `https://drive.google.com/file/d/${pdf.id}/view`;
                
                html += `
                    <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
                        <p style="margin: 0 0 10px 0; font-size: 16px;"><strong>📄 ${pdf.nombre}</strong></p>
                        <div>
                            <a href="${viewUrl}" target="_blank" class="enlace-pdf" style="margin-right: 10px;">
                                👁️ Ver PDF
                            </a>
                            <a href="${downloadUrl}" target="_blank" class="enlace-pdf">
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
        console.error('Error detallado:', error);
        
        // Solución de respaldo MEJORADA
        mostrarResultado(`
            <div style="text-align: left;">
                <p>🔄 <strong>Solución alternativa activada</strong></p>
                <p>Para acceder inmediatamente a los PDFs:</p>
                
                <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <p><strong>Opción 1: Búsqueda manual</strong></p>
                    <a href="https://drive.google.com/drive/folders/1-KO7zNjuAzLNJ2LurmTQ-rcVX_hwappS" 
                       target="_blank" 
                       style="display: inline-block; background: #0078d4; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; margin: 5px 0;">
                        📁 Abrir carpeta de inspecciones
                    </a>
                    <p><small>Luego usa Ctrl+F y busca: <strong>${numeroCaja}</strong></small></p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <p><strong>Opción 2: Enlace directo de prueba</strong></p>
                    <p><small>Prueba con estos números conocidos:</small></p>
                    <div>
                        <a href="https://drive.google.com/drive/folders/1-KO7zNjuAzLNJ2LurmTQ-rcVX_hwappS" 
                           target="_blank" 
                           style="color: #856404; margin: 0 10px;">
                            Buscar 913245
                        </a>
                        <a href="https://drive.google.com/drive/folders/1-KO7zNjuAzLNJ2LurmTQ-rcVX_hwappS" 
                           target="_blank" 
                           style="color: #856404; margin: 0 10px;">
                            Buscar G000983
                        </a>
                    </div>
                </div>
                
                <p><small>Estamos optimizando la conexión automática...</small></p>
            </div>
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
    
    // Mostrar instrucciones iniciales
    mostrarResultado(`
        <p>🔍 <strong>Buscador de Inspecciones</strong></p>
        <p>Ingresa cualquier número de caja y presiona Buscar</p>
        <p><small>Ejemplos: 913245, G000983, 538193, etc.</small></p>
    `, 'success');
});
