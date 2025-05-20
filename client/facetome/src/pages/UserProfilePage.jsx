import NavBar from "../components/NavBar";
import UserPost from "../components/UserPosts";
import UserProfileForm from "../components/UserProfileForm";
import CreatePost from "../components/CreatePost";
const UserProfilePage = () => {
  return (
    <div>
      <NavBar />
      <div className="flex">
        <div className="flex justify-start pl-3">
          <UserProfileForm />
            
          <CreatePost />
        </div>
        <UserPost />
      </div>
    </div>
  );
};

export default UserProfilePage;
