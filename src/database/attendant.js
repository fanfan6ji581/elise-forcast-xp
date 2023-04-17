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

const getAttendants = async (alias) => {
    const snapshot = await getDocs(query(collection(db, "attendant"), where("xp_alias", "==", alias)));
    const attendants = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    return attendants;
};

export {
    updateAttendant,
    updatePretaskRecord,
    getAttendant,
    getAttendants,
}