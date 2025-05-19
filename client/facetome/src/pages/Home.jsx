import AllPost from "../components/AllPost";
import CreatePost from "../components/CreatePost";
import NavBar from "../components/NavBar"

const Home = () => {
    return(
        <>
        <NavBar/>
        <CreatePost/>
        <AllPost/>
        </>
    );
}

export default Home;