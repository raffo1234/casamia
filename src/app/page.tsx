import Header from "./components/Header";
import PropertiesList from "./components/PropertiesList";

const userEmail = "rhmcord@gmail.com";

export default function Home() {
  return (
    <>
      <Header />
      <h2
        style={{
          fontSize: "clamp(16px, 6vw + .5rem, 50px)",
        }}
        className="mb-10 leading-relaxed w-full text-center"
      >
        Encuentra tu próximo <br /> hogar
      </h2>
      <PropertiesList userEmail={userEmail} />
    </>
  );
}
