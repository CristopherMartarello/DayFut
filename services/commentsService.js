import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const commentsRef = collection(db, "comments");

export const addComment = async ({ userId, userName, itemId, itemType, content }) => {
    return await addDoc(commentsRef, {
        userId,
        userName,
        itemId,
        itemType,
        content,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
};

export const deleteComment = async (commentId) => {
    return await deleteDoc(doc(db, "comments", commentId));
};

export const updateComment = async (commentId, newContent) => {
    return await updateDoc(doc(db, "comments", commentId), {
        content: newContent,
        updatedAt: Timestamp.now(),
    });
};

export const listenToComments = ({ itemId, itemType, callback }) => {
    const q = query(
        commentsRef,
        where("itemId", "==", itemId),
        where("itemType", "==", itemType),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(comments);
    });
};
