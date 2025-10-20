// MAPA DE CAJAS - CON TUS ARCHIVOS REALES
const MAPA_CAJAS = {
    // FORMATO: 'NUMERO_CAJA': 'ID_DEL_ARCHIVO',
    
    '913245': 'https://bgttrucking-my.sharepoint.com/:b:/p/jgonzalez/EWTkRGBGjVVHs-DGja-DJXYBg7nxFrW8gw2Tm-MX7j-21g?e=DGbtI0',
    'G000983': 'https://bgttrucking-my.sharepoint.com/:b:/p/jgonzalez/ES6lOiAMT_tKjt-R2VCmcP0BYnFgluRpwbUNF0neYyu8Bg?e=RyPhvK'
};

function buscarPDF() {
    const numeroCaja = document.getElementById('numeroCaja').value.trim().toUpperCase();
    const resultadoDiv = document.getElementById('resultado');
    
    if (!numeroCaja) {
        mostrarResultado('Por favor ingresa un número de caja', 'error');
        return;
    }
    
    mostrarResultado('<p>🔍 Buscando PDF...</p>', 'loading');
    
    // Buscar en el mapa
    if (MAPA_CAJAS[numeroCaja]) {
        const fileId = MAPA_CAJAS[numeroCaja];
        const pdfUrl = `https://bgttrucking-my.sharepoint.com/:b:/p/jgonzalez/${fileId}?e=download`;
        
        mostrarResultado(`
            <p>✅ <strong>PDF encontrado:</strong> Caja ${numeroCaja}</p>
            <a href="${pdfUrl}" target="_blank" class="enlace-pdf">
                📄 Abrir Reporte de Inspección
            </a>
            <p><small>Se abrirá en nueva pestaña</small></p>
        `, 'success');
        
        // Abrir automáticamente
        setTimeout(() => {
            window.open(pdfUrl, '_blank');
        }, 500);
        
    } else {
        // Mostrar qué números están disponibles
        const numerosDisponibles = Object.keys(MAPA_CAJAS).join(', ');
        mostrarResultado(`
            <p>❌ No se encontró: <strong>${numeroCaja}</strong></p>
            <p><small>Números disponibles para prueba: ${numerosDisponibles}</small></p>
            <p><small>Tip: Prueba con "913245" o "G000983"</small></p>
        `, 'error');
    }
}

function mostrarResultado(mensaje, tipo) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = mensaje;
    resultadoDiv.className = tipo;
}

document.getElementById('numeroCaja').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarPDF();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('numeroCaja').focus();
    // Mostrar instrucciones iniciales
    mostrarResultado(`
        <p>💡 <strong>Instrucciones:</strong></p>
        <p>Ingresa el número de caja y presiona Buscar</p>
        <p><small>Números de prueba: 913245, G000983</small></p>
    `, 'success');
});
