import Image from 'next/image';
import './login.css';

export default function LoginPage() {

  return (
    <div className="login-container">
      <div className="login-bg">
        <div className="login-bg-circle-1"></div>
        <div className="login-bg-circle-2"></div>
        <div className="login-bg-circle-3"></div>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Image
                src="https://res.cloudinary.com/dnc0btnuv/image/upload/v1753391048/Logo_kewmlf.png"
                alt="Casa Dulce Oriente"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <h1 className="login-title">
              Iniciar Sesión
            </h1>
            <p className="login-subtitle">Accede a tu cuenta</p>
          </div>

          <form action="/api/auth/login" method="POST" className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Correo Electrónico
              </label>
              <div className="login-input-container">
                <div className="login-input-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Contraseña
              </label>
              <div className="login-input-container">
                <div className="login-input-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="login-input password"
                />
              </div>
            </div>

            <button type="submit" className="login-submit">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
