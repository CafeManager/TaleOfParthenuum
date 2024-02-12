import { Link } from "react-router-dom";
import { useState } from "react";
import profileImage from "./static/Professional_Photo.jpg";

const INITIAL_DATA = {
    name: "",
};

function Home({ addName }) {
    const [formData, setFormData] = useState(INITIAL_DATA);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...setFormData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addName(formData);
        setFormData(INITIAL_DATA);
    };

    return (
        <div className="container-fluid">
            <div className="row align-items-center">
                
            </div>
        </div>
    );
}

export default Home;
