'use client';
import PostEditor from "@/app/Editor/PostEditor";
import Navbar from "@/Components/Navbar/page";
import { useState } from "react";
import Editeditor from "@/app/Editor/Editeditor";

export default function EditorPage() {
    const [edit, setEdit] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-row gap-4 p-4 justify-center items-center">
                <button
                    onClick={() => setEdit(false)}
                    disabled={!edit}
                    className={`px-4 py-2 rounded ${!edit ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    Post
                </button>
                <button
                    onClick={() => setEdit(true)}
                    disabled={edit}
                    className={`px-4 py-2 rounded ${edit ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
                >
                    Edit
                </button>
            </div>

            {!edit ? <PostEditor /> : <Editeditor />}
        </div>
    );
}
