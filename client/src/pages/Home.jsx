import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Users, Star, Search, Zap } from 'lucide-react';
import './Home.css';
import Footer from '../components/Footer';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const getStartedPath = user ? '/dashboard' : '/login';

  const heroImg = 'https://images.unsplash.com/photo-1765277789236-18b14cb7869f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="home-page bg-white">

      <section className="hero-section position-relative d-flex align-items-center overflow-hidden" style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('${heroImg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        minHeight: '75vh', 
        borderBottomRightRadius: '100px',
      }}>
        {/* Декоративний елемент фону */}
        <div className="position-absolute opacity-10" style={{top: '-100px', right: '-100px', color: '#3b82f6'}}>
            <Zap size={500} strokeWidth={1} />
        </div>

        <div className="container position-relative text-white" style={{ zIndex: 2 }}>
          <div className="row align-items-center py-5">
            <div className="col-lg-9 col-xl-8 mx-auto text-center">
              
              <h1 className="display-3 fw-extrabold mb-4 line-height-tight tracking-tight">
                Smart<span className="text-primary">Repair</span> <Zap className="text-primary d-none d-sm-inline" size={40} style={{marginTop: '-10px'}} /> <br />
                Ваш надійний сервіс
              </h1>
              
              <p className="lead fw-normal text-light mb-5 fs-4 mx-auto" style={{ opacity: 0.95, maxWidth: '700px' }}>
                Швидко знаходьте перевірених майстрів або заробляйте на власних послугах. 
                Наша технологія <strong className="text-white border-bottom border-primary border-2">Smart IoT</strong> автоматично захистить ваш дім.
              </p>
              
              <div className="d-flex justify-content-center gap-3 flex-column flex-sm-row mt-2">
                <Link to={getStartedPath} className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg border-0 d-flex justify-content-center align-items-center fw-bold transition-all hover-down">
                  {user ? 'Мій кабінет' : 'Розпочати роботу'} <ArrowRight size={20} className="ms-2" />
                </Link>
                <Link to="/services" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill d-flex justify-content-center align-items-center transition-all hover-scale bg-white bg-opacity-10">
                  <Search size={20} className="me-2" /> Знайти майстра
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="py-5 my-5">
        <div className="container">
          
          <div className="row mb-5 justify-content-center text-center">
            <div className="col-md-8">
                <span className="text-primary fw-bold text-uppercase tracking-widest bg-primary-subtle px-3 py-1 rounded-pill sm">Як це працює</span>
                <h2 className="display-5 fw-bold mt-3 mb-4 text-dark">Оберіть свій шлях у SmartRepair</h2>
                <p className="lead text-muted">Ми поєднали зручний сервіс замовлення послуг з новітніми технологіями безпеки для вашого житла.</p>
            </div>
          </div>

          <div className="row g-4 justify-content-center align-items-stretch">
            
            {/* Картка Клієнта */}
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="card h-100 border-0 shadow-sm p-4 pt-5 rounded-4 bg-white hover-card-modern context-card-blue">
                <div className="icon-box mb-4 bg-primary text-white d-inline-flex p-3 rounded-4 align-items-center justify-content-center shadow" style={{ width: '64px', height: '64px' }}>
                  <Users size={32} />
                </div>
                <h3 className="h4 fw-bold mb-3 text-dark">Я — Клієнт</h3>
                <p className="text-secondary flex-grow-1 mb-4">
                  Зламався кран? Зникло світло? У нас ви знайдете майстрів з реальними відгуками, прозорими цінами та гарантією.
                </p>
                <ul className="list-unstyled mt-auto mb-0 pt-3 border-top border-light">
                  <li className="mb-2 d-flex align-items-center text-dark"><CheckCircle2 size={18} className="text-primary me-2 flex-shrink-0" /> <span>Зручне онлайн бронювання</span></li>
                  <li className="d-flex align-items-center text-dark"><CheckCircle2 size={18} className="text-primary me-2 flex-shrink-0" /> <span>Перевірені відгуки та рейтинги</span></li>
                </ul>
              </div>
            </div>

            {/* Картка Майстра */}
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="card h-100 border-0 shadow-sm p-4 pt-5 rounded-4 bg-white hover-card-modern context-card-green">
                <div className="icon-box mb-4 bg-success text-white d-inline-flex p-3 rounded-4 align-items-center justify-content-center shadow" style={{ width: '64px', height: '64px' }}>
                  <Wrench size={32} />
                </div>
                <h3 className="h4 fw-bold mb-3 text-dark">Я — Майстер</h3>
                <p className="text-secondary flex-grow-1 mb-4">
                  Реєструйте профіль, додавайте послуги, керуйте графіком та отримуйте стабільний потік нових замовлень.
                </p>
                <ul className="list-unstyled mt-auto mb-0 pt-3 border-top border-light">
                  <li className="mb-2 d-flex align-items-center text-dark"><CheckCircle2 size={18} className="text-success me-2 flex-shrink-0" /> <span>Прозора виплата коштів</span></li>
                  <li className="d-flex align-items-center text-dark"><CheckCircle2 size={18} className="text-success me-2 flex-shrink-0" /> <span>Зручний календар замовлень</span></li>
                </ul>
              </div>
            </div>

            {/* Картка IoT */}
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="card h-100 border-0 shadow-lg p-4 pt-5 rounded-4 text-white hover-card-modern context-card-dark position-relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="position-absolute top-0 end-0 m-3">
                  <span className="badge bg-primary text-uppercase px-3 py-1 rounded-pill" style={{ fontSize: '10px', letterSpacing: '1px', fontWeight: '700' }}>Ексклюзив</span>
                </div>
                <div className="icon-box mb-4 bg-white bg-opacity-10 text-primary d-inline-flex p-3 rounded-4 align-items-center justify-content-center border border-white border-opacity-10 shadow" style={{ width: '64px', height: '64px', backdropFilter: 'blur(5px)' }}>
                  <Cpu size={32} />
                </div>
                <h3 className="h4 fw-bold mb-3 text-white">Smart IoT Модуль</h3>
                <p className="text-light flex-grow-1 mb-4" style={{ opacity: 0.85 }}>
                  Проактивний захист. Наші датчики (вода, дим, температура) цілодобово моніторять ваш дім та запобігають аваріям.
                </p>
                <ul className="list-unstyled mt-auto mb-0 pt-3 border-top border-secondary">
                  <li className="mb-2 d-flex align-items-center"><ShieldCheck size={18} className="text-primary me-2 flex-shrink-0" /> <span>Автоматичне створення заявки</span></li>
                  <li className="d-flex align-items-center"><ShieldCheck size={18} className="text-primary me-2 flex-shrink-0" /> <span>Миттєве сповіщення майстра</span></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}