import DeleteUser from "@components//DeleteUser";
import EditUser from "@components/EditUser";
import { Icon } from "@iconify/react";

type Role = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  image_url: string;
  username: string;
  email: string;
  role_id: string;
  role: Role;
};

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <h1 className="mb-6 font-semibold text-lg block">Usuarios</h1>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
        }}
      >
        <a
          href="/admin/users/add"
          title="Agregar Usuario"
          className="border-dashed bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl p-4 flex hover:text-cyan-500 justify-center items-center"
        >
          <span className="text-center">
            <Icon
              icon="solar:add-square-broken"
              fontSize={24}
              className="mx-auto mb-2"
            />
            <span>Agregar Usuario</span>
          </span>
        </a>
        {users?.map(({ name, id, role, image_url }) => {
          return (
            <div
              key={id}
              className="border bg-white border-gray-200 hover:bg-gray-50 rounded-2xl p-4"
            >
              <img
                src={image_url}
                className="w-11 h-11 rounded-full mb-3 mx-auto"
                alt={name}
                title={name}
              />
              <div
                className="font-semibold w-full mb-1 text-center truncate"
                title={name}
              >
                {name}
              </div>
              <div className="text-sm text-gray-500 w-full text-center mb-4">
                {role.name}
              </div>
              <div className="flex gap-2 items-center justify-center">
                <EditUser userId={id} />
                <DeleteUser userId={id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
