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
    slug,
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
      {company ? (
        <div className="flex items-center justify-between w-full px-6 py-4 pr-20 sm:px-14 bg-slate-100 rounded-t-3xl">
          <div className="flex gap-3 items-center-safe">
            <span className="font-light">Por: </span>
            <a
              href={`/empresa/${company.id}`}
              title={company.name}
              className="flex gap-3 text-lg items-center-safe"
            >
              <Image
                src={company.logo_url}
                alt={company.name}
                className="rounded-full"
                height="32"
                width="32"
              />
              <span className="transition-colors border-b-2 hover:border-slate-300 border-slate-400">
                {company.name}
              </span>
            </a>
          </div>
          <GetInTouch
            propertyId={id}
            companyName={company.name}
            companyLogo={company.logo_url}
            propertyTitle={property.title}
          />
        </div>
      ) : null}
      <div className="sm:px-6 px-4 md:px-14 sm:pt-30 pt-12">
        <div className="lg:flex items-center-safe">
          <div className="mb-10 lg:w-1/2 lg:pr-20 lg:mb-0">
            <h1
              className="mb-8 leading-tight font-flaviotte"
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
              <table className="w-full text-center border-collapse border-spacing-0">
                <thead>
                  <tr className="flex">
                    <th className="flex-1 p-4 border-b border-r rounded-tl-lg border-slate-300">
                      <Icon
                        icon="ri:price-tag-3-line"
                        className="inline-block text-xl"
                      />
                    </th>
                    <th className="flex-1 p-4 border-b border-r border-slate-300">
                      <Icon
                        icon="lucide:bed-double"
                        className="inline-block text-xl"
                      />
                    </th>
                    <th className="flex-1 p-4 border-b border-r border-slate-300">
                      <Icon
                        icon="lucide-lab:shower"
                        className="inline-block text-xl"
                      />
                    </th>
                    <th className="flex-1 p-4 border-b rounded-tr-lg border-slate-300">
                      <Icon
                        icon="solar:calendar-linear"
                        className="inline-block text-xl"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="flex">
                    <td className="flex-1 p-4 border-r rounded-bl-lg border-slate-300">
                      S/. {price}
                    </td>
                    <td className="flex-1 p-4 border-r border-slate-300">
                      {bedroom_count}
                    </td>
                    <td className="flex-1 p-4 border-r border-slate-300">
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
          <div className="relative lg:w-1/2">
            <div className="absolute top-0 left-0 z-10">
              <Like size={24} propertyId={id} userEmail={userEmail} />
            </div>
            <PropertyImages
              propertyTitle={title}
              propertyId={id}
              propertySlug={slug}
            />
          </div>
        </div>
        {property.description ? (
          <div className="pt-20">
            <h3 className="mb-6 text-sm text-slate-700">Conoce m&aacute;s</h3>
            <p className="text-3xl font-light leading-relaxed">
              {property.description}
            </p>
          </div>
        ) : null}
        <Typologies propertyId={property.id} />
      </div>
    </>
  );
}
