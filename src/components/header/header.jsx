import logo from "../../assets/logo.svg"
import { Link } from "react-router-dom";


export default function Header(){
    return(
     
    <header> <nav className="main-nav">
<div className="background-header">
<Link className="main-nav-item" to="/signin">
<a>Connexion</a>
</Link>
<img src={logo} alt="logo"/> 
<a>S'inscrire</a>
</div>
</nav>
</header>
    )
}

