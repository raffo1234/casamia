"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { Permissions } from "@/types/propertyState";
import { useSettingValueBySlug } from "@/hooks/useSettingValueBySlug";
import useCheckPermission from "@/hooks/useCheckPermission";
import FormInputLabel from "./FormInputLabel";
import { RoleType } from "@/types/RoleType";
import FormSection from "./FormSection";

export default function SettingsContent({
  roles,
  userRoleId,
}: {
  userRoleId: string;
  roles: RoleType[] | null;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const [defaultSignupRole, loading] = useSettingValueBySlug(
    "default_signup_role"
  );
  const { hasPermission, isLoading } = useCheckPermission(
    userRoleId,
    Permissions.ADMINISTRAR_SETTINGS
  );

  if (!hasPermission) return null;

  const updateDefaultSignupRole = async (value: string) => {
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("global_setting")
        .update({ value })
        .eq("slug", "default_signup_role");

      if (error) {
        console.error("Ocurrió un error inesperado:", error);
        toast.error("Ocurrió un error inesperado.");
      } else {
        toast.success("Configuración guardada correctamente!");
      }
    } catch (error) {
      console.error("Ocurrió un error inesperado:", error);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsSaving(false);
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateDefaultSignupRole(event.target.value);
  };

  if (isLoading || loading) return "Loading";
  if (!defaultSignupRole) return null;

  return (
    <FormSection>
      <h2 className="font-semibold">Default Role on Sign Up</h2>
      <div className="grow-1 relative">
        <FormInputLabel htmlFor="name">Roles</FormInputLabel>
        <div className="relative">
          <select
            disabled={isSaving}
            defaultValue={defaultSignupRole}
            onChange={onChange}
            className="w-full disable:opacity-50 transition-colors duration-300 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500 bg-white"
          >
            {roles?.map(({ id, name }) => {
              return (
                <option value={id} key={id}>
                  {name}
                </option>
              );
            })}
          </select>
          <div className="absolute top-1/2 -translate-y-1/2 right-1 pr-3 pointer-events-none bg-white">
            <Icon icon="solar:alt-arrow-down-linear" fontSize={16} />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
