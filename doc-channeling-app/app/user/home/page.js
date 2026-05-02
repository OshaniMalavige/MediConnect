import HeroSection from "@/components/Hero";
import AboutSection from "@/components/About";
import CategoriesSection from "@/components/Categories";
import ServicesSection from "@/components/Services";
import CallSection from "@/components/CallToAction";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


export default function Home() {
    return (
        <>
            <Header/>
            <section id="home">
                <HeroSection />
            </section>

            <section id="about">
                <AboutSection />
            </section>

            <section id="categories">
                <CategoriesSection />
            </section>

            <section id="services">
                <ServicesSection />
            </section>

            <section id="contact">
                <CallSection />
            </section>
            <Footer/>
        </>
    )
}