import { Truck, Clock, ShieldCheck } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function FeatureCard({ icon, title, children }: FeatureCardProps) {
  return (
    <div className="feature-card group">
      <div className="feature-card-bg"></div>
      <div className="feature-card-content">
        <div className="feature-card-icon">
          {icon}
        </div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-text">{children}</p>
      </div>
    </div>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="why-section">
      <div className="why-container">
        <div className="why-header">
          <h2 className="why-title gradient-text">
            ¿Por qué elegirnos?
          </h2>
          <p className="why-subtitle">
            Más que una tienda, somos tu aliado en cada creación dulce
          </p>
        </div>
        
        <div className="why-grid">
          <FeatureCard icon={<Truck size={56} />} title="Delivery Rápido">
            Recibe tus insumos directamente en tu puerta. Olvídate de las largas esperas y concéntrate en crear obras maestras.
          </FeatureCard>
          <FeatureCard icon={<Clock size={56} />} title="Atención 24 Horas">
            Nuestra tienda online nunca cierra. Haz tu pedido en cualquier momento del día, cuando la inspiración te llegue.
          </FeatureCard>
          <FeatureCard icon={<ShieldCheck size={56} />} title="Calidad Garantizada">
            Seleccionamos solo los mejores productos del mercado para asegurar que tus postres sean siempre un éxito rotundo.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}