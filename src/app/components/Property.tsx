import Typologies from "./Typologies";
import { Icon } from "@iconify/react";
import { PropertyPhase } from "@/types/propertyState";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Like from "./Like";
import GetInTouch from "./GetInTouch";
import PropertyImages from "./PropertyImages";
import Image from "next/image";
import { PropertyType } from "@/types/propertyType";

export default function Property({
  property,
  userEmail,
}: {
  property: PropertyType | null | undefined;
  userEmail: string | undefined | null;
}) {
  if (!property) return null;

  const {
    id,
    title,
    bathroom_count,
    bedroom_count,
    phase,
    delivery_at,
    price,
    location,
    company,
  } = property;

  return (
    <>
      <div className="mx-auto max-w-[1650px] w-full mb-6">
        <div className="mb-30 flex gap-3 justify-between items-center-safe">
          {company ? (
            <div className="flex gap-3 items-center-safe ">
              <span className="font-light">Por: </span>
              <a
                href={`/empresa/${company.id}`}
                title={company.name}
                className="flex text-lg items-center-safe gap-3"
              >
                <Image
                  src={company.logo_url}
                  alt={company.name}
                  className="rounded-full"
                  height="32"
                  width="32"
                />
                <span className="border-b-2 transition-colors hover:border-slate-300 border-slate-400">
                  {company.name}
                </span>
              </a>
            </div>
          ) : null}
          {company ? (
            <GetInTouch
              propertyId={id}
              companyName={company.name}
              companyLogo={company.logo_url}
              propertyTitle={property.title}
            />
          ) : null}
        </div>
        <div className="lg:flex items-center-safe">
          <div className="lg:w-1/2 lg:pr-20 mb-10 lg:mb-0">
            <h1
              className="font-flaviotte leading-tight mb-8"
              style={{
                fontSize: "clamp(60px,41.6901408451px + 3.661971831vw,112px)",
              }}
            >
              {title}
            </h1>
            <h2
              style={{
                margin: "clamp(20px,5vw,35px) 0 clamp(40px,5vw,70px) 0",
              }}
              className="text-lg font-light"
            >
              {location}
            </h2>
            <div className="border border-slate-300 rounded-xl">
              <table className="border-collapse border-spacing-0 w-full text-center">
                <thead>
                  <tr className="flex">
                    <th className="flex-1 border-r border-b border-slate-300 p-4 rounded-tl-lg">
                      <Icon
                        icon="ri:price-tag-3-line"
                        className="text-xl  inline-block"
                      />
                    </th>
                    <th className="flex-1 border-r border-b border-slate-300 p-4">
                      <Icon
                        icon="lucide:bed-double"
                        className="text-xl inline-block"
                      />
                    </th>
                    <th className="flex-1 border-r border-b border-slate-300 p-4">
                      <Icon
                        icon="lucide-lab:shower"
                        className="text-xl inline-block"
                      />
                    </th>
                    <th className="flex-1 border-b border-slate-300 p-4 rounded-tr-lg">
                      <Icon
                        icon="solar:calendar-linear"
                        className="text-xl inline-block"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="flex">
                    <td className="flex-1 border-r border-slate-300 p-4 rounded-bl-lg">
                      S/. {price}
                    </td>
                    <td className="flex-1 border-r border-slate-300 p-4">
                      {bedroom_count}
                    </td>
                    <td className="flex-1 border-r border-slate-300 p-4">
                      {bathroom_count}
                    </td>
                    <td className="flex-1 p-4 text-sm rounded-br-lg">
                      {phase === PropertyPhase.PLANOS ||
                      phase === PropertyPhase.CONSTRUCCION ? (
                        <span className="text-sm">
                          Entrega:{" "}
                          {delivery_at &&
                            format(new Date(delivery_at), "dd MMMM, yyyy", {
                              locale: es,
                            })}
                        </span>
                      ) : (
                        phase
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute top-0 left-0 z-10">
              <Like size={24} propertyId={id} userEmail={userEmail} />
            </div>
            <PropertyImages
              propertyTitle={property.title}
              propertyId={property.id}
            />
          </div>
        </div>
      </div>
      {property.description ? (
        <>
          <h3 className="mb-6 text-xl font-semibold">Conoce mas:</h3>
          <p className="leading-relaxed">{property.description}</p>
        </>
      ) : null}
      <Typologies propertyId={property.id} />
    </>
  );
}
