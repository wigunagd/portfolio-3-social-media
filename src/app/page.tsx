'use client';

import { dummyPost } from "@/app/(homepage)/dummyPost";
import FeedLayout from "@/components/FeedLayout";
import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import { FeedPost } from "./(homepage)/pageType";
import BottomNavigationBar from "@/components/BottomNavigationBar";

const post: FeedPost[] = dummyPost;

export default function Home() {
  const authState = useAppSelector((state) => state.auth);
  const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "")

  return (
    <div className="flex min-h-screen justify-center font-sans bg-black">

      <NavigationBar
        isLoggedIn={isLoggedIn}
        loginName={authState.loginName}
        avatarUrl={authState.avatarUrl} />

      <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:px-0 mt-20 mb-30 md:mb-35">

        <section id="feed-section" className="flex flex-col gap-6 w-full max-w-150 mx-auto mt-10.75">

          {
            post.map(p => (
              <FeedLayout key={p.postId} post={p} />
            ))
          }

        </section>

      </main>

      <BottomNavigationBar page="home" />

    </div>
  );
}
