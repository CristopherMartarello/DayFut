import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Adicionar time aos favoritos do usuário (com ID e nome)
export async function addUserTeam(userId, teamId, teamName) {
    await addDoc(collection(db, "userTeams"), {
        userId,
        teamId,
        teamName,
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

// Obter todos os times favoritados por um usuário (com ID e nome)
export async function getUserTeams(userId) {
    const q = query(
        collection(db, "userTeams"),
        where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
}
