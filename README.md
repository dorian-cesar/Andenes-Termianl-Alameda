# 🚌 Sistema de Gestión de Andenes

Aplicación web para la **gestión integral de andenes** en terminales de buses.  
Permite controlar la asignación de andenes, monitorear llegadas y salidas, gestionar conductores y buses, y visualizar el estado en tiempo real desde una interfaz moderna construida con **Next.js** y un backend en **Node.js**.

---

## 🚀 Tecnologías principales

### Frontend

- [Next.js 14+](https://nextjs.org/) — Framework React moderno con soporte para SSR y App Router
- [Tailwind CSS](https://tailwindcss.com/) — Estilos rápidos y consistentes
- [Shadcn/UI](https://ui.shadcn.com/) — Componentes accesibles y elegantes
- [Framer Motion](https://www.framer.com/motion/) — Animaciones suaves
- [Redux Toolkit](https://redux-toolkit.js.org/) — Gestión de estado global
- [Socket.IO Client](https://socket.io/) — Comunicación en tiempo real

### Backend

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — Servidor REST
- [Socket.IO](https://socket.io/) — Canal de comunicación en tiempo real
- [JWT](https://jwt.io/) — Autenticación segura
- [dotenv](https://www.npmjs.com/package/dotenv) — Configuración de entorno

---

## 🧩 Funcionalidades principales

- 🔐 **Autenticación y roles** (administrador y operador)
- 🚌 **Gestión de andenes**: asignación, liberación y seguimiento en tiempo real
- 📋 **Registro de llegadas y salidas**
- 📡 **Panel en tiempo real** con alertas y estados visuales
- 💬 **Notificaciones instantáneas** mediante WebSockets
