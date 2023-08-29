import reactQueryFetcher from "../../utils/fetcher";

class Users {
  getUsers = async () => {
    return await reactQueryFetcher({
      //import it from vite env
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
    });
  };
}

export default new Users();
