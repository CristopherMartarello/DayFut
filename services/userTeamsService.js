import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Adicionar time aos favoritos do usuário
export async function addUserTeam(userId, teamId) {
    await addDoc(collection(db, "userTeams"), {
        userId,
        teamId,
    });
}

// Remover time dos favoritos do usuário
export async function removeUserTeam(userId, teamId) {
    const q = query(
        collection(db, "userTeams"),
        where("userId", "==", userId),
        where("teamId", "==", teamId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "userTeams", document.id));
    });
}

// Obter todos os IDs de times favoritados por um usuário
export async function getUserTeams(userId) {
    const q = query(
        collection(db, "userTeams"),
        where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().teamId);
}
