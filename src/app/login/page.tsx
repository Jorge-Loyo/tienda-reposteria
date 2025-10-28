'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito y redirigir con window.location
        alert('¡Login exitoso! Serás redirigido a tu perfil.');
        window.location.href = '/perfil';
      } else {
        const data = await response.json();
        setError(data.error || 'Error de login');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 192, 203, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 228, 225, 0.2) 0%, transparent 50%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(255, 182, 193, 0.4)',
        animation: 'float 3s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255, 192, 203, 0.5)',
        animation: 'float 4s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 228, 225, 0.6)',
        animation: 'float 5s ease-in-out infinite'
      }}></div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {/* Logo */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px auto',
            position: 'relative',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(255, 154, 158, 0.3)'
          }}>
            <img
              src="https://res.cloudinary.com/dnc0btnuv/image/upload/v1760487147/CASADULCE_fwwhkm.png"
              alt="Logo Casa Dulce Oriente"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#d63384',
            margin: '0 0 8px 0'
          }}>Bienvenido</h1>
          <p style={{
            color: '#8e5572',
            fontSize: '16px',
            margin: '0'
          }}>Inicia sesión en Casa Dulce Oriente</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #e1e5e9',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff9a9e'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #e1e5e9',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff9a9e'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          
          {error && (
            <div style={{
              color: '#e74c3c',
              fontSize: '14px',
              textAlign: 'center',
              padding: '12px',
              backgroundColor: '#fdf2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #ff9a9e 0%, #f093fb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: isLoading ? 'none' : 'translateY(0)',
              boxShadow: isLoading ? 'none' : '0 4px 15px rgba(255, 154, 158, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 154, 158, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 154, 158, 0.4)';
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #ffffff30',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
        

      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}