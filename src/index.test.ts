import fetch from "node-fetch";

test.skip("works", async () => {
  const response = await fetch("https://api.github.com/users/github");
  const data = (await response.json()) as IGithubUser;

  console.log(data);
});

const response: IGithubUser = {
  login: "github",
  id: 9919,
  node_id: "MDEyOk9yZ2FuaXphdGlvbjk5MTk=",
  avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
  gravatar_id: "",
  type: "Organization",
  site_admin: false,
  name: "GitHub",
  company: null,
  blog: "https://github.com/about",
  location: "San Francisco, CA",
  email: null,
  hireable: null,
  bio: "How people build software.",
  twitter_username: null,
  public_repos: 409,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: "2008-05-11T04:37:31Z",
  updated_at: "2020-09-28T06:15:10Z",
};

interface IGithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: "";
  type: "Organization";
  site_admin: false;
  name: "GitHub";
  company: null;
  blog: "https://github.com/about";
  location: "San Francisco, CA";
  email: null;
  hireable: null;
  bio: "How people build software.";
  twitter_username: null;
  public_repos: 409;
  public_gists: 0;
  followers: 0;
  following: 0;
  created_at: "2008-05-11T04:37:31Z";
  updated_at: "2020-09-28T06:15:10Z";
  // ...
}
