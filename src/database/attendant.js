import db from "./firebase";
import {
    getDoc, doc, updateDoc
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

export {
    updateAttendant,
    updatePretaskRecord,
    getAttendant,
}