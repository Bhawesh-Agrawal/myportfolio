import { usePosts } from "@/Components/StoreContext/postContext";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Editeditor = () => {
    const { posts, isLoading, hasMore, loadMore } = usePosts();
    const router = useRouter();

    // Updated: mutation to delete by title
    const deletePostByTitle = useMutation(api.deletePost.deletePostByTitle);

    const handleClick = (id: string) => {
        router.push(`/Project/${id}`);
    };

    const handleDelete = async (e: React.MouseEvent, title: string) => {
        e.stopPropagation(); // Prevent triggering row click
        const confirmed = window.confirm(`Are you sure you want to delete the post titled "${title}"?`);
        if (!confirmed) return;

        try {
            // Call mutation with title as string
            await deletePostByTitle({ title });
            alert("Post deleted successfully.");
            router.refresh(); // Refresh data after deletion
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete the post.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="border border-gray-300 rounded-md overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-4 font-semibold bg-gray-200 p-3 border-b border-gray-300 text-sm">
                    <span>Banner</span>
                    <span>Title</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                {/* Table Body */}
                {posts.map((post, index) => (
                    <div
                        onClick={() => handleClick(post._id)}
                        key={index}
                        className="grid grid-cols-4 items-center p-3 border-b border-gray-200 hover:bg-gray-50 text-sm"
                    >
                        <div>
                            <img
                                className="w-[70px] h-[40px] object-cover rounded"
                                src={post.bannerImage ? post.bannerImage : "blog banner.png"}
                                alt="Banner"
                            />
                        </div>
                        <div className="truncate">{post.title}</div>
                        <div className="col-span-2 text-right space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/Editor/${post._id}`);
                                }}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            >
                                Edit
                            </button>

                            <button
                                onClick={(e) => handleDelete(e, post.title)}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Editeditor;
