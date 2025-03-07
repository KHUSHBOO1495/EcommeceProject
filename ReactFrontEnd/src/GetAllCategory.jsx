import { useEffect, useState } from "react";

function GetAllCategory() {
    const apiUrl = "http://localhost:3000/category";
    const [data, setData] = useState([]);
    //   const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(res => setData(res))
    })

    const formatedData = data.map(d=>{
        return (
            <a href="category.html" className="nav-link swiper-slide text-center">
                <img src={d.image_url} className="rounded-circle" alt="Category Thumbnail" height={165} />
                <h4 class="fs-6 mt-3 fw-normal category-title">{d.category_name}</h4>
            </a>
        );
    })

    return (
    <>
        { formatedData }
    </>
    )
}

export default GetAllCategory;