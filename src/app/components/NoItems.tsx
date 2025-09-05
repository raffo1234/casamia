import PrimaryButton from "./PrimaryButton";

export default function NoItems() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-6">
        <p className="text-xl text-gray-500 font-light">
          No se encontraron propiedades.
        </p>
        <PrimaryButton href="/" title="Ir al Inicio" />
      </div>
    </div>
  );
}
