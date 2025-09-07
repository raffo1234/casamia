import { CompanyType } from "./companyType";
import { PropertyType } from "./propertyType";
import { UserType } from "./userType";

export interface RawLikeType {
  property: Omit<PropertyType, "user" | "company"> & {
    user: UserType[];
    company: CompanyType[];
  };
}
