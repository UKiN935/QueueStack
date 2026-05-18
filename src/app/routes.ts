import { createBrowserRouter } from "react-router";
import { Root } from "./components/root";
import { HomeFeed } from "./components/home-feed";
import { QuestionDetail } from "./components/question-detail";
import { Profile } from "./components/profile";
import { Bookmarks } from "./components/bookmarks";
import { AskQuestion } from "./components/ask-question"; 
import { Signup } from "./components/signup";
import { Login } from "./components/login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomeFeed },
      { path: "question/:id", Component: QuestionDetail },
      { path: "profile", Component: Profile },
      { path: "bookmarks", Component: Bookmarks },
      { path: "ask", Component: AskQuestion }, 
      { path: "signup", Component: Signup},
      { path: "login", Component: Login},
    ],
  },
]);
