import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function GetAllCategory() {
    const apiUrl = "http://localhost:3000/category";
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token')
    //   const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(res => setData(res))
    }, [])

    const formatedData = data.map(d => {
        return (
            <Link to={"/category/"+d._id} className="nav-link swiper-slide text-center" style={{ cursor: "pointer" }}>
                <img src={d.image_url} className="rounded-circle" alt="Category Thumbnail" height={165} />
                <h4 className="fs-6 mt-3 fw-normal category-title">{d.category_name}</h4>
            </Link>
        );
    })

    return (
        <>
            {formatedData}
        </>
    )
}

export default GetAllCategory;