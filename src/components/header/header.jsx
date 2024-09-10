import logo from "../../assets/logo.svg"
import { Link } from "react-router-dom";


export default function Header(){
    return(
     
    <header> <nav className="main-nav">
<div className="background-header">
<Link className="main-nav-item" to="/Login">
<p>Connexion</p>
</Link>
<Link className="main-nav-item" to="/Index">
<img src={logo} alt="logo"/> </Link>
<Link className="main-nav-item" to="/Signin">
<p>S'inscrire</p>
</Link>
</div>
</nav>
</header>
    )
}

