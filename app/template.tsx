/** Each page fades in on navigation. (A first visit to the homepage is covered by the preloader.) */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[tc-page-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">{children}</div>;
}
