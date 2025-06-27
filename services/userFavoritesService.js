import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Add an item to the user's favorites
export async function addUserFavorite(userId, itemId, itemType) {
  await addDoc(collection(db, "userFavorites"), {
    userId,
    itemId,
    itemType,
  });
}

//  Remove an item from the user's favorites
export async function removeUserFavorite(userId, itemId, itemType) {
  const q = query(
    collection(db, "userFavorites"),
    where("userId", "==", userId),
    where("itemId", "==", itemId),
    where("itemType", "==", itemType)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "userFavorites", document.id));
  });
}

// Search for a user's favorite items of a specific type
export async function getUserFavorites(userId, itemType) {
  const q = query(
    collection(db, "userFavorites"),
    where("userId", "==", userId),
    where("itemType", "==", itemType)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data().itemId);
}