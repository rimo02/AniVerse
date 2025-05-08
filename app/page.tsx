import HomeClient from "./home-client";
const Home = async () => {
  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-2">Discover Anime</h1>
      <HomeClient/>
    </div>
  );
}

export default Home