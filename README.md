# Contabox Frontend

Una aplicación React con Vite que clona la interfaz de usuario de Contabox, una plataforma de cálculos fiscales y contables.

## Características

- ✅ **Autenticación**: Sistema de login que replica el diseño original
- ✅ **Dashboard**: Interfaz principal con navegación lateral
- ✅ **Reportes**: Sección de reportes con cálculos fiscales detallados
- ✅ **Cálculos**: Tablas de cálculos para Servicio Hospedaje y Servicio Terrestre
- ✅ **Responsive**: Diseño adaptable para dispositivos móviles
- ✅ **Conexión Backend**: Configurado para conectar con la API FastAPI existente

## Tecnologías Utilizadas

- **React 18**: Biblioteca de interfaz de usuario
- **Vite**: Herramienta de construcción rápida
- **Axios**: Cliente HTTP para API calls
- **Lucide React**: Iconos modernos
- **CSS3**: Estilos personalizados que replican el diseño original

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio** (si aplica):
   ```bash
   git clone <repository-url>
   cd contabox-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   El archivo `.env` ya está configurado con:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   VITE_MONGODB_URL=mongodb+srv://contabox01:2zdYLmLcUbwT2D7y@cluster0.b31ox.mongodb.net?retryWrites=true&w=majority&tlsCAFile=isrgrootx1.pem
   ```

4. **Ejecutar la aplicación**:
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**:
   La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
contabox-frontend/
├── src/
│   ├── components/           # Componentes React
│   │   ├── Login.jsx        # Pantalla de inicio de sesión
│   │   ├── Dashboard.jsx    # Dashboard principal
│   │   ├── DashboardHome.jsx # Página de bienvenida
│   │   ├── Reports.jsx      # Sección de reportes y cálculos
│   │   ├── LoadingSpinner.jsx # Componente de carga
│   │   ├── Clients.jsx      # Sección de clientes
│   │   └── PaymentValidation.jsx # Validación de pagos
│   ├── services/            # Servicios de API
│   │   └── apiService.js    # Configuración de Axios y endpoints
│   ├── config/              # Configuración
│   │   └── api.js          # Configuración de la API
│   ├── App.jsx             # Componente principal
│   ├── App.css             # Estilos globales
│   ├── index.css           # Estilos base
│   └── main.jsx            # Punto de entrada
├── .env                    # Variables de entorno
├── package.json            # Dependencias y scripts
└── README.md              # Documentación
```

## Conexión con el Backend

La aplicación está configurada para conectarse con el backend FastAPI existente en `http://localhost:8000`.

### Endpoints Utilizados

- `POST /auth/login` - Autenticación de usuarios
- `GET /contabox/reports` - Obtener reportes
- `GET /contabox/calculations` - Obtener cálculos fiscales
- `GET /contabox/clients` - Obtener lista de clientes

### Credenciales de Prueba

Para probar la aplicación, puedes usar las credenciales proporcionadas:
- **Email**: julio.vera@contabilizate.com
- **Contraseña**: 12345678

## Funcionalidades Implementadas

### 1. Sistema de Autenticación
- Pantalla de login que replica exactamente el diseño original
- Validación de formularios
- Manejo de estados de carga y errores
- Persistencia de sesión en localStorage

### 2. Dashboard Principal
- Navegación lateral con iconos
- Diseño responsive
- Múltiples secciones: Dashboard, Clientes, Validación de pagos, Reportes

### 3. Sección de Reportes
- Lista de reportes disponibles
- Modal de parámetros (mes y año)
- Visualización de cálculos fiscales en tablas
- Datos para Servicio Hospedaje y Servicio Terrestre

### 4. Cálculos Fiscales
- Tablas detalladas con columnas específicas:
  - Ingresos obtenidos mediante intermediarios
  - Ingresos obtenidos directamente del usuario
  - Tasas porcentuales
  - ISR causado
  - Retenciones por plataformas tecnológicas

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## Próximas Mejoras

- [ ] Implementar sección de Clientes completa
- [ ] Desarrollar funcionalidad de Validación de pagos
- [ ] Agregar más tipos de reportes
- [ ] Implementar exportación a Excel
- [ ] Agregar tests unitarios
- [ ] Mejorar manejo de errores
- [ ] Implementar notificaciones toast

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y está destinado únicamente para uso interno.
