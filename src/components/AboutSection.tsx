import Image from 'next/image';

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-number">{number}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

interface AboutSectionProps {
  aboutSectionImage: string;
  stats: {
    products: number;
    customers: number;
    rating: number;
  };
}

export function AboutSection({ aboutSectionImage, stats }: AboutSectionProps) {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-grid">
          <div className="about-image-container">
            <div className="about-image-glow"></div>
            <div className="about-image-wrapper">
              <div className="about-image-inner">
                <Image 
                  src={aboutSectionImage}
                  alt="Interior de la pastelería Casa Dulce"
                  fill
                  className="about-image object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="about-content">
            <div className="about-title-section">
              <h2 className="gradient-text">
                CASA DULCE ORIENTE
              </h2>
              <div className="about-title-divider"></div>
            </div>
            
            <div className="about-text">
              <p>
                Nacimos de la <span className="highlight-pink">pasión por la repostería</span> y el deseo de facilitar a todos, desde aficionados hasta profesionales, el acceso a insumos de la más alta calidad.
              </p>
              <p>
                En Casa Dulce Oriente, creemos que cada postre es una <span className="highlight-orange">obra de arte</span> y que los ingredientes correctos son el pincel del artista.
              </p>
              <p>
                Nuestro compromiso es ofrecer una selección curada de productos, un servicio al cliente excepcional y la inspiración que necesitas para llevar tus creaciones al siguiente nivel.
              </p>
            </div>
            
            <div className="about-stats">
              <StatCard number={`${stats.products}+`} label="Productos" />
              <StatCard number={`${stats.customers}+`} label="Clientes" />
              <StatCard number={`${stats.rating}★`} label="Calificación" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}