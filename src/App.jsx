import Commitments from './components/Commitments'
import ConsultForm from './components/ConsultForm'
import Estimator from './components/Estimator'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Services from './components/Services'
import CtaBand from './components/CtaBand'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services />
        <Journey />
        <Estimator />
        <Commitments />
        <CtaBand />
        <Faq />
        <ConsultForm />
      </main>
      <Footer />
    </>
  )
}
