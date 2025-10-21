import { Target, Eye, Gem } from 'lucide-react';

export function ValuesSection() {
  return (
    <section className="values-section">
      <div className="values-container">
        <div className="values-header">
          <h2 className="values-title">
            Nuestros Pilares
          </h2>
          <p className="values-subtitle">
            Los valores que nos guían en cada paso de nuestro camino
          </p>
        </div>
        
        <div className="values-grid">
          <div className="values-card">
            <div className="values-card-icon">
              <Target size={56} />
            </div>
            <h3 className="values-card-title">Nuestra Misión</h3>
            <p className="values-card-text">
              Proveer a la comunidad de reposteros con insumos de calidad superior y un servicio confiable, fomentando la creatividad y el dulce éxito en cada cocina.
            </p>
          </div>
          
          <div className="values-card">
            <div className="values-card-icon">
              <Eye size={56} />
            </div>
            <h3 className="values-card-title">Nuestra Visión</h3>
            <p className="values-card-text">
              Ser el referente y aliado principal para todos los amantes de la repostería en el oriente del país, reconocidos por nuestra calidad, innovación y compromiso.
            </p>
          </div>
          
          <div className="values-card">
            <div className="values-card-icon">
              <Gem size={56} />
            </div>
            <h3 className="values-card-title">Nuestros Valores</h3>
            <p className="values-card-text">
              Calidad, Pasión, Confianza, Innovación y un profundo respeto por el arte de la repostería y nuestros clientes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}