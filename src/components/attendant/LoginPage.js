import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { Grid, Alert, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import db from "../../database/firebase";
import { login } from "../../slices/attendantSlice";

const uiSchema = {
    "password": {
        "ui:widget": "password"
    },
    "ui:options": {
        "submitButtonOptions": {
            "props": {
                "className": "btn btn-info",
            },
            "norender": false,
            "submitText": "Login"
        }
    }
}

const LoginPage = () => {
    const { alias, username, password } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState('');

    const schema = {
        "type": "object",
        "properties": {
            "username": {
                "type": "string",
                "default": username,
                "title": "Email"
            },
            "password": {
                "type": "string",
                "default": password,
                "title": "Password"
            }
        },
        required: [
            "username",
            "password"
        ]
    };


    const onLogin = async ({ formData }, e) => {
        e.preventDefault();
        setErrorMsg('');
        const { username, password } = formData;

        const snapshot = await getDocs(query(collection(db, "attendant"),
            where("xp_alias", "==", alias),
            where("username", "==", username),
            where("password", "==", password),
        ));

        const attendants = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
        if (attendants.length === 1) {
            dispatch(login(attendants[0]));
            navigate(`/xp/${alias}/instruction1`)
        } else {
            setErrorMsg("Invalid login")
        }
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={8} sm={6} md={4} lg={3}>
                <br />
                <br />
                <Typography variant='h3' align="center">Guest Login</Typography >
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <Form schema={schema} uiSchema={uiSchema} onSubmit={onLogin} validator={validator} />
            </Grid>
        </Grid>
    )
}

export default LoginPage