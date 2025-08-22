import toast from "react-hot-toast";

const deleteImage = async (id: string, table: string, column: string) => {
  try {
    const response = await fetch("/api/delete-image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // --- Optional: Add Authentication/Authorization Header ---
        // If your API route requires authentication (highly recommended for protected actions),
        // you would include a user's session token here. Example:
        // 'Authorization': `Bearer ${(await supabaseClient.auth.getSession())?.data.session?.access_token || ''}`
      },
      body: JSON.stringify({ id, table, column }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Server responded with status ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error during deletion process:", (error as Error).message);
    toast.error(
      `Deletion failed: ${
        (error as Error).message
      }. Please review the console for more details or try again.`
    );
  }
};

export default deleteImage;
