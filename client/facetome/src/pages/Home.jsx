import AllPost from "../components/AllPost";
import CreatePost from "../components/CreatePost";
import NavBar from "../components/NavBar"

const Home = () => {
    return(
        <div className="flex flex-col">
        <NavBar/>
        <div className="flex justify-center">
        <CreatePost/>
        </div>
        
        <AllPost/>
        </div>
    );
}

export default Home;