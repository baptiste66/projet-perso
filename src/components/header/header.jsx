import logo from "../../assets/logo.svg"
import { Link } from "react-router-dom";


export default function Header(){
    return(
     
    <header> <nav className="main-nav">
<div className="background-header">
<Link className="main-nav-item" to="/Login">
<a>Connexion</a>
</Link>
<Link className="main-nav-item" to="/Index">
<img src={logo} alt="logo"/> </Link>
<Link className="main-nav-item" to="/Signin">
<a>S'inscrire</a>
</Link>
</div>
</nav>
</header>
    )
}

