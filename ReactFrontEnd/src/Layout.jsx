import { Link, Outlet } from "react-router-dom";
import User from "./components/User";

function Layout() {
    return (
        <>
            <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasUser">
                <div className="offcanvas-header justify-content-center">
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {<User/>}
                </div>
            </div>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar">

                <div className="offcanvas-header justify-content-between">
                    <h4 className="fw-normal text-uppercase fs-6">Menu</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body">

                    <ul className="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                        <li className="nav-item border-dashed active">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#fruits"></use></svg>
                                <span>Fruits and vegetables</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#dairy"></use></svg>
                                <span>Dairy and Eggs</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#meat"></use></svg>
                                <span>Meat and Poultry</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#seafood"></use></svg>
                                <span>Seafood</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#bakery"></use></svg>
                                <span>Bakery and Bread</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#canned"></use></svg>
                                <span>Canned Goods</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#frozen"></use></svg>
                                <span>Frozen Foods</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#pasta"></use></svg>
                                <span>Pasta and Rice</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#breakfast"></use></svg>
                                <span>Breakfast Foods</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#snacks"></use></svg>
                                <span>Snacks and Chips</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <button className="btn btn-toggle dropdown-toggle position-relative w-100 d-flex justify-content-between align-items-center text-dark p-2" data-bs-toggle="collapse" data-bs-target="#beverages-collapse" aria-expanded="false">
                                <div className="d-flex gap-3">
                                    <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#beverages"></use></svg>
                                    <span>Beverages</span>
                                </div>
                            </button>
                            <div className="collapse" id="beverages-collapse">
                                <ul className="btn-toggle-nav list-unstyled fw-normal ps-5 pb-1">
                                    <li className="border-bottom py-2"><a href="index.html" className="dropdown-item">Water</a></li>
                                    <li className="border-bottom py-2"><a href="index.html" className="dropdown-item">Juice</a></li>
                                    <li className="border-bottom py-2"><a href="index.html" className="dropdown-item">Soda</a></li>
                                    <li className="border-bottom py-2"><a href="index.html" className="dropdown-item">Tea</a></li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#spices"></use></svg>
                                <span>Spices and Seasonings</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#baby"></use></svg>
                                <span>Baby Food and Formula</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#health"></use></svg>
                                <span>Health and Wellness</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#household"></use></svg>
                                <span>Household Supplies</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#personal"></use></svg>
                                <span>Personal Care</span>
                            </a>
                        </li>
                        <li className="nav-item border-dashed">
                            <a href="index.html" className="nav-link d-flex align-items-center gap-3 text-dark p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#pet"></use></svg>
                                <span>Pet Food and Supplies</span>
                            </a>
                        </li>
                    </ul>

                </div>

            </div>

            <header className="hstyle">
                <div className="container-fluid">
                    <div className="row py-3">

                        <div className="col-sm-4 col-lg-2 text-center text-sm-start d-flex gap-3 justify-content-center justify-content-md-start">
                            <div className="d-flex align-items-center my-3 my-sm-0">
                                <a href="index.html">
                                    <img src="images/logo.jpg" alt="logo" className="img-fluid" width="150" />
                                </a>
                            </div>
                            <button className="navbar-toggler mx-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                                aria-controls="offcanvasNavbar">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlinkHref="#menu"></use></svg>
                            </button>
                        </div>

                        <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-4">
                            <div className="search-bar row p-2 rounded-4">
                                <div className="col-md-4 d-none d-md-block">
                                    <select className="form-select border-0">
                                        <option>All Categories</option>
                                        <option>Groceries</option>
                                        <option>Drinks</option>
                                        <option>Chocolates</option>
                                    </select>
                                </div>
                                <div className="col-11 col-md-7">
                                    <form id="search-form" className="text-center" action="index.html" method="post">
                                        <input type="text" className="form-control border-0 bg-transparent" placeholder="Search products here..." />
                                    </form>
                                </div>
                                <div className="col-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <ul className="navbar-nav list-unstyled d-flex flex-row gap-3 gap-lg-5 justify-content-center flex-wrap align-items-center mb-0 fw-bold text-uppercase text-dark">
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle pe-3" role="button" id="pages" data-bs-toggle="dropdown" aria-expanded="false">Pages</a>
                                    <ul className="dropdown-menu border-0 p-3 rounded-0 shadow" aria-labelledby="pages">
                                        <li><a href="index.html" className="dropdown-item">About Us </a></li>
                                        <li><Link to="/product" className="dropdown-item">Shop </Link></li>
                                        <li><a href="index.html" className="dropdown-item">Single Product </a></li>
                                        <li><a href="index.html" className="dropdown-item">Cart </a></li>
                                        <li><a href="index.html" className="dropdown-item">Checkout </a></li>
                                        <li><a href="index.html" className="dropdown-item">Blog </a></li>
                                        <li><a href="index.html" className="dropdown-item">Single Post </a></li>
                                        <li><a href="index.html" className="dropdown-item">Styles </a></li>
                                        <li><a href="index.html" className="dropdown-item">Contact </a></li>
                                        <li><a href="index.html" className="dropdown-item">Thank You </a></li>
                                        <li><a href="index.html" className="dropdown-item">My Account </a></li>
                                        <li><a href="index.html" className="dropdown-item">404 Error </a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="col-sm-8 col-lg-2 d-flex gap-5 align-items-center justify-content-center justify-content-sm-end">
                            <ul className="d-flex justify-content-end list-unstyled m-0">
                                <li>
                                    <a href="#" className="p-2 mx-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser" aria-controls="offcanvasUser">
                                        <svg width="24" height="24"><use xlinkHref="#user"></use></svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="p-2 mx-1">
                                        <svg width="24" height="24"><use xlinkHref="#wishlist"></use></svg>
                                    </a>
                                </li>
                                <li>
                                    <Link to="/cart" className="p-2 mx-1">
                                        <svg width="24" height="24"><use xlinkHref="#shopping-bag"></use></svg>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </header>
            <Outlet />
        </>
    )
}

export default Layout;