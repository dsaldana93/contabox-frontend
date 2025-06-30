# Instrucciones de Debugging - Frontend Contabox

## Problema Reportado
El frontend se queda en el spinner cuando se ingresa el ObjectId `685d96a89c8534c5fab6dc0f` y no avanza a la siguiente página.

## Estado Actual
✅ **Backend funcionando**: El backend está ejecutándose correctamente en puerto 8080
✅ **Endpoint funcionando**: El endpoint `/api/calculation/by-id/685d96a89c8534c5fab6dc0f?rfc=SOBA901008FM4` devuelve datos correctos
✅ **CORS configurado**: Se agregó middleware CORS al backend
✅ **Timeout configurado**: Se agregó timeout de 15 segundos al cliente axios
✅ **Logging agregado**: Se agregó logging detallado para diagnosticar

## Pasos para Diagnosticar

### 1. Verificar que el Backend esté Ejecutándose
```bash
cd contabox_v1
python check_backend.py
```

### 2. Iniciar el Backend (si no está ejecutándose)
```bash
cd contabox_v1
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

### 3. Verificar el Frontend
1. Abrir el navegador en `http://localhost:5173`
2. Abrir las herramientas de desarrollador (F12)
3. Ir a la pestaña "Console"
4. Navegar a Reportes → PARÁMETROS
5. Marcar "Buscar por ObjectId"
6. Ingresar:
   - RFC: `SOBA901008FM4`
   - ObjectId: `685d96a89c8534c5fab6dc0f`
7. Hacer clic en "CONSULTAR"

### 4. Revisar los Logs en la Consola
Deberías ver logs similares a:
```
Iniciando petición con parámetros: {useObjectId: true, objectId: "685d96a89c8534c5fab6dc0f", rfc: "SOBA901008FM4"}
Llamando getCalculationById con: 685d96a89c8534c5fab6dc0f SOBA901008FM4
API Service - URL: /api/calculation/by-id/685d96a89c8534c5fab6dc0f
API Service - Params: {rfc: "SOBA901008FM4"}
API Service - Base URL: http://localhost:8080
API Service - Response status: 200
API Service - Response data: {success: true, data: {...}}
API Response recibida: {success: true, data: {...}}
```

### 5. Posibles Problemas y Soluciones

#### Si ves errores de CORS:
- Verificar que el backend tenga el middleware CORS configurado
- Reiniciar el backend

#### Si ves errores de timeout:
- Verificar que el backend responda rápidamente
- Aumentar el timeout en `apiService.js`

#### Si ves errores de red:
- Verificar que el backend esté en puerto 8080
- Verificar la configuración en `config/api.js`

#### Si no ves logs:
- Verificar que el JavaScript se esté ejecutando
- Revisar errores en la consola

### 6. Datos Esperados
El endpoint debería devolver:
```json
{
  "success": true,
  "data": {
    "rfc": "SOBA901008FM4",
    "objectId": "685d96a89c8534c5fab6dc0f",
    "calculations": {
      "servicioHospedaje": {
        "ingresosTotales": 9483.71,
        "isrCausado": 199.16,
        "retencionesPlataforma": 0.0
      },
      "servicioTerrestre": {
        "ingresosTotales": 0.0,
        "isrCausado": 0.0,
        "retencionesPlataforma": 0.0
      }
    },
    "found": true
  }
}
```

## Archivos Modificados
- `contabox_v1/main.py` - Agregado CORS
- `contabox_v1/routers/contabox.py` - Nuevo endpoint y conversión de datos
- `contabox-frontend/src/services/apiService.js` - Timeout y logging
- `contabox-frontend/src/components/Reports.jsx` - Nuevos campos y logging
- `contabox-frontend/src/components/Reports.css` - Estilos para nuevos campos

## Contacto
Si el problema persiste después de seguir estos pasos, proporciona:
1. Los logs de la consola del navegador
2. Los logs del backend
3. Capturas de pantalla del problema