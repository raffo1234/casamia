import EditPropertyInformation from "./EditPropertyInformation";
import PropertyTypes from "./PropertyTypologies";
import { Icon } from "@iconify/react";
import { useGlobalState } from "@lib/globalState";
import Tabs from "./Tabs";

export default function EditProperty({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const { setEditModalContent, setEditPropertyId, setEditModalOpen } =
    useGlobalState();

  const items = [
    {
      label: "General",
      children: (
        <EditPropertyInformation
          id={id}
          userId={userId}
          hideModal={() => setEditModalOpen(false)}
        />
      ),
    },
    {
      label: "Tipologias",
      children: <PropertyTypes propertyId={id} />,
    },
  ];

  const openEditView = () => {
    setEditPropertyId(id);
    setEditModalContent(<Tabs items={items} />);
    setEditModalOpen(true);
  };

  return (
    <button
      type="button"
      onClick={openEditView}
      className="rounded-full w-11 h-11 border-gray-100 hover:border-gray-200 transition-colors duration-500 border flex items-center justify-center"
    >
      <Icon icon="solar:clapperboard-edit-broken" fontSize={24} />
    </button>
  );
}
