// CONFIGURACIÓN PARA ONEDRIVE EMPRESARIAL
const CONFIG = {
    // Base URL - MODIFICA ESTA PARTE CON TU ENLACE
    baseUrl: 'https://bgttrucking-my.sharepoint.com/personal/jgonzalez_bgttrucking_com/_layouts/15/onedrive.aspx',
    folderId: 'EtOpw2Ic4fhEjR5WnNUV_GcBncfisewf_TqwyvmIrOpKNw',
    extension: '.pdf'
};

// Función principal de búsqueda
async function buscarPDF() {
    const numeroCaja = document.getElementById('numeroCaja').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    // Validar entrada
    if (!numeroCaja) {
        mostrarResultado('Por favor ingresa un número de caja', 'error');
        return;
    }
    
    // Limpiar y mostrar carga
    mostrarResultado('<p>🔍 Buscando PDF...</p>', 'loading');
    
    try {
        // Para OneDrive empresarial, abrimos directamente el enlace
        // Esto funcionará si el usuario ya está loggeado en Office 365
        const pdfUrl = construirURLOneDrive(numeroCaja);
        
        // En OneDrive empresarial no podemos verificar fácilmente, 
        // así que directamente intentamos abrir
        mostrarResultado(`
            <p>📦 <strong>Buscando:</strong> Caja ${numeroCaja}</p>
            <a href="${pdfUrl}" target="_blank" class="enlace-pdf" onclick="marcarComoEncontrado('${numeroCaja}')">
                📄 Intentar abrir PDF
            </a>
            <p><small>Se abrirá en nueva pestaña. Si no existe, verifica el número.</small></p>
        `, 'success');
        
    } catch (error) {
        mostrarResultado(`
            <p>⚠️ Error en la búsqueda</p>
            <p><small>Intenta de nuevo más tarde</small></p>
        `, 'error');
        console.error('Error:', error);
    }
}

// Construir URL para OneDrive Empresarial
function construirURLOneDrive(numeroCaja) {
    const numeroLimpio = numeroCaja.replace(/[^a-zA-Z0-9]/g, '');
    
    // URL directa al archivo (asumiendo que existe)
    return `https://bgttrucking-my.sharepoint.com/personal/jgonzalez_bgttrucking_com/_layouts/15/Doc.aspx?sourcedoc=%7B${CONFIG.folderId}%7D&file=${numeroLimpio}${CONFIG.extension}&action=default&mobileredirect=true`;
}

function marcarComoEncontrado(numeroCaja) {
    mostrarResultado(`
        <p>✅ <strong>PDF abierto:</strong> Caja ${numeroCaja}</p>
        <p><small>Si no se encontró el archivo, verifica el número de caja</small></p>
    `, 'success');
}

// Mostrar resultados
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

// Enfocar el input automáticamente
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('numeroCaja').focus();
});
