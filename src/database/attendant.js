import db from "./firebase";
import {
    getDoc, doc, updateDoc,
    getDocs, collection, query, where,
} from "firebase/firestore";

const TABLE = "attendant";

const updateAttendant = async (id, data) => {
    const ref = doc(db, TABLE, id);
    await updateDoc(ref, data);
};

const updatePretaskRecord = async (id, data) => {
    const ref = doc(db, TABLE, id);
    await updateDoc(ref, {
        pretaskRecord: data
    });
};

const getAttendant = async (id) => {
    const docRef = doc(db, TABLE, id);
    const d = await getDoc(docRef)
    return Object.assign({ id: d.id }, d.data())
};

const getAttendantByLogin = async (alias, username, password) => {
    const snapshot = await getDocs(query(collection(db, "attendant"),
        where("xp_alias", "==", alias),
        where("username", "==", username),
        where("password", "==", password),
    ));

    const attendants = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    if (attendants.length === 1) {
        return attendants[0]
    } else {
        return null;
    }
};

const getAttendants = async (alias) => {
    const snapshot = await getDocs(query(collection(db, "attendant"), where("xp_alias", "==", alias)));
    const attendants = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    return attendants;
};

export {
    updateAttendant,
    updatePretaskRecord,
    getAttendant,
    getAttendantByLogin,
    getAttendants,
}