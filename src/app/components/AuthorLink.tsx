import { CompanyType } from "@/types/companyType";
import { UserType } from "@/types/userType";
import Link from "next/link";
import Image from "next/image";

export default function AuthorLink({
  user,
  company,
}: {
  user?: UserType | undefined | null;
  company?: CompanyType | undefined | null;
}) {
  const author = company ? company : user;
  const href = company ? `/empresa/${company.slug}` : `/usuario/${user?.slug}`;

  if (!author) return null;

  return (
    <div className="flex mt-2 gap-3 items-center text-sm">
      <span>Por: </span>
      <Link href={href} title="" className="flex items-center-safe gap-3">
        <Image
          src={author.image_url}
          alt={author.name}
          className="rounded-full"
          height="32"
          width="32"
        />
        <span>{author.name}</span>
      </Link>
    </div>
  );
}
