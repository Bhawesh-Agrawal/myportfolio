import { use } from 'react';
import { Id } from "../../../../convex/_generated/dataModel";
import EditPostClient from './EditPostClient';

export default function EditPostPage({ params }: { params: Promise<{ id: Id<"blog"> }> }) {
    const { id } = use(params); // 👈 unwrap the promise

    return <EditPostClient id={id} />;
}
