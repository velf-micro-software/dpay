# DPay Project Setup Guide / Guía de Configuración del Proyecto DPay

## English 🇬🇧

### Project Setup Instructions

This guide will walk you through the process of setting up the DPay project with Firebase and Google Cloud Platform.

#### Prerequisites
- Google Account
- Google Cloud SDK (GSuite)
- Firebase CLI (optional)

#### Step-by-Step Setup

1. **Create Google Account**
   - If you don't have one, create a new Google account at [accounts.google.com](https://accounts.google.com)

2. **Register with Firebase Platform**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Sign in with your Google account
   - Click "Add project"

3. **Create New Project (dpay)**
   - Enter project name: "dpay"
   - Follow the setup wizard instructions
   - Enable Google Analytics (optional)

4. **Configure Storage**
   - In Firebase Console, navigate to Storage
   - Click "Get Started"
   - Choose a location for your data
   - Accept the security rules

5. **Install Google Cloud SDK (GSuite)**
   - Download from [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
   - Follow installation instructions for your OS

6. **Authenticate with Google Cloud**
   ```bash
   gcloud auth login
   ```
   - Use your Google account credentials
   - Follow the authentication process

7. **Select Project**
   ```bash
   gcloud projects list
   gcloud config set project dpay
   ```

8. **Configure CORS**
   Create a `cors.json` file with the following content:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   Then run:
   ```bash
   gsutil cors set cors.json gs://dpay.appspot.com
   ```

### Testing the API
- Use the Firebase Console to test your storage configuration
- Implement API calls in your code using Firebase SDK

---

## Español 🇪🇸

### Instrucciones de Configuración del Proyecto

Esta guía te ayudará a configurar el proyecto DPay con Firebase y Google Cloud Platform.

#### Requisitos Previos
- Cuenta de Google
- Google Cloud SDK (GSuite)
- Firebase CLI (opcional)

#### Configuración Paso a Paso

1. **Crear Cuenta Google**
   - Si no tienes una, crea una nueva cuenta en [accounts.google.com](https://accounts.google.com)

2. **Registrarse en Firebase Platform**
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Inicia sesión con tu cuenta de Google
   - Haz clic en "Añadir proyecto"

3. **Crear Nuevo Proyecto (dpay)**
   - Ingresa el nombre del proyecto: "dpay"
   - Sigue las instrucciones del asistente de configuración
   - Activa Google Analytics (opcional)

4. **Configurar Almacenamiento**
   - En Firebase Console, navega a Storage
   - Haz clic en "Comenzar"
   - Elige una ubicación para tus datos
   - Acepta las reglas de seguridad

5. **Instalar Google Cloud SDK (GSuite)**
   - Descarga desde [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
   - Sigue las instrucciones de instalación para tu SO

6. **Autenticarse con Google Cloud**
   ```bash
   gcloud auth login
   ```
   - Usa tus credenciales de Google
   - Sigue el proceso de autenticación

7. **Seleccionar Proyecto**
   ```bash
   gcloud projects list
   gcloud config set project dpay
   ```

8. **Configurar CORS**
   Crea un archivo `cors.json` con el siguiente contenido:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   Luego ejecuta:
   ```bash
   gsutil cors set cors.json gs://dpay.appspot.com
   ```

### Probar la API
- Usa Firebase Console para probar tu configuración de almacenamiento
- Implementa llamadas a la API en tu código usando Firebase SDK

---

## Support / Soporte

For any issues or questions, please contact the development team.
Para cualquier problema o pregunta, por favor contacta al equipo de desarrollo. 