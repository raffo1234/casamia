import { CompanyType } from "@/types/companyType";
import { UserType } from "@/types/userType";
import Image from "next/image";

export default function AuthorLink({
  user,
  company,
}: {
  user?: UserType | null;
  company?: CompanyType | null;
}) {
  // Prefer company if it exists, otherwise fall back to user.
  const author = company ?? user;

  if (!author) {
    return null;
  }

  const isCompany = !!company;

  const href = isCompany ? `/empresa/${company.slug}` : `/usuario/${user?.slug}`;
  const authorName = isCompany ? company.name : `${user?.first_name} ${user?.last_name}`;
  const authorImage = isCompany ? company.image_url : user?.image_url;

  return (
    <div className="flex text-[#1e0059] gap-3 items-center text-xs">
      <span>Por:</span>
      <a href={href} title={authorName} className="flex items-center gap-3">
        {authorImage ? (
          <Image
            src={authorImage}
            alt={authorName}
            className="rounded-full"
            height={32}
            width={32}
          />
        ) : null}
        <span>{authorName}</span>
      </a>
    </div>
  );
}
