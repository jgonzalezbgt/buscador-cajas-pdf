// CONFIGURACIÓN - MODIFICA ESTE ENLACE
const CONFIG = {
    // REEMPLAZA ESTE ENLACE CON TU CARPETA DE ONEDRIVE
    carpetaOneDrive: 'https://tu-enlace-onedrive-aqui/',
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
        // Construir URL del PDF
        const pdfUrl = construirURL(numeroCaja);
        
        // Verificar si el PDF existe
        const existe = await verificarPDF(pdfUrl);
        
        if (existe) {
            mostrarResultado(`
                <p>✅ <strong>PDF encontrado:</strong> Caja ${numeroCaja}</p>
                <a href="${pdfUrl}" target="_blank" class="enlace-pdf">
                    📄 Abrir Reporte de Inspección
                </a>
                <p><small>El PDF se abrirá en una nueva pestaña</small></p>
            `, 'success');
        } else {
            mostrarResultado(`
                <p>❌ No se encontró el PDF para la caja: <strong>${numeroCaja}</strong></p>
                <p><small>Verifica que el número sea correcto</small></p>
            `, 'error');
        }
    } catch (error) {
        mostrarResultado(`
            <p>⚠️ Error en la búsqueda</p>
            <p><small>Intenta de nuevo más tarde</small></p>
        `, 'error');
        console.error('Error:', error);
    }
}

// Construir URL del PDF
function construirURL(numeroCaja) {
    // Limpiar número (remover espacios, caracteres especiales)
    const numeroLimpio = numeroCaja.replace(/[^a-zA-Z0-9]/g, '');
    return `${CONFIG.carpetaOneDrive}${numeroLimpio}${CONFIG.extension}`;
}

// Verificar si el PDF existe
async function verificarPDF(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('Error verificando PDF:', error);
        return false;
    }
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
