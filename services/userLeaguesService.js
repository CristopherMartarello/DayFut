import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Adicionar liga aos favoritos
export async function addUserLeague(userId, leagueId) {
    await addDoc(collection(db, "userLeagues"), {
        userId,
        leagueId,
    });
}

// Remover liga dos favoritos
export async function removeUserLeague(userId, leagueId) {
    const q = query(
        collection(db, "userLeagues"),
        where("userId", "==", userId),
        where("leagueId", "==", leagueId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "userLeagues", document.id));
    });
}

// Buscar ligas favoritas do usuário
export async function getUserLeagues(userId) {
    const q = query(
        collection(db, "userLeagues"),
        where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().leagueId);
}
